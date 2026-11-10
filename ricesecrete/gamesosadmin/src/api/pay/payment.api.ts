import request from "@/utils/request";

const BASE_URL = "/manage/v1/payment";

const PaymentAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, PaymentInfo>({
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
    return request<any, PaymentListVO>({
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
  create(data: PaymentInfo) {
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
  update(data: PaymentInfo) {
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

export default PaymentAPI;

/** 查询参数 */
export interface PaymentPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  //用户id
  id?: string;
  /** 状态 */
  status?: string;
}

/**
 * COMMENT ON COLUMN "public"."pa_payment_api"."payment_id" IS '支付平台id';

COMMENT ON COLUMN "public"."pa_payment_api"."method" IS '请求类型 post get';

COMMENT ON COLUMN "public"."pa_payment_api"."type" IS '接口类型 pay_in:代收接口,pay_out:代付接口,pay_query:查询接口,pay_in_notify:代收回调处理,pay_out_notify:代付回调处理';

COMMENT ON COLUMN "public"."pa_payment_api"."url" IS '请求地址';

COMMENT ON COLUMN "public"."pa_payment_api"."header_json" IS '请求头数据';

COMMENT ON COLUMN "public"."pa_payment_api"."body_json" IS '请求数据';

COMMENT ON COLUMN "public"."pa_payment_api"."request_json" IS '返还结果数据';

COMMENT ON COLUMN "public"."pa_payment_api"."sign_json" IS '签名方式';

COMMENT ON COLUMN "public"."pa_payment_api"."status" IS '状态 1启用 2关闭';

COMMENT ON COLUMN "public"."pa_payment_api"."sort" IS '排序';

COMMENT ON COLUMN "public"."pa_payment_api"."created_at" IS '创建时间';

COMMENT ON COLUMN "public"."pa_payment_api"."updated_at" IS '更新时间';
 */
export interface PaymentApi {
  /** ID */
  id?: string;
  /** 支付平台 */
  payment_id: string;
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
/** 类型 */
export interface PaymentInfo {
  /** ID */
  id?: string;
  /** 类型 1数字钱包 2三方渠道 3下线支付 */
  type: number;
  /** 货币符号 */
  symbol: string;
  /** 货币单位 */
  currency: string;
  //汇率
  exchange_rate: number;
  //手续费
  fees: number;
  /** 渠道名称 */
  name: string;
  /** 图片 */
  img: string;
  /** 渠道代码文件名称 */
  package_name: string;
  /** 渠道配置 */
  config?: string;
  /** 银行配置 */
  bank_config?: string;
  /** 最小充值金额 */
  min_recharge_money: number;
  /** 最小提现金额 */
  min_withdraw_money: number;
  /** 最大充值金额 */
  max_recharge_money: number;
  /** 最大提现金额 */
  max_withdraw_money: number;
  /** 快捷金额，逗号隔开 */
  fast_amount?: string;
  /** 充值说明 */
  instruction?: string;
  /** 充值状态 开关 1启用 2关闭 */
  recharge_is_show: number;
  /** 提现开关 开关 1启用 2关闭 */
  withdraw_is_show: number;
  /** 地址 */
  address?: string;
  /**
   * 排序
   */
  sort?: number;
  /** 状态：2禁用，1正常 */
  status: number;
  //接口配置
  api_list?: Array<PaymentApi>;
}

export interface PaymentList extends PaymentInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface PaymentListVO {
  /** 父级ID */
  total: number;
  list: PaymentList[];
}
