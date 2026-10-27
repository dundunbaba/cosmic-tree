// 跑法：node --test scripts/test/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, mkdtempSync, copyFileSync, writeFileSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  REPO_ROOT,
  CardError,
  parseFrontMatter,
  parseTags,
  validateCard,
  loadCards,
  rank,
  quadrant,
  friendlinessGrade,
  antiGrade,
  renderGenerated,
  injectGenerated,
  START_MARK,
  END_MARK,
} from '../build-readme.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const FIX = join(here, 'fixtures');
const SCRIPT = resolve(here, '..', 'build-readme.mjs');
const TAGS_FILE = join(REPO_ROOT, 'tags.md');
const tags = parseTags(readFileSync(TAGS_FILE, 'utf8'));

function card(file) {
  const path = join(FIX, 'bad', file);
  return validateCard(parseFrontMatter(readFileSync(path, 'utf8'), path), tags, path);
}

// ---------- front-matter 解析 ----------

test('parseFrontMatter：字符串、数组、null、数字、嵌套对象、行尾注释', () => {
  const text = readFileSync(join(FIX, 'ok', 'alpha.md'), 'utf8');
  const fm = parseFrontMatter(text, 'alpha.md');
  assert.equal(fm.data.name, 'Alpha Dev');
  assert.deepEqual(fm.data.aliases, ['alpha.example']);
  assert.equal(fm.data.region, '全球');
  assert.ok(Array.isArray(fm.data.tags));
  assert.equal(fm.data.tags[0], '开发者平台');
  assert.equal(fm.data.friendliness_index, 88); // 行尾注释被去掉
  assert.equal(typeof fm.data.friendliness_index, 'number');
  assert.equal(fm.data.anti_agent_index, 10);
  assert.equal(fm.data.last_reviewed, '2026-10-25'); // 日期保持字符串
  assert.deepEqual(fm.data.links, { home: 'https://alpha.example', docs: 'https://alpha.example/docs' });
  assert.equal(fm.lines.friendliness_index, 6);
});

test('parseFrontMatter：null 与空数组', () => {
  const fm = parseFrontMatter(readFileSync(join(FIX, 'ok', 'epsilon.md'), 'utf8'), 'epsilon.md');
  assert.equal(fm.data.friendliness_index, null);
  assert.equal(fm.data.anti_agent_index, null);
  assert.deepEqual(fm.data.aliases, []);
});

test('parseFrontMatter：带 BOM 和 CRLF 也能读', () => {
  const fm = parseFrontMatter('﻿---\r\nname: X\r\ntags: [工具]\r\nfriendliness_index: 5\r\nanti_agent_index: null\r\n---\r\n# X\r\n');
  assert.equal(fm.data.name, 'X');
  assert.equal(fm.data.friendliness_index, 5);
  assert.equal(fm.data.anti_agent_index, null);
});

test('parseFrontMatter：没有 front-matter 返回 null；没结束线报错', () => {
  assert.equal(parseFrontMatter('# 只是标题\n'), null);
  assert.throws(() => parseFrontMatter('---\nname: X\n'), CardError);
});

// ---------- tags.md ----------

test('parseTags：读出组和标签', () => {
  assert.equal(tags.tagToGroup.get('开发者平台'), '类型');
  assert.equal(tags.tagToGroup.get('国内受限'), '国内可达');
  assert.equal(tags.tagToGroup.get('已评'), '指数状态');
  assert.ok(tags.groups.get('类型').includes('电商'));
  assert.equal(tags.tagToGroup.has('很友好'), false);
});

// ---------- 校验 ----------

test('validateCard：非法标签报错，带文件和行号', () => {
  assert.throws(
    () => card('bad-tag.md'),
    (err) => err instanceof CardError && err.line === 5 && /bad-tag\.md:5/.test(err.message) && /很友好/.test(err.message),
  );
});

test('validateCard：指数超范围、非整数、字符串都报错，行号对', () => {
  assert.throws(() => card('bad-index-range.md'), (e) => e instanceof CardError && e.line === 6 && /friendliness_index/.test(e.message));
  assert.throws(() => card('bad-index-float.md'), (e) => e instanceof CardError && e.line === 7 && /anti_agent_index/.test(e.message));
  assert.throws(() => card('bad-index-string.md'), (e) => e instanceof CardError && e.line === 6);
});

test('loadCards：读全部样例卡，跳过 README.md', () => {
  const cards = loadCards(join(FIX, 'ok'), tags);
  assert.deepEqual(cards.map((c) => c.slug).sort(), ['alpha', 'beta', 'delta', 'epsilon', 'gamma']);
});

// ---------- 榜单排序 ----------

test('rank：最友好榜按 friendliness_index 降序，只含已评', () => {
  const cards = loadCards(join(FIX, 'ok'), tags);
  const r = rank(cards, 'friendliness');
  assert.deepEqual(r.map((c) => c.slug), ['alpha', 'beta', 'gamma', 'delta']);
  assert.equal(cards.length - r.length, 1); // epsilon 未评
});

test('rank：最反智能体榜按 anti_agent_index 降序', () => {
  const cards = loadCards(join(FIX, 'ok'), tags);
  assert.deepEqual(rank(cards, 'anti').map((c) => c.slug), ['delta', 'beta', 'gamma', 'alpha']);
});

test('等级：友好 A/B/C/D，反智能体 开放/设防/戒备/敌对/封锁', () => {
  assert.equal(friendlinessGrade(85), 'A 丝滑');
  assert.equal(friendlinessGrade(84), 'B 顺畅');
  assert.equal(friendlinessGrade(70), 'B 顺畅');
  assert.equal(friendlinessGrade(69), 'C 勉强');
  assert.equal(friendlinessGrade(50), 'C 勉强');
  assert.equal(friendlinessGrade(49), 'D 不友好');
  assert.equal(antiGrade(0), '开放');
  assert.equal(antiGrade(19), '开放');
  assert.equal(antiGrade(20), '设防');
  assert.equal(antiGrade(40), '戒备');
  assert.equal(antiGrade(60), '敌对');
  assert.equal(antiGrade(80), '封锁');
  assert.equal(antiGrade(100), '封锁');
});

// ---------- 四格归类 ----------

test('quadrant：四格归类，未评不入格，边界按 ≥50 / ≥40', () => {
  const q = (friendliness, anti) => quadrant({ friendliness, anti });
  assert.equal(q(88, 10), '开放场');
  assert.equal(q(62, 71), '围墙花园');
  assert.equal(q(30, 20), '荒地');
  assert.equal(q(20, 85), '堡垒');
  assert.equal(q(50, 39), '开放场'); // 友好刚到 50 算高，反 39 算低
  assert.equal(q(50, 40), '围墙花园'); // 反刚到 40 算高
  assert.equal(q(49, 40), '堡垒');
  assert.equal(q(null, 10), null);
  assert.equal(q(60, null), null);
});

// ---------- 渲染与回填 ----------

test('renderGenerated：三块都在，未评计数对', () => {
  const cards = loadCards(join(FIX, 'ok'), tags);
  const out = renderGenerated(cards, tags);
  assert.match(out, /## 平台总表/);
  assert.match(out, /### 电商（2）/);
  assert.match(out, /## 最友好榜/);
  assert.match(out, /\| 1 \| \[Alpha Dev\]\(platforms\/alpha\.md\) \| 88 \| A 丝滑 \|/);
  assert.match(out, /## 最反智能体榜/);
  assert.match(out, /\| 1 \| \[Delta Mall\]\(platforms\/delta\.md\) \| 85 \| 封锁 \|/);
  assert.match(out, /未评 1 个/);
  assert.match(out, /## 四格图/);
  assert.match(out, /围墙花园 Walled garden：\[Beta Social\]/);
  assert.match(out, /未入格 1 个/);
});

test('renderGenerated：没有卡也能生成', () => {
  const out = renderGenerated([], tags);
  assert.match(out, /暂无平台卡/);
  assert.match(out, /未评 0 个/);
});

test('injectGenerated：只换标记之间，缺标记报错', () => {
  const readme = '前\n' + START_MARK + '\n旧\n' + END_MARK + '\n后\n';
  const next = injectGenerated(readme, '新\n');
  assert.equal(next, '前\n' + START_MARK + '\n新\n' + END_MARK + '\n后\n');
  assert.throws(() => injectGenerated('没有标记', '新\n'), /缺/);
});

// ---------- 命令行端到端 ----------

function run(args) {
  const r = spawnSync(process.execPath, [SCRIPT, ...args], { encoding: 'utf8' });
  return { code: r.status, out: r.stdout, err: r.stderr };
}

test('CLI：生成、--check 通过；改动后 --check 退出码 1', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cosmic-tree-test-'));
  const readme = join(dir, 'README.md');
  copyFileSync(join(FIX, 'README.template.md'), readme);
  const common = ['--platforms', join(FIX, 'ok'), '--tags', TAGS_FILE, '--readme', readme];

  const stale = run(['--check', ...common]);
  assert.equal(stale.code, 1, '旧模板应判为过期');

  const build = run(common);
  assert.equal(build.code, 0, build.err);
  const text = readFileSync(readme, 'utf8');
  assert.match(text, /^# 测试用 README 模板/);
  assert.match(text, /下面也是手写部分，脚本不动。\n$/);
  assert.match(text, /## 最友好榜/);
  assert.doesNotMatch(text, /这里的旧内容/);

  const ok = run(['--check', ...common]);
  assert.equal(ok.code, 0, ok.err);

  writeFileSync(readme, text.replace('| 88 |', '| 99 |'), 'utf8');
  const changed = run(['--check', ...common]);
  assert.equal(changed.code, 1);
});

test('CLI：非法卡退出码 1，报文件和行', () => {
  const dir = mkdtempSync(join(tmpdir(), 'cosmic-tree-test-'));
  const readme = join(dir, 'README.md');
  copyFileSync(join(FIX, 'README.template.md'), readme);
  const r = run(['--platforms', join(FIX, 'bad'), '--tags', TAGS_FILE, '--readme', readme]);
  assert.equal(r.code, 1);
  assert.match(r.err, /bad-index-float\.md:7|bad-index-range\.md:6|bad-index-string\.md:6|bad-tag\.md:5/);
});

test('CLI：参数错退出码 2', () => {
  assert.equal(run(['--什么']).code, 2);
});
