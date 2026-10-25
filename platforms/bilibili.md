---
name: B站
aliases: [哔哩哔哩, bilibili, bilibili.com]
region: 国内
tags: [内容视频, 社交, 国内, 国内可达, 有API, 仅网页, 免登录可读, 登录可读, 实名可写, 不许自动写, 视频, 文字, 有字幕或文稿, 脚本渲染为主, 条款未提, 个人可用, 免费, 用过]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://www.bilibili.com
  docs: https://openhome.bilibili.com
  terms: https://www.bilibili.com/blackboard/account-useragreement.html
---

# B站

## 一句话
国内长视频社区，很多视频带 CC 字幕，是少数"内容能读成文字"的国内视频平台。采集系统把它当重点信源，全自动采集跑通过，后来主动停机维持。

## 智能体怎么进门
- 读：网页接口公开但带 wbi 签名，要全套 cookie（只带 SESSDATA 会撞 412）；搜索和视频详情无登录也能部分读；字幕 CC 能取，没有的要 ASR。
- 工具：bilibili-api、bilibili-API-collect 文档、yt-dlp（B站下载稳定）、bili-cli；Agent-Reach 把 B站搜索和详情做成零配置通道。
- 官方：哔哩哔哩开放平台偏创作者自有数据，规模化采集没有正规授权路径。
- 写：没有给第三方的发布接口。

## 我们的经验
- 2026-06-01：在独立 Chrome Profile 里人工登录专用运营账号，复制 SESSDATA 用 DPAPI 加密保存；采集器用真实 uid 跑通入库（OPC 内部记录，2026-06-01）。
- 412 根因：只存 SESSDATA 撞 wbi 接口 412，补齐全套 cookie 后消失——412 是"指纹不全"不是硬风控（OPC 内部记录，2026-10-25）。
- 请求纪律：轮次 5～8 小时随机浮动、请求间随机停顿、单轮单日预算、失败后 1／6／24 小时阶梯冷却、连续 4 次失败熔断停机必须人工显式恢复（OPC 内部记录，2026-10-25）。
- 红线："B站停机维持"；专用账号不用日常号、不代理轮换、不绕验证码（OPC 内部记录，2026-10-25）。
- 归因教训（2026-07-11）：B站 9 条被按平台猜成"手机分享"，实为插件和代投——埋点缺失不许估算当事实（OPC 内部记录，2026-10-25）。

## 已知阻力
- 进得去：wbi 签名加全套 cookie；无登录能读的只是一部分；账号被识别为自动访问会受限。
- 看得懂：字幕 CC 覆盖不全，缺的要 ASR；页面是脚本渲染。
- 办得成：没有第三方发布接口。
- 稳不稳：接口签名改版会让工具失效；要备选链（Agent-Reach 的 bili-cli→公开接口）。
- 能付钱：不涉及。
- 守规矩：用户协议未明写自动化；规模扩大应评估开放平台。

## 指数
未评，按 docs 两份模型评后填。
