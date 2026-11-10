<!-- 语言管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="24">
      <!-- 语言列表 -->
      <el-col :lg="24" :xs="24">
        <!-- 搜索区域 -->
        <div class="search-container">
          <el-form
            ref="queryFormRef"
            :model="queryParams"
            :inline="true"
            label-width="auto"
          >
            <el-form-item :label="$t('Keyword')" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                :placeholder="$t('Please_Enter') + ' ' + $t('Keyword')"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('Status')" prop="status">
              <el-select
                v-model="queryParams.status"
                :placeholder="$t('Please_Select')"
                clearable
                filterable
              >
                <el-option
                  v-for="status in statusOptions"
                  :key="status.value"
                  :label="$t(status.name)"
                  :value="status.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item class="search-buttons">
              <el-button type="primary" icon="search" @click="handleQuery">
                {{ $t("Search") }}
              </el-button>
              <el-button icon="refresh" @click="handleResetQuery">
                {{ $t("Reset") }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="hover" class="data-table">
          <div class="data-table__toolbar" style="margin-bottom: 10px">
            <div class="data-table__toolbar--actions">
              <el-button
                v-hasPerm="['game_platformInsert']"
                type="success"
                icon="plus"
                @click="handleOpenDialog()"
              >
                {{ $t("Add") }}
              </el-button>
              <el-button
                v-hasPerm="'game_platformDelete'"
                type="danger"
                icon="delete"
                :disabled="selectIds.length === 0"
                @click="handleDelete()"
              >
                {{ $t("Delete") }}
              </el-button>
              <el-button
                v-hasPerm="['game_platformInsert']"
                type="success"
                icon="plus"
                @click="handleImportOpen()"
              >
                {{ $t("Import") }}
              </el-button>
            </div>
          </div>

          <el-table
            v-loading="loading"
            :data="pageData"
            :selectable="selectable"
            border
            stripe
            highlight-current-row
            class="data-table__content"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="ID" align="center" width="80" prop="id" />
            <el-table-column :label="$t('Name')" align="center" prop="name" />
            <el-table-column :label="$t('Icon')" align="center" width="100">
              <template #default="scope">
                <el-image
                  style="width: 50px; height: 50px"
                  :src="scope.row.img"
                  fit="cover"
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Package')"
              align="center"
              prop="package_name"
            />
            <el-table-column :label="$t('Platform_Type')" align="center">
              <template #default="scope">
                <el-tag v-if="scope.row.type === 1">
                  {{ $t("Seameless") }}
                </el-tag>
                <el-tag v-if="scope.row.type === 2">
                  {{ $t("Transfer") }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('Currency')"
              align="center"
              prop="currency"
            />
            <el-table-column
              :label="$t('Exchange_Rate')"
              align="center"
              prop="rate"
            />

            <el-table-column
              :label="$t('Min_Bet')"
              align="center"
              prop="min_bet"
            />
            <el-table-column
              :label="$t('Max_Bet')"
              align="center"
              prop="max_bet"
            />
            <el-table-column
              :label="$t('Is_Iframe')"
              align="center"
              prop="is_iframe"
            >
              <template #default="scope">
                <el-switch
                  v-model="scope.row.is_iframe"
                  :active-value="1"
                  :inactive-value="2"
                  inline-prompt
                  :active-text="$t('Normal')"
                  :inactive-text="$t('Disable')"
                  @change="
                    (val) => handleStatusChange(scope.row, val, 'is_iframe')
                  "
                />
              </template>
            </el-table-column>
            <el-table-column :label="$t('Status')" align="center" prop="status">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.status"
                  :active-value="1"
                  :inactive-value="2"
                  inline-prompt
                  :active-text="$t('Normal')"
                  :inactive-text="$t('Disable')"
                  @change="
                    (val) => handleStatusChange(scope.row, val, 'status')
                  "
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Update_Time')"
              align="center"
              prop="updated_at"
              width="200"
            />
            <el-table-column
              :label="$t('Operate')"
              fixed="right"
              align="center"
               width="200"
            >
              <template #default="scope">
                <el-button
                  v-hasPerm="'game_platformUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("Edit") }}
                </el-button>
                <el-button
                  v-hasPerm="'game_platformUpdate'"
                  type="warning"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenApiConfig(scope.row)"
                >
                  {{ $t("Api_Config") }}
                </el-button>
                <el-button
                  v-hasPerm="'game_platformUpdate'"
                  type="primary"
                  link
                  size="small"
                  @click="handleCopy(scope.row)"
                >
                  {{ $t("Copy") }}
                </el-button>
                <el-button
                  v-hasPerm="'game_platformDelete'"
                  type="danger"
                  icon="delete"
                  link
                  size="small"
                  @click="handleDelete(scope.row.id)"
                >
                  {{ $t("Delete") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[15, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleQuery"
            @current-change="handleQuery"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="1000"
      :before-close="handleCloseDialog"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="130px"
      >
        <el-tabs v-model="activeTab" type="card">
          <el-tab-pane :label="$t('Base_Info')" name="first">
            <el-row>
              <el-col :span="12">
                <el-form-item :label="$t('Platform_Type')" prop="type">
                  <el-radio-group v-model="formData.type">
                    <el-radio :value="1">{{ $t("Seameless") }}</el-radio>
                    <el-radio :value="2">{{ $t("Transfer") }}</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item :label="$t('Name')" prop="name">
                  <el-input
                    v-model="formData.name"
                    :placeholder="$t('Please_Enter') + $t('Name')"
                  />
                </el-form-item>
                <el-form-item :label="$t('Package')" prop="package_name">
                  <el-input
                    v-model="formData.package_name"
                    :placeholder="$t('Please_Enter') + $t('Package')"
                  />
                </el-form-item>
                <el-form-item :label="$t('Currency')" prop="currency">
                  <el-input
                    v-model="formData.currency"
                    :placeholder="$t('Please_Enter') + $t('Currency')"
                  />
                </el-form-item>
                <el-form-item :label="$t('Exchange_Rate')" prop="rate">
                  <el-input
                    v-model="formData.rate"
                    :placeholder="$t('Please_Enter') + $t('Exchange_Rate')"
                  />
                </el-form-item>
                <el-form-item :label="$t('Icon')" prop="icon">
                  <SingleImageUpload
                    v-model="formData.icon"
                    :style="{ width: '50px', height: '50px' }"
                  />
                </el-form-item>
                <el-form-item :label="$t('Game_Timezone')" prop="timezone">
                  <el-select
                    v-model="formData.timezone"
                    :placeholder="
                      $t('Please_Select') + ' ' + $t('Game_Timezone')
                    "
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
                    <el-option
                      label="(GMT+03:00) Moscow"
                      value="Europe/Moscow"
                    />
                    <el-option label="(GMT+03:30) Tehran" value="Asia/Tehran" />
                    <el-option
                      label="(GMT+04:00) Tbilisi"
                      value="Asia/Tbilisi"
                    />
                    <el-option label="(GMT+04:30) Kabul" value="Asia/Kabul" />
                    <el-option
                      label="(GMT+05:00) Karachi"
                      value="Asia/Karachi"
                    />
                    <el-option
                      label="(GMT+05:30) Calcutta"
                      value="Asia/Calcutta"
                    />
                    <el-option
                      label="(GMT+05:45) Katmandu"
                      value="Asia/Katmandu"
                    />
                    <el-option label="(GMT+06:00) Dhaka" value="Asia/Dhaka" />
                    <el-option
                      label="(GMT+06:30) Rangoon"
                      value="Asia/Rangoon"
                    />
                    <el-option
                      label="(GMT+07:00) Bangkok"
                      value="Asia/Bangkok"
                    />
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
                    <el-option
                      label="(GMT+11:00) Magadan"
                      value="Asia/Magadan"
                    />
                    <el-option label="(GMT+12:00) Fiji" value="Pacific/Fiji" />
                    <el-option
                      label="(GMT+13:00) Tongatapu"
                      value="Pacific/Tongatapu"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item :label="$t('Language')" prop="lang">
                  <el-input
                    v-model="formData.lang"
                    :placeholder="$t('Please_Enter') + $t('Language')"
                  />
                </el-form-item>
                <el-form-item :label="$t('Min_Bet')" prop="min_bet">
                  <el-input
                    v-model="formData.min_bet"
                    :placeholder="$t('Please_Enter') + $t('Min_Bet')"
                  />
                </el-form-item>
                <el-form-item :label="$t('Max_Bet')" prop="max_bet">
                  <el-input
                    v-model="formData.max_bet"
                    :placeholder="$t('Please_Enter') + $t('Max_Bet')"
                  />
                </el-form-item>
                <el-form-item :label="$t('Sort')" prop="sort">
                  <el-input
                    v-model="formData.sort"
                    :placeholder="$t('Please_Enter') + $t('Sort')"
                  />
                </el-form-item>
                <el-form-item :label="$t('Is_Iframe')" prop="is_iframe">
                  <el-switch
                    v-model="formData.is_iframe"
                    inline-prompt
                    :active-text="$t('Normal')"
                    :inactive-text="$t('Disable')"
                    :active-value="1"
                    :inactive-value="2"
                  />
                </el-form-item>
                <el-form-item :label="$t('Status')" prop="status">
                  <el-switch
                    v-model="formData.status"
                    inline-prompt
                    :active-text="$t('Normal')"
                    :inactive-text="$t('Disable')"
                    :active-value="1"
                    :inactive-value="2"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane :label="$t('Game_Platform_Config')" name="second">
            <el-row>
              <el-alert
                :title="$t('Game_Platform_Config_Tips')"
                type="error"
              ></el-alert>
              <JsonValue v-model="formData.config" />
            </el-row>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">
            {{ $t("Confirm") }}
          </el-button>
          <el-button @click="handleCloseDialog">{{ $t("Cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="apidialog.visible"
      :title="apidialog.title"
      width="1500"
      :before-close="handleApiCloseDialog"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form
        ref="apiTableRef"
        :model="formData"
        :rules="rules"
        label-width="130px"
      >
        <!-- // 接口列表 -->
        <apiTable ref="apiTable" v-model="formData.api_list" />
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleApiSubmit">
            {{ $t("Confirm") }}
          </el-button>
          <el-button @click="handleApiCloseDialog">
            {{ $t("Cancel") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
    <el-dialog
      v-model="importDialog.visible"
      :title="importDialog.title"
      width="50%"
    >
      <JsonString v-model="importDialog.value" />
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleImportSubmit()">
            {{ $t("Confirm") }}
          </el-button>
          <el-button @click="handleImportClose()">
            {{ $t("Cancel") }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { DeviceEnum } from "@/enums/DeviceEnum";
import SingleImageUpload from "@/components/Upload/SingleImageUpload.vue";
import JsonString from "@/components/Form/json_string.vue";
import JsonValue from "@/components/Form/json_value.vue";
import ApiTable from "./apiTable.vue"; // 调整路径
import { t} from "@/utils/i18n";
import GamePlatformAPI, {
  GamePlatformInfo,
  GamePlatformListVO,
  GamePlatformPageQuery,
  GamePlatformList,
} from "@/api/game/gameplatform.api";
import MenuAPI from "@/api/menu";

defineOptions({
  name: "GamePlatform",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();
const apiTableRef = ref();
const activeTab = ref("first");

const queryParams = reactive<GamePlatformPageQuery>({
  page: 1,
  pageSize: 15,
});

interface Category {
  name: string;
  value: string;
}
// Reactive data
const statusOptions = ref<Category[]>([]);
const langList = ref<Category[]>([]);

const fetchStatus = async () => {
  try {
    const result = await MenuAPI.dictionary("default_status");
    statusOptions.value = result || [];
  } catch (error) {}
  try {
    const result = await MenuAPI.getLangList();
    langList.value = result || [];
  } catch (error) {}
};
const selectable = (row: GamePlatformInfo) => ![1].includes(Number(row.id));
const pageData = ref<GamePlatformList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("Game_Platform"),
});

const apidialog = reactive({
  visible: false,
  title: t("Api_Config"),
});

const importDialog = reactive({
  visible: false,
  title: t("Import"),
  value: "",
});

const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

let formData = reactive<GamePlatformInfo>({
  id: "",
  type: 1,
  name: "",
  package_name: "",
  icon: "",
  lang: "",
  currency: "",
  rate: 0,
  min_bet: 0,
  max_bet: 0,
  is_iframe: 0,
  timezone: "",
  config:
    '[{"key":"merchant_id","value":""},{"key":"private_key","value":""},{"key":"public_key","value":""},{"key":"token","value":""},{"key":"token_time","value":""},{"key":"page_url","value":""}]',
  sort: 0,
  status: 0,
  api_list: [],
});

const rules = reactive({
  name: [
    {
      required: true,
      message: t("Name") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  currency: [
    {
      required: true,
      message: t("Currency") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  rate: [
    {
      required: true,
      message: t("Exchange_Rate") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  package_name: [
    {
      required: true,
      message: t("Package") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
});

// 选中的语言ID
const selectIds = ref<number[]>([]);

/**
 * 改变状态
 * @param row
 * @param value
 */
function handleStatusChange(
  row: any,
  value: number | boolean | string,
  field: string
) {
  ElMessageBox.confirm(
    t("Confirm_Status_Change"),
    t("Warning"),
    {
      confirmButtonText: t("Confirm"),
      cancelButtonText: t("Cancel"),
      type: "warning",
    }
  )
    .then(() => {
      row[field] = value;
      // Call API to persist the change
      GamePlatformAPI.update(row)
        .then(() => {
          ElMessage.success(t("Operate_Success"));
        })
        .catch(() => {
          // Revert the change if API call fails
          row.status = row.status === 1 ? 2 : 1;
          ElMessage.error(t("Operate_Failed"));
        });
    })
    .catch(() => {
      // Revert the UI change if game_platform cancels
      row.status = row.status === 1 ? 2 : 1;
      ElMessage.info(t("Operate_Cancel"));
    });
}

// 查询
async function handleQuery() {
  loading.value = true;
  let queryParamsData = {
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    name__package_name: ["like", queryParams.keywords],
    status: queryParams.status,
  };
  GamePlatformAPI.getPage(queryParamsData)
    .then((data: GamePlatformListVO) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}
// 重置查询
function handleResetQuery() {
  queryParams.page = 1;
  queryParams.keywords = "";
  queryParams.id = "";
  queryParams.status = "";
  handleQuery();
}

// 选中项发生变化
function handleSelectionChange(selection: any[]) {
  selectIds.value = selection.map((item) => item.id);
}

function handleCopy(game_platform?: GamePlatformInfo) {
  //帮我写一个复制文本方法
  const input = document.createElement("input");
  input.value = JSON.stringify(game_platform);
  document.body.appendChild(input);
  input.select();
  document.execCommand("copy");
  document.body.removeChild(input);
  ElMessage.success(t("Copy_Success"));
}

/**
 * 打开弹窗
 *
 * @param id 语言ID
 */
async function handleOpenDialog(game_platform?: GamePlatformInfo) {
  dialog.visible = true;
  if (game_platform?.id) {
    dialog.title = t("Edit") + t("Game_Platform");
    // console.log(game_platform);
    Object.assign(formData, game_platform);
    formData.config = game_platform.config;
  } else {
    formData.id = "";
    formData.type = 1;
    formData.name = "";
    formData.package_name = "";
    formData.icon = "";
    formData.lang = "";
    formData.currency = "";
    formData.rate = 0;
    formData.min_bet = 1;
    formData.max_bet = 10000;
    formData.is_iframe = 1;
    formData.timezone = "";
    formData.config =
      '[{"key":"merchant_id","value":""},{"key":"private_key","value":""},{"key":"public_key","value":""},{"key":"token","value":""},{"key":"token_time","value":""},{"key":"page_url","value":""}]';
    dialog.title = t("Add") + t("Game_Platform");
  }
}

async function handleOpenApiConfig(game_platform?: GamePlatformInfo) {
  apidialog.visible = true;
  apidialog.title = t("Api_Config");
  Object.assign(formData, game_platform);
}

// 关闭弹窗
function handleApiCloseDialog() {
  apidialog.visible = false;
  apiTableRef.value.clearValidate();
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  queryFormRef.value.resetFields();
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
}

// 提交语言表单（防抖）
const handleSubmit = useDebounceFn(() => {
  dataFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const game_platformId = formData.id;
      loading.value = true;
      if (game_platformId) {
        GamePlatformAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        GamePlatformAPI.create(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}, 1000);

/**
 * 提交接口表单（防抖）
 */
const handleApiSubmit = useDebounceFn(() => {
  const game_platformId = formData.id;
  loading.value = true;
  if (game_platformId) {
    GamePlatformAPI.update(formData)
      .then(() => {
        ElMessage.success(t("Operate_Success"));
        handleApiCloseDialog();
      })
      .finally(() => (loading.value = false));
  } else {
    GamePlatformAPI.create(formData)
      .then(() => {
        ElMessage.success(t("Operate_Success"));
        handleApiCloseDialog();
      })
      .finally(() => (loading.value = false));
  }
}, 1000);

/**
 * 删除语言
 *
 * @param id  语言ID
 */
function handleDelete(id?: number) {
  const game_platformIds = [id || selectIds.value].join(",");
  if (!game_platformIds) {
    ElMessage.warning(t("Please_Select_Delete_Item"));
    return;
  }
  ElMessageBox.confirm(
    t("Confirm_Delete"),
    t("Warning"),
    {
      confirmButtonText: t("Confirm"),
      cancelButtonText: t("Cancel"),
      type: "warning",
    }
  ).then(
    function () {
      loading.value = true;
      console.log(game_platformIds);
      GamePlatformAPI.deleteByIds({ id: game_platformIds })
        .then(() => {
          ElMessage.success(t("Operate_Success"));
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    function () {
      ElMessage.info(t("Operate_Cancel"));
    }
  );
}

// 导出
function handleExport(num?: number) {
  let queryParamsExport = {
    ...queryParams,
    export_name: "支付平台",
    pageSize: num || 1000,
  };
  GamePlatformAPI.export(queryParamsExport).then((response: any) => {
    ElMessage.success(t("Operate_Success"));
  });
}

function handleImportOpen() {
  importDialog.visible = true;
}
function handleImportClose() {
  importDialog.visible = false;
}
// 导入
function handleImportSubmit() {
  let formData = JSON.parse(importDialog.value);
  formData.id = "";
  loading.value = true;
  GamePlatformAPI.create(formData)
    .then(() => {
      ElMessage.success(t("Operate_Success"));
      handleImportClose();
      handleResetQuery();
    })
    .finally(() => (loading.value = false));
}

onMounted(() => {
  fetchStatus();
  handleQuery();
});
</script>
<style scoped>
.game_platform-info {
  text-align: center;
  padding: 8px 0;
}

.game_platform-label {
  margin: 4px 0;
  font-size: 12px;
  color: #666;
  word-break: break-all;
  text-align: left;
}
.game_platform-span {
  margin: 4px 0;
  color: #2486e2;
}
</style>
