import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getUserInfo } from '@/api/user.js'
import tokenManager from '@/utils/token-manager.js'
import wsClient from '@/utils/websocket'

export const useUserStore = defineStore('user', () => {
  // 用户信息
  const userInfo = ref(null)
  const isLoggedIn = ref(false)

  // 登录弹窗控制
  const showLoginModal = ref(false)
  // 注册弹窗控制
  const showRegisterModal = ref(false)

  // 初始化：从 localStorage 恢复用户信息
  const initUserInfo = () => {
    try {
      const savedUserInfo = localStorage.getItem('userInfo')
      if (savedUserInfo) {
        userInfo.value = JSON.parse(savedUserInfo)
        isLoggedIn.value = true
      }
    } catch (error) {
      console.error('恢复用户信息失败:', error)
    }
  }

  // 设置用户信息
  const setUserInfo = (info) => {
    let balance = 0
    if (info && typeof info.balance === 'number') {
      balance = parseInt(info.balance * 100) / 100
    }
    info.balance = balance
    userInfo.value = info
    isLoggedIn.value = true
    // 持久化到 localStorage
    try {
      localStorage.setItem('userInfo', JSON.stringify(info))
      // 同时保存用户ID到 tokenManager
      if (info.user_id) {
        tokenManager.setUserId(info.user_id)
      }
    } catch (error) {
      console.error('保存用户信息失败:', error)
    }
  }

  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const result = await getUserInfo()
      setUserInfo(result.data || result)
      return result
    } catch (error) {
      console.error('获取用户信息失败:', error)
      throw error
    }
  }

  // 清除用户信息（登出）
  const clearUserInfo = () => {
    userInfo.value = null
    isLoggedIn.value = false
    // 清除 localStorage
    try {
      localStorage.removeItem('userInfo')
      // 同时清除 token
      tokenManager.clearToken()
      // 清除 WebSocket token 并重连
      wsClient.logout()
    } catch (error) {
      console.error('清除用户信息失败:', error)
    }
  }

  // 更新用户余额
  const updateBalance = (balance) => {
    if (userInfo.value) {

      let balanceValue = 0
      if (typeof balance === 'number') {
        balanceValue = parseInt(balance * 100) / 100
      }
      userInfo.value.balance = balanceValue
      // 同步更新到 localStorage
      try {
        localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
      } catch (error) {
        console.error('更新用户余额失败:', error)
      }
    }
  }

  // 打开登录弹窗
  const openLoginModal = () => {
    showLoginModal.value = true
    showRegisterModal.value = false
  }

  // 关闭登录弹窗
  const closeLoginModal = () => {
    showLoginModal.value = false
  }

  // 打开注册弹窗
  const openRegisterModal = () => {
    showRegisterModal.value = true
    showLoginModal.value = false
  }

  // 关闭注册弹窗
  const closeRegisterModal = () => {
    showRegisterModal.value = false
  }

  return {
    userInfo,
    isLoggedIn,
    showLoginModal,
    showRegisterModal,
    initUserInfo,
    setUserInfo,
    fetchUserInfo,
    clearUserInfo,
    updateBalance,
    openLoginModal,
    closeLoginModal,
    openRegisterModal,
    closeRegisterModal
  }
})
