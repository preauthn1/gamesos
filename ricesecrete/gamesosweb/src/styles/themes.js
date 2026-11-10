/**
 * 主题配置文件 - 支持多主题切换
 */

// 深色主题 (当前默认)
export const darkTheme = {
  name: 'dark',
  label: '深色主题',

  // 主色调
  primary: {
    main: '#4ade80',
    light: '#10b981',
    dark: '#059669',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },

  // 强调色
  accent: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    shadow: '0 0 12px rgba(245, 158, 11, 0.3)',
  },

  // 背景色
  background: {
    primary: '#000C00',      // 主背景
    secondary: '#0f2419',    // 次要背景
    card: '#0f2419',         // 卡片背景
    hover: 'rgba(74, 222, 128, 0.1)',
    active: 'rgba(74, 222, 128, 0.15)',
    overlay: 'rgba(10, 26, 15, 0.95)',
  },

  // 文字颜色
  text: {
    primary: '#ffffff',
    secondary: '#8a9a8e',
    tertiary: '#6b7b6f',
    success: '#4ade80',
    disabled: 'rgba(255, 255, 255, 0.5)',
    onPrimary: '#ffffff',  // 用于主色调背景上的文字
  },

  // 边框
  border: {
    primary: '#2d5a3d',
    light: 'rgba(74, 222, 128, 0.2)',
    medium: 'rgba(74, 222, 128, 0.5)',
    active: '#4ade80',
  },

  // 状态颜色
  status: {
    success: '#4ade80',
    warning: '#fbbf24',
    error: '#ef4444',
    danger: '#ef4444',
    info: '#3b82f6',
  },

  // 阴影
  shadow: {
    small: '0 1px 4px rgba(16, 185, 129, 0.3)',
    medium: '0 2px 8px rgba(16, 185, 129, 0.4)',
    large: '0 4px 12px rgba(74, 222, 128, 0.4)',
  },

  // 体育模块专用
  sports: {
    bgMain: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 100%)',
    bgHeader: '#1a1a2e',
    bgCard: '#1e293b',
    bgDark: 'rgba(0, 0, 0, 0.3)',
    bgLight: 'rgba(0, 0, 0, 0.2)',
    textLight: '#9ca3af',
    textMuted: '#6b7280',
    borderSubtle: 'rgba(255, 255, 255, 0.1)',
    borderFaint: 'rgba(255, 255, 255, 0.05)',
  },
}

// 浅色主题
export const lightTheme = {
  name: 'light',
  label: '浅色主题',

  // 主色调
  primary: {
    main: '#10b981',
    light: '#34d399',
    dark: '#059669',
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  },

  // 强调色
  accent: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    shadow: '0 0 12px rgba(245, 158, 11, 0.3)',
  },

  // 背景色 - 优化层次感
  background: {
    primary: '#f3f4f6',      // 主背景 - 浅灰色,更舒适
    secondary: '#e5e7eb',    // 次要背景 - 中灰
    card: '#ffffff',         // 卡片背景 - 白色,形成对比
    hover: 'rgba(16, 185, 129, 0.08)',
    active: 'rgba(16, 185, 129, 0.12)',
    overlay: 'rgba(255, 255, 255, 0.95)',
  },

  // 文字颜色
  text: {
    primary: '#111827',      // 深灰黑
    secondary: '#6b7280',    // 中灰
    tertiary: '#9ca3af',     // 浅灰
    success: '#10b981',
    disabled: 'rgba(0, 0, 0, 0.3)',
    onPrimary: '#ffffff',    // 用于主色调背景上的文字
  },

  // 边框 - 增强边框可见度
  border: {
    primary: '#d1d5db',      // 更明显的边框
    light: 'rgba(16, 185, 129, 0.15)',
    medium: 'rgba(16, 185, 129, 0.35)',
    active: '#10b981',
  },

  // 状态颜色
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    danger: '#ef4444',
    info: '#3b82f6',
  },

  // 阴影 - 增强阴影效果
  shadow: {
    small: '0 1px 3px rgba(0, 0, 0, 0.08)',
    medium: '0 2px 8px rgba(0, 0, 0, 0.08)',
    large: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },

  // 体育模块专用 - 浅色主题
  sports: {
    bgMain: 'linear-gradient(180deg, #f8fafc 0%, #e2e8f0 100%)',
    bgHeader: '#f1f5f9',
    bgCard: '#ffffff',
    bgDark: 'rgba(0, 0, 0, 0.05)',
    bgLight: 'rgba(0, 0, 0, 0.03)',
    textLight: '#475569',
    textMuted: '#64748b',
    borderSubtle: 'rgba(0, 0, 0, 0.1)',
    borderFaint: 'rgba(0, 0, 0, 0.05)',
  },
}

// 蓝色主题
export const blueTheme = {
  name: 'blue',
  label: '蓝色主题',

  // 主色调
  primary: {
    main: '#3b82f6',
    light: '#60a5fa',
    dark: '#2563eb',
    gradient: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
  },

  // 强调色
  accent: {
    main: '#f59e0b',
    light: '#fbbf24',
    dark: '#d97706',
    gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    shadow: '0 0 12px rgba(245, 158, 11, 0.3)',
  },

  // 背景色
  background: {
    primary: '#0f172a',      // 深蓝黑
    secondary: '#1e293b',    // 深蓝灰
    card: '#334155',         // 蓝灰
    hover: 'rgba(59, 130, 246, 0.1)',
    active: 'rgba(59, 130, 246, 0.15)',
    overlay: 'rgba(15, 23, 42, 0.95)',
  },

  // 文字颜色
  text: {
    primary: '#ffffff',
    secondary: '#94a3b8',
    tertiary: '#64748b',
    success: '#3b82f6',
    disabled: 'rgba(255, 255, 255, 0.5)',
    onPrimary: '#ffffff',    // 用于主色调背景上的文字
  },

  // 边框
  border: {
    primary: '#475569',
    light: 'rgba(59, 130, 246, 0.2)',
    medium: 'rgba(59, 130, 246, 0.5)',
    active: '#3b82f6',
  },

  // 状态颜色
  status: {
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    danger: '#ef4444',
    info: '#3b82f6',
  },

  // 阴影
  shadow: {
    small: '0 1px 4px rgba(59, 130, 246, 0.3)',
    medium: '0 2px 8px rgba(59, 130, 246, 0.4)',
    large: '0 4px 12px rgba(59, 130, 246, 0.4)',
  },

  // 体育模块专用 - 蓝色主题
  sports: {
    bgMain: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
    bgHeader: '#0f172a',
    bgCard: '#1e3a5f',
    bgDark: 'rgba(0, 0, 0, 0.3)',
    bgLight: 'rgba(0, 0, 0, 0.2)',
    textLight: '#94a3b8',
    textMuted: '#64748b',
    borderSubtle: 'rgba(59, 130, 246, 0.2)',
    borderFaint: 'rgba(59, 130, 246, 0.1)',
  },
}

// 主题列表
export const themes = {
  dark: darkTheme,
  light: lightTheme,
  blue: blueTheme,
}

// 默认主题
export const defaultTheme = 'dark'

// 公共配置 (所有主题共享)
export const commonConfig = {
  // 间距
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    xxl: '32px',
  },

  // 圆角
  borderRadius: {
    small: '4px',
    medium: '8px',
    large: '12px',
    xl: '20px',
    circle: '50%',
  },

  // 过渡动画
  transition: {
    fast: 'all 0.15s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.5s ease',
  },

  // 透明度
  opacity: {
    disabled: 0.5,
    hover: 0.8,
    active: 0.6,
  },
}

export default themes
