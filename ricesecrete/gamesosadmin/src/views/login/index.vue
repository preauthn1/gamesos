<template>
  <div class="login-container">
    <!-- 顶部工具栏 -->
    <div class="top-bar">
      <el-switch
        v-model="isDark"
        inline-prompt
        active-icon="Moon"
        inactive-icon="Sunny"
        @change="toggleTheme"
      />
      <lang-select class="ml-2 cursor-pointer" />
    </div>
    <!-- 登录表单 -->
    <el-card class="login-card">
      <div class="text-center relative">
        <h2>{{ defaultSettings.title }}</h2>
        <el-tag class="ml-2 absolute-rt">{{ defaultSettings.version }}</el-tag>
      </div>

      <el-form
        ref="loginFormRef"
        :model="loginData"
        :rules="loginRules"
        class="login-form"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <div class="input-wrapper">
            <i-ep-user class="mx-2" />
            <el-input
              ref="username"
              v-model="loginData.username"
              :placeholder="$t('Login_Username')"
              name="username"
              size="large"
              class="h-[48px]"
            />
          </div>
        </el-form-item>

        <!-- 密码 -->
        <el-tooltip
          :visible="isCapslock"
          :content="$t('Login_CapsLock')"
          placement="right"
        >
          <el-form-item prop="password">
            <div class="input-wrapper">
              <i-ep-lock class="mx-2" />
              <el-input
                v-model="loginData.password"
                :placeholder="$t('Login_Password')"
                type="password"
                name="password"
                @keyup="checkCapslock"
                @keyup.enter="handleLoginSubmit"
                size="large"
                class="h-[48px] pr-2"
                show-password
              />
            </div>
          </el-form-item>
        </el-tooltip>

        <!-- 验证码 -->
        <el-form-item prop="captcha">
          <div class="input-wrapper">
            <svg-icon icon-class="captcha" class="mx-2" />
            <el-input
              v-model="loginData.captcha"
              auto-complete="off"
              size="large"
              class="flex-1"
              :placeholder="$t('Login_Captcha')"
              @keyup.enter="handleLoginSubmit"
            />

            <el-image
              @click="getCaptcha"
              :src="captchaBase64"
              class="captcha-image"
            />
          </div>
        </el-form-item>
        <!-- 谷歌验证码 -->
        <el-tooltip
          :visible="isCapslock"
          :content="$t('Login_Google_Code')"
          placement="right"
        >
          <el-form-item prop="password">
            <div class="input-wrapper">
              <i-ep-lock class="mx-2" />
              <el-input
                v-model="loginData.google_code"
                :placeholder="$t('Login_Rule_Google_Code')"
                type="password"
                name="password"
                @keyup.enter="handleLoginSubmit"
                size="large"
                class="h-[48px] pr-2"
                show-password
              />
            </div>
          </el-form-item>
        </el-tooltip>

        <!-- 登录按钮 -->
        <el-button
          :loading="loading"
          type="primary"
          size="large"
          class="w-full"
          @click.prevent="handleLoginSubmit"
        >
          {{ $t("Login") }}
        </el-button>

        <!-- 账号密码提示 -->
        <!-- <div class="mt-10 text-sm">
          <span>{{ $t("Login_Username") }}: admin</span>
          <span class="ml-4">{{ $t("Login_Password") }}: 123456</span>
        </div> -->
      </el-form>
    </el-card>

    <!-- ICP备案 -->
    <div class="icp-info" v-show="icpVisible">
      <p>
        Copyright © 2025 - 2028 youlai.tech All Rights Reserved. XXXX 版权所有
      </p>
      <p>2000672436号-1</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// 外部库和依赖
import { LocationQuery, useRoute } from "vue-router";

// 内部依赖
import { useSettingsStore, useUserStore } from "@/store";
import AuthAPI, { type LoginData } from "@/api/auth";
import router from "@/router";
import defaultSettings from "@/settings";
import { ThemeEnum } from "@/enums/ThemeEnum";

// 类型定义
import type { FormInstance } from "element-plus";

// 导入 login.scss 文件
import "@/styles/login.scss";

// 使用导入的依赖和库
const userStore = useUserStore();
const settingsStore = useSettingsStore();
const route = useRoute();
// 窗口高度
const { height } = useWindowSize();
// 国际化 Internationalization
const { t } = useI18n();

// 是否暗黑模式
const isDark = ref(settingsStore.theme === ThemeEnum.DARK);
// 是否显示 ICP 备案信息
const icpVisible = ref(true);
// 按钮 loading 状态
const loading = ref(false);
// 是否大写锁定
const isCapslock = ref(false);
// 验证码图片Base64字符串
const captchaBase64 = ref();
// 登录表单ref
const loginFormRef = ref<FormInstance>();

const loginData = ref<LoginData>({
  username: "admin",
  REDACTED,
  captcha_id: "",
  captcha: "",
  google_code: "",
});

const loginRules = computed(() => {
  return {
    username: [
      {
        required: true,
        trigger: "blur",
        message: t("Login_Rule_Username_Required"),
      },
    ],
    password: [
      {
        required: true,
        trigger: "blur",
        message: t("Login_Rule_Password_Required"),
      },
      {
        min: 6,
        message: t("Login_Rule_Password_Min"),
        trigger: "blur",
      },
    ],
    captcha: [
      {
        required: true,
        trigger: "blur",
        message: t("Login_Rule_Captcha_Required"),
      },
    ],
    google_code: [
      {
        trigger: "blur",
        message: t("Login_Rule_Google_Code"),
      },
    ],
  };
});

/** 获取验证码 */
function getCaptcha() {
  AuthAPI.getCaptcha().then((data) => {
    loginData.value.captcha_id = data.captcha_id;
    captchaBase64.value = data.captcha_image;
  });
}

/** 登录表单提交 */
function handleLoginSubmit() {
  loginFormRef.value?.validate((valid: boolean) => {
    if (valid) {
      loading.value = true;
      userStore
        .login(loginData.value)
        .then(() => {
          console.log("登录成功");
          const { path, queryParams } = parseRedirect();
          router.push({ path: path, query: queryParams });
        })
        .catch(() => {
          getCaptcha();
        })
        .finally(() => {
          loading.value = false;
        });
    }
  });
}

/** 解析 redirect 字符串 为 path 和  queryParams */
function parseRedirect(): {
  path: string;
  queryParams: Record<string, string>;
} {
  const query: LocationQuery = route.query;
  const redirect = (query.redirect as string) ?? "/";

  const url = new URL(redirect, window.location.origin);
  const path = url.pathname;
  const queryParams: Record<string, string> = {};

  url.searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });

  return { path, queryParams };
}

/** 主题切换 */
const toggleTheme = () => {
  const newTheme =
    settingsStore.theme === ThemeEnum.DARK ? ThemeEnum.LIGHT : ThemeEnum.DARK;
  settingsStore.changeTheme(newTheme);
};

/** 根据屏幕宽度切换设备模式 */
watchEffect(() => {
  if (height.value < 600) {
    icpVisible.value = false;
  } else {
    icpVisible.value = true;
  }
});

/** 检查输入大小写 */
function checkCapslock(event: KeyboardEvent) {
  // 防止浏览器密码自动填充时报错
  if (event instanceof KeyboardEvent) {
    isCapslock.value = event.getModifierState("CapsLock");
  }
}

onMounted(() => {
  getCaptcha();
});
</script>

<style lang="scss" scoped></style>
