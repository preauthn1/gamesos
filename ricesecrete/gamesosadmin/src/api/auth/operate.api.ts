import request from "@/utils/request";

const BASE_URL = "/manage/v1/auth_operate";

const OperateAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, OperateInfo>({
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
    return request<any, OperateInfoListVO>({
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
  create(data: OperateInfo) {
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
  update(data: OperateInfo) {
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

export default OperateAPI;

/** 部门查询参数 */
export interface OperatePageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 状态 */
  status?: string;
}

/**
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增ID',
  `created_at` bigint(20) DEFAULT NULL COMMENT '创建时间戳',
  `updated_at` bigint(20) DEFAULT NULL COMMENT '更新时间戳',
  `deleted_at` datetime(3) DEFAULT NULL,
  `admin_id` bigint(20) unsigned NOT NULL DEFAULT '0' COMMENT '管理员id',
  `name` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci DEFAULT '' COMMENT '操作说明',
  `url` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL DEFAULT '' COMMENT '操作路由',
  `param` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL COMMENT '操作参数',
 */
/** 部门类型 */
export interface OperateInfo {
  /** ID */
  id?: string;
  /** 管理id*/
  admin_id: string;
  /** 管理名称 */
  admin_name?: string;
  /** 操作说明 */
  title?: string;
  /** 操作路由 */
  path: string;
  /** 参数 */
  param: string;
  /** 创建时间 */
  created_at: string;
}

export interface OperateInfoList extends OperateInfo {
  /** 更新时间 */
  updated_at: string;
}

export interface OperateInfoListVO {
  /** 父级ID */
  total: number;
  list: OperateInfoList[];
}
