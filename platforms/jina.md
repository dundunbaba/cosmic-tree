---
name: Jina
aliases: [Jina AI, Jina Reader, r.jina.ai, s.jina.ai]
region: 全球
tags: [数据接口服务, 模型与AI服务, 全球, 国内受限, 有API, 免登录可读, 结构化数据, 文字, 条款允许自动化, 个人可用, 免费额度, 按量, 用过]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://jina.ai
  docs: https://jina.ai/reader
  terms: https://jina.ai/legal
---

# Jina

## 一句话
给智能体读网页的服务：在任意 URL 前加 `r.jina.ai/` 就返回干净 Markdown，免费额度每天 200 次，不要 key；另有搜索、embedding、reranker 等模型接口。它是 Agent-Reach 读网页的首选后端，也是我们调研时穿透脚本渲染页的常用绕路。

## 智能体怎么进门
- Reader：`https://r.jina.ai/<目标URL>`，GET 即得 Markdown；带 key 额度更高。
- 其他接口按量计费，OpenAI 风格。
- 没有 CLI、MCP（第三方有）。

## 我们的经验
- "用过"的程度：只是调研时在浏览器和会话里用 r.jina.ai 读过几页，没有申请 key、没有接进任何产品或采集管线。
- 工具调研：web-content-fetcher 用 Jina Reader 作备选通道，免费 200 次/天；Agent-Reach 读网页先 Jina Reader 再 Exa（OPC 内部记录，2026-10-25）。
- 实战：aihot 调研用 r.jina.ai 渲染过 about、changelog、单条页，拿到了内容；但对 Gitee 搜索代理回 422（OPC 内部记录，2026-10-25）。
- 2026-10：读一篇公众号原文时 jina reader 域被本机网络策略拦住（claude.ai 侧封），公众号墙没破（OPC 内部记录，2026-10）。
- 微信反爬墙时"r.jina.ai 常能穿透 JS 渲染墙"是我们的经验性判断，不是每次都成（OPC 内部记录，2026-10-25）。

## 已知阻力
- 进得去：某些运行环境把它的域名列入拦截；国内直连可达性未单独测。
- 看得懂：输出就是 Markdown，机器最好读。
- 办得成：只读。
- 稳不稳：目标站有反爬或验证码时它也过不去（422、空页）。
- 能付钱：免费额度；付费要 key 和绑卡。
- 守规矩：它替你抓别人的站，被抓站的条款风险在用途上。

## 指数
未评，按 docs 两份模型评后填。
