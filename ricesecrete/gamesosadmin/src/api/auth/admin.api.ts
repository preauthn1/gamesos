import request from "@/utils/request";

const BASE_URL = "/manage/v1/auth_admin";
const AdminAPI = {
  /**
   * 获取当前登录用户信息
   *
   * @returns 登录用户昵称、头像信息，包括和权限
   */
  getInfo() {
    return request<any, UserInfo>({
      url: `${BASE_URL}/info`,
      method: "get",
    });
  },

  /**
   * 获取用户分页列表
   *
   * @param queryParams 查询参数
   */
  getPage(queryParams: object) {
    return request<any, UserListVO>({
      url: `${BASE_URL}/select`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 添加用户
   *
   * @param data 用户表单数据
   */
  create(data: object) {
    return request({
      url: `${BASE_URL}/insert`,
      method: "post",
      data: data,
    });
  },

  /**
   * 修改用户
   *
   * @param id 用户ID
   * @param data 用户表单数据
   */
  update(data: object) {
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
   * 批量删除用户，多个以英文逗号(,)分割
   *
   * @param ids 用户ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(data: object) {
    return request({
      url: `${BASE_URL}/delete`,
      method: "post",
      data: data,
    });
  },
};

export default AdminAPI;

/** 登录用户信息 */
export interface UserInfo {
  /** 用户ID */
  userId?: string;

  /** 用户名 */
  username?: string;

  /** 昵称 */
  nickname?: string;

  /** 头像URL */
  avatar?: string;

  /**  */
  roles: string[];

  /** 权限 */
  perms: string[];
}

/**
 * 用户分页查询对象
 */
export interface UserPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 用户状态 */
  status?: string;

  /** 部门ID */
  role_id?: string;

  /** 开始时间 */
  created_at?: [string, string];
}

/**
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增ID',
  `created_at` bigint DEFAULT NULL COMMENT '创建时间戳',
  `updated_at` bigint DEFAULT NULL COMMENT '更新时间戳',
  `deleted_at` datetime(3) DEFAULT NULL,
  `username` varchar(191) COLLATE utf8mb4_general_ci NOT NULL COMMENT '登录用户名',
  `password` longtext COLLATE utf8mb4_general_ci NOT NULL COMMENT '登录密码',
  `nickname` varchar(191) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '昵称',
  `avatar` varchar(191) COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '头像地址',
  `status` tinyint unsigned DEFAULT '1' COMMENT '状态标识，0禁用，1正常',
  `group_id` bigint DEFAULT '0' COMMENT '权限组id',
  `login_num` bigint unsigned DEFAULT '0' COMMENT '登录次数',
  `login_last_ip` varchar(191) COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '最后登录IP',
  `login_last_dt` bigint unsigned DEFAULT NULL COMMENT '最后登录时间',
 */
export interface UserBaseVO {
  /** 用户ID */
  id: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 用户头像URL */
  avatar?: string;
  /** 状态标识，0禁用，1正常 */
  status: number;
  /** 部门ID */
  role_id?: string;
}

/** 用户表单对象 */
export interface UserForm extends UserBaseVO {
  /** 密码 */
  password?: string;
}

/** 用户分页对象 */
export interface UserList extends UserBaseVO {
  /** 部门名称 */
  group_name: string;
  /** 创建时间 */
  created_dt: string;
}

export interface UserListVO {
  total: number;
  list: UserList[];
}
