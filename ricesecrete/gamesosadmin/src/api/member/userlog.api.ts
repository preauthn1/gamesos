import request from "@/utils/request";

const BASE_URL = "/manage/v1/user_log";

const UserLogAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, UserLogInfo>({
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
    return request<any, UserLogListVO>({
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
  create(data: UserLogInfo) {
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
  update(data: UserLogInfo) {
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

export default UserLogAPI;

/** 查询参数 */
export interface UserLogPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 用户ID */
  user_id?: string;
  /** 用户名称 */
  user_name?:string;
}

/** 类型 */
export interface UserLogInfo {

  /**
   *  "user_id" int8 DEFAULT 0,
  "ip" varchar(40) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "area" varchar(50) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "type" int2 DEFAULT 0,
  "device" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "uuid" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
   */
  /** ID */
  id?: string;
  /** 用户ID */
  user_id?: string;
  /** IP */
  ip?: string;
  /** 地区 */
  area?: string;
  /** 类型 */
  type?: string;
  /** 设备 */
  device?: string;
  /** UUID */
  uuid?: string;
}

export interface UserLogList extends UserLogInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface UserLogListVO {
  /** 父级ID */
  total: number;
  list: UserLogList[];
}
