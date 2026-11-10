import request from "@/utils/request";

const BASE_URL = "/manage/v1/game_platform";

const GamePlatformAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, GamePlatformInfo>({
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
    return request<any, GamePlatformListVO>({
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
  create(data: GamePlatformInfo) {
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
  update(data: GamePlatformInfo) {
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

export default GamePlatformAPI;

/** 查询参数 */
export interface GamePlatformPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  //用户id
  id?: string;
  /** 状态 */
  status?: string;
}

export interface GamePlatformApi {
  /** ID */
  id?: string;
  /** 平台 */
  platform_id: number;
  /** 请求类型 */
  method: string;
  /** 接口类型 */
  type: string;
  /** 请求地址 */
  url: string;
  /** 请求头数据 */
  header_json: string;
  /** 请求数据 */
  body_json: string;
  /** 返回结果数据 */
  request_json: string;
  /** 签名方式 */
  sign_json: string;
  /** 状态 1启用 2关闭 */
  status: number;
  /** 排序 */
  sort: number;
  /** 创建时间 */
  created_at: string;
  /** 更新时间 */
  updated_at: string;
}
/** 类型
 
 */
export interface GamePlatformInfo {
  /** ID */
  id?: string;
  /** 类型 保留类型 */
  type?: number;
  /** 渠道名称 */
  name: string;
  /** 渠道代码文件名称 */
  package_name: string;
  /** 平台图标 */
  icon: string;
  /** 三方语言 */
  lang: string;
  /** 货币单位 */
  currency: string;
  /** 与平台币汇率 */
  rate: number;
  /** 最低下注金额 */
  min_bet: number;
  /** 最高下注金额 */
  max_bet: number;
  /** 是否使用iframe 1是 2否 */
  is_iframe: number;
  /** 时区 */
  timezone: string;
  /** 配置 */
  config: string;
  /**
   * 排序
   */
  sort: number;
  /** 状态：2禁用，1正常 */
  status: number;
  //接口配置
  api_list: Array<GamePlatformApi>;
}

export interface GamePlatformList extends GamePlatformInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface GamePlatformListVO {
  /** 父级ID */
  total: number;
  list: GamePlatformList[];
  options:
    | OptionType[]
    | {
        value: string | number;
        label: string;
        children?: /*elided*/ any[] | undefined;
      }[];
}
