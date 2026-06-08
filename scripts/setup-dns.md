# Google Workspace DNS 配置指南（GitHub Pages）

将 `yourdomain.com` 替换为你在 Google Workspace 注册的实际域名。

## 前提

1. GitHub 仓库已创建并启用 Pages（见下方「GitHub Pages 设置」）
2. 在 GitHub 仓库 Settings → Pages → Custom domain 中填写你的域名
3. 勾选 **Enforce HTTPS**（DNS 生效后可用）

## 方案 A：使用 www 子域名（推荐）

在 [Google Admin](https://admin.google.com) → **账号** → **域名** → 选择域名 → **管理域名** → **DNS** 中添加：

| 类型  | 主机记录 | 值 / 指向              | TTL  |
|-------|----------|------------------------|------|
| CNAME | www      | `<你的GitHub用户名>.github.io` | 3600 |

同时在仓库根目录 `CNAME` 文件中写入：

```
www.yourdomain.com
```

## 方案 B：使用根域名（yourdomain.com）

GitHub Pages 根域名需要 A 记录，不能使用 CNAME @。

| 类型 | 主机记录 | 值              | TTL  |
|------|----------|-----------------|------|
| A    | @        | 185.199.108.153 | 3600 |
| A    | @        | 185.199.109.153 | 3600 |
| A    | @        | 185.199.110.153 | 3600 |
| A    | @        | 185.199.111.153 | 3600 |

可选 IPv6（AAAA）：

| 类型  | 主机记录 | 值                    | TTL  |
|-------|----------|-----------------------|------|
| AAAA  | @        | 2606:50c0:8000::153   | 3600 |
| AAAA  | @        | 2606:50c0:8001::153   | 3600 |
| AAAA  | @        | 2606:50c0:8002::153   | 3600 |
| AAAA  | @        | 2606:50c0:8003::153   | 3600 |

`CNAME` 文件内容：

```
yourdomain.com
```

## 方案 C：根域名 + www 同时可用

1. 根域名按方案 B 配置 A 记录
2. www 按方案 A 配置 CNAME
3. 在 GitHub Pages Custom domain 填 `www.yourdomain.com`
4. 在 GitHub 勾选从 apex 重定向到 www（或自行在 DNS 添加 www 转发）

## Google Workspace 操作步骤

1. 登录 https://admin.google.com
2. 左侧菜单：**账号** → **域名** → 点击你的域名
3. 点击 **管理域名** 或 **DNS**
4. 若使用 Google Domains / Squarespace 托管：进入 **自定义记录** / **Custom records**
5. 添加上表中的记录，保存
6. DNS 传播通常需要 5 分钟 ~ 48 小时

## 验证

```bash
# 检查 CNAME
nslookup www.yourdomain.com

# 检查 A 记录
nslookup yourdomain.com
```

在 GitHub 仓库 Settings → Pages 中，Custom domain 旁应显示 **DNS check successful**。

## GitHub Pages 设置

1. 推送代码到 `main` 分支
2. 仓库 Settings → Pages
3. Source: **Deploy from a branch**
4. Branch: **main** / **/ (root)**
5. 填写 Custom domain 并保存
