/**
 * WebSocket API 请求封装
 * 统一的请求接口,所有 API 请求都通过 WebSocket 进行
 */
import { ensureConnected } from '@/services/websocket-service.js'

/**
 * 通用请求方法
 * @param {string} url - 请求路径
 * @param {string} method - 请求方法
 * @param {object} data - 请求数据
 * @param {object} options - 额外配置
 * @returns {Promise}
 */
export async function request(url, method = 'POST', data = {}, options = {}) {
  try {
    // 确保 WebSocket 已连接,如果未连接则自动初始化并等待连接建立
    const wsClient = await ensureConnected()

    return wsClient.request(url, method, data, options)
      .then(response => {
        // 统一处理响应数据
        if (response.code === 0) {
          return response.data
        }
        throw new Error(response.msg || response.message || '请求失败')
      })
  } catch (error) {
    // 统一错误处理
    console.error(`API 请求失败 [${method} ${url}]:`, error)
    throw error
  }
}

/**
 * GET 请求
 */
export function get(url, params = {}, options = {}) {
  return request(url, 'GET', params, options)
}

/**
 * POST 请求
 */
export function post(url, data = {}, options = {}) {
  return request(url, 'POST', data, options)
}

/**
 * PUT 请求
 */
export function put(url, data = {}, options = {}) {
  return request(url, 'PUT', data, options)
}

/**
 * DELETE 请求
 */
export function del(url, params = {}, options = {}) {
  return request(url, 'DELETE', params, options)
}

export default {
  request,
  get,
  post,
  put,
  delete: del
}
