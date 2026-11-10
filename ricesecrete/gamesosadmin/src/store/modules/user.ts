import AuthAPI, { type LoginData } from "@/api/auth";
import UserAPI, { type UserInfo } from "@/api/user";
import { resetRouter } from "@/router";
import { store } from "@/store";
import {
  TOKEN_KEY,
  EXPIRES_KEY,
  REFRESH_TOKEN_KEY,
  REFRESH_TOKEN_TIME,
} from "@/enums/CacheEnum";

export const useUserStore = defineStore("user", () => {
  const user = ref<UserInfo>({
    roles: [],
    perms: [],
    menus: [],
    timestamp: 0,
  });

  const chatData = ref<any>({
    /// 消息总数
    userMessageCount: 0,
    /// 通知消息
    notifyMessages: [],
  });
  /**
   * 登录
   *
   * @param {LoginData}
   * @returns
   */
  function login(loginData: LoginData) {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.login(loginData)
        .then((data) => {
          const { token, expires_time, refresh_token } = data;
          localStorage.setItem(TOKEN_KEY, token ?? ""); // eyJhbGciOiJIUzI1NiJ9.xxx.xxx
          localStorage.setItem(EXPIRES_KEY, expires_time ?? ""); // 172832344343
          localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token ?? ""); //eyJhbGciOiJIUzI1NiJ9.xxx.xxx
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // 获取信息(用户昵称、头像、角色集合、权限集合)
  function getUserInfo() {
    return new Promise<UserInfo>((resolve, reject) => {
      UserAPI.getInfo()
        .then((data) => {
          // console.log("data", data);
          if (!data) {
            reject("Verification failed, please Login again.");
            return;
          }
          if (!data.roles || data.roles.length <= 0) {
            reject("getUserInfo: roles must be a non-null array!");
            return;
          }
          const refreshTokenTime = localStorage.getItem(REFRESH_TOKEN_TIME);
          if (Number(refreshTokenTime) - 1800 < data.timestamp) {
            AuthAPI.refreshtoken({
              refreshToken: localStorage.getItem(REFRESH_TOKEN_KEY) ?? "",
            }).then((res) => {
              const { token, expires_time, refresh_token } = res;
              localStorage.setItem(TOKEN_KEY, token ?? ""); // eyJhbGciOiJIUzI1NiJ9.xxx.xxx
              localStorage.setItem(EXPIRES_KEY, expires_time ?? ""); // 172832344343
              localStorage.setItem(REFRESH_TOKEN_KEY, refresh_token ?? ""); //eyJhbGciOiJIUzI1NiJ9.xxx.xxx
            });
          }
          Object.assign(user.value, { ...data });
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // user logout
  function logout() {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.logout()
        .then(() => {
          localStorage.setItem(TOKEN_KEY, "");
          location.reload(); // 清空路由
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  /**
   * 清空系统缓存
   */
  function clear_cache() {
    return new Promise<void>((resolve, reject) => {
      AuthAPI.clear_cache()
        .then(() => {
          resolve();
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  // remove token
  function resetToken() {
    return new Promise<void>((resolve) => {
      localStorage.setItem(TOKEN_KEY, "");
      resetRouter();
      resolve();
    });
  }

  return {
    user,
    chatData,
    login,
    getUserInfo,
    logout,
    resetToken,
    clear_cache,
  };
});

/**
 * 用于在组件外部（如在Pinia Store 中）使用 Pinia 提供的 store 实例。
 * 官方文档解释了如何在组件外部使用 Pinia Store：
 * https://pinia.vuejs.org/core-concepts/outside-component-usage.html#using-a-store-outside-of-a-component
 */
export function useUserStoreHook() {
  return useUserStore(store);
}
