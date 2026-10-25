# 安全问题怎么报 · Security

本仓是信息仓：平台卡、两份指数模型、几个零依赖脚本。它不跑服务、不存用户数据。
This repository holds information (platform cards, two index models, a few dependency-free scripts). It runs no service and stores no user data.

## 报什么 · What to report

- 仓里出现了不该出现的东西：密钥、token、内网地址、真人隐私。
- 脚本（`scripts/`）或 GitHub Actions 工作流（`.github/workflows/`）有安全问题。
- 卡片里的某条"进门方式"会让照做的智能体违反平台条款或泄露凭据。

Anything that should not be here (secrets, tokens, internal addresses, personal data); a security issue in `scripts/` or `.github/workflows/`; a card that would lead an agent into violating platform terms or leaking credentials.

## 怎么报 · How to report

1. **开 Issue**：选"平台建议 · Platform suggestion"模板，标题开头写"安全"。不要在 Issue 里贴密钥本体，描述位置和样式就够。
   Open an issue with the "Platform suggestion" template and start the title with "安全" / "Security". Do not paste the secret itself; describe where it is and what it looks like.
2. **不想公开说**：发邮件到 `tye50145@gmail.com`。
   Prefer private disclosure: email `tye50145@gmail.com`.

## 我们怎么处理 · What we do

收到后先确认，再按"先换密钥、再删内容、再重写历史"的顺序处理，处理结果在原 Issue 里回复。
We confirm first, then rotate any exposed credential, remove the content, and rewrite history, in that order. The outcome is posted back on the issue.

## 我们自己的规矩 · Our own rules

- 评测只探测不突破：不绕验证码、不换 IP、不伪装身份、不用别人的账号。
- 仓里不写账号名、token、key、密码；写流程，不写凭据。
