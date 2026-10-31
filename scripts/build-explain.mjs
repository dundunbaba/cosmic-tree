#!/usr/bin/env node
// 讲解片生成：故事稿（JSON）＋仓里的数据 → 一页能自己播的动画（docs/explain/template.html 播放器）。零依赖。
//
// 用法：
//   node scripts/build-explain.mjs --story <故事稿.json> [--name 主人称呼] --out <输出.html>   校验后出片
//   node scripts/build-explain.mjs --check-story <故事稿.json>                                 只校验故事稿，打印问题
//   node scripts/build-explain.mjs --defaults                                                  重新生成仓里自带的两部成片
//   node scripts/build-explain.mjs --check                                                     自带故事稿合法、两部成片是最新的
//   node scripts/build-explain.mjs --data-only                                                 打印数据 JSON
//   加 --audio <目录>：把目录里 b<段号>-<句号>.mp3（从 1 数，如 b1-2.mp3）嵌进对应那句旁白；缺的句子退回字幕
// 故事稿里的数字一律用占位：{cards} {rated} {unrated} {baseline} {name} {f:slug} {a:slug} {pname:slug} {status:slug}。
// 退出码：0 成功；1 故事稿不合法或成片过期；2 用法或文件缺失。
import { readFileSync, writeFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';
import { REPO_ROOT, parseTags, loadCards, quadrant } from './build-readme.mjs';

export const REPO_URL = 'https://github.com/dundunbaba/cosmic-tree';
export const STORY_VERSION = '0.1';
const EXPLAIN_DIR = join(REPO_ROOT, 'docs', 'explain');
export const DEFAULTS = [
  // 仓里的成片只放字幕版：免费配音走的是微软朗读服务，能不能随公开仓再分发没写清（CEO 2026-10-31 同意按此处理）。
  // 本机配好了音，就另出一份带声音的到 docs/explain/out/，不进仓库。
  { story: join(EXPLAIN_DIR, 'stories', 'default.zh.json'), out: join(EXPLAIN_DIR, 'cosmic-tree-story.zh.html'), audio: join(EXPLAIN_DIR, 'out', 'audio', 'zh'), voiced: join(EXPLAIN_DIR, 'out', 'cosmic-tree-story.zh.voiced.html') },
  { story: join(EXPLAIN_DIR, 'stories', 'default.en.json'), out: join(EXPLAIN_DIR, 'cosmic-tree-story.en.html'), audio: join(EXPLAIN_DIR, 'out', 'audio', 'en'), voiced: join(EXPLAIN_DIR, 'out', 'cosmic-tree-story.en.voiced.html') },
];

// 场景：名字 → 必填参数。和 template.html 里的 SCENES 一一对应；动作个数决定每句旁白配哪个动作（见 skills/explain-cosmic-tree/scenes.md）。
export const SCENES = {
  desk: { required: ['bubble'], acts: 3 },
  'web-open': { required: ['site', 'title'], acts: 3 },
  'web-blocked': { required: ['site', 'code'], acts: 3 },
  'side-door': { required: ['main', 'side'], acts: 3 },
  'ask-owner': { required: ['site', 'button', 'ask', 'answer'], acts: 5 },
  'cards-stack': { required: [], acts: 3 },
  'two-scores': { required: ['platform'], acts: 3 },
  'time-cost': { required: [], acts: 3 },
  notes: { required: ['title', 'items'], acts: null },
  'task-chain': { required: ['site', 'paths'], acts: null },
  'submit-check': { required: [], acts: 5 },
  'practice-page': { required: ['title', 'items', 'added'], acts: null },
  tree: { required: [], acts: 3 },
};
const WHAT_IT_IS = ['cards-stack', 'tree'];
const BANNED_ZH = ['说白了', '意味着', '本质上', '换句话说', '不可否认', '综上所述', '总的来说', '值得注意', '不难发现', '让我们来', '接下来让我们'];
const LIMITS = { zh: { line: 48, total: 2400 }, en: { line: 170, total: 7000 } };

function stripBom(s) { return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s; }

export function buildData(root = REPO_ROOT) {
  const tags = parseTags(readFileSync(join(root, 'tags.md'), 'utf8'));
  const cards = loadCards(join(root, 'platforms'), tags);
  const baselinePath = join(root, 'baseline', 'sources.json');
  const baseline = existsSync(baselinePath) ? JSON.parse(stripBom(readFileSync(baselinePath, 'utf8'))).length : 0;
  const platforms = cards.map((c) => ({
    slug: c.slug, name: c.name,
    type: c.tags.find((t) => tags.tagToGroup.get(t) === '类型') ?? '',
    friendliness: c.friendliness, anti: c.anti, status: c.indexStatus ?? '未评', quadrant: quadrant(c),
  }));
  const rated = platforms.filter((p) => p.friendliness !== null && p.anti !== null).length;
  // 数据日期取卡片里最新的复核日，不取今天，这样同一份数据每天生成的成片一模一样
  const dates = cards.map((c) => String(c.lastReviewed ?? '')).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d)).sort();
  return {
    generated_at: dates.length ? dates[dates.length - 1] : '',
    repo: REPO_URL,
    counts: { cards: platforms.length, rated, unrated: platforms.length - rated, baseline },
    platforms,
  };
}

// 把占位换成仓里的数；不认识的占位记成错误
export function resolveText(text, data, name, errors, where) {
  const bySlug = (slug) => data.platforms.find((p) => p.slug === slug);
  return String(text).replace(/\{([a-z]+)(?::([a-z0-9-]+))?\}/g, (m, key, slug) => {
    if (!slug) {
      if (key === 'name') return name || (data.__lang === 'en' ? 'you' : '你');
      if (key in data.counts) return String(data.counts[key]);
      errors.push(`${where}: 不认识的占位 ${m}`); return m;
    }
    const p = bySlug(slug);
    if (!p) { errors.push(`${where}: ${m} 里的 ${slug} 不是现有卡`); return m; }
    if (key === 'f' || key === 'a') {
      const v = key === 'f' ? p.friendliness : p.anti;
      if (v === null) { errors.push(`${where}: ${m} 这张卡还没评，没有分数可填`); return data.__lang === 'en' ? 'unrated' : '还没评'; }
      return String(v);
    }
    if (key === 'pname') return p.name;
    if (key === 'status') return p.status;
    errors.push(`${where}: 不认识的占位 ${m}`); return m;
  });
}

function walkStrings(obj, fn, path = '') {
  if (typeof obj === 'string') return fn(obj, path);
  if (Array.isArray(obj)) return obj.map((v, i) => walkStrings(v, fn, `${path}[${i}]`));
  if (obj && typeof obj === 'object') return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, walkStrings(v, fn, path ? `${path}.${k}` : k)]));
  return obj;
}

/** 校验故事稿：结构、场景、长度、文风、数字来源。返回 { errors, warnings }。 */
export function validateStory(story, data) {
  const errors = [], warnings = [];
  const lang = story?.lang;
  if (story?.version !== STORY_VERSION) errors.push(`version 要是 "${STORY_VERSION}"`);
  if (!['zh', 'en'].includes(lang)) errors.push('lang 只能是 zh 或 en');
  if (typeof story?.title !== 'string' || !story.title.trim()) errors.push('title 缺失');
  if (typeof story?.ending !== 'string' || !story.ending.trim()) errors.push('ending 缺失（最后一句话总结）');
  const beats = Array.isArray(story?.beats) ? story.beats : [];
  if (beats.length < 4 || beats.length > 16) errors.push(`beats 要 4 到 16 段，现在 ${beats.length} 段`);
  if (!beats.some((b) => WHAT_IT_IS.includes(b?.scene))) errors.push(`至少要有一段用 ${WHAT_IT_IS.join(' 或 ')} 讲清宇宙之树是什么`);
  const L = LIMITS[lang] || LIMITS.zh;
  let total = 0;
  const textOf = [];
  beats.forEach((b, i) => {
    const at = `beats[${i}]`;
    const spec = SCENES[b?.scene];
    if (!spec) { errors.push(`${at}.scene「${b?.scene}」不在场景库里（${Object.keys(SCENES).join('、')}）`); return; }
    for (const k of spec.required) {
      const v = b.params?.[k];
      if (v === undefined || v === '' || (Array.isArray(v) && v.length === 0)) errors.push(`${at}.params.${k} 缺失（${b.scene} 场景必填）`);
    }
    if (b.scene === 'two-scores' && b.params?.platform && !data.platforms.find((p) => p.slug === b.params.platform)) errors.push(`${at}.params.platform「${b.params.platform}」不是现有卡`);
    if (b.scene === 'time-cost' && b.params?.minutes !== undefined && !(Array.isArray(b.params.minutes) && b.params.minutes.length === 3 && b.params.minutes.every((n) => typeof n === 'number' && n >= 0))) errors.push(`${at}.params.minutes 要是三个非负数字`);
    if (!Array.isArray(b.lines) || b.lines.length < 1 || b.lines.length > 6) { errors.push(`${at}.lines 要 1 到 6 句`); return; }
    b.lines.forEach((ln, j) => {
      if (typeof ln !== 'string' || !ln.trim()) { errors.push(`${at}.lines[${j}] 是空的`); return; }
      const shown = resolveText(ln, { ...data, __lang: lang }, story?.audience?.name, [], '');  // 按填完数字后的长度算
      const n = [...shown].length; total += n; textOf.push([`${at}.lines[${j}]`, ln]);
      if (n > L.line) errors.push(`${at}.lines[${j}] 太长（${n} 字，上限 ${L.line}），拆成两句`);
    });
    if (spec.acts && b.lines.length > spec.acts + 1) warnings.push(`${at}: ${b.scene} 只有 ${spec.acts} 个画面动作，后面 ${b.lines.length - spec.acts} 句只有旁白没有新画面`);
  });
  textOf.push(['ending', story?.ending ?? ''], ['title', story?.title ?? '']);
  for (const [where, s] of textOf) {
    if (/\d+\s*(分(?!钟)|points?\b)/.test(s.replace(/\{[^}]+\}/g, ''))) errors.push(`${where}: 分数不许手写，用 {f:slug} 或 {a:slug} 从仓里取`);
    if (/\d+\s*(张卡|片叶子|cards|leaves)/.test(s.replace(/\{[^}]+\}/g, ''))) errors.push(`${where}: 卡数不许手写，用 {cards} {rated} {unrated}`);
    if (lang === 'zh') {
      if (/[：]|——|[“”"]/.test(s)) errors.push(`${where}: 中文旁白不用冒号、破折号、双引号（要引用用「」）`);
      for (const w of BANNED_ZH) if (s.includes(w)) errors.push(`${where}: 换掉「${w}」，说人话`);
    }
  }
  if (total > L.total) warnings.push(`旁白一共 ${total} 字，偏长（建议 ${L.total} 以内），主人可能看不完`);
  // 占位能不能填上
  const tmp = []; const d2 = { ...data, __lang: lang };
  walkStrings(story, (s, p) => resolveText(s, d2, story?.audience?.name, tmp, p));
  errors.push(...tmp);
  return { errors, warnings };
}

export function resolveStory(story, data, nameOverride) {
  const name = nameOverride ?? story.audience?.name ?? '';
  const s = { ...story, audience: { ...(story.audience || {}), name } };
  const errs = [];
  const d2 = { ...data, __lang: story.lang };
  return walkStrings(s, (str, p) => resolveText(str, d2, name, errs, p));
}

export function fillTemplate(template, story, data) {
  const safe = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c');
  const S = '<script id="story" type="application/json">__STORY__</script>', DT = '<script id="data" type="application/json">__DATA__</script>';
  if (!template.includes(S) || !template.includes(DT)) throw new Error('播放器缺故事稿或数据的占位');
  let html = template.replace(S, () => S.replace('__STORY__', safe(story))).replace(DT, () => DT.replace('__DATA__', safe(data)));
  if (story.lang === 'en') html = html.replace('<html lang="zh-CN">', '<html lang="en">');
  return html;
}

/** 把 b<段>-<句>.mp3 / .m4a / .wav 读成 data URI，挂到每段的 audio 上。返回挂上的句数。 */
export function attachAudio(story, dir) {
  if (!dir) return 0;
  if (!existsSync(dir)) throw new Error(`找不到音频目录 ${dir}`);
  const mime = { mp3: 'audio/mpeg', m4a: 'audio/mp4', wav: 'audio/wav' };
  let n = 0;
  story.beats.forEach((b, i) => {
    b.audio = (b.lines || []).map((_, k) => {
      for (const ext of Object.keys(mime)) {
        const p = join(dir, `b${i + 1}-${k + 1}.${ext}`);
        if (existsSync(p) && statSync(p).size > 0) { n++; return `data:${mime[ext]};base64,${readFileSync(p).toString('base64')}`; }
      }
      return null;
    });
  });
  return n;
}

export function render(storyPath, data, name, template, audioDir) {
  const story = JSON.parse(stripBom(readFileSync(storyPath, 'utf8')));
  const { errors, warnings } = validateStory(story, data);
  if (errors.length) return { errors, warnings };
  const resolved = resolveStory(story, data, name);
  const clips = attachAudio(resolved, audioDir);
  if (audioDir) warnings.push(`嵌入音频 ${clips} 句（共 ${story.beats.reduce((a, b) => a + b.lines.length, 0)} 句）`);
  return { html: fillTemplate(template, resolved, data), errors, warnings };
}

function parseArgs(argv) {
  const o = { story: '', name: undefined, out: '', check: false, checkStory: '', defaults: false, dataOnly: false, audio: '' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i], v = () => argv[++i] ?? '';
    if (a === '--story') o.story = v();
    else if (a === '--name') o.name = v();
    else if (a === '--out') o.out = v();
    else if (a === '--audio') o.audio = v();
    else if (a === '--check') o.check = true;
    else if (a === '--check-story') o.checkStory = v();
    else if (a === '--defaults') o.defaults = true;
    else if (a === '--data-only') o.dataOnly = true;
    else throw new Error(`不认识的参数：${a}（用法见脚本开头）`);
  }
  return o;
}

const report = (file, { errors, warnings }) => {
  for (const w of warnings) console.warn(`提醒 ${file}: ${w}`);
  for (const e of errors) console.error(`不合格 ${file}: ${e}`);
};

export function main(argv = process.argv.slice(2)) {
  let o;
  try { o = parseArgs(argv); } catch (e) { console.error(e.message); return 2; }
  const tplPath = join(EXPLAIN_DIR, 'template.html');
  if (!existsSync(tplPath)) { console.error(`找不到播放器：${tplPath}`); return 2; }
  const template = readFileSync(tplPath, 'utf8');
  const data = buildData();
  if (o.dataOnly) { console.log(JSON.stringify(data, null, 2)); return 0; }
  if (o.checkStory) {
    if (!existsSync(o.checkStory)) { console.error(`找不到 ${o.checkStory}`); return 2; }
    const r = validateStory(JSON.parse(stripBom(readFileSync(o.checkStory, 'utf8'))), data);
    report(o.checkStory, r);
    if (!r.errors.length) console.log(`故事稿合格：${o.checkStory}${r.warnings.length ? `（${r.warnings.length} 条提醒）` : ''}`);
    return r.errors.length ? 1 : 0;
  }
  if (o.defaults || o.check) {
    let bad = 0;
    for (const d of DEFAULTS) {
      const r = render(d.story, data, undefined, template, '');
      report(d.story, r);
      if (r.errors.length) { bad++; continue; }
      const cur = existsSync(d.out) ? stripBom(readFileSync(d.out, 'utf8')).replace(/\r\n/g, '\n') : '';
      if (o.check) {
        if (cur !== r.html.replace(/\r\n/g, '\n')) { console.error(`成片过期：${d.out}，先跑 node scripts/build-explain.mjs --defaults`); bad++; }
      } else if (cur !== r.html) { writeFileSync(d.out, r.html, 'utf8'); console.log(`已写入 ${d.out}（字幕版）`); }
      else console.log(`已是最新 ${d.out}（字幕版）`);
      if (!o.check && existsSync(d.audio)) {
        const v = render(d.story, data, undefined, template, d.audio);
        if (!v.errors.length) { mkdirSync(dirname(d.voiced), { recursive: true }); writeFileSync(d.voiced, v.html, 'utf8'); console.log(`已写入 ${d.voiced}（带配音，本机用，不进仓库）`); }
      }
    }
    if (o.check && !bad) console.log(`校验通过：${DEFAULTS.length} 部自带成片合法且是最新的。`);
    return bad ? 1 : 0;
  }
  if (!o.story) { console.error('要 --story <故事稿.json>，或 --defaults / --check / --check-story / --data-only'); return 2; }
  if (!existsSync(o.story)) { console.error(`找不到 ${o.story}`); return 2; }
  let r;
  try { r = render(o.story, data, o.name, template, o.audio); } catch (e) { console.error(e.message); return 2; }
  report(o.story, r);
  if (r.errors.length) return 1;
  const out = o.out ? resolve(o.out) : join(EXPLAIN_DIR, 'out', 'explain.html');
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, r.html, 'utf8');
  console.log(`已写入 ${out}（${data.counts.cards} 张卡，${data.counts.rated} 张已评）`);
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
