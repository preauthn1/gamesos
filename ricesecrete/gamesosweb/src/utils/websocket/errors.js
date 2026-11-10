/**
 * WebSocket 自定义错误类
 */

/**
 * WebSocket 错误基类
 */
export class WebSocketError extends Error {
  constructor(message, code = 'WS_ERROR') {
    super(message);
    this.name = 'WebSocketError';
    this.code = code;
  }
}

/**
 * 连接错误
 */
export class ConnectionError extends WebSocketError {
  constructor(message) {
    super(message, 'CONNECTION_ERROR');
    this.name = 'ConnectionError';
  }
}

/**
 * 请求超时错误
 */
export class TimeoutError extends WebSocketError {
  constructor(url, timeout) {
    super(`请求超时: ${url} (${timeout}ms)`, 'TIMEOUT_ERROR');
    this.name = 'TimeoutError';
    this.url = url;
    this.timeout = timeout;
  }
}

/**
 * 网络错误
 */
export class NetworkError extends WebSocketError {
  constructor(message) {
    super(message, 'NETWORK_ERROR');
    this.name = 'NetworkError';
  }
}

/**
 * 业务错误
 */
export class BusinessError extends WebSocketError {
  constructor(message, businessCode) {
    super(message, 'BUSINESS_ERROR');
    this.name = 'BusinessError';
    this.businessCode = businessCode;
  }
}

/**
 * Token 过期错误
 */
export class TokenExpiredError extends WebSocketError {
  constructor() {
    super('Token 已过期，请重新登录', 'TOKEN_EXPIRED');
    this.name = 'TokenExpiredError';
  }
}
