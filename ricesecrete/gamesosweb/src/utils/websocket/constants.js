/**
 * WebSocket 常量定义
 */

/**
 * 连接状态枚举
 */
export const ConnectionState = {
  DISCONNECTED: 'DISCONNECTED',
  CONNECTING: 'CONNECTING',
  CONNECTED: 'CONNECTED',
  RECONNECTING: 'RECONNECTING',
  DISCONNECTING: 'DISCONNECTING',
};

/**
 * 心跳消息类型
 */
export const HeartbeatType = {
  PING: 'ping',
  PONG: 'pong',
};

/**
 * 消息类型
 */
export const MessageType = {
  API: 'api',
  PING: 'ping',
  PONG: 'pong',
  NOTIFY: 'notify_message',
};

/**
 * 默认配置
 */
export const DEFAULT_CONFIG = {
  reconnectInterval: 3000,      // 初始重连间隔 3 秒
  maxReconnectInterval: 30000,  // 最大重连间隔 30 秒
  heartbeatInterval: 15000,     // 心跳间隔 15 秒
  heartbeatTimeout: 5000,       // 心跳超时 5 秒
  requestTimeout: 10000,        // 请求超时 10 秒
  maxRetryCount: 3,             // 最大重试次数
  maxQueueSize: 100,            // 最大离线队列大小
  offlineRequestExpiry: 30000,  // 离线请求过期时间 30 秒
};
