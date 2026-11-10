/**
 * 用户相关 API
 */
import { post, get } from './request.js'
import wsClient from '@/utils/websocket/WebSocketClient.js'

/**
 * 用户登录
 * @param {object} data - 登录信息 { username, password }
 * @returns {Promise}
 */
export function login(data) {
  return post('/api/v1/user/login', data)
    .then(result => {
      // 登录成功后自动保存 token
      if (result.token) {
        wsClient.setToken(result.token)
      }
      return result
    })
}

/**
 * 用户登出
 * @returns {Promise}
 */
export function logout() {
  return post('/api/v1/user/logout')
    .then(result => {
      // 登出后清除 token
      wsClient.setToken(null)
      return result
    })
}

/**
 * 获取用户信息
 * @returns {Promise}
 */
export function getUserInfo() {
  return get('/api/v1/user/info')
}

/**
 * 更新用户信息
 * @param {object} data - 用户信息
 * @returns {Promise}
 */
export function updateUserInfo(data) {
  return post('/api/v1/user/update', data)
}

/**
 * 用户注册
 * @param {object} data - 注册信息
 * @param {string} data.account_type - 账号类型: 1手机 2邮箱
 * @param {string} data.password - 密码
 * @param {string} data.password_confirm - 确认密码
 * @param {string} [data.phone] - 手机号（account_type=1时必填）
 * @param {string} [data.qh] - 区号（account_type=1时必填）
 * @param {string} [data.email] - 邮箱（account_type=2时必填）
 * @param {string} [data.verify_code] - 验证码
 * @param {string} [data.inv_code] - 邀请码
 * @param {number} [data.pay_password] - 安全密码，6位数
 * @returns {Promise}
 */
export function register(data) {
  return post('/api/v1/user/register', data)
    .then(result => {
      // 注册成功后自动保存 token 和 refresh_token
      if (result.token) {
        wsClient.setToken(result.token)
        // 保存 refresh_token
        if (result.refresh_token) {
          localStorage.setItem('ws_refresh_token', result.refresh_token)
        }
        // 保存用户信息
        if (result.id) {
          localStorage.setItem('user_id', result.id)
        }
        if (result.expires_time) {
          localStorage.setItem('token_expires_time', result.expires_time)
        }
      }
      return result
    })
}

/**
 * 发送邮箱验证码
 * @param {string} email - 邮箱地址
 * @returns {Promise}
 */
export function sendEmailCode(email) {
  return post('/api/v1/user/send_email_code', { email })
}

/**
 * 发送手机验证码
 * @param {object} data - 手机信息
 * @param {string} data.phone - 手机号码
 * @param {string} data.qh - 手机区号
 * @returns {Promise}
 */
export function sendPhoneCode(data) {
  return post('/api/v1/user/send_phone_code', data)
}

export default {
  login,
  logout,
  getUserInfo,
  updateUserInfo,
  register,
  sendEmailCode,
  sendPhoneCode
}
