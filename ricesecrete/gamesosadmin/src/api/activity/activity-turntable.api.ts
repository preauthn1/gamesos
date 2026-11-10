import request from "@/utils/request";
import type { ResponseData } from "@/types/global";

const BASE_URL = "/manage/v1/activity_turntable";

const ActivityTurntableAPI = {
  /**
   * 获取信息
   * @returns 转盘配置信息
   */
  getInfo(queryParams: TurntableConfigPageQuery): Promise<TurntableConfigInfo> {
    return request<ResponseData<TurntableConfigInfo>>({
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
  getPage(queryParams: TurntableConfigPageQuery): Promise<TurntableConfigListVO> {
    return request<ResponseData<TurntableConfigListVO>>({
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
  create(data: TurntableConfigInfo): Promise<void> {
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
  update(data: TurntableConfigInfo): Promise<void> {
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
  export(queryParams: TurntableConfigPageQuery): Promise<{ download_url: string; filename: string }> {
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
   * 转盘抽奖
   * @param data 抽奖数据
   */
  draw(data: { user_id: number; activity_id: number; turntable_config_id: number }): Promise<{ success: boolean; prize?: any }> {
    return request<ResponseData<{ success: boolean; prize?: any }>>({
      url: `${BASE_URL}/draw`,
      method: "post",
      data: data,
    });
  },

  /**
   * 获取抽奖记录
   */
  getDrawRecords(queryParams: TurntableRecordPageQuery): Promise<TurntableRecordListVO> {
    return request<ResponseData<TurntableRecordListVO>>({
      url: `${BASE_URL}/draw_records`,
      method: "get",
      params: queryParams,
    });
  },

  /**
   * 获取转盘统计
   */
  getTurntableStats(queryParams?: TurntableStatsQuery): Promise<TurntableStats> {
    return request<ResponseData<TurntableStats>>({
      url: `${BASE_URL}/turntable_stats`,
      method: "get",
      params: queryParams,
    });
  },
};

export default ActivityTurntableAPI;