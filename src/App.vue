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

            <nav class="header-menu hidden-mobile">
              <a href="#features" class="menu-item">特性</a>
              <a href="#generator" class="menu-item">立即生成</a>
            </nav>

            <div class="header-right">
              <button @click="toggleTheme" class="theme-icon-btn" :title="themeMode === 'dark' ? '切换亮色' : '切换暗色'">
                <BulbFilled v-if="themeMode === 'dark'" style="color: #facc15" />
                <BulbOutlined v-else />
              </button>
            </div>
          </div>
        </a-layout-header>

        <a-layout-content class="main-body">
          <section class="hero-section">
            <div class="hero-badge">支持 .NET 10.0</div>
            <h1 class="hero-title">
              快速构建您的 <br />
              <span class="gradient-text">.NET 10 Web API 框架</span>
            </h1>
            <p class="hero-subtitle">
              自动化构建包含 JWT 认证、EF Core、Redis 缓存及 Serilog 日志的标准化脚手架
            </p>

            <div class="hero-actions">
              <a href="#generator" class="btn-action-main">
                <ThunderboltFilled /> 立即生成
              </a>
              <a href="https://github.com/qiect/Chet.WebApi.Template" target="_blank" class="btn-action-sub glass">
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
              <a-col v-for="feature in features" :key="feature.title" :xs="24" :md="8">
                <div class="feature-card glass">
                  <div class="feature-icon" :class="feature.colorClass">
                    <component :is="feature.icon" />
                  </div>
                  <h3>{{ feature.title }}</h3>
                  <p>{{ feature.desc }}</p>
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
                  <a-form :model="formState" layout="vertical" @finish="onSubmit">
                    <a-form-item label="公司/组织名称" name="companyName" :rules="[{ required: true, message: '请输入公司/组织名称' }]">
                      <a-input v-model:value="formState.companyName" placeholder="例如: MyCompany" />
                    </a-form-item>
                    
                    <a-form-item label="项目名称" name="projectName" :rules="[{ required: true, message: '请输入项目名称' }]">
                      <a-input v-model:value="formState.projectName" placeholder="例如: MyProject.WebApi" />
                    </a-form-item>

                    <a-form-item label="架构模板">
                      <a-select v-model:value="formState.templateType">
                        <a-select-option value="Chet.WebApi.Template">单体 Web API 模板</a-select-option>
                      </a-select>
                    </a-form-item>

                    <div class="preview-namespace">
                      <CodeOutlined /> <span>{{ formState.companyName || "..." }}.{{ formState.projectName || "..." }}</span>
                    </div>

                    <a-button type="primary" block size="large" html-type="submit" :loading="loading" class="main-btn">
                      开始构建并下载
                    </a-button>
                  </a-form>
                </div>
              </a-col>

              <a-col :xs="24" :lg="14">
                <div class="console-card">
                  <div class="console-nav">
                    <div class="dots"><span class="r"></span><span class="y"></span><span class="g"></span></div>
                    <span class="console-title">BUILD CONSOLE</span>
                  </div>
                  <div class="terminal-body" ref="terminalRef">
                    <div v-if="logs.length === 0" class="terminal-empty">READY TO BUILD...</div>
                    <div v-for="(log, index) in logs" :key="index" class="log-line">
                      <span class="log-time">{{ log.time }}</span>
                      <span class="log-text" :class="log.type">>> {{ log.text }}</span>
                    </div>
                  </div>
                </div>
              </a-col>
            </a-row>
          </section>
        </a-layout-content>

        <a-layout-footer class="site-footer">
          <p>Released under the MIT License.</p>
          <p>© 2026 Chet.WebApi.Template · Built with ❤️ for .NET Developers.</p>
        </a-layout-footer>
      </a-layout>
    </div>
  </a-config-provider>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, watch, computed, onMounted } from "vue";
import { theme, message } from "ant-design-vue";
import * as Icons from "@ant-design/icons-vue";
import { TemplateService } from "./services/TemplateService";

// 解构常用图标
const { 
  GithubOutlined, CodeOutlined, BulbOutlined, BulbFilled, 
  ThunderboltFilled, ThunderboltOutlined, SafetyCertificateOutlined, DatabaseOutlined 
} = Icons;

/**
 * 主题切换逻辑
 */
const themeMode = ref<"light" | "dark">("dark");
const toggleTheme = () => {
  themeMode.value = themeMode.value === "light" ? "dark" : "light";
};

const themeConfig = computed(() => ({
  algorithm: themeMode.value === "light" ? theme.defaultAlgorithm : theme.darkAlgorithm,
  token: { colorPrimary: "#3b82f6", borderRadius: 12 },
}));

onMounted(() => {
  const hour = new Date().getHours();
  themeMode.value = (hour >= 18 || hour < 6) ? "dark" : "light";
});

/**
 * 静态数据
 */
const features = [
  { title: "高性能架构", desc: "基于 .NET 10 分层架构，包含 Application、Core 等模块。", icon: ThunderboltOutlined, colorClass: "blue" },
  { title: "完善的认证", desc: "集成 JWT 身份认证、刷新令牌机制及基于角色的授权功能。", icon: SafetyCertificateOutlined, colorClass: "purple" },
  { title: "开箱即用", desc: "内置 SQLite 支持、Redis 缓存及 Serilog 结构化日志管理。", icon: DatabaseOutlined, colorClass: "orange" },
];

/**
 * 业务逻辑
 */
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

// 监听日志变化自动滚动
watch(logs, () => {
  nextTick(() => {
    if (terminalRef.value) {
      terminalRef.value.scrollTo({ top: terminalRef.value.scrollHeight, behavior: 'smooth' });
    }
  });
}, { deep: true });

const onSubmit = async () => {
  if (!formState.companyName || !formState.projectName) {
    message.warning("请完善配置信息");
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
      (msg) => addLog(msg)
    );

    addLog("项目包构建完成，正在启动下载...", "success");
    
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${formState.companyName}.${formState.projectName}.zip`;
    link.click();
    window.URL.revokeObjectURL(url);
  } catch (e: any) {
    addLog(`构建失败: ${e.message}`, "error");
    message.error("构建过程中出现异常");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
/* 1. 基础布局与变量 */
.app-wrapper {
  min-height: 100vh;
  transition: background 0.4s cubic-bezier(0.4, 0, 0.2, 1), color 0.4s;
}
.app-wrapper.dark { background: #0f172a; color: #cbd5e1; }
.app-wrapper.light { background: #f8fafc; color: #1e293b; }

.layout-base { background: transparent; }

/* 2. 导航栏 */
.nav-header {
  position: fixed;
  width: 100%;
  z-index: 1000;
  padding: 0;
  height: 64px;
  line-height: 64px;
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.app-wrapper.light .nav-header { 
  background: rgba(255, 255, 255, 0.8); 
  border-bottom: 1px solid rgba(0, 0, 0, 0.05); 
}
.app-wrapper.dark .nav-header { 
  background: rgba(15, 23, 42, 0.8); 
  border-bottom: 1px solid rgba(255, 255, 255, 0.05); 
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
}

.header-left { display: flex; align-items: center; }
.logo-icon { height: 32px; width: auto; object-fit: contain; }
.logo-text { font-size: 18px; font-weight: 800; margin-left: 12px; letter-spacing: -0.5px; }

.header-menu { display: flex; gap: 32px; }
.menu-item { font-weight: 600; font-size: 14px; color: inherit; transition: 0.3s; }
.menu-item:hover { color: #3b82f6; }

.theme-icon-btn {
  background: transparent; border: none; cursor: pointer;
  font-size: 20px; display: flex; align-items: center; color: inherit;
  transition: transform 0.3s;
}
.theme-icon-btn:hover { transform: rotate(15deg) scale(1.1); }

/* 3. Hero Section */
.hero-section { text-align: center; padding: 160px 24px 80px; }
.hero-badge {
  display: inline-block; padding: 4px 16px; border-radius: 99px;
  font-size: 12px; font-weight: 700; color: #3b82f6;
  background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2);
  margin-bottom: 24px;
}
.hero-title { font-size: 56px; font-weight: 900; line-height: 1.1; margin-bottom: 24px; letter-spacing: -1px; }
.gradient-text {
  background: linear-gradient(135deg, #60a5fa, #a855f7);
  -webkit-background-clip: text; -webkit-text-fill-color: transparent;
}
.hero-subtitle { font-size: 18px; opacity: 0.7; max-width: 600px; margin: 0 auto; line-height: 1.6; }

.hero-actions { display: flex; justify-content: center; gap: 16px; margin-top: 40px; }
.btn-action-main, .btn-action-sub {
  padding: 12px 28px; font-size: 15px; border-radius: 12px;
  font-weight: 700; display: flex; align-items: center; gap: 8px; transition: all 0.3s;
}
.btn-action-main { background: #3b82f6; color: white; }
.btn-action-main:hover { transform: translateY(-2px); box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4); color: white; }
.btn-action-sub { color: inherit; }
.btn-action-sub:hover { transform: translateY(-2px); background: rgba(59, 130, 246, 0.1); }

/* 4. 通用卡片与玻璃拟态 */
.section-container { max-width: 1200px; margin: 0 auto; padding: 60px 24px; }
.section-header { text-align: center; margin-bottom: 48px; }
.section-header h2 { font-size: 32px; font-weight: 800; }
.title-line { width: 40px; height: 4px; background: #3b82f6; margin: 12px auto; border-radius: 2px; }

.glass {
  backdrop-filter: blur(12px); border-radius: 24px; padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.08); background: rgba(255, 255, 255, 0.03);
  transition: 0.3s;
}
.app-wrapper.light .glass { background: #fff; border: 1px solid rgba(0, 0, 0, 0.05); box-shadow: 0 10px 30px rgba(0, 0, 0, 0.02); }
.feature-card:hover { transform: translateY(-5px); }

.feature-icon { font-size: 32px; margin-bottom: 20px; }
.feature-icon.blue { color: #3b82f6; }
.feature-icon.purple { color: #a855f7; }
.feature-icon.orange { color: #f97316; }

/* 5. 生成器与控制台 */
.card-tag { font-size: 10px; font-weight: 800; opacity: 0.5; letter-spacing: 1.5px; margin-bottom: 20px; }
.preview-namespace {
  padding: 14px; background: rgba(0, 0, 0, 0.2); border-radius: 10px;
  margin: 20px 0; font-family: 'Fira Code', monospace; font-size: 13px; color: #94a3b8;
}
.main-btn { height: 52px; font-weight: 700; font-size: 16px; margin-top: 10px; }

.console-card { background: #0f172a; border-radius: 20px; overflow: hidden; border: 1px solid rgba(255,255,255,0.1); }
.console-nav { background: rgba(255, 255, 255, 0.05); padding: 12px 20px; display: flex; align-items: center; justify-content: space-between; }
.dots { display: flex; gap: 8px; }
.dots span { width: 10px; height: 10px; border-radius: 50%; }
.dots .r { background: #ff5f56; }
.dots .y { background: #ffbd2e; }
.dots .g { background: #27c93f; }
.console-title { font-size: 11px; font-weight: 800; color: #64748b; letter-spacing: 1px; }

.terminal-body { height: 400px; padding: 20px; overflow-y: auto; font-family: "Fira Code", monospace; font-size: 12px; scroll-behavior: smooth; }
.log-line { display: flex; gap: 12px; margin-bottom: 8px; line-height: 1.5; }
.log-time { color: #475569; min-width: 80px; }
.log-text.success { color: #4ade80; }
.log-text.error { color: #f87171; }
.log-text.info { color: #e2e8f0; }
.terminal-empty { height: 100%; display: flex; align-items: center; justify-content: center; color: #334155; letter-spacing: 4px; font-weight: 700; }

.site-footer { text-align: center; padding: 80px 0; opacity: 0.5; font-size: 13px; }

/* 6. 响应式适配 */
@media (max-width: 768px) {
  .hidden-mobile { display: none !important; }
  .hero-title { font-size: 36px !important; }
  .hero-section { padding-top: 120px; }
  .section-container { padding: 40px 20px; }
}
</style>