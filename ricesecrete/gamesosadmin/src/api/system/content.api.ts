import request from "@/utils/request";

const BASE_URL = "/manage/v1/content";

const ContentAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, ContentInfo>({
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
    return request<any, ContentInfoListVO>({
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
  create(data: ContentInfo) {
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
  update(data: ContentInfo) {
    return request({
      url: `${BASE_URL}/update`,
      method: "post",
      data: data,
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

export default ContentAPI;

/** 部门查询参数 */
export interface ContentPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 类型 */
  type?: string;
  /** 语言 */
  lang?: string;
}

/**
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键，自增ID',
  `name` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT '' COMMENT '参数名称',
  `key` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '' COMMENT '数据键值',
  `value` text CHARACTER SET utf8 COLLATE utf8_general_ci COMMENT '数据内容',
 */
/** 部门类型 */
export interface ContentInfo {
  /** ID */
  id?: string;
  /** 名称 */
  title?: string;
  /** 内容 */
  content?: string;
  // 状态
  status?: number;
  // 语言
  lang?: string;
  /** 类型 */
  type?: string;
  /** 排序 */
  sort?: number;
}

export interface ContentInfoList extends ContentInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface ContentInfoListVO {
  /** 父级ID */
  total: number;
  list: ContentInfoList[];
}
