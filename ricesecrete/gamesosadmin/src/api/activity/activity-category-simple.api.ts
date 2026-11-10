import request from "@/utils/request";

const BASE_URL = "/manage/v1/activity_category";

const ActivityCategoryAPI = {
  /**
   * 获取信息
   * @returns 活动分类信息
   */
  getInfo(queryParams: Record<string, any>) {
    return request<ActivityCategoryInfo>({
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
  getPage(queryParams: Record<string, any>) {
    return request<ActivityCategoryListVO>({
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
  create(data: ActivityCategoryInfo) {
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
  update(data: ActivityCategoryInfo) {
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
  export(queryParams: Record<string, any>) {
    return request<{ download_url: string; filename: string }>({
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
  deleteByIds(data: { id: string }) {
    return request({
      url: `${BASE_URL}/delete`,
      method: "post",
      data: data,
    });
  },
};

export default ActivityCategoryAPI;