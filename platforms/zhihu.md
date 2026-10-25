---
name: 知乎
aliases: [zhihu.com]
region: 国内
tags: [社交, 知识与出版, 国内, 国内可达, 仅网页, 登录可读, 实名可写, 不许自动写, 文字, 脚本渲染为主, 条款禁止自动化, 个人可用, 免费, 用过]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://www.zhihu.com
  docs: https://www.zhihu.com/term/zhihu-terms
  terms: https://www.zhihu.com/term/zhihu-terms
---

# 知乎

## 一句话
国内最大的问答与专栏社区，长文密度高。采集系统把它当高相关信源，但公共 RSSHub 被 403 挡住，只能自建加 cookie。

## 智能体怎么进门
- 读：网页接口（api/v4）对机房 IP 做动态签名校验（`__zse_ck`），匿名多被 403；作者级内容要登录 cookie（`z_c0`／`d_c0`）。热榜等少数路由不要 cookie。
- 工具：自建 RSSHub 注入 cookie 代为签名；MediaCrawler；付费第三方 TikHub 含知乎接口。
- 官方：无内容 API（只有营销类）。
- 写：没有发布接口。

## 我们的经验
- 公共 RSSHub（rsshub.app）加 GitHub Actions 拉知乎长期 403——知乎反爬加挡机房 IP；定时任务曾每 6 小时空跑浪费配额，已停（OPC 内部记录，2026-10-25）。
- 2026-07-20：RSSHub 已自建在 NAS，只绑回环端口不对外；`/zhihu/hot` 热榜无 cookie 实测出真实条目；作者级路由匿名 403，等主人提供 cookie；新版 RSSHub 删了旧文章路由，路径改名（OPC 内部记录，2026-07-20）。
- 工具调研：Scrapling 的 StealthyFetcher 被列为绕知乎反爬的候选（OPC 内部记录，2026-10-25）。

## 已知阻力
- 进得去：机房 IP 签名校验、登录墙；通用搜索对其覆盖差（Agent-Reach 为它单做渠道）。
- 看得懂：正文是文字，提取后质量好；页面脚本渲染，直取是空壳。
- 办得成：没有写入通道。
- 稳不稳：RSSHub 路由会改名、删除；cookie 过期要人重登。
- 能付钱：不涉及。
- 守规矩：条款禁爬；自建 RSSHub 加本人 cookie 属个人低频自用。

## 指数
未评，按 docs 两份模型评后填。
