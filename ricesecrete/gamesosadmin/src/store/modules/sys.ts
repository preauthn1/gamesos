import MenuAPI, { type SysDataVO } from "@/api/menu";
import { store } from "@/store";
import { LANG_KEY, LANG_CACHE_TIME } from "@/enums/CacheEnum";

export const sysUserStore = defineStore("sys", () => {
  const sysData = ref<SysDataVO>({
    lang: [],
    lang_cache_time: 0,
    sys: {
      name: "",
      version: "",
      copyright: "",
      logo: "",
      sys_time: "", // 添加这个字段
      sys_timezone: "", // 添加这个字段
    },
  });

  /**
   * 获取配置
   * @returns
   */
  function getConfig() {
    return new Promise<void>((resolve, reject) => {
      MenuAPI.getConfig()
        .then((res: any) => {
          // 处理不同的响应格式
          let configData: SysDataVO;

          // 情况1：res 直接就是配置数据
          if (res && typeof res === "object") {
            // 检查是否有 data 属性
            if (res.data) {
              configData = res.data; // 格式: { data: {...} }
            } else if (res.sys) {
              configData = res; // 格式: { sys: {...}, lang: [...] }
            } else {
              // 未知格式，使用默认值
              configData = {
                lang: [],
                lang_cache_time: 0,
                sys: {
                  name: "默认系统",
                  version: "1.0.0",
                  copyright: "",
                  logo: "",
                  sys_time: new Date().toISOString(),
                  sys_timezone: "Asia/Shanghai",
                },
              };
            }
          } else {
            // 响应为空或格式错误
            throw new Error("配置接口返回数据格式错误");
          }

          // 更新 store 数据
          sysData.value = {
            ...sysData.value,
            ...configData,
            sys: {
              ...sysData.value.sys,
              ...configData.sys,
            },
          };
          // 处理语言缓存
          const lang_cache_time = localStorage.getItem(LANG_CACHE_TIME);
          const newCacheTime = configData.lang_cache_time || 0;

          if (lang_cache_time !== String(newCacheTime)) {
            getLang(newCacheTime).then(resolve).catch(reject);
          } else {
            resolve();
          }
        })
        .catch((error:any) => {
          console.error("获取配置失败:", error);
          reject(error);
        });
    });
  }

  // 获取语言包
  function getLang(lang_cache_time: number) {
    return new Promise<void>((resolve, reject) => {
      MenuAPI.getLang()
        .then((res: any) => {
          console.log("语言包响应:", res); // 调试日志

          let langData;

          // 处理不同的响应格式
          if (res && typeof res === "object") {
            if (res.data) {
              langData = res.data;
            } else {
              langData = res;
            }
          } else {
            langData = {};
          }

          localStorage.setItem(LANG_CACHE_TIME, String(lang_cache_time));
          localStorage.setItem(LANG_KEY, JSON.stringify(langData));
          resolve();
        })
        .catch((error) => {
          console.error("获取语言包失败:", error);
          // 不拒绝，允许应用继续
          resolve();
        });
    });
  }

  // 添加一些辅助方法用于安全访问
  function getSysConfig() {
    return sysData.value?.sys || {};
  }

  function getSysName() {
    return sysData.value?.sys?.name || "默认系统";
  }

  function getSysVersion() {
    return sysData.value?.sys?.version || "1.0.0";
  }

  function getSysTimezone() {
    return sysData.value?.sys?.sys_timezone || "Asia/Shanghai";
  }

  return {
    sysData,
    getLang,
    getConfig,
    getSysConfig,
    getSysName,
    getSysVersion,
    getSysTimezone,
  };
});

export function sysUserStoreHook() {
  return sysUserStore(store);
}
