# 主题颜色系统使用指南

## 📁 文件说明

### 1. `theme.js` - JavaScript 主题配置
包含完整的主题颜色对象,可在 JavaScript/Vue 中导入使用。

### 2. `theme.css` - CSS 变量
包含所有颜色的 CSS 变量定义,可在任何 CSS 文件中使用。

### 3. `useTheme.js` - Composable Hook
Vue 3 Composable,提供便捷的主题访问方法。

---

## 🎨 使用方法

### 方法 1️⃣: 在 Vue 组件的 `<script>` 中使用

```vue
<script setup>
import { useTheme } from '@/composables/useTheme'

const { theme, colors, getButtonStyle } = useTheme()

// 直接使用颜色
const primaryColor = theme.primary.main // '#4ade80'
const bgColor = theme.background.main   // '#000C00'

// 使用快捷颜色
console.log(colors.primary)  // '#4ade80'
console.log(colors.success)  // '#4ade80'

// 获取按钮样式
const buttonStyle = getButtonStyle('primary', 'hover')
</script>

<template>
  <div :style="{ background: theme.background.main }">
    <button :style="buttonStyle">按钮</button>
  </div>
</template>
```

### 方法 2️⃣: 在 CSS 中使用变量

首先在 `main.js` 中导入 CSS 文件:

```javascript
// main.js
import './styles/theme.css'
```

然后在组件样式中使用:

```vue
<style scoped>
.my-component {
  background: var(--bg-main);
  color: var(--text-primary);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: var(--transition-normal);
}

.my-button {
  background: var(--gradient-primary);
  color: var(--text-primary);
  box-shadow: var(--shadow-md);
}

.my-button:hover {
  box-shadow: var(--shadow-lg);
}
</style>
```

### 方法 3️⃣: 直接导入 theme 对象

```vue
<script setup>
import theme from '@/styles/theme'

const cardStyle = {
  background: theme.background.card,
  border: `1px solid ${theme.border.light}`,
  borderRadius: theme.borderRadius.large,
}
</script>
```

---

## 📋 颜色列表

### 主色调
- `--color-primary`: #4ade80 (主绿色)
- `--color-primary-light`: #10b981 (亮绿色)
- `--color-primary-dark`: #059669 (深绿色)

### 背景色
- `--bg-main`: #000C00 (主背景)
- `--bg-dark`: #0f2419 (深色背景)
- `--bg-medium`: #1e3a28 (中等深度)
- `--bg-card`: 渐变背景

### 文字颜色
- `--text-primary`: #ffffff (主文字)
- `--text-secondary`: #8a9a8e (次要文字)
- `--text-success`: #4ade80 (强调文字)

### 边框颜色
- `--border-primary`: #2d5a3d
- `--border-light`: rgba(74, 222, 128, 0.2)
- `--border-active`: #4ade80

### 间距
- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 12px
- `--spacing-lg`: 16px
- `--spacing-xl`: 24px
- `--spacing-xxl`: 32px

### 圆角
- `--radius-sm`: 4px
- `--radius-md`: 8px
- `--radius-lg`: 12px
- `--radius-xl`: 20px

---

## 🔧 预定义样式类

在 `theme.css` 中提供了一些预定义的样式类,可以直接使用:

### 按钮类
```html
<button class="btn-primary">主要按钮</button>
<button class="btn-secondary">次要按钮</button>
<button class="btn-outline">轮廓按钮</button>
```

### 卡片类
```html
<div class="card">卡片内容</div>
```

### 文本类
```html
<p class="text-primary">主要文本</p>
<p class="text-secondary">次要文本</p>
<p class="text-success">成功文本</p>
```

---

## 🚀 最佳实践

1. **优先使用 CSS 变量**: 在样式中使用 `var(--xxx)`,性能更好
2. **JavaScript 中使用 Composable**: 在需要动态计算时使用 `useTheme()`
3. **保持一致性**: 所有新组件都应该使用主题系统中的颜色
4. **避免硬编码**: 不要直接写颜色值,始终从主题系统获取
5. **语义化命名**: 使用 `primary`、`success` 等语义化名称,而非具体颜色值

---

## 📝 示例

### 完整组件示例

```vue
<script setup>
import { useTheme } from '@/composables/useTheme'

const { theme } = useTheme()
</script>

<template>
  <div class="game-card">
    <img src="..." alt="Game" class="game-image">
    <div class="game-info">
      <h3 class="game-title">游戏标题</h3>
      <p class="game-desc">游戏描述</p>
    </div>
    <button class="play-button">开始游戏</button>
  </div>
</template>

<style scoped>
.game-card {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-lg);
  padding: var(--spacing-lg);
  transition: var(--transition-normal);
}

.game-card:hover {
  border-color: var(--border-active);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.game-title {
  color: var(--text-primary);
  font-size: 18px;
  margin-bottom: var(--spacing-sm);
}

.game-desc {
  color: var(--text-secondary);
  font-size: 14px;
}

.play-button {
  background: var(--gradient-primary);
  color: var(--text-primary);
  border: none;
  border-radius: var(--radius-md);
  padding: var(--spacing-md) var(--spacing-xl);
  transition: var(--transition-normal);
}

.play-button:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}
</style>
```
