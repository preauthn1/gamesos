import request from "@/utils/request";

const BASE_URL = "/manage/v1/user_kyc";

const UserKycAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, UserKycInfo>({
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
    return request<any, UserKycListVO>({
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
  create(data: UserKycInfo) {
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
  update(data: UserKycInfo) {
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

export default UserKycAPI;

/** 查询参数 */
export interface UserKycPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  user_id?: string;
  user_name?: string;
}

/** 类型 */
export interface UserKycInfo {
  /**
   *  "id" int8 NOT NULL DEFAULT nextval('me_user_kyc_id_seq'::regclass),
  "user_id" int8 DEFAULT 0,
  "type" int2 DEFAULT 0,
  "name" varchar(50) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "id_number" varchar(32) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "id_photo" text COLLATE "pg_catalog"."default" DEFAULT ''::text,
  "audit_time" timestamp(6) DEFAULT NULL::timestamp without time zone,
  "status" int2 DEFAULT 0,
   */
  /** ID */
  id?: string;
  /** 用户ID */
  user_id?: string;
  /** 类型 */
  type?: number;
  /** 姓名 */
  name?: string;
  /** 身份证号码 */
  id_number?: string;
  /** 身份证照片 */
  id_photo: string | string[]; // 如果组件支持数组格式
  /** 审核时间 */
  audit_time?: string;
  /** 状态 */
  status?: number;
}

export interface UserKycList extends UserKycInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface UserKycListVO {
  /** 父级ID */
  total: number;
  list: UserKycList[];
}
