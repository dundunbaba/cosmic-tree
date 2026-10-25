# 平台卡格式（一个平台一个文件，文件名用英文小写加连字符，例 `github.md`）

```markdown
---
name: GitHub
aliases: [github.com]
region: 全球
tags: [开发者平台, 全球, 国内受限, 有API, 有CLI, 免登录可读, 登录可写, 文字, 结构化数据, 条款允许自动化, 免费额度, 在用]
friendliness_index: null      # 没按模型评过就写 null，不许估
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://github.com
  docs: https://docs.github.com
  terms: https://docs.github.com/site-policy
---

# GitHub

## 一句话
它是什么、Agent 常拿它干什么。

## 智能体怎么进门
API、CLI、MCP、机器人账号各怎么拿、要什么权限（只写流程，不写我们的账号）。

## 我们的经验
OPC 这半年用它干了什么、踩过什么坑、哪条规矩是血泪（带日期）。没有就写"只研究过"。

## 已知阻力
按六道门记：进得去、看得懂、办得成、稳不稳、能付钱、守规矩。有证据的写证据。

## 指数
没评就一句"未评，按 docs 两份模型评后填"；评了放分数、等级、证据目录链接、方法版本。
```

规矩：标签只从 `tags.md` 选；指数不估；每条经验带日期；不写账号名、token。

## 两条补充规矩（2026-10-25 维护者定）

- 总表分组取卡上**第一个**"类型"标签；一张卡贴多个类型只进第一组，所以把最主要的类型写在最前面。
- 条款禁止自动化的平台按模型是 X 级：v0.1 字段里指数仍写 `null`，`index_status` 写 `已评`，正文"指数"一节第一行写"X 级：条款禁止自动化（证据）"；脚本单列 X 级等 v0.2。
