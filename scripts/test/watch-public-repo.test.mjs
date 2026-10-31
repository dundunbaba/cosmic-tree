import { test } from 'node:test';
import assert from 'node:assert/strict';
import { carryOver, diff } from '../watch-public-repo.mjs';

const good = () => ({
  repo_meta: { visibility: 'public', default_branch: 'master', stars: 0, forks: 0, watchers: 1, has_issues: true },
  collaborators: [{ login: 'owner', type: 'User', admin: true, push: true }],
  invitations: [], webhooks: [], branch_protection: '无',
  issues: [{ n: 1, pr: false, state: 'open', title: 'a', by: 'owner', by_type: 'User', comments: 1, updated: 't', labels: [] }],
  comments: [{ id: 11, issue: 1, by: 'owner', by_type: 'User', at: 't', head: 'hi' }],
  actions: [], events: [{ id: '9', type: 'IssuesEvent', actor: 'owner', at: 't', action: 'opened' }],
});
const err = { __error: 'Get "https://api.github.com/...": EOF' };

test('正常比对：新评论算变化', () => {
  const prev = good(), cur = good();
  cur.comments.push({ id: 12, issue: 1, by: 'x', by_type: 'User', at: 't2', head: 'new' });
  const w = [];
  const out = diff(prev, cur, w);
  assert.equal(out.length, 1);
  assert.match(out[0], /新增 评论/);
  assert.equal(w.length, 0);
});

test('本次某段拉取失败：沿用上次快照，不报假移除，不写错误进快照', () => {
  const prev = good(), cur = good();
  cur.comments = { ...err };
  const w = [];
  carryOver(prev, cur, w);
  assert.deepEqual(cur.comments, prev.comments);
  assert.equal(w.length, 1);
  assert.match(w[0], /评论 拉取失败，沿用上次快照/);
  assert.deepEqual(diff(prev, cur, w), []);
});

test('上次快照某段是错误、本次正常：跳过比对，不报假新增', () => {
  const prev = good(), cur = good();
  prev.comments = { ...err };
  const w = [];
  carryOver(prev, cur, w);
  assert.equal(w.length, 0);
  const out = diff(prev, cur, w);
  assert.deepEqual(out, []);
  assert.equal(w.length, 1);
  assert.match(w[0], /评论 未比对/);
  assert.ok(Array.isArray(cur.comments));
});

test('两次都失败且无基准：只记警告，不算变化', () => {
  const prev = good(), cur = good();
  prev.events = { ...err }; cur.events = { ...err };
  const w = [];
  carryOver(prev, cur, w);
  assert.match(w[0], /事件 拉取失败，本次无基准/);
  assert.deepEqual(diff(prev, cur, w), []);
});
