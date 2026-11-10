#!/bin/bash

# GameOS 消息管理模块启动脚本
# 作者: 码龙
# 日期: 2026-03-07

set -e

echo "🎯 GameOS 消息管理模块启动脚本"
echo "================================"
echo ""

# 检查当前目录
if [ ! -f "package.json" ]; then
    echo "❌ 错误: 请在 /www/wwwroot/gameos/admin 目录下运行此脚本"
    exit 1
fi

# 显示项目信息
echo "📦 项目信息:"
echo "  - 项目名称: $(grep '"name"' package.json | cut -d'"' -f4)"
echo "  - 版本: $(grep '"version"' package.json | cut -d'"' -f4)"
echo "  - 目录: $(pwd)"
echo ""

# 检查消息管理模块文件
echo "🔍 检查消息管理模块文件:"

check_file() {
    if [ -f "$1" ]; then
        echo "  ✅ $1"
        return 0
    else
        echo "  ❌ $1 (缺失)"
        return 1
    fi
}

check_dir() {
    if [ -d "$1" ]; then
        echo "  ✅ $1/"
        return 0
    else
        echo "  ❌ $1/ (缺失)"
        return 1
    fi
}

# 检查关键文件
check_file "src/api/message/types.ts"
check_file "src/api/message/session.api.ts"
check_file "src/api/message/message.api.ts"
check_file "src/views/message_session/index.vue"
check_file "src/views/message_list/index.vue"
check_file "src/components/Message/MessageInput.vue"
check_file "src/router/index.ts"
check_file "MESSAGE_MODULE_README.md"

echo ""

# 检查路由配置
echo "🌐 检查路由配置:"
if grep -q "message/session" src/router/index.ts; then
    echo "  ✅ 会话管理路由已配置"
else
    echo "  ❌ 会话管理路由未配置"
fi

if grep -q "message/list" src/router/index.ts; then
    echo "  ✅ 消息管理路由已配置"
else
    echo "  ❌ 消息管理路由未配置"
fi

echo ""

# 检查依赖
echo "📦 检查项目依赖:"
if [ -d "node_modules" ]; then
    echo "  ✅ node_modules 目录存在"
    
    # 检查关键依赖
    if [ -f "node_modules/vue/package.json" ]; then
        echo "  ✅ Vue 已安装"
    else
        echo "  ⚠️  Vue 未安装，需要运行 npm install"
    fi
    
    if [ -f "node_modules/element-plus/package.json" ]; then
        echo "  ✅ Element Plus 已安装"
    else
        echo "  ⚠️  Element Plus 未安装"
    fi
else
    echo "  ⚠️  node_modules 目录不存在，需要运行 npm install"
fi

echo ""

# 显示访问信息
echo "🚀 访问信息:"
echo "  1. 启动开发服务器: npm run dev"
echo "  2. 访问地址: http://localhost:8080"
echo "  3. 会话管理: http://localhost:8080/#/message/session"
echo "  4. 消息管理: 通过会话管理页面跳转"
echo ""

# 显示演示页面
echo "📱 演示页面:"
echo "  文件: demo-message-module.html"
echo "  描述: 模块功能展示和文档"
echo ""

# 显示下一步操作
echo "📋 下一步操作:"
echo "  1. 安装依赖: npm install"
echo "  2. 启动开发: npm run dev"
echo "  3. 类型检查: npm run type-check"
echo "  4. 构建项目: npm run build"
echo ""

# 显示模块功能
echo "🎯 消息管理模块功能:"
echo "  • 会话管理: 列表、搜索、筛选、删除"
echo "  • 消息管理: 发送、接收、删除、导出"
echo "  • 实时交互: 消息气泡、滚动加载"
echo "  • 响应式设计: 桌面和移动端适配"
echo ""

# 显示技术栈
echo "🔧 技术栈:"
echo "  • Vue 3 + Composition API"
echo "  • TypeScript 类型安全"
echo "  • Element Plus UI 组件库"
echo "  • RESTful API + WebSocket"
echo ""

echo "✅ 脚本执行完成!"
echo ""
echo "💡 提示: 查看 MESSAGE_MODULE_README.md 获取完整文档"
echo "📞 支持: 如有问题请联系开发团队"