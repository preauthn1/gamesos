<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import ThemeSelector from '@/components/ThemeSelector.vue'
import { useUserStore } from '@/stores/user.js'
import { logout } from '@/api/user.js'

const router = useRouter()
const userStore = useUserStore()
const isLoggingOut = ref(false)

// 从 store 获取用户信息
const userInfo = computed(() => userStore.userInfo)
const isLoggedIn = computed(() => userStore.isLoggedIn)

// 默认显示的用户信息（未登录时）
const displayInfo = computed(() => ({
  username: userInfo.value?.user_name || userInfo.value?.username || '游客用户',
  avatar: userInfo.value?.avatar || '👤',
  vipLevel: userInfo.value?.vip_level || userInfo.value?.vipLevel || 0,
  balance: userInfo.value?.user_money || userInfo.value?.balance || 0
}))

const menuItems = [
  { icon: '💰', name: '我的钱包', path: '/wallet' },
  { icon: '📝', name: '投注记录', path: '/bets' },
  { icon: '🎁', name: '优惠活动', path: '/promotions' },
  { icon: '⚙️', name: '设置', path: '/settings' },
  { icon: '📞', name: '客服中心', path: '/support' },
  { icon: '❓', name: '帮助中心', path: '/help' }
]

// 组件挂载时获取最新用户信息
onMounted(async () => {
  if (isLoggedIn.value) {
    try {
      await userStore.fetchUserInfo()
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }
  }
})

// 退出登录
const handleLogout = async () => {
  if (isLoggingOut.value) return

  try {
    isLoggingOut.value = true
    // 调用后端登出接口
    await logout()
  } catch (error) {
    console.error('登出接口调用失败:', error)
    // 即使接口失败也继续清除本地信息
  } finally {
    isLoggingOut.value = false
  }

  // 清除本地用户信息并重连 websocket
  userStore.clearUserInfo()
  router.push('/')
}
</script>

<template>
  <div class="profile-view">
    <div class="header">
      <div class="user-card">
        <div class="avatar">{{ displayInfo.avatar }}</div>
        <div class="user-info">
          <div class="username">{{ displayInfo.username }}</div>
          <div class="vip-level">VIP {{ displayInfo.vipLevel }}</div>
        </div>
      </div>

      <div class="balance-card">
        <div class="balance-label">账户余额</div>
        <div class="balance-amount">{{ displayInfo.balance }}</div>
        <div class="balance-actions">
          <button class="btn-deposit">充值</button>
          <button class="btn-withdraw">提现</button>
        </div>
      </div>
    </div>

    <div class="menu-section">
      <div class="menu-item" v-for="item in menuItems" :key="item.name">
        <div class="menu-icon">{{ item.icon }}</div>
        <div class="menu-name">{{ item.name }}</div>
        <div class="menu-arrow">→</div>
      </div>
    </div>

    <!-- 主题设置卡片 -->
    <div class="theme-section">
      <div class="section-header">
        <span class="section-icon">🎨</span>
        <span class="section-title">外观设置</span>
      </div>
      <ThemeSelector />
    </div>

    <button v-if="isLoggedIn" class="btn-logout" :disabled="isLoggingOut" @click="handleLogout">
      {{ isLoggingOut ? '退出中...' : '退出登录' }}
    </button>
  </div>
</template>

<style scoped>
.profile-view {
  background: var(--bg-primary);
  min-height: 100vh;
  padding-bottom: 80px;
}

.header {
  padding: var(--spacing-lg) var(--spacing-md);
}

.user-card {
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
}

.avatar {
  width: 64px;
  height: 64px;
  background: var(--bg-card);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  border: 2px solid var(--color-primary);
}

.user-info {
  flex: 1;
}

.username {
  font-size: 20px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.vip-level {
  font-size: 14px;
  color: #ffd700;
  background: linear-gradient(135deg, #854d0e 0%, #a16207 100%);
  padding: 4px 12px;
  border-radius: var(--radius-lg);
  display: inline-block;
}

.balance-card {
  background: var(--bg-card);
  border-radius: var(--radius-xl);
  padding: var(--spacing-lg);
  border: 1px solid var(--border-light);
  text-align: center;
}

.balance-label {
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
}

.balance-amount {
  font-size: 32px;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: var(--spacing-md);
  text-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
}

.balance-actions {
  display: flex;
  gap: 10px;
  justify-content: center;
}

.btn-deposit,
.btn-withdraw {
  flex: 1;
  padding: 10px 24px;
  border-radius: 24px;
  border: none;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
}

.btn-deposit {
  background: var(--gradient-primary);
  color: white;
}

.btn-withdraw {
  background: transparent;
  border: 1px solid var(--color-primary);
  color: var(--color-primary);
}

.menu-section {
  background: var(--bg-card);
  margin: 0 var(--spacing-md) var(--spacing-lg);
  border-radius: var(--radius-lg);
  overflow: hidden;
  border: 1px solid var(--border-light);
}

.menu-item {
  display: flex;
  align-items: center;
  padding: var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
  cursor: pointer;
  transition: var(--transition-normal);
}

.menu-item:last-child {
  border-bottom: none;
}

.menu-item:active {
  background: var(--bg-hover);
}

.menu-icon {
  font-size: 24px;
  margin-right: var(--spacing-md);
}

.menu-name {
  flex: 1;
  font-size: 16px;
  color: var(--text-primary);
}

.menu-arrow {
  font-size: 18px;
  color: var(--text-secondary);
}

.btn-logout {
  width: calc(100% - 32px);
  margin: 0 var(--spacing-md);
  background: transparent;
  border: 1px solid var(--color-error);
  color: var(--color-error);
  padding: 14px;
  border-radius: 24px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
}

.btn-logout:active:not(:disabled) {
  background: rgba(239, 68, 68, 0.1);
}

.btn-logout:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 主题设置区域 */
.theme-section {
  background: var(--bg-card);
  margin: 0 16px 20px;
  padding: var(--spacing-lg);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-light);
}

.section-header {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
}

.section-icon {
  font-size: 24px;
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}
</style>
