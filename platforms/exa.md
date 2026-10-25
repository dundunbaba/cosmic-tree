---
name: Exa
aliases: [exa.ai, Exa Search, Metaphor]
region: 全球
tags: [数据接口服务, 全球, 国内受限, 有API, 有MCP, 免登录可读, 结构化数据, 文字, 条款允许自动化, 个人可用, 免费额度, 按量, 只研究过]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://exa.ai
  docs: https://docs.exa.ai
  terms: https://exa.ai/terms
---

# Exa

## 一句话
面向智能体的语义搜索 API（搜索加取全文），有官方 MCP 服务器、经 MCP 可免密用。Agent-Reach 把它当零配置的网页搜索与读取备选。OPC 只在工具调研里见过它，没直接调过。

## 智能体怎么进门
- REST API 带 key；官方 MCP 服务器（Agent-Reach 说经 MCP 免密）。
- 返回结构化结果（标题、链接、作者、时间、正文）。

## 我们的经验
- Agent-Reach 零配置通道之一：通用网页读取先 Jina Reader 再 Exa；Exa 语义搜索可用于"顺藤摸瓜"找信源（OPC 内部记录，2026-10-25）。
- 信源发现方案把 Exa 列为候选（低频、周更）（OPC 内部记录，2026-10-25）。
- 只研究过。

## 已知阻力
- 进得去：海外服务，国内直连未测。
- 看得懂：输出结构化，是"对智能体友好的接口"样板之一。
- 办得成：只读。
- 稳不稳：没测过。
- 能付钱：免费额度后按量；要人绑卡。
- 守规矩：条款允许程序调用。

## 指数
未评，按 docs 两份模型评后填。
