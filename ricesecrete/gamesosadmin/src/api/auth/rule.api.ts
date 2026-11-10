import request from "@/utils/request";

const BASE_URL = "/manage/v1/auth_rule";

const RuleAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, RuleInfo>({
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
    return request<any, RuleListVO>({
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
  create(data: RuleInfo) {
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
  update(data: RuleInfo) {
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

export default RuleAPI;

/** 部门查询参数 */
export interface RulePageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
}

/**
 * 
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增ID',
  `created_at` bigint DEFAULT NULL COMMENT '创建时间戳',
  `updated_at` bigint DEFAULT NULL COMMENT '更新时间戳',
  `deleted_at` datetime(3) DEFAULT NULL,
  `name` varchar(191) COLLATE utf8mb4_general_ci NOT NULL COMMENT '规则唯一标识',
  `title` longtext COLLATE utf8mb4_general_ci NOT NULL COMMENT '规则名称',
  `url` longtext COLLATE utf8mb4_general_ci COMMENT '规则URL',
  `url_param` longtext COLLATE utf8mb4_general_ci COMMENT '路由参数',
  `icon` longtext COLLATE utf8mb4_general_ci COMMENT '图标',
  `type` tinyint unsigned DEFAULT '0' COMMENT '类型，0目录，1菜单，2页面，3按钮元素，4接口',
  `api_method` tinyint unsigned DEFAULT '0' COMMENT '接口类型，0无，1get，2post，3delete，4put',
  `sort` bigint unsigned DEFAULT '0' COMMENT '排序，数值越大权重越高',
  `pid` bigint unsigned DEFAULT '0' COMMENT '父级ID',
  `status` tinyint unsigned DEFAULT '1' COMMENT '状态标识，1禁用，2正常',
 */
/** 菜单类型 */
export interface RuleInfo {
  /** 菜单ID */
  id?: string;
  /** 菜单名称 */
  title?: string;
  /** 菜单唯一标识 */
  name: string;
  /** 菜单URL */
  url: string;
  /** 路由参数 */
  url_param: string;
  /** 图标 */
  icon: string;
  /** 菜单类型，0目录，1菜单，2页面，3按钮元素，4接口 */
  type: number;
  /** 接口类型，0无，1get，2post，3delete，4put */
  api_method: number;
  /** 排序，数值越大权重越高 */
  sort: number;
  /** 父级ID */
  pid: string;
  /** 菜单状态：0禁用，1正常 */
  status: number;
}

export interface RuleList extends RuleInfo {
  /** 子级 */
  children?: RuleInfo[];
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface RuleListVO {
  /** 父级ID */
  total: number;
  list: RuleList[];
  options: OptionType[];
}
