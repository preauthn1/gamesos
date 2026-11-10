import type { App } from "vue";
import { createI18n } from "vue-i18n";
import { useAppStoreHook } from "@/store/modules/app";
// import { MD5 } from "crypto-js";
// 本地语言包
import enLocale from "./package/en";
import zhCnLocale from "./package/zh-cn";
import { LANG_KEY } from "@/enums/CacheEnum";
import MenuAPI from "@/api/menu";

const appStore = useAppStoreHook();

const messages = {
  "zh-cn": {},
  en: {},
};

const temp_lang = localStorage.getItem(LANG_KEY);
if (temp_lang && temp_lang != undefined && temp_lang != "undefined") {
  // console.log("temp_lang", temp_lang);
  const temp_lang_data = JSON.parse(temp_lang);
  messages["zh-cn"] = {
    ...zhCnLocale,
    ...temp_lang_data["zh-CN"],
  };
  messages["en"] = {
    ...enLocale,
    ...temp_lang_data["en"],
  };
} else {
  messages["zh-cn"] = zhCnLocale;
  messages["en"] = enLocale;
}

const i18n = createI18n({
  legacy: false,
  locale: appStore.language,
  messages: messages,
  globalInjection: true,
  missing: (locale, key) => {
    console.log(`Translation missing for key: ${key} in locale: ${locale}`);
    const key_md5 = key;
    const temp_key = localStorage.getItem(key_md5);
    console.log(key, key_md5);
    if (temp_key) {
      console.log(key, temp_key);
    } else {
      const query = {
        text: key,
      };
      MenuAPI.setLang(query).then((res: any) => {
        console.log(res);
      });
      localStorage.setItem(key_md5, "1");
    }
  },
});

// 全局注册 i18n
export function setupI18n(app: App<Element>) {
  app.use(i18n);
}

export default i18n;
