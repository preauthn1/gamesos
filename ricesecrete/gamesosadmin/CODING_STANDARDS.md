# GameOS 管理后台 - 代码规范与风格指南

## 📋 概述

本文档定义了 GameOS 管理后台项目的代码规范、风格约定和最佳实践。所有开发人员必须遵守这些规范以确保代码的一致性、可维护性和可读性。

## 🛠️ 技术栈

- **框架**: Vue 3 + TypeScript + Vite
- **UI 库**: Element Plus
- **状态管理**: Pinia
- **路由**: Vue Router 4
- **HTTP 客户端**: Axios
- **CSS 框架**: UnoCSS + SCSS
- **代码质量工具**: ESLint + Prettier + Stylelint + Husky

## 📁 项目结构

```
src/
├── api/              # API 接口定义
├── assets/           # 静态资源
├── components/       # 公共组件
│   ├── Game/        # 游戏相关组件
│   ├── Upload/      # 上传组件
│   └── ...
├── directive/        # 自定义指令
├── enums/           # 枚举类型
├── lang/            # 国际化
├── layout/          # 布局组件
├── plugins/         # 插件配置
├── router/          # 路由配置
├── store/           # 状态管理 (Pinia)
├── styles/          # 全局样式
├── types/           # TypeScript 类型定义
├── utils/           # 工具函数
└── views/           # 页面组件
```

## 🎨 代码风格规范

### 1. 命名约定

#### 文件命名
- **组件文件**: 使用 PascalCase，如 `UserProfile.vue`
- **工具函数**: 使用 camelCase，如 `formatDate.ts`
- **类型定义**: 使用 PascalCase，如 `UserTypes.ts`
- **常量文件**: 使用 UPPER_SNAKE_CASE，如 `API_CONSTANTS.ts`

#### 变量命名
- **变量/函数**: camelCase，如 `userName`, `getUserInfo()`
- **常量**: UPPER_SNAKE_CASE，如 `API_BASE_URL`
- **类/类型**: PascalCase，如 `UserService`, `IUserData`
- **私有成员**: 前缀 `_`，如 `_privateMethod()`

#### 组件命名
```vue
<!-- 单文件组件 -->
<script setup lang="ts">
// 组件名使用 PascalCase
defineOptions({
  name: 'UserProfile',
});
</script>
```

### 2. Vue 组件规范

#### 组件结构顺序
```vue
<template>
  <!-- 1. Template -->
</template>

<script setup lang="ts">
// 2. Script Setup (TypeScript)
</script>

<style scoped lang="scss">
// 3. Scoped Styles (SCSS)
</style>
```

#### Props 定义
```typescript
// 使用 TypeScript 接口定义 Props
interface Props {
  // 必需属性
  userId: {
    type: Number,
    required: true,
  },
  // 可选属性
  userName?: {
    type: String,
    default: 'Guest',
  },
  // 复杂类型
  userData: {
    type: Object as PropType<UserData>,
    default: () => ({}),
  },
}

defineProps<Props>();
```

#### Emits 定义
```typescript
// 使用 TypeScript 定义 Emits
interface Emits {
  (e: 'update:modelValue', value: string): void;
  (e: 'submit', payload: SubmitData): void;
}

const emit = defineEmits<Emits>();
```

### 3. TypeScript 规范

#### 类型定义
```typescript
// 使用接口定义对象类型
interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

// 使用类型别名定义联合类型
type UserRole = 'admin' | 'user' | 'guest';

// 使用枚举定义常量集合
enum ApiStatus {
  Loading = 'loading',
  Success = 'success',
  Error = 'error',
}
```

#### 函数定义
```typescript
// 明确指定参数和返回值类型
function getUserById(id: number): Promise<User> {
  // 函数实现
}

// 使用箭头函数时也指定类型
const formatDate = (date: Date): string => {
  // 函数实现
};
```

### 4. CSS/SCSS 规范

#### 类名命名 (BEM 风格)
```scss
// Block
.user-profile {
  // Element
  &__avatar {
    // Modifier
    &--large {
      width: 100px;
    }
  }
  
  &__info {
    // State
    &.is-active {
      color: green;
    }
  }
}
```

#### 样式顺序
1. 定位属性 (position, top, left, z-index)
2. 盒模型属性 (display, width, height, margin, padding)
3. 文本属性 (font, color, text-align)
4. 视觉属性 (background, border, box-shadow)
5. 动画属性 (transition, animation)

### 5. API 调用规范

#### 服务层封装
```typescript
// api/user.ts
import request from '@/utils/request';

export interface UserParams {
  page: number;
  size: number;
  keyword?: string;
}

export interface UserResponse {
  list: User[];
  total: number;
}

export function getUserList(params: UserParams): Promise<UserResponse> {
  return request.get('/api/user/list', { params });
}

export function createUser(data: Partial<User>): Promise<User> {
  return request.post('/api/user/create', data);
}
```

#### 错误处理
```typescript
try {
  const user = await getUserById(1);
  // 处理成功
} catch (error) {
  // 统一错误处理
  console.error('获取用户失败:', error);
  // 显示用户友好的错误信息
  ElMessage.error('获取用户信息失败，请稍后重试');
}
```

## 🔧 代码质量工具配置

### ESLint 规则要点
- 使用 Vue 3 推荐规则
- TypeScript 严格类型检查
- 关闭不必要的严格规则（如 `no-explicit-any`）
- 集成 Prettier 避免格式冲突

### Prettier 格式化配置
```javascript
// .prettierrc.cjs
{
  "printWidth": 80,           // 每行最大字符数
  "tabWidth": 2,             // 缩进空格数
  "useTabs": false,          // 使用空格缩进
  "semi": true,             // 语句末尾分号
  "singleQuote": false,      // 使用双引号
  "trailingComma": "es5",    // 尾随逗号
  "bracketSpacing": true,    // 对象括号空格
  "arrowParens": "always",   // 箭头函数参数括号
}
```

### Stylelint 样式检查
- 遵循 Standard 规范
- 支持 Vue 单文件组件
- 支持 SCSS 语法
- 属性顺序检查（Recess Order）

## 📝 Git 提交规范

### 提交类型
使用 Conventional Commits 规范：

| 类型       | 说明                          | Emoji     |
|------------|-----------------------------|-----------|
| `feat`     | 新增功能                      | ✨        |
| `fix`      | 修复缺陷                      | 🐛        |
| `docs`     | 文档变更                      | 📝        |
| `style`    | 代码格式                      | 🌈        |
| `refactor` | 代码重构                      | 🔄        |
| `perf`     | 性能优化                      | 🚀        |
| `test`     | 测试相关                      | 🧪        |
| `build`    | 构建配置                      | 📦️       |
| `ci`       | CI 配置                       | ⚙️        |
| `chore`    | 其他更改                      | 🛠️        |
| `revert`   | 回滚提交                      | ↩️        |

### 提交示例
```
feat: 新增用户管理功能
fix: 修复登录页面样式问题
docs: 更新 README 文档
style: 格式化代码
refactor: 重构用户认证逻辑
```

## 🚀 开发工作流

### 1. 代码检查
```bash
# 检查 ESLint
pnpm lint:eslint

# 检查 Prettier
pnpm lint:prettier

# 检查 Stylelint
pnpm lint:stylelint

# 类型检查
pnpm type-check
```

### 2. 代码修复
```bash
# 自动修复所有问题
pnpm lint:eslint && pnpm lint:prettier && pnpm lint:stylelint
```

### 3. Git Hook
项目配置了 Husky，在提交前自动执行：
- ESLint 检查
- Prettier 格式化
- Stylelint 检查
- Commitlint 提交信息验证

## 🎯 最佳实践

### 1. 组件设计原则
- **单一职责**: 每个组件只做一件事
- **可复用性**: 提取通用组件到 `components/` 目录
- **可组合性**: 使用插槽和 Props 实现组件组合
- **响应式设计**: 支持移动端和桌面端

### 2. 状态管理
- 使用 Pinia 进行状态管理
- 按功能模块组织 Store
- 避免在组件中直接修改 Store
- 使用 Actions 处理异步操作

### 3. 性能优化
- 组件懒加载
- 图片懒加载
- 防抖和节流
- 虚拟滚动长列表
- 按需引入第三方库

### 4. 安全性
- 输入验证和过滤
- XSS 防护
- CSRF 防护
- API 请求签名
- 敏感信息加密

## 📚 文档要求

### 1. 组件文档
每个公共组件应包含：
- 组件说明
- Props 文档
- Events 文档
- Slots 文档
- 使用示例

### 2. API 文档
每个 API 模块应包含：
- 接口说明
- 参数说明
- 返回值说明
- 错误码说明

### 3. 工具函数文档
每个工具函数应包含：
- 函数说明
- 参数说明
- 返回值说明
- 使用示例

## 🔍 代码审查要点

### 必须检查的项目
- [ ] 代码符合 ESLint 规则
- [ ] 代码格式符合 Prettier 配置
- [ ] 样式符合 Stylelint 规则
- [ ] TypeScript 类型定义完整
- [ ] 组件 Props 和 Emits 定义清晰
- [ ] 错误处理完善
- [ ] 单元测试覆盖
- [ ] 文档更新完整

### 建议检查的项目
- [ ] 性能考虑
- [ ] 安全性考虑
- [ ] 可访问性考虑
- [ ] 浏览器兼容性
- [ ] 移动端适配

## 📞 问题反馈

遇到规范相关问题，请通过以下方式反馈：
1. 在代码审查中提出
2. 更新本文档并提交 PR
3. 在团队会议中讨论

---

*最后更新: 2026-03-07*
*维护者: GameOS 开发团队*