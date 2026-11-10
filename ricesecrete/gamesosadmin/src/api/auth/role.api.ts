import request from "@/utils/request";

const BASE_URL = "/manage/v1/auth_role";

const RoleAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, RoleInfo>({
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
    return request<any, RoleListVO>({
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
  create(data: RoleInfo) {
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
  update(data: RoleInfo) {
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

export default RoleAPI;

/** 部门查询参数 */
export interface GroupPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 状态 */
  status?: string;
}

/**
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增ID',
  `created_at` bigint DEFAULT NULL COMMENT '创建时间戳',
  `updated_at` bigint DEFAULT NULL COMMENT '更新时间戳',
  `deleted_at` datetime(3) DEFAULT NULL,
  `title` varchar(191) COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '名称',
  `status` tinyint unsigned NOT NULL DEFAULT '1' COMMENT '0状态：0禁用，1正常',
  `rules` longtext COLLATE utf8mb4_general_ci COMMENT '规则ID，多个规则","隔开',
 */
/** 部门类型 */
export interface RoleInfo {
  /** 部门ID */
  id?: string;
  /** 部门名称 */
  name?: string;
  /** 部门状态：0禁用，1正常 */
  status: number;
  /** 部门规则 */
  rules: string;
  /** 权限规则ids */
  rules_ids?: string;
}

export interface RoleList extends RoleInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface RoleListVO {
  /** 父级ID */
  total: number;
  list: RoleList[];
}
