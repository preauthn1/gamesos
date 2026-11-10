import request from "@/utils/request";

const BASE_URL = "/manage/v1/user_bank";

const UserBankAPI = {
  /**
   * 获取信息
   * @returns 银行卡信息
   */
  getInfo(queryParams: object) {
    return request<any, UserBankInfo>({
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
    return request<any, UserBankListVO>({
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
  create(data: UserBankInfo) {
    return request({
      url: `${BASE_URL}/insert`,
      method: "post",
      data: data,
    });
  },

  /**
   * 修改
   *
   * @param data 表单数据
   */
  update(data: UserBankInfo) {
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
   * @param data ID字符串，多个以英文逗号(,)分割
   */
  deleteByIds(data: object) {
    return request({
      url: `${BASE_URL}/delete`,
      method: "post",
      data: data,
    });
  },
};

export default UserBankAPI;

/** 查询参数 */
export interface UserBankPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  user_id?: string;
  card_number?: string;
}

/** 类型 */
export interface UserBankInfo {
  /** ID */
  id?: string;
  /** 用户ID */
  user_id?: string;
  /** 银行名称 */
  bank_name?: string;
  /** 银行代码 */
  bank_code?: string;
  /** 银行卡号 */
  card_number?: string;
  /** 持卡人姓名 */
  card_holder?: string;
  /** 预留手机号 */
  phone?: string;
  /** 省份 */
  province?: string;
  /** 城市 */
  city?: string;
  /** 开户行名称 */
  branch_name?: string;
  /** 是否默认 0 否 1 是 */
  is_default?: number;
  /** 状态 0 禁用 1 启用 */
  status?: number;
}

export interface UserBankList extends UserBankInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface UserBankListVO {
  /** 总数 */
  total: number;
  list: UserBankList[];
}