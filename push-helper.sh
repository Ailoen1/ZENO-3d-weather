# GitHub推送助手
# 这个脚本会帮您将代码推送到GitHub仓库

echo "🚀 准备推送代码到GitHub..."
echo "📋 请确保您已经："
echo "   1. 登录了GitHub"
echo "   2. 有权限访问 https://github.com/Ailoen1/ZENO-3d-weather"
echo ""
echo "🔑 推送方法选项："
echo "   方法1：使用GitHub Token（推荐）"
echo "   方法2：使用用户名密码（已废弃）"
echo "   方法3：手动推送（我会给您命令）"
echo ""

# 检查是否已经配置了token
if [ -n "$GITHUB_TOKEN" ]; then
    echo "✅ 检测到GitHub Token，使用token推送..."
    git push https://$GITHUB_TOKEN@github.com/Ailoen1/ZENO-3d-weather.git master
else
    echo "❌ 未检测到GitHub Token"
    echo ""
    echo "📖 请按以下步骤操作："
    echo ""
    echo "1. 创建GitHub Token："
    echo "   - 访问 https://github.com/settings/tokens"
    echo "   - 点击 'Generate new token'"
    echo "   - 选择 'repo' 权限"
    echo "   - 复制生成的token"
    echo ""
    echo "2. 使用以下命令推送："
    echo "   git push https://[您的token]@github.com/Ailoen1/ZENO-3d-weather.git master"
    echo ""
    echo "或者直接运行："
    echo "   GITHUB_TOKEN=您的token bash push-helper.sh"
fi