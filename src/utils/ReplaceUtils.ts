/**
 * 替换工具类
 * 提供各种字符串和文件内容替换功能
 */

export class ReplaceUtils {
  /**
   * 替换文本内容中的占位符
   * @param content 原始内容
   * @param companyName 公司名称
   * @param projectName 项目名称
   */
  static replacePlaceholders(content: string, companyName: string, projectName: string): string {
    if (!content || typeof content !== 'string') {
      return content;
    }

    // 定义替换规则，按照优先级顺序执行
    const replacements = [
      // 精确匹配原始模板名称
      { from: /Chet\.WebApi\.Template/g, to: `${companyName}.${projectName}` },
      { from: /Chet-WebApi-Template/g, to: `${companyName}-${projectName}` },
      { from: /chet\.webapi\.template/g, to: `${companyName.toLowerCase()}.${projectName.toLowerCase()}` },
      
      // 替换公司名称
      { from: /\bChet\b/g, to: companyName },
      { from: /\bchet\b/g, to: companyName.toLowerCase() },
      
      // 替换项目名称
      { from: /\bWebApi\.Template\b/g, to: projectName },
      { from: /\bwebapi\.template\b/g, to: projectName.toLowerCase() },
      
      // 通用模板变量
      { from: /{{companyName}}/g, to: companyName },
      { from: /{{projectName}}/g, to: projectName },
      { from: /<%=\s*companyName\s*%>/g, to: companyName },
      { from: /<%=\s*projectName\s*%>/g, to: projectName },
    ];

    let result = content;
    for (const replacement of replacements) {
      result = result.replace(replacement.from, replacement.to);
    }

    return result;
  }

  /**
   * 根据文件路径判断是否需要处理
   * @param filePath 文件路径
   */
  static shouldProcessFile(filePath: string): boolean {
    // 定义需要处理的文件类型
    const extensions = [
      '.sln', '.csproj', '.cs', '.cshtml', '.json', 
      '.yml', '.yaml', '.xml', '.txt', '.md', 
      '.razor', '.js', '.ts', '.vue', '.jsx', '.tsx'
    ];
    
    const filenamePatterns = [
      'README', 'readme', 'Readme',
      '.env', '.gitignore', 'Dockerfile', 'dockerfile'
    ];
    
    const ext = filePath.substring(filePath.lastIndexOf('.')).toLowerCase();
    const filename = filePath.split('/').pop()?.split('.')[0] || '';
    
    return extensions.includes(ext) || filenamePatterns.includes(filename);
  }

  /**
   * 生成适合的文件/文件夹名称
   * @param originalName 原始名称
   * @param companyName 公司名称
   * @param projectName 项目名称
   */
  static generateNewName(originalName: string, companyName: string, projectName: string): string {
    return ReplaceUtils.replacePlaceholders(originalName, companyName, projectName);
  }
}