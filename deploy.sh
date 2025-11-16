#!/bin/bash
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
