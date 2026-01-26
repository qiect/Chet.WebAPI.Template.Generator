<template>
  <a-config-provider :theme="themeConfig">
    <div class="app-wrapper" :class="[themeMode]">
      <a-layout class="layout-base">
        <a-layout-header class="nav-header">
          <div class="header-container">
            <div class="header-left">
              <img src="/logo.png" alt="Logo" class="logo-icon" />
              <span class="logo-text">Chet.WebApi.Template</span>
            </div>

            <div class="header-menu hidden-mobile">
              <a href="#features" class="menu-item">特性</a>
              <a href="#generator" class="menu-item">立即生成</a>
            </div>

            <div class="header-right">
              <a-space size="middle">
                <button @click="toggleTheme" class="theme-icon-btn">
                  <BulbFilled
                    v-if="themeMode === 'dark'"
                    style="color: #facc15"
                  />
                  <BulbOutlined v-else />
                </button>
              </a-space>
            </div>
          </div>
        </a-layout-header>

        <a-layout-content class="main-body">
          <section class="hero-section">
            <div class="hero-badge">支持 10.0</div>
            <h1 class="hero-title">
              快速构建您的 <br />
              <span class="gradient-text">.NET 10 Web API 框架</span>
            </h1>
            <p class="hero-subtitle">
              自动化构建包含 JWT 认证、EF Core、Redis 缓存及 Serilog
              日志的标准化脚手架
            </p>

            <div class="hero-actions">
              <a href="#generator" class="btn-action-main sm">
                <ThunderboltFilled /> 立即生成
              </a>
              <a
                href="https://github.com/qiect/Chet.WebApi.Template"
                target="_blank"
                class="btn-action-sub glass sm"
              >
                <GithubOutlined /> 查看源码
              </a>
            </div>
          </section>

          <section id="features" class="section-container">
            <div class="section-header">
              <h2>✨ 功能特性</h2>
              <div class="title-line"></div>
            </div>
            <a-row :gutter="[24, 24]">
              <a-col :xs="24" :md="8">
                <div class="feature-card glass">
                  <div class="feature-icon blue"><ThunderboltOutlined /></div>
                  <h3>高性能架构</h3>
                  <p>
                    基于 .NET 10 分层架构，包含
                    Application、Core、Infrastructure 等模块。
                  </p>
                </div>
              </a-col>
              <a-col :xs="24" :md="8">
                <div class="feature-card glass">
                  <div class="feature-icon purple">
                    <SafetyCertificateOutlined />
                  </div>
                  <h3>完善的认证</h3>
                  <p>集成 JWT 身份认证、刷新令牌机制及基于角色的授权功能。</p>
                </div>
              </a-col>
              <a-col :xs="24" :md="8">
                <div class="feature-card glass">
                  <div class="feature-icon orange"><DatabaseOutlined /></div>
                  <h3>开箱即用</h3>
                  <p>内置 SQLite 支持、Redis 缓存及 Serilog 结构化日志管理。</p>
                </div>
              </a-col>
            </a-row>
          </section>

          <section id="generator" class="section-container">
            <div class="section-header">
              <h2>🚀 立即生成项目</h2>
            </div>
            <a-row :gutter="[32, 32]">
              <a-col :xs="24" :lg="10">
                <div class="generator-card glass">
                  <div class="card-tag">PROJECT CONFIG</div>
                  <a-form
                    :model="formState"
                    layout="vertical"
                    @finish="onSubmit"
                  >
                    <a-form-item label="公司/组织名称" required>
                      <a-input
                        v-model:value="formState.companyName"
                        placeholder="例如: MyCompany"
                      />
                    </a-form-item>
                    <a-form-item label="项目名称" required>
                      <a-input
                        v-model:value="formState.projectName"
                        placeholder="例如: MyProject.WebApi"
                      />
                    </a-form-item>
                    <a-form-item label="架构模板">
                      <a-select v-model:value="formState.templateType">
                        <a-select-option value="Chet.WebApi.Template"
                          >单体 Web API 模板</a-select-option
                        >
                      </a-select>
                    </a-form-item>
                    <div class="preview-namespace">
                      <CodeOutlined />                      <span
                        >{{ formState.companyName || "..." }}.{{
                          formState.projectName || "..."
                        }}</span
                      >
                    </div>
                    <a-button
                      type="primary"
                      block
                      size="large"
                      html-type="submit"
                      :loading="loading"
                      class="main-btn"
                    >
                      开始构建并下载
                    </a-button>
                  </a-form>
                </div>
              </a-col>

              <a-col :xs="24" :lg="14">
                <div class="console-card">
                  <div class="console-nav">
                    <div class="dots">
                      <span class="r"></span><span class="y"></span
                      ><span class="g"></span>
                    </div>
                    <span class="console-title">BUILD CONSOLE</span>
                  </div>
                  <div class="terminal-body" ref="terminalRef">
                    <div v-if="logs.length === 0" class="terminal-empty">
                      READY TO BUILD...
                    </div>
                    <div
                      v-for="(log, index) in logs"
                      :key="index"
                      class="log-line"
                    >
                      <span class="log-time">{{ log.time }}</span>
                      <span class="log-text" :class="log.type"
                        >> {{ log.text }}</span
                      >
                    </div>
                  </div>
                </div>
              </a-col>
            </a-row>
          </section>
        </a-layout-content>

        <a-layout-footer class="site-footer">
          <p>Released under the MIT License.</p>
          <p>
            © 2026 Chet.WebApi.Template · Built with ❤️ for .NET Developers.
          </p>
        </a-layout-footer>
      </a-layout>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, watch, computed, onMounted } from "vue";
import { theme, message } from "ant-design-vue";
import {
  GithubOutlined,
  CodeOutlined,
  BulbOutlined,
  BulbFilled,
  ThunderboltFilled,
  ThunderboltOutlined,
  SafetyCertificateOutlined,
  DatabaseOutlined,
} from "@ant-design/icons-vue";
import { TemplateService } from "./services/TemplateService";

// 主题逻辑
const themeMode = ref<"light" | "dark">("dark");

// 新增：自动切换主题
onMounted(() => {
  const hour = new Date().getHours();
  // 18:00 到 次日 06:00 自动切换为暗色模式
  themeMode.value = hour >= 18 || hour < 6 ? "dark" : "light";
});

const toggleTheme = () => {
  themeMode.value = themeMode.value === "light" ? "dark" : "light";
};

const themeConfig = computed(() => ({
  algorithm:
    themeMode.value === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
  token: { colorPrimary: "#3b82f6", borderRadius: 12 },
}));

const formState = reactive({
  companyName: "",
  projectName: "",
  templateType: "Chet.WebApi.Template",
});
const loading = ref(false);
const logs = ref<{ time: string; text: string; type: string }[]>([]);
const terminalRef = ref<HTMLElement | null>(null);

const addLog = (text: string, type = "info") => {
  logs.value.push({ time: new Date().toLocaleTimeString(), text, type });
};

watch(
  logs,
  () => {
    nextTick(() => {
      if (terminalRef.value)
        terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
    });
  },
  { deep: true },
);

const onSubmit = async () => {
  if (!formState.companyName || !formState.projectName) {
    message.warning("请补充配置信息");
    return;
  }
  loading.value = true;
  logs.value = [];
  try {
    addLog(`初始化构建任务: ${formState.companyName}.${formState.projectName}`);
    const service = new TemplateService();
    const blob = await service.downloadAndProcessTemplate(
      formState.templateType,
      formState.companyName,
      formState.projectName,
      (msg) => addLog(msg),
    );
    addLog("项目包构建完成，正在启动下载...", "success");
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formState.companyName}.${formState.projectName}.zip`;
    link.click();
  } catch (e: any) {
    addLog(`错误: ${e.message}`, "error");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.app-wrapper {
  min-height: 100vh;
  transition:
    background 0.4s,
    color 0.4s;
}
.app-wrapper.dark {
  background: #0f172a;
  color: #cbd5e1;
}
.app-wrapper.light {
  background: #f8fafc;
  color: #1e293b;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 64px;
  padding: 0 24px;
}
.nav-header {
  position: fixed;
  width: 100%;
  z-index: 100;
  padding: 0;
  backdrop-filter: blur(10px);
}
.app-wrapper.light .nav-header {
  background: rgba(255, 255, 255, 0.7);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}
.app-wrapper.dark .nav-header {
  background: rgba(15, 23, 42, 0.7);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

@media (max-width: 768px) {
  /* 通过父级或组合类名提高权重 */
  .header-menu.hidden-mobile {
    display: none !important; /* 加 !important 是最保险的做法 */
  }

  .logo-icon {
    height: 28px;
  }

  .logo-text {
    font-size: 16px;
    margin-left: 8px;
  }

  .hero-title {
    font-size: 32px !important; /* 移动端标题可以再小一点 */
    line-height: 1.2;
  }
}

/* 控制 Logo 图片大小 */
.logo-icon {
  height: 32px; /* 固定高度，确保导航栏整洁 */
  width: auto; /* 宽度按比例自适应 */
  object-fit: contain; /* 确保图片不被拉伸 */
  flex-shrink: 0; /* 防止在小屏下被挤压变小 */
}

/* 确保左侧容器垂直居中 */
.header-left {
  display: flex;
  align-items: center; /* 核心：确保 Logo 和文字对齐 */
  flex-shrink: 0;
}

/* 调整文字间距 */
.logo-text {
  font-size: 20px;
  font-weight: 800;
  margin-left: 12px; /* 增加 Logo 和文字之间的间距 */
  line-height: 1; /* 消除行高带来的对齐偏差 */
}

.logo-text {
  font-size: 20px;
  font-weight: 800;
  margin-left: 10px;
  flex-shrink: 0;
}
.header-menu {
  display: flex;
  gap: 32px;
}
.menu-item {
  font-weight: 600;
  font-size: 14px;
  transition: color 0.3s;
  color: inherit;
}
.menu-item:hover {
  color: #3b82f6;
}

.theme-icon-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 20px;
  padding: 8px;
  display: flex;
  align-items: center;
  color: inherit;
}
.theme-icon-btn:hover {
  transform: rotate(15deg) scale(1.1);
  transition: 0.3s;
}

/* Hero Section */
.hero-section {
  text-align: center;
  padding: 140px 24px 60px;
}
.hero-badge {
  display: inline-block;
  padding: 4px 16px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid rgba(59, 130, 246, 0.3);
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  margin-bottom: 24px;
}
.hero-title {
  font-size: 64px;
  font-weight: 900;
  line-height: 1.1;
  margin-bottom: 24px;
}
.gradient-text {
  background: linear-gradient(135deg, #60a5fa, #a855f7);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
.hero-subtitle {
  font-size: 18px;
  opacity: 0.7;
  max-width: 700px;
  margin: 0 auto;
}

/* 优化：调小按钮尺寸相关样式 */
.hero-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 32px;
}
.btn-action-main.sm {
  padding: 10px 24px;
  font-size: 14px;
  border-radius: 10px;
}
.btn-action-sub.sm {
  padding: 10px 24px;
  font-size: 14px;
  border-radius: 10px;
}

.btn-action-main {
  background: #3b82f6;
  color: white;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
}
.btn-action-main:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 15px rgba(59, 130, 246, 0.3);
  color: white;
}
.btn-action-sub {
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s;
  color: inherit;
}
.btn-action-sub:hover {
  transform: translateY(-2px);
  background: rgba(59, 130, 246, 0.1);
}

/* 原有样式保持不变 */
.section-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 24px;
}
.section-header {
  text-align: center;
  margin-bottom: 48px;
}
.section-header h2 {
  font-size: 32px;
  font-weight: 800;
}
.title-line {
  width: 40px;
  height: 4px;
  background: #3b82f6;
  margin: 12px auto;
  border-radius: 4px;
}
.glass {
  backdrop-filter: blur(12px);
  border-radius: 24px;
  padding: 32px;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
}
.app-wrapper.light .glass {
  background: #fff;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.03);
}
.feature-card {
  height: 100%;
}
.feature-icon {
  font-size: 28px;
  margin-bottom: 20px;
}
.feature-icon.blue {
  color: #3b82f6;
}
.feature-icon.purple {
  color: #a855f7;
}
.feature-icon.orange {
  color: #f97316;
}
.card-tag {
  font-size: 10px;
  font-weight: 800;
  opacity: 0.5;
  letter-spacing: 1.5px;
  margin-bottom: 16px;
}
.preview-namespace {
  padding: 12px;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  margin: 16px 0;
  font-family: monospace;
  font-size: 13px;
}
.main-btn {
  height: 50px;
  font-weight: 700;
  border-radius: 12px;
  margin-top: 12px;
}
.console-card {
  background: #1e293b;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.3);
}
.console-nav {
  background: rgba(255, 255, 255, 0.05);
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dots {
  display: flex;
  gap: 8px;
}
.dots span {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dots .r {
  background: #ff5f56;
}
.dots .y {
  background: #ffbd2e;
}
.dots .g {
  background: #27c93f;
}
.console-title {
  font-size: 11px;
  font-weight: 800;
  color: #64748b;
  letter-spacing: 1px;
}
.terminal-body {
  height: 380px;
  padding: 20px;
  overflow-y: auto;
  font-family: "Fira Code", monospace;
  font-size: 12px;
}
.log-line {
  display: flex;
  gap: 12px;
  margin-bottom: 6px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.02);
  padding-bottom: 4px;
}
.log-time {
  color: #64748b;
}
.log-text.success {
  color: #4ade80;
}
.log-text.error {
  color: #f87171;
}
.log-text.info {
  color: #e2e8f0;
}
.terminal-empty {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #475569;
  letter-spacing: 2px;
}
.site-footer {
  text-align: center;
  padding: 80px 0;
  opacity: 0.5;
  font-size: 12px;
}
</style>
