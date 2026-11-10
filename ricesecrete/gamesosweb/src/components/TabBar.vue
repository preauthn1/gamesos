<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const tabs = [
  { name: '首页', path: '/', icon: '🏠' },
  { name: '赌场', path: '/casino', icon: '🎰' },
  { name: '体育', path: '/sports', icon: '⚽' },
  { name: '棋牌', path: '/cards', icon: '🎴' },
  { name: '我的', path: '/profile', icon: '👤' }
]

const navigateTo = (path) => {
  router.push(path)
}
</script>

<template>
  <div class="tabbar">
    <div
      v-for="tab in tabs"
      :key="tab.path"
      :class="['tab-item', { active: route.path === tab.path }]"
      @click="navigateTo(tab.path)"
    >
      <div class="tab-icon">{{ tab.icon }}</div>
      <div class="tab-name">{{ tab.name }}</div>
    </div>
  </div>
</template>

<style scoped>
.tabbar {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: var(--bg-card);
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 10px;
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.08);
  border-top: 1px solid var(--border-light);
  z-index: 1000;
}

.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 0;
}

.tab-icon {
  font-size: 24px;
  margin-bottom: 4px;
  transition: transform 0.3s ease;
}

.tab-name {
  font-size: 12px;
  color: var(--text-secondary);
  transition: color 0.3s ease;
}

.tab-item.active .tab-icon {
  transform: scale(1.2);
}

.tab-item.active .tab-name {
  color: var(--color-primary);
  font-weight: 600;
}

.tab-item:hover .tab-name {
  color: var(--color-primary);
}
</style>
