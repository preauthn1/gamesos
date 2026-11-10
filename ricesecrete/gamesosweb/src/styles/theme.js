/**
 * 主题颜色配置文件
 * 统一管理整个项目的颜色值
 */

export const theme = {
  // 主色调 - 绿色系
  primary: {
    main: '#4ade80',        // 主绿色
    light: '#10b981',       // 亮绿色
    dark: '#059669',        // 深绿色
    gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', // 主渐变
  },

  // 背景色
  background: {
    main: '#000C00',        // 主背景 - 深黑绿
    card: 'linear-gradient(135deg, #1e3a28 0%, #0f2419 100%)', // 卡片渐变背景
    cardAlt: 'linear-gradient(135deg, #30, 58, 40, 0.8) 0%, rgba(15, 36, 25, 0.8) 100%)', // 备用卡片背景
    overlay: 'rgba(10, 26, 15, 0.95)', // 遮罩背景
    dark: '#0f2419',        // 深色背景
    medium: '#1e3a28',      // 中等深度背景
    light: 'rgba(15, 36, 25, 0.5)', // 浅色背景
  },

  // 文字颜色
  text: {
    primary: '#ffffff',     // 主文字 - 白色
    secondary: '#8a9a8e',   // 次要文字 - 灰绿色
    success: '#4ade80',     // 成功/强调文字 - 绿色
    disabled: 'rgba(255, 255, 255, 0.5)', // 禁用文字
  },

  // 边框颜色
  border: {
    primary: '#2d5a3d',     // 主边框
    light: 'rgba(74, 222, 128, 0.2)', // 浅色边框
    medium: 'rgba(74, 222, 128, 0.5)', // 中等边框
    active: '#4ade80',      // 激活边框
  },

  // 状态颜色
  status: {
    hot: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)', // HOT 标签
    new: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',  // NEW 标签
    success: '#4ade80',     // 成功状态
    warning: '#fbbf24',     // 警告状态
    error: '#ef4444',       // 错误状态
    info: '#3b82f6',        // 信息状态
  },

  // 按钮颜色
  button: {
    primary: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      backgroundHover: 'rgba(16, 185, 129, 0.9)',
      backgroundActive: 'rgba(16, 185, 129, 0.8)',
      text: '#ffffff',
      border: '#10b981',
    },
    secondary: {
      background: 'rgba(74, 222, 128, 0.2)',
      backgroundHover: 'rgba(74, 222, 128, 0.3)',
      backgroundActive: 'rgba(74, 222, 128, 0.4)',
      text: '#4ade80',
      border: 'rgba(74, 222, 128, 0.5)',
    },
    outline: {
      background: 'transparent',
      backgroundHover: 'rgba(74, 222, 128, 0.1)',
      backgroundActive: 'rgba(74, 222, 128, 0.2)',
      text: '#4ade80',
      border: '#4ade80',
    },
    ghost: {
      background: 'transparent',
      backgroundHover: 'rgba(74, 222, 128, 0.1)',
      backgroundActive: 'rgba(74, 222, 128, 0.15)',
      text: '#4ade80',
      border: 'transparent',
    },
  },

  // 阴影
  shadow: {
    small: '0 1px 4px rgba(16, 185, 129, 0.3)',
    medium: '0 2px 8px rgba(16, 185, 129, 0.4)',
    large: '0 4px 12px rgba(74, 222, 128, 0.4)',
    glow: '0 0 10px rgba(74, 222, 128, 0.5)',
    glowStrong: '0 0 10px rgba(74, 222, 128, 0.3)',
  },

  // 透明度
  opacity: {
    disabled: 0.5,
    hover: 0.8,
    active: 0.6,
  },

  // 间距 (可选)
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
}

// 导出 CSS 变量版本（用于 CSS 文件）
export const cssVariables = `
:root {
  /* 主色调 */
  --color-primary: #4ade80;
  --color-primary-light: #10b981;
  --color-primary-dark: #059669;

  /* 背景色 */
  --bg-main: #000C00;
  --bg-dark: #0f2419;
  --bg-medium: #1e3a28;
  --bg-overlay: rgba(10, 26, 15, 0.95);

  /* 文字颜色 */
  --text-primary: #ffffff;
  --text-secondary: #8a9a8e;
  --text-success: #4ade80;

  /* 边框颜色 */
  --border-primary: #2d5a3d;
  --border-light: rgba(74, 222, 128, 0.2);
  --border-active: #4ade80;

  /* 间距 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 12px;
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  --spacing-xxl: 32px;

  /* 圆角 */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-xl: 20px;

  /* 过渡 */
  --transition-fast: all 0.15s ease;
  --transition-normal: all 0.3s ease;
  --transition-slow: all 0.5s ease;
}
`

export default theme
