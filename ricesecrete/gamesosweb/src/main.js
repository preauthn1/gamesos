import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { initWebSocket } from './services/websocket-service.js'
import { useUserStore } from '@/stores/user.js'
import './styles/theme.css' // 导入主题颜色

const app = createApp(App)

app.use(createPinia())
app.use(router)

// 暴露 router 实例供 websocket 获取当前路由
window.__APP_ROUTER__ = router

// 初始化用户信息：从 localStorage 恢复登录状态
const userStore = useUserStore()
userStore.initUserInfo()

app.mount('#app')

// 应用启动后初始化 WebSocket
initWebSocket().catch(error => {
  console.error('WebSocket 初始化失败:', error)
})
