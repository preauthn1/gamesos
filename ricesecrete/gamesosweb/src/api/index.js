/**
 * API 基础配置
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL || '/'

// 配置缓存
let configCache = null
let configPromise = null

/**
 * 通用请求封装
 * @param {string} url - 请求地址
 * @param {object} options - 请求配置
 * @returns {Promise} 响应数据
 */
async function request(url, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()

    if (data.code !== 0) {
      throw new Error(data.msg || '请求失败')
    }

    return data
  } catch (error) {
    console.error('请求失败:', error)
    throw error
  }
}

/**
 * 获取应用配置信息(带缓存)
 * @param {boolean} force - 是否强制刷新缓存
 * @returns {Promise<object>} 配置数据
 */
export async function getAppConfig(force = false) {
  // 如果有缓存且不强制刷新,直接返回
  if (configCache && !force) {
    return configCache
  }

  // 如果正在请求中,返回同一个 Promise,避免重复请求
  if (configPromise) {
    return configPromise
  }

  // 发起请求
  configPromise = request('api/v1/config').then(response => {
    configCache = response.data
    configPromise = null
    return configCache
  }).catch(error => {
    configPromise = null
    throw error
  })

  return configPromise
}

/**
 * 获取 WebSocket 服务器地址
 * @returns {Promise<string>} WebSocket 地址
 */
export async function getWebSocketUrl() {
  const config = await getAppConfig()
  return config.ws
}

/**
 * 清除配置缓存
 */
export function clearConfigCache() {
  configCache = null
  configPromise = null
}

/**
 * 获取游戏分类列表
 * @returns {Promise} 游戏分类数据
 */
export async function getGameTypes() {
  const { get } = await import('./request.js')
  return get('/api/v1/game/game_type')
}

/**
 * 获取游戏列表
 * @param {object} params - 查询参数
 * @returns {Promise} 游戏列表数据
 */
export async function getGameList(params = {}) {
  const { get } = await import('./request.js')
  return get('/api/v1/game/game_list', params)
}

/**
 * 获取游戏链接
 * @param {object} params - 查询参数
 * @param {string} params.id - 游戏ID
 * @param {string} params.type - 类型 1=PC端, 2=H5
 * @returns {Promise} 游戏链接数据
 */
export async function getGameUrl(params = {}) {
  const { get } = await import('./request.js')
  return get('/api/v1/game/game_url', params)
}

/**
 * （转账钱包）退出游戏
 * @param {object} params - 查询参数
 * @param {string} params.id - 游戏ID
 * @param {string} params.type - 类型 1=PC端, 2=H5
 * @returns {Promise} 游戏链接数据
 */
export async function gameOut(params = {}) {
  const { get } = await import('./request.js')
  return get('/api/v1/game/game_out', params)
}

/**
 * （转账钱包）获取游戏余额
 * @param {object} params - 查询参数
 * @param {string} params.id - 游戏ID
 * @param {string} params.type - 类型 1=PC端, 2=H5
 * @returns {Promise} 游戏链接数据
 */
export async function gameBalance(params = {}) {
  const { get } = await import('./request.js')
  return get('/api/v1/game/game_balance', params)
}


