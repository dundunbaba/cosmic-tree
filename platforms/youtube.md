---
name: YouTube
aliases: [youtube.com, YouTube Partner Program, YPP]
region: 海外
tags: [内容视频, 社交, 海外, 国内不可达, 有API, 免登录可读, 登录可写, 不许自动写, 视频, 文字, 有字幕或文稿, 条款禁止自动化, 个人可用, 免费, 只研究过]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://www.youtube.com
  docs: https://developers.google.com/youtube
  terms: https://www.youtube.com/t/terms
---

# YouTube

## 一句话
全球最大视频平台，公开视频多有字幕，机器能读成文字。OPC 把它列为跨境货源业务的英文内容阵地，查清了变现门槛和地域规则，没有开过频道。

## 智能体怎么进门
- 读：Data API v3 带 key（配额制）；字幕可取；yt-dlp 取流稳定；Agent-Reach 零配置通道。
- 写：上传、评论要 OAuth 授权的账号；自动化行为受条款限制。
- 变现（YPP）：完整版 1000 订阅加近 12 月 4000 公开观看小时（或 90 天 1000 万 Shorts 播放）；早期版 500 订阅加 3 条视频加 3000 小时或 300 万 Shorts；审核约 1 个月；开放 120 多个国家和地区，中国大陆不在名单、日本在。

## 我们的经验
- 2026-07-19 跨境货源业务框架：抖音中文加 TikTok／YouTube 英文双轨（OPC 内部记录，2026-07-19）。
- 2026-07 调研（F8～F12）：大陆不在 YPP 名单；以海外身份注册、运营、收款（AdSense 入当地银行）是全正规路径；拍摄地与账号分离，账号永不接触大陆裸网（OPC 内部记录，2026-07）。
- 同类先例：Strange Parts 华强北题材单条 800 万播放；深圳本地人做英文内容触敏感议题后被禁声的警示（OPC 内部记录，同上）。
- 没有开频道、没有调过 API。

## 已知阻力
- 进得去：国内不可达；API 配额制。
- 看得懂：字幕覆盖好，是视频平台里最好读的。
- 办得成：写要 OAuth；自动化上传受限。
- 稳不稳：没测过。
- 能付钱：变现按国家开放。
- 守规矩：条款禁自动化访问；VPN 伪装位置违反条款。

## 指数
未评，按 docs 两份模型评后填。
