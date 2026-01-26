# Chet WebAPI Template Generator (Web Version)

基于 Vue 3、Ant Design Vue 和 TypeScript 的 Web 版本项目模板生成器，用于替代原有的 WPF 桌面应用。

## 功能特性

- 🚀 基于 Web 技术的现代化界面
- 🎨 使用 Ant Design Vue 组件库
- 🔧 支持 TypeScript 类型安全
- 💻 无需安装，浏览器即可使用
- 📦 一键生成自定义项目模板
- 🌐 支持从 GitHub 下载模板
- ☁️ 专为 GitHub Pages 部署优化

## 技术栈

- **前端框架**: Vue 3 + TypeScript
- **UI 组件库**: Ant Design Vue 4.x
- **构建工具**: Vite 5
- **压缩库**: JSZip
- **HTTP 客户端**: Fetch API + CORS 代理

## 项目结构

```
WebVersion/
├── src/
│   ├── components/     # Vue 组件
│   ├── services/       # 业务服务
│   ├── utils/          # 工具函数
│   ├── App.vue         # 主应用组件
│   └── main.ts         # 应用入口
├── public/             # 静态资源
├── package.json        # 项目配置
├── vite.config.ts      # Vite 配置
└── tsconfig.json       # TypeScript 配置
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

## 核心功能

1. **模板下载**: 通过 CORS 代理从 GitHub 获取项目模板
2. **内容替换**: 自动替换模板中的占位符
3. **文件处理**: 重命名文件和文件夹
4. **打包下载**: 生成并下载自定义项目

## 部署到 GitHub Pages

此应用专为 GitHub Pages 静态托管设计，不依赖任何后端服务：

1. 运行 `npm run build` 生成构建产物
2. 将 `dist` 目录内容部署到 GitHub Pages
3. 应用将通过 CORS 代理服务访问 GitHub API

## 使用说明

1. 输入公司名称和项目名称
2. 选择模板类型
3. 点击"生成项目"按钮
4. 系统将自动下载、处理并打包项目模板
5. 浏览器将自动下载生成的 ZIP 文件

## 浏览器兼容性

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证

MIT