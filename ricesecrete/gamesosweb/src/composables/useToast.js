import { ref } from 'vue'

// Toast 状态（模块级单例）
const toastList = ref([])
let toastId = 0

/**
 * 显示 Toast 提示
 * @param {string} message - 提示消息
 * @param {object} options - 配置选项
 * @param {string} options.type - 类型: 'success' | 'error' | 'warning' | 'info'
 * @param {number} options.duration - 显示时长(ms)，默认 3000
 */
const showToast = (message, options = {}) => {
  const { type = 'info', duration = 3000 } = options
  const id = ++toastId

  toastList.value.push({
    id,
    message,
    type,
    visible: true
  })

  // 自动移除
  if (duration > 0) {
    setTimeout(() => {
      removeToast(id)
    }, duration)
  }

  return id
}

/**
 * 移除 Toast
 * @param {number} id - Toast ID
 */
const removeToast = (id) => {
  const index = toastList.value.findIndex(t => t.id === id)
  if (index > -1) {
    toastList.value.splice(index, 1)
  }
}

// 便捷方法
const success = (message, duration = 3000) => showToast(message, { type: 'success', duration })
const error = (message, duration = 3000) => showToast(message, { type: 'error', duration })
const warning = (message, duration = 3000) => showToast(message, { type: 'warning', duration })
const info = (message, duration = 3000) => showToast(message, { type: 'info', duration })

/**
 * Toast composable
 * 用于替代 alert()，提供更好的用户体验
 */
export function useToast() {
  return {
    toasts: toastList,
    showToast,
    removeToast,
    success,
    error,
    warning,
    info
  }
}

// 导出单例，方便全局使用
export const toast = {
  success,
  error,
  warning,
  info,
  show: showToast
}

// 导出 toasts 供 ToastContainer 使用
export const toasts = toastList
