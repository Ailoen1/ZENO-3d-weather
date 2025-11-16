const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 开始GitHub Pages部署流程...');

try {
  // 1. 检查是否已经初始化git
  try {
    execSync('git status', { stdio: 'pipe' });
    console.log('✅ Git仓库已初始化');
  } catch (error) {
    console.log('📦 初始化Git仓库...');
    execSync('git init', { stdio: 'inherit' });
  }

  // 2. 创建gh-pages分支部署脚本
  const deployScript = `#!/bin/bash
# GitHub Pages部署脚本
echo "🚀 开始部署到GitHub Pages..."

# 构建生产版本
echo "📦 构建生产版本..."
npm run build

# 进入构建目录
cd build

# 创建临时git仓库
git init
git add -A
git commit -m 'Deploy to GitHub Pages'

# 推送到gh-pages分支
echo "📤 推送到GitHub Pages..."
git push -f https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git master:gh-pages

# 返回原目录
cd ..

echo "✅ 部署完成！访问：https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
`;

  fs.writeFileSync('deploy.sh', deployScript);
  console.log('✅ 创建部署脚本完成');

  // 3. 创建GitHub Actions工作流
  const githubActionsPath = '.github/workflows';
  if (!fs.existsSync(githubActionsPath)) {
    fs.mkdirSync(githubActionsPath, { recursive: true });
  }

  const workflowContent = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        REACT_APP_WEATHER_API_KEY: \${{ secrets.WEATHER_API_KEY }}
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: \${{ github.ref == 'refs/heads/main' }}
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./build
`;

  fs.writeFileSync(path.join(githubActionsPath, 'deploy.yml'), workflowContent);
  console.log('✅ 创建GitHub Actions工作流完成');

  // 4. 创建部署说明
  const deployGuide = `# GitHub Pages部署指南

## 快速部署步骤

### 方法1：使用GitHub Actions（推荐）
1. 在GitHub上创建新仓库
2. 将代码推送到main分支
3. 在GitHub仓库设置中添加密钥：
   - Settings → Secrets → Actions
   - 添加 WEATHER_API_KEY = ${process.env.WEATHER_API_KEY || '14b98029813d49acbc1101959251611'}
4. 推送代码到main分支，自动部署
5. 访问：https://[你的用户名].github.io/[仓库名]

### 方法2：手动部署
1. 修改deploy.sh中的用户名和仓库名
2. 运行：bash deploy.sh

## API配置
确保在GitHub Secrets中设置了 WEATHER_API_KEY，值为：14b98029813d49acbc1101959251611

## 访问地址
部署完成后，您的3D天气应用将在以下地址可用：
- https://[你的GitHub用户名].github.io/[仓库名]
`;

  fs.writeFileSync('GITHUB_DEPLOY.md', deployGuide);
  console.log('✅ 创建部署说明文档完成');

  console.log('\n🎉 GitHub Pages部署配置完成！');
  console.log('📖 请查看 GITHUB_DEPLOY.md 获取详细部署步骤');
  console.log('🔑 记得在GitHub仓库设置中添加API密钥');

} catch (error) {
  console.error('❌ 部署配置失败:', error.message);
  process.exit(1);
}