---
name: Chrome Web Store
aliases: [CWS, chromewebstore.google.com, Chrome 应用商店]
region: 海外
tags: [浏览器与扩展商店, 海外, 国内不可达, 有API, 仅网页, 免登录可读, 实名可写, 文字, 结构化数据, 条款允许自动化, 个人可用, 付费, 只研究过]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://chromewebstore.google.com
  docs: https://developer.chrome.com/docs/webstore
  terms: https://developer.chrome.com/docs/webstore/program-policies
---

# Chrome Web Store

## 一句话
Chrome 扩展的官方分发渠道。OPC 2026-07 把"浏览器插件"当出海获客和收款的长线，查清了注册、审核、Trader 公示、国内被墙等全部门槛，没有真上架。

## 智能体怎么进门
- 开发者注册 5 美元一次性（双币卡，虚拟卡渠道 2025-07 被清掉）；邮箱永久绑定。
- 上架：Developer Dashboard 网页加 Chrome Web Store API（上传、发布可自动化）。
- 审核零容忍：混淆代码、未申报远程代码；最小权限（activeTab 加 storage）走快队 1～3 天，宽权限深审 2～4 周。
- 收费须报 Trader 并公开姓名、电话、地址于商店页（欧盟要求）；报 non-trader 却收费＝误报有下架风险。

## 我们的经验
- 2026-07 调研（OPC 内部记录，2026-07）：CWS 大陆被墙，经它分发只触达海外加翻墙用户；国内分发另走 Edge 加载项；收款 ExtensionPay／Stripe 对大陆个人是死路，Creem 为首选。
- Trader 公示的代价：真实姓名、住址、电话永久公开可爬，与自媒体匿名策略冲突；能否在分发区域排除欧盟待实测（OPC 内部记录，2026-10-25）。
- 2026-07-09 业务点子池：插件是案例复刻第一发，manifest v3 周末级开发（OPC 内部记录，2026-07-09）。
- 采集系统的采集插件只以开发者模式本地加载，没上商店（OPC 内部记录，2026-10-25）。

## 已知阻力
- 进得去：国内不可达；注册要海外双币卡。
- 看得懂：政策文档公开。
- 办得成：上传发布有 API；审核是人机混合，周期不定。
- 稳不稳：没测过。
- 能付钱：5 美元注册要人付；商店内付费要 Trader。
- 守规矩：程序政策严；欧盟 Trader 公示。

## 指数
未评，按 docs 两份模型评后填。
