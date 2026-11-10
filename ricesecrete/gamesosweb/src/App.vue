<script setup>
import { computed, onMounted, watch } from 'vue'
import { RouterView, useRoute } from 'vue-router'
import TabBar from '@/components/TabBar.vue'
import LoginModal from '@/components/LoginModal.vue'
import RegisterModal from '@/components/RegisterModal.vue'
import ToastContainer from '@/components/ToastContainer.vue'
import { useThemeStore } from '@/stores/theme.js'
import { useUserStore } from '@/stores/user.js'
import { gameOut } from '@/api/index.js'

const route = useRoute()
const themeStore = useThemeStore()
const userStore = useUserStore()

// 需要隐藏 TabBar 的路由
const hideTabBarRoutes = ['provider-games', 'game', 'chatroom']

// 判断是否显示 TabBar
const showTabBar = computed(() => {
  return !hideTabBarRoutes.includes(route.name)
})

// 登录成功处理
const handleLoginSuccess = () => {
  userStore.closeLoginModal()
}

// 注册成功处理
const handleRegisterSuccess = () => {
  userStore.closeRegisterModal()
}

// 初始化主题
onMounted(() => {
  themeStore.initTheme()
})

watch(
  () => route.path,
  (newPath, oldPath) => {

    console.log('路由变化:', oldPath, '->', newPath)
   if (newPath !== '/game' && oldPath !== undefined) {
     const inGame = localStorage.getItem('inGame')
      if (inGame) {
        const { id, type } = JSON.parse(inGame)
        gameOut({ id, type }).catch((error) => {
          console.error('退出游戏失败:', error)
        })
        localStorage.removeItem('inGame')
      }
   }
  },
  { immediate: true } // 如果需要在组件加载时立即执行一次，加上这个
);
</script>

<template>
  <div id="app">
    <main>
      <RouterView />
    </main>
    <TabBar v-if="showTabBar" />

    <!-- 全局 Toast 提示 -->
    <ToastContainer />

    <!-- 全局登录弹窗 -->
    <LoginModal :visible="userStore.showLoginModal" @close="userStore.closeLoginModal" @success="handleLoginSuccess"
      @switch-to-register="userStore.openRegisterModal" />

    <!-- 全局注册弹窗 -->
    <RegisterModal :visible="userStore.showRegisterModal" @close="userStore.closeRegisterModal"
      @success="handleRegisterSuccess" @switch-to-login="userStore.openLoginModal" />
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  background: #0a1a0f;
  color: #ffffff;
}

#app {
  min-height: 100vh;
}

main {
  min-height: 100vh;
}
</style>
