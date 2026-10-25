#!/usr/bin/env node
// 榜单生成脚本：读 platforms/*.md 的 front-matter，生成 README.md 里
// <!-- generated:start --> 到 <!-- generated:end --> 之间的三块：平台总表、两张榜、四格图。
// 零依赖，只用 Node 内置模块。
//
// 用法：
//   node scripts/build-readme.mjs            重新生成并写回 README.md
//   node scripts/build-readme.mjs --check    只校验：卡片合法且 README 生成区是最新的，否则退出码 1
//   可选：--platforms <dir> --tags <file> --readme <file>（默认相对仓库根）
//
// 退出码：0 成功；1 卡片不合法（标签不在 tags.md / 指数非 null 且非 0..100 整数）或 --check 发现过期；2 用法或文件缺失。

import { readFileSync, writeFileSync, readdirSync, existsSync } from 'node:fs';
import { basename, join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(__dirname, '..');
export const START_MARK = '<!-- generated:start -->';
export const END_MARK = '<!-- generated:end -->';

// 四格图阈值（docs/anti-agent-index-model-v0.1.zh.md 第四节）
export const FRIENDLY_HIGH = 50;
export const ANTI_HIGH = 40;

// 总表要显示的标签组（列）与分组依据
const TABLE_GROUPS = ['地区', '国内可达', '智能体入口', '我们的关系', '指数状态'];
const GROUP_BY = '类型';

export class CardError extends Error {
  constructor(file, line, message) {
    super(`${file}:${line} ${message}`);
    this.file = file;
    this.line = line;
  }
}

function stripBom(s) {
  return s.charCodeAt(0) === 0xfeff ? s.slice(1) : s;
}

// ---------- front-matter 解析（只支持字符串、数组、null、数字、一层嵌套对象） ----------

function parseScalar(raw) {
  let v = raw.trim();
  // 去掉行尾注释：空白 + '#'
  const hash = v.search(/\s#/);
  if (hash >= 0 && !/^["']/.test(v)) v = v.slice(0, hash).trim();
  if (v === '' || v === 'null' || v === '~') return null;
  if (/^-?\d+$/.test(v)) return Number.parseInt(v, 10);
  if (/^-?\d+\.\d+$/.test(v)) return Number.parseFloat(v);
  if (/^".*"$/.test(v) || /^'.*'$/.test(v)) return v.slice(1, -1);
  return v;
}

function parseArray(raw) {
  const inner = raw.trim().slice(1, -1).trim();
  if (inner === '') return [];
  return inner.split(',').map((x) => parseScalar(x)).filter((x) => x !== null);
}

/**
 * 解析 Markdown 文件头部的 front-matter。
 * 返回 { data, lines }：data 是键值；lines 记每个顶层键所在行号（1 起），用于报错。
 * 没有 front-matter 返回 null。
 */
export function parseFrontMatter(text, file = '<text>') {
  const src = stripBom(text).split(/\r?\n/);
  if (src[0]?.trim() !== '---') return null;
  const data = {};
  const lines = {};
  let current = null; // 正在收嵌套对象的键
  let i = 1;
  for (; i < src.length; i++) {
    const line = src[i];
    if (line.trim() === '---') break;
    if (line.trim() === '' || line.trim().startsWith('#')) continue;
    const indented = /^\s+/.test(line);
    if (indented && current) {
      const m = line.trim().match(/^([^:]+):\s*(.*)$/);
      if (!m) throw new CardError(file, i + 1, `front-matter 这一行看不懂：${line.trim()}`);
      data[current][m[1].trim()] = m[2].trim().startsWith('[') ? parseArray(m[2]) : parseScalar(m[2]);
      continue;
    }
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!m) throw new CardError(file, i + 1, `front-matter 这一行看不懂：${line.trim()}`);
    const key = m[1];
    const rest = m[2];
    lines[key] = i + 1;
    if (rest.trim() === '') {
      data[key] = {};
      current = key;
    } else {
      current = null;
      data[key] = rest.trim().startsWith('[') ? parseArray(rest) : parseScalar(rest);
    }
  }
  if (i >= src.length) throw new CardError(file, 1, 'front-matter 没有结束的 ---');
  return { data, lines };
}

// ---------- tags.md 解析 ----------

/**
 * 读标签表。返回 { groups: Map<组, [标签...]>, tagToGroup: Map<标签, 组> }。
 */
export function parseTags(text) {
  const groups = new Map();
  const tagToGroup = new Map();
  for (const line of stripBom(text).split(/\r?\n/)) {
    if (!line.startsWith('|')) continue;
    const cells = line.split('|').slice(1, -1).map((c) => c.trim());
    if (cells.length < 2 || cells[0] === '组' || /^-+$/.test(cells[0])) continue;
    const group = cells[0];
    const tags = [...cells[1].matchAll(/`([^`]+)`/g)].map((m) => m[1]);
    if (tags.length === 0) continue;
    groups.set(group, tags);
    for (const t of tags) tagToGroup.set(t, group);
  }
  return { groups, tagToGroup };
}

// ---------- 卡片读取与校验 ----------

function isIndexValue(v) {
  return v === null || (Number.isInteger(v) && v >= 0 && v <= 100);
}

/**
 * 校验一张卡的 front-matter；不合法就抛 CardError。
 * 返回规范化后的卡对象。
 */
export function validateCard(fm, tags, file) {
  const { data, lines } = fm;
  const at = (k) => lines[k] ?? 1;
  if (typeof data.name !== 'string' || data.name === '') throw new CardError(file, at('name'), 'name 缺失或不是字符串');
  if (!Array.isArray(data.tags)) throw new CardError(file, at('tags'), 'tags 缺失或不是数组');
  for (const t of data.tags) {
    if (!tags.tagToGroup.has(t)) throw new CardError(file, at('tags'), `标签「${t}」不在 tags.md 里`);
  }
  for (const k of ['friendliness_index', 'anti_agent_index']) {
    if (!(k in data)) throw new CardError(file, 1, `${k} 缺失（没评写 null）`);
    if (!isIndexValue(data[k])) throw new CardError(file, at(k), `${k} 只能是 null 或 0 到 100 的整数，现在是 ${JSON.stringify(data[k])}`);
  }
  const slug = basename(file).replace(/\.md$/, '');
  return {
    slug,
    file,
    name: data.name,
    tags: data.tags,
    friendliness: data.friendliness_index,
    anti: data.anti_agent_index,
    indexStatus: typeof data.index_status === 'string' ? data.index_status : null,
    lastReviewed: data.last_reviewed ?? null,
  };
}

export function loadCards(platformsDir, tags) {
  if (!existsSync(platformsDir)) return [];
  const files = readdirSync(platformsDir)
    .filter((f) => f.endsWith('.md') && f.toLowerCase() !== 'readme.md')
    .sort();
  const cards = [];
  for (const f of files) {
    const path = join(platformsDir, f);
    const fm = parseFrontMatter(readFileSync(path, 'utf8'), path);
    if (!fm) throw new CardError(path, 1, '缺 front-matter（文件要以 --- 开头）');
    cards.push(validateCard(fm, tags, path));
  }
  return cards;
}

// ---------- 计算 ----------

export function friendlinessGrade(v) {
  if (v >= 85) return 'A 丝滑';
  if (v >= 70) return 'B 顺畅';
  if (v >= 50) return 'C 勉强';
  return 'D 不友好';
}

export function antiGrade(v) {
  if (v >= 80) return '封锁';
  if (v >= 60) return '敌对';
  if (v >= 40) return '戒备';
  if (v >= 20) return '设防';
  return '开放';
}

const byName = (a, b) => a.name.localeCompare(b.name, 'zh-Hans-CN');

/** 按某个指数降序；只含已评的。 */
export function rank(cards, key) {
  return cards.filter((c) => c[key] !== null).sort((a, b) => b[key] - a[key] || byName(a, b));
}

/** 四格归类；未评（任一指数 null）返回 null。 */
export function quadrant(card) {
  if (card.friendliness === null || card.anti === null) return null;
  const fHigh = card.friendliness >= FRIENDLY_HIGH;
  const aHigh = card.anti >= ANTI_HIGH;
  if (fHigh && !aHigh) return '开放场';
  if (fHigh && aHigh) return '围墙花园';
  if (!fHigh && !aHigh) return '荒地';
  return '堡垒';
}

function tagsOfGroup(card, tags, group) {
  return card.tags.filter((t) => tags.tagToGroup.get(t) === group);
}

// ---------- 渲染 ----------

function link(card) {
  return `[${card.name}](platforms/${card.slug}.md)`;
}

function renderOverview(cards, tags) {
  const out = ['## 平台总表 · All platforms', ''];
  if (cards.length === 0) {
    out.push('暂无平台卡。No platform cards yet.', '');
    return out;
  }
  // 按类型分组：取卡上第一个「类型」标签；没有就归「未分类」
  const groupsOrder = [...(tags.groups.get(GROUP_BY) ?? []), '未分类'];
  const buckets = new Map(groupsOrder.map((g) => [g, []]));
  for (const c of cards) {
    const type = tagsOfGroup(c, tags, GROUP_BY)[0] ?? '未分类';
    buckets.get(type).push(c);
  }
  for (const g of groupsOrder) {
    const list = buckets.get(g);
    if (!list || list.length === 0) continue;
    out.push(`### ${g}（${list.length}）`, '');
    out.push(`| 平台 | ${TABLE_GROUPS.join(' | ')} | 友好指数 | 反智能体指数 |`);
    out.push(`|---|${TABLE_GROUPS.map(() => '---').join('|')}|---|---|`);
    for (const c of list.sort(byName)) {
      const cells = TABLE_GROUPS.map((grp) => tagsOfGroup(c, tags, grp).join('、') || '—');
      out.push(`| ${link(c)} | ${cells.join(' | ')} | ${c.friendliness ?? '未评'} | ${c.anti ?? '未评'} |`);
    }
    out.push('');
  }
  return out;
}

function renderRanking(title, cards, key, gradeFn, indexLabel) {
  const out = [`## ${title}`, ''];
  const ranked = rank(cards, key);
  const unrated = cards.length - ranked.length;
  if (ranked.length === 0) {
    out.push('暂无已评平台。No rated platforms yet.');
  } else {
    out.push(`| 名次 | 平台 | ${indexLabel} | 等级 | 状态 |`, '|---|---|---|---|---|');
    ranked.forEach((c, i) => {
      out.push(`| ${i + 1} | ${link(c)} | ${c[key]} | ${gradeFn(c[key])} | ${c.indexStatus ?? '—'} |`);
    });
  }
  out.push('', `未评 ${unrated} 个。Unrated: ${unrated}.`, '');
  return out;
}

function renderQuadrants(cards) {
  const out = [
    '## 四格图 · Four quadrants',
    '',
    `友好指数 ≥ ${FRIENDLY_HIGH} 算高，反智能体指数 ≥ ${ANTI_HIGH} 算高；两个指数都评过才入格。`,
    `Friendliness ≥ ${FRIENDLY_HIGH} is high; anti-agent ≥ ${ANTI_HIGH} is high; a platform enters a cell only when both are rated.`,
    '',
  ];
  const cells = { 开放场: [], 围墙花园: [], 荒地: [], 堡垒: [] };
  let unplaced = 0;
  for (const c of cards.slice().sort(byName)) {
    const q = quadrant(c);
    if (q === null) unplaced++;
    else cells[q].push(c);
  }
  const show = (q) => (cells[q].length ? cells[q].map(link).join('、') : '—');
  out.push('| | 反智能体指数低 · Anti low | 反智能体指数高 · Anti high |', '|---|---|---|');
  out.push(`| **友好指数高 · Friendly high** | 开放场 Open field：${show('开放场')} | 围墙花园 Walled garden：${show('围墙花园')} |`);
  out.push(`| **友好指数低 · Friendly low** | 荒地 Wasteland：${show('荒地')} | 堡垒 Fortress：${show('堡垒')} |`);
  out.push('', `未入格 ${unplaced} 个（至少一个指数未评）。Not placed: ${unplaced}.`, '');
  return out;
}

/** 生成整段生成区的正文（不含标记行）。 */
export function renderGenerated(cards, tags) {
  const lines = [
    `<!-- 本段由 scripts/build-readme.mjs 从 platforms/*.md 生成，手不改；共 ${cards.length} 张卡。Generated, do not edit by hand. -->`,
    '',
    ...renderOverview(cards, tags),
    ...renderRanking('最友好榜 · Most agent-friendly', cards, 'friendliness', friendlinessGrade, '友好指数'),
    ...renderRanking('最反智能体榜 · Most anti-agent', cards, 'anti', antiGrade, '反智能体指数'),
    ...renderQuadrants(cards),
  ];
  return lines.join('\n').replace(/\n+$/, '') + '\n';
}

/** 把生成区塞回 README 文本；缺标记就抛错。 */
export function injectGenerated(readme, generated) {
  const text = stripBom(readme).replace(/\r\n/g, '\n');
  const s = text.indexOf(START_MARK);
  const e = text.indexOf(END_MARK);
  if (s < 0 || e < 0 || e < s) throw new Error(`README 里缺 ${START_MARK} / ${END_MARK} 标记，或顺序反了`);
  return text.slice(0, s + START_MARK.length) + '\n' + generated + text.slice(e);
}

// ---------- 命令行 ----------

function parseArgs(argv) {
  const opts = {
    check: false,
    platforms: join(REPO_ROOT, 'platforms'),
    tags: join(REPO_ROOT, 'tags.md'),
    readme: join(REPO_ROOT, 'README.md'),
  };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--check') opts.check = true;
    else if (a === '--platforms' || a === '--tags' || a === '--readme') {
      const v = argv[++i];
      if (!v) throw new Error(`${a} 后面要跟路径`);
      opts[a.slice(2)] = resolve(v);
    } else if (a === '-h' || a === '--help') {
      opts.help = true;
    } else throw new Error(`不认识的参数：${a}`);
  }
  return opts;
}

export function main(argv = process.argv.slice(2)) {
  let opts;
  try {
    opts = parseArgs(argv);
  } catch (err) {
    console.error(err.message);
    return 2;
  }
  if (opts.help) {
    console.log('用法：node scripts/build-readme.mjs [--check] [--platforms <dir>] [--tags <file>] [--readme <file>]');
    return 0;
  }
  if (!existsSync(opts.tags)) {
    console.error(`找不到标签表：${opts.tags}`);
    return 2;
  }
  if (!existsSync(opts.readme)) {
    console.error(`找不到 README：${opts.readme}`);
    return 2;
  }
  try {
    const tags = parseTags(readFileSync(opts.tags, 'utf8'));
    const cards = loadCards(opts.platforms, tags);
    const generated = renderGenerated(cards, tags);
    const readme = readFileSync(opts.readme, 'utf8');
    const next = injectGenerated(readme, generated);
    const current = stripBom(readme).replace(/\r\n/g, '\n');
    if (opts.check) {
      if (next !== current) {
        console.error(`README 生成区过期：先跑 node scripts/build-readme.mjs 再提交（${opts.readme}）`);
        return 1;
      }
      console.log(`校验通过：${cards.length} 张卡合法，README 生成区是最新的。`);
      return 0;
    }
    if (next !== current) {
      writeFileSync(opts.readme, next, 'utf8');
      console.log(`已写入 ${opts.readme}（${cards.length} 张卡）。`);
    } else {
      console.log(`README 生成区已是最新（${cards.length} 张卡），没动。`);
    }
    return 0;
  } catch (err) {
    console.error(err instanceof CardError ? `卡片不合法 → ${err.message}` : err.message);
    return 1;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = main();
}
