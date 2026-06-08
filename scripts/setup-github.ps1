# 在 gh auth login 完成后运行此脚本，创建 GitHub 仓库并推送
# 用法: .\scripts\setup-github.ps1 [-Domain "www.example.com"] [-Public]

param(
    [string]$Domain = "",
    [switch]$Public = $true
)

$ErrorActionPreference = "Stop"
$RepoRoot = Split-Path -Parent $PSScriptRoot
Set-Location $RepoRoot

$ghUser = (gh api user --jq .login)
$repoName = "ShieldConstruction"

if (-not (gh auth status 2>$null)) {
    Write-Error "请先运行: gh auth login --hostname github.com --git-protocol https --web"
}

if ($Domain) {
    Set-Content -Path "CNAME" -Value $Domain -NoNewline -Encoding ascii
    git add CNAME
}

$email = (gh api user/emails --jq '.[] | select(.primary==true) | .email' 2>$null)
if (-not $email) { $email = "$ghUser@users.noreply.github.com" }
$name = (gh api user --jq .name 2>$null)
if (-not $name) { $name = $ghUser }

$env:GIT_AUTHOR_NAME = $name
$env:GIT_COMMITTER_NAME = $name
$env:GIT_AUTHOR_EMAIL = $email
$env:GIT_COMMITTER_EMAIL = $email

if (-not (git rev-parse HEAD 2>$null)) {
    git add .
    git commit -m "Initial commit: GitHub Pages static site scaffold"
} elseif ($Domain -and (git status --porcelain CNAME)) {
    git commit -m "Add custom domain CNAME for GitHub Pages"
}

$visibility = if ($Public) { "--public" } else { "--private" }
gh repo create $repoName $visibility --source=. --remote=origin --push --description "Shield Construction website (GitHub Pages)"

Write-Host ""
Write-Host "仓库已创建: https://github.com/$ghUser/$repoName" -ForegroundColor Green
Write-Host ""
Write-Host "下一步 - 在 GitHub 启用 Pages:" -ForegroundColor Yellow
Write-Host "  1. 打开 https://github.com/$ghUser/$repoName/settings/pages"
Write-Host "  2. Source: Deploy from a branch -> main / (root)"
if ($Domain) {
    Write-Host "  3. Custom domain: $Domain"
    Write-Host "  4. 按 scripts/setup-dns.md 配置 Google Workspace DNS"
} else {
    Write-Host "  3. 配置自定义域名后，在仓库根目录添加 CNAME 文件"
}
Write-Host "  5. 勾选 Enforce HTTPS（DNS 生效后）"
