import request from "@/utils/request";

const BASE_URL = "/manage/v1/message_list";

const MessageAPI = {
  /**
   * 获取消息列表
   * @param queryParams 查询参数
   * @returns 消息列表响应
   */
  getPage(queryParams: MessagePageQuery) {
    return request<any, MessageListVO>({
      url: `${BASE_URL}/select`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 发送消息
   * @param data 发送消息参数
   * @returns 发送消息响应
   */
  create(data: SendMessageParams) {
    return request({
      url: `${BASE_URL}/send`,
      method: "post",
      data: data,
    });
  },

  /**
   * 删除消息
   * @param data 删除参数
   * @returns 删除响应
   */
  deleteByIds(data: { message_ids: string[] }) {
    return request({
      url: `${BASE_URL}/delete`,
      method: "post",
      data: data,
    });
  },

  /**
   * 获取消息详情
   * @param queryParams 查询参数
   * @returns 消息详情
   */
  getInfo(queryParams: { message_id: string }) {
    return request<any, MessageInfo>({
      url: `${BASE_URL}/info`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 更新消息
   * @param data 更新数据
   * @returns 更新后的消息
   */
  update(data: Partial<MessageInfo> & { message_id: string }) {
    return request({
      url: `${BASE_URL}/update`,
      method: "post",
      data: data,
    });
  },

  /**
   * 标记消息已读
   * @param data 标记已读参数
   * @returns 操作结果
   */
  markRead(data: { 
    conversation_id: string; 
    user_id: number; 
    message_id?: string 
  }) {
    return request({
      url: `${BASE_URL}/read`,
      method: "post",
      data: data,
    });
  },

  /**
   * 获取未读消息计数
   * @param queryParams 查询参数
   * @returns 未读消息统计
   */
  getUnreadCount(queryParams: { user_id: number; conversation_id?: string }) {
    return request({
      url: `${BASE_URL}/unread-count`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 导出消息数据
   * @param queryParams 导出参数
   * @returns 导出数据
   */
  export(queryParams: { 
    conversation_id: string; 
    start_date?: string; 
    end_date?: string 
  }) {
    return request<any, any>({
      url: `${BASE_URL}/export`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 搜索消息
   * @param queryParams 搜索参数
   * @returns 搜索结果
   */
  search(queryParams: { 
    keyword: string; 
    user_id?: number; 
    conversation_id?: string; 
    limit?: number 
  }) {
    return request({
      url: `${BASE_URL}/search`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 批量标记消息已读
   * @param data 批量操作参数
   * @returns 批量操作结果
   */
  batchMarkRead(data: { 
    user_id: number; 
    conversation_ids?: string[] 
  }) {
    return request({
      url: `${BASE_URL}/batch-read`,
      method: "post",
      data: data,
    });
  },
};

export default MessageAPI;

/** 消息查询参数 */
export interface MessagePageQuery {
  /** 页码 */
  page: number;
  /** 每页数量 */
  pageSize: number;
  /** 会话ID */
  conversation_id?: string;
  /** 消息类型 */
  message_type?: number;
  /** 发送者ID */
  sender_id?: number;
  /** 开始时间 */
  start_time?: string;
  /** 结束时间 */
  end_time?: string;
  /** 搜索关键词 */
  keyword?: string;
}

/** 发送消息参数 */
export interface SendMessageParams {
  /** 会话ID */
  conversation_id: string;
  /** 消息内容 */
  content: string;
  /** 消息类型 */
  message_type?: number;
  /** 发送者ID */
  sender_id?: number;
  /** 接收者ID */
  receiver_id?: number;
  /** 文件路径 */
  file_path?: string;
  /** 文件类型 */
  file_type?: string;
  /** 文件大小 */
  file_size?: number;
  /** 图片宽度 */
  image_width?: number;
  /** 图片高度 */
  image_height?: number;
  /** 消息状态 */
  status?: number;
}

/** 消息信息 */
export interface MessageInfo {
  /** 消息ID */
  message_id: string;
  /** 会话ID */
  conversation_id: string;
  /** 发送者ID */
  sender_id: number;
  /** 接收者ID */
  receiver_id?: number;
  /** 消息内容 */
  content: string;
  /** 消息类型 */
  message_type: number;
  /** 文件路径 */
  file_path?: string;
  /** 文件类型 */
  file_type?: string;
  /** 文件大小 */
  file_size?: number;
  /** 图片宽度 */
  image_width?: number;
  /** 图片高度 */
  image_height?: number;
  /** 消息状态 */
  status: number;
  /** 是否已读 */
  is_read: number;
  /** 发送时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
  /** 删除时间 */
  deleted_at?: string;
}

/** 消息列表项 */
export interface MessageList extends MessageInfo {
  /** 发送者信息 */
  sender_info?: {
    user_id: number;
    username: string;
    avatar?: string;
  };
  /** 接收者信息 */
  receiver_info?: {
    user_id?: number;
    username?: string;
    avatar?: string;
  };
  /** 会话名称 */
  conversation_name?: string;
  /** 消息类型（兼容前端使用） */
  type: number;
  /** 额外信息 */
  extra?: {
    read_count?: number;
    attachment_url?: string;
    attachment_name?: string;
    attachment_size?: number;
  };
}

/** 消息列表响应 */
export interface MessageListVO {
  /** 总数量 */
  total: number;
  /** 消息列表 */
  list: MessageList[];
}