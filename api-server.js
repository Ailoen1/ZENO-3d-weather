// 独立的API服务器 - 用于生产环境
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// 简单的内存缓存
const cache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10分钟

// 速率限制
const rateLimit = new Map();
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1小时
const MAX_REQUESTS_PER_HOUR = 15;

// CORS配置
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'https://your-domain.com'],
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

// 获取客户端IP
function getClientIP(req) {
  return req.headers['x-forwarded-for'] || 
         req.headers['x-real-ip'] || 
         req.connection?.remoteAddress || 
         req.socket?.remoteAddress ||
         '127.0.0.1';
}

// 速率限制检查
function isRateLimited(ip) {
  const now = Date.now();
  const userRequests = rateLimit.get(ip) || [];
  
  // 清理过期请求
  const validRequests = userRequests.filter(timestamp => now - timestamp < RATE_LIMIT_WINDOW);
  
  if (validRequests.length >= MAX_REQUESTS_PER_HOUR) {
    return true;
  }
  
  validRequests.push(now);
  rateLimit.set(ip, validRequests);
  return false;
}

// 健康检查
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// 天气API路由
app.get('/api/weather', async (req, res) => {
  try {
    const { location } = req.query;
    
    if (!location) {
      return res.status(400).json({ error: 'Location parameter is required' });
    }
    
    const clientIP = getClientIP(req);
    
    // 速率限制检查
    if (isRateLimited(clientIP)) {
      console.log(`Rate limit exceeded for IP: ${clientIP}`);
      
      // 返回演示数据
      const demoData = generateDemoWeatherData(location);
      return res.json({
        ...demoData,
        rateLimited: true,
        cached: false
      });
    }
    
    // 检查缓存
    const cacheKey = `weather:${location.toLowerCase()}`;
    const cachedData = cache.get(cacheKey);
    
    if (cachedData && Date.now() - cachedData.timestamp < CACHE_DURATION) {
      return res.json({
        ...cachedData.data,
        cached: true,
        cacheAge: Math.round((Date.now() - cachedData.timestamp) / 1000)
      });
    }
    
    // 获取API密钥
    const API_KEY = process.env.REACT_APP_WEATHER_API_KEY || process.env.WEATHER_API_KEY;
    
    if (!API_KEY) {
      console.error('Weather API key not found');
      return res.status(500).json({ error: 'Server configuration error' });
    }
    
    // 调用天气API
    const response = await fetch(
      `https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${encodeURIComponent(location)}&days=3&aqi=no&alerts=no`
    );
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // 如果API密钥无效，返回演示数据
      if (errorData.error?.code === 1002 || errorData.error?.code === 2006) {
        console.log('API key invalid, returning demo data');
        const demoData = generateDemoWeatherData(location);
        return res.json({
          ...demoData,
          demo: true,
          cached: false
        });
      }
      
      return res.status(response.status).json({ 
        error: errorData.error?.message || 'Weather API error',
        code: errorData.error?.code
      });
    }
    
    const weatherData = await response.json();
    
    // 缓存数据
    cache.set(cacheKey, {
      data: weatherData,
      timestamp: Date.now()
    });
    
    // 清理旧缓存
    if (cache.size > 100) {
      const oldestKey = cache.keys().next().value;
      cache.delete(oldestKey);
    }
    
    res.json({
      ...weatherData,
      cached: false
    });
    
  } catch (error) {
    console.error('Weather API error:', error);
    res.status(500).json({ error: 'Failed to fetch weather data' });
  }
});

// 生成演示数据
function generateDemoWeatherData(location) {
  const now = new Date();
  const isDay = now.getHours() >= 6 && now.getHours() <= 18;
  
  return {
    location: {
      name: location || "Demo City",
      region: "Demo Region",
      country: "Demo Country",
      lat: 40.7128,
      lon: -74.0060,
      tz_id: "America/New_York",
      localtime_epoch: Math.floor(now.getTime() / 1000),
      localtime: now.toISOString().slice(0, -5)
    },
    current: {
      last_updated_epoch: Math.floor(now.getTime() / 1000),
      last_updated: now.toISOString().slice(0, -5),
      temp_c: 22,
      temp_f: 72,
      is_day: isDay ? 1 : 0,
      condition: {
        text: "Partly cloudy",
        icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
        code: 1003
      },
      wind_mph: 8.5,
      wind_kph: 13.7,
      wind_degree: 230,
      wind_dir: "SW",
      pressure_mb: 1013.0,
      pressure_in: 29.91,
      precip_mm: 0.0,
      precip_in: 0.0,
      humidity: 65,
      cloud: 40,
      feelslike_c: 24,
      feelslike_f: 75,
      vis_km: 16.0,
      vis_miles: 10.0,
      uv: 5.0,
      gust_mph: 12.1,
      gust_kph: 19.4
    },
    forecast: {
      forecastday: [
        {
          date: now.toISOString().split('T')[0],
          date_epoch: Math.floor(now.getTime() / 1000),
          day: {
            maxtemp_c: 26,
            maxtemp_f: 79,
            mintemp_c: 18,
            mintemp_f: 64,
            avgtemp_c: 22,
            avgtemp_f: 72,
            maxwind_mph: 12.1,
            maxwind_kph: 19.4,
            totalprecip_mm: 0.0,
            totalprecip_in: 0.0,
            totalsnow_cm: 0.0,
            avgvis_km: 16.0,
            avgvis_miles: 10.0,
            avghumidity: 65,
            daily_will_it_rain: 0,
            daily_chance_of_rain: 10,
            daily_will_it_snow: 0,
            daily_chance_of_snow: 0,
            condition: {
              text: "Partly cloudy",
              icon: "//cdn.weatherapi.com/weather/64x64/day/116.png",
              code: 1003
            },
            uv: 5.0
          }
        }
      ]
    }
  };
}

// 404处理
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 Weather API server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔒 CORS origins: ${process.env.ALLOWED_ORIGINS || 'default'}`);
});

module.exports = app;