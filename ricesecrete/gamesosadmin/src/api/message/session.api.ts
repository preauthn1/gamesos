import request from "@/utils/request";

const BASE_URL = "/manage/v1/message_session";

const SessionAPI = {
  /**
   * 获取会话列表
   * @param queryParams 查询参数
   * @returns 会话列表响应
   */
  getPage(queryParams: SessionPageQuery) {
    return request<any, SessionListVO>({
      url: `${BASE_URL}/select`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 获取会话详情
   * @param queryParams 查询参数
   * @returns 会话详情
   */
  getInfo(queryParams: { conversation_id: string }) {
    return request<any, SessionInfo>({
      url: `${BASE_URL}/info`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 删除会话
   * @param data 删除参数
   * @returns 删除响应
   */
  deleteByIds(data: { conversation_ids: string[] }) {
    return request({
      url: `${BASE_URL}/delete`,
      method: "post",
      data: data,
    });
  },

  /**
   * 更新会话信息
   * @param data 更新数据
   * @returns 更新后的会话信息
   */
  update(data: Partial<SessionInfo> & { conversation_id: string }) {
    return request({
      url: `${BASE_URL}/update`,
      method: "post",
      data: data,
    });
  },

  /**
   * 添加会话成员
   * @param data 添加成员参数
   * @returns 操作结果
   */
  addMembers(data: { 
    conversation_id: string; 
    user_ids: number[]; 
    role?: number 
  }) {
    return request({
      url: `${BASE_URL}/add-members`,
      method: "post",
      data: data,
    });
  },

  /**
   * 移除会话成员
   * @param data 移除成员参数
   * @returns 操作结果
   */
  removeMembers(data: { 
    conversation_id: string; 
    user_ids: number[]; 
    status?: number 
  }) {
    return request({
      url: `${BASE_URL}/remove-members`,
      method: "post",
      data: data,
    });
  },

  /**
   * 获取会话成员列表
   * @param queryParams 查询参数
   * @returns 成员列表
   */
  getMembers(queryParams: { 
    conversation_id: string; 
    status?: number; 
    page?: number; 
    pageSize?: number 
  }) {
    return request({
      url: `${BASE_URL}/members`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 导出会话数据
   * @param queryParams 导出参数
   * @returns 导出数据
   */
  export(queryParams: SessionPageQuery) {
    return request<any, any>({
      url: `${BASE_URL}/export`,
      method: "get",
      params: queryParams,
    });
  },
};

export default SessionAPI;

/** 会话查询参数 */
export interface SessionPageQuery {
  keywords?: string;
  /** 页码 */
  page?: number;
  /** 每页数量 */
  pageSize?: number;
  /** 搜索关键词 */
  keyword?: string;
  /** 会话类型 */
  conversation_type?: number;
  /** 会话状态 */
  status?: number;
  /** 创建者ID */
  creator_id?: number;
  /** 开始时间 */
  start_time?: string;
  /** 结束时间 */
  end_time?: string;
  /** 排序字段 */
  sort_field?: string;
  /** 排序方式 */
  sort_order?: 'asc' | 'desc';
}

/** 会话信息 */
export interface SessionInfo {
  /** 会话ID */
  conversation_id: string;
  /** 会话名称 */
  conversation_name: string;
  /** 会话类型 */
  conversation_type: number;
  /** 会话头像 */
  avatar?: string;
  /** 会话描述 */
  description?: string;
  /** 创建者ID */
  creator_id: number;
  /** 最大成员数 */
  max_members?: number;
  /** 当前成员数 */
  member_count: number;
  /** 最后消息ID */
  last_message_id?: string;
  /** 最后消息内容 */
  last_message_content?: string;
  /** 最后消息时间 */
  last_message_time?: string;
  /** 最后消息发送者ID */
  last_message_sender_id?: number;
  /** 未读消息数 */
  unread_count: number;
  /** 会话状态 */
  status: number;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
  /** 删除时间 */
  deleted_at?: string;
}

/** 会话列表项 */
export interface SessionList extends SessionInfo {
  /** 创建者名称 */
  creator_name?: string;
  /** 创建者头像 */
  creator_avatar?: string;
  /** 最后消息发送者名称 */
  last_message_sender_name?: string;
  /** 最后消息发送者头像 */
  last_message_sender_avatar?: string;
  /** 成员列表 */
  members?: SessionMember[];
}

/** 会话成员信息 */
export interface SessionMember {
  /** 成员ID */
  user_id: number;
  /** 会话ID */
  conversation_id: string;
  /** 成员角色 */
  role: number;
  /** 加入时间 */
  joined_at: string;
  /** 最后阅读时间 */
  last_read_time?: string;
  /** 成员状态 */
  status: number;
  /** 用户名称 */
  user_name?: string;
  /** 用户头像 */
  user_avatar?: string;
  /** 用户昵称 */
  nickname?: string;
}

/** 会话列表响应 */
export interface SessionListVO {
  /** 总数量 */
  total: number;
  /** 会话列表 */
  list: SessionList[];
}