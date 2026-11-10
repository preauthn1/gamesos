import request from "@/utils/request";

const BASE_URL = "/manage/v1/game_user";

const GameUserAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, GameUserInfo>({
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
    return request<any, GameUserListVO>({
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
  create(data: GameUserInfo) {
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
  update(data: any) {
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

export default GameUserAPI;

/** 语言查询参数 */
export interface GameUserPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 平台 */
  platform_id?: number;
  //游戏id
  game_id?: string;
  // 用户id
  user_id?: string;
}

/** 游戏注单
 * 
COMMENT ON COLUMN "public"."ga_game_user"."platform_id" IS '归属平台id';

COMMENT ON COLUMN "public"."ga_game_user"."platform_type" IS '类型 1单钱包 2转账钱包';

COMMENT ON COLUMN "public"."ga_game_user"."game_id" IS '游戏分类id';

COMMENT ON COLUMN "public"."ga_game_user"."user_id" IS '用户id';

COMMENT ON COLUMN "public"."ga_game_user"."user_thirds_id" IS '用户在三方平台的id';

COMMENT ON COLUMN "public"."ga_game_user"."user_thirds_name" IS '用户在三方平台的名称';

COMMENT ON COLUMN "public"."ga_game_user"."lang" IS '游戏语种';

COMMENT ON COLUMN "public"."ga_game_user"."currency" IS '游戏币种';

COMMENT ON COLUMN "public"."ga_game_user"."game_url" IS '游戏url';

COMMENT ON COLUMN "public"."ga_game_user"."user_token" IS '用户在三方平台的token';

COMMENT ON COLUMN "public"."ga_game_user"."user_token_time" IS '用户在三方平台的token有效时间';

COMMENT ON COLUMN "public"."ga_game_user"."balance_in" IS '用户在三方平台转入金额';

COMMENT ON COLUMN "public"."ga_game_user"."balance" IS '用户在三方平台余额';

COMMENT ON COLUMN "public"."ga_game_user"."balance_out" IS '用户在三方平台转出金额';

COMMENT ON COLUMN "public"."ga_game_user"."play_count" IS '玩游戏次数';

COMMENT ON COLUMN "public"."ga_game_user"."last_in_time" IS '最后进入时间';

COMMENT ON COLUMN "public"."ga_game_user"."last_out_time" IS '最后退出时间';

COMMENT ON COLUMN "public"."ga_game_user"."business_sn" IS '业务流水号';

COMMENT ON COLUMN "public"."ga_game_user"."created_at" IS '创建时间';

COMMENT ON COLUMN "public"."ga_game_user"."updated_at" IS '更新时间';

COMMENT ON COLUMN "public"."ga_game_user"."url_time" IS '游戏链接有效时间';
 */
export interface GameUserInfo {
  /** ID */
  id?: string;
  /** 游戏平台ID */
  platform_id: number;
  /** 平台类型 1单钱包 2转账钱包 */
  platform_type: number;
  /** 游戏ID */
  game_id: number;
  /** 用户id */
  user_id: number;
  /** 用户在三方平台用户id */
  user_thirds_id: number
  /** 用户在三方平台的名称 */
  user_thirds_name: string;
  /** 语言 */
  lang: string;
  /** 币种 */
  currency: string;
  /** 游戏url */
  game_url: string;
  /** 用户在三方平台的token */
  user_token: string;
  /** 用户在三方平台的token有效时间 */
  user_token_time: string;
  /** 用户在三方平台转入金额 */
  balance_in: number;
  /** 用户在三方平台余额 */
  balance: number;
  /** 用户在三方平台转出金额 */
  balance_out: number;
  /** 玩游戏次数 */
  play_count: number;
  /** 最后进入时间 */
  last_in_time: string;
  /** 最后退出时间 */
  last_out_time: string;
  /** 业务流水号 */
  business_sn: string;
}

export interface GameUserList extends GameUserInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
  game_info: any;
  user_info: any;
}

export interface GameUserListVO {
  /** 父级ID */
  total: number;
  list: GameUserList[];
}
