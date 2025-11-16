# 3D天气应用部署指南

## 项目概述
基于React + Three.js的3D天气可视化应用，支持实时天气数据、3D粒子效果、动态光照等功能。

## 技术栈
- Frontend: React 19, Three.js, React Three Fiber
- Backend: Node.js API (天气数据代理)
- Build: Create React App
- Server: Nginx (生产环境)

## 部署步骤

### 1. 环境准备
```bash
# 安装Node.js (v18+)
node --version

# 安装Nginx
sudo apt update
sudo apt install nginx

# 安装PM2 (进程管理)
npm install -g pm2
```

### 2. 构建应用
```bash
# 克隆项目
git clone <repository-url>
cd 3d-weather-codrops-main

# 安装依赖
npm install

# 构建生产版本
npm run build
```

### 3. 配置环境变量
创建 `.env.production` 文件：
```
REACT_APP_WEATHER_API_KEY=your_weather_api_key_here
```

### 4. 部署静态文件
```bash
# 创建部署目录
sudo mkdir -p /var/www/3d-weather

# 复制构建文件
sudo cp -r build/* /var/www/3d-weather/

# 设置权限
sudo chown -R www-data:www-data /var/www/3d-weather
sudo chmod -R 755 /var/www/3d-weather
```

### 5. 配置Nginx
```bash
# 备份默认配置
sudo cp /etc/nginx/sites-available/default /etc/nginx/sites-available/default.backup

# 复制新配置
sudo cp nginx.conf /etc/nginx/sites-available/default

# 创建SSL证书目录
sudo mkdir -p /etc/nginx/ssl

# 生成自签名证书 (测试用)
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/nginx/ssl/key.pem \
  -out /etc/nginx/ssl/cert.pem

# 测试配置
sudo nginx -t

# 重启Nginx
sudo systemctl restart nginx
```

### 6. 启动API服务
```bash
# 创建API服务文件
npm install express cors dotenv
node api-server.js

# 或使用PM2管理
pm2 start api-server.js --name "weather-api"
pm2 save
pm2 startup
```

### 7. 性能优化
- 启用Gzip压缩
- 配置缓存策略
- 启用HTTP/2
- 优化SSL配置

### 8. 监控设置
```bash
# 安装监控工具
sudo apt install htop iotop

# 设置日志轮转
sudo nano /etc/logrotate.d/nginx
```

## 访问测试
- HTTP: http://your-domain.com
- HTTPS: https://your-domain.com
- API测试: https://your-domain.com/api/weather?location=Beijing

## 故障排除

### 常见问题
1. **API密钥错误**: 检查环境变量配置
2. **CORS问题**: 确认Nginx代理配置
3. **SSL证书**: 使用Let's Encrypt获取免费证书
4. **性能问题**: 检查缓存配置和Gzip

### 日志查看
```bash
# Nginx错误日志
sudo tail -f /var/log/nginx/error.log

# API服务日志
pm2 logs weather-api

# 系统日志
sudo journalctl -u nginx -f
```

## 安全建议
1. 使用强SSL配置 (TLS 1.3)
2. 配置防火墙 (UFW)
3. 定期更新系统和依赖
4. 监控异常访问
5. 备份重要数据

## 性能指标
- 首屏加载时间: < 3秒
- API响应时间: < 500ms
- 缓存命中率: > 80%
- 可用性: 99.9%

## 维护计划
- 每周: 检查日志和性能
- 每月: 更新依赖和安全补丁
- 每季度: 备份和灾难恢复测试