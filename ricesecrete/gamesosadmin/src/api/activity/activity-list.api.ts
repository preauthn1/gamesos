import request from "@/utils/request";
import type { ResponseData } from "@/types/global";

const BASE_URL = "/manage/v1/activity_list";

const ActivityListAPI = {
  /**
   * 获取信息
   * @returns 活动信息
   */
  getInfo(queryParams: ActivityPageQuery): Promise<ActivityInfo> {
    return request<ResponseData<ActivityInfo>>({
      url: `${BASE_URL}/info`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 获取分页列表
   *
   * @param queryParams 查询参数
   */
  getPage(queryParams: ActivityPageQuery): Promise<ActivityListVO> {
    return request<ResponseData<ActivityListVO>>({
      url: `${BASE_URL}/select`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 添加
   *
   * @param data 表单数据
   */
  create(data: ActivityInfo): Promise<void> {
    return request({
      url: `${BASE_URL}/insert`,
      method: "post",
      data: data,
    });
  },

  /**
   * 修改
   *
   * @param data 表单数据
   */
  update(data: ActivityInfo): Promise<void> {
    return request({
      url: `${BASE_URL}/update`,
      method: "post",
      data: data,
    });
  },

  /**
   * 导出文件
   * @param queryParams 查询参数
   * @returns 导出文件响应
   */
  export(queryParams: ActivityPageQuery): Promise<{ download_url: string; filename: string }> {
    return request<ResponseData<{ download_url: string; filename: string }>>({
      url: `${BASE_URL}/export`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 批量删除，多个以英文逗号(,)分割
   *
   * @param data 删除数据，包含id字段
   */
  deleteByIds(data: { id: string }): Promise<void> {
    return request({
      url: `${BASE_URL}/delete`,
      method: "post",
      data: data,
    });
  },

  /**
   * 获取统计信息
   */
  getStats(): Promise<ActivityStats> {
    return request<ResponseData<ActivityStats>>({
      url: `${BASE_URL}/stats`,
      method: "get",
    });
  },
};

export default ActivityListAPI;

/** 查询参数 */
export interface ActivityPageQuery extends PageQuery {
  /** 活动标题 */
  title?: string;
  /** 分类ID */
  category_id?: number;
  /** 活动类型 */
  activity_type?: number;
  /** 状态 */
  status?: number;
  /** 开始时间-开始 */
  start_time_start?: string;
  /** 开始时间-结束 */
  start_time_end?: string;
  /** 结束时间-开始 */
  end_time_start?: string;
  /** 结束时间-结束 */
  end_time_end?: string;
}

/** 活动信息 */
export interface ActivityInfo {
  /** ID */
  id?: number;
  /** 活动标题 */
  title?: string;
  /** 分类ID */
  category_id?: number;
  /** 分类名称 */
  category_name?: string;
  /** 活动类型 */
  activity_type?: number;
  /** 开始时间 */
  start_time?: string;
  /** 结束时间 */
  end_time?: string;
  /** 状态 */
  status?: number;
  /** 排序 */
  sort?: number;
  /** 描述 */
  description?: string;
  /** 封面图片 */
  cover_image?: string;
  /** 规则配置 */
  rule_config?: Record<string, any>;
  /** 奖励配置 */
  reward_config?: Record<string, any>;
  /** 参与人数 */
  participant_count?: number;
  /** 浏览人数 */
  view_count?: number;
  /** 创建时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}

export interface ActivityList extends ActivityInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface ActivityListVO {
  /** 总数 */
  total: number;
  /** 列表 */
  list: ActivityList[];
}

/** 活动统计信息 */
export interface ActivityStats {
  /** 总活动数 */
  total_activities: number;
  /** 已发布活动数 */
  published_activities: number;
  /** 进行中活动数 */
  ongoing_activities: number;
  /** 已结束活动数 */
  ended_activities: number;
  /** 总参与人数 */
  total_participants: number;
  /** 总浏览人数 */
  total_views: number;
}

/** 活动类型枚举 */
export enum ActivityType {
  /** 普通活动 */
  NORMAL = 1,
  /** 签到活动 */
  SIGN = 2,
  /** 转盘活动 */
  TURNTABLE = 3
}

/** 活动状态枚举 */
export enum ActivityStatus {
  /** 草稿 */
  DRAFT = 0,
  /** 已发布 */
  PUBLISHED = 1,
  /** 已结束 */
  ENDED = 2,
  /** 已取消 */
  CANCELLED = 3
}