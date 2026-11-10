
= 迁移现有组件到主题系统

本文档展示如何将现有组件的硬编码颜色值迁移到主题系统。

## 🔄 迁移步骤

### 步骤 1: 识别硬编码的颜色值

在现有组件中找到所有硬编码的颜色值,例如:
```css
/* ❌ 硬编码方式 */
background: #000C00;
color: #4ade80;
border: 1px solid rgba(74, 222, 128, 0.2);
```

### 步骤 2: 替换为主题变量

```css
/* ✅ 使用主题变量 */
background: var(--bg-main);
color: var(--color-primary);
border: 1px solid var(--border-light);
```

---

## 📝 HomeView.vue 迁移示例

### 原始代码 (硬编码)

```css
.home {
  background: #000C00;
  min-height: 100vh;
  padding-bottom: 80px;
}

.header {
  padding: 16px;
  background: rgba(10, 26, 15, 0.95);
  position: sticky;
  top: 0;
  z-index: 100;
}

.btn-login {
  background: transparent;
  border: 1px solid #4ade80;
  color: #4ade80;
  padding: 8px 20px;
  border-radius: 20px;
}
```

### 迁移后代码 (使用主题)

```css
.home {
  background: var(--bg-main);
  min-height: 100vh;
  padding-bottom: var(--spacing-xxl);
}

.header {
  padding: var(--spacing-lg);
  background: var(--bg-overlay);
  position: sticky;
  top: 0;
  z-index: 100;
}

.btn-login {
  background: transparent;
  border: 1px solid var(--border-active);
  color: var(--color-primary);
  padding: var(--spacing-sm) var(--spacing-xl);
  border-radius: var(--radius-xl);
}
```

---

## 📋 完整替换对照表

### 背景色替换

| 原始值 | 主题变量 | 说明 |
|--------|---------|------|
| `#000C00` | `var(--bg-main)` | 主背景色 |
| `#0f2419` | `var(--bg-dark)` | 深色背景 |
| `#1e3a28` | `var(--bg-medium)` | 中等深度背景 |
| `rgba(10, 26, 15, 0.95)` | `var(--bg-overlay)` | 遮罩背景 |
| `linear-gradient(135deg, #1e3a28 0%, #0f2419 100%)` | `var(--bg-card)` | 卡片渐变背景 |
| `rgba(15, 36, 25, 0.5)` | `var(--bg-light)` | 浅色背景 |

### 文字颜色替换

| 原始值 | 主题变量 | 说明 |
|--------|---------|------|
| `#ffffff` | `var(--text-primary)` | 主文字颜色 |
| `#8a9a8e` | `var(--text-secondary)` | 次要文字颜色 |
| `#4ade80` | `var(--text-success)` | 强调/成功文字 |

### 边框颜色替换

| 原始值 | 主题变量 | 说明 |
|--------|---------|------|
| `#2d5a3d` | `var(--border-primary)` | 主边框 |
| `rgba(74, 222, 128, 0.2)` | `var(--border-light)` | 浅色边框 |
| `rgba(74, 222, 128, 0.5)` | `var(--border-medium)` | 中等边框 |
| `#4ade80` | `var(--border-active)` | 激活状态边框 |

### 主题色替换

| 原始值 | 主题变量 | 说明 |
|--------|---------|------|
| `#4ade80` | `var(--color-primary)` | 主绿色 |
| `#10b981` | `var(--color-primary-light)` | 亮绿色 |
| `#059669` | `var(--color-primary-dark)` | 深绿色 |

### 渐变替换

| 原始值 | 主题变量 | 说明 |
|--------|---------|------|
| `linear-gradient(135deg, #10b981 0%, #059669 100%)` | `var(--gradient-primary)` | 主渐变 |
| `linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)` | `var(--gradient-hot)` | HOT标签渐变 |

### 阴影替换

| 原始值 | 主题变量 | 说明 |
|--------|---------|------|
| `0 1px 4px rgba(16, 185, 129, 0.3)` | `var(--shadow-sm)` | 小阴影 |
| `0 2px 8px rgba(16, 185, 129, 0.4)` | `var(--shadow-md)` | 中等阴影 |
| `0 4px 12px rgba(74, 222, 128, 0.4)` | `var(--shadow-lg)` | 大阴影 |
| `0 0 10px rgba(74, 222, 128, 0.5)` | `var(--shadow-glow)` | 发光效果 |

### 间距替换

| 原始值 | 主题变量 |
|--------|---------|
| `4px` | `var(--spacing-xs)` |
| `8px` | `var(--spacing-sm)` |
| `12px` | `var(--spacing-md)` |
| `16px` | `var(--spacing-lg)` |
| `24px` | `var(--spacing-xl)` |
| `32px` | `var(--spacing-xxl)` |

### 圆角替换

| 原始值 | 主题变量 |
|--------|---------|
| `4px` | `var(--radius-sm)` |
| `8px` | `var(--radius-md)` |
| `12px` | `var(--radius-lg)` |
| `20px` | `var(--radius-xl)` |
| `50%` | `var(--radius-circle)` |

### 过渡动画替换

| 原始值 | 主题变量 |
|--------|---------|
| `all 0.15s ease` | `var(--transition-fast)` |
| `all 0.3s ease` | `var(--transition-normal)` |
| `all 0.5s ease` | `var(--transition-slow)` |

---

## 🛠️ 批量替换工具

可以使用 VSCode 的查找替换功能(Ctrl+H)进行批量替换:

### 示例替换规则

1. 背景色:
   - 查找: `background: #000C00`
   - 替换: `background: var(--bg-main)`

2. 主题色:
   - 查找: `#4ade80`
   - 替换: `var(--color-primary)`

3. 间距:
   - 查找: `padding: 16px`
   - 替换: `padding: var(--spacing-lg)`

---

## ✅ 迁移检查清单

- [ ] 所有硬编码颜色值已替换为主题变量
- [ ] 所有固定间距值已替换为主题变量
- [ ] 所有圆角值已替换为主题变量
- [ ] 所有过渡动画已替换为主题变量
- [ ] 所有阴影效果已替换为主题变量
- [ ] 测试所有组件样式是否正常显示
- [ ] 测试响应式布局是否正常工作
- [ ] 测试悬停和激活状态样式

---

## 🎯 最佳实践

1. **渐进式迁移**: 不需要一次性全部替换,可以逐个组件迁移
2. **测试为先**: 每次迁移后都要测试组件功能
3. **保持语义化**: 使用语义化的变量名(如 `--border-light` 而非 `--color-green-20`)
4. **文档更新**: 迁移完成后更新组件文档
5. **代码审查**: 迁移代码需要团队审查确保质量

---

## 📚 相关文档

- [主题系统使用指南](./README.md)
- [theme.js API 文档](./theme.js)
- [useTheme Composable 文档](../composables/useTheme.js)
