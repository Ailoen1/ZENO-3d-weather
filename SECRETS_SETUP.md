# GitHub Secrets配置指南

## 🎯 目标
为自动部署配置API密钥

## 🔑 需要配置的Secrets
1. **WEATHER_API_KEY** = `14b98029813d49acbc1101959251611`
2. **REACT_APP_WEATHER_API_KEY** = `14b98029813d49acbc1101959251611`

## 📋 配置步骤

### 步骤1：访问Secrets设置页面
直接访问：https://github.com/Ailoen1/ZENO-3d-weather/settings/secrets/actions

### 步骤2：添加第一个Secret
1. 点击绿色的 **"New repository secret"** 按钮
2. **Name:** 输入 `WEATHER_API_KEY`
3. **Secret:** 输入 `14b98029813d49acbc1101959251611`
4. 点击 **"Add secret"**

### 步骤3：添加第二个Secret
1. 再次点击 **"New repository secret"**
2. **Name:** 输入 `REACT_APP_WEATHER_API_KEY`
3. **Secret:** 输入 `14b98029813d49acbc1101959251611`
4. 点击 **"Add secret"**

## ✅ 验证配置

添加完成后，您应该看到：
- ✅ WEATHER_API_KEY
- ✅ REACT_APP_WEATHER_API_KEY

## 🚀 自动部署

配置完成后，GitHub Actions会自动开始部署。

**查看部署状态：**
访问：https://github.com/Ailoen1/ZENO-3d-weather/actions

**部署完成后访问：**
https://ailoen1.github.io/ZENO-3d-weather

## 📱 移动端测试

部署完成后，您可以用手机访问：
- https://ailoen1.github.io/ZENO-3d-weather

## 🆘 遇到问题？

如果Secrets添加失败：
1. 确保您有仓库的管理权限
2. 检查API密钥是否正确：14b98029813d49acbc1101959251611
3. 告诉我具体的错误信息

配置完成后告诉我，我来帮您验证部署！🎉