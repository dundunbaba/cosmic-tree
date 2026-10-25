---
name: 小宇宙
aliases: [小宇宙FM, xiaoyuzhoufm.com]
region: 国内
tags: [内容视频, 知识与出版, 国内, 国内可达, 有API, 仅网页, 免登录可读, 登录可写, 音频, 文字, 有结构化字段, 条款未提, 个人可用, 免费, 在用]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://www.xiaoyuzhoufm.com
  docs: https://www.xiaoyuzhoufm.com
  terms: https://www.xiaoyuzhoufm.com/terms
---

# 小宇宙

## 一句话
国内主流播客平台。绝大多数节目提供标准 RSS 2.0（带 Apple Podcasts 扩展），不要登录就能订阅——这是国内少见的"对机器开门"的平台，采集系统用它跑通了音频转写入库全链路。

## 智能体怎么进门
- 读：节目详情页"分享→RSS 订阅"拿 feed 地址（OPC 内部记录，2026-10-25）；也可从 Listen Notes 搜、从播客客户端导 OPML。音频 enclosure 国内直接可下。
- 极少数节目 RSS 不公开，要走私有接口（需登录、抓包），我们标为"需人工"。
- 写：评论、发布无接口。

## 我们的经验
- 2026-06-02 接入指南建档；2026-06-16 全链真机验收：节目 feed→enclosure→下载 50MB 音频（国内可达）→ffmpeg 切块→ASR→摘要→写文档→入库，一条 30 分钟中文播客转出 19,573 字（OPC 内部记录，2026-06-02）。
- 2026-08-25：NAS 转写循环近 30 天出 69 篇，日封顶 3 条，产出落在"小宇宙"目录——是阿里云按量口袋唯一确认还在烧钱的调用点（OPC 内部记录，2026-08-25）。

## 已知阻力
- 进得去：几乎没有，公开 RSS 加公开音频。
- 看得懂：内容锁在音频里，要 ASR（每篇 20～60 分钟，ASR 按时长计费是成本大头）；shownotes 文字可直接读。
- 办得成：只读；无写入。
- 稳不稳：feed 托管分散在多家，个别节目换托管会断。
- 能付钱：不涉及。
- 守规矩：条款没写自动化；RSS 是节目主动公开的订阅口。

## 指数
未评，按 docs 两份模型评后填。
