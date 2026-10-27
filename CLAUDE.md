# CLAUDE.md — agent-cosmic-tree

写给来这个仓干活的智能体（和人）看的。读完这一页就能动手。

## 这个仓是什么

一个给智能体看的全球平台评估：一个平台一张卡，两个指数一起看。

- **友好指数**：平台替智能体修了多少路（0 到 100，越高越顺）。
- **反智能体指数**：平台主动设了多少拦（0 到 100，越高越反）。

这是信息仓，不是代码仓：核心是平台卡、两份指数模型、反馈入口；脚本只是帮手，负责从卡片算榜单。

## 怎么读

1. `README.md`：平台总表、两张榜、四格图（生成区由脚本算，手不改）。
2. `platforms/<slug>.md`：平台卡。front-matter 是标签和指数，正文五节：一句话、智能体怎么进门、我们的经验、已知阻力、指数。格式见 `platforms/README.md`。
3. `tags.md`：标签表。卡上的标签只能从这里选。
4. `docs/friendliness-index-model-v0.1.zh.md`、`docs/anti-agent-index-model-v0.1.zh.md`：两份指数模型和测法。
5. `llms.txt`：给机器的入口。

指数是 `null` 就是没评过，不是 0 分。"我们的经验"里的条目都带日期，`（OPC 内部记录，YYYY-MM-DD）`表示出处是维护方的内部记录。

## 怎么反馈

开 Issue，三种模板选一个：智能体的困惑或问题、平台建议、申诉改分。字段照填，别贴账号、key、token。

## 怎么改卡（PR）

- 标签只从 `tags.md` 选；表里没有的先开 PR 改 `tags.md`，合并后再用。
- 指数不估：没按 `docs/` 里的模型完整评过就写 `null`；填分必须带证据。
- 每条经验带日期（`2026-10-25` 这种格式）。
- 不写账号名、token、key、密码；写流程，不写凭据。
- 提交前跑 `node scripts/build-readme.mjs --check`，退出码 0 才提交。README 生成区过期就先跑 `node scripts/build-readme.mjs` 重新生成。
- 想顺手跑测试：`node --test scripts/test/*.test.mjs`。零依赖。

细则见 `CONTRIBUTING.md`。

## 两条底线

1. **不收被评平台的钱**，不做付费整改。
2. **评测只探测不突破**：不绕验证码、不换 IP、不伪装身份、不用别人的账号。这样取来的证据不收。

## 其他

- 中文为真源，英文随后翻；对外文件统一写"智能体"，口语里 Agent 随意。
- 安全问题见 `SECURITY.md`。
- Gitee 镜像只同步不改，Issue 和 PR 一律在 GitHub（`docs/mirror.md`）。
