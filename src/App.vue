<template>
  <div class="app-container">
    <a-layout style="min-height: 100vh;">
      <a-layout-header class="header">
        <div class="logo">Chet WebAPI Template Generator</div>
      </a-layout-header>
      <a-layout-content class="content">
        <div class="form-wrapper">
          <h2>生成项目模板</h2>
          <a-form
            :model="formState"
            name="generator"
            :label-col="{ span: 6 }"
            :wrapper-col="{ span: 18 }"
            autocomplete="off"
            layout="vertical"
          >
            <a-form-item
              label="公司名称"
              name="companyName"
              :rules="[{ required: true, message: '请输入公司名称!' }]"
            >
              <a-input v-model:value="formState.companyName" placeholder="例如: MyCompany" />
            </a-form-item>

            <a-form-item
              label="项目名称"
              name="projectName"
              :rules="[{ required: true, message: '请输入项目名称!' }]"
            >
              <a-input v-model:value="formState.projectName" placeholder="例如: MyProject" />
            </a-form-item>

            <a-form-item
              label="模板"
              name="templateType"
            >
              <a-select
                v-model:value="formState.templateType"
                placeholder="选择模板"
                :options="templateOptions"
              />
            </a-form-item>

            <a-form-item :wrapper-col="{ offset: 6, span: 18 }">
              <a-button 
                type="primary" 
                @click="onSubmit" 
                :loading="loading"
                :disabled="loading"
              >
                {{ loading ? '生成中...' : '生成项目' }}
              </a-button>
            </a-form-item>
          </a-form>

          <div v-if="logs.length > 0" class="logs-section">
            <h3>生成日志</h3>
            <div class="logs-container">
              <pre>{{ logs.join('\n') }}</pre>
            </div>
          </div>
        </div>
      </a-layout-content>
      <a-layout-footer class="footer">
        Chet WebAPI Template Generator ©2024 Created by Chet Team
      </a-layout-footer>
    </a-layout>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue';
import { message } from 'ant-design-vue';
import { TemplateService } from './services/TemplateService';

interface FormState {
  companyName: string;
  projectName: string;
  templateType: string;
}

const formState = reactive<FormState>({
  companyName: '',
  projectName: '',
  templateType: 'Chet.WebApi.Template'
});

const templateOptions = [
  { label: 'Chet.WebApi.Template', value: 'Chet.WebApi.Template' }
];

const loading = ref(false);
const logs = ref<string[]>([]);

const addLog = (message: string) => {
  const timestamp = new Date().toLocaleTimeString();
  logs.value.push(`${timestamp} ${message}`);
};

const onSubmit = async () => {
  if (!formState.companyName.trim()) {
    message.error('请输入公司名称!');
    return;
  }
  
  if (!formState.projectName.trim()) {
    message.error('请输入项目名称!');
    return;
  }

  loading.value = true;
  logs.value = [];
  
  try {
    addLog('开始下载模板...');
    
    // 使用模板服务生成项目
    const templateService = new TemplateService();
    const zipBlob = await templateService.downloadAndProcessTemplate(
      formState.templateType,
      formState.companyName,
      formState.projectName,
      addLog
    );
    
    addLog('模板生成完成，准备下载...');
    
    // 触发下载
    const url = window.URL.createObjectURL(zipBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formState.companyName}.${formState.projectName}.zip`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    
    addLog('项目模板已下载完成！');
    message.success('项目模板生成成功！');
  } catch (error) {
    console.error('生成模板失败:', error);
    addLog(`生成失败: ${(error as Error).message}`);
    message.error(`生成失败: ${(error as Error).message}`);
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.app-container {
  height: 100vh;
  background-color: #f5f5f5;
}

.header {
  display: flex;
  align-items: center;
}

.logo {
  color: white;
  font-size: 18px;
  font-weight: bold;
}

.content {
  padding: 50px;
}

.form-wrapper {
  max-width: 800px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.logs-section {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid #eee;
}

.logs-container {
  background: #f6f8fa;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  padding: 15px;
  max-height: 300px;
  overflow-y: auto;
  font-family: monospace;
  font-size: 14px;
}

.footer {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>