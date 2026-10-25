---
name: X（原 Twitter）
aliases: [x.com, twitter.com, Twitter]
region: 海外
tags: [社交, 海外, 国内不可达, 有API, 有机器人账号, 登录可读, 登录可写, 文字, 图片, 视频, 条款禁止自动化, 付费, 只研究过]
friendliness_index: null
anti_agent_index: null
index_status: 准备评
last_reviewed: 2026-10-25
links:
  home: https://x.com
  docs: https://developer.x.com
  terms: https://x.com/tos
---

# X（原 Twitter）

## 一句话
海外最大的文字社交平台之一；CEO 2026-10-25 定为 OPC 海外下一个要维护的重点平台，运维工具是 CEO 手上的 Grok bot（Grok 是 X 母公司 xAI 的模型，和 X 有原生接入）。

## 智能体怎么进门
- 官方开发者 API：分层付费，免费层只许发帖、读取要付费层（以开发者页当天为准）。申请流程：开发者门户建项目和应用，拿密钥，由账号主人本人操作。
- Grok bot：CEO 持有，"天然可以运维 X"是 CEO 的判断，能读、能发、能定时、要多少钱四件事待核（见第五节）。
- 第三方只读工具把它列为"实验级，反爬更严，可能随时失效"（Agent Reach 渠道表，2026-10-25）。

## 我们的经验
- 只研究过。2026-08-30 CEO 观察到 Grok 的 BOT 在群里能自己判断该拉哪个 BOT 进来，因每个 BOT 有身份和能力描述，这条启发写进了 Agent IM 设计简报（OPC 内部记录，2026-08-30）。
- 2026-10-25 CEO 定 X 为海外重点，用 Grok bot 运维。

## 已知阻力
- 进得去：读公开内容基本要登录；API 读取付费；条款对自动化访问限制严。
- 稳不稳：第三方工具标注"反爬更严，可能随时失效"。
- 能付钱：API 分层付费，个人价格以开发者页为准。
- 其余待评测时补证据。

## 指数
准备评。先核 Grok bot 的四件事（能读、能发、能定时、费用），再按两份模型跑测法。
