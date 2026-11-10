// translate router.meta.title, be used in breadcrumb sidebar tagsview
import i18n from "@/lang/index";

export function t(title: any) {
  // 判断是否存在国际化配置，如果没有原生返回
  // if (title != "Dashboard") {
  //   return title;
  // }
  // const hasKey = i18n.global.te(title);
  // const translatedTitle = t(title);
  return i18n.global.t(title);
  // return title;
}
