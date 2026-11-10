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
          <h2 class="modal-title">欢迎注册</h2>
          <p class="modal-subtitle">注册账号享受更多优惠</p>
        </div>

        <!-- 注册表单 -->
        <form class="register-form" @submit.prevent="handleSubmit">
          <!-- 注册方式选择 -->
          <div class="register-type-tabs">
            <button
              type="button"
              :class="['type-tab', { active: formData.registerType === 'email' }]"
              @click="formData.registerType = 'email'"
            >
              邮箱注册
            </button>
            <button
              type="button"
              :class="['type-tab', { active: formData.registerType === 'phone' }]"
              @click="formData.registerType = 'phone'"
            >
              手机注册
            </button>
          </div>

          <!-- 账号输入 -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">{{ formData.registerType === 'email' ? '📧' : '📱' }}</span>
              <!-- 手机注册时显示区号选择 -->
              <select
                v-if="formData.registerType === 'phone'"
                v-model="formData.areaCode"
                class="area-code-select"
              >
                <option value="+55">+55</option>
                <option value="+86">+86</option>
                <option value="+1">+1</option>
                <option value="+81">+81</option>
                <option value="+82">+82</option>
              </select>
              <input
                v-model="formData.account"
                :type="formData.registerType === 'email' ? 'email' : 'tel'"
                class="form-input"
                :placeholder="formData.registerType === 'email' ? '请输入邮箱' : '请输入手机号'"
                required
              >
            </div>
          </div>

          <!-- 验证码输入 -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">🔢</span>
              <input
                v-model="formData.verificationCode"
                type="text"
                class="form-input"
                placeholder="请输入验证码"
                required
              >
              <button
                type="button"
                class="btn-code"
                :disabled="countdown > 0"
                @click="sendVerificationCode"
              >
                {{ countdown > 0 ? `${countdown}s` : '获取验证码' }}
              </button>
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
                placeholder="请输入密码 (6-20位)"
                required
                minlength="6"
                maxlength="20"
              >
            </div>
          </div>

          <!-- 确认密码输入 -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">🔒</span>
              <input
                v-model="formData.confirmPassword"
                type="password"
                class="form-input"
                placeholder="请再次输入密码"
                required
              >
            </div>
          </div>

          <!-- 邀请码输入 (可选) -->
          <div class="form-group">
            <div class="input-wrapper">
              <span class="input-icon">🎁</span>
              <input
                v-model="formData.inviteCode"
                type="text"
                class="form-input"
                placeholder="邀请码 (可选)"
              >
            </div>
          </div>

          <!-- 用户协议 -->
          <div class="form-agreement">
            <label class="checkbox-label">
              <input v-model="formData.agreeTerms" type="checkbox" class="agreement-checkbox" required>
              <span class="checkbox-text">
                我已阅读并同意
                <a class="link-text" @click.prevent="showTerms">《用户协议》</a>
                和
                <a class="link-text" @click.prevent="showPrivacy">《隐私政策》</a>
              </span>
            </label>
          </div>

          <!-- 注册按钮 -->
          <button type="submit" class="btn-register" :disabled="isSubmitting || !formData.agreeTerms">
            <span v-if="isSubmitting" class="loading-spinner"></span>
            <span v-else>立即注册</span>
          </button>
        </form>

        <!-- 底部登录 -->
        <div class="modal-footer">
          <span class="footer-text">已有账号?</span>
          <a class="link-primary" @click="handleLogin">立即登录</a>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, onUnmounted } from 'vue'
import { register } from '@/api/user.js'
import { useUserStore } from '@/stores/user.js'
import { toast } from '@/composables/useToast.js'

const userStore = useUserStore()

const props = defineProps({
  visible: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close', 'success', 'switch-to-login'])

const formData = reactive({
  registerType: 'email', // 默认邮箱注册
  account: '',
  areaCode: '+55', // 区号，默认巴西
  verificationCode: '',
  password: '',
  confirmPassword: '',
  inviteCode: '',
  agreeTerms: false
})

const isSubmitting = ref(false)
const countdown = ref(0)
let countdownTimer = null // 保存计时器引用

// 组件卸载时清理计时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})

// 关闭弹窗
const close = () => {
  if (!isSubmitting.value) {
    emit('close')
  }
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!formData.account) {
    toast.warning(formData.registerType === 'email' ? '请输入邮箱' : '请输入手机号')
    return
  }

  // TODO: 调用发送验证码接口

  // 清理之前的计时器
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }

  // 开始倒计时
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      countdownTimer = null
    }
  }, 1000)

  toast.success('验证码已发送!')
}

// 提交注册
const handleSubmit = async () => {
  if (isSubmitting.value) return

  // 验证密码
  if (formData.password !== formData.confirmPassword) {
    toast.error('两次输入的密码不一致')
    return
  }

  if (formData.password.length < 6 || formData.password.length > 20) {
    toast.error('密码长度必须在6-20位之间')
    return
  }

  try {
    isSubmitting.value = true

    // 构建注册参数
    const registerParams = {
      account_type: formData.registerType === 'email' ? '2' : '1',
      verify_code: formData.verificationCode,
      password: formData.password,
      password_confirm: formData.confirmPassword
    }

    // 根据注册类型添加对应参数
    if (formData.registerType === 'email') {
      registerParams.email = formData.account
    } else {
      registerParams.phone = formData.account
      registerParams.qh = formData.areaCode
    }

    // 邀请码（可选）
    if (formData.inviteCode) {
      registerParams.inv_code = formData.inviteCode
    }

    // 调用注册接口
    const result = await register(registerParams)

    // 注册成功后获取用户信息
    try {
      await userStore.fetchUserInfo()
    } catch (error) {
      console.error('获取用户信息失败:', error)
    }

    toast.success('注册成功!')
    emit('success', result)
    emit('close')
  } catch (error) {
    console.error('注册失败:', error)
    toast.error(error.message || '注册失败,请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 切换到登录
const handleLogin = () => {
  emit('switch-to-login')
}

// 显示用户协议
const showTerms = () => {
  toast.info('用户协议功能开发中...')
}

// 显示隐私政策
const showPrivacy = () => {
  toast.info('隐私政策功能开发中...')
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
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--spacing-xxl);
  position: relative;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
  animation: modalSlideUp 0.3s ease;
  cursor: auto;
}

/* 滚动条样式 */
.modal-container::-webkit-scrollbar {
  width: 6px;
}

.modal-container::-webkit-scrollbar-track {
  background: var(--bg-dark);
  border-radius: var(--radius-sm);
}

.modal-container::-webkit-scrollbar-thumb {
  background: var(--color-primary);
  border-radius: var(--radius-sm);
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

/* 注册方式切换 */
.register-type-tabs {
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

/* 注册表单 */
.register-form {
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

/* 区号选择 */
.area-code-select {
  background: transparent;
  border: none;
  border-right: 1px solid var(--border-light);
  padding: var(--spacing-sm) var(--spacing-sm);
  color: var(--text-primary);
  font-size: 14px;
  outline: none;
  cursor: pointer;
  min-width: 70px;
}

.area-code-select option {
  background: var(--bg-card);
  color: var(--text-primary);
}

/* 验证码按钮 */
.btn-code {
  flex-shrink: 0;
  padding: var(--spacing-sm) var(--spacing-md);
  margin-right: var(--spacing-xs);
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  border: none;
  border-radius: var(--radius-sm);
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: var(--transition-normal);
  white-space: nowrap;
}

.btn-code:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: var(--shadow-sm);
}

.btn-code:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
}

/* 用户协议 */
.form-agreement {
  margin-bottom: var(--spacing-lg);
}

.checkbox-label {
  display: flex;
  align-items: flex-start;
  cursor: pointer;
}

.agreement-checkbox {
  width: 16px;
  height: 16px;
  margin-right: var(--spacing-sm);
  margin-top: 2px;
  cursor: pointer;
  flex-shrink: 0;
}

.checkbox-text {
  font-size: 12px;
  color: var(--text-secondary);
  line-height: 1.5;
}

.link-text {
  color: var(--color-primary);
  text-decoration: none;
  transition: var(--transition-normal);
}

.link-text:hover {
  text-decoration: underline;
}

.link-text:active {
  transform: scale(0.95);
}

/* 注册按钮 */
.btn-register {
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

.btn-register:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-register:active:not(:disabled) {
  transform: translateY(0);
}

.btn-register:disabled {
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

/* 底部登录 */
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
