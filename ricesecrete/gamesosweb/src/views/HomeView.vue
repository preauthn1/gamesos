<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import { getAppConfig } from '@/api/index.js'
import { toast } from '@/composables/useToast.js'

// ==================== 布局常量 ====================
const LAYOUT = {
  HEADER_HEIGHT: 90,       // 顶部固定栏高度
  TABS_HEIGHT: 60,         // tabs高度
  PROVIDERS_HEIGHT: 130,   // 游戏提供商列表高度
  SCROLL_TOLERANCE: 5,     // 滚动位置误差容忍
  SCROLL_RESUME_DELAY: 200,    // 滚动完成后恢复延迟
  SCROLL_TIMEOUT: 1000,        // 滚动超时保护
  SCROLL_MAX_DELAY: 1200       // 最大滚动延迟
}
// tabs吸顶时的底部位置
const TABS_BOTTOM = LAYOUT.HEADER_HEIGHT + LAYOUT.TABS_HEIGHT

const userStore = useUserStore()
const router = useRouter()

// 应用配置数据
const appConfig = ref(null)

// ==================== 轮播相关 ====================
// 轮播数据
const banners = ref([])

// 当前轮播索引(从1开始,因为0是克隆的最后一张)
const currentBannerIndex = ref(1)
const isTransitioning = ref(true)

// 手势滑动相关
const touchStartX = ref(0)
const touchEndX = ref(0)
const touchStartTime = ref(0)
const isDragging = ref(false)
const dragOffset = ref(0)

// 自动轮播
let bannerTimer = null
const startBannerAutoPlay = () => {
  bannerTimer = setInterval(() => {
    nextBanner()
  }, 3000)
}

// 停止轮播
const stopBannerAutoPlay = () => {
  if (bannerTimer) {
    clearInterval(bannerTimer)
  }
}

// 下一张
const nextBanner = () => {
  isTransitioning.value = true
  currentBannerIndex.value++

  // 当到达克隆的第一张时,无动画跳回真正的第一张
  if (currentBannerIndex.value === banners.value.length + 1) {
    setTimeout(() => {
      isTransitioning.value = false
      currentBannerIndex.value = 1
    }, 500)
  }
}

// 上一张
const prevBanner = () => {
  isTransitioning.value = true
  currentBannerIndex.value--

  // 当到达克隆的最后一张时,无动画跳回真正的最后一张
  if (currentBannerIndex.value === 0) {
    setTimeout(() => {
      isTransitioning.value = false
      currentBannerIndex.value = banners.value.length
    }, 500)
  }
}

// 切换轮播
const goToBanner = (index) => {
  stopBannerAutoPlay()
  isTransitioning.value = true
  currentBannerIndex.value = index + 1 // 因为有克隆,索引+1
  startBannerAutoPlay()
}

// 获取实际显示的索引(用于指示器)
const getActualIndex = () => {
  if (currentBannerIndex.value === 0) return banners.value.length - 1
  if (currentBannerIndex.value === banners.value.length + 1) return 0
  return currentBannerIndex.value - 1
}

// 计算实际索引
const actualIndex = computed(() => getActualIndex())

// ==================== 触摸手势处理 ====================
// 触摸开始
const handleTouchStart = (e) => {
  touchStartX.value = e.touches[0].clientX
  touchStartTime.value = Date.now()
  isDragging.value = true
  dragOffset.value = 0
  stopBannerAutoPlay()
}

// 触摸移动
const handleTouchMove = (e) => {
  if (!isDragging.value) return

  touchEndX.value = e.touches[0].clientX
  dragOffset.value = touchEndX.value - touchStartX.value

  // 如果拖拽距离超过10px，阻止默认滚动行为
  if (Math.abs(dragOffset.value) > 10) {
    e.preventDefault()
  }
}

// 触摸结束
const handleTouchEnd = () => {
  if (!isDragging.value) return

  const touchDuration = Date.now() - touchStartTime.value
  const swipeDistance = dragOffset.value

  // 判断是否为有效滑动：移动距离超过50px 或 快速滑动(小于300ms且移动超过30px)
  const isValidSwipe = Math.abs(swipeDistance) > 50 ||
                       (touchDuration < 300 && Math.abs(swipeDistance) > 30)

  if (isValidSwipe) {
    if (swipeDistance > 0) {
      // 向右滑动，显示上一张
      prevBanner()
    } else {
      // 向左滑动，显示下一张
      nextBanner()
    }
  }

  // 重置状态
  isDragging.value = false
  dragOffset.value = 0
  startBannerAutoPlay()
}


// 通知消息
const notifications = ref([
  { id: 1, text: '恭喜用户 ***6789 在老虎机游戏中赢得 50,000+ 大奖！' },
  { id: 2, text: '系统维护通知：今晚23:00-01:00进行系统升级，请提前安排游戏时间' },
  { id: 3, text: '恭喜用户 ***1234 在真人百家乐中连赢5局！' },
  { id: 4, text: '新游戏上线：JILI捕鱼火爆来袭，首充赠送双倍奖励！' }
])

// ==================== 游戏分类标签相关 ====================
const activeTab = ref('')
const gameTabs = ref([])
const tabRefs = ref([])

// ==================== 游戏提供商列表 ====================
const gameProviders = ref([])

// ==================== 游戏数据 ====================
const gamesByTab = ref({})

// ==================== Tab 吸顶相关 ====================
const isTabsSticky = ref(false)
const tabsRef = ref(null)
const tabsOriginalTop = ref(0)

// ==================== 滚动状态控制 ====================
let isUserScrolling = true // 标记是否是用户主动滚动
let scrollTimer = null // 滚动计时器
let lastScrollTime = 0 // 上次滚动时间
let programScrollTarget = 0 // 程序触发滚动的目标位置

// ==================== 图片预加载 ====================
const preloadImages = (urls) => {
  urls.forEach(url => {
    if (url && url.startsWith('http')) {
      const img = new Image()
      img.src = url
    }
  })
}

// ==================== Tab 高亮更新逻辑 ====================
const updateActiveTab = () => {
  // 如果是程序触发的滚动(点击tab),不更新高亮
  if (!isUserScrolling) {
    return
  }

  // 实时检测当前应该激活哪个tab
  let currentTabId = null

  // 从后往前遍历所有section,找到第一个顶部在视口上方或刚进入视口的section
  for (let i = gameTabs.value.length - 1; i >= 0; i--) {
    const tab = gameTabs.value[i]
    const element = document.getElementById(`section-${tab.id}`)
    if (element) {
      const rect = element.getBoundingClientRect()

      // 如果section的顶部在tabs下方或已经越过tabs(在上方)
      if (rect.top <= TABS_BOTTOM) {
        currentTabId = tab.id
        break
      }
    }
  }

  // 如果没有找到(说明还在最上面),使用第一个tab
  if (!currentTabId && gameTabs.value.length > 0) {
    currentTabId = gameTabs.value[0].id
  }

  // 更新激活状态(只在真正需要时才更新)
  if (currentTabId && currentTabId !== activeTab.value) {
    activeTab.value = currentTabId
    // 使用 requestAnimationFrame 确保DOM更新后再滚动tab
    requestAnimationFrame(() => {
      scrollTabIntoView(currentTabId)
    })
  }
}

// ==================== 滚动监听 ====================
const handleScroll = () => {
  // 吸顶检测始终执行,不受 isUserScrolling 影响
  if (tabsRef.value) {
    const scrollTop = window.scrollY || window.pageYOffset
    // 当tabs滚动到刚好碰到header底部时开始吸顶
    isTabsSticky.value = scrollTop > tabsOriginalTop.value - LAYOUT.HEADER_HEIGHT
  }

  const currentTime = Date.now()
  const currentScrollTop = window.scrollY || window.pageYOffset

  // 如果是程序触发的滚动
  if (!isUserScrolling) {
    // 检查是否已经接近目标位置
    const scrollDiff = Math.abs(currentScrollTop - programScrollTarget)

    // 如果已经接近目标位置
    if (scrollDiff < LAYOUT.SCROLL_TOLERANCE) {
      // 不立即恢复，而是设置一个延迟，避免回弹
      if (scrollTimer) {
        clearTimeout(scrollTimer)
      }
      scrollTimer = setTimeout(() => {
        isUserScrolling = true
        scrollTimer = null
      }, LAYOUT.SCROLL_RESUME_DELAY)
      return
    }

    // 如果距离上次程序滚动已经超时（超时保护）
    if (currentTime - lastScrollTime > LAYOUT.SCROLL_TIMEOUT) {
      // 恢复用户滚动状态
      isUserScrolling = true
      if (scrollTimer) {
        clearTimeout(scrollTimer)
        scrollTimer = null
      }
    } else {
      // 更新最后滚动时间
      lastScrollTime = currentTime
      return
    }
  }

  // 用户主动滚动时才更新 activeTab
  updateActiveTab()
}

// Hot 游戏滚动控制
const hotScrollContainer = ref(null)

// ==================== 通用滚动辅助函数 ====================
const scrollContainer = (container, direction, pageWidth) => {
  if (!container) return

  const currentScroll = container.scrollLeft
  const targetScroll = direction === 'left'
    ? Math.max(0, currentScroll - pageWidth)
    : currentScroll + pageWidth

  container.scrollTo({
    left: targetScroll,
    behavior: 'smooth'
  })
}

const scrollHotGames = (direction) => {
  // 在 v-for 中,ref 可能是数组,需要获取第一个元素
  const container = Array.isArray(hotScrollContainer.value)
    ? hotScrollContainer.value[0]
    : hotScrollContainer.value

  if (!container) return

  // 计算一页的宽度(一个卡片的宽度 + gap)
  const cardWidth = container.querySelector('.hot-video-container, .hot-game-card')?.offsetWidth || 0
  const gap = 8 // var(--spacing-sm) 的值
  const pageWidth = cardWidth + gap

  scrollContainer(container, direction, pageWidth)
}

// Fishing 页面滚动控制
const scrollFishingPage = (direction) => {
  const container = document.querySelector('.fishing-scroll-container')
  if (!container) return

  scrollContainer(container, direction, container.offsetWidth)
}

// 充值处理
const handleDeposit = () => {
  if (userStore.isLoggedIn) {
    // 已登录，跳转到充值页面或显示充值弹窗
    toast.info('充值功能开发中...')
    // TODO: 实现充值逻辑
  } else {
    // 未登录，显示登录弹窗
    userStore.openLoginModal()
  }
}

// 提现处理
const handleWithdraw = () => {
  if (userStore.isLoggedIn) {
    // 已登录，跳转到提现页面或显示提现弹窗
    toast.info('提现功能开发中...')
    // TODO: 实现提现逻辑
  } else {
    // 未登录，显示登录弹窗
    userStore.openLoginModal()
  }
}

// 加载应用配置数据
const loadAppConfig = async () => {
  try {
    const config = await getAppConfig()
    appConfig.value = config

    // 设置轮播图数据
    if (config.banner_list && config.banner_list.length > 0) {
      banners.value = config.banner_list.map(banner => ({
        id: banner.id,
        img: banner.img,
        title: banner.title,
        url: banner.url
      }))
    }

    // 设置游戏分类标签
    if (config.index_menu && config.index_menu.index_game_tab) {
      const tabs = config.index_menu.index_game_tab
      gameTabs.value = tabs.map(tab => {
        const tabId = tab.name.toLowerCase()
        return {
          id: tabId,
          name: tab.name,
          icon: tab.icon,
          iconActive: tab.icon_active,
          layout: getLayoutByTabName(tab.name),
          list: tab.list || []
        }
      })

      // 设置默认激活的标签
      if (gameTabs.value.length > 0) {
        activeTab.value = gameTabs.value[0].id
      }

      // 预加载所有 tab 图标
      const allTabIcons = tabs.flatMap(tab => [tab.icon, tab.icon_active]).filter(Boolean)
      preloadImages(allTabIcons)

      // 构建游戏数据
      tabs.forEach(tab => {
        const tabId = tab.name.toLowerCase()
        gamesByTab.value[tabId] = (tab.list || []).map((game, index) => ({
          id: index + 1,
          name: game.name,
          icon: game.icon,
          iconActive: game.icon_active,
          type: game.icon_type || 'image',
          url: game.url,
          param: game.param,
          sort: game.sort
        }))
      })
    }

    // 设置游戏提供商列表
    if (config.index_menu && config.index_menu.index_company_menu) {
      const companyMenus = config.index_menu.index_company_menu
      companyMenus.forEach(menu => {
        if (menu.list && menu.list.length > 0) {
          gameProviders.value = menu.list.map(provider => ({
            id: provider.name,
            name: provider.name,
            img: provider.icon,
            imgActive: provider.icon_active
          }))

          // 预加载游戏提供商图标
          const providerIcons = menu.list.flatMap(p => [p.icon, p.icon_active]).filter(Boolean)
          preloadImages(providerIcons)
        }
      })
    }
  } catch (error) {
    console.error('加载配置失败:', error)
  }
}

// 根据标签名称获取布局类型
const getLayoutByTabName = (name) => {
  const layoutMap = {
    'Hot': 'hot-video-grid',
    'Casino': 'dual-video',
    'Slot': 'list',
    'Game': 'video-with-grid',
    'Sport': 'list',
    'Fishing': 'video-with-grid'
  }
  return layoutMap[name] || 'list'
}

// ==================== Tab 切换处理 ====================
const switchTab = (tabId) => {
  // 先更新激活状态
  activeTab.value = tabId

  // 滚动tab到可见区域
  scrollTabIntoView(tabId)

  // 标记为程序触发的滚动，暂停滚动监听
  isUserScrolling = false
  lastScrollTime = Date.now()

  // 清除之前的计时器
  if (scrollTimer) {
    clearTimeout(scrollTimer)
  }

  // 滚动到对应的游戏列表区域
  const element = document.getElementById(`section-${tabId}`)
  if (element) {
    const offsetTop = element.offsetTop - LAYOUT.HEADER_HEIGHT - LAYOUT.TABS_HEIGHT - LAYOUT.PROVIDERS_HEIGHT

    // 记录目标滚动位置
    programScrollTarget = offsetTop

    window.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })

    // 设置超时恢复机制
    scrollTimer = setTimeout(() => {
      isUserScrolling = true
      scrollTimer = null
    }, LAYOUT.SCROLL_MAX_DELAY)
  } else {
    // 如果没有滚动,立即恢复标记
    isUserScrolling = true
  }
}

// ==================== Tab 滚动到可见区域 ====================
const scrollTabIntoView = (tabId) => {
  if (!tabsRef.value) return

  const tabsContainer = tabsRef.value.querySelector('.game-tabs')
  if (!tabsContainer) return

  // 找到对应的tab元素
  const tabIndex = gameTabs.value.findIndex(tab => tab.id === tabId)
  if (tabIndex === -1 || !tabRefs.value[tabIndex]) return

  const tabElement = tabRefs.value[tabIndex]

  // 获取容器和元素的位置信息
  const containerRect = tabsContainer.getBoundingClientRect()
  const tabRect = tabElement.getBoundingClientRect()

  // 计算需要滚动的距离 - 让活动tab尽量居中
  const scrollLeft = tabsContainer.scrollLeft
  const tabLeft = tabRect.left - containerRect.left + scrollLeft
  const tabCenter = tabLeft + tabRect.width / 2
  const containerCenter = containerRect.width / 2

  // 计算目标滚动位置 - 让tab居中显示
  let targetScroll = tabCenter - containerCenter

  // 限制滚动范围
  const maxScroll = tabsContainer.scrollWidth - containerRect.width
  targetScroll = Math.max(0, Math.min(targetScroll, maxScroll))

  tabsContainer.scrollTo({
    left: targetScroll,
    behavior: 'smooth'
  })
}

// 获取当前tab的布局类型
const getCurrentLayout = computed(() => {
  const currentTab = gameTabs.value.find(tab => tab.id === activeTab.value)
  return currentTab?.layout || 'grid'
})

// ==================== 游戏提供商点击处理 ====================
const goToProviderGames = (provider) => {
  router.push({
    name: 'provider-games',
    params: {
      provider: provider.name,
      providerId: provider.id
    }
  })
}

// 将fishing游戏分页
const getFishingPages = (tabId) => {
  const games = gamesByTab.value[tabId] || []
  const pages = []

  if (games.length === 0) return pages

  // 第一页:1个视频(占4格) + 5个游戏
  const firstPageGames = games.slice(1, 6)
  const videoGame = games.find(g => g.type === 'video')
  pages.push({
    hasVideo: true,
    video: videoGame?.icon || 'https://image.91clubss.xyz/remote/channelImg/1250/hallVideos/10029.mp4',
    games: firstPageGames
  })

  // 后续页:每页9个游戏 
  const remainingGames = games.slice(6)
  const gamesPerPage = 9

  for (let i = 0; i < remainingGames.length; i += gamesPerPage) {
    const pageGames = remainingGames.slice(i, i + gamesPerPage)
    pages.push({
      hasVideo: false,
      video: null,
      games: pageGames
    })
  }

  return pages
}

// 在组件挂载时加载配置数据
onMounted(async () => {
  // 启动轮播
  startBannerAutoPlay()

  // 加载配置数据
  await loadAppConfig()

  // 添加滚动监听
  window.addEventListener('scroll', handleScroll, { passive: true })

  // 初始化tabs位置和激活状态
  // 使用 nextTick 确保 DOM 完全渲染
  setTimeout(() => {
    if (tabsRef.value) {
      const rect = tabsRef.value.getBoundingClientRect()
      const scrollTop = window.scrollY || window.pageYOffset
      tabsOriginalTop.value = rect.top + scrollTop
    }
    updateActiveTab()
  }, 100) // 减少延迟从 500ms 到 100ms
})

onUnmounted(() => {
  stopBannerAutoPlay()
  window.removeEventListener('scroll', handleScroll)
})

</script>

<template>
  <div class="home">
    <!-- 顶部栏 -->
    <div class="header">
      <div class="logo">
        <img
          src="data:image/png;base64,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UmVhZHlxyWU8AAADhGlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMxNDUgNzkuMTYzNDk5LCAyMDE4LzA4LzEzLTE2OjQwOjIyICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjhmMjE4NDZmLTNiMTMtMWQ0Zi1hMzA5LWYwYWExMGFhYmRlMiIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDpDOEEzRkNDQjM1MkUxMUYwQjRDQUFGNzE0RkQ4NzFBNSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDpDOEEzRkNDQTM1MkUxMUYwQjRDQUFGNzE0RkQ4NzFBNSIgeG1wOkNyZWF0b3JUb29sPSJBZG9iZSBQaG90b3Nob3AgQ0MgMjAxOSAoV2luZG93cykiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDo5ZmMxNjIyMC1kNmRhLTk0NGUtOGNhMy05ZjZkNjBiYjU2OTAiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo3ZmQ5NGI3My1kYzkwLTdlNGMtYTdjYy1lZjQ0MDUwNmM3ZWMiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/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"
          alt="">
      </div>

      <div class="header-actions">
        <button class="btn-normal">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAF4AAAA/CAMAAABepI+jAAADAFBMVEVHcEwDABwKADIUADYUISsXACsYADESCCoWCC4VAC0WAC8OcA8Pcg8PAC0dAzMPcw8Ocg8Pcw8Pcw80CSYPcw88CjUPcw9oID54LDUPcg+8ZS3IaDwdAjBRJC9LFTGqTz3Zdj7hhz+AKju5XjbMazufSjpHDDQOcA+UPDvfbzYMUQ8Pcw8Pcw+JQSyWSCWkPj5cTB8RXRX///8AEgAPcw4thxlrcWsXTxj9/0MWTBcCHwIKWQtYX1jp6ekDLAQWSRUNbhDR0tEFOQf19PQGPwgmMyb6+kP75kJLzzH0uSYHZwwpgxgxihoMYQycn5zd3t0gWCAbUxr50zAIRwgSRBS4urj71kIFUwoajgf+/1L1xDH+zDr2zCsafQwUdhHzpSNBhTUDJQPKsSgZhwIcmAVGpEIw56v890AUQRXFxsUITQr48TocpAX8oRsangkFOgZBnTv4qRgROxVDxyz4rir54TEBGAH97UTDpCY9mTj49Z39wiw2aSz2ww39/fuNkY3CdRUWkgLtnxw9fTL0mhtHijXv2jLziiL4tRj4/y/Uvi4FMgYGRQf61SA9djErbB8veRZOq0TixzDvu0LAgh8BXwo+kyyTsjLTiR29mCdMjjf88lL/30H9uDH4r0iqrar62zb55y4YgxCnfhzmqxv/mRk34aEoYSfozjRV2jp9gX363w3goCjushV5oiMKfB3tkxyzjB5ZPwg0jyTt6EfYr1mNqUBRlkLu3krBzjn0kjQ0i0P17Cn65K/ltizmwhP7yE04by4sdCMUZgpCS0KqaBXl1DfNnS6qui3z2o/83Hb86Gj4+DD7+4YhXxGXWhL67tn6+LfBvElChBn//s870Zb5vUZvl0J2gRKmsFHy5Y/EjR1GtEv67JNhlh/u003716UtxHnSlx9OKg79/p1b0zYxuCHu0Qw087yjnCMslz2NiRgIqF8GcSZyey5vcC+VThLqfgz5+fdRex3nq0guRhzYxlsfhixUunsGvoJGTgvHxxUAmE71zZ89Tzue1YFy2R1hAAAA9nRSTlMAAQMGCBcMHRIkKaTLND/fYMS5c0NNj1uu7vLRL41pqurwh9rixl0wt/48mtq17Ljwv/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////4rruEHAAALXklEQVR4nLWYd1gT2RrGI5CQEEBEUVh7WdfteyeBDEmAQBIDAVIQCDURBEIR6VWK0hEQEMVClaKIiKAuRaqwa9e1935dy6rb+63fmYj3wf0noPd7mDmTzHd+5z3vfOckhETSOqYQQfq/BIB1dFHo6MAQb3sQYFMoFF3Nla7OW50ECNejUKl6NLNZS2cZ0ygkkh4a4e0MgVyhUMkUg0Wza4eHhysWzl80h/S2RnipnKJv9ukwvtPNrWQnjosWLjLTh1tvbhKCk6kU40Wz36/FC3KcfJxicpxw/Mr7C+bPohIDvJF0ZAvVaNFCX/znnpKciMKInQlu+fE43vZD8+HZ88gk3TcYAJlOJutPX+CJ40k/Vzn5FYI7biK/HDVe0bQvJ7J59ix4BpM1COhUfarRp1dwtUiUdCXJqaQwAfAJfipcXTGY56dSxeTPhwlMTj/YTtUnmy2uxkX1ouXqCtFajfqIGB/cs6JtMEJ98mR88xLjyfEJuv7SBUkRnqIq0fE7pb31BYX9CQmnS7Lw+rW+DwYj8MIzt2uaF86aDF+jfenC5SLPpKrjZeJ/vtiqVhWejijszxHh8T7JOS348uWFZy7VRB6eDB+eKjizQC3yrDp6kff88pPnP+GRJYWF/ZFu3qqads4zHPAEP2YSfKhIfX2jxSLQfpwnvv8kJOT+6KH6joSSGDdvp+bjPKW43dsb+KcfnndKzwf/J1Q/YA2ZRlvmCfSt4v0p90N2hYTsb/f2iYkXefvkBzKVBxu23PFG+k+n3varX0ImTUj+FF0qTX96bRKi/xZdeSskZNeT52cjvJd74075g/48F0sXZw0fT6gdFnnOB/kTEU8h08wWJHlW94p/C04JDr4csmvXrhfX1Grf5uZA//3RlpaIvxXswfH4/LtJtWYT4U/Ro9Jo5mBNHqCAXgnu7Aq5r3jm53SsXcmrLE9xBr7/ll7EV3fE94hmU3R0tMbrUPRpZguTPEXtYqCXp4A7YP6TP16UuTTw/F2cD5ZXIj6vrApXL8d98ltEV+Zp7z5ynmbuW+3ZojwYHV0enVIZHBJy+fLlXZf/eO5v6WJp6ZxS7oL4yB41HtERf7d6tp7WeFQ2xkuqfavbOX3B5cEpKd988/v1wJiYrM//83sDYCGCoxFeqTyEqyPgaft41s4iaesO1LzB9Npq36P+Cll0OdD7nqaXJIiqSwqac546NwAd7DmIxhFv9Y6IOC2qHdzkM1/rytelGhgs8/X0PL6FZTcSHP1NX+DeU+cysIxL3nsjI7eXNSB7NPKZzlXqiH516nCT3wKylt8fpuiRDYyXuPlU31FYy2Sl0UAfyMCIeNgPfCYhPxgGcbEU9+IRO3fePtE2eNhMSzzUjcG8w35rNzkrWLtl1i+69g5g2KVT9wj+3pyYa0oXS2eX4EqgO4u7lu+szzt1o61NtUhL83WoNIO58X6+F8Ry+W5ZuHzoJIZlJOwtIPje6c1ZpZYuLpbRlaWlZ+WK3KqEvLxDqW3bOuZrV5qoLOeY1/j4bt3CArzgWsk5DLv9OGlvPHLo0s7ImG95ZSNnS4+wrK3twv17AN+T+vO6bbMpWrlDWL9s7Vrfdg5Ltlse+7Tq0sANX7/6hJKeUyfPYd77Ihvd5Sw7WZqcxWKFi3tFeUfzUj9ft22xvvb4dwF/R+HOkrmHBp6qiClI93Nzqy/Zm16bcSY9cnMsS86SpckAz9py/NDRlqO3Af+OwUTwTr6VW86WlnJ2D51S5Tg5+fj5udUnFAxkPEyPfBAKeHmazJrFslZsPdTS0nID4edMDH9xjaOjY1zc0MlUlQrx3fKc7mWA+pybsQBmpcnhbAf4TZs2TQq/es+ePY6O/xg+/5KffiUjI6MKvHcA2azdcmv0bLt6AH9iguYsqykg1O9xjOtde/5hVlb8PuA7nfvxx36V6juEl+9mIbyiq2fDhg2/Htv8YDFNa7yReXzB2h1BBP7r9BMDP3R0ZKmahrLu/Zj6OCfrFwHL2k6229rO2s5d0XUU8J8fu/lgsXa7AlH3cyMLaq56Efi4Xp97h3/IOnmjYrCCf66/KavRFsmWyewg3Ldc3xS4IXDz9uRjH0/RfllNzy+o6doP0r+Oi4t77POvE2dSz58/zz93aKhjW2wUWlAyuTvQBbwLGwI3HFsH+Llafh7CnmNktqQgPnD/I0fHr+McH7Wn+54YSE1NHTiRN5TfVuYQinTLrN3d3UOLs38NTA68Ceo3L9Vyz5lCIRsZvxuvqnBe4xi3x/FWd9/VoXSfu3fvtjzel3/Tcn2QLNbd3VruTuCvbkhODtwMeCgcLfHo2c49HFNztQHwt3bk7ujLfdq0b9++po7N11atX/1ozWhsLMs61D00VMC5HpicvH3d5s6bH2v7TQ2Zb7T0nRjVBeUjx/JuwO/oW/nTt8+eXbvotX7N6tXwp7QLRREryL6QvD25c11j47p5JF2SdoHMNzJXZV3Zsf/Wyu7uXIiVfdleq9cAGE5BQUGrveSxsUBXdAV2dnZ++eWX6z6h6Wr7WQtfcwyMpr/fpLrAK9uR2929EkX2wZfooPXr1wet8RqNLYoVbLzQ2djZ+BXw58K/Kdri4bPcyNg8q63iKgfA3bnZEBstNWQvIlZ5eTHtiuTXtzc2dn4F8QlNR/uvacTDnfdO04PrSl5Z9srclRshyjToVZpoWBUkFly9fu2nMmXaV99/P51Eec2bGTMNZ+pBq0efymQyDWe+Lt/IfNtFcXFAuHJj9srsjUfSRjRYpRKyiRNvJFcpFtiyV/C+N4cfG8aLN0VdPwK+4Qo2g8EICJ853n2akfFnrl9IpFackSNHNgK+1L/B39+fSWRHCRIZjEQBXNfZ21hxPjMi6Y0Xb6LpOoP0nivXBj5DpQGG4+WT5xj9zcEDw6w4nDSII2lHNHg2ys7k8jGMnwk9bVDGXLBmvPgPNV1nIPVCRAf1hE3TpsHxHjhnaEh3ZaAcJhE8nqZF2fa2gi8wTCJYYcUXogwLC1N9kgnd0HAm8IjWRNMVXuoxGaiDKYlERxOPcoDjI15xQICtA5EDPoATDPYKQWKigDfKKwrD+ImuXAwLKwrPrNNkJAosDDlFAQECMf1lyxzDk17hp6KJM4hZFUmkUnsPLsrJ5GPgBGbDzeTzua6jo8USDOMWS+xhkKIwK8horePzW8MF3DCptE7oOtb+FU9fYQV49D4olAQIpTaEtjp7oZCPSYpt7a0E4qhiMfIlQAryuWwbNmTYtHqAuVy+DZuLeTiMtX/B03mcMTz0FcL8CbwkzFYhkGA2bKENm/fLv7kjAVIsTCiFmUpaCUomoSoMGPBCONa+jqfyhNwxPMyfwYziohwpxheKkeJMiaR45NvvvisV1EHRSKA0wupaFQQFdQML7e3hxVj7Ot6EYxU2Dm/oyoNrCR+rixoFmFQq5P154MCBPxFNyg3PxMAG5is8YtgyGGNt1OuVw3TwkKC8LzTmtIZbKIgZtsKxwhXe9XA4ewAFL5EPVqEJhRX9D49MMVRwhWMtY3zd27IzMYkQ1YEN8WilXHZrGMqxtcdshByQb8X55e8ozsJ1nQCVWWY4USCE93AIbbn2tmMtcYP+atXaw1kSBY+QCzh2kQQWpETogQrSBsmELLbFvOko6OBLq4IOgwh5aHHaoHr2cLCS8u09hIooTau5MfXVnmOLlhQvCpaPLRy8YjaDXezqgJYT3LCyisrMXEGn6UOQP2BGMaIsTOBm1LRXGQ6u4QGJsBDpH2lazQ36qx3TFG0IM6Yxp9LRMQPenEo3gQ1iKlyB2UJ7W+YHZCKoH0yDbUPHBJ3HMpjTTGYaWph+aELS07SaG3rabP+mDh58D65ipp4m3vavsOBDooOr4ZSxIL3lMDG1MDWZVM//AkcitmH907m6AAAAAElFTkSuQmCC"
            alt="">
        </button>
        <button class="btn-normal" @click="userStore.isLoggedIn ? router.push('/chatroom') : userStore.openLoginModal()">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAC0AAAAuCAMAAACLUGAGAAABoVBMVEVHcExl01BSzjnl+OE9yCE8yB9MzDLt+uuS4IJTzjlIyy6L3ntKzC/m+OLc9tff9trg9tvq+edBySbq+eae5I9a0UKe5JC57K44xxo2xhhv1ls2xhhKzDAzxRTv++30/PKc442b44yM33ua44s8yB/j99/b9dZUzzpY0D9Uzzre9tnX9NH1/PPd9tg6xx2I3neU4YSZ44pq1VSI3nd32GKt6KF/22xMzTFa0EFt1lfW89Cr6J9Gyyvk+ODP8sgvxRDJ8MDs+unv+uye45Cb4oyU4YR22WKP333H775p1VOz6qeh5ZRUzzpVzzyv6aQsww1n1FBc0UT6/vnQ8sq+7bTr+ej1/POS4ILR8svN8cbR8sqB229o1FH6/vm/7ba77LG366yu6KKr556n5prD7rrH777N8cag5ZKc443V88+k5Za06qjK8MI0xhVi00tp1VNw11ux6aVVzzzc9dfz/PGB3G/Q8smX4ohb0UN32WLg9tv3/faM33uH3XV82mk7yB7j+N9QzjbT8szY9NKS4ILv++3a9dREyigvxBDp+ebt+ursm5W3AAAAXnRSTlMADggOIjiFQB94VAThNI2AHNZfkc3ubu2oywLlRLe077RRM4fvbpxr9cEr8eFRbfORGe5o1+vI8snB10QY8cjctGJ25GDr897rpYedrbdfkTwspGHdX8B/8e7qfORa9ZugoQAAA1FJREFUeJyN1Oda4lAQBuBBKYpIt4GAvde1965rWbtuRwQpSlGCirAgsKKAV71zEiAEI+75k5DnzeQ7MwkARUv5W3PaZzKZVMZlCXywJId/cN3e3j4/v75mVO3lJWy1sdBmMvH4nOI9X35IU5NxuV8ikSxpVPF4OBzoPeLFyj5iVSdssR7Fy8vT5aWcL0Uf2tOlogry3r/3jo63mKTVMCVPFJoOuaKffohy2uGxLxZnNuHOlsmJXEXSBjBC72I/uTBvvzBvcbURu4ApqjVzOXuJERzzRzqoWjSfnc0UWJ0EO6YAaI9zrMduvzhWAhxbLGOFpfsyGRWAJkwsTe8dHmLNZnNdNcy4/ee7LG7HQSjBWFjWY79Ae3Zmsbh3YdtqHRPk9Vw8LocOboSc9Z+fV4DtylmbfzkwLvQEnp7YCAXWatNCq9OlzemOcEAOvZwIxLrRWq02uq4rGBzO6unAS087XwS0V1dOl8sl2E4mN4YqyBTnMa7iB4+1bTU70QaDwa+1kUgkOtgC/WwX7MURVqEJbTKZjAxGo9G7u1GYftMxvz8bwVkBArSkLNK7x8d1+MYXAXeGEYYwZytrQ6F1+F4QgWODBEPVILGPxN7cfILPbFl3PgJa7SrTsHGmLNqba9RFHXM6V7RNrc0VuWGM5O016jpOBOKqOO+ygKbE+nw1UFfQMe0wzyc4SlO0vgfU7NBWqngwbDLU9/BANNuFFj4M4pylqBoYy3dsjRfDzyylEgkZ1GY7Fkyu6Xh1JdquHbSJiUaAWqRNI2TALe9oipqExu6EbJb8HG7GL3oD5zvCnxvLSvGmlJi91oLzHS+GdLGdRKIbD7KUqHAzOOB9+s3IXSmb7CSHicREGYA61cYpNB4KTZH/ltmpRvJT2ElR5DuXplJqPOhj9dwR49AOCBf7urq7ZRTVJQQ6Ack7EIsJOVpXNnX9iz6TdpHufimjO5IaIA+KeQeKN6Xb9E0yZ/udnQf0lUo6hkDvNfB0S13DVMwtYT3ZQ6Pe28A/OSlH0/1Re70LAl4MTA0Be4/I4E0b3sEMaGhrq6e9cKDBm06rodSSpWKxmEEkFROa3pstiUVoY16y0umFPWFJCzoRYxcMYukHlF56UrYe/nPhLvX8+B/ujnm29ODpNgAAAABJRU5ErkJggg=="
            alt="">
        </button>
        <button class="btn-telegram">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADQAAAAsCAMAAAAdI2svAAABFFBMVEVHcEw5xx277LK/7bao55vI8MCi5ZQ3xhrR8std0UeQ34C87LHH8L/R8sqU4YTU886p55yh5ZPP8si67K/Q8skvxBFy2F1PzTXT8805xxym5plEyiiu6aKo55vQ8sk/yCR72Wei5ZRCyiaT4INZ0D/T8ss7xx2F3XK16qrX9NAmwgYlwQXS8suj5ZVd0UUlwgVh00pWzz2I3XWh5ZN92mqv6KOH3XXH777L8MNi00u97bNo1VLO8cfE7rvA7bdY0D+5665Cyiax6aZTzzlJzC7S88tu1lh32WMlwQRd0UU7yB5OzTS16qpy112X4oc0xhZ72mgtxA6t6KCe5I+k5paI3naM33uR4ICp55yE3HJ/22yB226VNOcpAAAAN3RSTlMAjC5jITpYwncVBhaeTEuMvJXYz7lNrKDEIawtefHndN3h8vA97Vu58w3fq7HOvvHX5IgLeYyc0GV1tgAAAm9JREFUeJyVk9d64jAQRkXvHRIg9BLIbnrZJEAAGwxmcSjG1Lz/e6wk22AjWwu6lL/jOfPPCICzzo0tnov7zkIcodzHx/u7/3TC5062EPLVjp6KBPzVFiK+2o1G7CTC7o7KRRDS7Z6iF7htKV5tSAgCa/sfYQ1FMaIUEViWFa1Uwmu75VpqK/UYQkRxk/VSi+QOXg0/cGJkI4VNiRtbklO9YCuxAHBkESFJi4gJ4vBXD16wlTcAnBhZLBYTJzCeIqfx6goxBwAZFZlM7AYB+zmtF4w4A2/fJBVZlw2myOm8BDaMAo6oxHq9qh0ViXMQ0XgJbB0PMq0iq9Vy+ayf4rEXy6bRK/CGNcj2J3gIGBfRebFiEefku1O8Vsvt9mc38ygBh6qEF5xj5AW3WdwX2e52s2FB7iTJkV6ieCdrWMt7r91sNhx+X6BbN+nFwjlmZIlgWY98D17RdY702mzCyiIHD14yMmhWcENx7VNBiJRVH4xTX2TQbDY/lRys7pjGS5LS6p68ksjno2ZImXBd3nupuN/HZzliLTIaXeo3yJbOor1/US/+aIgBIiDS6eSJ9XZG9uMGtaMiGOn0KsD8eGsGSK/XK1GeuqcAiaHOCyLj8dhlztgLpBdE+v2+xRy6IL0wwjDXFIj0wgjDXFEg0gsjf0uU7O5JL0jAQ8kBPJJeCJlOKTl4n2Tk/qmvQ6ZTSg6eEfa6BB6XSmBkPk+ZQyncCl5Ny74IROa/KC1doVaUdb4uKUXQ+U2BKtrRp1wKwvM8JQeQ6DPazxYF4fkEBcoz+l8mHnj5eGg9HS9LyoUZWg5Gx4Kg/JkQSLgeDtn9A/5ICibOjGMoAAAAAElFTkSuQmCC"
            alt="">
        </button>
        <button class="btn-message">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAoCAMAAABgm+J9AAABKVBMVEVHcEyU4YX///+P4H8iwQKY4okowgiK3nhAySZPzTXk+OBt1liS4IK366wwxBK97bP0/PI9yCCS4IIwxRHV88/8/vtu1lh52WT1/POW4Ybj996o55uF3XNGyyp42WRi00rS88y/7bWs6J+i5ZSS4YGK3njs+un2/fVHyywmwgbn+eTK8ML2/fVm1E8hwABl007////g99t52WWC3G/I78AhwACF3HJs1ldz2F9Y0D/////B7rhSzjiw6aRm1E+p55y77LHG775NzTLa9dVh00q266vy/PB72mdd0UTt+upDyic+ySGf5JD5/vjW9M/f9to0xhUuxA/n+eTK8MNIyy05xxvS88uB3G7O8ceU4YSk5ZaG3XSM33vj998hwACZ44opwwkkwQSQ4IAABAJhAAAAN3RSTlMAAvEX8uHX4QfvBxsEyh0aHe8V8fDcyufQCe/bzNzc2d7g5c3OLvHx0enc0uroubO6NVkTqDiHWiuWkgAAAu5JREFUeJyNleta2kAQhgcpUAVErYAIiiK0tbYe2xJRjCeKaFARUUEE4f4vot/MbiBE6dP5/b7Zb2Z2gcizXZhw1Repz1KLUvOq6j+JayZacFYV9QdVqVTu7u5eXm5uzs6urx8enp7qJ6sR8Ns7NLXwH3y9fnIS9tBOmAqFmYFSHeEZd/IHECKlEkULE1qx+cqAPxP+SfEHYaJIppiEwUpo4b04mmf84FgJphiF73zK2HaFP0Ykb8Y0W2JUq6IMeFd84Mcl7iFjtlqWj6ISX5TR+EO+VCrJCS3LsrpicBpR3PE1XyyKwHyzGaCojr/Iytv4zBfXIPisLvh+WwwVn5UVd3zmzbUQBMW3nwP0bTD9eSgbbt40TTlB88+PyzAG7c5HoDjaFb4lQrOv+McyDEe7K6wM45s8TUSa8wFXfNmA4dwWlMSGk7ekB4Uzb7AxMn1c50RYxwHfzXpoLqA/z3w+nybXeKBMhZmX6Yvg5I+OYLi2lcEpScU3syEWNJ9n/vwchmtbppmjxJpMH0LuWcfX/MUFjNFtIX6OKJHF9FMholx5lN/fX6LVkW21Wr458uKULAvBIAXjKr7mDw9hOLdlWRA8vr6X9n4naK8c/0jBH5rfZ/70FIZz+l0Wsu12IIjfDO+yYcQSUNTnhb+/h+HgWQileJrx3dxunOOnWZE4wl9eLlFysK1uUwnD6XO7aQSbZFz4qysY9rbwWBAp5dyWxP/Kis1fNWBovt8PeFlwbkviszI9ean4xq2fkvpttSGEUu7pS3xWZhlv3N7CsN+KnPAejziiCF+rwVBvhYWY4drWoF1RmK+9+ikglz8uQj4/uq17u90GK+vgX9mQ8bPgbNeevm4X8VmB0IOBcWrBHZ/5ho5fE6XX6/hpucwCxfLvxB/yyOMPQemwYcRxiWLO+G/4V47Tk1NgGAZHGhd/yPfweSidDm3lWBgbf8h3RPm1iVsdTP+Tt3Gu9Wn5r926mLRrVtUnuz64qrPpob/IIrbneEbIEAAAAABJRU5ErkJggg=="
            alt="">
        </button>
      </div>
    </div>

    <!-- 轮播图 -->
    <div class="banner-slider"
         @touchstart="handleTouchStart"
         @touchmove="handleTouchMove"
         @touchend="handleTouchEnd">
      <div class="banner-container" :style="{
        transform: `translateX(calc(-${currentBannerIndex * 100}% + ${isDragging ? dragOffset + 'px' : '0px'}))`,
        transition: isTransitioning && !isDragging ? 'transform 0.5s ease' : 'none'
      }">
        <!-- 克隆的最后一张 -->
        <div class="banner-item">
          <img :src="banners[banners.length - 1]?.img" alt="Banner" class="banner-img">
        </div>

        <!-- 原始轮播图 -->
        <div class="banner-item" v-for="banner in banners" :key="banner.id">
          <img :src="banner.img" alt="Banner" class="banner-img">
        </div>

        <!-- 克隆的第一张 -->
        <div class="banner-item">
          <img :src="banners[0]?.img" alt="Banner" class="banner-img">
        </div>
      </div>

      <!-- 轮播指示器 -->
      <div class="banner-indicators">
        <span v-for="(banner, index) in banners" :key="banner.id"
          :class="['indicator', { active: actualIndex === index }]" @click="goToBanner(index)"></span>
      </div>
    </div>

    <!-- 通知跑马灯 -->
    <div class="notice-bar">
      <div class="notice-icon">📢</div>
      <div class="notice-content">
        <div class="notice-wrapper">
          <!-- 第一组通知 -->
          <div class="notice-text" v-for="notice in notifications" :key="'first-' + notice.id">
            {{ notice.text }}
          </div>
          <!-- 第二组通知（用于无缝循环） -->
          <div class="notice-text" v-for="notice in notifications" :key="'second-' + notice.id">
            {{ notice.text }}
          </div>
        </div>
      </div>
    </div>

    <!-- 用户信息栏 -->
    <div class="user-info-bar">
      <div class="user-profile">
        <div class="user-avatar">
          <img v-if="userStore.userInfo?.avatar" :src="userStore.userInfo.avatar" alt="avatar" class="avatar-img">
          <span v-else>👤</span>
        </div>
        <div class="user-details">
          <div class="user-name">{{ userStore.userInfo?.nickname || '游客用户' }}</div>
          <div class="user-id">ID: {{ userStore.userInfo?.id || '未登录' }}
            <div v-if="userStore.userInfo?.balance" class="user-balance">
            余额: ₹{{ userStore.userInfo.balance }}
          </div>
          </div>
          
        </div>
      </div>
      <div class="user-actions">
        <button class="btn-deposit" @click="handleDeposit">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAA1CAMAAADWOFNCAAABSlBMVEVHcEwjwQNUzzpFyyoyxRNGyyvg9tv///+X4oeZ44qp55yk5JmF3XOl5pfA7bb2/fWI3nZc0UOK3nlk0030/POV4YXt+uslwQbT88yy6aaA221x11zc9diI3nas56B92mmB3G9w11rI78D3/fa+7bVUzj1Szjo9yCH4/vfz/PIhwABi00ub4ow6yB1n1FCz6af///////9h0koCIgJi0kr///8txA1Xzz7V88+z6qhNzTKe5JBc0UTd9thw11uY4oln1FDD7ro8yB9HyyvJ8MHP8sg3xxm97bS466512GCT4YOO331CyiWp55xSzjgmwgZr1VWu6KIhwADs+ukyxRTl+OHz/PGk5peJ3nd92mn6/vl52WWF3XKC3G+A220kZRpYiVJLcEgoViIeTxovjh0IKAdem1SpzaMONQx3p2+wxq3G2MPE28GNpYv9LXIeAAAAM3RSTlMAylTBycnJycNSwAVSyczFyczerLI2QprFjRnIKqsPlj3hqttdMgk9Em26idjieuOPkk/34sJSAAADoUlEQVR4nJXWZ1fqQBAG4LVhRRQUe+/tNpAeBAIYadJRQEUF9bb///XObLLJkoQLzvGD58jjvDs7iRJiXsfOk5MT5yb5TDkXqtVqqVSpLDgHNscLSH7//SMIPt/ugP3W98CUfnVcnXdfIh6dXR+o0x5Gqzy7XK5WPBq9lr6u9kfTC2AgGqrn62vJX8hO9Vf71PgSVPnB1IJXk+Yj+2YbZyWbeJyqLJpU+sqi1PLyilPNdKlVnRo4DlVBNHfNR58g4C+DHyUSu9MU7XHospRIvL+1oF5BveI3LXfjxq+aeDw+i6yrU12Iv3dcLvjSquPNB1UShRi7cDu8qdd91y2XvtruNGdgruvkO0fq9arP/9Og3rxpzUiS5F8hNs3A7lV92drbC9YHfPzjFeqlnQukqME2kh9uY4qM86ZaEtjYnkA9ud0hby4QEAtRzhSyVjJe5wxUEMzDfeOGKjSimAmwaEjgDmVVVU2lIlETzlNFTSz2qLXJ1mq1oJXYtDa4tBWhiSbipkrMZGLJpChxJghHmCC2biMI0XAEj0MVmnL5ikZTzZWseANLUKAjaONFgfF4muw4skmlUnZiY6Si7lohhMdpP7XLYJL2KaUmWM1toeo2cKHRphiLJdF4HOaPpEWLxi2blAp7c7mI47DHU2jRTIIZdqH7+IHFSVYzrLaJRd9GW4IVfLTP6dRSqXQ6fXfXfHi8v280dlDpjLoE8BytqAaIbG5uwmvEYhaNXg60WpQnrZoGmjCoZZNo8oXCO2aDtrFv2JVoaPL5CChDNLYEi4ScY5u5TTK9QaPJJuKeJ8uG47AlAGXHaNswlFU5GjVuULOGaDVlAqhgag9UKW1wRUMhVIrp2k88DnzajsdZg78PDtYGjNcLyhhNmdoMTIMeZ8exoxqvF3ZmjMwaoymT3oLJs6nxJhAAVfDro7ElgCU8C3dFoyYgjhErF023BNCMDO9oJicbUbwgVjma6RIM4/Ye/BjW1xGxmkRTl+BLr79XVrP9ZEvgnh82fyqtpvvJTXp+RF+jS2RCjaYabQnkqeFbEd5x8GLEVxa8GS7IHHccLlrXpJkBBKbsGQXFPW5d0bRJsz5J+Q2EijuOYQnQZFRTlo3ndojM8ZPuF42aW1T6aKEe0VSDas3kOD2j0SoWT8mWcdK9o1FTLC6Rg89EK8p1AI/pfyZtbCO3gv9S5gePRmuI/nNz6OhvilotTSsbfHQ2MqbW6Ch8sRrS1enSEYJ/K6hPiv8wCy4AAAAASUVORK5CYII="
            alt="">
          充值
        </button>
        <button class="btn-withdraw" @click="handleWithdraw">
          <img
            src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADUAAAA1CAMAAADWOFNCAAABNVBMVEVHcEwowghFyilEyihQzjfe9tmt6KH///+a44uZ44qk5JmF3XOO332R4IFi00qb44uF3HPt+uv1/PPK8MH1/PMlwQay6aZw11qA221Yz0Hc9dis56CI3nZk00x92mnz/PLI78D///9k00y+7bX4/vdUzj1o1FFSzjoyxRXz/PGu6KHD7rpSzjhz2F////////9o1VL///+t6KAxxRPA7bZf0kdCyia67LBu1lg8yB9NzTJIyywCIgJa0UI3xxlWzz3e9tlSzjid5I6O333S88yT4YOY4onF770sxAzY9NKi5ZRk003l+OHr+ujz/PG16qqy6aan55ohwACJ3ndy113K8MLO8cZ22GF92mn5/vh52WWF3XMowggkwQSC3G+A220jVB1ijlxLiUFepVKmzZ9nwVYHKQfBnGtZAAAAMHRSTlMAyMHJUsnEycFSBVLdOMnIykK2xseajbAZPioPq9eWbaqXhF0SMl4J3t7q1avmy9PV2KvIAAADaElEQVR4nJXW2VbiQBAG4EYHVEQRFBAV9310BtkFEQiLIELYJBJEx/X9H2Gqt9Ah4YB1443fqb8r1a0Imdeha2dnx7WJflIud71er9UeHtyuqc0hN9lspbA7Zb+NM2YqlUL38e73xlSdzlgbYiLx+Pn6ZGR3s2jUyI1Qc36yOqAGCDP3UmnBfGR77j9zrLiJaKaYl6y8Vr18qPa9q2H1KpoJMdPuvxay+JyQutDt7toJ+iugq1qh+/nG6p3Wl6rImnmEoWLmFjv1so+f3zf6+v5KSNgQAqeN7MLXEU2vV4m83YzWezQvGPgWG2hPNL16Qf4wqI9MnhpC4rLsRWtD0oNFKoSab//09Z5LFgXTaIRsaE5rQyrLx6YqnUSwGk1ncslUKsSMjE2IqKGpQUlgXp5UJTE0sSSPhk2zee9EczpTe4hjA22CUWpisevrVx6NmHtQaywaIVDZvsqjUXN7G5N5NGwkSQI1bINNNnvXYdGYCYdLPBoxpVKJKNHAEoT4ca6JKfdlLRo2xWLRgdZGDCxBKM0MkPKtw4Zr3jav1co2VjqClyDSTzFTvjC/klaDITermEjnMkHfyZhbaBVMV7c4jcYB/oWlBV6LvPzIOtJGWAIvvtoOiY4gn8+32/2X16cnVb0EpYsmLME53CMvmTQ2QKhRlM4yshoN+6DQaolOmrYBo2KTSIAyiUa/DrwxW6SNY8vBoikdMMHgMlrVjLCfZAmWEHLgNiubyL5FoxETrILSHUdcAqxwNPiJ1mk0MNVqNArKGI1NDSt8HD9WvA2YdBqU0bCpYYWPAwmRTzCZDCjxugmm3V6EaZDjXPoCLBoxudwssonXTRInvQ2TVxUhGjPJJCh55DjDJYAl3O/oohGTTIEyRuNLAM3QcQCM1gZfVahTZDNG05bgGG/v0S9D+ZHNJJq2BPvj/l45TfeTH2f52PxWOk33U5t0Jh2YMZQHObVo1OiWgE4aPz3wXsFLQp6fcPgUOYXjKHqjTZobQERZ0Ip4HCGaMOkY70NNuQzKJJq2BHpDSbn8DEqc9KRoxDxjJR5nUjRiBgML8pkcxyxamJPBoGVB28ZJj4+GCZQHHYnHyTEzLhoxrdYRXNMfRKPlwf+lBKaPRuqU/HNzcpH5gWl57GyD/fszs2JZZi3jyoNfLPQfrJc/dR3e7WcAAAAASUVORK5CYII="
            alt="">
          提现
        </button>
      </div>
    </div>

    <!-- 游戏分类标签 -->
    <div class="game-tabs-wrapper" :class="{ 'is-sticky': isTabsSticky }" ref="tabsRef">
      <div class="game-tabs">
        <div
          v-for="(tab, index) in gameTabs"
          :key="tab.id"
          :ref="el => { if (el) tabRefs[index] = el }"
          :class="['tab-item', { active: activeTab === tab.id }]"
          @click="switchTab(tab.id)"
        >
          <span class="tab-icon">
            <!-- 使用双图层叠加，通过透明度切换实现无延迟 -->
            <img
              :src="tab.icon"
              :alt="tab.name"
              class="tab-icon-normal"
              :class="{ 'icon-hidden': activeTab === tab.id }"
            />
            <img
              v-if="tab.iconActive"
              :src="tab.iconActive"
              :alt="tab.name"
              class="tab-icon-active"
              :class="{ 'icon-visible': activeTab === tab.id }"
            />
            <!-- 高亮指示器 -->
            <!-- <span v-if="activeTab === tab.id" class="tab-active-dot"></span> -->
          </span>
        </div>
      </div>
    </div>

    <!-- 游戏提供商列表 -->
    <div class="game-providers-section">
      <div class="game-providers-scroll">
        <div
          class="provider-card"
          v-for="provider in gameProviders"
          :key="provider.id"
          @click="goToProviderGames(provider)"
        >
          <img :src="provider.img" :alt="provider.name" class="provider-img">
          <div class="provider-name">{{ provider.name }}</div>
        </div>
      </div>
    </div>

    <!-- 游戏列表区域 - 根据tab动态显示 -->
    <div v-for="tab in gameTabs" :key="tab.id" :id="`section-${tab.id}`" class="section">
      <div class="section-header">
        <h2 class="section-title">{{ tab.name }}</h2>
        <!-- Hot 专属翻页按钮 -->
        <div v-if="tab.id === 'hot' || tab.id === 'game'" class="hot-header-controls">
          <button class="hot-header-btn" @click="scrollHotGames('left')">
            ‹
          </button>
          <button class="hot-header-btn" @click="scrollHotGames('right')">
            ›
          </button>
        </div>
        <!-- Fishing 专属翻页按钮 -->
        <div v-else-if="tab.id === 'fishing'" class="hot-header-controls">
          <button class="hot-header-btn" @click="scrollFishingPage('left')">
            ‹
          </button>
          <button class="hot-header-btn" @click="scrollFishingPage('right')">
            ›
          </button>
        </div>
        <!-- <a v-else class="section-more">更多 →</a> -->
      </div>

      <!-- Hot 专属布局 -->
      <div v-if="tab.id === 'hot' || tab.id === 'game'" class="hot-games-scroll-container" ref="hotScrollContainer">
        <div class="hot-games-layout">
          <!-- 左侧视频 - 使用列表第一个视频游戏 -->
          <div class="hot-video-container" v-if="gamesByTab[tab.id] && gamesByTab[tab.id].length > 0">
            <video
              class="hot-video"
              autoplay
              loop
              muted
              playsinline
              :src="gamesByTab[tab.id][0].icon"
            ></video>
          </div>

          <!-- 右侧游戏网格 - 显示除第一个之外的游戏 -->
          <div class="hot-games-grid">
            <div class="hot-game-card" v-for="game in gamesByTab[tab.id]?.slice(1)" :key="game.id">
              <div class="game-badge" v-if="game.badge">{{ game.badge }}</div>
              <video v-if="game.icon_type === 'video'" :src="game.icon" class="hot-game-img" autoplay loop muted playsinline></video>
              <img v-else :src="game.icon" :alt="game.name" class="hot-game-img">
            </div>
          </div>
        </div>
      </div>

      <!-- Casino 双视频布局 -->
      <div v-else-if="tab.id === 'casino'" class="dual-video-scroll-container">
        <div class="dual-video-layout">
          <!-- 显示前两个视频类型的游戏 -->
          <template v-if="gamesByTab[tab.id] && gamesByTab[tab.id].length > 0">
            <div
              class="dual-video-item"
              v-for="game in gamesByTab[tab.id].slice(0, 2)"
              :key="game.id"
            >
              <video
                v-if="game.type === 'video' || game.icon_type === 'video'"
                class="dual-video"
                autoplay
                loop
                muted
                playsinline
                :src="game.icon"
              ></video>
              <img
                v-else
                :src="game.icon"
                :alt="game.name"
                class="dual-video"
              >
            </div>
          </template>
          <!-- 如果数据不足2个,显示占位 -->
          <div
            v-for="i in Math.max(0, 2 - (gamesByTab[tab.id]?.length || 0))"
            :key="'placeholder-' + i"
            class="dual-video-item"
            style="background: var(--bg-card);"
          >
          </div>
        </div>
      </div>

      <!-- Fishing 视频+网格布局(支持横向滚动) -->
      <div v-else-if="tab.id === 'fishing'" class="fishing-scroll-container">
        <div class="fishing-pages-wrapper">
          <!-- 每页显示一个完整的九宫格 -->
          <div class="fishing-page" v-for="(page, pageIndex) in getFishingPages(tab.id)" :key="pageIndex">
            <!-- 第一页:视频+5个游戏 -->
            <div v-if="page.hasVideo" class="video-grid-layout">
              <!-- 左上角大视频 -->
              <div class="video-grid-main">
                <video
                  class="video-grid-main-video"
                  autoplay
                  loop
                  muted
                  playsinline
                  :src="page.video"
                ></video>
              </div>
              <!-- 右侧和下方的游戏图片 -->
              <div class="video-grid-item" v-for="game in page.games" :key="game.id">
                <div class="game-badge" v-if="game.badge">{{ game.badge }}</div>
                <video v-if="game.type === 'video'" :src="game.icon" class="video-grid-img" autoplay loop muted playsinline></video>
                <img v-else :src="game.icon" :alt="game.name" class="video-grid-img">
              </div>
            </div>
            <!-- 后续页:纯九宫格 -->
            <div v-else class="pure-grid-layout">
              <div class="pure-grid-item" v-for="game in page.games" :key="game.id">
                <div class="game-badge" v-if="game.badge">{{ game.badge }}</div>
                <video v-if="game.type === 'video'" :src="game.icon" class="pure-grid-img" autoplay loop muted playsinline></video>
                <img v-else :src="game.icon" :alt="game.name" class="pure-grid-img">
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Grid布局 -->
      <div v-else-if="tab.layout === 'grid'" class="games-grid">
        <div class="game-card" v-for="game in gamesByTab[tab.id]" :key="game.id">
          <div class="game-badge" v-if="game.badge">{{ game.badge }}</div>
          <div class="game-img">{{ game.img }}</div>
          <div class="game-info">
            <div class="game-name">{{ game.name }}</div>
            <div class="game-type">{{ game.type }}</div>
          </div>
          <button class="btn-play">开始游戏</button>
        </div>
      </div>
      <!-- List布局 -->
      <div v-else class="games-list">
        <div class="game-list-item" v-for="game in gamesByTab[tab.id]" :key="game.id">
          <video v-if="game.type === 'video'" :src="game.icon" class="list-game-image-full" autoplay loop muted playsinline></video>
          <img v-else-if="game.icon && game.icon.startsWith('http')" :src="game.icon" :alt="game.name" class="list-game-image-full">
          <div v-else class="list-game-emoji">{{ game.icon }}</div>
        </div>
      </div>
    </div>
    <div class="footer-view"></div>
  </div>
</template>

<style scoped>
.home {
  background: var(--bg-primary);
  min-height: 100vh;
  padding-bottom: var(--spacing-xxl);
}

/* 顶部栏 */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-sm);
  background: var(--bg-card);
  position: sticky;
  top: 0;
  z-index: 100;
  padding-top: calc(env(safe-area-inset-top, 0px) + 10px);
}

.logo {
  font-size: 20px;
  font-weight: bold;
  color: var(--color-primary);
  text-shadow: var(--shadow-glow);
  height: 40px;
  width: auto;
}

.logo img {
  height: 100%;
  width: auto;
}

.header-actions {
  display: flex;
  gap: var(--spacing-lg);
  align-items: center;
}

.btn-normal {
  background: transparent;
  color: var(--text-primary);
  border: none;
  height: 32px;
}

.btn-telegram {
  background: transparent;
  border: none;
  padding: 0;
}

.btn-message {
  background: transparent;
  border: none;
  padding: 0;
}

.btn-message img {
  width: auto;
  height: 23px;
  cursor: pointer;
}

.btn-telegram img {
  width: auto;
  height: 24px;
  cursor: pointer;
}

.btn-normal img {
  width: auto;
  height: 32px;
  cursor: pointer;
}

.btn-login {
  background: transparent;
  border: 1px solid var(--border-active);
  color: var(--color-primary);
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--radius-xl);
  font-size: 12px;
  cursor: pointer;
  font-weight: 600;
}

/* 轮播图 */
.banner-slider {
  margin: var(--spacing-lg) var(--spacing-lg) var(--spacing-lg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  height: 125px;
  position: relative;
  width: calc(100% - 32px);
  /* 触摸优化 */
  touch-action: pan-y;
  user-select: none;
  -webkit-user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.banner-container {
  display: flex;
  height: 100%;
  width: 100%;
  /* 触摸优化 */
  will-change: transform;
}

.banner-item {
  min-width: 100%;
  width: 100%;
  height: 100%;
  flex-shrink: 0;
  /* 防止拖拽时图片被选中 */
  pointer-events: none;
}

.banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  /* 防止拖拽时图片被选中 */
  user-select: none;
  -webkit-user-drag: none;
}

.banner-indicators {
  position: absolute;
  bottom: var(--spacing-md);
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--spacing-sm);
  z-index: 10;
}

.indicator {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-circle);
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  transition: var(--transition-normal);
}

.indicator.active {
  background: var(--color-primary);
  width: 8px;
  border-radius: var(--radius-sm);
}

/* 通知跑马灯 */
.notice-bar {
  margin: 0 var(--spacing-lg) var(--spacing-lg);
  background: var(--bg-card);
  border-radius: var(--radius-md);
  padding: var(--spacing-xs);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  border: 1px solid var(--border-light);
  overflow: hidden;
  box-shadow: var(--shadow-small);
}

.notice-icon {
  font-size: 20px;
  flex-shrink: 0;
  animation: notice-icon-shake 2s infinite;
}

@keyframes notice-icon-shake {

  0%,
  100% {
    transform: rotate(0deg);
  }

  10%,
  30% {
    transform: rotate(-10deg);
  }

  20%,
  40% {
    transform: rotate(10deg);
  }

  50% {
    transform: rotate(0deg);
  }
}

.notice-content {
  flex: 1;
  overflow: hidden;
  position: relative;
  height: 20px;
}

.notice-wrapper {
  display: flex;
  gap: 80px;
  animation: marquee 30s linear infinite;
  width: max-content;
}

@keyframes marquee {
  0% {
    transform: translateX(0);
  }

  100% {
    transform: translateX(-50%);
  }
}

.notice-text {
  font-size: 13px;
  color: var(--color-primary);
  white-space: nowrap;
  flex-shrink: 0;
}

/* 用户信息栏 */
.user-info-bar {
  margin: 0 var(--spacing-lg) var(--spacing-lg);
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: var(--shadow-small);
  border: 1px solid var(--border-light);
}

.user-profile {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
}

.user-avatar {
  width: 48px;
  height: 48px;
  background: var(--bg-card);
  border-radius: var(--radius-circle);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 2px solid var(--color-primary);
  box-shadow: var(--shadow-glow-strong);
  overflow: hidden;
  position: relative;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
}

.user-name {
  font-size: 14px;
  font-weight: bold;
  color: var(--text-primary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 150px;
}

.user-id {
  font-size: 11px;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
}

.user-balance {
  font-size: 12px;
  color: var(--color-primary);
  font-weight: 600;
}

.user-actions {
  display: flex;
  gap: 10px;
}

.user-info-bar .btn-deposit,
.user-info-bar .btn-withdraw {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
  white-space: nowrap;
  border: none;

  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.user-info-bar .btn-deposit {
  background: var(--bg-card);
  color: var(--text-primary);
}

.user-info-bar .btn-deposit:active {
  transform: scale(0.95);
  box-shadow: var(--shadow-sm);
}

.user-info-bar .btn-withdraw {
  background: var(--bg-card);
  color: var(--text-primary);
}

.user-info-bar .btn-withdraw:active {
  background: var(--bg-hover);
  transform: scale(0.95);
}

.user-info-bar .btn-deposit img,
.user-info-bar .btn-withdraw img {
  width: auto;
  height: 32px;
  margin-bottom: 4px;
}

/* 游戏分类标签 */
.game-tabs-wrapper {
  position: relative;
  background: var(--bg-primary);
  padding: 0 var(--spacing-lg) 5px;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
}

/* 吸顶状态 */
.game-tabs-wrapper.is-sticky {
  position: fixed;
  top: calc(env(safe-area-inset-top, 0px) + 58px); /* 根据header高度调整，包含安全区域 */
  left: 0;
  right: 0;
  z-index: 100;
  box-shadow: var(--shadow-md);
  padding:var(--spacing-xs);
  margin: 0;
  background: var(--bg-card);
}

.game-tabs {
  position: relative;
  display: flex;
  gap: var(--spacing-xs);
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  -webkit-overflow-scrolling: touch;
}

.game-tabs::-webkit-scrollbar {
  display: none;
}

.tab-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  padding: var(--spacing-xs);
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  position: relative;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.tab-item:active {
  transform: scale(0.95);
}

.tab-item.active .tab-icon {
  transform: scale(1.1);
}

.tab-icon {
  font-size: 16px;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
  position: relative;
}

.tab-icon img {
  width: auto;
  height: 30px;
  object-fit: contain;
}

/* 双图层叠加方案 */
.tab-icon-normal,
.tab-icon-active {
  width: auto;
  height: 30px;
  object-fit: contain;
  transition: opacity 0.2s ease-in-out;
}

.tab-icon-normal {
  opacity: 1;
}

.tab-icon-normal.icon-hidden {
  opacity: 0;
}

.tab-icon-active {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: 0;
  pointer-events: none;
}

.tab-icon-active.icon-visible {
  opacity: 1;
}

/* 高亮指示器圆点 */
.tab-active-dot {
  position: absolute;
  bottom: -8px;
  left: 50%;
  transform: translateX(-50%);
  width: 4px;
  height: 4px;
  background: var(--gradient-primary);
  border-radius: 50%;
  box-shadow: 0 0 8px var(--color-primary), 0 0 12px var(--color-primary);
  animation: pulse-dot 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse-dot {
  0%, 100% {
    opacity: 1;
    transform: translateX(-50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translateX(-50%) scale(1.2);
  }
}

.tab-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
}

/* 游戏提供商列表 */
.game-providers-section {
  padding: 0 var(--spacing-lg) var(--spacing-lg);
}

.game-providers-scroll {
  display: flex;
  gap: 5px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: var(--spacing-xs) 0;
}

.game-providers-scroll::-webkit-scrollbar {
  display: none;
}

.provider-card {
  flex-shrink: 0;
  width: 128px;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-small);
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.provider-card:active {
  transform: scale(0.95);
  border-color: var(--border-active);
  box-shadow: var(--shadow-medium);
}

.provider-img {
  width: 100%;
  height: 90px;
  object-fit: cover;
  display: block;
  background: var(--bg-secondary);
}

.provider-name {
  padding: var(--spacing-sm);
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  background: var(--bg-secondary);
}

/* 游戏分类 */
.categories {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-md);
  padding: var(--spacing-lg);
  background: var(--bg-light);
  margin: 0 var(--spacing-lg) var(--spacing-lg);
  border-radius: var(--radius-lg);
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
  transition: var(--transition-normal);
}

.category-item:active {
  transform: scale(0.95);
}

.category-icon {
  width: 48px;
  height: 48px;
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  border: 1px solid var(--border-primary);
}

.category-name {
  font-size: 12px;
  color: var(--text-secondary);
}

/* 游戏区域 */
.section {
  padding: 0 var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.section-title {
  font-size: 18px;
  font-weight: bold;
  color: var(--text-primary);
}

.section-more {
  font-size: 14px;
  color: var(--color-primary);
  cursor: pointer;
}

/* Hot 标题栏翻页按钮 */
.hot-header-controls {
  display: flex;
  gap: var(--spacing-sm);
  align-items: center;
}

.hot-header-btn {
  width: 32px;
  height: 32px;
  background: var(--bg-secondary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  color: var(--color-primary);
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  line-height: 1;
  padding: 0;
}


.games-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-md);
}

.game-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  border: 1px solid var(--border-primary);
  position: relative;
  overflow: hidden;
}

.game-badge {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  background: var(--gradient-hot);
  color: var(--text-primary);
  font-size: 10px;
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--radius-sm);
  font-weight: bold;
}

.game-img {
  font-size: 48px;
  text-align: center;
  margin: var(--spacing-lg) 0;
}

.game-info {
  margin-bottom: var(--spacing-md);
}

.game-name {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.game-type {
  font-size: 12px;
  color: var(--text-secondary);
}

.btn-play {
  width: 100%;
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  border: none;
  padding: 10px;
  border-radius: var(--radius-md);
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
}

.btn-play:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-play:active {
  transform: translateY(0);
}

/* List布局样式 */
.games-list {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
}

.game-list-item {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: var(--transition-normal);
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  border: 1px solid var(--border-light);
}

.game-list-item:active {
  transform: scale(0.98);
  border-color: var(--border-active);
  box-shadow: var(--shadow-medium);
}

.list-game-image-full {
  width: 100%;
  height: auto;
  display: block;
  object-fit: cover;
}

.list-game-emoji {
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  background: var(--bg-card);
}

/* Hot Games 专属布局 */
.hot-games-scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin: 0;
  padding: 0 var(--spacing-lg);
  scroll-snap-type: x mandatory;
}

.hot-games-scroll-container::-webkit-scrollbar {
  display: none;
}

.hot-games-layout {
  display: flex;
  gap: var(--spacing-sm);
  width: fit-content;
}

.hot-video-container {
  flex-shrink: 0;
  width: calc(50vw - 20px);
  height: 280px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  scroll-snap-align: start;
}

.hot-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hot-games-grid {
  display: grid;
  grid-template-columns: repeat(7, calc(50vw - 20px));
  grid-template-rows: repeat(2, 136px);
  gap: var(--spacing-sm);
  grid-auto-flow: column;
}

.hot-game-card {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  transition: var(--transition-normal);
  cursor: pointer;
  box-shadow: var(--shadow-small);
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  scroll-snap-align: start;
}

.hot-game-card:active {
  transform: scale(0.95);
  border-color: var(--border-active);
  box-shadow: var(--shadow-medium);
}

.hot-game-card .game-badge {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  background: var(--gradient-hot);
  color: var(--text-primary);
  font-size: 10px;
  padding: 3px var(--spacing-xs);
  border-radius: var(--radius-sm);
  font-weight: bold;
  z-index: 2;
}

.hot-game-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 双视频布局 */
.dual-video-scroll-container {
  overflow-x: hidden;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin: 0;
  padding: 0 var(--spacing-lg);
  scroll-snap-type: x mandatory;
}

.dual-video-scroll-container::-webkit-scrollbar {
  display: none;
}

.dual-video-layout {
  display: flex;
  gap: var(--spacing-sm);
  width: fit-content;
}

.dual-video-item {
  flex-shrink: 0;
  width: calc(50vw - 20px);
  height: 280px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  scroll-snap-align: start;
  cursor: pointer;
  transition: var(--transition-normal);
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.dual-video-item:active {
  transform: scale(0.98);
  border-color: var(--border-active);
}

.dual-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 视频+网格布局 (Game标签) */
.video-grid-container {
  padding: 0;
}

/* Fishing 横向滚动容器 */
.fishing-scroll-container {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin: 0;
  padding: 0;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.fishing-scroll-container::-webkit-scrollbar {
  display: none;
}

.fishing-pages-wrapper {
  display: flex;
  gap: var(--spacing-md);
  width: fit-content;
}

.fishing-page {
  flex-shrink: 0;
  width: calc(100vw - 32px); /* 减去左右padding */
  scroll-snap-align: start;
}

.video-grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: var(--spacing-sm);
  height: 100%;
}

.video-grid-main {
  grid-column: 1 / 3;
  grid-row: 1 / 3;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
}

.video-grid-main-video {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.video-grid-item {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: var(--transition-normal);
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  aspect-ratio: 1;
}

.video-grid-item:active {
  transform: scale(0.95);
  border-color: var(--border-active);
}

.video-grid-item .game-badge {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  background: var(--gradient-hot);
  color: var(--text-primary);
  font-size: 10px;
  padding: 3px var(--spacing-xs);
  border-radius: var(--radius-sm);
  font-weight: bold;
  z-index: 2;
}

.video-grid-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* 纯九宫格布局(后续页) */
.pure-grid-layout {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
  gap: var(--spacing-sm);
  height: 100%;
}

.pure-grid-item {
  position: relative;
  border-radius: var(--radius-lg);
  overflow: hidden;
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  cursor: pointer;
  transition: var(--transition-normal);
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
  aspect-ratio: 1;
}

.pure-grid-item:active {
  transform: scale(0.95);
  border-color: var(--border-active);
}

.pure-grid-item .game-badge {
  position: absolute;
  top: var(--spacing-xs);
  right: var(--spacing-xs);
  background: var(--gradient-hot);
  color: var(--text-primary);
  font-size: 10px;
  padding: 3px var(--spacing-xs);
  border-radius: var(--radius-sm);
  font-weight: bold;
  z-index: 2;
}

.pure-grid-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.footer-view {
  height: 80px;
}
</style>
