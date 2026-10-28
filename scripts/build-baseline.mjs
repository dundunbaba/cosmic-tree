#!/usr/bin/env node
// 基线库脚本：校验 baseline/sources.json 每条字段与枚举，并把总表渲染进 baseline/README.md 的
// <!-- generated:start --> 到 <!-- generated:end --> 之间。零依赖。
// 用法：node scripts/build-baseline.mjs            重新生成并写回
//      node scripts/build-baseline.mjs --check    只校验：数据合法且 README 生成区最新，否则退出码 1
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const REPO_ROOT = resolve(__dirname, '..');
export const START_MARK = '<!-- generated:start -->';
export const END_MARK = '<!-- generated:end -->';

export const KINDS = ['百科与知识图谱', '档案与数字图书馆', '学术与论文', '开发者文档', '软件包与模型仓', '开放数据', '地图与地理', '社区问答', '新闻与聚合', '政务与法规', '代码托管'];
export const ENTRIES = ['有API', '有数据下载', '有MCP', '有SDK', '有llms.txt', 'robots允许', 'robots限制', '仅网页'];
export const TERMS = ['允许', '有限', '禁止', '未提'];
export const CN_REACH = ['国内可达', '国内受限', '国内不可达', '未知'];
export const FREE = ['免费', '免费额度', '部分付费'];
export const REGION = ['全球', '海外', '国内'];
export const TIER_NAME = { 1: '一级 一手权威', 2: '二级 有编辑或同行机制', 3: '三级 社区与聚合' };
export const TIER_WEIGHT = { 1: 1.0, 2: 0.7, 3: 0.4 };

const stripBom = (s) => (s.charCodeAt(0) === 0xfeff ? s.slice(1) : s);

export function validateSources(list) {
  const errs = [];
  if (!Array.isArray(list)) return ['sources.json 顶层要是数组'];
  const ids = new Set();
  list.forEach((s, i) => {
    const p = `[${i}] ${s?.id ?? '?'}`;
    if (!/^[a-z0-9-]+$/.test(s?.id ?? '')) errs.push(`${p}: id 要是小写字母数字连字符`);
    if (ids.has(s?.id)) errs.push(`${p}: id 重复`);
    ids.add(s?.id);
    for (const k of ['name', 'name_zh', 'home', 'what', 'cn_reach_why', 'checked_at']) {
      if (typeof s?.[k] !== 'string' || !s[k]) errs.push(`${p}: ${k} 缺失`);
    }
    if (s?.home && !/^https?:\/\//.test(s.home)) errs.push(`${p}: home 要是 http(s) 地址`);
    if (!KINDS.includes(s?.kind)) errs.push(`${p}: kind「${s?.kind}」不在类别表`);
    if (!FREE.includes(s?.free)) errs.push(`${p}: free 只能是 ${FREE.join('/')}`);
    if (!REGION.includes(s?.region)) errs.push(`${p}: region 只能是 ${REGION.join('/')}`);
    if (!CN_REACH.includes(s?.cn_reach)) errs.push(`${p}: cn_reach 只能是 ${CN_REACH.join('/')}`);
    if (!Array.isArray(s?.agent_entry) || s.agent_entry.length === 0) errs.push(`${p}: agent_entry 至少一项`);
    else for (const e of s.agent_entry) if (!ENTRIES.includes(e)) errs.push(`${p}: agent_entry「${e}」不在表里`);
    if (!TERMS.includes(s?.automation_terms)) errs.push(`${p}: automation_terms 只能是 ${TERMS.join('/')}`);
    if (typeof s?.llms_txt !== 'string') errs.push(`${p}: llms_txt 要写状态码或「未知」`);
    if (![1, 2, 3].includes(s?.authority?.tier)) errs.push(`${p}: authority.tier 只能是 1/2/3`);
    if (typeof s?.authority?.why !== 'string' || !s.authority.why) errs.push(`${p}: authority.why 缺失（等级要有理由）`);
    if (!Array.isArray(s?.evidence) || s.evidence.length === 0) errs.push(`${p}: evidence 至少一条`);
    else {
      s.evidence.forEach((e, j) => {
        for (const k of ['claim', 'url', 'date']) if (typeof e?.[k] !== 'string' || !e[k]) errs.push(`${p}: evidence[${j}].${k} 缺失`);
      });
    }
    if (s?.checked_at && !/^\d{4}-\d{2}-\d{2}$/.test(s.checked_at)) errs.push(`${p}: checked_at 要是 YYYY-MM-DD`);
  });
  return errs;
}

export function renderGenerated(list) {
  const out = [`<!-- 本段由 scripts/build-baseline.mjs 从 baseline/sources.json 生成，手不改；共 ${list.length} 个源。Generated, do not edit by hand. -->`, ''];
  const byTier = { 1: [], 2: [], 3: [] };
  for (const s of list) byTier[s.authority.tier].push(s);
  out.push('## 按权威等级 · By authority tier', '');
  for (const t of [1, 2, 3]) {
    out.push(`### ${TIER_NAME[t]}（权重 ${TIER_WEIGHT[t].toFixed(1)}，${byTier[t].length} 个）`, '');
    if (byTier[t].length === 0) {
      out.push('暂无。', '');
      continue;
    }
    out.push('| id | 源 | 类别 | 地区 | 国内可达 | 智能体入口 | 条款对自动化 | 费用 | 等级理由 | 核验 |', '|---|---|---|---|---|---|---|---|---|---|');
    const sorted = byTier[t].sort((a, b) => a.kind.localeCompare(b.kind, 'zh-Hans-CN') || a.id.localeCompare(b.id));
    for (const s of sorted) {
      out.push(`| \`${s.id}\` | [${s.name_zh}](${s.home}) | ${s.kind} | ${s.region} | ${s.cn_reach} | ${s.agent_entry.join('、')} | ${s.automation_terms} | ${s.free} | ${s.authority.why} | ${s.checked_at} |`);
    }
    out.push('');
  }
  out.push('## 按类别 · By kind', '');
  out.push('| 类别 | 源（id，权威等级） |', '|---|---|');
  for (const k of KINDS) {
    const l = list.filter((s) => s.kind === k).map((s) => `\`${s.id}\`（${s.authority.tier} 级）`);
    out.push(`| ${k} | ${l.length ? l.join('、') : '—'} |`);
  }
  out.push('');
  return out.join('\n');
}

export function inject(readme, generated) {
  const text = stripBom(readme).replace(/\r\n/g, '\n');
  const s = text.indexOf(START_MARK);
  const e = text.indexOf(END_MARK);
  if (s < 0 || e < 0 || e < s) throw new Error(`baseline/README.md 缺 ${START_MARK} / ${END_MARK} 标记`);
  return text.slice(0, s + START_MARK.length) + '\n' + generated + text.slice(e);
}

export function main(argv = process.argv.slice(2)) {
  const check = argv.includes('--check');
  const dataPath = join(REPO_ROOT, 'baseline', 'sources.json');
  const readmePath = join(REPO_ROOT, 'baseline', 'README.md');
  if (!existsSync(dataPath) || !existsSync(readmePath)) {
    console.error('找不到 baseline/sources.json 或 baseline/README.md');
    return 2;
  }
  let list;
  try {
    list = JSON.parse(stripBom(readFileSync(dataPath, 'utf8')));
  } catch (e) {
    console.error(`sources.json 解析失败：${e.message}`);
    return 1;
  }
  const errs = validateSources(list);
  if (errs.length) {
    errs.forEach((e) => console.error(`基线不合法 → ${e}`));
    return 1;
  }
  const readme = readFileSync(readmePath, 'utf8');
  const next = inject(readme, renderGenerated(list));
  const current = stripBom(readme).replace(/\r\n/g, '\n');
  if (check) {
    if (next !== current) {
      console.error('baseline/README.md 生成区过期：先跑 node scripts/build-baseline.mjs');
      return 1;
    }
    console.log(`校验通过：${list.length} 个源合法，baseline/README.md 生成区是最新的。`);
    return 0;
  }
  if (next !== current) {
    writeFileSync(readmePath, next, 'utf8');
    console.log(`已写入 baseline/README.md（${list.length} 个源）。`);
  } else {
    console.log(`baseline/README.md 已是最新（${list.length} 个源）。`);
  }
  return 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
