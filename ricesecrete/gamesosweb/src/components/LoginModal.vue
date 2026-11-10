<template>
  <Transition name="modal">
    <div v-if="visible" class="modal-overlay" @click.self="close">
      <div class="modal-container">
        <!-- 关闭按钮 -->
        <button class="modal-close" @click="close">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>

        <!-- Logo -->
        <div class="modal-logo">
          <div class="logo-icon">🎮</div>
          <h2 class="modal-title">欢迎登录</h2>
          <p class="modal-subtitle">登录后即可充值、提现等操作</p>
        </div>

        <!-- 登录表单 -->
        <form class="login-form" @submit.prevent="handleSubmit">
          <!-- 登录方式选择 -->
          <div class="login-type-tabs">
            <button
              type="button"
              :class="['type-tab', { active: formData.loginType === 'email' }]"
              @click="formData.loginType = 'email'"
            >
              邮箱登录
            </button>
            <button
              type="button"
              :class="['type-tab', { active: formData.loginType === 'phone' }]"
              @click="formData.loginType = 'phone'"
            >
              手机登录
            </button>
          </div>

          <!-- 账号输入 -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">{{ formData.loginType === 'email' ? '📧' : '📱' }}</span>
              <input
                v-model="formData.username"
                :type="formData.loginType === 'email' ? 'email' : 'tel'"
                class="form-input"
                :placeholder="formData.loginType === 'email' ? '请输入邮箱' : '请输入手机号'"
                required
              >
            </div>
          </div>

          <!-- 密码输入 -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                v-model="formData.password"
                type="password"
                class="form-input"
                placeholder="请输入密码"
                required
              >
            </div>
          </div>

          <!-- 快捷操作 -->
          <div class="form-actions">
            <label class="checkbox-label">
              <input type="checkbox" class="remember-checkbox">
              <span class="checkbox-text">记住我</span>
            </label>
            <a class="link-text" @click.prevent="handleForgotPassword">忘记密码?</a>
          </div>

          <!-- 登录按钮 -->
          <button type="submit" class="btn-login" :disabled="isSubmitting">
            <span v-if="isSubmitting" class="loading-spinner"></span>
            <span v-else>登录</span>
          </button>
        </form>

        <!-- 底部注册 -->
        <div class="modal-footer">
          <span class="footer-text">还没有账号?</span>
          <a class="link-primary" @click="handleRegister">立即注册</a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { login } from '@/api/user.js'
import { useUserStore } from '@/stores/user.js'
import { toast } from '@/composables/useToast.js'

const userStore = useUserStore()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'success', 'switch-to-register'])

const formData = reactive({
  loginType: 'email', // 默认邮箱登录
  username: '',
  password: ''
})

const isSubmitting = ref(false)

// 关闭弹窗
const close = () => {
  if (!isSubmitting.value) {
    emit('close')
  }
}

// 提交登录
const handleSubmit = async () => {
  if (isSubmitting.value) return

  try {
    isSubmitting.value = true

    // 调用登录接口
    const result = await login({
      username: formData.username,
      password: formData.password
    })

    // 登录成功后获取用户信息
    try {
      await userStore.fetchUserInfo()
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }

    emit('success', result)
    emit('close')
  } catch (error) {
    console.error('登录失败:', error)
    toast.error(error.message || '登录失败,请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 忘记密码
const handleForgotPassword = () => {
  alert('忘记密码功能开发中...')
}

// 注册账号
const handleRegister = () => {
  emit('switch-to-register')
}
</script>

<style scoped>
/* 遮罩层 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--spacing-lg);
  cursor: pointer;
}

/* 弹窗容器 */
.modal-container {
  background: var(--bg-card);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-xl);
  width: 100%;
  max-width: 400px;
  padding: var(--spacing-xxl);
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: modalSlideUp 0.3s ease;
  cursor: auto;
}

@keyframes modalSlideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 关闭按钮 */
.modal-close {
  position: absolute;
  top: var(--spacing-lg);
  right: var(--spacing-lg);
  width: 40px;
  height: 40px;
  border: none;
  background: rgba(0, 0, 0, 0.3);
  color: var(--text-secondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-circle);
  transition: var(--transition-normal);
  z-index: 10;
  -webkit-tap-highlight-color: transparent;
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  user-select: none;
}

.modal-close:hover {
  background: rgba(74, 222, 128, 0.2);
  color: var(--color-primary);
}

.modal-close:active {
  transform: scale(0.9);
  background: rgba(74, 222, 128, 0.3);
}

/* Logo 区域 */
.modal-logo {
  text-align: center;
  margin-bottom: var(--spacing-xl);
}

.logo-icon {
  font-size: 48px;
  margin-bottom: var(--spacing-md);
  animation: logoFloat 2s ease-in-out infinite;
}

@keyframes logoFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.modal-title {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: var(--spacing-sm);
}

.modal-subtitle {
  font-size: 14px;
  color: var(--text-secondary);
}

/* 登录方式切换 */
.login-type-tabs {
  display: flex;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-xs);
  background: var(--bg-dark);
  border-radius: var(--radius-md);
}

.type-tab {
  flex: 1;
  padding: var(--spacing-sm);
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 14px;
  font-weight: 600;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: var(--transition-normal);
}

.type-tab.active {
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  box-shadow: var(--shadow-sm);
}

.type-tab:not(.active):hover {
  background: rgba(74, 222, 128, 0.1);
  color: var(--color-primary);
}

/* 登录表单 */
.login-form {
  margin-bottom: var(--spacing-xl);
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
  background: var(--bg-dark);
  border: 1px solid var(--border-light);
  border-radius: var(--radius-md);
  transition: var(--transition-normal);
}

.input-wrapper:focus-within {
  border-color: var(--border-active);
  box-shadow: 0 0 0 3px rgba(74, 222, 128, 0.1);
}

.input-icon {
  font-size: 20px;
  padding: 0 var(--spacing-md);
  color: var(--text-secondary);
}

.form-input {
  flex: 1;
  background: transparent;
  border: none;
  outline: none;
  padding: var(--spacing-md) var(--spacing-md) var(--spacing-md) 0;
  color: var(--text-primary);
  font-size: 14px;
}

.form-input::placeholder {
  color: var(--text-secondary);
}

/* 表单操作 */
.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
}

.checkbox-label {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.remember-checkbox {
  width: 16px;
  height: 16px;
  margin-right: var(--spacing-sm);
  cursor: pointer;
}

.checkbox-text {
  font-size: 13px;
  color: var(--text-secondary);
}

.link-text {
  font-size: 13px;
  color: var(--text-secondary);
  cursor: pointer;
  transition: var(--transition-normal);
}

.link-text:hover {
  color: var(--color-primary);
}

.link-text:active {
  transform: scale(0.95);
}

/* 登录按钮 */
.btn-login {
  width: 100%;
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  border: none;
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
  box-shadow: var(--shadow-md);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-login:active:not(:disabled) {
  transform: translateY(0);
}

.btn-login:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

/* 加载动画 */
.loading-spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: var(--text-primary);
  border-radius: var(--radius-circle);
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 底部注册 */
.modal-footer {
  text-align: center;
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-light);
}

.footer-text {
  font-size: 14px;
  color: var(--text-secondary);
  margin-right: var(--spacing-sm);
}

.link-primary {
  font-size: 14px;
  color: var(--color-primary);
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
}

.link-primary:hover {
  text-decoration: underline;
}

.link-primary:active {
  transform: scale(0.95);
}

/* 弹窗过渡动画 */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-container,
.modal-leave-active .modal-container {
  transition: transform 0.3s ease;
}

.modal-enter-from .modal-container,
.modal-leave-to .modal-container {
  transform: scale(0.9) translateY(20px);
}

/* 移动端适配 */
@media (max-width: 480px) {
  .modal-container {
    padding: var(--spacing-xl);
  }

  .modal-title {
    font-size: 20px;
  }

  .logo-icon {
    font-size: 40px;
  }
}
</style>

