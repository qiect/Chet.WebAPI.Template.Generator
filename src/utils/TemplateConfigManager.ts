/**
 * 模板配置接口
 */
export interface TemplateConfig {
  name: string;
  displayName: string;
  description: string;
  githubRepo: string;
  githubOwner: string;
  defaultBranch?: string;
}

/**
 * 模板配置管理器
 */
export class TemplateConfigManager {
  private static configs: TemplateConfig[] = [
    {
      name: 'Chet.WebApi.Template',
      displayName: 'Chet.WebApi.Template',
      description: '基于 .NET 8 的全功能 WebAPI 模板',
      githubOwner: 'qiect',
      githubRepo: 'Chet.WebApi.Template'
    }
  ];

  /**
   * 获取所有模板配置
   */
  static getAllConfigs(): TemplateConfig[] {
    return this.configs;
  }

  /**
   * 根据名称获取模板配置
   */
  static getConfigByName(name: string): TemplateConfig | undefined {
    return this.configs.find(config => config.name === name);
  }

  /**
   * 获取模板的 GitHub API URL
   */
  static getGithubApiUrl(config: TemplateConfig): string {
    return `https://api.github.com/repos/${config.githubOwner}/${config.githubRepo}/releases/latest`;
  }

  /**
   * 获取模板的下载 URL
   */
  static getDownloadUrl(assetUrl: string): string {
    return assetUrl;
  }
}