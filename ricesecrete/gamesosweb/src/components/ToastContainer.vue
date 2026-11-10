<template>
  <Teleport to="body">
    <div class="toast-container">
      <TransitionGroup name="toast">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :class="['toast-item', `toast-${toast.type}`]"
        >
          <span class="toast-icon">{{ getIcon(toast.type) }}</span>
          <span class="toast-message">{{ toast.message }}</span>
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup>
import { toasts } from '@/composables/useToast.js'

const getIcon = (type) => {
  const icons = {
    success: '✓',
    error: '✕',
    warning: '⚠',
    info: 'ℹ'
  }
  return icons[type] || icons.info
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: calc(env(safe-area-inset-top, 0px) + 70px);
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-sm);
  pointer-events: none;
}

.toast-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-lg);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  box-shadow: var(--shadow-lg);
  font-size: 14px;
  color: var(--text-primary);
  pointer-events: auto;
  max-width: 90vw;
}

.toast-icon {
  font-size: 16px;
  font-weight: bold;
}

.toast-message {
  flex: 1;
  word-break: break-word;
}

/* 类型样式 */
.toast-success {
  border-color: var(--color-primary);
}
.toast-success .toast-icon {
  color: var(--color-primary);
}

.toast-error {
  border-color: #ef4444;
}
.toast-error .toast-icon {
  color: #ef4444;
}

.toast-warning {
  border-color: #f59e0b;
}
.toast-warning .toast-icon {
  color: #f59e0b;
}

.toast-info {
  border-color: #3b82f6;
}
.toast-info .toast-icon {
  color: #3b82f6;
}

/* 动画 */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(-20px);
}

.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.9);
}
</style>
