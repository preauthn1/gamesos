import request from "@/utils/request";

class AuthAPI {
  /** 登录 接口*/
  static login(data: LoginData) {
    return request<any, LoginResult>({
      url: "/manage/v1/account/login",
      method: "post",
      data: data,
    });
  }

  /** 登录 接口*/
  static refreshtoken(data: refreshTokenData) {
    return request<any, LoginResult>({
      url: "/manage/v1/account/refresh_token",
      method: "post",
      data: data,
    });
  }
  /** 注销 接口*/
  static logout() {
    return request({
      url: "/manage/v1/account/logout",
      method: "get",
    });
  }

  /** 获取验证码 接口*/
  static getCaptcha() {
    return request<any, CaptchaResult>({
      url: "/manage/v1/account/captcha",
      method: "get",
    });
  }

  /**
   * 翻译语言
   * @param text
   * @returns
   */
  static translate(text: string) {
    return request<any, any>({
      url: "/manage/v1/account/translate",
      method: "get",
      params: { text: text },
    });
  }

  /**
   * 清除系统缓存
   * @param text
   * @returns
   */
  static clear_cache() {
    return request<any, any>({
      url: "/manage/v1/account/clear_cache",
      method: "get",
    });
  }
}

export default AuthAPI;

/** 登录请求参数 */
export interface LoginData {
  /** 用户名 */
  username: string;
  /** 密码 */
  password: string;
  /** 验证码缓存key */
  captcha_id: string;
  /** 验证码 */
  captcha: string;
  google_code?: string;
}

/** 登录响应 */
export interface LoginResult {
  /** 访问token */
  token?: string;
  /** 过期时间(单位：秒) */
  expires_time?: string;
  /** 刷新token */
  refresh_token?: string;
}

/** 验证码响应 */
export interface CaptchaResult {
  /** 验证码缓存key */
  captcha_id: string;
  /** 验证码图片Base64字符串 */
  captcha_image: string;
}

/** 刷新token请求参数 */
export interface refreshTokenData {
  /** 刷新token */
  refreshToken?: string;
}
