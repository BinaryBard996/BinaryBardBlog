---
name: deploy-to-github-pages
overview: 将博客项目从腾讯云 CloudBase 方案迁移到 GitHub Pages 免费部署方案，包括 Git 初始化、GitHub Actions 自动构建部署、清理 CloudBase 配置。
todos:
  - id: config-github-deploy
    content: 创建 GitHub Actions 工作流文件，配置 vite.config.ts 的 base 路径，删除 cloudbaserc.json
    status: completed
  - id: update-site-urls
    content: 更新 siteConfig、RSS 脚本和 Comments 组件中的站点 URL 为 GitHub Pages 地址
    status: completed
    dependencies:
      - config-github-deploy
---

## 用户需求

用户决定放弃腾讯云 CloudBase（需收费），改为使用 GitHub Pages（免费）部署个人博客。

## 产品概述

将现有 BinaryBardBlog 项目的部署方案从腾讯云 CloudBase 迁移到 GitHub Pages，通过 GitHub Actions 实现推送代码后自动构建和部署，无需额外费用。

## 核心变更

- 删除腾讯云 CloudBase 部署配置（`cloudbaserc.json`）
- 创建 GitHub Actions CI/CD 工作流文件，实现自动构建并部署到 GitHub Pages
- 配置 Vite 的 `base` 路径以适配 GitHub Pages 子路径部署
- 解决 SPA 路由在 GitHub Pages 上的 404 问题（GitHub Pages 不支持服务端路由重写，需要 `404.html` 重定向方案）
- 更新 RSS 脚本和站点配置中的硬编码 URL 为 GitHub Pages 地址
- 提供用户手动操作指引（Git 初始化、创建 GitHub 仓库、启用 Pages、推送代码）

## 技术栈

- 现有框架：Vite 5 + React 18 + TypeScript 5（不变）
- 部署平台：GitHub Pages（替代腾讯云 CloudBase）
- CI/CD：GitHub Actions（使用官方 `actions/deploy-pages` action）
- 构建产物：静态 `dist/` 目录

## 实现方案

### 整体策略

使用 GitHub Actions 的 `pages` 部署方式（推荐的现代方式），而非传统的 `gh-pages` 分支方式。每次 push 到 `main` 分支时自动触发构建和部署。

### 关键技术决策

**1. GitHub Pages 部署方式选择：GitHub Actions 直接部署**

- 使用 `actions/upload-pages-artifact` + `actions/deploy-pages` 官方 action
- 优势：无需额外分支、无需 token 配置、官方推荐方案
- 在 GitHub 仓库设置中将 Pages 来源设为 "GitHub Actions"

**2. SPA 路由兼容方案：404.html 重定向**

- GitHub Pages 对不存在的路由会返回 404，`react-router-dom` 的 `BrowserRouter` 需要服务端路由重写支持
- 方案：构建后复制 `index.html` 为 `404.html`，GitHub Pages 会用 `404.html` 处理未匹配的路由，浏览器端 React Router 接管路由解析
- 这是 GitHub Pages + SPA 的标准解决方案，无需改为 HashRouter

**3. Base 路径配置**

- 如果仓库名为 `<username>.github.io`，base 为 `/`（默认即可）
- 如果仓库名为其他（如 `BinaryBardBlog`），base 需设为 `/<repo-name>/`
- 在 `vite.config.ts` 中通过环境变量动态设置 base，保持开发和生产的兼容性

**4. 站点 URL 更新**

- `src/types/blog.ts` 中的 `siteConfig.url` 需更新为 GitHub Pages 地址
- `scripts/generate-rss.ts` 中的 `SITE_URL` 需同步更新
- `src/components/blog/Comments.tsx` 中的 `data-repo` 需更新为实际 GitHub 仓库名

## 实现注意事项

### 性能与构建

- GitHub Actions 使用 Node.js 20 LTS 和 npm cache 加速安装
- 构建命令顺序：`npm ci` -> `npm run build` -> `npm run generate-rss`，确保 RSS 在 dist 目录生成
- `actions/configure-pages` 会自动注入 base 路径环境变量

### 向后兼容

- 不改变 `BrowserRouter` 路由方案，通过 `404.html` 兼容
- 开发模式下 base 保持 `/`，仅生产构建时使用子路径（通过 `process.env.GITHUB_ACTIONS` 或 Vite 的 `base` 配置）
- RSS 脚本的 `SITE_URL` 改为从环境变量或配置读取，便于后续切换域名

### 用户需手动操作（代码完成后）

1. 在项目目录执行 `git init` 并 `git add .` + `git commit`
2. 在 GitHub 上创建新仓库（如 `BinaryBardBlog`）
3. 在仓库 Settings -> Pages -> Source 选择 "GitHub Actions"
4. `git remote add origin <repo-url>` + `git push -u origin main`
5. 首次推送后 Actions 自动触发部署

## 架构变更

```mermaid
graph LR
    A[推送代码到 main 分支] --> B[GitHub Actions 触发]
    B --> C[npm ci 安装依赖]
    C --> D[npm run build 构建]
    D --> E[npm run generate-rss 生成RSS]
    E --> F[复制 index.html 为 404.html]
    F --> G[上传 dist/ 为 Pages artifact]
    G --> H[部署到 GitHub Pages]
    H --> I[https://username.github.io/BinaryBardBlog/]
```

## 目录结构

```
f:/Project/BinaryBardBlog/
├── .github/
│   └── workflows/
│       └── deploy.yml              # [NEW] GitHub Actions 部署工作流。定义 push 到 main 时触发的 CI/CD 流水线：安装依赖 -> 构建 -> 生成 RSS -> 复制 404.html -> 上传 artifact -> 部署到 GitHub Pages。使用官方 actions/deploy-pages。
├── cloudbaserc.json                # [DELETE] 不再需要的腾讯云 CloudBase 配置
├── vite.config.ts                  # [MODIFY] 添加 base 路径配置，通过环境变量支持 GitHub Pages 子路径部署。开发模式默认 `/`，生产构建时可设为 `/<repo-name>/`。
├── scripts/
│   └── generate-rss.ts             # [MODIFY] 将硬编码的 SITE_URL 改为从 siteConfig 导入或使用环境变量，确保 RSS 中的链接指向正确的 GitHub Pages 地址。
├── src/
│   └── types/
│       └── blog.ts                 # [MODIFY] 更新 siteConfig.url 和 siteConfig.github 为 GitHub Pages 实际地址（使用占位符模板，便于用户替换自己的用户名）。