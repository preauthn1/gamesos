import request from "@/utils/request";

const BASE_URL = "/manage/v1/withdraw";

const WithdrawAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, WithdrawInfo>({
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
    return request<any, WithdrawListVO>({
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
  create(data: WithdrawInfo) {
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
  update(data: WithdrawInfo) {
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

  /**
   * 审核通过
   * @param data 审核数据
   */
  auditApprove(data: {
    order_no: string;
    audit_remark?: string;
    operation_type: "update";
  }) {
    return request({
      url: `${BASE_URL}/update`,
      method: "post",
      data: { ...data, status: 1 },
    });
  },

  /**
   * 审核拒绝
   * @param data 审核数据
   */
  auditReject(data: {
    order_no: string;
    fail_reason: string;
    audit_remark?: string;
    operation_type: "update";
  }) {
    return request({
      url: `${BASE_URL}/update`,
      method: "post",
      data: { ...data, status: 2 },
    });
  },

  /**
   * 处理中（打款中）
   * @param data 处理数据
   */
  processWithdraw(data: {
    order_no: string;
    admin_remark?: string;
    operation_type: "process";
  }) {
    return request({
      url: `${BASE_URL}/update`,
      method: "post",
      data: data,
    });
  },

  /**
   * 完成提现
   * @param data 完成数据
   */
  completeWithdraw(data: {
    order_no: string;
    admin_remark?: string;
    operation_type: "complete";
  }) {
    return request({
      url: `${BASE_URL}/update`,
      method: "post",
      data: data,
    });
  },

  /**
   * 取消提现
   * @param data 取消数据
   */
  cancelWithdraw(data: {
    order_no: string;
    admin_remark?: string;
    operation_type: "cancel";
  }) {
    return request({
      url: `${BASE_URL}/update`,
      method: "post",
      data: data,
    });
  },
};

export default WithdrawAPI;

/** 查询参数 */
export interface WithdrawPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  /** 用户ID */
  user_id?: string;
  /** 用户名称 */
  user_name?: string;
  /** 状态 */
  status?: string;
  /** 提现订单号 */
  order_no?: string;
  /** 支付渠道ID */
  payment_id?: string;
  /** 时间范围 */
  partition_date?: [string, string];
}

/**
 * COMMENT ON COLUMN "public"."or_withdraw"."id" IS '主键ID';

COMMENT ON COLUMN "public"."or_withdraw"."user_id" IS '用户ID';

COMMENT ON COLUMN "public"."or_withdraw"."order_no" IS '提现订单号';

COMMENT ON COLUMN "public"."or_withdraw"."payment_id" IS '支付渠道ID';

COMMENT ON COLUMN "public"."or_withdraw"."amount" IS '充值金额';

COMMENT ON COLUMN "public"."or_withdraw"."actual_amount" IS '实际到账金额';

COMMENT ON COLUMN "public"."or_withdraw"."currency" IS '货币单位';

COMMENT ON COLUMN "public"."or_withdraw"."exchange_rate" IS '汇率';

COMMENT ON COLUMN "public"."or_withdraw"."fee" IS '手续费';

COMMENT ON COLUMN "public"."or_withdraw"."bank_name" IS '银行名称';

COMMENT ON COLUMN "public"."or_withdraw"."bank_card_no" IS '银行卡号/账户号';

COMMENT ON COLUMN "public"."or_withdraw"."account_name" IS '开户人姓名';

COMMENT ON COLUMN "public"."or_withdraw"."status" IS '状态 0待审核 1审核通过 2审核拒绝 3处理中 4已完成 5已取消';

COMMENT ON COLUMN "public"."or_withdraw"."audit_admin_id" IS '审核管理员ID';

COMMENT ON COLUMN "public"."or_withdraw"."audit_time" IS '审核时间';

COMMENT ON COLUMN "public"."or_withdraw"."audit_remark" IS '审核备注';

COMMENT ON COLUMN "public"."or_withdraw"."process_time" IS '处理时间';

COMMENT ON COLUMN "public"."or_withdraw"."complete_time" IS '完成时间';

COMMENT ON COLUMN "public"."or_withdraw"."fail_reason" IS '失败原因';

COMMENT ON COLUMN "public"."or_withdraw"."client_ip" IS '客户端IP';

COMMENT ON COLUMN "public"."or_withdraw"."remark" IS '备注信息';

COMMENT ON COLUMN "public"."or_withdraw"."admin_remark" IS '管理员备注';

COMMENT ON COLUMN "public"."or_withdraw"."created_at" IS '创建时间';

COMMENT ON COLUMN "public"."or_withdraw"."updated_at" IS '更新时间';
 */
export interface WithdrawInfo {
  /** 主键ID */
  id?: string;
  /** 用户ID */
  user_id?: string;
  /** 提现订单号 */
  order_no?: string;
  /** 支付渠道ID */
  payment_id?: number | string;
  /** 提现金额 */
  amount: number;
  /** 实际到账金额 */
  actual_amount?: number;
  /** 货币单位 */
  currency?: string;
  /** 汇率 */
  exchange_rate?: number;
  /** 手续费 */
  fee?: number;
  /** 银行名称 */
  bank_name?: string;
  /** 银行卡号/账户号 */
  bank_card_no?: string;
  /** 开户人姓名 */
  account_name?: string;
  /** 状态 0待审核 1审核通过 2审核拒绝 3处理中 4已完成 5已取消 */
  status: number;
  /** 审核管理员ID */
  audit_admin_id?: string;
  /** 审核时间 */
  audit_time?: string;
  /** 审核备注 */
  audit_remark?: string;
  /** 处理时间 */
  process_time?: string;
  /** 完成时间 */
  complete_time?: string;
  /** 失败原因 */
  fail_reason?: string;
  /** 客户端IP */
  client_ip?: string;
  /** 备注信息 */
  remark?: string;
  /** 管理员备注 */
  admin_remark?: string;
  /** 创建时间 */
  created_at?: string;
  /** 更新时间 */
  updated_at?: string;
}

export interface WithdrawList extends WithdrawInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface WithdrawListVO {
  /** 总数 */
  total: number;
  list: WithdrawList[];
}
