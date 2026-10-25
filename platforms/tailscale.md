---
name: Tailscale
aliases: [tailscale.com, tailnet, Tailscale SSH]
region: 全球
tags: [云与托管, 工具, 全球, 国内可达, 有API, 有CLI, 登录可读, 登录可写, 结构化数据, 条款允许自动化, 个人可用, 免费额度, 在用]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://tailscale.com
  docs: https://tailscale.com/kb
  terms: https://tailscale.com/terms
---

# Tailscale

## 一句话
基于 WireGuard 的私有组网。OPC 的 PC、NAS、手机都在一个 tailnet 里，智能体和 PC 访问 NAS 服务一律写 Tailscale 地址，局域网地址只作备用。半年来是所有基础设施里最省心的一块。

## 智能体怎么进门
- 装客户端登录（OAuth）即自动入网；`tailscale status`、`tailscale ip` 看节点和地址；`tailscale serve` 做端口转发；Tailscale SSH。
- 管理控制台在官网，要主人登录；有 API 和 ACL。
- 本机常驻两个进程。

## 我们的经验
- 2026-07-09 盘点：实际在用的隧道只有 Tailscale 加 Cloudflare Pages，没有 frp、zerotier、ngrok 等（OPC 内部记录，2026-07-09）。
- NAS 经 Tailscale SSH 直连不走公网；tailnet 里有两台长期 offline 的旧节点，别连错（OPC 内部记录，2026-10-25）。
- 2026-10-16 NAS 局域网地址变了，13 处内部文档网址、2 个 NAS 服务跟着断；PC 端走 Tailscale 的没事——于是定规矩"给 Agent 和 PC 用的地址一律写 Tailscale 地址"（OPC 内部记录，2026-10-16）。
- 2026-10-17 `tailscale serve` 转发目标指错局域网地址，别的设备经 Tailscale 来被重置，NAS 本机测不出来；已改（OPC 内部记录，2026-10-17）。
- 内部看板同时监听本机回环和 Tailscale 地址、不碰 0.0.0.0；防火墙要放行 Tailscale 的保留网段（OPC 内部记录，2026-10-25）。
- 巡检：Tailscale 掉线会让备份包级失败，次日自动补（OPC 内部记录，2026-10-25）。

## 已知阻力
- 进得去：国内可用；控制台要人登录。
- 看得懂：命令行输出清楚。
- 办得成：自动化顺；ACL 要在控制台改。
- 稳不稳：客户端稳；掉线会连带下游任务失败。
- 能付钱：个人免费档够 OPC 用。
- 守规矩：条款允许。

## 指数
未评，按 docs 两份模型评后填。
