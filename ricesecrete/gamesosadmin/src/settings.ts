import { SizeEnum } from "./enums/SizeEnum";
import { LayoutEnum } from "./enums/LayoutEnum";
import { ThemeEnum } from "./enums/ThemeEnum";
import { LanguageEnum } from "./enums/LanguageEnum";
const { pkg } = __APP_INFO__;

const mediaQueryList = window.matchMedia("(prefers-color-scheme: dark)");

const defaultSettings: AppSettings = {
  title: "Admin_Title",
  version: pkg.version,
  copyright: "Copyright © 2022-2023",
  sys_time: new Date().getTime(),
  sys_timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  showSettings: true,
  tagsView: true,
  fixedHeader: true,
  sidebarLogo: true,
  layout: LayoutEnum.LEFT,
  theme: mediaQueryList.matches ? ThemeEnum.DARK : ThemeEnum.LIGHT,
  size: SizeEnum.DEFAULT,
  language: LanguageEnum.ZH_CN,
  themeColor: "#4080FF",
  watermarkEnabled: false,
  watermarkContent: pkg.name,
};

export default defaultSettings;
