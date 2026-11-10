import request from "@/utils/request";

const BASE_URL = "/manage/v1/banner";

const BannerAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, BannerInfo>({
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
    return request<any, BannerListVO>({
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
  create(data: BannerInfo) {
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
  update(data: BannerInfo) {
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

export default BannerAPI;

/** 语言查询参数 */
export interface BannerPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 状态 */
  status?: string;
}

/**
  "id" int4 NOT NULL DEFAULT nextval('ma_banner_id_seq'::regclass),
  "title" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "img" text COLLATE "pg_catalog"."default" DEFAULT ''::text,
  "url" varchar(255) COLLATE "pg_catalog"."default" DEFAULT ''::character varying,
  "status" int2 DEFAULT 1,
  "lang" varchar(50) COLLATE "pg_catalog"."default" NOT NULL DEFAULT ''::character varying,
  "type" int2 DEFAULT 0,
  "sort" int4 DEFAULT 0,
 */
/** 语言类型 */
export interface BannerInfo {
  /** ID */
  id?: string;
  /** 标题 */
  title?: string;
  /** 图片 */
  img: string;
  /** 链接 */
  url?: string;
  /** 状态：2禁用，1正常 */
  status: number;
  /** 语言 */
  lang?: string;
  /** 类型 0首页轮播图 */
  type: number;
  /** 排序 */
  sort?: number;
}

export interface BannerList extends BannerInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface BannerListVO {
  /** 父级ID */
  total: number;
  list: BannerList[];
}
