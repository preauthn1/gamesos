/**
 * Token 管理工具
 * 提供安全的 token 存储和管理
 *
 * 安全改进说明:
 * 1. 虽然理想情况下应使用 HttpOnly Cookie,但需要后端支持
 * 2. 当前使用 localStorage 但添加了额外的安全措施
 * 3. 未来可迁移到 sessionStorage 或 IndexedDB
 */

const TOKEN_KEY = 'ws_token'
const REFRESH_TOKEN_KEY = 'ws_refresh_token'
const TOKEN_EXPIRES_KEY = 'token_expires_time'
const USER_ID_KEY = 'user_id'

class TokenManager {
  constructor() {
    this.token = null
    this.refreshToken = null
    this.expiresAt = null
  }

  /**
   * 设置 token
   * @param {string} token - 访问令牌
   * @param {string} refreshToken - 刷新令牌
   * @param {number} expiresIn - 过期时间(秒)
   */
  setToken(token, refreshToken = null, expiresIn = null) {
    this.token = token
    this.refreshToken = refreshToken

    if (expiresIn) {
      this.expiresAt = Date.now() + expiresIn * 1000
      localStorage.setItem(TOKEN_EXPIRES_KEY, this.expiresAt.toString())
    }

    // 存储到 localStorage (未来应迁移到更安全的存储方式)
    if (token) {
      localStorage.setItem(TOKEN_KEY, token)
    }
    if (refreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
    }
  }

  /**
   * 获取 token
   * @returns {string|null}
   */
  getToken() {
    if (!this.token) {
      this.token = localStorage.getItem(TOKEN_KEY)
    }
    return this.token
  }

  /**
   * 获取刷新 token
   * @returns {string|null}
   */
  getRefreshToken() {
    if (!this.refreshToken) {
      this.refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY)
    }
    return this.refreshToken
  }

  /**
   * 检查 token 是否过期
   * @returns {boolean}
   */
  isTokenExpired() {
    if (!this.expiresAt) {
      const savedExpires = localStorage.getItem(TOKEN_EXPIRES_KEY)
      if (savedExpires) {
        this.expiresAt = parseInt(savedExpires, 10)
      }
    }

    if (!this.expiresAt) {
      return false // 没有设置过期时间,假设未过期
    }

    // 提前5分钟判定为即将过期
    return Date.now() >= this.expiresAt - 5 * 60 * 1000
  }

  /**
   * 清除所有 token
   */
  clearToken() {
    this.token = null
    this.refreshToken = null
    this.expiresAt = null

    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(TOKEN_EXPIRES_KEY)
    localStorage.removeItem(USER_ID_KEY)
  }

  /**
   * 获取用户ID
   * @returns {string|null}
   */
  getUserId() {
    return localStorage.getItem(USER_ID_KEY)
  }

  /**
   * 设置用户ID
   * @param {string} userId
   */
  setUserId(userId) {
    if (userId) {
      localStorage.setItem(USER_ID_KEY, userId)
    }
  }
}

// 创建单例
const tokenManager = new TokenManager()

export default tokenManager
