<!-- 配置管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="24">
      <el-col :lg="1" :xs="1"><div></div></el-col>
      <!-- 配置列表 -->
      <el-col :lg="18" :xs="18">
        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
          <el-tab-pane :label="$t('Basic_Info')" name="basic">
            <el-form
              :model="formData.basc"
              :rules="rules_basic"
              ref="dataFormRef"
              label-width="120px"
            >
              <el-form-item :label="$t('Sys_Name')" prop="sys_name">
                <el-input
                  v-model="formData.basc.sys_name"
                  :placeholder="$t('Please_Enter') + ' ' + $t('Sys_Name')"
                />
              </el-form-item>
              <el-form-item :label="$t('Sys_Version')" prop="sys_version">
                <el-input
                  v-model="formData.basc.sys_version"
                  :placeholder="$t('Please_Enter') + ' ' + $t('Sys_Version')"
                />
              </el-form-item>
              <el-form-item :label="$t('Sys_Icon')">
                <SingleImageUpload
                  :accept="'.png,.jpg'"
                  :style="{ width: '100px', height: '100px' }"
                  v-model="formData.basc.sys_icon"
                />
              </el-form-item>
              <el-form-item :label="$t('Sys_Logo')">
                <SingleImageUpload
                  :accept="'.png,.jpg'"
                  :style="{ width: '100px', height: '100px' }"
                  v-model="formData.basc.sys_logo"
                />
              </el-form-item>

              <el-form-item :label="$t('Sys_Timezone')" prop="sys_timezone">
                <el-select
                  v-model="formData.basc.sys_timezone"
                  :placeholder="$t('Please_Select') + ' ' + $t('Sys_Timezone')"
                >
                  <el-option label="(GMT-12:00) Wake" value="Pacific/Wake" />
                  <el-option label="(GMT-11:00) Apia" value="Pacific/Apia" />
                  <el-option
                    label="(GMT-10:00) Honolulu"
                    value="Pacific/Honolulu"
                  />
                  <el-option
                    label="(GMT-09:00) Gambier"
                    value="Pacific/Gambier"
                  />
                  <el-option
                    label="(GMT-08:00) Los Angeles"
                    value="America/Los_Angeles"
                  />
                  <el-option
                    label="(GMT-07:00) Phoenix"
                    value="America/Phoenix"
                  />
                  <el-option
                    label="(GMT-06:00) Managua"
                    value="America/Managua"
                  />
                  <el-option
                    label="(GMT-05:00) Bogota"
                    value="America/Bogota"
                  />
                  <el-option
                    label="(GMT-04:00) Caracas"
                    value="America/Caracas"
                  />
                  <el-option
                    label="(GMT-03:30) St. Johns"
                    value="America/St_Johns"
                  />
                  <el-option
                    label="(GMT-03:00) Buenos Aires"
                    value="America/Argentina/Buenos_Aires"
                  />
                  <el-option
                    label="(GMT-02:00) Noronha"
                    value="America/Noronha"
                  />
                  <el-option
                    label="(GMT-01:00) Cape Verde"
                    value="Atlantic/Cape_Verde"
                  />
                  <el-option label="(GMT) London" value="Europe/London" />
                  <el-option label="(GMT+01:00) Lagos" value="Africa/Lagos" />
                  <el-option
                    label="(GMT+02:00) Johannesburg"
                    value="Africa/Johannesburg"
                  />
                  <el-option label="(GMT+03:00) Moscow" value="Europe/Moscow" />
                  <el-option label="(GMT+03:30) Tehran" value="Asia/Tehran" />
                  <el-option label="(GMT+04:00) Tbilisi" value="Asia/Tbilisi" />
                  <el-option label="(GMT+04:30) Kabul" value="Asia/Kabul" />
                  <el-option label="(GMT+05:00) Karachi" value="Asia/Karachi" />
                  <el-option
                    label="(GMT+05:30) Calcutta"
                    value="Asia/Calcutta"
                  />
                  <el-option
                    label="(GMT+05:45) Katmandu"
                    value="Asia/Katmandu"
                  />
                  <el-option label="(GMT+06:00) Dhaka" value="Asia/Dhaka" />
                  <el-option label="(GMT+06:30) Rangoon" value="Asia/Rangoon" />
                  <el-option label="(GMT+07:00) Bangkok" value="Asia/Bangkok" />
                  <el-option
                    label="(GMT+08:00) Hong Kong"
                    value="Asia/Hong_Kong"
                  />
                  <el-option label="(GMT+09:00) Seoul" value="Asia/Seoul" />
                  <el-option label="(GMT+09:00) Tokyo" value="Asia/Tokyo" />
                  <el-option
                    label="(GMT+09:30) Adelaide"
                    value="Australia/Adelaide"
                  />
                  <el-option label="(GMT+10:00) Guam" value="Pacific/Guam" />
                  <el-option label="(GMT+11:00) Magadan" value="Asia/Magadan" />
                  <el-option label="(GMT+12:00) Fiji" value="Pacific/Fiji" />
                  <el-option
                    label="(GMT+13:00) Tongatapu"
                    value="Pacific/Tongatapu"
                  />
                </el-select>
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSubmit">
                  {{ $t("Confirm") }}
                </el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane :label="$t('Web_Info')" name="user">
            <el-form
              :model="formData.user"
              :rules="rules_user"
              ref="dataFormRef"
              label-width="120px"
            >
              <el-form-item :label="$t('Web_Name')" prop="web_name">
                <el-input
                  v-model="formData.user.web_name"
                  :placeholder="$t('Please_Enter') + ' ' + $t('Web_Name')"
                />
              </el-form-item>
              <el-form-item :label="$t('Web_Logo')">
                <SingleImageUpload
                  :accept="'.png,.jpg'"
                  :style="{ width: '100px', height: '100px' }"
                  v-model="formData.user.web_logo"
                />
              </el-form-item>

              <el-form-item :label="$t('PC_Logo')">
                <SingleImageUpload
                  :accept="'.png,.jpg'"
                  :style="{ width: '100px', height: '100px' }"
                  v-model="formData.user.pc_logo"
                />
              </el-form-item>
              <el-form-item :label="$t('Service_Info')">
                <el-input
                  v-model="formData.user.service_info"
                  :placeholder="$t('Please_Enter') + ' ' + $t('Service_Info')"
                />
              </el-form-item>
              <el-form-item :label="$t('Contactus_Info')">
                <el-input
                  v-model="formData.user.contactus_info"
                  :placeholder="$t('Please_Enter') + ' ' + $t('Contactus_Info')"
                />
              </el-form-item>
              <el-form-item>
                <el-button type="primary" @click="handleSubmit">提交</el-button>
              </el-form-item>
            </el-form>
          </el-tab-pane>
        </el-tabs>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import SingleImageUpload from "@/components/Upload/SingleImageUpload.vue";
import { t} from "@/utils/i18n";

import ConfigAPI from "@/api/system/config.api";

defineOptions({
  name: "SysParam",
  inheritAttrs: false,
});

const loading = ref(false);
const appStore = useAppStore();
// Tab management
const activeTab = ref("basic");
const rules_basic = {
  sys_name: [
    {
      required: true,
      message: t("Name") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  sys_logo: [
    {
      required: true,
      message: t("Logo") + t("Not_Empty"),
      trigger: "change",
    },
  ],
  sys_icon: [
    {
      required: true,
      message: t("Icon") + t("Not_Empty"),
      trigger: "change",
    },
  ],
  sys_version: [
    {
      required: true,
      message: t("Version") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  sys_timezone: [
    {
      required: true,
      message: t("Timezone") + t("Not_Empty"),
      trigger: "change",
    },
  ],
};

const rules_user = {
  web_name: [
    {
      required: true,
      message: t("Name") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  web_logo: [
    {
      required: true,
      message: t("Logo") + t("Not_Empty"),
    },
  ],
  pc_logo: [
    {
      required: true,
      message: t("Logo") + t("Not_Empty"),
    },
  ],
};

// Form data
const formData = reactive({
  basc: {
    sys_name: "",
    _t_sys_name: "系统名称",
    sys_logo: "",
    _t_sys_logo: "系统Logo",
    sys_icon: "",
    _t_sys_icon: "系统Icon",
    sys_version: "",
    _t_sys_version: "系统版本",
    sys_copyright: "",
    _t_sys_copyright: "系统版权",
    sys_timezone: "",
    _t_sys_timezone: "系统时区",
  },
  user: {
    web_name: "",
    _t_web_name: "网站名称",
    web_logo: "",
    _t_web_logo: "网站Logo",
    pc_logo: "",
    _t_pc_logo: "PC端Logo",
    service_info: "",
    _t_service_info: "客服",
    contactus_info: "",
    _t_contactus_info: "联系我们",
  },
});

// Form reference
const dataFormRef = ref();
// Handle tab click
const handleTabClick = (tab: any) => {
  console.log("Tab changed:", tab.name);
};
const handleSubmit = useDebounceFn(() => {
  loading.value = true;
  let data = {};
  switch (activeTab.value) {
    case "basic":
      data = formData.basc;
      break;
    case "user":
      data = formData.user;
      break;
  }
  ConfigAPI.update(data)
    .then(() => {
      ElMessage.success(t("Operate_Success"));
      handleQuery();
    })
    .finally(() => (loading.value = false));
}, 1000);

// 查询
async function handleQuery() {
  loading.value = true;
  ConfigAPI.getInfo({})
    .then((data: any) => {
      console.log(data);
      formData.basc = data.basc;
      formData.user = data.user;
    })
    .finally(() => {
      loading.value = false;
    });
}

onMounted(() => {
  handleQuery();
});
</script>
