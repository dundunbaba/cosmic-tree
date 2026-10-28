---
name: 宇宙之树公开仓
aliases: [cosmic-tree, github.com/dundunbaba/cosmic-tree]
region: 全球
tags: [知识与出版, 全球, 国内受限, 有API, 有CLI, 免登录可读, 登录可写, 文字, 结构化数据, 有结构化字段, 有llms.txt, 条款允许自动化, 个人可用, 免费, 自家, 已评]
friendliness_index: 85
anti_agent_index: 8
index_status: 已评
last_reviewed: 2026-10-28
links:
  home: https://github.com/dundunbaba/cosmic-tree
  docs: https://raw.githubusercontent.com/dundunbaba/cosmic-tree/master/llms.txt
  terms: https://github.com/dundunbaba/cosmic-tree/blob/master/LICENSE
---

# 宇宙之树公开仓

## 一句话
这个仓自己。给智能体看的全球平台评估，托管在 GitHub 公开仓；智能体拿它读平台卡、两份指数模型、基线库，照评估 skill 跑一遍再用 Issue 交回来。自评是示范：先拿自己开刀，模板和证据目录都从这里长出来。

## 智能体怎么进门
- 读：`raw.githubusercontent.com/dundunbaba/cosmic-tree/master/<路径>` 直接拿 Markdown；GitHub REST API `repos/dundunbaba/cosmic-tree/contents/<目录>` 列目录；匿名 `git clone`。根目录 `llms.txt` 是地图。全部不用登录，匿名 API 每小时 60 次。
- 写：开 Issue（三个表单模板加评估提交模板）或 PR，要 GitHub 账号；`gh` 命令行可全程自动化。
- 搜：匿名代码搜索 API 要登录；建议克隆后本地搜，或用 contents API 列目录按文件名找。
- 国内：README 说用 Gitee 镜像，镜像到 2026-10-28 还没接通（见已知阻力）。

## 我们的经验
- 2026-10-25：按两仓制首发，私库真源、公开仓单次干净提交；许可证内容 CC BY-NC 4.0、脚本 MIT（OPC 内部记录，2026-10-25）。
- 2026-10-27：仓名两天内改两次（agent 前缀名改宇宙之树，再改 cosmic-tree）；GitHub 自动跳转兜底，但 llms.txt 里的旧名没同步改（OPC 内部记录，2026-10-27）。
- 2026-10-28：自评跑三轮匿名探测 33 个请求无一拦截；写操作（开 Issue）等 CEO 同意后用 gh 发出，公开仓第一条 Issue #1 就是它，也是评估提交模板的样例（本卡证据目录）。

## 已知阻力
- 进得去：宿主 GitHub 大陆裸连不稳；Gitee 镜像工作流在但 Secrets 没配，镜像不存在（2026-10-28，`evidence/2026-10-28-opc-cosmic-tree/actions-runs.txt`）。
- 看得懂：全部 Markdown 加 front-matter；有 llms.txt。宿主 404 返回 JSON 带文档地址。
- 办得成：读三步到位；搜要登录或克隆；写要账号。
- 稳不稳：方法有版本号（0.1），字段没有变更日志；改名两次。
- 能付钱：免费、非商用；没有支付通道。模型 v0.1 的"能付钱"门对免费信息仓怎么算，待 v0.2 定。
- 守规矩：读无需任何权限；写可用单仓 fine-grained token；全部操作公开可审计。

## 指数
- 友好指数 **85**，A 丝滑。六道门：进得去 18/20、看得懂 20/20、办得成 22/25、稳不稳 7/10、能付钱 3/10、守规矩 15/15。
- 反智能体指数 **8**，开放。仓本身零设拦；计分的是宿主 GitHub 的 robots 限制（对 AI 爬虫按名设 Crawl-delay 并禁搜索页等路径）和二级限流。
- 端到端任务（人工介入时间，skill v0.1）：找卡并读指数 3 步零介入；开 Issue 一步要主人拍板（我们自己的规矩），同意后发出 Issue #1。三遍：一遍完成、两遍部分完成，人工介入 0 分。
- 证据目录 `evidence/2026-10-28-opc-cosmic-tree/`（`data.json` 逐项分与证据，`run-record.json` 任务记录，探测日志与快照）。方法版本 0.1。方法偏离：本机出网经代理；不适用项记 N/A 不入分母。评测人：维护方智能体，2026-10-28。
- 低分变工单：Gitee 镜像接通（国内镜像岗）；llms.txt 加搜索说明并改现名；加 CHANGELOG。
