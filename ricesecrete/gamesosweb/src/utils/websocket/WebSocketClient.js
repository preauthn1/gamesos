/**
 * WebSocket 客户端
 * 职责：连接管理和模块协调
 */
import tokenManager from '../token-manager.js';
import { ConnectionState, DEFAULT_CONFIG } from './constants.js';
import { ConnectionError } from './errors.js';
import { HeartbeatManager } from './HeartbeatManager.js';
import { RequestManager } from './RequestManager.js';
import { MessageHandler } from './MessageHandler.js';

class WebSocketClient {
  constructor() {
    this.ws = null;
    this.url = '';
    this.state = ConnectionState.DISCONNECTED;
    this.stateListeners = [];

    // 重连配置
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
    this.reconnectInterval = DEFAULT_CONFIG.reconnectInterval;
    this.maxReconnectInterval = DEFAULT_CONFIG.maxReconnectInterval;

    // 网络状态
    this.isOnline = navigator.onLine;
    this.isManualClose = false;

    // Token
    this.token = null;

    // 子模块
    this.heartbeat = new HeartbeatManager();
    this.requestManager = new RequestManager();
    this.messageHandler = new MessageHandler();

    // 配置子模块回调
    this.configureModules();

    // 设置网络监听
    this.setupNetworkListeners();

    // 注册默认通知处理器（余额更新）
    this.registerDefaultNotifyHandlers();
  }

  /**
   * 配置子模块回调
   */
  configureModules() {
    const sendFn = (data) => this.send(data);
    const generateIdFn = () => this.generateRequestId();
    const getPageFn = () => this.getCurrentPage();

    this.heartbeat.configure({
      send: sendFn,
      onTimeout: () => this.handleHeartbeatTimeout(),
      getPage: getPageFn,
      generateId: generateIdFn,
    });

    this.requestManager.configure({
      send: sendFn,
      onTokenExpired: () => this.handleTokenExpired(),
    });
  }

  /**
   * 注册默认通知处理器
   */
  registerDefaultNotifyHandlers() {
    // 余额更新通知 (type: 3)
    this.messageHandler.onNotify(3, async (data) => {
      if (data && data.balance !== undefined) {
        try {
          const { useUserStore } = await import('@/stores/user.js');
          const userStore = useUserStore();
          userStore.updateBalance(data.balance);
        } catch (error) {
          console.error('更新用户余额失败:', error);
        }
      }
    });
  }

  // ===== 状态管理 =====

  /**
   * 设置连接状态
   * @param {string} newState - 新状态
   */
  setState(newState) {
    if (this.state !== newState) {
      const oldState = this.state;
      this.state = newState;
      this.stateListeners.forEach((listener) => {
        try {
          listener(newState, oldState);
        } catch (e) {
          console.error('状态监听器出错:', e);
        }
      });
    }
  }

  /**
   * 监听状态变化
   * @param {Function} listener - 监听函数 (newState, oldState) => void
   * @returns {Function} 取消订阅函数
   */
  onStateChange(listener) {
    this.stateListeners.push(listener);
    return () => {
      const index = this.stateListeners.indexOf(listener);
      if (index > -1) this.stateListeners.splice(index, 1);
    };
  }

  /**
   * 获取当前状态
   * @returns {string}
   */
  getState() {
    return this.state;
  }

  // ===== Token 管理 =====

  /**
   * 设置认证 token
   * @param {string} token - 认证令牌
   * @param {string} refreshToken - 刷新令牌
   * @param {number} expiresIn - 过期时间(秒)
   */
  setToken(token, refreshToken = null, expiresIn = null) {
    this.token = token;
    tokenManager.setToken(token, refreshToken, expiresIn);
  }

  /**
   * 获取认证 token
   * @returns {string|null}
   */
  getToken() {
    if (!this.token) {
      this.token = tokenManager.getToken();
    }
    return this.token;
  }

  /**
   * 清除 token
   */
  clearToken() {
    this.token = null;
    tokenManager.clearToken();
  }

  // ===== 连接管理 =====

  /**
   * 初始化 WebSocket 连接
   * @param {string} url - WebSocket 服务器地址
   */
  connect(url) {
    if (!url) {
      throw new ConnectionError('WebSocket URL 不能为空');
    }

    this.url = url;
    this.isManualClose = false;
    this.setState(ConnectionState.CONNECTING);

    try {
      let wsUrl = url;
      const token = this.getToken();
      if (token) {
        wsUrl = url + (url.includes('?') ? '&' : '?') + `token=${encodeURIComponent(token)}`;
      }

      this.ws = new WebSocket(wsUrl);
      this.initEventListeners();
    } catch (error) {
      console.error('WebSocket 连接失败:', error);
      this.setState(ConnectionState.DISCONNECTED);
      this.reconnect();
    }
  }

  /**
   * 初始化事件监听
   */
  initEventListeners() {
    this.ws.onopen = () => {
      this.reconnectAttempts = 0;
      this.setState(ConnectionState.CONNECTED);
      this.heartbeat.start();
      this.requestManager.resendPendingRequests();
    };

    this.ws.onmessage = (event) => {
      try {
        const response = JSON.parse(event.data);

        // 1. 心跳消息
        if (this.heartbeat.handleMessage(response)) {
          return;
        }

        // 2. API 响应
        if (this.requestManager.handleResponse(response)) {
          return;
        }

        // 3. 其他消息
        this.messageHandler.dispatch(response);
      } catch (error) {
        console.error('消息处理失败:', error);
      }
    };

    this.ws.onerror = (error) => {
      console.error('WebSocket 错误:', error);
    };

    this.ws.onclose = () => {
      this.heartbeat.stop();

      if (this.isManualClose) {
        this.setState(ConnectionState.DISCONNECTED);
      } else {
        this.setState(ConnectionState.RECONNECTING);
        this.reconnect();
      }
    };
  }

  /**
   * 重新连接（指数退避策略）
   */
  reconnect() {
    if (this.isManualClose || !this.isOnline || this.reconnectTimer) {
      return;
    }

    this.reconnectAttempts++;
    const currentInterval = Math.min(
      this.reconnectInterval * Math.pow(2, this.reconnectAttempts - 1),
      this.maxReconnectInterval
    );

    this.reconnectTimer = setTimeout(() => {
      this.reconnectTimer = null;
      this.connect(this.url);
    }, currentInterval);
  }

  /**
   * 处理心跳超时
   */
  handleHeartbeatTimeout() {
    if (this.ws) {
      this.ws.close();
    }
  }

  // ===== 网络监听 =====

  /**
   * 设置网络状态监听
   */
  setupNetworkListeners() {
    this.handleOnline = () => {
      this.isOnline = true;
      if (!this.isConnected() && !this.isManualClose) {
        this.reconnectAttempts = 0;
        this.reconnect();
      }
    };

    this.handleOffline = () => {
      this.isOnline = false;
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    };

    window.addEventListener('online', this.handleOnline);
    window.addEventListener('offline', this.handleOffline);
  }

  // ===== 消息发送 =====

  /**
   * 发送消息
   * @param {any} data - 要发送的数据
   */
  send(data) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      const message = typeof data === 'string' ? data : JSON.stringify(data);
      this.ws.send(message);
    }
  }

  // ===== 请求方法 =====

  /**
   * 封装请求方法
   * @param {string} url - 接口路径
   * @param {string} method - 请求方式
   * @param {object} params - 参数
   * @param {object} options - 额外配置
   * @returns {Promise}
   */
  request(url, method = 'POST', params = {}, options = {}) {
    return this.requestManager.request(url, method, params, options, this.isConnected());
  }

  /**
   * GET 请求
   */
  get(url, params = {}, options = {}) {
    return this.request(url, 'GET', params, options);
  }

  /**
   * POST 请求
   */
  post(url, data = {}, options = {}) {
    return this.request(url, 'POST', data, options);
  }

  /**
   * PUT 请求
   */
  put(url, data = {}, options = {}) {
    return this.request(url, 'PUT', data, options);
  }

  /**
   * DELETE 请求
   */
  delete(url, params = {}, options = {}) {
    return this.request(url, 'DELETE', params, options);
  }

  // ===== 消息处理 =====

  /**
   * 添加消息处理器
   * @param {Function} handler - 消息处理函数
   */
  onMessage(handler) {
    this.messageHandler.onMessage(handler);
  }

  /**
   * 移除消息处理器
   * @param {Function} handler - 要移除的处理函数
   */
  offMessage(handler) {
    this.messageHandler.offMessage(handler);
  }

  /**
   * 添加通知处理器
   * @param {number|string} type - 通知类型
   * @param {Function} handler - 处理函数
   */
  onNotify(type, handler) {
    this.messageHandler.onNotify(type, handler);
  }

  /**
   * 移除通知处理器
   * @param {number|string} type - 通知类型
   * @param {Function} handler - 要移除的处理函数
   */
  offNotify(type, handler) {
    this.messageHandler.offNotify(type, handler);
  }

  // ===== 工具方法 =====

  /**
   * 生成唯一请求 ID
   * @returns {string}
   */
  generateRequestId() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 11);
  }

  /**
   * 获取当前页面路由
   * @returns {string}
   */
  getCurrentPage() {
    try {
      const router = window.__APP_ROUTER__;
      if (router && router.currentRoute) {
        const route = router.currentRoute.value;
        return route.path || route.name || 'unknown';
      }
      return window.location.pathname || 'unknown';
    } catch {
      return window.location.pathname || 'unknown';
    }
  }

  /**
   * 判断是否已连接
   * @returns {boolean}
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * 获取连接状态
   * @returns {number}
   */
  getReadyState() {
    return this.ws ? this.ws.readyState : WebSocket.CLOSED;
  }

  // ===== Token 过期处理 =====

  /**
   * 处理 Token 过期
   */
  async handleTokenExpired() {
    try {
      this.clearToken();
      const { useUserStore } = await import('@/stores/user.js');
      const userStore = useUserStore();
      userStore.clearUserInfo();
      userStore.openLoginModal();

      // 以游客身份重连
      if (this.ws && this.url) {
        this.isManualClose = true;
        this.heartbeat.stop();
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
        if (this.ws) {
          this.ws.close();
          this.ws = null;
        }
        this.isManualClose = false;
        this.reconnectAttempts = 0;
        this.connect(this.url);
      }
    } catch (error) {
      console.error('处理 Token 过期失败:', error);
    }
  }

  // ===== 登出 =====

  /**
   * 退出登录并重连
   */
  logout() {
    this.clearToken();
    if (this.ws && this.url) {
      this.isManualClose = true;
      this.heartbeat.stop();
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
      this.isManualClose = false;
      this.reconnectAttempts = 0;
      this.connect(this.url);
    }
  }

  // ===== 关闭和清理 =====

  /**
   * 关闭连接
   */
  close() {
    this.isManualClose = true;
    this.setState(ConnectionState.DISCONNECTING);
    this.heartbeat.stop();

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.setState(ConnectionState.DISCONNECTED);
  }

  /**
   * 清理所有资源
   */
  cleanup() {
    this.close();
    this.messageHandler.cleanup();
    this.requestManager.cleanup();
    this.stateListeners = [];
    window.removeEventListener('online', this.handleOnline);
    window.removeEventListener('offline', this.handleOffline);
  }
}

// 单例
const wsClient = new WebSocketClient();
export default wsClient;
