#!/usr/bin/env node
// 公开仓巡查：只读。拿一次快照（协作者、邀请、webhook、分支保护、Issue、评论、PR、Actions、最近事件、星标与分叉），
// 和上次快照比，把变化打出来。零依赖，靴子是本机已登录的 gh。
// 用法：node scripts/watch-public-repo.mjs [--repo dundunbaba/cosmic-tree] [--state <文件>] [--json]
// 退出码：0 无变化；3 有变化（方便定时任务按退出码决定要不要通知）；2 gh 不可用。
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { join, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import process from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '..');

function args(argv) {
  const o = { repo: 'dundunbaba/cosmic-tree', state: join(REPO_ROOT, '.watch-state.json'), json: false };
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--repo') o.repo = argv[++i];
    else if (argv[i] === '--state') o.state = resolve(argv[++i]);
    else if (argv[i] === '--json') o.json = true;
  }
  return o;
}

function gh(path) {
  try {
    const out = execFileSync('gh', ['api', path, '--paginate'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], windowsHide: true });
    return JSON.parse(out);
  } catch (e) {
    const msg = (e.stderr || e.message || '').toString().trim().split('\n')[0];
    return { __error: msg };
  }
}

export function snapshot(repo) {
  const s = { taken_at: new Date().toISOString(), repo };
  const meta = gh(`repos/${repo}`);
  s.repo_meta = meta.__error ? meta : { visibility: meta.visibility, default_branch: meta.default_branch, stars: meta.stargazers_count, forks: meta.forks_count, watchers: meta.subscribers_count, has_issues: meta.has_issues, pushed_at: meta.pushed_at };
  const collab = gh(`repos/${repo}/collaborators?affiliation=all`);
  s.collaborators = collab.__error ? collab : collab.map((c) => ({ login: c.login, type: c.type, admin: !!c.permissions?.admin, push: !!c.permissions?.push })).sort((a, b) => a.login.localeCompare(b.login));
  const inv = gh(`repos/${repo}/invitations`);
  s.invitations = inv.__error ? inv : inv.map((i) => ({ invitee: i.invitee?.login, type: i.invitee?.type, perm: i.permissions }));
  const hooks = gh(`repos/${repo}/hooks`);
  s.webhooks = hooks.__error ? hooks : hooks.map((h) => ({ id: h.id, active: h.active, host: safeHost(h.config?.url), events: h.events }));
  const prot = gh(`repos/${repo}/branches/${s.repo_meta.default_branch ?? 'master'}/protection`);
  s.branch_protection = prot.__error ? (/not protected/i.test(prot.__error) ? '无' : prot) : '有';
  const issues = gh(`repos/${repo}/issues?state=all&per_page=100`);
  s.issues = issues.__error ? issues : issues.map((i) => ({ n: i.number, pr: !!i.pull_request, state: i.state, title: i.title, by: i.user?.login, by_type: i.user?.type, comments: i.comments, updated: i.updated_at, labels: (i.labels || []).map((l) => l.name) }));
  const comments = gh(`repos/${repo}/issues/comments?per_page=100`);
  s.comments = comments.__error ? comments : comments.map((c) => ({ id: c.id, issue: Number(String(c.issue_url).split('/').pop()), by: c.user?.login, by_type: c.user?.type, at: c.created_at, head: String(c.body || '').slice(0, 120) }));
  const runs = gh(`repos/${repo}/actions/runs?per_page=10`);
  s.actions = runs.__error ? runs : (runs.workflow_runs || []).map((r) => ({ id: r.id, name: r.name, status: r.status, conclusion: r.conclusion, at: r.created_at }));
  const events = gh(`repos/${repo}/events?per_page=50`);
  s.events = events.__error ? events : events.map((e) => ({ id: e.id, type: e.type, actor: e.actor?.login, at: e.created_at, action: e.payload?.action || '' }));
  return s;
}

function safeHost(url) {
  try { return new URL(url).host; } catch { return '(无法解析)'; }
}

function keyed(list, keyFn) {
  const m = new Map();
  if (!Array.isArray(list)) return m;
  for (const x of list) m.set(keyFn(x), x);
  return m;
}

export function diff(prev, cur) {
  const out = [];
  if (!prev) return ['首次快照，无可比对象；下次起只报变化。'];
  const cmpList = (name, a, b, keyFn, describe) => {
    const pa = keyed(a, keyFn), pb = keyed(b, keyFn);
    for (const [k, v] of pb) if (!pa.has(k)) out.push(`【新增 ${name}】${describe(v)}`);
    for (const [k, v] of pa) if (!pb.has(k)) out.push(`【移除 ${name}】${describe(v)}`);
    for (const [k, v] of pb) if (pa.has(k) && JSON.stringify(pa.get(k)) !== JSON.stringify(v)) out.push(`【变更 ${name}】${describe(v)}`);
  };
  cmpList('协作者', prev.collaborators, cur.collaborators, (x) => x.login, (x) => `${x.login}（${x.type}，admin=${x.admin} push=${x.push}）`);
  cmpList('邀请', prev.invitations, cur.invitations, (x) => `${x.invitee}`, (x) => `${x.invitee}（${x.type}，${x.perm}）`);
  cmpList('webhook', prev.webhooks, cur.webhooks, (x) => String(x.id), (x) => `#${x.id} ${x.host} active=${x.active} events=${(x.events || []).join(',')}`);
  if (JSON.stringify(prev.branch_protection) !== JSON.stringify(cur.branch_protection)) out.push(`【分支保护】${JSON.stringify(prev.branch_protection)} → ${JSON.stringify(cur.branch_protection)}`);
  cmpList('Issue/PR', prev.issues, cur.issues, (x) => String(x.n), (x) => `#${x.n} ${x.pr ? 'PR' : 'Issue'} ${x.state} ${x.title}（${x.by}，${x.by_type}，评论 ${x.comments}）`);
  cmpList('评论', prev.comments, cur.comments, (x) => String(x.id), (x) => `#${x.issue} ${x.by}（${x.by_type}）${x.at}：${x.head}`);
  cmpList('Actions', prev.actions, cur.actions, (x) => String(x.id), (x) => `${x.name} ${x.status}/${x.conclusion} ${x.at}`);
  const pm = prev.repo_meta || {}, cm = cur.repo_meta || {};
  for (const k of ['visibility', 'default_branch', 'stars', 'forks', 'watchers', 'has_issues']) if (pm[k] !== cm[k]) out.push(`【仓】${k}：${pm[k]} → ${cm[k]}`);
  const seen = new Set((prev.events || []).map((e) => e.id));
  for (const e of (cur.events || []).slice().reverse()) if (!seen.has(e.id)) out.push(`【事件】${e.at} ${e.type} ${e.action} by ${e.actor}`);
  return out;
}

function main() {
  const o = args(process.argv.slice(2));
  const cur = snapshot(o.repo);
  const fatal = [cur.repo_meta, cur.collaborators, cur.issues].find((x) => x && x.__error);
  if (fatal) {
    console.error(`gh 不可用或无权限：${fatal.__error}`);
    return 2;
  }
  const prev = existsSync(o.state) ? JSON.parse(readFileSync(o.state, 'utf8')) : null;
  const changes = diff(prev, cur);
  mkdirSync(dirname(o.state), { recursive: true });
  writeFileSync(o.state, JSON.stringify(cur, null, 2) + '\n');
  const nonOwner = (cur.events || []).filter((e) => e.actor && e.actor !== (cur.collaborators || []).find((c) => c.admin)?.login);
  const summary = {
    repo: o.repo, taken_at: cur.taken_at,
    collaborators: (cur.collaborators || []).length, invitations: (cur.invitations || []).length, webhooks: (cur.webhooks || []).length,
    branch_protection: cur.branch_protection, open_issues: (cur.issues || []).filter((i) => i.state === 'open' && !i.pr).length,
    open_prs: (cur.issues || []).filter((i) => i.state === 'open' && i.pr).length, comments: (cur.comments || []).length,
    bot_or_outsider_events: nonOwner.length, changes,
  };
  if (o.json) console.log(JSON.stringify(summary, null, 2));
  else {
    console.log(`公开仓巡查 ${o.repo} @ ${cur.taken_at}`);
    console.log(`协作者 ${summary.collaborators}｜邀请 ${summary.invitations}｜webhook ${summary.webhooks}｜分支保护 ${summary.branch_protection}｜开着的 Issue ${summary.open_issues}｜开着的 PR ${summary.open_prs}｜评论 ${summary.comments}｜非所有者事件 ${summary.bot_or_outsider_events}`);
    console.log(changes.length ? changes.map((c) => `- ${c}`).join('\n') : '无变化。');
  }
  return changes.length && prev ? 3 : 0;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) process.exitCode = main();
