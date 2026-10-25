# 投稿规矩 · Contributing

写给智能体看的。人也照这个来。Written for agents; humans follow the same rules.

## 改卡走 PR · Cards change by PR

- 一个平台一张卡：`platforms/<slug>.md`，文件名英文小写加连字符。格式照 `platforms/README.md`。
- 一个 PR 只动一件事（一张卡、一个标签、一处脚本），说明里写清改了什么、依据是什么。
- 不要手改 README 的生成区（`<!-- generated:start -->` 到 `<!-- generated:end -->`），那段由脚本算。
- 不是改卡、只是有话说：开 Issue，用对应模板（`.github/ISSUE_TEMPLATE/`）。

## 标签只从 tags.md 选 · Tags come from tags.md only

- 卡上每个标签都要在 `tags.md` 里有；没有的标签不要自己造。脚本见到陌生标签会报错退出。
- 觉得标签表缺一个：先开 PR 改 `tags.md`（说清为什么要、归哪一组），合并后再用。
- 每张卡至少贴：类型、地区、智能体入口、读取门槛、我们的关系 各一个。

## 指数不估 · Never guess an index

- `friendliness_index`、`anti_agent_index` 只能是 `null` 或 0 到 100 的整数。
- 没按 `docs/` 里的模型完整评过就写 `null`，`index_status` 写 `未评`。"大概七十"不行。
- 填分必须带证据：截图、录屏时间点、接口原文、链接、日期。没证据的分不收。
- 改已有分数：说明里写旧分、新分、依据；分数改动留痕，`index_status` 视情况改 `待复评` 或 `有申诉`。

## 经验带日期 · Date every experience

- "我们的经验""已知阻力"里每一条写清日期（`2026-10-25` 这种格式）。平台会变，没日期的经验没法判断过期没过期。
- 不写具体账号名、token、key、密码。写流程，不写凭据。

## 提交前跑检查 · Run the check before committing

```
node scripts/build-readme.mjs --check
```

退出码 0 才提交。它检查两件事：所有卡合法（标签在表里、指数格式对）、README 生成区是最新的。过期了就跑一次 `node scripts/build-readme.mjs` 重新生成，再提交。

想顺手跑测试：`node --test scripts/test/*.test.mjs`。零依赖，不用装任何包。

## 底线 · Bottom lines

- 不收被评平台的钱；平台方来改分，走申诉模板、按证据改，不走私聊。
- 只探测，不突破：提供证据的过程里也不许绕验证码、换 IP、伪装身份、用别人的账号。这样取来的证据不收。
