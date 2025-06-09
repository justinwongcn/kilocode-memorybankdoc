// 导入所需的 Node.js 模块
const fs = require('fs').promises;  // 用于文件系统操作
const path = require('path');       // 用于路径处理
const chalk = require('chalk');     // 用于终端输出着色

// 定义项目根目录和相关路径
const projectRoot = path.join(__dirname, '..');  // 获取项目根目录
const docsPath = path.join(projectRoot, 'docs'); // 文档目录路径
const zhCnPath = path.join(projectRoot, 'docs', 'zh-CN'); // 中文翻译目录路径
const ALLOWED_LINE_DIFF_PERCENT = 0.1; // 允许源文件和翻译文件之间的行数差异百分比

/**
 * 获取文件的统计信息
 * @param {string} filePath - 文件路径
 * @returns {Promise<{exists: boolean, lineCount?: number, size?: number}>}
 *         返回包含文件状态的对象，包括是否存在、行数和大小
 */
async function getFileStats(filePath) {
  try {
    // 将相对路径转换为绝对路径以便调试
    const absolutePath = filePath.startsWith(projectRoot)
      ? filePath
      : path.join(projectRoot, filePath);
    console.log(`Attempting to read file: ${absolutePath}`);
    
    // 读取文件内容并计算行数
    const content = await fs.readFile(absolutePath, 'utf8');
    const lines = content.split('\n').filter(line => line.trim() !== '');
    return {
      exists: true,             // 文件存在
      lineCount: lines.length,  // 文件行数
      size: Buffer.byteLength(content, 'utf8') // 文件大小（字节数）
    };
  } catch (e) {
    console.error(`Error reading file ${filePath}:`, e);
    return { exists: false };  // 文件不存在或读取失败
  }
}

/**
 * 递归检查目录中的翻译文件
 * @param {string} dir - 要检查的目录路径
 * @param {string} [relativePath=''] - 相对于文档根目录的相对路径
 * @returns {Promise<Array<{path: string, status: string, enLines?: number, zhLines?: number, diffPercent?: string}>>}
 *         返回包含翻译状态的对象数组
 */
async function checkTranslations(dir, relativePath = '') {
  const files = await fs.readdir(dir);
  
  // 并行处理所有文件和子目录
  const results = await Promise.all(files.map(async file => {
    const fullPath = path.join(dir, file);
    const relPath = path.join(relativePath, file);
    const stats = await fs.stat(fullPath);

    if (stats.isDirectory()) {
      // 如果是目录，递归检查
      return checkTranslations(fullPath, relPath);
    } else if (stats.isFile() && (file.endsWith('.md') || file.endsWith('.mdx'))) {
      // 跳过已经翻译的zh-CN目录下的文件
      if (fullPath.includes('docs/zh-CN')) {
        return null;
      }
      // 如果是 Markdown 文件，检查翻译
      const zhPath = path.join(zhCnPath, relPath); // 构造对应的中文翻译文件路径
      const [enStats, zhStats] = await Promise.all([
        getFileStats(fullPath),  // 获取源文件统计信息
        getFileStats(zhPath)     // 获取翻译文件统计信息
      ]);

      if (!zhStats.exists) {
        // 如果翻译文件不存在
        return { path: relPath, status: 'missing', enLines: enStats.lineCount };
      }

      // 计算行数差异
      const lineDiff = Math.abs(zhStats.lineCount - enStats.lineCount);
      const maxAllowedDiff = enStats.lineCount * ALLOWED_LINE_DIFF_PERCENT;
      
      if (lineDiff > maxAllowedDiff) {
        // 如果行数差异超过允许范围
        return {
          path: relPath,
          status: 'line_mismatch',
          enLines: enStats.lineCount,
          zhLines: zhStats.lineCount,
          diffPercent: (lineDiff / enStats.lineCount * 100).toFixed(1)
        };
      }

      // 翻译文件正常
      return { path: relPath, status: 'ok' };
    }
    return null;
  }));

  // 展平结果并过滤掉 null 值
  return results.flat().filter(Boolean);
}

/**
 * 格式化检查结果报告
 * @param {Array<{path: string, status: string, enLines?: number, zhLines?: number, diffPercent?: string}>} results - 检查结果数组
 * @returns {string} 格式化的报告字符串
 */
function formatReport(results) {
  let output = '';
  let errorCount = 0;

  // 遍历所有结果并格式化输出
  results.forEach(({ path, status, enLines, zhLines, diffPercent }) => {
    switch (status) {
      case 'missing':
        output += chalk.red(`✗ Missing: ${path}\n`);  // 红色标记缺失的翻译
        errorCount++;
        break;
      case 'line_mismatch':
        output += chalk.yellow(`⚠ Line mismatch: ${path} (EN:${enLines} vs ZH:${zhLines}, +${diffPercent}%)\n`); // 黄色标记行数不匹配
        errorCount++;
        break;
      case 'ok':
        output += chalk.green(`✓ OK: ${path}\n`);  // 绿色标记正常的翻译
        break;
    }
  });

  // 生成总结信息
  const summary = `\nTranslation check completed. Found ${errorCount} issues.\n`;
  return errorCount > 0 ? chalk.red(summary) + output : chalk.green(summary) + output;
}

// 主执行入口
(async () => {
  console.log(chalk.blue('Checking translations...'));
  
  // 检查所有翻译文件
  const results = await checkTranslations(docsPath);
  
  // 输出格式化后的检查报告
  console.log(formatReport(results));
})();