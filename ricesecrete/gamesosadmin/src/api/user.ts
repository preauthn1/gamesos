import request from "@/utils/request";

class UserAPI {
  /**
   * 获取当前登录用户信息
   *
   * @returns 登录用户昵称、头像信息，包括角色和权限
   */
  static getInfo() {
    return request<any, UserInfo>({
      url: "/manage/v1/account/info",
      method: "get",
    });
  }
}

export default UserAPI;

/** 登录用户信息 */
export interface UserInfo {
  /** 用户ID */
  id?: string;

  /** 用户名 */
  username?: string;

  /** 名称 */
  realname?: string;

  /** 头像URL */
  avatar?: string;

  /** 角色 */
  roles: string[];

  /** 权限 */
  perms: string[];
  /**
   * 菜单
   */
  menus: string[];
  /**
   * 时间戳
   */
  timestamp: number;
}

/**  访问趋势视图对象 */
export interface VisitTrendVO {
  /** 日期列表 */
  dates: string[];
  /** 浏览量(PV) */
  pvList: number[];
  /** 访客数(UV) */
  uvList: number[];
  /** IP数 */
  ipList: number[];
}
/**  访问统计 */
export interface VisitStatsVO {
  /** 今日访客数(UV) */
  todayUvCount: number;
  /** 总访客数 */
  totalUvCount: number;
  /** 访客数同比增长率（相对于昨天同一时间段的增长率） */
  uvGrowthRate: number;
  /** 今日浏览量(PV) */
  todayPvCount: number;
  /** 总浏览量 */
  totalPvCount: number;
  /** 同比增长率（相对于昨天同一时间段的增长率） */
  pvGrowthRate: number;
}

export interface StatisticsStatsVO {
  /**
  * 'admin_count' => $admin_count,
            'member_count' => $member_count,
            'level2_member_count' => $level2_member_count,
            'level3_member_count' => $level3_member_count,
            'data' => $data
  */
  /** 管理员数量 */
  admin_count: number;
  /** 会员数量 */
  member_count: number;
  /** 二级会员数量 */
  level2_member_count: number;
  /** 三级会员数量 */
  level3_member_count: number;
  /** 统计数据 */
  data: any;
}
