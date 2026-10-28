#!/usr/bin/env node
// 校验一份端到端任务记录（run-record.json）是否合格：字段齐、枚举对、三遍都有、介入事件和次数一致、没有凭据样子的东西。
// 零依赖。用法：node scripts/check-run-record.mjs <run-record.json> [...]   退出码 0 合格，1 不合格，2 用法错。
import { readFileSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

export const METHOD_VERSION = '0.1';
export const REASONS = ['登录', '验证码', '付费', '授权', '拍板', '看不懂', '出错恢复', '其他'];
export const OUTCOMES = ['完成', '部分完成', '失败', '未执行'];
const SECRET_RE = /(ghp_[A-Za-z0-9]{20,}|sk-[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|-----BEGIN [A-Z ]*PRIVATE KEY-----|Bearer\s+[A-Za-z0-9._-]{20,}|password\s*[:=]\s*\S+)/i;

export function checkRunRecord(rec, file = '<record>') {
  const errs = [];
  const need = (k, type) => {
    if (!(k in rec)) errs.push(`${k} 缺失`);
    else if (type && typeof rec[k] !== type) errs.push(`${k} 应是 ${type}`);
  };
  need('method_version', 'string');
  if (rec.method_version && rec.method_version !== METHOD_VERSION) errs.push(`method_version 应是 ${METHOD_VERSION}，现在是 ${rec.method_version}`);
  need('target', 'object');
  if (rec.target) {
    for (const k of ['name', 'url', 'kind']) if (typeof rec.target[k] !== 'string' || !rec.target[k]) errs.push(`target.${k} 缺失`);
  }
  need('task', 'object');
  if (rec.task) {
    for (const k of ['goal', 'done_when']) if (typeof rec.task[k] !== 'string' || !rec.task[k]) errs.push(`task.${k} 缺失（任务要有完成判据）`);
  }
  need('agent', 'object');
  if (rec.agent) for (const k of ['harness', 'model']) if (typeof rec.agent[k] !== 'string') errs.push(`agent.${k} 缺失`);
  need('tested_at', 'string');
  if (rec.tested_at && !/^\d{4}-\d{2}-\d{2}$/.test(rec.tested_at)) errs.push('tested_at 要是 YYYY-MM-DD');
  if (!Array.isArray(rec.runs)) errs.push('runs 缺失或不是数组');
  else {
    if (rec.runs.length < 3) errs.push(`runs 要跑三遍，现在 ${rec.runs.length} 遍（跑不满三遍要在 notes 里说为什么）`);
    rec.runs.forEach((r, i) => {
      const p = `runs[${i}]`;
      if (!OUTCOMES.includes(r.outcome)) errs.push(`${p}.outcome 只能是 ${OUTCOMES.join('/')}`);
      for (const k of ['total_minutes', 'steps', 'human_minutes', 'wait_minutes']) {
        if (typeof r[k] !== 'number' || r[k] < 0) errs.push(`${p}.${k} 要是非负数字`);
      }
      if (!Array.isArray(r.interventions)) errs.push(`${p}.interventions 缺失或不是数组`);
      else {
        r.interventions.forEach((ev, j) => {
          if (!REASONS.includes(ev.reason)) errs.push(`${p}.interventions[${j}].reason 只能是 ${REASONS.join('/')}`);
          if (typeof ev.step !== 'string' || !ev.step) errs.push(`${p}.interventions[${j}].step 缺失`);
          if (typeof ev.minutes !== 'number' || ev.minutes < 0) errs.push(`${p}.interventions[${j}].minutes 要是非负数字`);
        });
        const sum = r.interventions.reduce((a, ev) => a + (Number(ev.minutes) || 0), 0);
        if (typeof r.human_minutes === 'number' && Math.abs(sum - r.human_minutes) > 0.01) errs.push(`${p}.human_minutes(${r.human_minutes}) 和介入事件分钟之和(${sum}) 不一致`);
        if (typeof r.human_minutes === 'number' && typeof r.total_minutes === 'number' && r.human_minutes > r.total_minutes) errs.push(`${p}.human_minutes 不能大于 total_minutes`);
      }
    });
  }
  if (!Array.isArray(rec.baseline_refs)) errs.push('baseline_refs 缺失或不是数组（没用到也写 []）');
  if (!Array.isArray(rec.evidence) || rec.evidence.length === 0) errs.push('evidence 至少一条');
  else rec.evidence.forEach((e, i) => { if (typeof e.what !== 'string' || typeof e.where !== 'string') errs.push(`evidence[${i}] 要有 what 和 where`); });
  const raw = JSON.stringify(rec);
  if (SECRET_RE.test(raw)) errs.push('记录里有像密钥、token 或密码的东西，去掉再提交');
  return errs.map((e) => `${file}: ${e}`);
}

export function summarize(rec) {
  const runs = rec.runs ?? [];
  const med = (arr) => { const s = arr.slice().sort((a, b) => a - b); return s.length ? s[Math.floor((s.length - 1) / 2)] : null; };
  const done = runs.filter((r) => r.outcome === '完成').length;
  return {
    completion_rate: runs.length ? Math.round((done / runs.length) * 100) : null,
    median_total_minutes: med(runs.map((r) => r.total_minutes)),
    median_human_minutes: med(runs.map((r) => r.human_minutes)),
    median_interventions: med(runs.map((r) => (r.interventions ?? []).length)),
    median_steps: med(runs.map((r) => r.steps)),
  };
}

function main(argv) {
  if (argv.length === 0) { console.error('用法：node scripts/check-run-record.mjs <run-record.json> [...]'); return 2; }
  let bad = 0;
  for (const f of argv) {
    if (!existsSync(f)) { console.error(`找不到 ${f}`); bad++; continue; }
    let rec;
    try { rec = JSON.parse(readFileSync(f, 'utf8').replace(/^\uFEFF/, '')); } catch (e) { console.error(`${f}: JSON 解析失败：${e.message}`); bad++; continue; }
    const errs = checkRunRecord(rec, f);
    if (errs.length) { bad++; errs.forEach((e) => console.error(e)); }
    else console.log(`${f}: 合格 ${JSON.stringify(summarize(rec))}`);
  }
  return bad ? 1 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main(process.argv.slice(2));
}
