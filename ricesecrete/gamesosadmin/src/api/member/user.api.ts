import request from "@/utils/request";

const BASE_URL = "/manage/v1/user";

const UserAPI = {
  /**
   * 获取信息
   * @returns 权限信息
   */
  getInfo(queryParams: object) {
    return request<any, UserInfo>({
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
    return request<any, UserListVO>({
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
  create(data: UserInfo) {
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
  update(data: UserInfo) {
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

export default UserAPI;

/** 查询参数 */
export interface UserPageQuery extends PageQuery {
  /** 搜索关键字 */
  keywords?: string;
  //用户id
  id?: string;
  /** 邀请码 */
  invitation_code?: string;
  /**用户名 */
  username?: string;
  /** 上级id */
  superior_id?: string;
  /** 上级邀请码 */
  superior_invitation_code?: string;
  /** 顶级id */
  top_id?: string;
  /** 顶级邀请码 */
  top_invitation_code?: string;
  /** 状态 */
  status?: string;
}

/** 类型 */
export interface UserInfo {
  /** ID */
  id?: string;
  /** 用户名 */
  username: string;
  /** 昵称 */
  nickname: string;
  /** 密码 */
  password: string;
  /** 头像 */
  avatar: string;
  /** 邮箱 */
  email: string;
  /** 手机 */
  phone: string;
  /** 手机区号 */
  qh: string;
  /**
   * 等级
   */
  level: string;
  /**
   * 邀请码
   */
  inv_code?: string;
  /** 状态：2禁用，1正常 */
  status: number;
  /**
   * KYC认证状态 :0未认证 1认证中 2认证成功 3认证失败
   */
  kyc_status: number;
  /**  */
  lang: string;
}

export interface UserList extends UserInfo {
  /** 更新时间 */
  updated_at: string;
  /** 创建时间 */
  created_at: string;
}

export interface UserListVO {
  /** 父级ID */
  total: number;
  list: UserList[];
}
