# Google Sheets 表单后台配置指南

网站上的 **Request Inspection**（联系页表单）和 **Emergency Popup**（弹窗表单）提交后，会写入 Google Sheet。

## 一、创建 Google Sheet

1. 打开 [Google Sheets](https://sheets.google.com)，新建表格
2. 建议命名：`Shield Construction Leads`
3. 可将默认 `Sheet1` 重命名为 `Leads`（可选，脚本会自动创建）

## 二、添加 Apps Script

1. 在表格中点击 **扩展程序 → Apps Script**
2. 删除默认代码，粘贴项目中的 `scripts/google-apps-script.js` 全部内容
3. 点击 **保存**，项目名称可设为 `Shield Form Handler`
4. 修改脚本顶部的 **`NOTIFY_EMAIL`** 为接收提醒的邮箱（默认 `contact@shield-cons.com`）

## 三、初始化表头

1. 在 Apps Script 编辑器中，选择函数 `setupSheet`
2. 点击 **运行**
3. 首次运行需 **授权**（Google 账号 → 允许访问表格）
4. 回到表格，应看到 `Leads` 工作表及表头行

表头列：

| Timestamp | Form Type | Name | Phone | Email | Property Address | Damage Type | Insurance Company | Message | Source Page |
|-----------|-----------|------|-------|-------|------------------|-------------|-------------------|---------|-------------|

`Form Type` 取值说明：

- `request-inspection` — Contact 页「Request Service or Inspection」表单
- `emergency-popup` — 全站紧急服务弹窗表单

## 四、部署 Web App

1. Apps Script 右上角 **部署 → 新建部署**
2. 类型选择 **Web 应用**
3. 设置：
   - **执行身份**：我
   - **有权访问的用户**：任何人
4. 点击 **部署**，复制 **Web 应用 URL**（以 `/exec` 结尾）

## 五、写入网站配置

编辑 `js/config.js`：

```javascript
window.SITE_CONFIG = {
  GOOGLE_SCRIPT_URL: 'https://script.google.com/macros/s/xxxxxxxx/exec'
};
```

保存后刷新网站，提交表单测试。成功时 Sheet 会新增一行，页面显示感谢信息（不再出现 Demo mode 提示）。

## 六、邮件提醒

每次成功提交后，Apps Script 会通过 **Gmail（MailApp）** 向 `NOTIFY_EMAIL` 发送一封通知邮件，包含：

- 表单类型（Request Inspection / Emergency Popup）
- 姓名、电话、邮箱、地址、损伤类型等字段
- 提交时间与来源页面

**说明：**

- 邮件由 **部署脚本所用的 Google 账号** 发出（执行身份：我）
- 若客户填写了邮箱，通知邮件会设置 **Reply-To** 为客户邮箱，方便直接回复
- 首次触发发信时 Google 可能要求额外授权 **发送邮件** 权限
- 在 Apps Script 编辑器中选择函数 **`testNotificationEmail`** → **运行** → 按提示授权 Gmail；然后 **部署 → 管理部署 → 编辑 → 新版本**

**测试邮件：** 在 Apps Script 中临时运行 `sendNotificationEmail_` 并传入测试对象，或提交一次真实表单。

## 七、防重复提交

**网站端（已内置）：**

- 提交后按钮禁用 60 秒
- 本地冷却：同一浏览器 60 秒内不可重复提交
- 蜜罐字段：拦截简单机器人

**Google Apps Script 端（已内置）：**

- 同一 **电话** 或 **邮箱** 在 **10 分钟内** 仅记录 1 次
- 重复提交会返回提示，不会写入 Sheet、不会发邮件

修改 `RATE_LIMIT_MINUTES` 可调整服务端间隔。

## 八、测试

1. 打开 `contact.html`，填写并提交表单
2. 检查 Google Sheet 是否新增一行
3. 打开首页等待紧急弹窗（或清除 `localStorage` 键 `shield_emergency_popup_dismissed` 后刷新）

## 常见问题

**提交后 Sheet 无数据**

- 确认 `GOOGLE_SCRIPT_URL` 正确且以 `/exec` 结尾
- 确认 Web App 部署为「任何人」可访问
- 修改脚本后需 **部署 → 管理部署 → 编辑 → 新版本** 再部署

**仍显示 Demo mode**

- `GOOGLE_SCRIPT_URL` 为空或未保存 `config.js`

**提交显示错误但 Sheet 有数据**

- 常见原因：尚未授权 `MailApp.sendEmail`。运行 `testNotificationEmail` 完成授权并重新部署（见上文「邮件提醒」）

**未收到邮件提醒**

- 检查 Apps Script 中 `NOTIFY_EMAIL` 是否正确
- 查看 Gmail **垃圾邮件** 文件夹
- 确认已 **重新部署** Web App（新版本）
- 在 Apps Script **执行** 记录中查看是否有 MailApp 报错

**损伤照片**

- 网站表单不上传图片；用户可通过电话或邮件发送照片（见 Contact 页提示）
