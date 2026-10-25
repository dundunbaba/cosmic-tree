---
name: Neon
aliases: [neon.tech, Neon Postgres]
region: 海外
tags: [云与托管, 海外, 国内受限, 有API, 有CLI, 登录可读, 登录可写, 结构化数据, 有结构化字段, 条款允许自动化, 个人可用, 免费额度, 按量, 在用]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://neon.tech
  docs: https://neon.tech/docs
  terms: https://neon.tech/terms-of-service
---

# Neon

## 一句话
serverless Postgres。采集系统的案例库、转写文档、信源账本都在它的免费档里，连接串走池化（pooler）给 Vercel 用。

## 智能体怎么进门
- 用 GitHub 登录建项目；控制台拿连接串；有 API 和命令行。
- serverless 场景必须用带 `-pooler` 的池化连接串，并去掉 `channel_binding`，否则连接数会爆。
- 建表不用手动：网站首次访问时运行时幂等 DDL。

## 我们的经验
- 2026-06 建库，区域选离用户近的（新加坡／东京）；免费档对本项目够用（OPC 内部记录，2026-06）。
- 连接串用 pooled、去 channel_binding（OPC 内部记录，2026-10-25）。
- 转写文档、信源拒绝印记账本都入 Neon 表；端到端生产链路（pages.dev→Vercel→Neon）验收通过（OPC 内部记录，2026-10-25）。
- 数据架构定位：L2 业务库（Neon／Supabase Postgres），Agent 经 MCP 默认只读，写走独立人闸通道（OPC 内部记录，2026-10-25）。

## 已知阻力
- 进得去：控制台在海外；数据库连接从国内直连未测。
- 看得懂：标准 Postgres。
- 办得成：全自动。
- 稳不稳：免费档有计算时长和存储上限，未撞到。
- 能付钱：免费档；付费要人绑卡。
- 守规矩：条款允许；数据在海外区域，个人信息合规要注意。

## 指数
未评，按 docs 两份模型评后填。
