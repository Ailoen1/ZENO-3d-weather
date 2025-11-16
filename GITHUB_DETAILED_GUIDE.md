# 🔧 GitHub部署详细指南

## 🚨 重要：不要在SSH Keys设置API密钥！

### ❌ 错误做法（您刚才遇到的）
- 不要进入：`Settings` → `SSH and GPG keys`
- 不要添加API密钥到SSH密钥设置
- SSH密钥是用于git操作的，不是API密钥

### ✅ 正确做法

## 步骤1：创建GitHub仓库

1. 登录GitHub
2. 点击右上角的 `+` → `New repository`
3. 输入仓库名，比如：`3d-weather-app`
4. 选择 `Public`（免费）
5. 不要初始化README（我们会推送现有代码）
6. 点击 `Create repository`

## 步骤2：推送代码到GitHub

在您的项目目录执行：
```bash
git remote add origin https://github.com/您的用户名/3d-weather-app.git
git add .
git commit -m "Initial commit"
git push -u origin main
```

## 步骤3：设置GitHub Secrets（关键步骤）

### 🔑 正确的Secrets设置路径：

1. **进入您的仓库页面**
2. **点击 `Settings` 标签页**
3. **在左侧菜单找到 `Secrets and variables`**
4. **点击 `Actions`**
5. **点击绿色的 `New repository secret` 按钮**

### 📝 填写Secrets：

**Secret 1:**
- **Name:** `WEATHER_API_KEY`
- **Secret:** `14b98029813d49acbc1101959251611`
- 点击 `Add secret`

**Secret 2:**
- **Name:** `REACT_APP_WEATHER_API_KEY`
- **Secret:** `14b98029813d49acbc1101959251611`
- 点击 `Add secret`

## 步骤4：启用GitHub Pages

1. 在仓库设置中，找到 `Pages`（在左侧菜单）
2. **Source** 选择 `GitHub Actions`
3. 不需要其他设置，Actions会自动配置

## 步骤5：验证自动部署

1. 推送任何代码更改到main分支
2. 点击 `Actions` 标签页查看部署状态
3. 等待绿色✅出现

## 🌐 访问您的应用

部署完成后，访问：
```
https://您的用户名.github.io/3d-weather-app
```

## 📋 常见问题解决

### Q: 为什么我看到"Key is invalid"错误？
**A:** 您进入了错误的设置界面。请确保是在 `Settings` → `Secrets and variables` → `Actions`，不是SSH密钥设置。

### Q: Allow write access需要勾选吗？
**A:** 不需要。这是用于SSH密钥的选项，与API密钥无关。

### Q: 部署失败怎么办？
**A:** 检查Actions日志，通常是API密钥格式问题或代码构建错误。

### Q: 需要设置其他Secrets吗？
**A:** 只需要这两个API密钥Secrets，其他都是可选的。

## 🎯 成功标志

✅ 在Actions页面看到绿色勾号
✅ 访问GitHub Pages URL能看到3D天气应用
✅ 天气数据能正常加载
✅ 3D地球能正常显示

## 📞 需要帮助？

如果还有问题，请告诉我：
1. 您在哪个步骤遇到问题？
2. 具体的错误信息是什么？
3. 您当前在哪个界面？