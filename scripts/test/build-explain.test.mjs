// 讲解片生成的测试：数据、故事稿校验、占位填数、出片。零依赖：node --test scripts/test/*.test.mjs
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildData, validateStory, resolveStory, fillTemplate, SCENES, REPO_URL } from '../build-explain.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const ROOT = join(here, '..', '..');
const TEMPLATE = readFileSync(join(ROOT, 'docs', 'explain', 'template.html'), 'utf8');
const data = buildData(ROOT);
const load = (lang) => JSON.parse(readFileSync(join(ROOT, 'docs', 'explain', 'stories', `default.${lang}.json`), 'utf8'));

test('数据：卡数、已评数、基线数与仓一致；日期取卡片最新复核日', () => {
  assert.equal(data.repo, REPO_URL);
  assert.equal(data.counts.rated + data.counts.unrated, data.counts.cards);
  assert.ok(data.counts.baseline >= 20);
  assert.match(data.generated_at, /^\d{4}-\d{2}-\d{2}$/);
});

test('自带两份故事稿和 skill 里的示例故事稿都合格', () => {
  for (const lang of ['zh', 'en']) assert.deepEqual(validateStory(load(lang), data).errors, [], lang);
  const ex = JSON.parse(readFileSync(join(ROOT, 'skills', 'explain-cosmic-tree', 'examples', 'story.example.zh.json'), 'utf8'));
  assert.deepEqual(validateStory(ex, data).errors, [], 'example');
});

test('播放器：停顿不受"减少动态效果"影响（否则旁白几秒闪完）', () => {
  const sleepDef = TEMPLATE.match(/const sleep = [^\n]*\n[^\n]*\n[^\n]*\n[^\n]*/)[0];
  assert.ok(!sleepDef.includes('RM'), sleepDef);
});

test('故事稿：手写分数、手写卡数、冒号、不认识的场景和卡都被拦', () => {
  const base = load('zh');
  const bad = structuredClone(base);
  bad.beats[0].lines[0] = '它的友好指数是 85 分';
  bad.beats[1].lines[0] = '现在有 45 张卡';
  bad.beats[2].lines[0] = '结论：进不去';
  bad.beats[3].scene = 'fireworks';
  bad.beats[4].lines[0] = '{f:no-such-card}';
  const { errors } = validateStory(bad, data);
  assert.ok(errors.some((e) => e.includes('分数不许手写')));
  assert.ok(errors.some((e) => e.includes('卡数不许手写')));
  assert.ok(errors.some((e) => e.includes('冒号')));
  assert.ok(errors.some((e) => e.includes('fireworks')));
  assert.ok(errors.some((e) => e.includes('no-such-card')));
});

test('故事稿：没有讲宇宙之树是什么的那一段就不合格', () => {
  const s = load('zh');
  s.beats = s.beats.filter((b) => !['cards-stack', 'tree'].includes(b.scene));
  assert.ok(validateStory(s, data).errors.some((e) => e.includes('讲清宇宙之树是什么')));
});

test('占位填成仓里的数，称呼能覆盖', () => {
  const r = resolveStory(load('zh'), data, '老张');
  const all = JSON.stringify(r);
  assert.ok(!/\{(cards|rated|f:|a:)/.test(all));
  assert.equal(r.audience.name, '老张');
  const card = data.platforms.find((p) => p.slug === 'opc-cosmic-tree');
  assert.ok(all.includes(`${card.friendliness} 分`));
});

test('出片：故事稿和数据都进了页面，页面脚本能解析，没有外部请求', () => {
  const html = fillTemplate(TEMPLATE, resolveStory(load('en'), data), data);
  const blocks = [...html.matchAll(/type="application\/json">([\s\S]*?)<\/script>/g)].map((m) => m[1]);
  assert.equal(blocks.length, 2);
  for (const b of blocks) { assert.ok(!b.includes('<')); JSON.parse(b); }
  assert.equal(JSON.parse(blocks[0]).lang, 'en');
  assert.ok(html.includes('<html lang="en">'));
  for (const m of html.matchAll(/<script>([\s\S]*?)<\/script>/g)) new Function(m[1]);
  assert.equal((html.match(/<(script|link|img)[^>]+(src|href)="https?:/g) || []).length, 0);
});

test('播放器里的场景和脚本登记的场景一一对应', () => {
  for (const name of Object.keys(SCENES)) assert.ok(TEMPLATE.includes(`'${name}':`) || TEMPLATE.includes(`${name}:`), name);
});
