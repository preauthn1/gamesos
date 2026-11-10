/**
 * 主题 Composable
 * 在 Vue 组件中使用主题颜色的 Hook
 */

import { theme } from '@/styles/theme.js'

/**
 * 使用主题颜色
 * @returns {Object} 主题对象
 */
export function useTheme() {
  return {
    theme,

    // 快捷访问常用颜色
    colors: {
      primary: theme.primary.main,
      success: theme.status.success,
      warning: theme.status.warning,
      error: theme.status.error,
    },

    // 获取按钮样式
    getButtonStyle(variant = 'primary', state = 'normal') {
      const buttonTheme = theme.button[variant]
      if (!buttonTheme) return {}

      switch (state) {
        case 'hover':
          return {
            background: buttonTheme.backgroundHover,
            color: buttonTheme.text,
            border: `1px solid ${buttonTheme.border}`,
          }
        case 'active':
          return {
            background: buttonTheme.backgroundActive,
            color: buttonTheme.text,
            border: `1px solid ${buttonTheme.border}`,
          }
        default:
          return {
            background: buttonTheme.background,
            color: buttonTheme.text,
            border: `1px solid ${buttonTheme.border}`,
          }
      }
    },

    // 获取阴影样式
    getShadow(size = 'medium') {
      return theme.shadow[size] || theme.shadow.medium
    },

    // 获取间距
    getSpacing(size = 'md') {
      return theme.spacing[size] || theme.spacing.md
    },

    // 获取圆角
    getBorderRadius(size = 'medium') {
      return theme.borderRadius[size] || theme.borderRadius.medium
    },
  }
}

export default useTheme
