import request from "@/utils/request";

const BASE_URL = "/manage/v1/game_bet";

const GameBetAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, GameBetInfo>({
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
    return request<any, GameBetListVO>({
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
  create(data: GameBetInfo) {
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
  update(data: GameBetInfo) {
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

export default GameBetAPI;

/** 语言查询参数 */
export interface GameBetPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 状态 */
  win_lose_status?: number;
  /** 平台 */
  platform_id?: number;
  //游戏id
  game_id?: string;
  // 用户id
  user_id?: string;
  type_id?: number;
}

/** 游戏注单
 * 
 * COMMENT ON COLUMN "public"."ga_game_bet"."platform_id" IS '游戏平台ID';

COMMENT ON COLUMN "public"."ga_game_bet"."game_id" IS '游戏ID';

COMMENT ON COLUMN "public"."ga_game_bet"."user_id" IS '用户id';

COMMENT ON COLUMN "public"."ga_game_bet"."bet_sn" IS '下注单号';

COMMENT ON COLUMN "public"."ga_game_bet"."trans_no" IS '交易号';

COMMENT ON COLUMN "public"."ga_game_bet"."bet_price" IS '游戏下注金额';

COMMENT ON COLUMN "public"."ga_game_bet"."win_lose_status" IS '输赢状态 0无效 1未结算 2输 3赢 4平';

COMMENT ON COLUMN "public"."ga_game_bet"."win_lose_price" IS '输赢金额';

COMMENT ON COLUMN "public"."ga_game_bet"."win_price" IS '赢金额（不包含下注金额）';

COMMENT ON COLUMN "public"."ga_game_bet"."bet_time" IS '下注时间';

COMMENT ON COLUMN "public"."ga_game_bet"."over_time" IS '结算时间';

COMMENT ON COLUMN "public"."ga_game_bet"."bet_info" IS '游戏下注原始信息';

COMMENT ON COLUMN "public"."ga_game_bet"."user_reports_stat" IS '用户报表统计状态 0未统计 1已统计';

COMMENT ON COLUMN "public"."ga_game_bet"."sys_reports_stat" IS '综合报表统计状态 0未统计 1已统计';
 */
export interface GameBetInfo {
  /** ID */
  id?: string;
  /** 游戏平台ID */
  platform_id: number;
  /** 游戏ID */
  game_id: number;
  /** 用户id */
  user_id: number;
  // 游戏类型
  type_id: number;
  /** 下注单号 */
  bet_sn: string;
  /** 交易号 */
  trans_no: string;
  /** 游戏下注金额 */
  bet_price: number;
  /** 输赢状态 0无效 1未结算 2输 3赢 4平 */
  win_lose_status: number;
  /** 输赢金额 */
  win_lose_price: number;
  /** 赢金额（不包含下注金额） */
  win_price: number;
  /** 下注时间 */
  bet_time: string;
  /** 结算时间 */
  over_time: string;
  /** 游戏下注原始信息 */
  bet_info: string;
  /** 用户报表统计状态 0未统计 1已统计 */
  user_reports_stat: number;
  /** 综合报表统计状态 0未统计 1已统计 */
  sys_reports_stat: number;
}

export interface GameBetList extends GameBetInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
  game_info: any;
  user_info: any;
}

export interface GameBetListVO {
  /** 父级ID */
  total: number;
  list: GameBetList[];
}
