// vite.config.ts
import vue from "file:///D:/www/educate/admin/node_modules/.pnpm/@vitejs+plugin-vue@5.2.3_vite@5.4.14_@types+node@20.17.24_sass@1.86.0_terser@5.39.0__vue@3.5.13_typescript@5.8.2_/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import vueJsx from "file:///D:/www/educate/admin/node_modules/.pnpm/@vitejs+plugin-vue-jsx@3.1.0_vite@5.4.14_@types+node@20.17.24_sass@1.86.0_terser@5.39.0__vue@3.5.13_typescript@5.8.2_/node_modules/@vitejs/plugin-vue-jsx/dist/index.mjs";
import { loadEnv, defineConfig } from "file:///D:/www/educate/admin/node_modules/.pnpm/vite@5.4.14_@types+node@20.17.24_sass@1.86.0_terser@5.39.0/node_modules/vite/dist/node/index.js";
import AutoImport from "file:///D:/www/educate/admin/node_modules/.pnpm/unplugin-auto-import@0.17.8_@vueuse+core@10.11.1_vue@3.5.13_typescript@5.8.2___rollup@4.36.0/node_modules/unplugin-auto-import/dist/vite.js";
import Components from "file:///D:/www/educate/admin/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.26.10_rollup@4.36.0_vue@3.5.13_typescript@5.8.2_/node_modules/unplugin-vue-components/dist/vite.js";
import { ElementPlusResolver } from "file:///D:/www/educate/admin/node_modules/.pnpm/unplugin-vue-components@0.26.0_@babel+parser@7.26.10_rollup@4.36.0_vue@3.5.13_typescript@5.8.2_/node_modules/unplugin-vue-components/dist/resolvers.js";
import Icons from "file:///D:/www/educate/admin/node_modules/.pnpm/unplugin-icons@0.18.5_@vue+compiler-sfc@3.5.13/node_modules/unplugin-icons/dist/vite.js";
import IconsResolver from "file:///D:/www/educate/admin/node_modules/.pnpm/unplugin-icons@0.18.5_@vue+compiler-sfc@3.5.13/node_modules/unplugin-icons/dist/resolver.js";
import { createSvgIconsPlugin } from "file:///D:/www/educate/admin/node_modules/.pnpm/vite-plugin-svg-icons@2.0.1_vite@5.4.14_@types+node@20.17.24_sass@1.86.0_terser@5.39.0_/node_modules/vite-plugin-svg-icons/dist/index.mjs";
import UnoCSS from "file:///D:/www/educate/admin/node_modules/.pnpm/unocss@0.58.9_postcss@8.5.3_rollup@4.36.0_vite@5.4.14_@types+node@20.17.24_sass@1.86.0_terser@5.39.0_/node_modules/unocss/dist/vite.mjs";
import { resolve } from "path";

// package.json
var name = "educate";
var version = "1.0.0";
var dependencies = {
  "@element-plus/icons-vue": "^2.3.1",
  "@vueuse/core": "^10.11.1",
  "@wangeditor-next/editor": "^5.6.34",
  "@wangeditor-next/editor-for-vue": "^5.1.14",
  "animate.css": "^4.1.1",
  axios: "^1.7.4",
  "crypto-js": "^4.2.0",
  echarts: "^5.6.0",
  "element-plus": "^2.8.0",
  nprogress: "^0.2.0",
  "path-browserify": "^1.0.1",
  "path-to-regexp": "^6.2.2",
  pinia: "^2.2.2",
  qs: "^6.13.0",
  vue: "^3.4.38",
  "vue-demi": "0.14.6",
  "vue-i18n": "9.9.1",
  "vue-router": "^4.4.3",
  "wasm-loader": "^1.3.0"
};
var devDependencies = {
  "@commitlint/cli": "^18.6.1",
  "@commitlint/config-conventional": "^18.6.3",
  "@iconify-json/ep": "^1.1.16",
  "@types/node": "^20.14.15",
  "@types/nprogress": "^0.2.3",
  "@types/path-browserify": "^1.0.2",
  "@types/qs": "^6.9.15",
  "@typescript-eslint/eslint-plugin": "^7.18.0",
  "@typescript-eslint/parser": "^7.18.0",
  "@vitejs/plugin-vue": "^5.1.2",
  "@vitejs/plugin-vue-jsx": "^3.1.0",
  autoprefixer: "^10.4.20",
  commitizen: "^4.3.0",
  "cz-git": "^1.9.4",
  eslint: "^8.57.0",
  "eslint-config-prettier": "^9.1.0",
  "eslint-plugin-import": "^2.29.1",
  "eslint-plugin-prettier": "^5.2.1",
  "eslint-plugin-vue": "^9.27.0",
  "fast-glob": "^3.3.2",
  husky: "^9.1.4",
  "lint-staged": "^15.2.9",
  postcss: "^8.4.41",
  "postcss-html": "^1.7.0",
  "postcss-scss": "^4.0.9",
  prettier: "^3.3.3",
  sass: "^1.77.8",
  stylelint: "^16.8.2",
  "stylelint-config-html": "^1.1.0",
  "stylelint-config-recess-order": "^4.6.0",
  "stylelint-config-recommended-scss": "^14.1.0",
  "stylelint-config-recommended-vue": "^1.5.0",
  "stylelint-config-standard": "^36.0.1",
  terser: "^5.31.6",
  typescript: "^5.5.4",
  unocss: "^0.58.9",
  "unplugin-auto-import": "^0.17.8",
  "unplugin-icons": "^0.18.5",
  "unplugin-vue-components": "^0.26.0",
  vite: "^5.4.1",
  "vite-plugin-mock-dev-server": "^1.7.1",
  "vite-plugin-svg-icons": "^2.0.1",
  "vite-plugin-vue-devtools": "^7.3.8",
  "vite-plugin-wasm": "^3.4.1",
  "vue-tsc": "^2.0.29"
};
var engines = {
  node: ">=18.0.0"
};

// vite.config.ts
import VueDevTools from "file:///D:/www/educate/admin/node_modules/.pnpm/vite-plugin-vue-devtools@7.7.2_rollup@4.36.0_vite@5.4.14_@types+node@20.17.24_sass@1.86.0_ter_lgcf25pqhns37usd4j7t6tnjaa/node_modules/vite-plugin-vue-devtools/dist/vite.mjs";
var __vite_injected_original_dirname = "D:\\www\\educate\\admin";
var __APP_INFO__ = {
  pkg: { name, version, engines, dependencies, devDependencies },
  buildTimestamp: Date.now()
};
var pathSrc = resolve(__vite_injected_original_dirname, "src");
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());
  return {
    resolve: {
      alias: {
        "@": pathSrc
      }
    },
    css: {
      // CSS 预处理器
      preprocessorOptions: {
        // 定义全局 SCSS 变量
        scss: {
          javascriptEnabled: true,
          additionalData: `
            @use "@/styles/variables.scss" as *;
          `
        }
      }
    },
    server: {
      // 允许IP访问
      host: "0.0.0.0",
      // 应用端口 (默认:3000)
      port: Number(env.VITE_APP_PORT),
      // 运行是否自动打开浏览器
      open: true,
      proxy: {
        /** 代理前缀为 /dev-api 的请求  */
        [env.VITE_APP_BASE_API]: {
          changeOrigin: true,
          // 接口地址 例如：http://vapi.youlai.tech
          target: env.VITE_APP_API_URL,
          rewrite: (path) => path.replace(new RegExp("^" + env.VITE_APP_BASE_API), "")
        }
      }
    },
    plugins: [
      vue(),
      // jsx、tsx语法支持
      vueJsx(),
      UnoCSS({
        hmrTopLevelAwait: false
      }),
      /** 自动导入配置  @see https://github.com/sxzz/element-plus-best-practices/blob/main/vite.config.ts */
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ["vue", "@vueuse/core", "pinia", "vue-router", "vue-i18n"],
        resolvers: [
          // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
          ElementPlusResolver({
            importStyle: "sass"
          }),
          // 自动导入图标组件
          IconsResolver({})
        ],
        eslintrc: {
          // 是否自动生成 eslint 规则，建议生成之后设置 false
          enabled: false,
          // 指定自动导入函数 eslint 规则的文件
          filepath: "./.eslintrc-auto-import.json",
          globalsPropValue: true
        },
        // 是否在 vue 模板中自动导入
        vueTemplate: true,
        // 指定自动导入函数TS类型声明文件路径 (false:关闭自动生成)
        dts: false
        // dts: "src/types/auto-imports.d.ts",
      }),
      Components({
        resolvers: [
          // 自动导入 Element Plus 组件
          ElementPlusResolver({
            importStyle: "sass"
          }),
          // 自动注册图标组件
          IconsResolver({
            // element-plus图标库，其他图标库 https://icon-sets.iconify.design/
            enabledCollections: ["ep"]
          })
        ],
        // 指定自定义组件位置(默认:src/components)
        dirs: ["src/components", "src/**/components"],
        // 指定自动导入组件TS类型声明文件路径 (false:关闭自动生成)
        dts: false
        // dts: "src/types/components.d.ts",
      }),
      Icons({
        // 自动安装图标库
        autoInstall: true
      }),
      createSvgIconsPlugin({
        // 指定需要缓存的图标文件夹
        iconDirs: [resolve(pathSrc, "assets/icons")],
        // 指定symbolId格式
        symbolId: "icon-[dir]-[name]"
      }),
      VueDevTools({
        openInEditorHost: `http://localhost:${env.VITE_APP_PORT}`
      })
    ],
    // 预加载项目必需的组件
    optimizeDeps: {
      include: [
        "vue",
        "vue-router",
        "pinia",
        "axios",
        "@vueuse/core",
        "path-to-regexp",
        "vue-i18n",
        "path-browserify",
        "element-plus/es/components/form/style/index",
        "element-plus/es/components/form-item/style/index",
        "element-plus/es/components/button/style/index",
        "element-plus/es/components/input/style/index",
        "element-plus/es/components/input-number/style/index",
        "element-plus/es/components/switch/style/index",
        "element-plus/es/components/upload/style/index",
        "element-plus/es/components/menu/style/index",
        "element-plus/es/components/col/style/index",
        "element-plus/es/components/icon/style/index",
        "element-plus/es/components/row/style/index",
        "element-plus/es/components/tag/style/index",
        "element-plus/es/components/dialog/style/index",
        "element-plus/es/components/loading/style/index",
        "element-plus/es/components/radio/style/index",
        "element-plus/es/components/radio-group/style/index",
        "element-plus/es/components/popover/style/index",
        "element-plus/es/components/scrollbar/style/index",
        "element-plus/es/components/tooltip/style/index",
        "element-plus/es/components/dropdown/style/index",
        "element-plus/es/components/dropdown-menu/style/index",
        "element-plus/es/components/dropdown-item/style/index",
        "element-plus/es/components/sub-menu/style/index",
        "element-plus/es/components/menu-item/style/index",
        "element-plus/es/components/divider/style/index",
        "element-plus/es/components/card/style/index",
        "element-plus/es/components/link/style/index",
        "element-plus/es/components/breadcrumb/style/index",
        "element-plus/es/components/breadcrumb-item/style/index",
        "element-plus/es/components/table/style/index",
        "element-plus/es/components/tree-select/style/index",
        "element-plus/es/components/table-column/style/index",
        "element-plus/es/components/select/style/index",
        "element-plus/es/components/option/style/index",
        "element-plus/es/components/pagination/style/index",
        "element-plus/es/components/tree/style/index",
        "element-plus/es/components/alert/style/index",
        "element-plus/es/components/radio-button/style/index",
        "element-plus/es/components/checkbox-group/style/index",
        "element-plus/es/components/checkbox/style/index",
        "element-plus/es/components/tabs/style/index",
        "element-plus/es/components/tab-pane/style/index",
        "element-plus/es/components/rate/style/index",
        "element-plus/es/components/date-picker/style/index",
        "element-plus/es/components/notification/style/index",
        "element-plus/es/components/image/style/index",
        "element-plus/es/components/statistic/style/index",
        "element-plus/es/components/watermark/style/index",
        "element-plus/es/components/config-provider/style/index",
        "element-plus/es/components/text/style/index",
        "element-plus/es/components/drawer/style/index",
        "element-plus/es/components/color-picker/style/index",
        "element-plus/es/components/backtop/style/index",
        "element-plus/es/components/message-box/style/index",
        "element-plus/es/components/badge/style/index"
      ]
    },
    // 构建配置
    build: {
      chunkSizeWarningLimit: 2e3,
      // 消除打包大小超过500kb警告
      minify: "terser",
      // Vite 2.6.x 以上需要配置 minify: "terser", terserOptions 才能生效
      terserOptions: {
        compress: {
          keep_infinity: true,
          // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
          drop_console: true,
          // 生产环境去除 console
          drop_debugger: true
          // 生产环境去除 debugger
        },
        format: {
          comments: false
          // 删除注释
        }
      },
      rollupOptions: {
        output: {
          // manualChunks: {
          //   "vue-i18n": ["vue-i18n"],
          // },
          // 用于从入口点创建的块的打包输出格式[name]表示文件名,[hash]表示该文件内容hash值
          entryFileNames: "js/[name].[hash].js",
          // 用于命名代码拆分时创建的共享块的输出命名
          chunkFileNames: "js/[name].[hash].js",
          // 用于输出静态资源的命名，[ext]表示文件扩展名
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split(".");
            let extType = info[info.length - 1];
            if (/\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "media";
            } else if (/\.(png|jpe?g|gif|svg)(\?.*)?$/.test(assetInfo.name)) {
              extType = "img";
            } else if (/\.(woff2?|eot|ttf|otf)(\?.*)?$/i.test(assetInfo.name)) {
              extType = "fonts";
            }
            return `${extType}/[name].[hash].[ext]`;
          }
        }
      }
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAicGFja2FnZS5qc29uIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcd3d3XFxcXGVkdWNhdGVcXFxcYWRtaW5cIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXHd3d1xcXFxlZHVjYXRlXFxcXGFkbWluXFxcXHZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9EOi93d3cvZWR1Y2F0ZS9hZG1pbi92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IHZ1ZUpzeCBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlLWpzeFwiO1xuaW1wb3J0IHsgVXNlckNvbmZpZywgQ29uZmlnRW52LCBsb2FkRW52LCBkZWZpbmVDb25maWcgfSBmcm9tIFwidml0ZVwiO1xuXG5pbXBvcnQgQXV0b0ltcG9ydCBmcm9tIFwidW5wbHVnaW4tYXV0by1pbXBvcnQvdml0ZVwiO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcbmltcG9ydCB7IEVsZW1lbnRQbHVzUmVzb2x2ZXIgfSBmcm9tIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHMvcmVzb2x2ZXJzXCI7XG5pbXBvcnQgSWNvbnMgZnJvbSBcInVucGx1Z2luLWljb25zL3ZpdGVcIjtcbmltcG9ydCBJY29uc1Jlc29sdmVyIGZyb20gXCJ1bnBsdWdpbi1pY29ucy9yZXNvbHZlclwiO1xuXG5pbXBvcnQgeyBjcmVhdGVTdmdJY29uc1BsdWdpbiB9IGZyb20gXCJ2aXRlLXBsdWdpbi1zdmctaWNvbnNcIjtcblxuaW1wb3J0IFVub0NTUyBmcm9tIFwidW5vY3NzL3ZpdGVcIjtcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuaW1wb3J0IHtcbiAgbmFtZSxcbiAgdmVyc2lvbixcbiAgZW5naW5lcyxcbiAgZGVwZW5kZW5jaWVzLFxuICBkZXZEZXBlbmRlbmNpZXMsXG59IGZyb20gXCIuL3BhY2thZ2UuanNvblwiO1xuXG4vKiogQHNlZSAgaHR0cHM6Ly9kZXZ0b29scy1uZXh0LnZ1ZWpzLm9yZyAgKi9cbmltcG9ydCBWdWVEZXZUb29scyBmcm9tIFwidml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzXCI7XG5cbi8qKiBcdTVFNzNcdTUzRjBcdTc2ODRcdTU0MERcdTc5RjBcdTMwMDFcdTcyNDhcdTY3MkNcdTMwMDFcdThGRDBcdTg4NENcdTYyNDBcdTk3MDBcdTc2ODRgbm9kZWBcdTcyNDhcdTY3MkNcdTMwMDFcdTRGOURcdThENTZcdTMwMDFcdTY3ODRcdTVFRkFcdTY1RjZcdTk1RjRcdTc2ODRcdTdDN0JcdTU3OEJcdTYzRDBcdTc5M0EgKi9cbmNvbnN0IF9fQVBQX0lORk9fXyA9IHtcbiAgcGtnOiB7IG5hbWUsIHZlcnNpb24sIGVuZ2luZXMsIGRlcGVuZGVuY2llcywgZGV2RGVwZW5kZW5jaWVzIH0sXG4gIGJ1aWxkVGltZXN0YW1wOiBEYXRlLm5vdygpLFxufTtcblxuY29uc3QgcGF0aFNyYyA9IHJlc29sdmUoX19kaXJuYW1lLCBcInNyY1wiKTtcbi8qKiAgVml0ZVx1OTE0RFx1N0Y2RSBAc2VlIGh0dHBzOi8vY24udml0ZWpzLmRldi9jb25maWcgKi9cbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoeyBtb2RlIH06IENvbmZpZ0Vudik6IFVzZXJDb25maWcgPT4ge1xuICBjb25zdCBlbnYgPSBsb2FkRW52KG1vZGUsIHByb2Nlc3MuY3dkKCkpO1xuICByZXR1cm4ge1xuICAgIHJlc29sdmU6IHtcbiAgICAgIGFsaWFzOiB7XG4gICAgICAgIFwiQFwiOiBwYXRoU3JjLFxuICAgICAgfSxcbiAgICB9LFxuICAgIGNzczoge1xuICAgICAgLy8gQ1NTIFx1OTg4NFx1NTkwNFx1NzQwNlx1NTY2OFxuICAgICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgICAvLyBcdTVCOUFcdTRFNDlcdTUxNjhcdTVDNDAgU0NTUyBcdTUzRDhcdTkxQ0ZcbiAgICAgICAgc2Nzczoge1xuICAgICAgICAgIGphdmFzY3JpcHRFbmFibGVkOiB0cnVlLFxuICAgICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgXG4gICAgICAgICAgICBAdXNlIFwiQC9zdHlsZXMvdmFyaWFibGVzLnNjc3NcIiBhcyAqO1xuICAgICAgICAgIGAsXG4gICAgICAgIH0sXG4gICAgICB9LFxuICAgIH0sXG4gICAgc2VydmVyOiB7XG4gICAgICAvLyBcdTUxNDFcdThCQjhJUFx1OEJCRlx1OTVFRVxuICAgICAgaG9zdDogXCIwLjAuMC4wXCIsXG4gICAgICAvLyBcdTVFOTRcdTc1MjhcdTdBRUZcdTUzRTMgKFx1OUVEOFx1OEJBNDozMDAwKVxuICAgICAgcG9ydDogTnVtYmVyKGVudi5WSVRFX0FQUF9QT1JUKSxcbiAgICAgIC8vIFx1OEZEMFx1ODg0Q1x1NjYyRlx1NTQyNlx1ODFFQVx1NTJBOFx1NjI1M1x1NUYwMFx1NkQ0Rlx1ODlDOFx1NTY2OFxuICAgICAgb3BlbjogdHJ1ZSxcbiAgICAgIHByb3h5OiB7XG4gICAgICAgIC8qKiBcdTRFRTNcdTc0MDZcdTUyNERcdTdGMDBcdTRFM0EgL2Rldi1hcGkgXHU3Njg0XHU4QkY3XHU2QzQyICAqL1xuICAgICAgICBbZW52LlZJVEVfQVBQX0JBU0VfQVBJXToge1xuICAgICAgICAgIGNoYW5nZU9yaWdpbjogdHJ1ZSxcbiAgICAgICAgICAvLyBcdTYzQTVcdTUzRTNcdTU3MzBcdTU3NDAgXHU0RjhCXHU1OTgyXHVGRjFBaHR0cDovL3ZhcGkueW91bGFpLnRlY2hcbiAgICAgICAgICB0YXJnZXQ6IGVudi5WSVRFX0FQUF9BUElfVVJMLFxuICAgICAgICAgIHJld3JpdGU6IChwYXRoKSA9PlxuICAgICAgICAgICAgcGF0aC5yZXBsYWNlKG5ldyBSZWdFeHAoXCJeXCIgKyBlbnYuVklURV9BUFBfQkFTRV9BUEkpLCBcIlwiKSxcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICBwbHVnaW5zOiBbXG4gICAgICB2dWUoKSxcbiAgICAgIC8vIGpzeFx1MzAwMXRzeFx1OEJFRFx1NkNENVx1NjUyRlx1NjMwMVxuICAgICAgdnVlSnN4KCksXG4gICAgICBVbm9DU1Moe1xuICAgICAgICBobXJUb3BMZXZlbEF3YWl0OiBmYWxzZSxcbiAgICAgIH0pLFxuICAgICAgLyoqIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1OTE0RFx1N0Y2RSAgQHNlZSBodHRwczovL2dpdGh1Yi5jb20vc3h6ei9lbGVtZW50LXBsdXMtYmVzdC1wcmFjdGljZXMvYmxvYi9tYWluL3ZpdGUuY29uZmlnLnRzICovXG4gICAgICBBdXRvSW1wb3J0KHtcbiAgICAgICAgLy8gXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1IFZ1ZSBcdTc2RjhcdTUxNzNcdTUxRkRcdTY1NzBcdUZGMENcdTU5ODJcdUZGMUFyZWYsIHJlYWN0aXZlLCB0b1JlZiBcdTdCNDlcbiAgICAgICAgaW1wb3J0czogW1widnVlXCIsIFwiQHZ1ZXVzZS9jb3JlXCIsIFwicGluaWFcIiwgXCJ2dWUtcm91dGVyXCIsIFwidnVlLWkxOG5cIl0sXG4gICAgICAgIHJlc29sdmVyczogW1xuICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NSBFbGVtZW50IFBsdXMgXHU3NkY4XHU1MTczXHU1MUZEXHU2NTcwXHVGRjBDXHU1OTgyXHVGRjFBRWxNZXNzYWdlLCBFbE1lc3NhZ2VCb3guLi4gKFx1NUUyNlx1NjgzN1x1NUYwRilcbiAgICAgICAgICBFbGVtZW50UGx1c1Jlc29sdmVyKHtcbiAgICAgICAgICAgIGltcG9ydFN0eWxlOiBcInNhc3NcIixcbiAgICAgICAgICB9KSxcbiAgICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTU2RkVcdTY4MDdcdTdFQzRcdTRFRjZcbiAgICAgICAgICBJY29uc1Jlc29sdmVyKHt9KSxcbiAgICAgICAgXSxcbiAgICAgICAgZXNsaW50cmM6IHtcbiAgICAgICAgICAvLyBcdTY2MkZcdTU0MjZcdTgxRUFcdTUyQThcdTc1MUZcdTYyMTAgZXNsaW50IFx1ODlDNFx1NTIxOVx1RkYwQ1x1NUVGQVx1OEJBRVx1NzUxRlx1NjIxMFx1NEU0Qlx1NTQwRVx1OEJCRVx1N0Y2RSBmYWxzZVxuICAgICAgICAgIGVuYWJsZWQ6IGZhbHNlLFxuICAgICAgICAgIC8vIFx1NjMwN1x1NUI5QVx1ODFFQVx1NTJBOFx1NUJGQ1x1NTE2NVx1NTFGRFx1NjU3MCBlc2xpbnQgXHU4OUM0XHU1MjE5XHU3Njg0XHU2NTg3XHU0RUY2XG4gICAgICAgICAgZmlsZXBhdGg6IFwiLi8uZXNsaW50cmMtYXV0by1pbXBvcnQuanNvblwiLFxuICAgICAgICAgIGdsb2JhbHNQcm9wVmFsdWU6IHRydWUsXG4gICAgICAgIH0sXG4gICAgICAgIC8vIFx1NjYyRlx1NTQyNlx1NTcyOCB2dWUgXHU2QTIxXHU2NzdGXHU0RTJEXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XG4gICAgICAgIHZ1ZVRlbXBsYXRlOiB0cnVlLFxuICAgICAgICAvLyBcdTYzMDdcdTVCOUFcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjVcdTUxRkRcdTY1NzBUU1x1N0M3Qlx1NTc4Qlx1NThGMFx1NjYwRVx1NjU4N1x1NEVGNlx1OERFRlx1NUY4NCAoZmFsc2U6XHU1MTczXHU5NUVEXHU4MUVBXHU1MkE4XHU3NTFGXHU2MjEwKVxuICAgICAgICBkdHM6IGZhbHNlLFxuICAgICAgICAvLyBkdHM6IFwic3JjL3R5cGVzL2F1dG8taW1wb3J0cy5kLnRzXCIsXG4gICAgICB9KSxcbiAgICAgIENvbXBvbmVudHMoe1xuICAgICAgICByZXNvbHZlcnM6IFtcbiAgICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCRkNcdTUxNjUgRWxlbWVudCBQbHVzIFx1N0VDNFx1NEVGNlxuICAgICAgICAgIEVsZW1lbnRQbHVzUmVzb2x2ZXIoe1xuICAgICAgICAgICAgaW1wb3J0U3R5bGU6IFwic2Fzc1wiLFxuICAgICAgICAgIH0pLFxuICAgICAgICAgIC8vIFx1ODFFQVx1NTJBOFx1NkNFOFx1NTE4Q1x1NTZGRVx1NjgwN1x1N0VDNFx1NEVGNlxuICAgICAgICAgIEljb25zUmVzb2x2ZXIoe1xuICAgICAgICAgICAgLy8gZWxlbWVudC1wbHVzXHU1NkZFXHU2ODA3XHU1RTkzXHVGRjBDXHU1MTc2XHU0RUQ2XHU1NkZFXHU2ODA3XHU1RTkzIGh0dHBzOi8vaWNvbi1zZXRzLmljb25pZnkuZGVzaWduL1xuICAgICAgICAgICAgZW5hYmxlZENvbGxlY3Rpb25zOiBbXCJlcFwiXSxcbiAgICAgICAgICB9KSxcbiAgICAgICAgXSxcbiAgICAgICAgLy8gXHU2MzA3XHU1QjlBXHU4MUVBXHU1QjlBXHU0RTQ5XHU3RUM0XHU0RUY2XHU0RjREXHU3RjZFKFx1OUVEOFx1OEJBNDpzcmMvY29tcG9uZW50cylcbiAgICAgICAgZGlyczogW1wic3JjL2NvbXBvbmVudHNcIiwgXCJzcmMvKiovY29tcG9uZW50c1wiXSxcbiAgICAgICAgLy8gXHU2MzA3XHU1QjlBXHU4MUVBXHU1MkE4XHU1QkZDXHU1MTY1XHU3RUM0XHU0RUY2VFNcdTdDN0JcdTU3OEJcdTU4RjBcdTY2MEVcdTY1ODdcdTRFRjZcdThERUZcdTVGODQgKGZhbHNlOlx1NTE3M1x1OTVFRFx1ODFFQVx1NTJBOFx1NzUxRlx1NjIxMClcbiAgICAgICAgZHRzOiBmYWxzZSxcbiAgICAgICAgLy8gZHRzOiBcInNyYy90eXBlcy9jb21wb25lbnRzLmQudHNcIixcbiAgICAgIH0pLFxuICAgICAgSWNvbnMoe1xuICAgICAgICAvLyBcdTgxRUFcdTUyQThcdTVCODlcdTg4QzVcdTU2RkVcdTY4MDdcdTVFOTNcbiAgICAgICAgYXV0b0luc3RhbGw6IHRydWUsXG4gICAgICB9KSxcbiAgICAgIGNyZWF0ZVN2Z0ljb25zUGx1Z2luKHtcbiAgICAgICAgLy8gXHU2MzA3XHU1QjlBXHU5NzAwXHU4OTgxXHU3RjEzXHU1QjU4XHU3Njg0XHU1NkZFXHU2ODA3XHU2NTg3XHU0RUY2XHU1OTM5XG4gICAgICAgIGljb25EaXJzOiBbcmVzb2x2ZShwYXRoU3JjLCBcImFzc2V0cy9pY29uc1wiKV0sXG4gICAgICAgIC8vIFx1NjMwN1x1NUI5QXN5bWJvbElkXHU2ODNDXHU1RjBGXG4gICAgICAgIHN5bWJvbElkOiBcImljb24tW2Rpcl0tW25hbWVdXCIsXG4gICAgICB9KSxcbiAgICAgIFZ1ZURldlRvb2xzKHtcbiAgICAgICAgb3BlbkluRWRpdG9ySG9zdDogYGh0dHA6Ly9sb2NhbGhvc3Q6JHtlbnYuVklURV9BUFBfUE9SVH1gLFxuICAgICAgfSksXG4gICAgXSxcbiAgICAvLyBcdTk4ODRcdTUyQTBcdThGN0RcdTk4NzlcdTc2RUVcdTVGQzVcdTk3MDBcdTc2ODRcdTdFQzRcdTRFRjZcbiAgICBvcHRpbWl6ZURlcHM6IHtcbiAgICAgIGluY2x1ZGU6IFtcbiAgICAgICAgXCJ2dWVcIixcbiAgICAgICAgXCJ2dWUtcm91dGVyXCIsXG4gICAgICAgIFwicGluaWFcIixcbiAgICAgICAgXCJheGlvc1wiLFxuICAgICAgICBcIkB2dWV1c2UvY29yZVwiLFxuICAgICAgICBcInBhdGgtdG8tcmVnZXhwXCIsXG4gICAgICAgIFwidnVlLWkxOG5cIixcbiAgICAgICAgXCJwYXRoLWJyb3dzZXJpZnlcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9mb3JtL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZm9ybS1pdGVtL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYnV0dG9uL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaW5wdXQvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9pbnB1dC1udW1iZXIvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9zd2l0Y2gvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy91cGxvYWQvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9tZW51L3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY29sL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaWNvbi9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3Jvdy9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhZy9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2RpYWxvZy9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2xvYWRpbmcvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3JhZGlvLWdyb3VwL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcG9wb3Zlci9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3Njcm9sbGJhci9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3Rvb2x0aXAvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kcm9wZG93bi9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2Ryb3Bkb3duLW1lbnUvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kcm9wZG93bi1pdGVtL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvc3ViLW1lbnUvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9tZW51LWl0ZW0vc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9kaXZpZGVyL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY2FyZC9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2xpbmsvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9icmVhZGNydW1iL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYnJlYWRjcnVtYi1pdGVtL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGFibGUvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90cmVlLXNlbGVjdC9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhYmxlLWNvbHVtbi9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3NlbGVjdC9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL29wdGlvbi9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3BhZ2luYXRpb24vc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90cmVlL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYWxlcnQvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9yYWRpby1idXR0b24vc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jaGVja2JveC1ncm91cC9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2NoZWNrYm94L3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvdGFicy9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL3RhYi1wYW5lL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvcmF0ZS9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL2RhdGUtcGlja2VyL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvbm90aWZpY2F0aW9uL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvaW1hZ2Uvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9zdGF0aXN0aWMvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy93YXRlcm1hcmsvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy9jb25maWctcHJvdmlkZXIvc3R5bGUvaW5kZXhcIixcbiAgICAgICAgXCJlbGVtZW50LXBsdXMvZXMvY29tcG9uZW50cy90ZXh0L3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvZHJhd2VyL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvY29sb3ItcGlja2VyL3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYmFja3RvcC9zdHlsZS9pbmRleFwiLFxuICAgICAgICBcImVsZW1lbnQtcGx1cy9lcy9jb21wb25lbnRzL21lc3NhZ2UtYm94L3N0eWxlL2luZGV4XCIsXG4gICAgICAgIFwiZWxlbWVudC1wbHVzL2VzL2NvbXBvbmVudHMvYmFkZ2Uvc3R5bGUvaW5kZXhcIixcbiAgICAgIF0sXG4gICAgfSxcbiAgICAvLyBcdTY3ODRcdTVFRkFcdTkxNERcdTdGNkVcbiAgICBidWlsZDoge1xuICAgICAgY2h1bmtTaXplV2FybmluZ0xpbWl0OiAyMDAwLCAvLyBcdTZEODhcdTk2NjRcdTYyNTNcdTUzMDVcdTU5MjdcdTVDMEZcdThEODVcdThGQzc1MDBrYlx1OEI2Nlx1NTQ0QVxuICAgICAgbWluaWZ5OiBcInRlcnNlclwiLCAvLyBWaXRlIDIuNi54IFx1NEVFNVx1NEUwQVx1OTcwMFx1ODk4MVx1OTE0RFx1N0Y2RSBtaW5pZnk6IFwidGVyc2VyXCIsIHRlcnNlck9wdGlvbnMgXHU2MjREXHU4MEZEXHU3NTFGXHU2NTQ4XG4gICAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICAgIGNvbXByZXNzOiB7XG4gICAgICAgICAga2VlcF9pbmZpbml0eTogdHJ1ZSwgLy8gXHU5NjMyXHU2QjYyIEluZmluaXR5IFx1ODhBQlx1NTM4Qlx1N0YyOVx1NjIxMCAxLzBcdUZGMENcdThGRDlcdTUzRUZcdTgwRkRcdTRGMUFcdTVCRkNcdTgxRjQgQ2hyb21lIFx1NEUwQVx1NzY4NFx1NjAyN1x1ODBGRFx1OTVFRVx1OTg5OFxuICAgICAgICAgIGRyb3BfY29uc29sZTogdHJ1ZSwgLy8gXHU3NTFGXHU0RUE3XHU3M0FGXHU1ODgzXHU1M0JCXHU5NjY0IGNvbnNvbGVcbiAgICAgICAgICBkcm9wX2RlYnVnZ2VyOiB0cnVlLCAvLyBcdTc1MUZcdTRFQTdcdTczQUZcdTU4ODNcdTUzQkJcdTk2NjQgZGVidWdnZXJcbiAgICAgICAgfSxcbiAgICAgICAgZm9ybWF0OiB7XG4gICAgICAgICAgY29tbWVudHM6IGZhbHNlLCAvLyBcdTUyMjBcdTk2NjRcdTZDRThcdTkxQ0FcbiAgICAgICAgfSxcbiAgICAgIH0sXG4gICAgICByb2xsdXBPcHRpb25zOiB7XG4gICAgICAgIG91dHB1dDoge1xuICAgICAgICAgIC8vIG1hbnVhbENodW5rczoge1xuICAgICAgICAgIC8vICAgXCJ2dWUtaTE4blwiOiBbXCJ2dWUtaTE4blwiXSxcbiAgICAgICAgICAvLyB9LFxuICAgICAgICAgIC8vIFx1NzUyOFx1NEU4RVx1NEVDRVx1NTE2NVx1NTNFM1x1NzBCOVx1NTIxQlx1NUVGQVx1NzY4NFx1NTc1N1x1NzY4NFx1NjI1M1x1NTMwNVx1OEY5M1x1NTFGQVx1NjgzQ1x1NUYwRltuYW1lXVx1ODg2OFx1NzkzQVx1NjU4N1x1NEVGNlx1NTQwRCxbaGFzaF1cdTg4NjhcdTc5M0FcdThCRTVcdTY1ODdcdTRFRjZcdTUxODVcdTVCQjloYXNoXHU1MDNDXG4gICAgICAgICAgZW50cnlGaWxlTmFtZXM6IFwianMvW25hbWVdLltoYXNoXS5qc1wiLFxuICAgICAgICAgIC8vIFx1NzUyOFx1NEU4RVx1NTQ3RFx1NTQwRFx1NEVFM1x1NzgwMVx1NjJDNlx1NTIwNlx1NjVGNlx1NTIxQlx1NUVGQVx1NzY4NFx1NTE3MVx1NEVBQlx1NTc1N1x1NzY4NFx1OEY5M1x1NTFGQVx1NTQ3RFx1NTQwRFxuICAgICAgICAgIGNodW5rRmlsZU5hbWVzOiBcImpzL1tuYW1lXS5baGFzaF0uanNcIixcbiAgICAgICAgICAvLyBcdTc1MjhcdTRFOEVcdThGOTNcdTUxRkFcdTk3NTlcdTYwMDFcdThENDRcdTZFOTBcdTc2ODRcdTU0N0RcdTU0MERcdUZGMENbZXh0XVx1ODg2OFx1NzkzQVx1NjU4N1x1NEVGNlx1NjI2OVx1NUM1NVx1NTQwRFxuICAgICAgICAgIGFzc2V0RmlsZU5hbWVzOiAoYXNzZXRJbmZvOiBhbnkpID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGluZm8gPSBhc3NldEluZm8ubmFtZS5zcGxpdChcIi5cIik7XG4gICAgICAgICAgICBsZXQgZXh0VHlwZSA9IGluZm9baW5mby5sZW5ndGggLSAxXTtcbiAgICAgICAgICAgIC8vIGNvbnNvbGUubG9nKCdcdTY1ODdcdTRFRjZcdTRGRTFcdTYwNkYnLCBhc3NldEluZm8ubmFtZSlcbiAgICAgICAgICAgIGlmIChcbiAgICAgICAgICAgICAgL1xcLihtcDR8d2VibXxvZ2d8bXAzfHdhdnxmbGFjfGFhYykoXFw/LiopPyQvaS50ZXN0KGFzc2V0SW5mby5uYW1lKVxuICAgICAgICAgICAgKSB7XG4gICAgICAgICAgICAgIGV4dFR5cGUgPSBcIm1lZGlhXCI7XG4gICAgICAgICAgICB9IGVsc2UgaWYgKC9cXC4ocG5nfGpwZT9nfGdpZnxzdmcpKFxcPy4qKT8kLy50ZXN0KGFzc2V0SW5mby5uYW1lKSkge1xuICAgICAgICAgICAgICBleHRUeXBlID0gXCJpbWdcIjtcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoL1xcLih3b2ZmMj98ZW90fHR0ZnxvdGYpKFxcPy4qKT8kL2kudGVzdChhc3NldEluZm8ubmFtZSkpIHtcbiAgICAgICAgICAgICAgZXh0VHlwZSA9IFwiZm9udHNcIjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHJldHVybiBgJHtleHRUeXBlfS9bbmFtZV0uW2hhc2hdLltleHRdYDtcbiAgICAgICAgICB9LFxuICAgICAgICB9LFxuICAgICAgfSxcbiAgICB9LFxuICAgIGRlZmluZToge1xuICAgICAgX19BUFBfSU5GT19fOiBKU09OLnN0cmluZ2lmeShfX0FQUF9JTkZPX18pLFxuICAgIH0sXG4gIH07XG59KTtcbiIsICJ7XG4gIFwibmFtZVwiOiBcImVkdWNhdGVcIixcbiAgXCJ2ZXJzaW9uXCI6IFwiMS4wLjBcIixcbiAgXCJwcml2YXRlXCI6IHRydWUsXG4gIFwidHlwZVwiOiBcIm1vZHVsZVwiLFxuICBcInNjcmlwdHNcIjoge1xuICAgIFwiZGV2XCI6IFwidml0ZVwiLFxuICAgIFwiYnVpbGRcIjogXCJ2dWUtdHNjIC0tbm9FbWl0ICYgdml0ZSBidWlsZFwiLFxuICAgIFwicHJldmlld1wiOiBcInZpdGUgcHJldmlld1wiLFxuICAgIFwiYnVpbGQtb25seVwiOiBcInZpdGUgYnVpbGRcIixcbiAgICBcInR5cGUtY2hlY2tcIjogXCJ2dWUtdHNjIC0tbm9FbWl0XCIsXG4gICAgXCJsaW50OmVzbGludFwiOiBcImVzbGludCAgLS1maXggLS1leHQgLnRzLC5qcywudnVlIC4vc3JjIFwiLFxuICAgIFwibGludDpwcmV0dGllclwiOiBcInByZXR0aWVyIC0td3JpdGUgXFxcIioqLyoue2pzLGNqcyx0cyxqc29uLHRzeCxjc3MsbGVzcyxzY3NzLHZ1ZSxodG1sLG1kfVxcXCJcIixcbiAgICBcImxpbnQ6c3R5bGVsaW50XCI6IFwic3R5bGVsaW50ICBcXFwiKiovKi57Y3NzLHNjc3MsdnVlfVxcXCIgLS1maXhcIixcbiAgICBcImxpbnQ6bGludC1zdGFnZWRcIjogXCJsaW50LXN0YWdlZFwiLFxuICAgIFwicHJlaW5zdGFsbFwiOiBcIm5weCBvbmx5LWFsbG93IHBucG1cIixcbiAgICBcInByZXBhcmVcIjogXCJodXNreVwiLFxuICAgIFwiY29tbWl0XCI6IFwiZ2l0LWN6XCJcbiAgfSxcbiAgXCJjb25maWdcIjoge1xuICAgIFwiY29tbWl0aXplblwiOiB7XG4gICAgICBcInBhdGhcIjogXCJub2RlX21vZHVsZXMvY3otZ2l0XCJcbiAgICB9XG4gIH0sXG4gIFwibGludC1zdGFnZWRcIjoge1xuICAgIFwiKi57anMsdHN9XCI6IFtcbiAgICAgIFwiZXNsaW50IC0tZml4XCIsXG4gICAgICBcInByZXR0aWVyIC0td3JpdGVcIlxuICAgIF0sXG4gICAgXCIqLntjanMsanNvbn1cIjogW1xuICAgICAgXCJwcmV0dGllciAtLXdyaXRlXCJcbiAgICBdLFxuICAgIFwiKi57dnVlLGh0bWx9XCI6IFtcbiAgICAgIFwiZXNsaW50IC0tZml4XCIsXG4gICAgICBcInByZXR0aWVyIC0td3JpdGVcIixcbiAgICAgIFwic3R5bGVsaW50IC0tZml4XCJcbiAgICBdLFxuICAgIFwiKi57c2Nzcyxjc3N9XCI6IFtcbiAgICAgIFwic3R5bGVsaW50IC0tZml4XCIsXG4gICAgICBcInByZXR0aWVyIC0td3JpdGVcIlxuICAgIF0sXG4gICAgXCIqLm1kXCI6IFtcbiAgICAgIFwicHJldHRpZXIgLS13cml0ZVwiXG4gICAgXVxuICB9LFxuICBcImRlcGVuZGVuY2llc1wiOiB7XG4gICAgXCJAZWxlbWVudC1wbHVzL2ljb25zLXZ1ZVwiOiBcIl4yLjMuMVwiLFxuICAgIFwiQHZ1ZXVzZS9jb3JlXCI6IFwiXjEwLjExLjFcIixcbiAgICBcIkB3YW5nZWRpdG9yLW5leHQvZWRpdG9yXCI6IFwiXjUuNi4zNFwiLFxuICAgIFwiQHdhbmdlZGl0b3ItbmV4dC9lZGl0b3ItZm9yLXZ1ZVwiOiBcIl41LjEuMTRcIixcbiAgICBcImFuaW1hdGUuY3NzXCI6IFwiXjQuMS4xXCIsXG4gICAgXCJheGlvc1wiOiBcIl4xLjcuNFwiLFxuICAgIFwiY3J5cHRvLWpzXCI6IFwiXjQuMi4wXCIsXG4gICAgXCJlY2hhcnRzXCI6IFwiXjUuNi4wXCIsXG4gICAgXCJlbGVtZW50LXBsdXNcIjogXCJeMi44LjBcIixcbiAgICBcIm5wcm9ncmVzc1wiOiBcIl4wLjIuMFwiLFxuICAgIFwicGF0aC1icm93c2VyaWZ5XCI6IFwiXjEuMC4xXCIsXG4gICAgXCJwYXRoLXRvLXJlZ2V4cFwiOiBcIl42LjIuMlwiLFxuICAgIFwicGluaWFcIjogXCJeMi4yLjJcIixcbiAgICBcInFzXCI6IFwiXjYuMTMuMFwiLFxuICAgIFwidnVlXCI6IFwiXjMuNC4zOFwiLFxuICAgIFwidnVlLWRlbWlcIjogXCIwLjE0LjZcIixcbiAgICBcInZ1ZS1pMThuXCI6IFwiOS45LjFcIixcbiAgICBcInZ1ZS1yb3V0ZXJcIjogXCJeNC40LjNcIixcbiAgICBcIndhc20tbG9hZGVyXCI6IFwiXjEuMy4wXCJcbiAgfSxcbiAgXCJkZXZEZXBlbmRlbmNpZXNcIjoge1xuICAgIFwiQGNvbW1pdGxpbnQvY2xpXCI6IFwiXjE4LjYuMVwiLFxuICAgIFwiQGNvbW1pdGxpbnQvY29uZmlnLWNvbnZlbnRpb25hbFwiOiBcIl4xOC42LjNcIixcbiAgICBcIkBpY29uaWZ5LWpzb24vZXBcIjogXCJeMS4xLjE2XCIsXG4gICAgXCJAdHlwZXMvbm9kZVwiOiBcIl4yMC4xNC4xNVwiLFxuICAgIFwiQHR5cGVzL25wcm9ncmVzc1wiOiBcIl4wLjIuM1wiLFxuICAgIFwiQHR5cGVzL3BhdGgtYnJvd3NlcmlmeVwiOiBcIl4xLjAuMlwiLFxuICAgIFwiQHR5cGVzL3FzXCI6IFwiXjYuOS4xNVwiLFxuICAgIFwiQHR5cGVzY3JpcHQtZXNsaW50L2VzbGludC1wbHVnaW5cIjogXCJeNy4xOC4wXCIsXG4gICAgXCJAdHlwZXNjcmlwdC1lc2xpbnQvcGFyc2VyXCI6IFwiXjcuMTguMFwiLFxuICAgIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI6IFwiXjUuMS4yXCIsXG4gICAgXCJAdml0ZWpzL3BsdWdpbi12dWUtanN4XCI6IFwiXjMuMS4wXCIsXG4gICAgXCJhdXRvcHJlZml4ZXJcIjogXCJeMTAuNC4yMFwiLFxuICAgIFwiY29tbWl0aXplblwiOiBcIl40LjMuMFwiLFxuICAgIFwiY3otZ2l0XCI6IFwiXjEuOS40XCIsXG4gICAgXCJlc2xpbnRcIjogXCJeOC41Ny4wXCIsXG4gICAgXCJlc2xpbnQtY29uZmlnLXByZXR0aWVyXCI6IFwiXjkuMS4wXCIsXG4gICAgXCJlc2xpbnQtcGx1Z2luLWltcG9ydFwiOiBcIl4yLjI5LjFcIixcbiAgICBcImVzbGludC1wbHVnaW4tcHJldHRpZXJcIjogXCJeNS4yLjFcIixcbiAgICBcImVzbGludC1wbHVnaW4tdnVlXCI6IFwiXjkuMjcuMFwiLFxuICAgIFwiZmFzdC1nbG9iXCI6IFwiXjMuMy4yXCIsXG4gICAgXCJodXNreVwiOiBcIl45LjEuNFwiLFxuICAgIFwibGludC1zdGFnZWRcIjogXCJeMTUuMi45XCIsXG4gICAgXCJwb3N0Y3NzXCI6IFwiXjguNC40MVwiLFxuICAgIFwicG9zdGNzcy1odG1sXCI6IFwiXjEuNy4wXCIsXG4gICAgXCJwb3N0Y3NzLXNjc3NcIjogXCJeNC4wLjlcIixcbiAgICBcInByZXR0aWVyXCI6IFwiXjMuMy4zXCIsXG4gICAgXCJzYXNzXCI6IFwiXjEuNzcuOFwiLFxuICAgIFwic3R5bGVsaW50XCI6IFwiXjE2LjguMlwiLFxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1odG1sXCI6IFwiXjEuMS4wXCIsXG4gICAgXCJzdHlsZWxpbnQtY29uZmlnLXJlY2Vzcy1vcmRlclwiOiBcIl40LjYuMFwiLFxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1yZWNvbW1lbmRlZC1zY3NzXCI6IFwiXjE0LjEuMFwiLFxuICAgIFwic3R5bGVsaW50LWNvbmZpZy1yZWNvbW1lbmRlZC12dWVcIjogXCJeMS41LjBcIixcbiAgICBcInN0eWxlbGludC1jb25maWctc3RhbmRhcmRcIjogXCJeMzYuMC4xXCIsXG4gICAgXCJ0ZXJzZXJcIjogXCJeNS4zMS42XCIsXG4gICAgXCJ0eXBlc2NyaXB0XCI6IFwiXjUuNS40XCIsXG4gICAgXCJ1bm9jc3NcIjogXCJeMC41OC45XCIsXG4gICAgXCJ1bnBsdWdpbi1hdXRvLWltcG9ydFwiOiBcIl4wLjE3LjhcIixcbiAgICBcInVucGx1Z2luLWljb25zXCI6IFwiXjAuMTguNVwiLFxuICAgIFwidW5wbHVnaW4tdnVlLWNvbXBvbmVudHNcIjogXCJeMC4yNi4wXCIsXG4gICAgXCJ2aXRlXCI6IFwiXjUuNC4xXCIsXG4gICAgXCJ2aXRlLXBsdWdpbi1tb2NrLWRldi1zZXJ2ZXJcIjogXCJeMS43LjFcIixcbiAgICBcInZpdGUtcGx1Z2luLXN2Zy1pY29uc1wiOiBcIl4yLjAuMVwiLFxuICAgIFwidml0ZS1wbHVnaW4tdnVlLWRldnRvb2xzXCI6IFwiXjcuMy44XCIsXG4gICAgXCJ2aXRlLXBsdWdpbi13YXNtXCI6IFwiXjMuNC4xXCIsXG4gICAgXCJ2dWUtdHNjXCI6IFwiXjIuMC4yOVwiXG4gIH0sXG4gIFwicmVwb3NpdG9yeVwiOiBcIlwiLFxuICBcImF1dGhvclwiOiBcImxheDEwMjRcIixcbiAgXCJsaWNlbnNlXCI6IFwiTUlUXCIsXG4gIFwiZW5naW5lc1wiOiB7XG4gICAgXCJub2RlXCI6IFwiPj0xOC4wLjBcIlxuICB9XG59XG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXNQLE9BQU8sU0FBUztBQUN0USxPQUFPLFlBQVk7QUFDbkIsU0FBZ0MsU0FBUyxvQkFBb0I7QUFFN0QsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFDdkIsU0FBUywyQkFBMkI7QUFDcEMsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBRTFCLFNBQVMsNEJBQTRCO0FBRXJDLE9BQU8sWUFBWTtBQUNuQixTQUFTLGVBQWU7OztBQ1p0QixXQUFRO0FBQ1IsY0FBVztBQTJDWCxtQkFBZ0I7QUFBQSxFQUNkLDJCQUEyQjtBQUFBLEVBQzNCLGdCQUFnQjtBQUFBLEVBQ2hCLDJCQUEyQjtBQUFBLEVBQzNCLG1DQUFtQztBQUFBLEVBQ25DLGVBQWU7QUFBQSxFQUNmLE9BQVM7QUFBQSxFQUNULGFBQWE7QUFBQSxFQUNiLFNBQVc7QUFBQSxFQUNYLGdCQUFnQjtBQUFBLEVBQ2hCLFdBQWE7QUFBQSxFQUNiLG1CQUFtQjtBQUFBLEVBQ25CLGtCQUFrQjtBQUFBLEVBQ2xCLE9BQVM7QUFBQSxFQUNULElBQU07QUFBQSxFQUNOLEtBQU87QUFBQSxFQUNQLFlBQVk7QUFBQSxFQUNaLFlBQVk7QUFBQSxFQUNaLGNBQWM7QUFBQSxFQUNkLGVBQWU7QUFDakI7QUFDQSxzQkFBbUI7QUFBQSxFQUNq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
