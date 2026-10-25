---
name: Cloudflare
aliases: [Cloudflare Pages, pages.dev, Cloudflare Workers, workers.dev]
region: 全球
tags: [云与托管, 域名与备案, 全球, 国内受限, 有API, 有CLI, 登录可读, 登录可写, 结构化数据, 有结构化字段, 条款允许自动化, 个人可用, 免费额度, 按量, 在用]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://www.cloudflare.com
  docs: https://developers.cloudflare.com/pages/
  terms: https://www.cloudflare.com/terms/
---

# Cloudflare

## 一句话
CDN、DNS、边缘函数与静态托管。OPC 用 Cloudflare Pages 当采集系统的国内访问反代：`*.pages.dev` 国内可达、`*.vercel.app` 不可达，所以国内用户和 NAS 都走 pages.dev 转到 Vercel。零服务器、免费、仓里一个目录。

## 智能体怎么进门
- Pages：连 Git 仓自动部署，Functions 目录写边缘函数（我们用 catch-all 反代）；Dashboard 要登录；也有 `wrangler` 命令行和 API。
- 免费档 Pages 足够做反代；自有域名要把 DNS 托管过来。
- 国内可达性：实测 pages.dev 可达、workers.dev 不行；随网络环境变，没有永久方案。

## 我们的经验
- 2026-06：采集系统用一个独立 Pages 项目、一个 catch-all 边缘函数把全部请求反代到 Vercel 源站；Dashboard 里 Root directory 填该目录、build 留空、输出 `public`（OPC 内部记录，2026-06）。
- 内部记录：实际在用的隧道只有 Tailscale（组网）加 Cloudflare Pages（公网反代）两条；反代无需密钥（OPC 内部记录，2026-10-25）。
- NAS 采集器 POST 到 pages.dev 域名而不是 vercel.app（被墙）（OPC 内部记录，2026-10-25）。
- 支付回调 `notify_url` 要填 Vercel 源站不填 pages.dev：少一跳，且绕开微信老服务器对共享 IP 加 SNI 握手不可靠的坑（OPC 内部记录，2026-10-25）。
- 调研时 Scrapling 的 StealthyFetcher 号称能绕 Cloudflare Turnstile——作为被评平台时，Turnstile 是它给别人设的门（OPC 内部记录，2026-10-25）。
- 自有域名走 Cloudflare 代理"免费但国内线路看脸"（OPC 内部记录，2026-10-25）。

## 已知阻力
- 进得去：pages.dev 国内可达但随 GFW 变；Dashboard 要登录。
- 看得懂：文档和 API 结构化。
- 办得成：部署可全自动（Git 推送即部署）。
- 稳不稳：免费 IP 国内时好时坏；Turnstile 会拦无头浏览器。
- 能付钱：免费档够用；付费要人绑卡。
- 守规矩：条款允许自动化；用它反代海外站到国内，备案和支付接口是另一回事。

## 指数
未评，按 docs 两份模型评后填。
