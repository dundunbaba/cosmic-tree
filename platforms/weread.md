---
name: 微信读书
aliases: [WeRead, weread.qq.com]
region: 国内
tags: [知识与出版, 国内, 国内可达, 仅网页, 登录可读, 登录可写, 不许自动写, 文字, 有结构化字段, 条款未提, 个人可用, 免费, 用过]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://weread.qq.com
  docs: https://weread.qq.com
  terms: https://weread.qq.com/web/terms
---

# 微信读书

## 一句话
腾讯的阅读 App，网页版有一套未公开但稳定的 JSON 接口（书架、划线、想法、书评）。对智能体有两个用法：读主人自己的读书笔记；用它的小号替代公众号后台来收公众号文章。

## 智能体怎么进门
- 读自己的数据：网页扫码登录后取 cookie（`wr_skey`、`wr_vid`、`wr_localId` 必须），走 `weread.qq.com/web` 的 shelf／bookmarklist／review 接口；cookie 约 30 天过期要重扫。
- 读公众号：wewe-rss／Wechat2RSS 登一个微信读书小号即可输出公众号 RSS，不需要自己的公众号。
- 没有官方 API、CLI、MCP。

## 我们的经验
- 采集系统微信读书信源模块分五个步骤（书架→划线→想法→书评→入库），是 8 个 active 信源里唯一做过真实数据验收的（OPC 内部记录，2026-10-25）。
- 定位为低相关信源，通过率预期很低，不建议作主力；2026-06-22 把它和得到一起降级为"仅插件／仅自用"（OPC 内部记录，2026-06-22）。
- 2026-06-22 选型：收公众号文章改走"微信读书小号"路线（wewe-rss），比登公众号后台更简单、风险不压主资产（OPC 内部记录，2026-06-22）。
- 限频 API 别过度测试，能零配额探 schema 就零配额（用户全局规矩）。

## 已知阻力
- 进得去：全部要登录 cookie；cookie 30 天过期。
- 看得懂：接口返回 JSON，字段清楚；划线和想法是碎片，不是全文。
- 办得成：只读自己的数据；没有写入。
- 稳不稳：接口未公开，随时可变；wewe-rss 已归档。
- 能付钱：不涉及。
- 守规矩：条款没写自动化；读他人书内容有版权边界，只读自己的笔记。

## 指数
未评，按 docs 两份模型评后填。
