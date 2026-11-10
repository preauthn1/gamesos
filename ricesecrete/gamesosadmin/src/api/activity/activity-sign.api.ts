import request from "@/utils/request";
import type { ResponseData } from "@/types/global";
import type {
  SignConfigInfo,
  SignConfigListVO,
  SignRecordInfo,
  SignRecordListVO,
  SignStats,
  SignConfigPageQuery,
  SignRecordPageQuery,
  SignStatsQuery,
  PageQuery
} from "@/types/activity";

const BASE_URL = "/manage/v1/activity_sign";

const ActivitySignAPI = {
  /**
   * 获取信息
   * @returns 签到配置信息
   */
  getInfo(queryParams: SignConfigPageQuery): Promise<SignConfigInfo> {
    return request<ResponseData<SignConfigInfo>>({
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
  getPage(queryParams: SignConfigPageQuery): Promise<SignConfigListVO> {
    return request<ResponseData<SignConfigListVO>>({
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
  create(data: SignConfigInfo): Promise<void> {
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
  update(data: SignConfigInfo): Promise<void> {
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
  export(queryParams: SignConfigPageQuery): Promise<{ download_url: string; filename: string }> {
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
   * 用户签到
   * @param data 签到数据
   */
  sign(data: { user_id: number; activity_id: number; sign_config_id: number }): Promise<{ success: boolean; reward?: any }> {
    return request<ResponseData<{ success: boolean; reward?: any }>>({
      url: `${BASE_URL}/sign`,
      method: "post",
      data: data,
    });
  },

  /**
   * 获取签到记录
   */
  getSignRecords(queryParams: SignRecordPageQuery): Promise<SignRecordListVO> {
    return request<ResponseData<SignRecordListVO>>({
      url: `${BASE_URL}/sign_records`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 获取签到统计
   */
  getSignStats(queryParams?: SignStatsQuery): Promise<SignStats> {
    return request<ResponseData<SignStats>>({
      url: `${BASE_URL}/sign_stats`,
      method: "get",
      params: queryParams,
    });
  },
};

export default ActivitySignAPI;

/** 查询参数 */
export interface SignConfigPageQuery extends PageQuery {
  /** 活动ID */
  activity_id?: number;
  /** 配置名称 */
  name?: string;
  /** 状态 */
  status?: number;
}

/** 签到配置信息 */
export interface SignConfigInfo {
  /** ID */
  id?: number;
  /** 活动ID */
  activity_id?: number;
  /** 配置名称 */
  name?: string;
  /** 签到类型 */
  sign_type?: number;
  /** 连续签到天数 */
  continuous_days?: number;
  /** 奖励类型 */
  reward_type?: number;
  /** 奖励值 */
  reward_value?: number;
  /** 状态 */
  status?: number;
  /** 排序 */
  sort?: number;
  /** 描述 */
  description?: string;
  /** 创建时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}

export interface SignConfigList extends SignConfigInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface SignConfigListVO {
  /** 总数 */
  total: number;
  /** 列表 */
  list: SignConfigList[];
}

/** 签到记录信息 */
export interface SignRecordInfo {
  /** ID */
  id?: number;
  /** 用户ID */
  user_id?: number;
  /** 活动ID */
  activity_id?: number;
  /** 签到配置ID */
  sign_config_id?: number;
  /** 签到日期 */
  sign_date?: string;
  /** 连续签到天数 */
  continuous_days?: number;
  /** 奖励类型 */
  reward_type?: number;
  /** 奖励值 */
  reward_value?: number;
  /** 创建时间 */
  created_at?: string;
}

export interface SignRecordList extends SignRecordInfo {
  /** 创建时间 */
  created_at: string;
}

export interface SignRecordListVO {
  /** 总数 */
  total: number;
  /** 列表 */
  list: SignRecordList[];
}

/** 签到统计信息 */
export interface SignStats {
  /** 总签到配置数 */
  total_configs: number;
  /** 启用配置数 */
  enabled_configs: number;
  /** 总签到次数 */
  total_signs: number;
  /** 今日签到次数 */
  today_signs: number;
  /** 总奖励发放 */
  total_rewards: number;
  /** 今日奖励发放 */
  today_rewards: number;
}

/** 签到类型枚举 */
export enum SignType {
  /** 每日签到 */
  DAILY = 1,
  /** 连续签到 */
  CONTINUOUS = 2,
  /** 累计签到 */
  CUMULATIVE = 3
}

/** 奖励类型枚举 */
export enum RewardType {
  /** 积分 */
  POINTS = 1,
  /** 金币 */
  COINS = 2,
  /** 优惠券 */
  COUPON = 3,
  /** 实物 */
  PHYSICAL = 4
}

/** 签到配置状态枚举 */
export enum SignConfigStatus {
  /** 禁用 */
  DISABLED = 0,
  /** 启用 */
  ENABLED = 1
}