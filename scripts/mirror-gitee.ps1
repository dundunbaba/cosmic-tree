<#
.SYNOPSIS
  本机手动把 GitHub 主仓同步到 Gitee 镜像（GitHub Actions 没跑起来时的后备）。

.DESCRIPTION
  只读环境变量，不读任何文件里的密钥：
    GITEE_MIRROR_URL      必填。Gitee 仓的 SSH 地址，形如 git@gitee.com:<owner>/<repo>.git
    GITEE_SSH_KEY_PATH    可选。私钥文件路径；不填就用你本机 ssh 的默认配置（~/.ssh/config 或 ssh-agent）。
  做的事：从 origin 拉全部分支和标签，再把全部分支和标签强推到 Gitee（Gitee 是只读镜像，以 GitHub 为准）。

.EXAMPLE
  $env:GITEE_MIRROR_URL = 'git@gitee.com:<owner>/agent-index.git'
  powershell -NoProfile -File scripts/mirror-gitee.ps1

.NOTES
  配法三步见 docs/mirror.md。Agent 不经手密钥：这个脚本由 CEO 在本机跑。
#>
[CmdletBinding()]
param(
  [switch]$DryRun
)

$ErrorActionPreference = 'Stop'

$url = $env:GITEE_MIRROR_URL
if ([string]::IsNullOrWhiteSpace($url)) {
  Write-Host '未配置镜像：环境变量 GITEE_MIRROR_URL 为空。配法见 docs/mirror.md' -ForegroundColor Yellow
  exit 0
}

$repoRoot = Split-Path -Parent $PSScriptRoot
Push-Location $repoRoot
try {
  if (-not [string]::IsNullOrWhiteSpace($env:GITEE_SSH_KEY_PATH)) {
    if (-not (Test-Path -LiteralPath $env:GITEE_SSH_KEY_PATH)) {
      Write-Error "GITEE_SSH_KEY_PATH 指向的文件不存在：$($env:GITEE_SSH_KEY_PATH)"
    }
    $keyPath = ($env:GITEE_SSH_KEY_PATH -replace '\\', '/')
    $env:GIT_SSH_COMMAND = "ssh -i `"$keyPath`" -o IdentitiesOnly=yes"
  }

  Write-Host '1/2 从 origin 拉全部分支和标签...'
  git fetch origin --prune --tags
  if ($LASTEXITCODE -ne 0) { throw 'git fetch 失败' }

  $pushArgs = @('push', '--force', '--prune', $url, 'refs/remotes/origin/*:refs/heads/*', 'refs/tags/*:refs/tags/*')
  if ($DryRun) { $pushArgs += '--dry-run' }

  Write-Host "2/2 推到 Gitee 镜像（$(if ($DryRun) { '演练，不真推' } else { '真推' })）..."
  git @pushArgs
  if ($LASTEXITCODE -ne 0) { throw 'git push 到 Gitee 失败' }

  Write-Host '已同步到 Gitee 镜像。' -ForegroundColor Green
}
finally {
  Pop-Location
}
