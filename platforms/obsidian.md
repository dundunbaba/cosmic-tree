---
name: Obsidian
aliases: [obsidian.md, JSON Canvas]
region: 全球
tags: [工具, 知识与出版, 全球, 国内可达, 本地文件, 免登录可读, 免登录可写, 文字, 结构化数据, 有结构化字段, 条款未提, 个人可用, 免费, 在用]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://obsidian.md
  docs: https://help.obsidian.md
  terms: https://obsidian.md/terms
---

# Obsidian

## 一句话
本地 Markdown 双链笔记软件。OPC 个人知识库的 vault 和外贸业务产品知识库都是 Obsidian 库。它对智能体的"入口"很特别：没有 API，但数据就是本地 Markdown 文件，智能体直接读写文件就行；画布格式 JSON Canvas 是公开标准。

## 智能体怎么进门
- 读写 vault 目录下的 `.md` 文件和 `.canvas`（JSON Canvas 开放格式）；不经过软件。
- 没有官方 API、MCP；社区插件可开本地接口（我们没用）。
- 注意：Obsidian 开着时改文件要逐文件原子写（临时文件加 rename）。

## 我们的经验
- 个人知识库 vault 是 Obsidian 双链库，本地加 NAS、无远端，不公开、不产品化（OPC 内部记录，2026-10-25）。
- 外贸业务产品知识库"Obsidian 打开即用，从索引进"（OPC 内部记录，2026-10-25）。
- 2026-07 画布工具调研：画布落盘用 JSON Canvas 开放格式，Obsidian 可直接打开，与个人知识库打通；"markdown 是资产，Obsidian 只是编辑器"（OPC 内部记录，2026-07）。
- 内部图谱工具规划：调用 Obsidian 数据（1900 多条笔记和双链）在画板上画力导向图，Obsidian 已实现的不开发（OPC 内部记录，2026-10-25）。
- 标签收敛迁移时段不开 vault，脚本逐文件原子写（OPC 内部记录，2026-10-25）。

## 已知阻力
- 进得去：本地文件，零门槛。
- 看得懂：Markdown 加 frontmatter 加双链，机器好读；图谱是软件内渲染。
- 办得成：直接写文件；并发写有冲突风险。
- 稳不稳：文件格式稳定。
- 能付钱：个人免费；同步和发布是付费服务（我们不用）。
- 守规矩：条款没写自动化；数据全在本地。

## 指数
未评，按 docs 两份模型评后填。
