# DNS配置指南

## 域名和DNS设置

### 1. 域名注册
首先需要一个域名，可以在以下平台注册：
- 阿里云（万网）
- 腾讯云
- 华为云
- GoDaddy
- Namecheap

### 2. DNS记录配置

#### A记录（IPv4地址记录）
```
主机记录    记录类型    记录值          TTL
@           A           你的服务器IP     600
www         A           你的服务器IP     600
api         A           你的服务器IP     600
```

#### AAAA记录（IPv6地址记录，可选）
```
主机记录    记录类型    记录值          TTL
@           AAAA        你的IPv6地址     600
www         AAAA        你的IPv6地址     600
```

#### CNAME记录（别名记录）
```
主机记录    记录类型    记录值              TTL
www         CNAME       your-domain.com.    600
```

### 3. 具体配置步骤

#### 步骤1：获取服务器IP地址
```bash
# 查看公网IP
curl -s ifconfig.me
# 或者
curl -s ipinfo.io/ip
```

#### 步骤2：配置DNS解析
以阿里云为例：
1. 登录阿里云控制台
2. 进入"域名解析DNS"
3. 选择你的域名
4. 添加以下记录：

```
# 主域名解析
主机记录: @
记录类型: A
记录值: [你的服务器IP]
TTL: 10分钟

# www子域名解析
主机记录: www
记录类型: A
记录值: [你的服务器IP]
TTL: 10分钟

# API子域名解析（可选）
主机记录: api
记录类型: A
记录值: [你的服务器IP]
TTL: 10分钟
```

#### 步骤3：验证DNS配置
```bash
# 使用dig命令验证
dig your-domain.com A
dig www.your-domain.com A

# 使用nslookup验证
nslookup your-domain.com
nslookup www.your-domain.com

# 检查全球DNS传播情况
dig @8.8.8.8 your-domain.com
dig @1.1.1.1 your-domain.com
```

### 4. 高级DNS配置

#### CDN配置（推荐）
使用CDN可以提高访问速度和可靠性：

**阿里云CDN配置：**
```
加速域名: www.your-domain.com
源站域名: your-domain.com
端口: 443
协议: HTTPS
```

**Cloudflare配置：**
1. 注册Cloudflare账号
2. 添加你的网站
3. 更新Nameservers到Cloudflare
4. 配置SSL/TLS为"Full (strict)"

#### 负载均衡（可选）
如果有多个服务器：
```
# 主服务器
@           A           主服务器IP       600
# 备份服务器
@           A           备份服务器IP     600
```

### 5. SSL证书配置

#### Let's Encrypt免费证书
```bash
# 安装certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# 自动续期
sudo crontab -e
# 添加：
0 12 * * * /usr/bin/certbot renew --quiet
```

#### 阿里云SSL证书
1. 在阿里云申请免费SSL证书
2. 下载Nginx格式的证书
3. 上传到服务器：
```bash
sudo mkdir -p /etc/nginx/ssl
sudo cp your-domain.com.pem /etc/nginx/ssl/cert.pem
sudo cp your-domain.com.key /etc/nginx/ssl/key.pem
```

### 6. Nginx配置更新

更新nginx.conf中的域名配置：
```nginx
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com www.your-domain.com;
    
    ssl_certificate /etc/nginx/ssl/cert.pem;
    ssl_certificate_key /etc/nginx/ssl/key.pem;
    
    # ... 其他配置保持不变
}
```

### 7. 验证配置

#### 测试HTTPS访问
```bash
# 测试主域名
curl -I https://your-domain.com
curl -I https://www.your-domain.com

# 测试API端点
curl -I https://your-domain.com/api/weather?location=Beijing
```

#### SSL证书验证
```bash
# 检查证书有效期
openssl s_client -connect your-domain.com:443 -servername your-domain.com < /dev/null

# 在线SSL测试
# 访问: https://www.ssllabs.com/ssltest/
```

### 8. 故障排除

#### DNS解析问题
```bash
# 清除本地DNS缓存
# Windows
ipconfig /flushdns

# macOS
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches
```

#### 检查DNS传播
```bash
# 使用不同的DNS服务器检查
dig @8.8.8.8 your-domain.com
dig @1.1.1.1 your-domain.com
dig @223.5.5.5 your-domain.com
```

#### 防火墙配置
确保服务器防火墙允许HTTP/HTTPS流量：
```bash
# Ubuntu/Debian
sudo ufw allow 'Nginx Full'
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# CentOS/RHEL
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload
```

### 9. 监控和维护

#### DNS监控脚本
```bash
#!/bin/bash
# DNS监控脚本

DOMAIN="your-domain.com"
EXPECTED_IP="你的服务器IP"

current_ip=$(dig +short $DOMAIN A | head -1)

if [ "$current_ip" != "$EXPECTED_IP" ]; then
    echo "DNS解析异常: 期望 $EXPECTED_IP, 实际 $current_ip"
    # 发送告警邮件或消息
else
    echo "DNS解析正常: $current_ip"
fi
```

#### 设置定时监控
```bash
# 添加到crontab
*/30 * * * * /path/to/dns-monitor.sh >> /var/log/dns-monitor.log 2>&1
```

### 10. 最佳实践

1. **使用CDN**: 提高全球访问速度
2. **配置多个DNS**: 使用主备DNS服务器
3. **设置合理的TTL**: 平衡性能和灵活性
4. **启用DNSSEC**: 增加安全性
5. **定期监控**: 检查DNS解析状态
6. **备份配置**: 保存DNS配置记录

## 配置检查清单

- [ ] 域名已注册并可管理
- [ ] DNS A记录指向正确IP
- [ ] www子域名已配置
- [ ] SSL证书已申请并配置
- [ ] Nginx配置已更新域名
- [ ] 防火墙允许HTTP/HTTPS
- [ ] CDN已配置（可选）
- [ ] DNS传播已验证
- [ ] HTTPS访问测试通过
- [ ] 监控脚本已部署