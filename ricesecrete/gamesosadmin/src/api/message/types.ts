/**
 * 消息模块 TypeScript 类型定义
 */

/** 会话类型 */
export enum ConversationType {
  /** 单聊 */
  SINGLE = 1,
  /** 群聊 */
  GROUP = 2
}

/** 会话状态 */
export enum ConversationStatus {
  /** 正常 */
  NORMAL = 1,
  /** 已删除 */
  DELETED = 2
}

/** 成员角色 */
export enum MemberRole {
  /** 普通成员 */
  MEMBER = 1,
  /** 管理员 */
  ADMIN = 2,
  /** 群主 */
  OWNER = 3
}

/** 成员状态 */
export enum MemberStatus {
  /** 正常 */
  NORMAL = 1,
  /** 已退出 */
  QUIT = 2,
  /** 被踢出 */
  KICKED = 3
}

/** 消息类型 */
export enum MessageType {
  /** 文本消息 */
  TEXT = 1,
  /** 图片消息 */
  IMAGE = 2,
  /** 语音消息 */
  VOICE = 3,
  /** 文件消息 */
  FILE = 4,
  /** 视频消息 */
  VIDEO = 5,
  /** 位置消息 */
  LOCATION = 6,
  /** 系统消息 */
  SYSTEM = 99
}

/** 消息状态 */
export enum MessageStatus {
  /** 发送中 */
  SENDING = 0,
  /** 已发送 */
  SENT = 1,
  /** 已送达 */
  DELIVERED = 2,
  /** 已读 */
  READ = 3,
  /** 发送失败 */
  FAILED = 4,
  /** 已删除 */
  DELETED = 5
}

/** 分页查询参数 */
export interface PageQuery {
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
}

/** 基础响应 */
export interface BaseResponse<T = any> {
  /** 状态码 */
  code: number;
  /** 消息 */
  message: string;
  /** 数据 */
  data: T;
  /** 时间戳 */
  timestamp: number;
}

/** 删除响应 */
export interface DeleteResponse {
  /** 删除数量 */
  deleted_count: number;
}

/** 错误响应 */
export interface ErrorResponse {
  /** 错误码 */
  code: number;
  /** 错误消息 */
  message: string;
  /** 错误详情 */
  details?: any;
}