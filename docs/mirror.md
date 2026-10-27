# Gitee 镜像：怎么配、怎么跑

GitHub 是主仓，Gitee 是只读镜像，给国内 Agent 访问。每次 push master，GitHub Actions（`.github/workflows/mirror-gitee.yml`）自动把全部分支和标签推到 Gitee。没配好之前工作流只打印"未配置镜像"并跳过，不报错。

**Agent 不经手密钥。** 下面三步由仓库所有者本人做，只有第 1 步的仓名和第 3 步的两个名字会出现在对话里，私钥内容任何时候都不要贴给 Agent、不要放进任何文件。

## 仓库所有者要做的三步

### 第 1 步：Gitee 建同名仓

1. 登录 gitee.com → 右上角 **+** → **新建仓库**。
2. 仓库名填 `cosmic-tree`，路径保持一致；**是否开源**与 GitHub 主仓保持一致（主仓私有就选私有，主仓公开就选开源；翻公开时两边一起翻）。
3. **不要**勾"使用 Readme 初始化"，留空仓，否则第一次强推会把它覆盖掉，也没意义。
4. 建好后点页面右上 **克隆/下载** → **SSH**，复制地址，形如 `git@gitee.com:<owner>/cosmic-tree.git`。这就是 `GITEE_MIRROR_URL`。

### 第 2 步：生成一对 SSH 密钥，把公钥加到 Gitee 仓的部署公钥

1. 本机 PowerShell 里跑（专门给镜像用的一对，不复用你平时的 key）：
   ```
   ssh-keygen -t ed25519 -C "cosmic-tree-mirror" -f "$env:USERPROFILE\.ssh\agent_index_mirror" -N '""'
   ```
   会得到两个文件：`agent_index_mirror`（私钥，别给任何人、任何文件）和 `agent_index_mirror.pub`（公钥）。
2. 公钥加到 Gitee：打开 Gitee 上的 `cosmic-tree` 仓 → **管理** → 左栏 **部署公钥管理** → **添加部署公钥**（或点"添加公钥"）。标题填 `github-actions-mirror`，内容贴 `agent_index_mirror.pub` 整行文字。
3. 部署公钥默认只读。**要勾上允许推送**（Gitee 部署公钥页有"允许推送"开关；如果你的 Gitee 版本没有这个开关，就改走个人 SSH 公钥：右上头像 → **设置** → **SSH 公钥** → 添加，同样贴 `.pub` 内容）。
4. 本机验证一下能通：
   ```
   ssh -i "$env:USERPROFILE\.ssh\agent_index_mirror" -T git@gitee.com
   ```
   看到 `Hi <用户名>! You've successfully authenticated` 就对了。

### 第 3 步：把私钥和地址填进 GitHub 仓 Secrets

1. 打开 github.com/dundunbaba/cosmic-tree → **Settings** → 左栏 **Secrets and variables** → **Actions** → **New repository secret**。
2. 加两个：
   - Name `GITEE_MIRROR_URL`，Value 填第 1 步复制的 SSH 地址。
   - Name `GITEE_SSH_PRIVATE_KEY`，Value 填 `agent_index_mirror`（**没有 .pub 的那个**）的全部内容，从 `-----BEGIN OPENSSH PRIVATE KEY-----` 到 `-----END OPENSSH PRIVATE KEY-----`，连头尾一起。记事本打开复制就行。
3. 验证：GitHub 仓 → **Actions** → 左栏 **Mirror to Gitee** → 右侧 **Run workflow** → 跑一次。绿了就去 Gitee 仓刷新，应该看到 master 和全部分支。
4. 填完以后把 README 里的 `<GITEE_MIRROR_URL>` 占位换成 Gitee 仓的网页地址（`https://gitee.com/<owner>/cosmic-tree`），这步可以交给 Agent 做。

## 本机手动同步（后备）

Actions 没跑起来、或想立刻同步时，仓库所有者本机跑：

```
$env:GITEE_MIRROR_URL = 'git@gitee.com:<owner>/cosmic-tree.git'
$env:GITEE_SSH_KEY_PATH = "$env:USERPROFILE\.ssh\agent_index_mirror"   # 不填就用 ssh 默认配置
powershell -NoProfile -File scripts/mirror-gitee.ps1            # 加 -DryRun 只演练
```

脚本只读环境变量，不读任何文件里的密钥。

## 规矩

- Gitee 只读：别往 Gitee 直接推，下一次同步会以 GitHub 为准强制覆盖（`--force --prune`）。
- Issue 和 PR 一律在 GitHub；Gitee 的 Issues 建议关掉（Gitee 仓 → 管理 → 功能设置），免得两头收反馈。
- 密钥轮换：换钥时重做第 2、3 步，旧公钥在 Gitee 删掉。
