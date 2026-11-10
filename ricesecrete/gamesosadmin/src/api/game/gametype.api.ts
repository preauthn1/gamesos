import request from "@/utils/request";

const BASE_URL = "/manage/v1/game_type";

const GameTypeAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, GameTypeInfo>({
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
    return request<any, GameTypeListVO>({
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
  create(data: GameTypeInfo) {
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
  update(data: GameTypeInfo) {
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

export default GameTypeAPI;

/** 语言查询参数 */
export interface GameTypePageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 状态 */
  status?: string;
}

/** 语言类型 */
export interface GameTypeInfo {
  /** ID */
  id?: string;
  /** 父级ID */
  pid: string;
  /** 类型 0保留 */
  type: number;
  /** 分类名称 */
  name: string;
  /** 分类图标 */
  icon: string;
  /** 选中图标 */
  icon_active?: string;
  /** 状态 1启用 2关闭 */
  status: number;
  /** 排序 */
  sort: number;
  /** 备注 */
  remark: string;
}

export interface GameTypeList extends GameTypeInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface GameTypeListVO {
  options: OptionType[] | { value: string | number; label: string; children?: /*elided*/ any[] | undefined; }[];
  /** 父级ID */
  total: number;
  list: GameTypeList[];
}
