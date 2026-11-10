import request from "@/utils/request";

const BASE_URL = "/manage/v1/sys_lang";

const LangAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, LangInfo>({
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
    return request<any, LangListVO>({
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
  create(data: LangInfo) {
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
  update(data: LangInfo) {
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

export default LangAPI;

/** 语言查询参数 */
export interface LangPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 状态 */
  status?: string;
}

/**
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增ID',
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '语言名称',
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '语言标识',
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '语言代码',
  `lang_code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '语言代码',
  `is_default` tinyint(3) unsigned NOT NULL DEFAULT '0' COMMENT '是否默认语言',
  `status` tinyint(3) unsigned NOT NULL DEFAULT '1' COMMENT '0状态：2禁用，1正常',
  `app_id` bigint(20) DEFAULT '0' COMMENT '数据归属',
 */
/** 语言类型 */
export interface LangInfo {
  /** ID */
  id?: string;
  /** 语言名称 */
  title: string;
  /** 语言标识 */
  remark: string;
  /** 语言代码 */
  lang: string;
  /** 是否默认语言 */
  is_default: number;
  /** 语言状态：0禁用，1正常 */
  status: number;
  /** 排序 */
  sort: number;
}

export interface LangList extends LangInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface LangListVO {
  /** 父级ID */
  total: number;
  list: LangList[];
}
