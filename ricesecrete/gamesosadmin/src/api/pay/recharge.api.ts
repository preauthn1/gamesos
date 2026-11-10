import request from "@/utils/request";

const BASE_URL = "/manage/v1/recharge";

const RechargeAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, RechargeInfo>({
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
    return request<any, RechargeListVO>({
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
  create(data: RechargeInfo) {
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
  update(data: RechargeInfo) {
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
  }
};

export default RechargeAPI;

/** 查询参数 */
export interface RechargePageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 用户ID */
  user_id?: string;
  /** 用户名称 */
  user_name?: string;
  /** 状态 */
  status?: string;
  /** 充值订单号 */
  order_no?: string;
  /** 支付渠道ID */
  payment_id?: string;
  /** 时间范围 */
  partition_date?: [string, string];
}

/**
 * COMMENT ON COLUMN "public"."or_recharge"."id" IS '主键ID';

COMMENT ON COLUMN "public"."or_recharge"."user_id" IS '用户ID';

COMMENT ON COLUMN "public"."or_recharge"."order_no" IS '充值订单号';

COMMENT ON COLUMN "public"."or_recharge"."payment_id" IS '支付渠道ID';

COMMENT ON COLUMN "public"."or_recharge"."amount" IS '充值金额';

COMMENT ON COLUMN "public"."or_recharge"."actual_amount" IS '实际到账金额';

COMMENT ON COLUMN "public"."or_recharge"."currency" IS '货币单位';

COMMENT ON COLUMN "public"."or_recharge"."exchange_rate" IS '汇率';

COMMENT ON COLUMN "public"."or_recharge"."fee" IS '手续费';

COMMENT ON COLUMN "public"."or_recharge"."status" IS '状态 0待支付 1已支付 2支付失败 3已取消';

COMMENT ON COLUMN "public"."or_recharge"."third_party_order_no" IS '第三方支付订单号';

COMMENT ON COLUMN "public"."or_recharge"."payment_time" IS '支付完成时间';

COMMENT ON COLUMN "public"."or_recharge"."client_ip" IS '客户端IP';

COMMENT ON COLUMN "public"."or_recharge"."remark" IS '备注信息';

COMMENT ON COLUMN "public"."or_recharge"."created_at" IS '创建时间';

COMMENT ON COLUMN "public"."or_recharge"."updated_at" IS '更新时间';
 */
export interface RechargeInfo {
  /** 主键ID */
  id?: string;
  /** 用户ID */
  user_id?: string;
  /** 充值订单号 */
  order_no?: string;
  /** 支付渠道ID */
  payment_id?: number|string;
  /** 充值金额 */
  amount: number;
  /** 实际到账金额 */
  actual_amount?: number;
  /** 货币单位 */
  currency?: string;
  /** 汇率 */
  exchange_rate?: number;
  /** 手续费 */
  fee: number;
  /** 状态 0待支付 1已支付 2支付失败 3已取消 */
  status: number;
  /** 第三方支付订单号 */
  third_party_order_no?: string;
  /** 支付完成时间 */
  payment_time?: string;
  /** 客户端IP */
  client_ip?: string;
  /** 备注信息 */
  remark?: string;
  /** 创建时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}

export interface RechargeList extends RechargeInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface RechargeListVO {
  /** 总数 */
  total: number;
  list: RechargeList[];
}