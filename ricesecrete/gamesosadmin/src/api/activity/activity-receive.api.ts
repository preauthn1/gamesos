import request from "@/utils/request";
import type { ResponseData } from "@/types/global";

const BASE_URL = "/manage/v1/activity_receive";

const ActivityReceiveAPI = {
  /**
   * 获取信息
   * @returns 领取记录信息
   */
  getInfo(queryParams: ReceiveRecordPageQuery): Promise<ReceiveRecordInfo> {
    return request<ResponseData<ReceiveRecordInfo>>({
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
  getPage(queryParams: ReceiveRecordPageQuery): Promise<ReceiveRecordListVO> {
    return request<ResponseData<ReceiveRecordListVO>>({
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
  create(data: ReceiveRecordInfo): Promise<void> {
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
  update(data: ReceiveRecordInfo): Promise<void> {
    return request({
      url: `${BASE_URL}/update`,
      method: "post",
      data: data,
    });
  },

  /**
   * 导出文件
   * @param queryParams 查询参数
   * @returns 导出文件响应
   */
  export(queryParams: ReceiveRecordPageQuery): Promise<{ download_url: string; filename: string }> {
    return request<ResponseData<{ download_url: string; filename: string }>>({
      url: `${BASE_URL}/export`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 批量删除，多个以英文逗号(,)分割
   *
   * @param data 删除数据，包含id字段
   */
  deleteByIds(data: { id: string }): Promise<void> {
    return request({
      url: `${BASE_URL}/delete`,
      method: "post",
      data: data,
    });
  },

  /**
   * 获取领取统计
   */
  getReceiveStats(queryParams?: ReceiveStatsQuery): Promise<ReceiveStats> {
    return request<ResponseData<ReceiveStats>>({
      url: `${BASE_URL}/receive_stats`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 批量审核领取记录
   */
  batchAudit(data: { ids: string[]; status: number; remark?: string }): Promise<void> {
    return request({
      url: `${BASE_URL}/batch_audit`,
      method: "post",
      data: data,
    });
  },

  /**
   * 重新发放奖励
   */
  resendReward(data: { id: number; remark?: string }): Promise<void> {
    return request({
      url: `${BASE_URL}/resend_reward`,
      method: "post",
      data: data,
    });
  },
};

export default ActivityReceiveAPI;