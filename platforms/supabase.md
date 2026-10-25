---
name: Supabase
aliases: [supabase.com, Supabase Auth]
region: 海外
tags: [云与托管, 海外, 国内受限, 有API, 有SDK, 有CLI, 有MCP, 登录可读, 登录可写, 结构化数据, 有结构化字段, 条款允许自动化, 个人可用, 免费额度, 按量, 只研究过]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://supabase.com
  docs: https://supabase.com/docs
  terms: https://supabase.com/terms
---

# Supabase

## 一句话
开源的后端即服务（Postgres、认证、存储、边缘函数）。OPC 几次把它写进方案当备选（采集系统数据库备选、登录方案、网页版游戏的邮箱登录），没有真建过项目。本机接着 Supabase 的 MCP 服务，可以从智能体侧直接建项目、跑 SQL。

## 智能体怎么进门
- MCP：列组织、建项目、跑 SQL、迁移、边缘函数、日志、文档搜索（本机已接）。
- 命令行、REST、客户端 SDK；认证支持邮箱、手机号、第三方登录。

## 我们的经验
- 采集系统部署手册把它列为数据库备选（选了 Neon）；PRD 把 Clerk／Supabase Auth 手机号登录列为站点认证方案（OPC 内部记录，2026-10-25）。
- 2026-10-16 网页版游戏规划：用 EdgeOne Makers 已集成的 Supabase 或 Clerk 做邮箱／口令登录，不接微信登录（网站应用的微信登录要企业资质）（OPC 内部记录，2026-10-16）。
- 数据架构：L2 业务库候选（OPC 内部记录，2026-10-25）。
- 调研见别人用 Supabase 加 Cloudflare Workers 免费栈复刻资讯站（OPC 内部记录，2026-10-25）。
- 只研究过。

## 已知阻力
- 进得去：海外控制台；国内直连未测。
- 看得懂：结构化。
- 办得成：MCP 让智能体能建项目、改库，这是少见的"写得成"。
- 稳不稳：没测过。
- 能付钱：免费档；付费要人绑卡。
- 守规矩：条款允许。

## 指数
未评，按 docs 两份模型评后填。
