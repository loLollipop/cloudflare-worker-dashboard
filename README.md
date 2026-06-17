# 🚀 NEBULA — Cloudflare Worker Personal Dashboard

<p align="center">
  <img src="https://img.shields.io/badge/Platform-Cloudflare%20Workers-orange?logo=cloudflare&style=flat-square" alt="Cloudflare Workers">
  <img src="https://img.shields.io/github/license/loLollipop/cloudflare-worker-dashboard?style=flat-square" alt="License">
  <img src="https://img.shields.io/badge/Author-loLollipop-blueviolet?style=flat-square" alt="Author">
</p>

一个基于 Cloudflare Workers 构建的个人导航控制台：**极简、可自助配置、支持拖拽排序**，打开即可直接进入控制台。

无需服务器、无需数据库，使用 Cloudflare KV 在边缘存储你的分类与链接，免费部署属于你的个人入口。

> **Demo / 预览**
>
> ![Dashboard Preview](screenshots/image.png)

---

## ✨ 项目亮点

- **⚡ Serverless 架构**：部署在 Cloudflare Workers，边缘节点就近访问。
- **🚪 免登录访问**：
  - 访问 Worker 地址即可直接进入控制台，无需输入账号密码。
  - 页面内的链接与分类编辑能力保持不变。
- **🧠 自助配置（无需改代码）**：
  - 在页面内新增/编辑/删除链接
  - 支持“新建分类”，并可随时重命名
  - 图标自动同步（favicon）
- **🖱️ 交互体验**：
  - 鼠标滚轮切换分类（像翻页一样）
  - 分类排序（管理面板拖拽）
  - 链接拖拽排序、跨分类拖拽移动
- **🌗 亮色/暗色主题**：一键切换并记住偏好（localStorage），默认跟随系统。

---

## 🚀 快速部署（Copy & Paste）

你不需要安装任何本地环境，只需浏览器即可完成部署。

### 1) 创建 Worker

1. 登录 Cloudflare 控制台
2. 左侧：**Workers & Pages → Overview → Create Application → Create Worker**
3. 取一个名字（例如 `nebula`）点击 **Deploy**
4. 点击 **Edit code**
5. 把仓库里的 `worker.js` 全部复制粘贴覆盖
6. **先不要急着 Deploy**，继续做 KV/Secret 配置（下面两步）

---

## 🧱 必需配置（KV）

本项目依赖：

- KV 命名空间：`LINKS`（存储分类与链接）

### 2) 创建 KV 命名空间

Cloudflare 控制台 → **Storage & Databases → KV** → Create a namespace

创建一个：

- `nebula_links`

### 3) 绑定 KV 到 Worker

回到：**Workers & Pages → 你的 Worker → Settings → Variables**

找到 **KV Namespace Bindings**，新增一条：

| Binding name | KV Namespace |
|---|---|
| `LINKS` | `nebula_links` |

> 绑定名必须是 `LINKS`（代码里固定用这个）
## 一键部署
[![Deploy to Cloudflare](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/loLollipop/cloudflare-worker-dashboard.git)

## ✅ 部署上线

完成以上配置后，回到在线编辑器右上角点击 Deploy。

访问你的 Worker 地址即可使用。


## 🧭 使用指南（部署后怎么玩）

添加链接：右下角 ➕

你可以在“新建分类”输入分类名，会自动创建分类

图标留空会自动同步 favicon

编辑/删除：鼠标移到卡片右上角的小按钮

拖拽排序：

链接卡片可拖拽排序，也可拖到别的分类

分类排序：点击右上角「🧩 管理分类」并拖动排序

切换分类：鼠标滚轮上下滚动（也可点击右侧圆点）

亮/暗切换：右上角 🌙/☀️


## 📁 项目结构
```
.
├─ worker.js                 # Worker 主文件（部署复制这一个就行）
└─ screenshots/
   └─ preview.png            # 预览图（可选）
```

## 🛡️ 安全说明

当前版本已移除密码登录页，访问 Worker 地址即可直接管理链接和分类。请只部署在你信任的访问环境中；如需公网访问保护，建议在 Cloudflare 前置 Access、Zero Trust 或其他访问控制。

## 📄 License

MIT
