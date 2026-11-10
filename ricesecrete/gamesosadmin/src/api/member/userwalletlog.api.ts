import request from "@/utils/request";

const BASE_URL = "/manage/v1/user_wallet_log";

const UserWalletLogAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, UserWalletLogInfo>({
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
  getPage(queryParams: object) {
    return request<any, UserWalletLogListVO>({
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
  create(data: UserWalletLogInfo) {
    return request({
      url: `${BASE_URL}/insert`,
      method: "post",
      data: data,
    });
  },

  /**
   * 修改
   *
   * @param id ID
   * @param data 表单数据
   */
  update(data: UserWalletLogInfo) {
    return request({
      url: `${BASE_URL}/update`,
      method: "post",
      data: data,
    });
  },

  /**
   * 导出文件
   * @param queryParams
   * @returns
   */
  export(queryParams: object) {
    return request<any, any>({
      url: `${BASE_URL}/export`,
      method: "get",
      params: queryParams,
    });
  },
  /**
   * 批量删除，多个以英文逗号(,)分割
   *
   * @param ids ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(data: object) {
    return request({
      url: `${BASE_URL}/delete`,
      method: "post",
      data: data,
    });
  },
};

export default UserWalletLogAPI;

/** 查询参数 */
export interface UserWalletLogPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  user_id?: string;
  change?: number;
  /** 类型 */
  type?: number;
  /** 明细类型 */
  detail_type?: number;
  user_name?: string;
}

/** 类型 */
export interface UserWalletLogInfo {
  /**
    "user_id" int8 DEFAULT 0,
  "admin_id" int4 DEFAULT 0,
  "business_id" int8 DEFAULT 0,
  "type" int2 DEFAULT 0,
  "detail_type" int2 DEFAULT 1,
  "change" int2 DEFAULT 0,
  "balance" numeric(20,2) DEFAULT 0,
  "before" numeric(20,2) DEFAULT 0,
  "after" numeric(20,2) DEFAULT 0,
  "title" varchar(50) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "remarks" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
   */
  /** ID */
  id?: string;
  /** 用户ID */
  user_id?: string;
  /// RPC用户ID
  rpc_user_id?: string;
  /** 管理员ID */
  admin_id?: string;
  /** 业务ID */
  business_id?: string;
  /** 类型 */
  type?: number;
  /** 明细类型 */
  detail_type?: number;
  /** 变动 */
  change?: number;
  /** 账户余额 */
  balance?: number;
  /** 之前 */
  before?: number;
  /** 之后 */
  after?: number;
  /** 标题 */
  title?: string;
  /** 备注 */
  remarks?: string;
}

export interface UserWalletLogList extends UserWalletLogInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface UserWalletLogListVO {
  /** 父级ID */
  total: number;
  list: UserWalletLogList[];
}
