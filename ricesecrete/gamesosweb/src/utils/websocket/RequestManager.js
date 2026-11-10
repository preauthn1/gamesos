/**
 * 请求管理器
 * 负责管理请求队列、超时、重试
 */
import { DEFAULT_CONFIG } from './constants.js';
import { TimeoutError, NetworkError, BusinessError, TokenExpiredError } from './errors.js';

export class RequestManager {
  constructor(options = {}) {
    this.timeout = options.timeout || DEFAULT_CONFIG.requestTimeout;
    this.maxRetryCount = options.maxRetryCount || DEFAULT_CONFIG.maxRetryCount;
    this.maxQueueSize = options.maxQueueSize || DEFAULT_CONFIG.maxQueueSize;
    this.offlineRequestExpiry = options.offlineRequestExpiry || DEFAULT_CONFIG.offlineRequestExpiry;

    this.pendingRequests = new Map();
    this.offlineQueue = [];
    this.sendFn = null;
    this.onTokenExpiredFn = null;
  }

  /**
   * 配置回调函数
   * @param {object} callbacks - 回调配置
   * @param {Function} callbacks.send - 发送消息函数
   * @param {Function} callbacks.onTokenExpired - Token 过期回调
   */
  configure({ send, onTokenExpired }) {
    this.sendFn = send;
    this.onTokenExpiredFn = onTokenExpired;
  }

  /**
   * 生成请求 ID
   * @returns {string}
   */
  generateRequestId() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 11);
  }

  /**
   * 发送请求
   * @param {string} url - 接口路径
   * @param {string} method - 请求方式
   * @param {object} params - 参数
   * @param {object} options - 额外配置
   * @param {boolean} isConnected - 当前是否已连接
   * @returns {Promise}
   */
  request(url, method, params, options, isConnected) {
    return new Promise((resolve, reject) => {
      const requestId = this.generateRequestId();
      const timeout = options.timeout || this.timeout;

      const payload = {
        type: 'api',
        _requestId: requestId,
        data: { url, method, params },
      };

      const requestContext = {
        resolve,
        reject,
        payload,
        timeout,
        timeoutId: null,
        retryCount: 0,
        createdAt: Date.now(),
      };

      if (!isConnected) {
        // 未连接时，加入离线队列
        if (this.offlineQueue.length >= this.maxQueueSize) {
          reject(new NetworkError('请求队列已满，请稍后重试'));
          return;
        }
        this.offlineQueue.push({ requestId, ...requestContext });
        return;
      }

      // 设置超时
      requestContext.timeoutId = this.createTimeout(requestId, url, timeout);
      this.pendingRequests.set(requestId, requestContext);

      // 发送
      if (this.sendFn) {
        this.sendFn(payload);
      }
    });
  }

  /**
   * 创建超时定时器
   * @param {string} requestId - 请求 ID
   * @param {string} url - 请求 URL
   * @param {number} timeout - 超时时间
   * @returns {number} 定时器 ID
   */
  createTimeout(requestId, url, timeout) {
    return setTimeout(() => {
      if (this.pendingRequests.has(requestId)) {
        const { reject } = this.pendingRequests.get(requestId);
        this.pendingRequests.delete(requestId);
        reject(new TimeoutError(url, timeout));
      }
    }, timeout);
  }

  /**
   * 处理响应
   * @param {object} response - 响应数据
   * @returns {boolean} 是否处理了该响应
   */
  handleResponse(response) {
    const requestId = response._requestId;
    if (!requestId || !this.pendingRequests.has(requestId)) {
      return false;
    }

    const { resolve, reject, timeoutId } = this.pendingRequests.get(requestId);
    clearTimeout(timeoutId);
    this.pendingRequests.delete(requestId);

    if (response.code === 0) {
      resolve(response);
    } else if (response.code === 4001) {
      if (this.onTokenExpiredFn) {
        this.onTokenExpiredFn();
      }
      reject(new TokenExpiredError());
    } else {
      reject(new BusinessError(response.msg || response.message || '请求失败', response.code));
    }

    return true;
  }

  /**
   * 重连后重发请求（带重试限制）
   */
  resendPendingRequests() {
    // 处理待处理请求
    this.pendingRequests.forEach((context, requestId) => {
      if (!context.payload) return;

      context.retryCount++;
      if (context.retryCount > this.maxRetryCount) {
        clearTimeout(context.timeoutId);
        context.reject(new NetworkError(`请求重试次数超限: ${context.payload.data.url}`));
        this.pendingRequests.delete(requestId);
        return;
      }

      // 重置超时
      clearTimeout(context.timeoutId);
      context.timeoutId = this.createTimeout(
        requestId,
        context.payload.data.url,
        context.timeout
      );

      if (this.sendFn) {
        this.sendFn(context.payload);
      }
    });

    // 处理离线队列
    while (this.offlineQueue.length > 0) {
      const context = this.offlineQueue.shift();

      // 检查请求是否过期
      if (Date.now() - context.createdAt > this.offlineRequestExpiry) {
        context.reject(new TimeoutError(context.payload.data.url, this.offlineRequestExpiry));
        continue;
      }

      const requestId = context.payload._requestId;
      context.timeoutId = this.createTimeout(
        requestId,
        context.payload.data.url,
        context.timeout
      );
      this.pendingRequests.set(requestId, context);

      if (this.sendFn) {
        this.sendFn(context.payload);
      }
    }
  }

  /**
   * 获取待处理请求数量
   * @returns {number}
   */
  getPendingCount() {
    return this.pendingRequests.size;
  }

  /**
   * 获取离线队列数量
   * @returns {number}
   */
  getOfflineQueueCount() {
    return this.offlineQueue.length;
  }

  /**
   * 清理所有请求
   */
  cleanup() {
    this.pendingRequests.forEach(({ reject, timeoutId }) => {
      clearTimeout(timeoutId);
      reject(new NetworkError('WebSocket 已关闭'));
    });
    this.pendingRequests.clear();

    this.offlineQueue.forEach(({ reject }) => {
      reject(new NetworkError('WebSocket 已关闭'));
    });
    this.offlineQueue = [];
  }
}
