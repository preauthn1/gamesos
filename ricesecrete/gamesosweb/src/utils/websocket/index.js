/**
 * WebSocket 模块入口
 * 保持向后兼容的 API
 */
import wsClient from './WebSocketClient.js';

// 导出状态枚举和常量
export { ConnectionState, MessageType, DEFAULT_CONFIG } from './constants.js';

// 导出错误类型
export {
  WebSocketError,
  ConnectionError,
  TimeoutError,
  NetworkError,
  BusinessError,
  TokenExpiredError,
} from './errors.js';

// 默认导出 wsClient 单例（保持向后兼容）
export default wsClient;
