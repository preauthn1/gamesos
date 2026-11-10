import { createApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";

// 本地SVG图标
import "virtual:svg-icons-register";

// 样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "@/styles/index.scss";
import "uno.css";
import "animate.css";
// import tokenWasm from "@/assets/token.wasm?url";
import { sysUserStoreHook } from "@/store/modules/sys";
import defaultSettings from "@/settings";
// import wasmExecJS from "@/assets/token.js?raw"; // 以字符串形式加载

async function initApp() {
  try {
    // Fetch config during initialization
    await sysUserStoreHook()
      .getConfig()
      .then(() => {
        const config = sysUserStoreHook().sysData;
        defaultSettings.title = config.sys.name;
        defaultSettings.version = config.sys.version;
        defaultSettings.copyright = config.sys.copyright;
        defaultSettings.sys_time = config.sys.sys_time;
        defaultSettings.sys_timezone = config.sys.sys_timezone;
        window.document.title = defaultSettings.title;
      });
    // Initialize app after config is loaded
    const app = createApp(App);
    app.use(setupPlugins);
    app.mount("#app");
  } catch (error) {
    console.error("Failed to load app config:", error);
    // Handle error appropriately
  }
}
window.getSign = (url, timestamp) => {
  return "testsign";
};
initApp();
// const loadWasm = async () => {
//   // 创建 <script> 标签注入 wasm_exec.js 到全局作用域
//   const script = document.createElement("script");
//   script.textContent = wasmExecJS;
//   document.head.appendChild(script);
//   // 确保 Go 构造函数已加载
//   await new Promise((resolve) => {
//     const checkGo = setInterval(() => {
//       if ((window as any).Go) {
//         clearInterval(checkGo);
//         resolve(null);
//       }
//     }, 100);
//   });

//   const response = await fetch(tokenWasm);
//   const buffer = await response.arrayBuffer();

//   const go = new (window as any).Go(); // 初始化 Go 实例
//   const result = await WebAssembly.instantiate(buffer, go.importObject);
//   go.run(result.instance);
//   //  getSign 方法已经注入到 window 对象中，可以直接调用
//   return "";
// };

// loadWasm().then(() => {
//   initApp();
// });
