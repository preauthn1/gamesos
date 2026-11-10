import request from "@/utils/request";

const BASE_URL = "/manage/v1/user_level";

const UserLevelAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, UserLevelInfo>({
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
    return request<any, UserLevelListVO>({
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
  create(data: UserLevelInfo) {
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
  update(data: UserLevelInfo) {
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

export default UserLevelAPI;

/** 查询参数 */
export interface UserLevelPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
}

/** 类型 */
export interface UserLevelInfo {

  /** ID */
  id?: string;
  /** 编号 */
  number?: string;
  /** 等级名称 */
  name?: string;
  /** 图标 */
  icon?: string;
  /** 计算类型 1累计 2单次 */
  type?: number;
  /** 充值金额门槛 */
  recharge?: number;
  /** 团队人数限制 */
  team_limit?: number;
  /** 游戏流水门槛 */
  game_wagers?: number;
  /** 游戏流水倍数 */
  game_wagers_multiple?: number;
  /** 每日游戏流水门槛 */
  day_game_wagers?: number;
  /** 每周游戏流水门槛 */
  week_game_wagers?: number;
  /** 每月游戏流水门槛 */
  month_game_wagers?: number;
  /** 提现最低金额 */
  withdrawal_min_limit?: number;
  /** 提现最高金额 */
  withdrawal_max_limit?: number;
  /** 提现限制次数 */
  withdrawal_count_limit?: number;
  /** 提现免费次数 */
  withdrawal_fee_limit?: number;
  /** 提现手续费% */
  withdrawal_fee?: number;
  /** 赠送奖金 */
  bonus?: number;
  /** 备注 */
  remark?: string;
}

export interface UserLevelList extends UserLevelInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface UserLevelListVO {
  /** 父级ID */
  total: number;
  list: UserLevelList[];
}
