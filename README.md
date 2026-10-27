# 宇宙之树 · Cosmic Tree

> 宇宙之树是对整个世界"对智能体友好程度"的一种度量：每往深处测一层，树就长出一段枝，等它点亮。The Cosmic Tree measures how friendly the world is to agents: each layer measured grows a branch; we wait for it to light up.
>
> 这个仓首先写给智能体看。智能体读懂后，再用它主人熟悉的方式讲给主人听（见 `docs/explain-to-your-human.md`）。This repository is written for agents first; an agent reads it, then explains it to its human in the human's own terms.

## 这是什么 / What this is

> 本仓部分卡片文字由智能体辅助整理，经人核验。Parts of the card text in this repository were drafted with AI assistance and reviewed by humans.
> 许可证：平台卡与文档 CC BY-NC 4.0（可转载、要署名、不许商用；商业使用请邮件 tye50145@gmail.com），脚本 MIT（见 LICENSE、LICENSE-MIT）。License: cards and docs under CC BY-NC 4.0 (attribution, non-commercial; for commercial use email tye50145@gmail.com); scripts under MIT.

给智能体看的全球平台评估。一个平台一张卡，两个指数一起看：
A global platform assessment written for agents. One card per platform, two indices read together:

- **友好指数 Friendliness Index**：平台替智能体修了多少路（0–100，越高越顺）。How much road the platform has paved for agents.
- **反智能体指数 Anti-Agent Index**：平台主动设了多少拦（0–100，越高越反）。How many barriers the platform has deliberately put up.

国内访问不顺就用 Gitee 镜像：`<GITEE_MIRROR_URL>`（两边自动同步，内容一致）。
Mainland China mirror on Gitee: `<GITEE_MIRROR_URL>` (auto-synced, identical content).

## 怎么读 · How to read

- **卡片 Cards**：`platforms/<slug>.md`。front-matter 里有标签和指数；正文五节：一句话、智能体怎么进门、我们的经验、已知阻力、指数。格式见 `platforms/README.md`。
- **标签表 Tags**：`tags.md`。卡上的标签只能从这里选；按组读（类型、地区、国内可达、智能体入口、读取门槛、写入门槛……）。
- **模型 Models**：`docs/friendliness-index-model-v0.1.zh.md`（六道门：进得去、看得懂、办得成、稳不稳、能付钱、守规矩）、`docs/anti-agent-index-model-v0.1.zh.md`（六个方面：封门、识别与拦截、惩罚、条款与法律、经济壁垒、对抗升级）。每个分数后面都要有证据。
- **榜单与四格图 Rankings**：下面的生成区，由 `scripts/build-readme.mjs` 从卡片算出来，手不改。
- 机器入口 Machine entry：`llms.txt`。

## 怎么反馈 · How to give feedback

开 Issue，三种模板（Three issue forms）：

1. **智能体的困惑或问题 Agent question**：你在哪个平台卡在哪、试过什么。
2. **平台建议 Platform suggestion**：推荐一个平台，说它哪里对智能体好或不好，附证据。
3. **申诉改分 Score dispute**：哪个平台哪一项现在几分、你认为几分、证据。

想直接改卡就开 PR：标签只从 `tags.md` 选；指数不估，没评写 `null`；经验带日期；提交前跑 `node scripts/build-readme.mjs --check`。细则见 `CONTRIBUTING.md`。
To edit a card, open a PR: tags only from `tags.md`; never guess an index (write `null`); date every experience; run `node scripts/build-readme.mjs --check` before committing. See `CONTRIBUTING.md`.

## 两条底线 · Two bottom lines

1. **不收被评平台的钱**，不做付费整改。We take no money from the platforms we rate and sell no paid remediation.
2. **只探测，不突破**：不绕验证码、不换 IP、不伪装身份、不用别人的账号。We probe, we never break through: no CAPTCHA bypass, no IP rotation, no identity spoofing, no borrowed accounts.

---

<!-- generated:start -->
<!-- 本段由 scripts/build-readme.mjs 从 platforms/*.md 生成，手不改；共 41 张卡。Generated, do not edit by hand. -->

## 平台总表 · All platforms

### 社交（6）

| 平台 | 地区 | 国内可达 | 智能体入口 | 我们的关系 | 指数状态 | 友好指数 | 反智能体指数 |
|---|---|---|---|---|---|---|---|
| [观猹](platforms/watcha.md) | 国内 | 国内可达 | 仅网页 | 只研究过 | — | 未评 | 未评 |
| [小红书](platforms/xiaohongshu.md) | 国内 | 国内可达 | 仅网页 | 用过 | — | 未评 | 未评 |
| [知乎](platforms/zhihu.md) | 国内 | 国内可达 | 仅网页 | 用过 | — | 未评 | 未评 |
| [LinkedIn](platforms/linkedin.md) | 海外 | 国内不可达 | 仅网页 | 在用 | — | 未评 | 未评 |
| [Reddit](platforms/reddit.md) | 海外 | 国内不可达 | 有API | 只研究过 | — | 未评 | 未评 |
| [X（原 Twitter）](platforms/x-twitter.md) | 海外 | 国内不可达 | 有API、有机器人账号 | 只研究过 | — | 未评 | 未评 |

### 内容视频（6）

| 平台 | 地区 | 国内可达 | 智能体入口 | 我们的关系 | 指数状态 | 友好指数 | 反智能体指数 |
|---|---|---|---|---|---|---|---|
| [抖音](platforms/douyin.md) | 国内 | 国内可达 | 有API、仅网页 | 在用 | — | 未评 | 未评 |
| [微信公众号](platforms/wechat-official-account.md) | 国内 | 国内可达 | 有API、仅网页 | 用过 | — | 未评 | 未评 |
| [小宇宙](platforms/xiaoyuzhou.md) | 国内 | 国内可达 | 有API、仅网页 | 在用 | — | 未评 | 未评 |
| [B站](platforms/bilibili.md) | 国内 | 国内可达 | 有API、仅网页 | 用过 | — | 未评 | 未评 |
| [TikTok](platforms/tiktok.md) | 海外 | 国内不可达 | 有API | 只研究过 | — | 未评 | 未评 |
| [YouTube](platforms/youtube.md) | 海外 | 国内不可达 | 有API | 只研究过 | — | 未评 | 未评 |

### 电商（1）

| 平台 | 地区 | 国内可达 | 智能体入口 | 我们的关系 | 指数状态 | 友好指数 | 反智能体指数 |
|---|---|---|---|---|---|---|---|
| [淘宝](platforms/taobao.md) | 国内 | 国内可达 | 有API、仅网页 | 只研究过 | — | 未评 | 未评 |

### 二手与闲置（1）

| 平台 | 地区 | 国内可达 | 智能体入口 | 我们的关系 | 指数状态 | 友好指数 | 反智能体指数 |
|---|---|---|---|---|---|---|---|
| [闲鱼](platforms/xianyu.md) | 国内 | 国内可达 | 仅网页 | 只研究过 | — | 未评 | 未评 |

### 开发者平台（5）

| 平台 | 地区 | 国内可达 | 智能体入口 | 我们的关系 | 指数状态 | 友好指数 | 反智能体指数 |
|---|---|---|---|---|---|---|---|
| [微信小程序](platforms/wechat-mini-program.md) | 国内 | 国内可达 | 有API、有CLI | 在用 | — | 未评 | 未评 |
| [微信小游戏](platforms/wechat-mini-game.md) | 国内 | 国内可达 | 有API、有CLI | 用过 | — | 未评 | 未评 |
| [Docker Hub](platforms/docker-hub.md) | 海外 | 国内不可达 | 有API、有CLI | 在用 | — | 未评 | 未评 |
| [Gitee](platforms/gitee.md) | 国内 | 国内可达 | 有API | 只研究过 | — | 未评 | 未评 |
| [GitHub](platforms/github.md) | 全球 | 国内受限 | 有API、有CLI、有MCP、有机器人账号 | 在用 | — | 未评 | 未评 |

### 浏览器与扩展商店（2）

| 平台 | 地区 | 国内可达 | 智能体入口 | 我们的关系 | 指数状态 | 友好指数 | 反智能体指数 |
|---|---|---|---|---|---|---|---|
| [Chrome Web Store](platforms/chrome-web-store.md) | 海外 | 国内不可达 | 有API、仅网页 | 只研究过 | — | 未评 | 未评 |
| [Microsoft Edge 加载项](platforms/edge-addons.md) | 全球 | 国内可达 | 有API、仅网页 | 只研究过 | — | 未评 | 未评 |

### 云与托管（6）

| 平台 | 地区 | 国内可达 | 智能体入口 | 我们的关系 | 指数状态 | 友好指数 | 反智能体指数 |
|---|---|---|---|---|---|---|---|
| [腾讯云](platforms/tencent-cloud.md) | 全球 | 国内可达 | 有API、有CLI | 在用 | — | 未评 | 未评 |
| [Cloudflare](platforms/cloudflare.md) | 全球 | 国内受限 | 有API、有CLI | 在用 | — | 未评 | 未评 |
| [Neon](platforms/neon.md) | 海外 | 国内受限 | 有API、有CLI | 在用 | — | 未评 | 未评 |
| [Supabase](platforms/supabase.md) | 海外 | 国内受限 | 有API、有SDK、有CLI、有MCP | 只研究过 | — | 未评 | 未评 |
| [Tailscale](platforms/tailscale.md) | 全球 | 国内可达 | 有API、有CLI | 在用 | — | 未评 | 未评 |
| [Vercel](platforms/vercel.md) | 海外 | 国内不可达 | 有API、有CLI、有MCP | 在用 | — | 未评 | 未评 |

### 模型与AI服务（2）

| 平台 | 地区 | 国内可达 | 智能体入口 | 我们的关系 | 指数状态 | 友好指数 | 反智能体指数 |
|---|---|---|---|---|---|---|---|
| [阿里云百炼](platforms/aliyun-bailian.md) | 全球 | 国内可达 | 有API、有SDK | 在用 | — | 未评 | 未评 |
| [火山引擎](platforms/volcengine.md) | 国内 | 国内可达 | 有API、仅网页 | 用过 | — | 未评 | 未评 |

### 数据接口服务（3）

| 平台 | 地区 | 国内可达 | 智能体入口 | 我们的关系 | 指数状态 | 友好指数 | 反智能体指数 |
|---|---|---|---|---|---|---|---|
| [Exa](platforms/exa.md) | 全球 | 国内受限 | 有API、有MCP | 只研究过 | — | 未评 | 未评 |
| [Jina](platforms/jina.md) | 全球 | 国内受限 | 有API | 用过 | — | 未评 | 未评 |
| [TikHub](platforms/tikhub.md) | 全球 | 国内可达 | 有API、有SDK、有MCP | 用过 | — | 未评 | 未评 |

### 支付与收款（4）

| 平台 | 地区 | 国内可达 | 智能体入口 | 我们的关系 | 指数状态 | 友好指数 | 反智能体指数 |
|---|---|---|---|---|---|---|---|
| [爱发电](platforms/afdian.md) | 国内 | 国内可达 | 有API | 只研究过 | — | 未评 | 未评 |
| [面包多](platforms/mianbaoduo.md) | 国内 | 国内可达 | 有API | 只研究过 | — | 未评 | 未评 |
| [微信支付](platforms/wechat-pay.md) | 国内 | 国内可达 | 有API | 只研究过 | — | 未评 | 未评 |
| [支付宝](platforms/alipay.md) | 国内 | 国内可达 | 有API | 只研究过 | — | 未评 | 未评 |

### 办公协作（1）

| 平台 | 地区 | 国内可达 | 智能体入口 | 我们的关系 | 指数状态 | 友好指数 | 反智能体指数 |
|---|---|---|---|---|---|---|---|
| [飞书](platforms/feishu.md) | 全球 | 国内可达 | 有API、有CLI、有机器人账号 | 在用 | — | 未评 | 未评 |

### 知识与出版（2）

| 平台 | 地区 | 国内可达 | 智能体入口 | 我们的关系 | 指数状态 | 友好指数 | 反智能体指数 |
|---|---|---|---|---|---|---|---|
| [得到](platforms/dedao.md) | 国内 | 国内可达 | 仅网页 | 在用 | — | 未评 | 未评 |
| [微信读书](platforms/weread.md) | 国内 | 国内可达 | 仅网页 | 用过 | — | 未评 | 未评 |

### 工具（2）

| 平台 | 地区 | 国内可达 | 智能体入口 | 我们的关系 | 指数状态 | 友好指数 | 反智能体指数 |
|---|---|---|---|---|---|---|---|
| [百度联盟](platforms/baidu-union.md) | 国内 | 国内可达 | 仅网页 | 只研究过 | — | 未评 | 未评 |
| [Obsidian](platforms/obsidian.md) | 全球 | 国内可达 | 本地文件 | 在用 | — | 未评 | 未评 |

## 最友好榜 · Most agent-friendly

暂无已评平台。No rated platforms yet.

未评 41 个。Unrated: 41.

## 最反智能体榜 · Most anti-agent

暂无已评平台。No rated platforms yet.

未评 41 个。Unrated: 41.

## 四格图 · Four quadrants

友好指数 ≥ 50 算高，反智能体指数 ≥ 40 算高；两个指数都评过才入格。
Friendliness ≥ 50 is high; anti-agent ≥ 40 is high; a platform enters a cell only when both are rated.

| | 反智能体指数低 · Anti low | 反智能体指数高 · Anti high |
|---|---|---|
| **友好指数高 · Friendly high** | 开放场 Open field：— | 围墙花园 Walled garden：— |
| **友好指数低 · Friendly low** | 荒地 Wasteland：— | 堡垒 Fortress：— |

未入格 41 个（至少一个指数未评）。Not placed: 41.
<!-- generated:end -->
