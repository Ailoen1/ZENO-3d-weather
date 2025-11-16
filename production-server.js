const express = require('express');
const path = require('path');
const cors = require('cors');
const compression = require('compression');

const app = express();
const PORT = process.env.PORT || 3000;

// 启用CORS和压缩
app.use(cors());
app.use(compression());

// 设置安全头
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  next();
});

// 提供静态文件
app.use(express.static(path.join(__dirname, 'build'), {
  maxAge: '1d',
  etag: true,
  lastModified: true
}));

// 处理React路由
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 生产服务器运行在端口 ${PORT}`);
  console.log(`📱 本地访问: http://localhost:${PORT}`);
  console.log(`🌐 网络访问: http://0.0.0.0:${PORT}`);
  console.log('✅ 3D天气应用已部署完成！');
});

module.exports = app;