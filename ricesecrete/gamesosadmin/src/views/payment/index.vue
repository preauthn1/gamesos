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
                v-hasPerm="['paymentInsert']"
                type="success"
                icon="plus"
                @click="handleOpenDialog()"
              >
                {{ $t("Add") }}
              </el-button>
              <el-button
                v-hasPerm="'paymentDelete'"
                type="danger"
                icon="delete"
                :disabled="selectIds.length === 0"
                @click="handleDelete()"
              >
                {{ $t("Delete") }}
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
            <el-table-column :label="$t('Type')" align="center" prop="type">
              <template #default="scope">
                <!-- 类型 1数字钱包 2三方渠道 3下线支付 -->
                <el-tag v-if="scope.row.type === 1">
                  {{ $t("Number_Wallet") }}
                </el-tag>
                <el-tag v-if="scope.row.type === 2">
                  {{ $t("Third_Channel") }}
                </el-tag>
                <el-tag v-if="scope.row.type === 3">
                  {{ $t("Subordinate_Payment") }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Symbol')"
              align="center"
              prop="symbol"
            />
            <el-table-column
              :label="$t('Currency')"
              align="center"
              prop="currency"
            />
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
            <el-table-column
              :label="$t('Collection_Status')"
              align="center"
              prop="recharge_is_show"
            >
              <template #default="scope">
                <el-switch
                  v-model="scope.row.recharge_is_show"
                  :active-value="1"
                  :inactive-value="2"
                  inline-prompt
                  :active-text="$t('Normal')"
                  :inactive-text="$t('Disable')"
                  @change="
                    (val) =>
                      handleStatusChange(scope.row, val, 'recharge_is_show')
                  "
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Payment_Status')"
              align="center"
              prop="withdraw_is_show"
            >
              <template #default="scope">
                <el-switch
                  v-model="scope.row.withdraw_is_show"
                  :active-value="1"
                  :inactive-value="2"
                  inline-prompt
                  :active-text="$t('Normal')"
                  :inactive-text="$t('Disable')"
                  @change="
                    (val) =>
                      handleStatusChange(scope.row, val, 'withdraw_is_show')
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
            >
              <template #default="scope">
                <el-button
                  v-hasPerm="'paymentUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("Edit") }}
                </el-button>
                <el-button
                  v-hasPerm="'paymentUpdate'"
                  type="warning"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenApiConfig(scope.row)"
                >
                  {{ $t("Api_Config") }}
                </el-button>
                <el-button
                  v-hasPerm="'paymentDelete'"
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
                <el-form-item :label="$t('Type')" prop="type">
                  <el-select
                    v-model="formData.type"
                    :placeholder="$t('Please_Select')"
                  >
                    <el-option :label="$t('Number_Wallet')" :value="1" />
                    <el-option :label="$t('Third_Channel')" :value="2" />
                    <el-option :label="$t('Subordinate_Payment')" :value="3" />
                  </el-select>
                </el-form-item>
                <el-form-item :label="$t('Symbol')" prop="symbol">
                  <el-input
                    v-model="formData.symbol"
                    :placeholder="$t('Please_Enter') + $t('Symbol')"
                  />
                </el-form-item>
                <el-form-item :label="$t('Currency')" prop="currency">
                  <el-input
                    v-model="formData.currency"
                    :placeholder="$t('Please_Enter') + $t('Currency')"
                  />
                </el-form-item>
                <el-form-item :label="$t('Exchange_Rate')" prop="exchange_rate">
                  <el-input
                    v-model="formData.exchange_rate"
                    :placeholder="$t('Please_Enter') + $t('Exchange_Rate')"
                  />
                </el-form-item>
                <el-form-item :label="$t('Fees')" prop="fees">
                  <el-input
                    v-model="formData.fees"
                    :placeholder="$t('Please_Enter') + $t('Fees')"
                  />
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
                <el-form-item :label="$t('Icon')" prop="img">
                  <SingleImageUpload
                    v-model="formData.img"
                    :style="{ width: '50px', height: '50px' }"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item
                  :label="$t('Offline_Payment_Address')"
                  prop="address"
                >
                  <el-input
                    v-model="formData.address"
                    :placeholder="
                      $t('Please_Enter') + $t('Offline_Payment_Address')
                    "
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('Collection_Status')"
                  prop="recharge_is_show"
                >
                  <el-switch
                    v-model="formData.recharge_is_show"
                    inline-prompt
                    :active-text="$t('Normal')"
                    :inactive-text="$t('Disable')"
                    :active-value="1"
                    :inactive-value="2"
                  />
                </el-form-item>
                <el-form-item
                  :label="$t('Payment_Status')"
                  prop="withdraw_is_show"
                >
                  <el-switch
                    v-model="formData.withdraw_is_show"
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
                <el-form-item :label="$t('Sort')" prop="sort">
                  <el-input-number
                    v-model="formData.sort"
                    :placeholder="$t('Please_Enter') + $t('Sort')"
                  />
                </el-form-item>
                <el-form-item :label="$t('Fast_Amount')" prop="fast_amount">
                  <el-input
                    v-model="formData.fast_amount"
                    :placeholder="$t('Please_Enter') + $t('Fast_Amount')"
                  />
                </el-form-item>
                <el-form-item :label="$t('Instruction')" prop="instruction">
                  <el-input
                    type="textarea"
                    :rows="6"
                    v-model="formData.instruction"
                    :placeholder="$t('Please_Enter') + $t('Instruction')"
                  />
                </el-form-item>
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane :label="$t('Payment_Config')" name="second">
            <el-row>
              <el-alert :title="$t('Payment_Config_Tips')" type="error"></el-alert>
              <JsonValue v-model="formData.config" />
            </el-row>
          </el-tab-pane>
          <el-tab-pane :label="$t('Bank_Config')" name="third">
            <el-row>
              <el-alert :title="$t('Bank_Config_Tips')" type="error"></el-alert>
              <JsonValue v-model="formData.bank_config" />
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
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { DeviceEnum } from "@/enums/DeviceEnum";
import SingleImageUpload from "@/components/Upload/SingleImageUpload.vue";
import JsonValue from "@/components/Form/json_value.vue";
import ApiTable from "./apiTable.vue"; // 调整路径
import { t} from "@/utils/i18n";
import PaymentAPI, {
  PaymentInfo,
  PaymentListVO,
  PaymentPageQuery,
  PaymentList,
  PaymentApi,
} from "@/api/pay/payment.api";
import MenuAPI from "@/api/menu";

defineOptions({
  name: "Payment",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();
const apiTableRef = ref();
const activeTab = ref("first");

const queryParams = reactive<PaymentPageQuery>({
  page: 1,
  pageSize: 15,
});

interface Category {
  name: string;
  value: string;
}
// Reactive data
const statusOptions = ref<Category[]>([]);

const fetchStatus = async () => {
  try {
    const result = await MenuAPI.dictionary("default_status");
    statusOptions.value = result || [];
  } catch (error) {}
};
const selectable = (row: PaymentInfo) => ![1].includes(Number(row.id));
const pageData = ref<PaymentList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("Payment"),
});

const apidialog = reactive({
  visible: false,
  title: t("Api_Config"),
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

let formData = reactive<PaymentInfo>({
  id: "",
  type: 1,
  symbol: "",
  currency: "",
  exchange_rate: 1,
  api_list: Array<PaymentApi>(),
  fees: 0,
  name: "",
  img: "",
  config: '[{"key":"merchant_id","value":""},{"key":"sha256_key","value":""},{"key":"api_key","value":""},{"key":"rsa_public_key","value":""},{"key":"rsa_private_key","value":""},{"key":"page_url","value":""}]',
  bank_config: "",
  package_name: "",
  fast_amount: "",
  min_recharge_money: 0,
  min_withdraw_money: 0,
  max_recharge_money: 0,
  max_withdraw_money: 0,
  recharge_is_show: 0,
  withdraw_is_show: 0,
  address: "",
  instruction: "",
  sort: 0,
  status: 0,
});

const rules = reactive({
  type: [
    {
      required: true,
      message: t("Type") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  symbol: [
    {
      required: true,
      message: t("Symbol") + t("Not_Empty"),
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
  exchange_rate: [
    {
      required: true,
      message: t("Fees") + t("Not_Empty"),
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
  name: [
    {
      required: true,
      message: t("Name") + t("Not_Empty"),
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
      PaymentAPI.update(row)
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
      // Revert the UI change if payment cancels
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
  PaymentAPI.getPage(queryParamsData)
    .then((data: PaymentListVO) => {
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

/**
 * 打开弹窗
 *
 * @param id 语言ID
 */
async function handleOpenDialog(payment?: PaymentInfo) {
  dialog.visible = true;
  if (payment?.id) {
    dialog.title = t("Edit") + t("Payment");
    // console.log(payment);
    Object.assign(formData, payment);
    formData.config = payment.config;
    formData.bank_config = payment.bank_config;
  } else {
    formData.config = '[{"key":"merchant_id","value":""},{"key":"sha256_key","value":""},{"key":"api_key","value":""},{"key":"rsa_public_key","value":""},{"key":"rsa_private_key","value":""},{"key":"page_url","value":""}]';
    formData.bank_config = "";
    dialog.title = t("Add") + t("Payment");
  }
}

async function handleOpenApiConfig(payment?: PaymentInfo) {
  apidialog.visible = true;
  apidialog.title = t("Api_Config");
  Object.assign(formData, payment);
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
      const paymentId = formData.id;
      loading.value = true;
      if (paymentId) {
        PaymentAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        PaymentAPI.create(formData)
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
  const paymentId = formData.id;
  loading.value = true;
  if (paymentId) {
    PaymentAPI.update(formData)
      .then(() => {
        ElMessage.success(t("Operate_Success"));
        handleApiCloseDialog();
      })
      .finally(() => (loading.value = false));
  } else {
    PaymentAPI.create(formData)
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
  const paymentIds = [id || selectIds.value].join(",");
  if (!paymentIds) {
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
      console.log(paymentIds);
      PaymentAPI.deleteByIds({ id: paymentIds })
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
  PaymentAPI.export(queryParamsExport).then((response: any) => {
    ElMessage.success(t("Operate_Success"));
  });
}

onMounted(() => {
  fetchStatus();
  handleQuery();
});
</script>
<style scoped>
.payment-info {
  text-align: center;
  padding: 8px 0;
}

.payment-label {
  margin: 4px 0;
  font-size: 12px;
  color: #666;
  word-break: break-all;
  text-align: left;
}
.payment-span {
  margin: 4px 0;
  color: #2486e2;
}
</style>
