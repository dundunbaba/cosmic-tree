---
name: 阿里云百炼
aliases: [百炼, DashScope, 通义千问 API, 阿里云 Coding Plan]
region: 全球
tags: [模型与AI服务, 云与托管, 全球, 国内可达, 有API, 有SDK, 登录可读, 实名可写, 结构化数据, 有结构化字段, 条款允许自动化, 个人可用, 免费额度, 按量, 付费, 在用]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://bailian.console.aliyun.com
  docs: https://help.aliyun.com/zh/model-studio/
  terms: https://help.aliyun.com/zh/model-studio/product-overview/terms-of-service
---

# 阿里云百炼

## 一句话
阿里云的大模型服务平台（通义千问、ASR、识图、生图），OpenAI 兼容接口。OPC 半年里真金白银用得最多的模型供应商，分两个钱袋：按量付费 key 给采集管线和评分，Coding Plan 套餐 key 给编程工具和内部语音讨论工具。

## 智能体怎么进门
- OpenAI 兼容的 HTTP 接口，带 key 即调；模型名直接填（qwen-plus、qwen3-max、qwen3-asr-flash 等）。
- 两种计费：按量付费（key 前缀 `sk-`）通用；Coding Plan 套餐（前缀 `sk-sp-`）只限编程工具使用。
- 控制台（用量、金额）只有网页，要主人登录；智能体查不到精确 token 和金额。
- OPC 内部统一走模型管理中心（NAS 上的 uni-api 加申请前台），请求带注册名，不直连厂商。

## 我们的经验
- 2026-06 起采集系统评分（qwen-plus）、ASR 转写（qwen3-asr-flash）、摘要（qwen3-max）全走按量 key；2026-08-25 实测按量口袋唯一还在烧的是 NAS 转写循环，近 30 天 69 篇，日封顶 3（OPC 内部记录，2026-08-25）。
- 2026-07-20 用量激增归因：最可能是内部多模型语音讨论工具重度测试走套餐通道，它是唯一零护栏的调用方（无每日上限、每条发言都调）；采集侧都有闸（OPC 内部记录，2026-07-20）。
- 合规坑：别拿 Coding Plan 套餐 key 做应用后端，它限编程工具用，违规会封号；后端只用按量 key（OPC 内部记录，2026-10-25）。
- 2026-10-09 实测：套餐网关按 User-Agent 拒收，不带 UA 回 405（"only available for Coding Agents"）；模型中心给国内厂商配了如实的 UA（OPC 内部记录，2026-10-09）。
- 2026-10-09 模型管理中心上线：百炼套餐和按量都接通；按量 key 当晚换新已推（OPC 内部记录，2026-10-09）。
- 财务盲点：财经模块里"阿里云百炼"金额为 null、待核对，没有自动告警（OPC 内部记录，2026-10-25）。
- 识图技能走百炼视觉模型（Coding Plan 端点或按量端点）（用户技能 `image-recognize`）。

## 已知阻力
- 进得去：API 顺；控制台和开票要人登录。
- 看得懂：OpenAI 兼容，字段标准；ASR 原生接口格式和 OpenAI 格式不同，接中心时要改。
- 办得成：两种 key 用途有条款边界；套餐网关认 UA。
- 稳不稳：接口稳定；用量和余额智能体看不到，只能靠自己记账本。
- 能付钱：充值要人在控制台做；按量计费、按时长计费（ASR）。
- 守规矩：条款允许程序调用；套餐限编程工具；底层接境内已备案模型是我们的合规前提（OPC 内部记录，2026-10-25）。

## 指数
未评，按 docs 两份模型评后填。
