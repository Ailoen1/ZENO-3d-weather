@echo off
echo 🚀 GitHub推送助手
echo ===================
echo.
echo 📋 当前状态：代码已提交，准备推送到GitHub
echo 🎯 目标仓库：https://github.com/Ailoen1/ZENO-3d-weather
echo.
echo 🔑 请选择推送方式：
echo.
echo 1. 使用GitHub Token（推荐）
echo 2. 手动输入用户名和密码
echo 3. 显示推送命令，您自己操作
echo.
set /p choice=请选择（1/2/3）：

if "%choice%"=="1" goto token_method
if "%choice%"=="2" goto manual_method
if "%choice%"=="3" goto show_command
goto end

:token_method
echo.
echo 📖 请按以下步骤获取GitHub Token：
echo 1. 访问 https://github.com/settings/tokens
echo 2. 点击 "Generate new token (classic)"
echo 3. 勾选 "repo" 权限
echo 4. 生成并复制token
echo.
set /p token=请输入您的GitHub Token：
if "%token%"=="" goto end
echo.
echo 🔄 正在推送代码...
git push https://%token%@github.com/Ailoen1/ZENO-3d-weather.git master
echo ✅ 推送完成！
goto end

:manual_method
echo.
echo 🔄 使用传统认证方式...
git push -u origin master
echo ✅ 如果浏览器弹出认证窗口，请输入您的GitHub用户名和密码
goto end

:show_command
echo.
echo 📋 请复制并运行以下命令：
echo.
echo git push -u origin master
echo.
echo 或者使用token方式：
echo git push https://[您的token]@github.com/Ailoen1/ZENO-3d-weather.git master
goto end

:end
echo.
echo 🎉 操作完成！
echo 如果遇到问题，请告诉我具体的错误信息。
pause