# GitHub Pages部署指南

## 快速部署步骤

### 方法1：使用GitHub Actions（推荐）
1. 在GitHub上创建新仓库
2. 将代码推送到main分支
3. 在GitHub仓库设置中添加密钥：
   - Settings → Secrets → Actions
   - 添加 WEATHER_API_KEY = 14b98029813d49acbc1101959251611
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
