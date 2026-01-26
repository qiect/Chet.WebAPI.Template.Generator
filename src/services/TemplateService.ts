import JSZip from 'jszip';
import { ReplaceUtils } from '../utils/ReplaceUtils';
import { TemplateConfigManager } from '../utils/TemplateConfigManager';

/**
 * 模板服务类
 * 负责处理模板下载、处理和生成
 */
export class TemplateService {
  /**
   * 下载并处理模板
   * @param templateType 模板类型
   * @param companyName 公司名称
   * @param projectName 项目名称
   * @param logCallback 日志回调函数
   */
  async downloadAndProcessTemplate(
    templateType: string,
    companyName: string,
    projectName: string,
    logCallback: (message: string) => void
  ): Promise<Blob> {
    // 1. 获取模板（使用GitHub API绕过CORS）
    logCallback(`开始获取模板: ${templateType}`);
    const zipBlob = await this.fetchTemplateFromGitHub(templateType, logCallback);

    // 2. 解压模板
    logCallback('开始解压模板...');
    const zip = await JSZip.loadAsync(zipBlob);

    // 3. 处理模板内容
    logCallback('开始处理模板内容...');
    await this.processZipContent(zip, companyName, projectName, logCallback);

    // 4. 生成新的ZIP文件
    logCallback('正在生成项目模板...');
    const processedZip = await zip.generateAsync({ type: 'blob' });

    return processedZip;
  }

  /**
   * 从GitHub获取模板
   * 使用GitHub API和第三方CORS代理来避免CORS问题
   */
  private async fetchTemplateFromGitHub(templateType: string, logCallback: (message: string) => void): Promise<Blob> {
    try {
      const config = TemplateConfigManager.getConfigByName(templateType) || 
                    TemplateConfigManager.getConfigByName('Chet.WebApi.Template');
      
      if (!config) {
        throw new Error(`找不到模板配置: ${templateType}`);
      }
      
      logCallback(`获取 ${config.displayName} (${config.githubRepo}) 最新发布信息...`);
      
      // 使用GitHub API获取最新release信息
      // 使用多个CORS代理服务作为备选方案
      const apiEndpoint = `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/releases/latest`;
      const corsProxyUrls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(apiEndpoint)}`,
        `https://corsproxy.io/?${encodeURIComponent(apiEndpoint)}`,
        `https://cors-anywhere.herokuapp.com/${apiEndpoint}`
      ];
      
      let releaseResponse: Response | null = null;
      let lastError: any = null;
      
      // 尝试多个CORS代理
      for (const proxyUrl of corsProxyUrls) {
        try {
          releaseResponse = await fetch(proxyUrl);
          if (releaseResponse.ok) {
            break;
          }
        } catch (error) {
          lastError = error;
          console.warn(`CORS代理请求失败: ${proxyUrl}`, error);
          continue; // 尝试下一个代理
        }
      }
      
      if (!releaseResponse || !releaseResponse.ok) {
        throw new Error(`无法获取 ${config.githubRepo} 的最新发布信息: ${lastError?.message || '所有CORS代理均不可用'}`);
      }
      
      const releaseData = await releaseResponse.json();
      
      // GitHub releases可能没有assets，但有zipball_url和tarball_url
      let asset = null;
      if (Array.isArray(releaseData.assets) && releaseData.assets.length > 0) {
        // 如果有assets，尝试找ZIP文件
        asset = releaseData.assets.find((a: any) => a.name?.endsWith('.zip'));
      }
      
      // 如果没找到ZIP assets，使用zipball_url（这是一个完整的项目压缩包）
      if (!asset && releaseData.zipball_url) {
        asset = {
          browser_download_url: releaseData.zipball_url,
          name: `${config.githubRepo}-latest.zip`,
          size: releaseData.size || 0
        };
      }
      
      // 如果还没有，尝试tarball_url
      if (!asset && releaseData.tarball_url) {
        asset = {
          browser_download_url: releaseData.tarball_url,
          name: `${config.githubRepo}-latest.tar.gz`,
          size: releaseData.size || 0
        };
      }
      
      if (!asset) {
        throw new Error(`未找到 ${config.githubRepo} 的ZIP/TAR资产文件`);
      }
      
      logCallback(`找到资源: ${asset.name}, 大小: ${asset.size > 0 ? (asset.size / 1024 / 1024).toFixed(2) + ' MB' : '未知'}`);
      
      // 使用多个CORS代理下载ZIP文件
      const downloadProxyUrls = [
        `https://api.allorigins.win/raw?url=${encodeURIComponent(asset.browser_download_url)}`,
        `https://corsproxy.io/?${encodeURIComponent(asset.browser_download_url)}`,
        `https://cors-anywhere.herokuapp.com/${asset.browser_download_url}`
      ];
      
      let downloadResponse: Response | null = null;
      lastError = null;
      
      // 尝试多个CORS代理
      for (const proxyUrl of downloadProxyUrls) {
        try {
          downloadResponse = await fetch(proxyUrl);
          if (downloadResponse.ok) {
            break;
          }
        } catch (error) {
          lastError = error;
          console.warn(`下载代理请求失败: ${proxyUrl}`, error);
          continue; // 尝试下一个代理
        }
      }
      
      if (!downloadResponse || !downloadResponse.ok) {
        throw new Error(`下载失败: ${lastError?.message || '所有CORS代理均不可用'}`);
      }
      
      const blob = await downloadResponse.blob();
      logCallback('模板下载完成');
      return blob;
    } catch (error) {
      console.error('从GitHub获取模板失败:', error);
      logCallback(`获取模板失败: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * 处理ZIP内容
   */
  private async processZipContent(
    zip: JSZip,
    companyName: string,
    projectName: string,
    logCallback: (message: string) => void
  ): Promise<void> {
    // 获取所有文件路径
    const filePaths = Object.keys(zip.files);
    
    // 查找根级别的文件夹（通常是GitHub下载的顶级目录，如 qiect-Chet.WebApi.Template-a1e64d3）
    const rootFolders = filePaths
      .filter(path => zip.files[path].dir) // 是目录
      .map(path => path.split('/')[0]) // 获取第一级目录名
      .filter((dirName, index, arr) => arr.indexOf(dirName) === index); // 去重
    
    // 如果只有一个根目录，说明是从GitHub下载的zipball，需要展开
    if (rootFolders.length === 1) {
      const rootFolderName = rootFolders[0];
      logCallback(`检测到GitHub下载格式，展开根目录: ${rootFolderName}`);
      
      // 创建一个新的JSZip实例来存放处理后的内容
      const newZip = new JSZip();
      
      // 遍历原zip的所有文件
      for (const filePath of filePaths) {
        if (filePath.startsWith(rootFolderName + '/')) {
          // 这是根目录下的文件，需要去掉根目录前缀
          const relativePath = filePath.substring(rootFolderName.length + 1);
          
          if (relativePath) { // 确保不是空路径
            const zipEntry = zip.file(filePath);
            if (zipEntry) {
              if (zipEntry.dir) {
                // 是目录，跳过（我们会根据文件自动创建目录）
                continue;
              } else {
                // 是文件，读取内容并处理
                const fileContent = await zipEntry.async('string');
                // 替换内容中的占位符
                const processedContent = this.replacePlaceholders(fileContent, companyName, projectName);
                // 处理文件路径中的占位符
                const newRelativePath = this.replacePlaceholders(relativePath, companyName, projectName);
                // 添加到新zip
                newZip.file(newRelativePath, processedContent);
              }
            }
          }
        }
      }
      
      // 清空原zip并复制处理后的内容
      const originalFilePaths = Object.keys(zip.files);
      for (const filePath of originalFilePaths) {
        zip.remove(filePath);
      }
      
      // 将新zip的内容复制回原zip
      for (const [filePath, file] of Object.entries(newZip.files)) {
        if (file.dir) {
          zip.folder(filePath);
        } else {
          const content = await file.async('string');
          zip.file(filePath, content);
        }
      }
    } else {
      // 不是标准的GitHub zipball格式，使用原来的处理方式
      // 获取所有文件路径
      const filePaths = Object.keys(zip.files);
      
      // 先收集所有要删除的原始路径（避免在遍历时修改集合）
      const filesToDelete: string[] = [];
      const foldersToDelete: string[] = [];
      
      for (const filePath of filePaths) {
        const zipEntry = zip.file(filePath);
        
        if (zipEntry) {
          // 检查是否是文件夹
          if (zipEntry.dir) {
            // 处理文件夹重命名
            const newFolderPath = this.replacePlaceholders(filePath, companyName, projectName);
            
            if (newFolderPath !== filePath) {
              // 重命名文件夹
              const folder = zip.folder(filePath);
              if (folder) {
                // 收集要删除的原始文件夹路径
                foldersToDelete.push(filePath);
                
                // 重新添加文件夹（JSZip会自动创建必要的父目录）
                const newFolder = zip.folder(newFolderPath);
                
                // 将原文件夹中的内容移到新文件夹
                const originalFiles = Object.keys(zip.files).filter(f => f.startsWith(filePath) && f !== filePath);
                for (const originalFile of originalFiles) {
                  const relativePath = originalFile.substring(filePath.length);
                  if (relativePath) { // 不是空字符串
                    const fileContent = await zip.file(originalFile)?.async('string');
                    if (fileContent) {
                      newFolder.file(relativePath, fileContent);
                      // 收集要删除的原始文件路径
                      filesToDelete.push(originalFile);
                    }
                  }
                }
              }
            }
          } else {
            // 处理文件
            const fileContent = await zipEntry.async('string');
            const newFilePath = this.replacePlaceholders(filePath, companyName, projectName);
            
            // 如果文件名发生了变化，则记录删除和添加操作
            if (newFilePath !== filePath) {
              // 收集要删除的原始文件路径
              filesToDelete.push(filePath);
              // 替换内容并保存到新路径
              const processedContent = this.replacePlaceholders(fileContent, companyName, projectName);
              zip.file(newFilePath, processedContent);
            } else {
              // 只更新文件内容
              const processedContent = this.replacePlaceholders(fileContent, companyName, projectName);
              zip.file(filePath, processedContent);
            }
          }
        }
      }
      
      // 统一删除原始文件和文件夹
      for (const fileToDelete of filesToDelete) {
        zip.remove(fileToDelete);
      }
      
      for (const folderToDelete of foldersToDelete) {
        zip.remove(folderToDelete);
      }
    }
  }

  /**
   * 替换占位符
   */
  private replacePlaceholders(content: string, companyName: string, projectName: string): string {
    return ReplaceUtils.replacePlaceholders(content, companyName, projectName);
  }


}