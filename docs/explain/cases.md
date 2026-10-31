# 真实案例 · Cases

给智能体讲故事、答追问用的真事。每一件都写清出处和日期，讲的时候带上。只收真发生过的；新案例开 PR 加一行，出处要能点开或在仓里找得到。
Real cases for stories and follow-up questions. Each has a source and a date. Only things that actually happened.

| 日期 | 事 | 能讲什么 | 出处 |
|---|---|---|---|
| 2026-10-28 | 维护方用 Grok 搭的 Discord 运营机器人，在一台云上的机器里用浏览器打开 discord.com 的登录页和应用页，连试 6 次全部 `ERR_CONNECTION_CLOSED`；同一台机器同一时间用命令行请求同样的地址是通的。原因到现在没查清 | 网页那扇门对机器可能不开，人在自己电脑上却能开 | 公开仓 Issue #2；`platforms/discord.md` |
| 2026-10-28 | 同一个机器人改走 Discord 官方的机器人接口（Bot API），建频道、建身份组、发消息、置顶全部成功 | 正门不行、侧门行；平台给机器人留了正式入口 | 同上 |
| 2026-10-28 | 同一个机器人把开发者后台的 Client Secret 当成 Bot token 用，接口回 401；两把钥匙长得像 | 办事做法：哪一步最容易拿错 | 同上 |
| 2026-10-17 | 维护方自己的游戏网页放在海外托管的默认网址上，在中国大陆用手机流量打开直接回 401；这是托管平台对默认网址的规矩，人和 AI 一样进不去 | 进不去不一定是针对 AI；国内能不能打开要单独看 | `platforms/opc-novel-game-web.md`；`evidence/2026-10-28-opc-novel-game-web/` |
| 2026-10-28 | 智能体只拿宇宙之树公开仓的网址，3 个请求就找到 GitHub 那张卡并读出两个指数，没登录，没让人帮忙 | 门开着的平台，AI 自己就能办完 | `evidence/2026-10-28-opc-cosmic-tree/run-record.json` |
| 2026-10-28 | 同一个任务的最后一步是在公开仓发一条 Issue：匿名会被转到登录页；用主人已登录的命令行能发，但对外发布要主人点头。主人回了一个字「发」，不到一分钟 | 要主人出手的一步是什么样；人工介入时间怎么记 | 公开仓 Issue #1；`evidence/2026-10-28-opc-cosmic-tree/run-record.json` |
| 2026-10-28 | GitHub 匿名调用代码搜索接口回 401，要登录；读公开文件、列目录不用登录 | 同一个网站，不同的事开的门不一样 | `evidence/2026-10-28-opc-cosmic-tree/api-code-search-anon.json` |
| 2026-10-28 | 用写明是智能体的身份去读 Reddit 的公开 JSON 接口，回 403；同一天读 Stack Overflow 的 robots.txt 回 418 | 有的平台认出机器就拦 | `baseline/sources.json` 里 reddit、stackoverflow 两条的 evidence |
