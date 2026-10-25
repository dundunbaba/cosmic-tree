---
name: GitHub
aliases: [github.com, GitHub Actions, GitHub Pages]
region: 全球
tags: [开发者平台, 云与托管, 全球, 国内受限, 有API, 有CLI, 有MCP, 有机器人账号, 免登录可读, 登录可写, 文字, 结构化数据, 有结构化字段, 条款允许自动化, 个人可用, 免费额度, 在用]
friendliness_index: null
anti_agent_index: null
index_status: 未评
last_reviewed: 2026-10-25
links:
  home: https://github.com
  docs: https://docs.github.com
  terms: https://docs.github.com/site-policy
---

# GitHub

## 一句话
全球代码托管平台，也是 OPC 全部仓库的异地备份、政策知识库的发布面、众测结果的交接通道。对智能体几乎是最开门的平台：API、`gh` 命令行、部署密钥、Actions 全有；唯一的硬阻力是大陆裸连不稳。

## 智能体怎么进门
- `gh` 命令行（本机已装）、REST／GraphQL API、Git over SSH；部署密钥可以只给单仓写权限，不用账号级 token。
- Actions：公网 feed 定时采集、安卓包构建都在上面跑；机房 IP 对国内站点常 403。
- 读公开仓不要登录；写要身份。

## 我们的经验
- 规矩：新建代码仓默认 GitHub 私库做异地备份；代码仓 merge 完即 push，不过夜；本仓也是私库起步，公开时间由维护者定（OPC 内部记录，2026-10-25）。
- 2026-10-19 政策知识库收集程序上 NAS：推 GitHub 用只对本仓有写权限的部署密钥，私钥不出 NAS；推 GitHub 是唯一出境连接，直连不走 VPN，推不上留本地下一轮再推；首轮和强制轮 33 页 0 失败（OPC 内部记录，2026-10-19）。
- 2026-06-13：采集系统 RSS 扩源在 Actions 全自动跑 9 个公网 feed，日约 24 条；但 Actions 加公共 RSSHub 拉知乎 403，机房 IP 被挡（OPC 内部记录，2026-06-13）。
- 安卓采集 App 用 Actions 出 debug APK 到 Artifacts，主人从网页下载——微信拦 apk 下载链，要外部传机（OPC 内部记录，2026-10-25）。
- 众测：模型结果只走 GitHub 分支，每阶段推分支、我们 fetch 做导览（OPC 内部记录，2026-10-25）。
- 大陆裸连困难（DNS 污染、克隆失败），面向小白用户的链接改 Gitee 镜像（OPC 内部记录，2026-10-25）。
- AUP 允许 README 放与项目相关的推广，禁"主要目的是营销"的空壳仓（OPC 内部记录，2026-10-25）。
- 开源准备：vault 原始知识永不公开，工具与系统可开源（OPC 内部记录，2026-10-25）。

## 已知阻力
- 进得去：国内裸连不稳，要代理或镜像；API 限频按 token。
- 看得懂：全部结构化；Markdown 是一等公民。
- 办得成：写入全程可自动化；部署密钥能做最小权限。
- 稳不稳：稳；Actions 机房 IP 对国内源不友好。
- 能付钱：免费档够私库和 Actions 小量；付费要人绑卡。
- 守规矩：条款允许自动化；AUP 对营销壳仓有裁量。

## 指数
未评，按 docs 两份模型评后填。
