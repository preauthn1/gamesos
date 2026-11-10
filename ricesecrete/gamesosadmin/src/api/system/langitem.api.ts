import request from "@/utils/request";

const BASE_URL = "/manage/v1/sys_lang_item";

const LangItemAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, LangItemInfo>({
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
    return request<any, LangItemListVO>({
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
  create(data: LangItemInfo) {
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
  update(data: LangItemInfo) {
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

export default LangItemAPI;

/** 条目查询参数 */
export interface LangItemPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 类型 */
  type?: number;
}

/**
  `id` bigint unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增ID',
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '条目名称',
  `detail` json NOT NULL COMMENT '条目详情',
  `app_id` bigint(20) DEFAULT '0' COMMENT '数据归属',
 */

/** 语言类型 */
export interface LangInfo {
  /** ID */
  id?: string;
  /** 语言名称 */
  title: string;
  /** 语言标识 */
  name: string;
  /** 语言代码 */
  code: string;
  /** 语言代码 */
  lang_code: string;
  /** 是否默认语言 */
  is_default: number;
  /** 语言状态：0禁用，1正常 */
  status: number;
}
/** 条目类型 */
export interface LangItemInfo {
  /** ID */
  id?: string;
  /** 条目名称 */
  title: string;
  /** 条目标识 */
  detail?: string;
  ///是否更新
  type?: string;
  ///是否更新
  is_update?: string;
}
/** 条目类型 */
export interface LangItemUpdate {
  /** ID */
  lang_title?: string;
  /** ID */
  lang_id?: string;
  /** 条目标识 */
  item_id?: string;
  /** 内容 */
  text?: string;
}
export interface LangItemList extends LangItemInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface LangItemListVO {
  /** 父级ID */
  total: number;
  head: LangInfo[];
  list: LangItemList[];
}
