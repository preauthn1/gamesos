<template>
  <div class="theme-selector">
    <div class="selector-header">
      <h3>主题设置</h3>
      <p>选择您喜欢的界面主题</p>
    </div>

    <div class="theme-options">
      <div
        v-for="theme in availableThemes"
        :key="theme.name"
        :class="['theme-option', { active: theme.current }]"
        @click="changeTheme(theme.name)"
      >
        <div class="theme-preview" :data-theme="theme.name">
          <div class="preview-bg"></div>
          <div class="preview-content">
            <div class="preview-dot"></div>
            <div class="preview-dot"></div>
            <div class="preview-dot"></div>
          </div>
        </div>
        <div class="theme-info">
          <div class="theme-name">{{ theme.label }}</div>
          <div v-if="theme.current" class="theme-badge">当前</div>
        </div>
        <div v-if="theme.current" class="check-icon">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useThemeStore } from '@/stores/theme.js'

const themeStore = useThemeStore()

// 获取所有可用主题
const availableThemes = computed(() => themeStore.getAvailableThemes())

// 切换主题
const changeTheme = (themeName) => {
  themeStore.setTheme(themeName)
}
</script>

<style scoped>
.theme-selector {
  width: 100%;
}

.selector-header {
  margin-bottom: var(--spacing-lg);
}

.selector-header h3 {
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
}

.selector-header p {
  font-size: 14px;
  color: var(--text-secondary);
}

.theme-options {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: var(--spacing-md);
}

.theme-option {
  position: relative;
  background: var(--bg-card);
  border: 2px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-md);
  cursor: pointer;
  transition: var(--transition-normal);
}

.theme-option:hover {
  border-color: var(--border-medium);
  transform: translateY(-2px);
}

.theme-option.active {
  border-color: var(--color-primary);
  background: var(--bg-hover);
}

.theme-preview {
  width: 100%;
  height: 80px;
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-bottom: var(--spacing-sm);
  position: relative;
}

.theme-preview[data-theme="dark"] .preview-bg {
  background: linear-gradient(135deg, #1e3a28 0%, #0f2419 100%);
}

.theme-preview[data-theme="light"] .preview-bg {
  background: linear-gradient(135deg, #ffffff 0%, #f9fafb 100%);
}

.theme-preview[data-theme="blue"] .preview-bg {
  background: linear-gradient(135deg, #334155 0%, #1e293b 100%);
}

.preview-bg {
  width: 100%;
  height: 100%;
}

.preview-content {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  gap: 6px;
}

.preview-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.theme-preview[data-theme="dark"] .preview-dot {
  background: #4ade80;
}

.theme-preview[data-theme="light"] .preview-dot {
  background: #10b981;
}

.theme-preview[data-theme="blue"] .preview-dot {
  background: #3b82f6;
}

.theme-info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
}

.theme-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.theme-badge {
  font-size: 12px;
  color: var(--color-primary);
  background: var(--bg-hover);
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}

.check-icon {
  position: absolute;
  top: var(--spacing-sm);
  right: var(--spacing-sm);
  width: 24px;
  height: 24px;
  background: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

/* 响应式 */
@media (min-width: 768px) {
  .theme-options {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
