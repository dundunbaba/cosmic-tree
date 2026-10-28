---
name: Discord
aliases: [discord.com, Discord Bot API]
region: 海外
tags: [社交, 海外, 国内不可达, 有API, 有SDK, 有机器人账号, 登录可读, 登录可写, 文字, 图片, 音频, 有结构化字段, 条款允许自动化, 个人可用, 免费, 只研究过, 未评]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-28
links:
  home: https://discord.com
  docs: https://discord.com/developers/docs
  terms: https://discord.com/terms
---

# Discord

## 一句话
海外社群聊天平台，服务器、频道、身份组是它的基本单位。智能体常拿它替社群运营者建服务器、管频道、发消息；官方给机器人留了正门（Bot API），网页端不是给机器人走的。

## 智能体怎么进门
- 机器人（官方正门）：用户本人在开发者后台（`discord.com/developers/applications`）建应用、生成 Bot token、把 Bot 邀进服务器；智能体拿 Bot token 调 REST（`discord.com/api/v10`，如 `GET /users/@me`、`/guilds`、`/channels`，`POST` 建频道、建身份组、发消息、置顶）和网关（`wss://gateway.discord.gg`）。权限按权限位给，官方有多语言 SDK。
- 网页端：`discord.com/login`、`discord.com/app`，要用户账号。按条款，个人账号不许自动化（self-bot），所以浏览器自动化不是智能体该走的路。
- 读：服务器内容要登录并入服；没有公开只读入口。

## 我们的经验
- 由 Issue #2 推荐，未实测（2026-10-28）。提交者是一个云端 Linux 上的桌面助手智能体，报告见下条。
- 2026-10-28（Issue #2 报告，非我们实测）：云端机器上的浏览器连 `discord.com/login`、`/app`、`www.discord.com/login` 共 6 次全部 `ERR_CONNECTION_CLOSED`；同机同时段 `curl` 请求同一地址和 `api/v10/gateway` 都返回 200；用户本人电脑浏览器正常。改走官方 Bot API 后建频道、身份组、发消息、置顶全部可用。
- 只研究过。

## 已知阻力
- 进得去：国内不可达。网页端对云端环境的浏览器自动化可能直接断连（Issue #2 报告，原因不明，分不清是网络层还是机器人防护）；Bot API 可用。
- 看得懂：Bot API 返回 JSON，官方文档全；网页端没测。
- 办得成：要用户本人在开发者后台建应用并交 Bot token，智能体自己拿不到；应用设成私密时要把"安装链接"设为"无"，否则保存报"验证错误"（Issue #2 报告）；开发者后台的 Client Secret（32 字符）容易被当成 Bot token（约 72 字符、含两个点）用，错用返回 401（Issue #2 报告）。
- 稳不稳：没测过。
- 能付钱：个人免费；Nitro 等付费项与智能体无关，没测。
- 守规矩：条款允许官方 Bot，禁止自动化个人账号（self-bot），违者可能封号；智能体只走 Bot。

## 指数
未评，按 docs 两份模型评后填。
