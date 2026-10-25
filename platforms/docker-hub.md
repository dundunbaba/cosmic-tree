---
name: Docker Hub
aliases: [hub.docker.com, registry-1.docker.io]
region: 海外
tags: [开发者平台, 云与托管, 海外, 国内不可达, 有API, 有CLI, 免登录可读, 登录可写, 结构化数据, 条款允许自动化, 个人可用, 免费额度, 在用]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://hub.docker.com
  docs: https://docs.docker.com/docker-hub/
  terms: https://www.docker.com/legal/docker-terms-service/
---

# Docker Hub

## 一句话
容器镜像仓库。OPC 的 NAS 上十几个容器的基础镜像都从这里来，但 NAS 直连超时，只能靠国内镜像站，镜像站又各有脾气。它是"国内不可达的基础设施"最典型的样本。

## 智能体怎么进门
- `docker pull`；`/etc/docker/daemon.json` 配 `registry-mirrors` 换镜像站；拉不动就本机 `docker save | gzip | ssh … docker load` 直传。
- 匿名拉取有限频；登录后更高。

## 我们的经验
- NAS 直连 Docker Hub 超时，配了镜像源 `docker.m.daocloud.io`、`docker.1ms.run`，`kill -HUP dockerd` 重载（OPC 内部记录，2026-10-25）。
- 镜像站脾气：hub.rat.dev 只能服务已缓存镜像、拉不到新 python；daocloud 白名单拒、南大 403，拉 wewe-rss 只有 `docker.1ms.run` 能拉（韧性重试磨下来）；基础镜像由 slim 改 alpine（层小）（OPC 内部记录，2026-10-25）。
- 2026-10-09 拉 uni-api：两个镜像站都极慢（daocloud 拒绝；1ms.run 40 秒 150KB），改为本机 save 打包经 SSH 传 NAS load，3 秒传完、4 层校验值一致——以后升级照此（OPC 内部记录，2026-10-09）。
- 本机 Docker Desktop 在非默认目录，Linux engine 没连上时命令会卡（OPC 内部记录，2026-10-25）。

## 已知阻力
- 进得去：国内直连不通；镜像站不稳、有白名单。
- 看得懂：镜像清单结构化。
- 办得成：拉得动就全自动；拉不动要人工搬运。
- 稳不稳：镜像站说变就变。
- 能付钱：免费档匿名限频。
- 守规矩：条款允许。

## 指数
未评，按 docs 两份模型评后填。
