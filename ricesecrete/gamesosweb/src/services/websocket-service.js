import { getWebSocketUrl } from '@/api/index.js'
import wsClient from '@/utils/websocket/WebSocketClient.js'
import tokenManager from '@/utils/token-manager.js'
import { ConnectionState } from '@/utils/websocket/constants.js'

let isInitialized = false
let initPromise = null

/**
 * 初始化 WebSocket 服务
 * @returns {Promise<WebSocketClient>}
 */
export async function initWebSocket() {
  // 如果已经在初始化中，返回同一个 Promise
  if (initPromise) {
    return initPromise
  }

  // 如果已经初始化完成且连接正常，直接返回
  if (isInitialized && wsClient.isConnected()) {
    return wsClient
  }

  initPromise = (async () => {
    try {
      const wsUrl = await getWebSocketUrl()

      // 尝试从 tokenManager 恢复 token
      const savedToken = tokenManager.getToken()
      if (savedToken) {
        wsClient.setToken(savedToken)
      }

      wsClient.connect(wsUrl)

      // 等待连接建立
      await waitForConnection(wsClient, 10000)

      isInitialized = true
      return wsClient
    } catch (error) {
      console.error('初始化 WebSocket 失败:', error)
      initPromise = null
      throw error
    }
  })()

  return initPromise
}

/**
 * 等待 WebSocket 连接建立
 * @param {WebSocketClient} client - WebSocket 客户端
 * @param {number} timeout - 超时时间（毫秒）
 * @returns {Promise<void>}
 */
function waitForConnection(client, timeout = 10000) {
  return new Promise((resolve, reject) => {
    if (client.isConnected()) {
      resolve()
      return
    }

    let timer = null
    let unsubscribe = null

    const cleanup = () => {
      if (timer) {
        clearTimeout(timer)
        timer = null
      }
      if (unsubscribe) {
        unsubscribe()
        unsubscribe = null
      }
    }

    timer = setTimeout(() => {
      cleanup()
      reject(new Error('WebSocket 连接超时'))
    }, timeout)

    // 监听状态变化
    unsubscribe = client.onStateChange((newState) => {
      if (newState === ConnectionState.CONNECTED) {
        cleanup()
        resolve()
      } else if (newState === ConnectionState.DISCONNECTED) {
        cleanup()
        reject(new Error('WebSocket 连接失败'))
      }
    })
  })
}

/**
 * 获取 WebSocket 客户端实例
 * @returns {WebSocketClient}
 */
export function getWebSocketClient() {
  return wsClient
}

/**
 * 确保 WebSocket 已连接
 * @returns {Promise<WebSocketClient>}
 */
export async function ensureConnected() {
  if (!isInitialized || !wsClient.isConnected()) {
    await initWebSocket()
  }
  return wsClient
}

export default {
  initWebSocket,
  getWebSocketClient,
  ensureConnected
}

