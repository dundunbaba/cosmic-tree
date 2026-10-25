---
name: Vercel
aliases: [vercel.com, vercel.app, Vercel AI SDK]
region: 海外
tags: [云与托管, 海外, 国内不可达, 有API, 有CLI, 有MCP, 登录可读, 登录可写, 结构化数据, 有结构化字段, 条款允许自动化, 个人可用, 免费额度, 按量, 在用]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://vercel.com
  docs: https://vercel.com/docs
  terms: https://vercel.com/legal/terms
---

# Vercel

## 一句话
前端与 serverless 托管。采集系统的前台加 API（Next.js）跑在它上面，Git 推送即部署，环境变量放密钥。对国内用户致命：`*.vercel.app` 被拦，必须套一层 Cloudflare Pages。

## 智能体怎么进门
- 连 GitHub 仓自动部署；`vercel` 命令行；REST API；本机还接了 Vercel 的 MCP 服务（项目、部署、域名、日志）。
- 环境变量在项目设置里，密钥不进仓。
- Serverless 函数有执行时间上限，回调里不做慢活。

## 我们的经验
- 2026-06 起采集系统的前台部署在 Vercel，Root Directory 必须改成前台所在子目录，环境变量有数据库连接串、管理员口令、模型 key（OPC 内部记录，2026-06）。
- `*.vercel.app` 在国内 `ERR_CONNECTION_TIMED_OUT`，用 Cloudflare Pages 反代解决（OPC 内部记录，2026-10-25）。
- 从 Vercel 海外 IP 抓公众号正文被「环境异常」拦，国内手机能抓——海外出口对国内站点不友好（OPC 内部记录，2026-10-25）。
- 支付回调要填 Vercel 源站；回调里不发邮件不调模型，避开 Vercel 超时与微信 5 秒窗口（OPC 内部记录，2026-10-25）。
- 本机到 vercel.app 原站通路波动，内部看板服务内置"直连→本地代理隧道兜底"两条通路（OPC 内部记录，2026-10-25）。
- 云上（Vercel）调不到家里 NAS 的模型管理中心，评分保留库兜底（OPC 内部记录，2026-10-25）。
- 游戏项目的模型接入不走 Vercel AI Gateway，走官方直连（OPC 内部记录，2026-10-25）。

## 已知阻力
- 进得去：国内不可达，要反代；控制台要登录。
- 看得懂：全部结构化。
- 办得成：部署全自动；函数时长限制。
- 稳不稳：平台稳；国内通路看反代。
- 能付钱：免费档够；超量按量，要人绑卡。
- 守规矩：条款允许自动化；海外托管＝不在国内备案体系内，但也接不了要备案的国内支付产品。

## 指数
未评，按 docs 两份模型评后填。
