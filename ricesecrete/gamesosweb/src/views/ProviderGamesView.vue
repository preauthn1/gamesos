<template>
  <div class="provider-games-view">
    <!-- 顶部导航栏 -->
    <div class="top-header">
      <button class="btn-back" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="header-title">{{ currentTabName || providerName }}</div>
      <div class="header-spacer"></div>
    </div>

    <!-- 内容区域 -->
    <div class="content-wrapper">
      <!-- 左侧游戏分类标签 -->
      <div class="side-tabs">
        <div
          v-for="tab in gameTabs"
          :key="tab.id"
          :class="['side-tab-item', { active: activeTab === tab.id }]"
          @click="switchTab(tab.id)"
        >
          <div class="side-tab-icon-wrapper">
            <!-- 双图层叠加，通过透明度切换 -->
            <img
              :src="tab.icon"
              :alt="tab.name"
              class="side-tab-icon side-tab-icon-normal"
              :class="{ 'icon-hidden': activeTab === tab.id }"
            >
            <img
              v-if="tab.iconActive"
              :src="tab.iconActive"
              :alt="tab.name"
              class="side-tab-icon side-tab-icon-active"
              :class="{ 'icon-visible': activeTab === tab.id }"
            >
          </div>
          <span class="side-tab-name">{{ tab.name }}</span>
        </div>
      </div>

      <!-- 右侧游戏列表 -->
      <div class="games-grid">
        <div
          v-for="game in currentGames"
          :key="game.id"
          class="game-card"
          @click="playGame(game)"
        >
          <div class="game-image-wrapper">
            <img :src="game.icon" :alt="game.name" class="game-image">
            <div class="game-overlay">
              <button class="btn-play">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <circle cx="16" cy="16" r="16" fill="rgba(0,0,0,0.6)"/>
                  <path d="M12 10L22 16L12 22V10Z" fill="white"/>
                </svg>
              </button>
            </div>
          </div>
          <div class="game-name">{{ game.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getGameTypes, getGameList, getGameUrl } from '@/api/index.js'

const route = useRoute()
const router = useRouter()

// 提供商名称
const providerName = ref(route.params.provider || '')

// 当前提供商ID (从路由参数获取)
const platformId = ref(route.params.providerId || '')

// 游戏分类标签
const gameTabs = ref([])
const activeTab = ref('')

// 游戏列表数据
const gamesList = ref([])

// 加载状态
const loading = ref(false)

// ==================== 图片预加载 ====================
const preloadImages = (urls) => {
  urls.forEach(url => {
    if (url && url.startsWith('http')) {
      const img = new Image()
      img.src = url
    }
  })
}

// 当前分类的游戏
const currentGames = computed(() => {
  if (!activeTab.value) return []

  // 找到当前分类的ID
  const currentTabData = gameTabs.value.find(tab => tab.id === activeTab.value)
  if (!currentTabData) return []

  // 根据type_id筛选游戏
  return gamesList.value.filter(game => game.type_id === currentTabData.typeId)
})

// 当前分类名称
const currentTabName = computed(() => {
  if (!activeTab.value) return ''
  const currentTabData = gameTabs.value.find(tab => tab.id === activeTab.value)
  return currentTabData?.name || ''
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 切换分类
const switchTab = async (tabId) => {
  activeTab.value = tabId
  // 可以在这里重新加载该分类的游戏数据
  await loadGameList(gameTabs.value.find(tab => tab.id === tabId)?.typeId)
}

// 播放游戏
const playGame = async (game) => {
  if (!game || !game.id) {
    console.error('游戏信息无效')
    return
  }

  try {
    // 判断设备类型：2=H5（移动端），1=PC端
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    const deviceType = isMobile ? '2' : '1'

    // 调用接口获取游戏链接
    const response = await getGameUrl({
      id: String(game.id),
      type: deviceType
    })

    if (response?.play_url) {
      // 跳转到游戏页面，传递游戏 URL
      router.push({
        name: 'game',
        query: {
          id: game.id,
          name: game.name,
          type: deviceType,
          platform_type:game.platform_type,
          url: encodeURIComponent(response.play_url)
        }
      })
    } else {
      console.error('获取游戏链接失败')
      alert('获取游戏链接失败')
    }
  } catch (error) {
    console.error('获取游戏链接出错:', error)
    alert(error.message || '获取游戏链接失败，请稍后重试')
  }
}

// 加载游戏分类数据
const loadGameTypes = async () => {
  try {
    const response = await getGameTypes()

    if (response?.list && Array.isArray(response.list)) {
      gameTabs.value = response.list
        .sort((a, b) => b.sort - a.sort) // 按sort降序排列
        .map(item => ({
          id: `type-${item.id}`,
          typeId: item.id,
          name: item.name,
          icon: item.icon,
          iconActive: item.icon_active
        }))

      // 设置默认激活的标签
      if (gameTabs.value.length > 0) {
        activeTab.value = gameTabs.value[0].id
        // 加载第一个分类的游戏数据
        await loadGameList(gameTabs.value[0].typeId)
      }
    }
  } catch (error) {
    console.error('加载游戏分类失败:', error)
  }
}

// 加载游戏列表数据
const loadGameList = async (typeId = null) => {
  try {
    loading.value = true

    const params = {}

    // 如果有提供商ID,添加到参数中
    if (platformId.value) {
      params.platform_id = platformId.value
    }

    // 如果指定了分类ID
    if (typeId) {
      params.type_id = typeId
    }

    const response = await getGameList(params)

    if (response?.list && Array.isArray(response.list)) {
      // 如果是加载特定分类,追加到现有列表
      if (typeId) {
        // 移除该分类的旧数据
        gamesList.value = gamesList.value.filter(game => game.type_id !== typeId)
        // 添加新数据
        gamesList.value.push(...response.list)
      } else {
        // 加载全部数据
        gamesList.value = response.list
      }
    }
  } catch (error) {
    console.error('加载游戏列表失败:', error)
  } finally {
    loading.value = false
  }
}

// 初始化数据
onMounted(async () => {
  // 加载游戏分类
  await loadGameTypes()
})
</script>

<style scoped>
.provider-games-view {
  min-height: 100vh;
  background: var(--bg-primary);
  overflow: hidden; /* 防止整体页面滚动 */
}

/* 顶部导航栏 */
.top-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--bg-card);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-xs);
  z-index: 200;
  border-bottom: 1px solid var(--border-light);
}

.btn-back {
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

.btn-back:active {
  background: var(--bg-hover);
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.header-spacer {
  width: 40px;
}

/* 内容区域 */
.content-wrapper {
  margin-top: 60px;
  display: flex;
  height: calc(100vh - 60px);
  overflow: hidden; /* 防止整体滚动 */
}

/* 左侧游戏分类标签 */
.side-tabs {
  width: 80px;
  background: var(--bg-card);
  border-right: 1px solid var(--border-light);
  overflow-y: auto; /* 左侧独立滚动 */
  flex-shrink: 0;
}

.side-tab-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xs) var(--spacing-xs);
  cursor: pointer;
  transition: background 0.2s;
  border-left: 3px solid transparent;
  position: relative;
}

.side-tab-item:active {
  background: var(--bg-hover);
}

.side-tab-icon {
  width: 36px;
  max-height: 60px;
  object-fit: contain;
  margin-bottom: var(--spacing-xs);
}

.side-tab-name {
  font-size: 12px;
  color: var(--text-secondary);
  text-align: center;
  word-break: break-all;
  line-height: 1.3;
}

.side-tab-item.active .side-tab-name {
  color: var(--color-primary);
  font-weight: 600;
}
.side-tab-icon-wrapper {
  position: relative;
}
.side-tab-icon-active {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
}

/* 双图层叠加方案 */
.side-tab-icon-normal,
.side-tab-icon-active {
  width: auto;
  max-height: 60px;
  object-fit: contain;
  transition: opacity 0.2s ease-in-out;
}

.side-tab-icon-normal.icon-hidden {
  opacity: 0;
}

.side-tab-icon-active.icon-visible {
  opacity: 1;
}

/* 右侧游戏列表 */
.games-grid {
  flex: 1;
  padding: var(--spacing-xs);
  overflow-y: auto; /* 右侧独立滚动 */
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--spacing-xs);
  align-content: start;
}

.game-card {
  cursor: pointer;
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--bg-card);
  transition: transform 0.2s, box-shadow 0.2s;
}

.game-card:active {
  transform: scale(0.98);
}

.game-image-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 133.33%; /* 3:4 比例 */
  overflow: hidden;
}

.game-image {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}

.game-card:active .game-overlay {
  opacity: 1;
}

.btn-play {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.game-name {
  padding: var(--spacing-xs);
  font-size: 13px;
  color: var(--text-primary);
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* 滚动条样式 */
.side-tabs::-webkit-scrollbar,
.games-grid::-webkit-scrollbar {
  width: 4px;
}

.side-tabs::-webkit-scrollbar-track,
.games-grid::-webkit-scrollbar-track {
  background: transparent;
}

.side-tabs::-webkit-scrollbar-thumb,
.games-grid::-webkit-scrollbar-thumb {
  background: var(--border-light);
  border-radius: 2px;
}

/* 响应式调整 */
@media (min-width: 768px) {
  .side-tabs {
    width: 100px;
  }

  .games-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (min-width: 1024px) {
  .games-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
</style>
