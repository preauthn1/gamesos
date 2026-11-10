/**
 * 心跳管理器
 * 负责维护与服务器的心跳连接
 */
import { HeartbeatType, DEFAULT_CONFIG } from './constants.js';

export class HeartbeatManager {
  constructor(options = {}) {
    this.interval = options.interval || DEFAULT_CONFIG.heartbeatInterval;
    this.timeout = options.timeout || DEFAULT_CONFIG.heartbeatTimeout;
    this.heartbeatTimer = null;
    this.timeoutTimer = null;
    this.lastPongTime = null;
    this.sendFn = null;
    this.onTimeoutFn = null;
    this.getPageFn = null;
    this.generateIdFn = null;
  }

  /**
   * 配置回调函数
   * @param {object} callbacks - 回调配置
   * @param {Function} callbacks.send - 发送消息函数
   * @param {Function} callbacks.onTimeout - 超时回调
   * @param {Function} callbacks.getPage - 获取当前页面
   * @param {Function} callbacks.generateId - 生成请求 ID
   */
  configure({ send, onTimeout, getPage, generateId }) {
    this.sendFn = send;
    this.onTimeoutFn = onTimeout;
    this.getPageFn = getPage;
    this.generateIdFn = generateId;
  }

  /**
   * 启动心跳
   */
  start() {
    this.stop();
    this.lastPongTime = Date.now();

    // 定时发送 ping
    // this.heartbeatTimer = setInterval(() => {
    //   this.sendPing();
    // }, this.interval);

    // 定时检查超时
    this.timeoutTimer = setInterval(() => {
      this.checkTimeout();
    }, this.timeout);
  }

  /**
   * 发送心跳 ping
   */
  sendPing() {
    if (this.sendFn) {
      this.sendFn({
        type: HeartbeatType.PING,
        _requestId: this.generateIdFn ? this.generateIdFn() : Date.now().toString(),
        page: this.getPageFn ? this.getPageFn() : 'unknown',
        data: {},
      });
    }
  }

  /**
   * 处理收到的心跳消息
   * @param {object} response - 响应数据
   * @returns {boolean} 是否是心跳消息
   */
  handleMessage(response) {
    // 收到服务器 ping，回复 pong
    if (response.type === HeartbeatType.PING) {
      if (this.sendFn) {
        this.sendFn({
          type: HeartbeatType.PONG,
          _requestId: this.generateIdFn ? this.generateIdFn() : Date.now().toString(),
          page: this.getPageFn ? this.getPageFn() : 'unknown',
          data: {},
        });
      }
      return true;
    }

    // 收到服务器 pong，更新最后心跳时间
    if (response.type === HeartbeatType.PONG) {
      this.lastPongTime = Date.now();
      return true;
    }

    return false;
  }

  /**
   * 检查心跳超时
   */
  checkTimeout() {
    // 如果从未收到过 pong，不检查
    if (!this.lastPongTime) {
      return;
    }

    // 超过 (心跳间隔 + 超时时间) 没收到 pong，判定为超时
    const elapsed = Date.now() - this.lastPongTime;
    if (elapsed > this.interval + this.timeout) {
      console.warn(`心跳超时 (${elapsed}ms)，连接可能已断开`);
      if (this.onTimeoutFn) {
        this.onTimeoutFn();
      }
    }
  }

  /**
   * 停止心跳
   */
  stop() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
    if (this.timeoutTimer) {
      clearInterval(this.timeoutTimer);
      this.timeoutTimer = null;
    }
    this.lastPongTime = null;
  }
}
