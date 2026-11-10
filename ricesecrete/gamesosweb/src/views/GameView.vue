<template>
  <div class="game-view">
    <!-- 顶部导航栏 -->
    <div class="game-header">
      <button class="btn-back" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round"
            stroke-linejoin="round" />
        </svg>
      </button>
      <div class="header-title">{{ gameName || '游戏' }}</div>
      <button class="btn-fullscreen" @click="toggleFullscreen">
        <svg v-if="!isFullscreen" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <svg v-else width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>
    </div>

    <!-- 加载状态 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">游戏加载中...</div>
    </div>

    <!-- 错误状态 -->
    <div v-else-if="error" class="error-container">
      <div class="error-icon">!</div>
      <div class="error-text">{{ error }}</div>
      <button class="btn-retry" @click="loadGame">重新加载</button>
    </div>

    <!-- 游戏 iframe -->
    <iframe v-show="!loading && !error && gameUrl" ref="gameFrame" :src="gameUrl" class="game-frame" allowfullscreen
      @load="onFrameLoad" @error="onFrameError"></iframe>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGameUrl, gameBalance } from '@/api/index.js'

const route = useRoute()
const router = useRouter()

// 状态
const loading = ref(true)
const error = ref('')
const gameUrl = ref('')
const gameName = ref('')
const isFullscreen = ref(false)
const gameFrame = ref(null)
const balance = ref('')
let balanceTimer = null

// 返回上一页
const goBack = async () => {
  // 调用接口获取游戏链接
  router.back()
  
}

// 切换全屏
const toggleFullscreen = async () => {
  try {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen()
      isFullscreen.value = true
    } else {
      await document.exitFullscreen()
      isFullscreen.value = false
    }
  } catch (err) {
    console.error('全屏切换失败:', err)
  }
}

// 监听全屏变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// iframe 加载完成
const onFrameLoad = () => {
  loading.value = false
}

// iframe 加载错误
const onFrameError = () => {
  loading.value = false
  error.value = '游戏加载失败'
}

// 获取钱包余额
const fetchBalance = async () => {
  try {
    const res = await gameBalance({
      type: route.query.type || '2',
      id: String(route.query.id)
    })
    if (res?.balance !== undefined) {
      balance.value = res.balance
    }
  } catch (err) {
    console.error('获取余额失败:', err)
  }
}

// 启动余额轮询
const startBalancePolling = () => {
  balanceTimer = setInterval(fetchBalance, 10000)
}

// 停止余额轮询
const stopBalancePolling = () => {
  if (balanceTimer) {
    clearInterval(balanceTimer)
    balanceTimer = null
  }
}

// 加载游戏
const loadGame = async () => {
  const gameId = route.query.id
  const type = route.query.type || '2'
  gameName.value = route.query.name || '游戏'

  // 如果已经有 URL，直接使用
  if (route.query.url) {
    gameUrl.value = decodeURIComponent(route.query.url)
    console.log('使用传入的游戏链接:', gameUrl.value)
    return
  }

  // 否则调用接口获取
  if (!gameId) {
    error.value = '游戏ID无效'
    loading.value = false
    return
  }

  try {
    loading.value = true
    error.value = ''

    const response = await getGameUrl({
      id: String(gameId),
      type: type
    })

    if (response?.url) {
      gameUrl.value = response.url
    } else {
      error.value = '获取游戏链接失败'
    }
  } catch (err) {
    console.error('加载游戏失败:', err)
    error.value = err.message || '加载游戏失败'
  }
}

onMounted(() => {

  document.addEventListener('fullscreenchange', handleFullscreenChange)
  loadGame()
  console.log('进入游戏页面')
  const platform_type = route.query.platform_type || ''
  if (platform_type == 2) {
    const gameId = route.query.id
    const type = route.query.type || '2'
    localStorage.setItem('inGame', JSON.stringify({id: gameId, type: type}))
    startBalancePolling()
    return
  }
  
})

onActivated(() => {

  document.addEventListener('fullscreenchange', handleFullscreenChange)
  loadGame()
  console.log('进入游戏页面')
  const platform_type = route.query.platform_type || ''
  if (platform_type == 2) {
    const gameId = route.query.id
    const type = route.query.type || '2'
    localStorage.setItem('inGame', JSON.stringify({id: gameId, type: type}))
    startBalancePolling()
    return
  }
  
})

onUnmounted(() => {
  stopBalancePolling()
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})
</script>

<style scoped>
.game-view {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  display: flex;
  flex-direction: column;
  z-index: 1000;
}

.game-header {
  height: 50px;
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-sm);
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-light);
}

.btn-back,
.btn-fullscreen {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  border: none;
  color: var(--text-primary);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: background 0.2s;
}

.btn-back:active,
.btn-fullscreen:active {
  background: var(--bg-hover);
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  padding: 0 var(--spacing-sm);
}

.game-frame {
  flex: 1;
  width: 100%;
  border: none;
  background: #000;
}

.loading-container,
.error-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-md);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid var(--border-light);
  border-top-color: var(--color-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.error-icon {
  width: 64px;
  height: 64px;
  background: var(--color-error);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: bold;
  color: white;
}

.error-text {
  font-size: 16px;
  color: var(--text-secondary);
}

.btn-retry {
  padding: var(--spacing-sm) var(--spacing-xl);
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: var(--radius-lg);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
}

.btn-retry:active {
  opacity: 0.9;
}

/* 全屏时隐藏 header */
:fullscreen .game-header {
  display: none;
}

:fullscreen .game-frame {
  height: 100vh;
}
</style>
