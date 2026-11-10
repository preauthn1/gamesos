import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { themes, defaultTheme } from '@/styles/themes.js'

export const useThemeStore = defineStore('theme', () => {
  // 当前主题名称
  const currentTheme = ref(defaultTheme)

  // 当前主题配置
  const themeConfig = ref(themes[defaultTheme])

  // 初始化: 从 localStorage 恢复主题设置
  const initTheme = () => {
    try {
      const savedTheme = localStorage.getItem('theme')
      if (savedTheme && themes[savedTheme]) {
        currentTheme.value = savedTheme
        themeConfig.value = themes[savedTheme]
      }
      // 应用主题到DOM
      applyTheme()
    } catch (error) {
      console.error('恢复主题设置失败:', error)
    }
  }

  // 切换主题
  const setTheme = (themeName) => {
    if (!themes[themeName]) {
      console.error(`主题 "${themeName}" 不存在`)
      return
    }

    currentTheme.value = themeName
    themeConfig.value = themes[themeName]

    // 保存到 localStorage
    try {
      localStorage.setItem('theme', themeName)
    } catch (error) {
      console.error('保存主题设置失败:', error)
    }

    // 应用主题
    applyTheme()
  }

  // 应用主题到 DOM (设置 CSS 变量)
  const applyTheme = () => {
    const root = document.documentElement
    const theme = themeConfig.value

    // 主色调
    root.style.setProperty('--color-primary', theme.primary.main)
    root.style.setProperty('--color-primary-light', theme.primary.light)
    root.style.setProperty('--color-primary-dark', theme.primary.dark)
    root.style.setProperty('--gradient-primary', theme.primary.gradient)

    // 强调色
    root.style.setProperty('--color-accent', theme.accent.main)
    root.style.setProperty('--color-accent-light', theme.accent.light)
    root.style.setProperty('--color-accent-dark', theme.accent.dark)
    root.style.setProperty('--gradient-accent', theme.accent.gradient)
    root.style.setProperty('--shadow-accent', theme.accent.shadow)

    // 背景色
    root.style.setProperty('--bg-primary', theme.background.primary)
    root.style.setProperty('--bg-secondary', theme.background.secondary)
    root.style.setProperty('--bg-card', theme.background.card)
    root.style.setProperty('--bg-hover', theme.background.hover)
    root.style.setProperty('--bg-active', theme.background.active)
    root.style.setProperty('--bg-overlay', theme.background.overlay)

    // 文字颜色
    root.style.setProperty('--text-primary', theme.text.primary)
    root.style.setProperty('--text-secondary', theme.text.secondary)
    root.style.setProperty('--text-tertiary', theme.text.tertiary)
    root.style.setProperty('--text-success', theme.text.success)
    root.style.setProperty('--text-disabled', theme.text.disabled)
    root.style.setProperty('--text-on-primary', theme.text.onPrimary)

    // 边框
    root.style.setProperty('--border-primary', theme.border.primary)
    root.style.setProperty('--border-light', theme.border.light)
    root.style.setProperty('--border-medium', theme.border.medium)
    root.style.setProperty('--border-active', theme.border.active)

    // 状态颜色
    root.style.setProperty('--color-success', theme.status.success)
    root.style.setProperty('--color-warning', theme.status.warning)
    root.style.setProperty('--color-error', theme.status.error)
    root.style.setProperty('--color-danger', theme.status.danger)
    root.style.setProperty('--color-info', theme.status.info)

    // 阴影
    root.style.setProperty('--shadow-sm', theme.shadow.small)
    root.style.setProperty('--shadow-md', theme.shadow.medium)
    root.style.setProperty('--shadow-lg', theme.shadow.large)

    // 体育模块专用
    root.style.setProperty('--bg-sports-main', theme.sports.bgMain)
    root.style.setProperty('--bg-sports-header', theme.sports.bgHeader)
    root.style.setProperty('--bg-sports-card', theme.sports.bgCard)
    root.style.setProperty('--bg-sports-dark', theme.sports.bgDark)
    root.style.setProperty('--bg-sports-light', theme.sports.bgLight)
    root.style.setProperty('--text-light', theme.sports.textLight)
    root.style.setProperty('--text-muted', theme.sports.textMuted)
    root.style.setProperty('--border-subtle', theme.sports.borderSubtle)
    root.style.setProperty('--border-faint', theme.sports.borderFaint)

    // 设置 data-theme 属性 (可用于特殊样式)
    root.setAttribute('data-theme', currentTheme.value)
  }

  // 获取所有可用主题
  const getAvailableThemes = () => {
    return Object.keys(themes).map(key => ({
      name: key,
      label: themes[key].label,
      current: currentTheme.value === key,
    }))
  }

  // 监听主题变化
  watch(currentTheme, () => {
    applyTheme()
  })

  return {
    currentTheme,
    themeConfig,
    initTheme,
    setTheme,
    applyTheme,
    getAvailableThemes,
  }
})
