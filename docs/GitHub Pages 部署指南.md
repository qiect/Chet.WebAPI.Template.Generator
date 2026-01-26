# GitHub Pages 部署指南

## 部署到 GitHub Pages

要将此应用程序部署到 GitHub Pages，请按照以下步骤操作：

### 1. 配置 Vite

如果您的页面将部署到 `https://<USERNAME>.github.io/<REPO>/`（其中 `<REPO>` 是您的存储库名称），请在 `vite.config.ts` 中设置正确的 `base` 路径：

```typescript
export default defineConfig({
  base: '/<REPO>/',  // 将 <REPO> 替换为您的存储库名称
  // ... 其他配置
})
```

例如，如果您的存储库是 `https://github.com/username/my-template-generator`，则应设置为：
```typescript
base: '/my-template-generator/',
```

### 2. 部署工作流

GitHub Actions 工作流 (.github/workflows/build.yml) 会在每次推送到 main 分支时自动构建并部署到 GitHub Pages。

### 3. GitHub Pages 设置

在 GitHub 存储库设置中：

1. 转到 "Pages" 部分
2. 将源设置为 "GitHub Actions"
3. 配置完成后，工作流会自动部署到 GitHub Pages

### 4. 自定义域名（可选）

如果要使用自定义域名，请在此处添加 CNAME 文件。