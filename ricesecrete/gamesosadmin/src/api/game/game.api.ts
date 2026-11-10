import request from "@/utils/request";

const BASE_URL = "/manage/v1/game";

const GameAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, GameInfo>({
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
    return request<any, GameListVO>({
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
  create(data: GameInfo) {
    return request({
      url: `${BASE_URL}/insert`,
      method: "post",
      data: data,
    });
  },

  
  /**
   * 添加
   *
   * @param data 表单数据
   */
  createAll(data: any) {
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
  update(data: GameInfo) {
    return request({
      url: `${BASE_URL}/update`,
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
  updateAll(data: any) {
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

export default GameAPI;

/** 语言查询参数 */
export interface GamePageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 状态 */
  status?: string;
  /** 平台 */
  platform_id?:string;
  /**
   * 分类
   */
  type_id?:string;
}

/** 语言类型 */
export interface GameInfo {
  /** ID */
  id?: string;
  /** 归属平台id */
  platform_id: number;
  /** 游戏分类id */
  type_id: number;
  /** 游戏代码 */
  code: string;
  /** 游戏三方代码标识 */
  tag: string;
  /** 游戏名称 */
  name: string;
  /** 游戏图标 */
  icon: string;
  /** 游戏大图 */
  image: string;
  /** 状态 1启用 2禁用 3维护 */
  status: number;
  /** 排序 */
  sort: number;
  /** 是否热门 1是 2否 */
  hot: number;
  /** 是否推荐 1是 2否 */
  recommend: number;
  /** 是否锁定 1是 2否 锁定后不允许批量操作 */
  lock: number;
  /** 游戏备注 */
  remark: string;
  /** 游戏关键词 */
  keyword: string;
}

export interface GameList extends GameInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface GameListVO {
  /** 父级ID */
  total: number;
  list: GameList[];
}
