import request from "@/utils/request";

const BASE_URL = "/manage/v1/sys_server_config";

const ServerConfigAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, ServerConfigInfo>({
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
    return request<any, ServerConfigInfoListVO>({
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
  create(data: ServerConfigInfo) {
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
  update(data: ServerConfigInfo) {
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

export default ServerConfigAPI;

/** 部门查询参数 */
export interface ServerConfigPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  status?: number;
}

/**
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '参数名称',
  `key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '数据键值',
  `value` text CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '数据内容',
 */
/** 部门类型 */
export interface ServerConfigInfo {
  /** ID */
  id?: string;
  /** 名称 */
  name?: string;
  /** IP */
  ip?: string;
  /** 端口 */
  server_port?: string;
  // 名称空间
  server_namespace?: string;
  /** 服务名称 */
  server_model?: string;
  path?: string;
  // 服务编号
  server_number?: string;
  /** 状态 */
  status?: number;
}

export interface ServerConfigInfoList extends ServerConfigInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface ServerConfigInfoListVO {
  /** 父级ID */
  total: number;
  list: ServerConfigInfoList[];
}
