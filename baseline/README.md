# 基线库 · Baseline

> 宇宙之树评友好度时拿来对标和核事实的客观数据源清单。第一波：全球知名的免费网站或信息库。每个源一条，带权威等级（只分三级）、进门方式、条款态度、证据与核验日期。数据在 `sources.json`，下面的表由 `scripts/build-baseline.mjs` 生成，手不改。
> The baseline: well-known free websites and information sources that evaluations compare against and verify facts with. Three authority tiers. Data lives in `sources.json`; the tables below are generated.

## 为什么要有基线

一份友好度评估说"这个网站对智能体不友好"，得有对照：同类的别家要不要人介入、差在哪一步。基线库就是这组对照和核事实的源，别的智能体不必再满世界找，省它们的搜索时间和 token。基线库是仓以后维护的底线：评估的权重和可信度都挂在这些源上。

## 权威等级（三级）与权重

| 等级 | 判据 | 权重 | 例 |
|---|---|---|---|
| **一级 一手权威** | 信息由发布主体自己出，出错能追到主体：政府统计与法规、标准组织、学术原文与索引、平台官方文档、软件包注册中心、原始档案 | 1.0 | 政府网、arXiv、PyPI、Internet Archive |
| **二级 有编辑或同行机制** | 二手汇编但有编辑规则、引用要求、投票或同行校正 | 0.7 | 维基百科、Wikidata、MDN、高票问答 |
| **三级 社区与聚合** | 帖子、评论、投票榜，质量靠个人，用前要复核 | 0.4 | Reddit、Hacker News、知乎 |

用法：一份评估引用的事实，按来源等级加权平均，得到 0 到 1 的"证据可信度"（见 `skills/agent-friendliness-eval/SKILL.md` 第三节）。一个源取它的主用途定级；同一源不同板块差别大的，在 `authority.why` 里写明。

等级和权重是 CEO 2026-10-28 定"前期分 3 个等级就够了"后由维护方初评，以后按使用数据调。调级要开 PR，说明旧级、新级、依据。

## 字段

| 字段 | 意思 | 取值 |
|---|---|---|
| `id` | 引用用的短名 | 小写字母、数字、连字符 |
| `kind` | 类别 | 百科与知识图谱、档案与数字图书馆、学术与论文、开发者文档、软件包与模型仓、开放数据、地图与地理、社区问答、新闻与聚合、政务与法规、代码托管 |
| `agent_entry` | 智能体进门方式 | 有API、有数据下载、有MCP、有SDK、有llms.txt、robots允许、robots限制、仅网页 |
| `automation_terms` | 条款对自动化的态度 | 允许、有限、禁止、未提 |
| `cn_reach` | 中国大陆可达性（只认大陆网络实测或公开常识，写明理由） | 国内可达、国内受限、国内不可达、未知 |
| `free` | 费用 | 免费、免费额度、部分付费 |
| `authority` | 权威等级与一句理由 | `{ tier: 1/2/3, why }` |
| `evidence[]` | 每个事实的证据 | `{ claim, url, quote, date }` |
| `checked_at` | 核验日期 | YYYY-MM-DD |

## 怎么加一个源、怎么改

- 推荐新源：开 Issue 用"平台建议"模板，说它是什么、免费不、为什么够格进基线、你看到的 robots 和条款原文。
- 直接改：开 PR 改 `sources.json`，跑 `node scripts/build-baseline.mjs` 重新生成本页，再 `--check` 退出码 0。
- 取证只探测不突破；不写账号、key。核验超过 6 个月的条目算过期，复核后更新 `checked_at`。
- 第一波 28 个源由维护方的智能体 2026-10-28 探测整理，经人核验；标"未知"的就是没查到，不是没有。

---

<!-- generated:start -->
<!-- 本段由 scripts/build-baseline.mjs 从 baseline/sources.json 生成，手不改；共 28 个源。Generated, do not edit by hand. -->

## 按权威等级 · By authority tier

### 一级 一手权威（权重 1.0，15 个）

| id | 源 | 类别 | 地区 | 国内可达 | 智能体入口 | 条款对自动化 | 费用 | 等级理由 | 核验 |
|---|---|---|---|---|---|---|---|---|---|
| `github` | [GitHub](https://github.com) | 代码托管 | 全球 | 国内受限 | 有API、有MCP、有llms.txt、robots允许 | 有限 | 部分付费 | 项目方自己的官方仓库、发行版和官方文档是一手来源，出错能追到项目维护者；个人仓库质量不等，用前要确认是否官方。 | 2026-10-28 |
| `common-crawl` | [Common Crawl 网页抓取档案](https://commoncrawl.org) | 档案与数字图书馆 | 全球 | 未知 | 有数据下载、robots允许 | 有限 | 免费 | 是抓取当时网页的原始存档，保留的是当时网页怎么说；不核实内容真假，用内容时要回到原站复核。 | 2026-10-28 |
| `internet-archive` | [互联网档案馆 / 时光机](https://archive.org) | 档案与数字图书馆 | 全球 | 国内受限 | 有API、有数据下载、有SDK、robots允许 | 有限 | 免费 | 保存的是原始页面与原件扫描，内容出错追到原发布方，馆方只负责保存；属原始档案。 | 2026-10-28 |
| `python-docs` | [Python 官方文档](https://docs.python.org) | 开发者文档 | 全球 | 国内可达 | 有数据下载、robots允许 | 未提 | 免费 | Python 软件基金会和核心开发者自己写的官方文档，与语言实现同源，出错追到项目本身。 | 2026-10-28 |
| `stats-data` | [国家数据 data.stats.gov.cn](https://data.stats.gov.cn) | 开放数据 | 国内 | 国内可达 | 仅网页 | 未提 | 免费 | 国家统计局自己发布的官方统计数据，出错能追到统计局。 | 2026-10-28 |
| `worldbank` | [世界银行开放数据](https://data.worldbank.org) | 开放数据 | 全球 | 国内可达 | 有API、有数据下载、robots允许 | 有限 | 免费 | 国际机构自己发布并为口径负责；但多数指标转自各国统计机构，引用时要同时写原始来源。 | 2026-10-28 |
| `huggingface` | [Hugging Face 模型仓](https://huggingface.co) | 软件包与模型仓 | 全球 | 国内不可达 | 有API、有SDK、有数据下载、robots允许 | 允许 | 部分付费 | 模型与数据由上传者自己发布，仓库历史和模型卡可追到发布账号；属模型仓，但任何人可上传，要认准官方组织账号。 | 2026-10-28 |
| `npm` | [npm 软件包注册中心](https://www.npmjs.com) | 软件包与模型仓 | 全球 | 国内受限 | 有API | 有限 | 部分付费 | 包由发布者自己上传，元数据和 tarball 完整性哈希由注册中心签名保存，出错追到发布者；是软件包注册中心。 | 2026-10-28 |
| `pypi` | [PyPI 软件包注册中心](https://pypi.org) | 软件包与模型仓 | 全球 | 国内受限 | 有API、有数据下载、robots限制 | 允许 | 免费 | 包由发布者上传，注册中心保存元数据和文件哈希，出错追到发布者；是软件包注册中心。 | 2026-10-28 |
| `arxiv` | [arXiv 预印本](https://arxiv.org) | 学术与论文 | 全球 | 国内可达 | 有API、有数据下载、robots限制 | 有限 | 免费 | 论文由作者自己提交原文，出错能追到作者；但未经同行评议，引用结论时要注意预印本身份。 | 2026-10-28 |
| `crossref` | [Crossref 学术 DOI 注册库](https://www.crossref.org) | 学术与论文 | 全球 | 国内可达 | 有API、有数据下载、有llms.txt、robots允许 | 允许 | 部分付费 | 元数据由出版方（成员）自己登记，Crossref 是 DOI 的注册主体；它自己声明只证明记录存在，不证明论文可信。 | 2026-10-28 |
| `doaj` | [开放获取期刊目录 DOAJ](https://doaj.org) | 学术与论文 | 全球 | 未知 | 有API、有数据下载、robots允许 | 允许 | 部分付费 | 收录与否由 DOAJ 自己审核定论，文章元数据由出版方提交，出错能追到 DOAJ 或出版方。 | 2026-10-28 |
| `pubmed` | [PubMed 生物医学文献库](https://pubmed.ncbi.nlm.nih.gov) | 学术与论文 | 全球 | 国内可达 | 有API、有数据下载、robots允许 | 有限 | 免费 | 政府机构 NLM 自己维护的文献索引，记录由期刊与出版方提交，出错能追到 NLM 或出版方。 | 2026-10-28 |
| `flk-npc` | [国家法律法规数据库 flk.npc.gov.cn](https://flk.npc.gov.cn) | 政务与法规 | 国内 | 国内可达 | 仅网页、robots限制 | 禁止 | 免费 | 全国人大系统官方发布的法律法规，出错能追到发布机关。 | 2026-10-28 |
| `gov-cn` | [中国政府网（含国务院政策文件库）](https://www.gov.cn) | 政务与法规 | 国内 | 国内可达 | 仅网页、robots允许 | 未提 | 免费 | 国务院办公厅作为发布主体自己出，政策原文出错能追到发布单位。 | 2026-10-28 |

### 二级 有编辑或同行机制（权重 0.7，10 个）

| id | 源 | 类别 | 地区 | 国内可达 | 智能体入口 | 条款对自动化 | 费用 | 等级理由 | 核验 |
|---|---|---|---|---|---|---|---|---|---|
| `baidu-baike` | [百度百科](https://baike.baidu.com) | 百科与知识图谱 | 国内 | 国内可达 | 仅网页、robots限制 | 禁止 | 免费 | 用户编辑加审核机制的中文百科，有引用要求但不是原始发布方，用前要复核来源。 | 2026-10-28 |
| `wikidata` | [维基数据](https://www.wikidata.org) | 百科与知识图谱 | 全球 | 国内不可达 | 有API、有数据下载、robots允许 | 有限 | 免费 | 结构化数据由社区维护，条目有来源声明和编辑规则，是受监督的开放数据汇编；单条陈述质量不一，关键事实要看引用。 | 2026-10-28 |
| `wikipedia` | [维基百科](https://www.wikipedia.org) | 百科与知识图谱 | 全球 | 国内不可达 | 有API、有数据下载、robots允许 | 有限 | 免费 | 有编辑规则、引用要求和社区校对，但任何人可改，是二手汇编不是一手来源；用前看页面引用的原始出处。 | 2026-10-28 |
| `gitee` | [码云 Gitee](https://gitee.com) | 代码托管 | 国内 | 国内可达 | 有API、有MCP、有llms.txt、robots允许 | 未提 | 部分付费 | 既有项目方自己的仓库，也有大量对 GitHub 项目的镜像和个人库，来源参差，用前要确认是否官方仓库。 | 2026-10-28 |
| `gutenberg` | [古腾堡计划](https://www.gutenberg.org) | 档案与数字图书馆 | 全球 | 国内可达 | 有数据下载、robots允许 | 有限 | 免费 | 文本是志愿者对公版原书的转录与校对，有版本与勘误机制，但不是原件本身，属二手汇编。 | 2026-10-28 |
| `openstreetmap` | [开放街图](https://www.openstreetmap.org) | 地图与地理 | 全球 | 国内受限 | 有API、有数据下载、robots限制 | 有限 | 免费 | 数据由志愿者采集，有编辑规则、变更集审查和社区校对，是受监督的开放数据汇编；各地区完整度和准确度不一。 | 2026-10-28 |
| `mdn` | [MDN 网络文档](https://developer.mozilla.org) | 开发者文档 | 全球 | 国内可达 | 有数据下载、robots允许 | 未提 | 免费 | 内容由 Mozilla 与社区协作撰写，有编辑指南和评审，是对标准与实现的二手汇编；规范原文在 W3C/WHATWG/ECMA。 | 2026-10-28 |
| `owid` | [用数据看世界](https://ourworldindata.org) | 开放数据 | 全球 | 未知 | 有API、有数据下载、robots允许 | 允许 | 免费 | 数据多来自联合国、世界银行等机构，由编辑团队清洗并注明来源；有编辑把关但属二手汇编，引用时要同时写原始来源。 | 2026-10-28 |
| `stackoverflow` | [栈溢出（Stack Exchange 网络）](https://stackoverflow.com) | 社区问答 | 全球 | 国内可达 | 有API、有数据下载、有MCP、robots限制 | 有限 | 免费额度 | 有投票、采纳、编辑和版主机制，高票答案有同行校正；但答案会过期，也可能错，是二手经验汇编。 | 2026-10-28 |
| `semantic-scholar` | [Semantic Scholar 学术搜索](https://www.semanticscholar.org) | 学术与论文 | 全球 | 未知 | 有API、有数据下载、robots允许 | 有限 | 免费 | 论文元数据和引用关系由机器抽取并汇总多方来源，不是原文发布方，属受监督的二手索引。 | 2026-10-28 |

### 三级 社区与聚合（权重 0.4，3 个）

| id | 源 | 类别 | 地区 | 国内可达 | 智能体入口 | 条款对自动化 | 费用 | 等级理由 | 核验 |
|---|---|---|---|---|---|---|---|---|---|
| `zhihu` | [知乎](https://www.zhihu.com) | 社区问答 | 国内 | 国内可达 | 仅网页、robots限制 | 禁止 | 部分付费 | 内容是个人回答，质量靠作者，高赞不等于准确，用前要复核。 | 2026-10-28 |
| `hackernews` | [黑客新闻](https://news.ycombinator.com) | 新闻与聚合 | 全球 | 国内受限 | 有API、robots限制 | 有限 | 免费 | 内容是用户投的链接和评论，排序靠投票，没有事实核查；只能当线索，用前要回到原文复核。 | 2026-10-28 |
| `reddit` | [红迪网](https://www.reddit.com) | 新闻与聚合 | 全球 | 国内不可达 | 有API、robots限制 | 有限 | 部分付费 | 内容是用户发帖与评论，靠投票排序，没有事实核查；只能当经验线索，用前要复核。 | 2026-10-28 |

## 按类别 · By kind

| 类别 | 源（id，权威等级） |
|---|---|
| 百科与知识图谱 | `wikipedia`（2 级）、`wikidata`（2 级）、`baidu-baike`（2 级） |
| 档案与数字图书馆 | `internet-archive`（1 级）、`gutenberg`（2 级）、`common-crawl`（1 级） |
| 学术与论文 | `arxiv`（1 级）、`pubmed`（1 级）、`crossref`（1 级）、`semantic-scholar`（2 级）、`doaj`（1 级） |
| 开发者文档 | `mdn`（2 级）、`python-docs`（1 级） |
| 软件包与模型仓 | `npm`（1 级）、`pypi`（1 级）、`huggingface`（1 级） |
| 开放数据 | `owid`（2 级）、`worldbank`（1 级）、`stats-data`（1 级） |
| 地图与地理 | `openstreetmap`（2 级） |
| 社区问答 | `stackoverflow`（2 级）、`zhihu`（3 级） |
| 新闻与聚合 | `hackernews`（3 级）、`reddit`（3 级） |
| 政务与法规 | `gov-cn`（1 级）、`flk-npc`（1 级） |
| 代码托管 | `gitee`（2 级）、`github`（1 级） |
<!-- generated:end -->
