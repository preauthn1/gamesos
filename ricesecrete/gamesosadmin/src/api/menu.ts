import request from "@/utils/request";

class MenuAPI {
  //  设置语言
  static setLang(params: any) {
    return request<any, LangVO>({
      url: "/manage/v1/common/set_lang",
      method: "get",
      params: params,
    });
  }

  /**
   * 获取语言
   * @returns
   */
  static getLang() {
    return request<any, LangVO>({
      url: "/manage/v1/common/get_lang",
      method: "get",
    });
  }

  /**
   * 获取语言列表
   * @returns
   */
  static getLangList() {
    return request<any, any>({
      url: "/manage/v1/common/lang_list",
      method: "get",
    });
  }

  // 获取配置
  static getConfig() {
    return request<any, any>({
      url: "/manage/v1/common/config",
      method: "get",
    });
  }

  /**
   * 获取字典
   * @param key
   * @returns
   */
  static dictionary(key: string) {
    return request<any, any>({
      url: "/manage/v1/common/dictionary",
      method: "get",
      params: { key: key },
    });
  }
}

export default MenuAPI;

export interface LangVO {
  data: any;
}
export interface RouteVOData {
  menus: RouteVO[]; // Adjust based on actual API response
  [key: string]: any; // Optional: Allow additional properties
}

/** RouteVO，路由对象 */
export interface RouteVO {
  /** 子路由列表 */
  children: RouteVO[];
  /** 组件路径 */
  component?: string;
  /** 路由属性 */
  meta?: Meta;
  /** 路由名称 */
  name?: string;
  /** 路由路径 */
  path?: string;
}

/** Meta，路由属性 */
export interface Meta {
  /** 【目录】只有一个子路由是否始终显示 */
  alwaysShow?: boolean;
  /** 是否隐藏(true-是 false-否) */
  hidden?: boolean;
  /** ICON */
  icon?: string;
  /** 【菜单】是否开启页面缓存 */
  keepAlive?: boolean;
  /** 路由title */
  title?: string;
}

/**
 * 获取系统数据
 */
export interface SysDataVO {
  lang: any;
  lang_cache_time: any;
  sys: any;
}
