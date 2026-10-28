// 基线库校验与端到端任务记录校验的测试。零依赖：node --test scripts/test/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateSources, renderGenerated, KINDS } from '../build-baseline.mjs';
import { checkRunRecord, summarize } from '../check-run-record.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..', '..');

const goodSource = {
  id: 'example', name: 'Example', name_zh: '示例', home: 'https://example.org', kind: '开发者文档', what: '一句话',
  free: '免费', region: '全球', cn_reach: '未知', cn_reach_why: '没查', agent_entry: ['仅网页'], llms_txt: '404',
  automation_terms: '未提', authority: { tier: 1, why: '官方自己出' },
  evidence: [{ claim: 'robots 无禁', url: 'https://example.org/robots.txt', quote: '', date: '2026-10-28' }], checked_at: '2026-10-28',
};

test('基线：合法条目通过，坏枚举、重复 id、缺理由被拦', () => {
  assert.deepEqual(validateSources([goodSource]), []);
  const bad = [
    { ...goodSource, id: 'Bad_ID' },
    { ...goodSource, kind: '游戏' },
    { ...goodSource, authority: { tier: 4, why: 'x' } },
    { ...goodSource, authority: { tier: 1, why: '' } },
    { ...goodSource, agent_entry: ['有机器人账号'] },
    { ...goodSource },
  ];
  const errs = validateSources(bad);
  assert.ok(errs.some((e) => e.includes('id 要是')));
  assert.ok(errs.some((e) => e.includes('kind')));
  assert.ok(errs.some((e) => e.includes('tier')));
  assert.ok(errs.some((e) => e.includes('why')));
  assert.ok(errs.some((e) => e.includes('agent_entry')));
  assert.ok(errs.some((e) => e.includes('id 重复')));
});

test('基线：仓里的 sources.json 合法，且每个类别都在表里', () => {
  const list = JSON.parse(readFileSync(join(ROOT, 'baseline', 'sources.json'), 'utf8'));
  assert.deepEqual(validateSources(list), []);
  assert.ok(list.length >= 20);
  for (const s of list) assert.ok(KINDS.includes(s.kind));
  const out = renderGenerated(list);
  assert.ok(out.includes('### 一级 一手权威'));
  assert.ok(out.includes(`共 ${list.length} 个源`));
});

const goodRecord = {
  method_version: '0.1',
  target: { name: 'X', url: 'https://x', kind: '开发者文档' },
  task: { goal: '读', done_when: '看到正文' },
  agent: { harness: 'h', model: 'm' },
  tested_at: '2026-10-28',
  runs: [
    { outcome: '完成', total_minutes: 2, steps: 3, interventions: [{ step: '登录', reason: '登录', minutes: 1 }], human_minutes: 1, wait_minutes: 0 },
    { outcome: '完成', total_minutes: 1, steps: 3, interventions: [], human_minutes: 0, wait_minutes: 0 },
    { outcome: '失败', total_minutes: 1, steps: 2, interventions: [], human_minutes: 0, wait_minutes: 5 },
  ],
  baseline_refs: [],
  evidence: [{ what: '日志', where: 'x/log.txt' }],
};

test('任务记录：合格记录通过并算出中位数', () => {
  assert.deepEqual(checkRunRecord(goodRecord), []);
  const s = summarize(goodRecord);
  assert.equal(s.completion_rate, 67);
  assert.equal(s.median_total_minutes, 1);
  assert.equal(s.median_human_minutes, 0);
  assert.equal(s.median_interventions, 0);
});

test('任务记录：介入分钟不一致、原因乱写、不满三遍、带 token 被拦', () => {
  const r1 = structuredClone(goodRecord); r1.runs[0].human_minutes = 5;
  assert.ok(checkRunRecord(r1).some((e) => e.includes('不一致')));
  const r2 = structuredClone(goodRecord); r2.runs[0].interventions[0].reason = '人闸';
  assert.ok(checkRunRecord(r2).some((e) => e.includes('reason')));
  const r3 = structuredClone(goodRecord); r3.runs = r3.runs.slice(0, 2);
  assert.ok(checkRunRecord(r3).some((e) => e.includes('三遍')));
  const r4 = structuredClone(goodRecord); r4.notes = 'token ghp_abcdefghijklmnopqrstuvwxyz0123456789';
  assert.ok(checkRunRecord(r4).some((e) => e.includes('密钥')));
});

test('任务记录：仓里两份自评记录合格', () => {
  for (const d of ['2026-10-28-opc-cosmic-tree', '2026-10-28-opc-novel-game-web']) {
    const rec = JSON.parse(readFileSync(join(ROOT, 'evidence', d, 'run-record.json'), 'utf8'));
    assert.deepEqual(checkRunRecord(rec, d), []);
  }
});
