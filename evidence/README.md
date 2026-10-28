# 证据目录 · Evidence

每个分数后面都要有证据。这个目录放评测时取到的**原文**：探测日志、响应头、返回体、robots.txt 快照、数据文件。卡片里的"指数"一节只放结论和链接，原文都在这里。

## 目录约定

```
evidence/
  README.md                       本说明
  <YYYY-MM-DD>-<slug>/            一次评测一个目录；slug 与 platforms/<slug>.md 一致
    data.json                     打分数据文件：字段按 docs/ 两份模型第四、五节；每个检查项一行，带 evidence
    run-record.json               端到端任务记录（人工介入时间），字段见 skills/agent-friendliness-eval/templates/run-record.json
    probe-log.txt                 探测日志：时间、UA、每个请求的状态码、耗时、大小；三轮
    *.txt / *.html / *.json       响应头、返回体、robots.txt 等原文快照，文件名说清是什么
```

## 规矩

- 只放**探测**取来的东西：诚实 User-Agent、正常频率、不登录、不绕验证码、不换 IP。违规取来的证据不收。
- 不放账号、token、key、cookie、带凭据的响应头。保存响应头前先看一眼。
- 原文不改。要解释写在 `data.json` 的 `notes` 或卡片里，不改快照。
- 本机出网走代理的，日志开头写明；中国大陆可达性只认大陆网络下的实测（手机流量等），不用本机结果冒充。
- 复评开新目录（新日期），旧目录不删：分数改动要能追溯。
