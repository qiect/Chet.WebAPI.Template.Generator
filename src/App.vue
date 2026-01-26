<template>
  <div class="app-container">
    <a-layout class="layout-base">
      <a-layout-header class="custom-header">
        <div class="header-content">
          <div class="brand">
            <RocketOutlined class="brand-icon" />
            <span class="brand-title">Chet.WebAPI.Template.Generator</span>
          </div>
          <div class="header-links">
            <a-button type="link" href="https://github.com/Chet-Team" target="_blank">
              <template #icon><GithubOutlined /></template>
            </a-button>
          </div>
        </div>
      </a-layout-header>

      <a-layout-content class="main-content">
        <div class="center-wrapper">
          <div class="intro-section">
            <h1>生成项目模板</h1>
            <p>基于 Vue 3、Ant Design Vue 和 TypeScript 的现代化项目生成器</p>
          </div>

          <a-row :gutter="[24, 24]">
            <a-col :xs="24" :lg="10">
              <a-card class="glass-card" :bordered="false">
                <a-form :model="formState" layout="vertical" @finish="onSubmit">
                  <a-form-item 
                    label="公司名称" 
                    name="companyName"
                    :rules="[{ required: true, message: '请输入公司名称!' }]"
                  >
                    <a-input v-model:value="formState.companyName" placeholder="例如: MyCompany" size="large" />
                  </a-form-item>

                  <a-form-item 
                    label="项目名称" 
                    name="projectName"
                    :rules="[{ required: true, message: '请输入项目名称!' }]"
                  >
                    <a-input v-model:value="formState.projectName" placeholder="例如: MyProject" size="large" />
                  </a-form-item>

                  <a-form-item label="模板类型" name="templateType">
                    <a-select v-model:value="formState.templateType" :options="templateOptions" size="large" />
                  </a-form-item>

                  <a-button 
                    type="primary" 
                    block 
                    size="large" 
                    html-type="submit"
                    :loading="loading"
                    class="submit-btn"
                  >
                    {{ loading ? '正在处理模板...' : '生成并下载项目' }}
                  </a-button>
                </a-form>
              </a-card>
            </a-col>

            <a-col :xs="24" :lg="14">
              <a-card class="console-card" :bordered="false">
                <template #title>
                  <span style="color: #fff"><CodeOutlined /> 构建日志</span>
                </template>
                <div class="terminal" ref="terminalRef">
                  <div v-if="logs.length === 0" class="terminal-empty">
                    等待操作指令...
                  </div>
                  <div v-for="(log, index) in logs" :key="index" class="terminal-line">
                    <span class="line-time">{{ log.split(' ')[0] }}</span>
                    <span class="line-text">{{ log.split(' ').slice(1).join(' ') }}</span>
                  </div>
                </div>
              </a-card>
            </a-col>
          </a-row>
        </div>
      </a-layout-content>

      <a-layout-footer class="custom-footer">
        Chet WebAPI Template Generator ©2026 Created by Chet Team
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, nextTick, watch } from 'vue';
import { message } from 'ant-design-vue';
import { RocketOutlined, GithubOutlined, CodeOutlined } from '@ant-design/icons-vue';
import { TemplateService } from './services/TemplateService';

// 表单状态
const formState = reactive({
  companyName: '',
  projectName: '',
  templateType: 'Chet.WebApi.Template'
});

// 模板选项
const templateOptions = [
  { label: 'Chet.WebApi.Template', value: 'Chet.WebApi.Template' }
];

const loading = ref(false);
const logs = ref<string[]>([]);
const terminalRef = ref<HTMLElement | null>(null);

// 日志记录函数
const addLog = (msg: string) => {
  const timestamp = new Date().toLocaleTimeString();
  logs.value.push(`${timestamp} ${msg}`);
};

// 自动滚动日志
watch(logs, () => {
  nextTick(() => {
    if (terminalRef.value) {
      terminalRef.value.scrollTop = terminalRef.value.scrollHeight;
    }
  });
}, { deep: true });

// 提交逻辑
const onSubmit = async () => {
  if (!formState.companyName.trim() || !formState.projectName.trim()) {
    message.error('请填写完整信息');
    return;
  }

  loading.value = true;
  logs.value = [];
  
  try {
    addLog('正在通过 CORS 代理获取模板...');
    const templateService = new TemplateService();
    const zipBlob = await templateService.downloadAndProcessTemplate(
      formState.templateType,
      formState.companyName,
      formState.projectName,
      addLog
    );
    
    addLog('文件处理与重命名完成，生成 ZIP 中...');
    
    const url = window.URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formState.companyName}.${formState.projectName}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    addLog('项目模板已下载完成！');
    message.success('生成成功');
  } catch (error) {
    addLog(`错误: ${(error as Error).message}`);
    message.error('生成失败');
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.app-container {
  background-color: #f0f2f5;
  min-height: 100vh;
}

.layout-base {
  background: transparent;
}

.custom-header {
  background: #fff;
  padding: 0 50px;
  height: 64px;
  line-height: 64px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-icon {
  font-size: 24px;
  color: #1890ff;
}

.brand-title {
  font-size: 18px;
  font-weight: 600;
  color: #262626;
}

.main-content {
  padding: 40px 20px;
}

.center-wrapper {
  max-width: 1100px;
  margin: 0 auto;
}

.intro-section {
  text-align: center;
  margin-bottom: 40px;
}

.intro-section h1 {
  font-size: 32px;
  font-weight: 700;
  margin-bottom: 8px;
}

.intro-section p {
  color: #8c8c8c;
  font-size: 16px;
}

/* 磨砂卡片效果 */
.glass-card {
  border-radius: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.05);
  padding: 10px;
}

.submit-btn {
  margin-top: 20px;
  height: 50px;
  font-size: 16px;
  border-radius: 8px;
}

/* 控制台样式 */
.console-card {
  background: #1e1e1e;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
}

.terminal {
  background: #1e1e1e;
  height: 380px;
  padding: 16px;
  overflow-y: auto;
  font-family: 'Consolas', monospace;
  font-size: 13px;
  line-height: 1.8;
}

.terminal-line {
  display: flex;
  gap: 12px;
  margin-bottom: 4px;
}

.line-time {
  color: #6a9955;
  white-space: nowrap;
}

.line-text {
  color: #d4d4d4;
  word-break: break-all;
}

.terminal-empty {
  color: #555;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-footer {
  text-align: center;
  color: #bfbfbf;
  padding: 40px 0;
}
</style>