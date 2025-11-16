const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;

// MIME类型映射
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain'
};

const server = http.createServer((req, res) => {
  // 解析URL
  const parsedUrl = url.parse(req.url);
  let pathname = parsedUrl.pathname;
  
  // 默认首页
  if (pathname === '/') {
    pathname = '/index.html';
  }
  
  // 构建文件路径
  const filePath = path.join(__dirname, 'build', pathname);
  
  // 检查文件是否存在
  fs.exists(filePath, (exists) => {
    if (!exists) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 - File Not Found</h1>');
      return;
    }
    
    // 读取文件
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(500);
        res.end('Error loading file');
        return;
      }
      
      // 设置MIME类型
      const ext = path.extname(filePath).toLowerCase();
      const contentType = mimeTypes[ext] || 'application/octet-stream';
      
      // 设置响应头
      res.writeHead(200, {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600',
        'X-Content-Type-Options': 'nosniff'
      });
      
      res.end(data);
    });
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 生产服务器运行在端口 ${PORT}`);
  console.log(`📱 本地访问: http://localhost:${PORT}`);
  console.log(`🌐 网络访问: http://0.0.0.0:${PORT}`);
  console.log('✅ 3D天气应用已部署完成！');
});