/**
 * 消息处理器
 * 负责消息分发和处理
 */
import { MessageType } from './constants.js';

export class MessageHandler {
  constructor() {
    this.handlers = [];
    this.notifyHandlers = new Map();
  }

  /**
   * 注册消息处理器
   * @param {Function} handler - 消息处理函数
   */
  onMessage(handler) {
    if (typeof handler === 'function') {
      this.handlers.push(handler);
    }
  }

  /**
   * 移除消息处理器
   * @param {Function} handler - 要移除的处理函数
   */
  offMessage(handler) {
    const index = this.handlers.indexOf(handler);
    if (index > -1) {
      this.handlers.splice(index, 1);
    }
  }

  /**
   * 注册通知处理器（按类型订阅）
   * @param {number|string} type - 通知类型
   * @param {Function} handler - 处理函数
   */
  onNotify(type, handler) {
    if (typeof handler !== 'function') return;
    if (!this.notifyHandlers.has(type)) {
      this.notifyHandlers.set(type, []);
    }
    this.notifyHandlers.get(type).push(handler);
  }

  /**
   * 移除通知处理器
   * @param {number|string} type - 通知类型
   * @param {Function} handler - 要移除的处理函数
   */
  offNotify(type, handler) {
    if (this.notifyHandlers.has(type)) {
      const handlers = this.notifyHandlers.get(type);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * 分发消息
   * @param {object} data - 消息数据
   */
  dispatch(data) {
    // 处理服务器推送的通知消息
    if (data.type === MessageType.NOTIFY && data.data) {
      this.dispatchNotify(data.data);
    }

    // 调用通用消息处理器
    this.handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error('消息处理器执行出错:', error);
      }
    });
  }

  /**
   * 分发通知消息
   * @param {object} notifyData - 通知数据 { type, data }
   */
  dispatchNotify(notifyData) {
    const { type, data } = notifyData;

    if (this.notifyHandlers.has(type)) {
      this.notifyHandlers.get(type).forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`通知处理器[${type}]执行出错:`, error);
        }
      });
    }
  }

  /**
   * 清理所有处理器
   */
  cleanup() {
    this.handlers = [];
    this.notifyHandlers.clear();
  }
}
