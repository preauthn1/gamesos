<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover">
          <div class="search-container">
            <el-form ref="queryFormRef" :model="queryParams" :inline="true">
              <el-form-item :label="$t('Keyword')" prop="keywords">
                <el-input
                  v-model="queryParams.keywords"
                  :placeholder="$t('Please_Enter') + ' ' + $t('Keyword')"
                  clearable
                />
              </el-form-item>
              <el-form-item
                :label="$t('Payment_Id')"
                prop="payment_id"
                style="width: 200px"
              >
                <Payment v-model="queryParams.payment_id" />
              </el-form-item>
              <el-form-item :label="$t('Status')" prop="status">
                <el-select
                  v-model="queryParams.status"
                  :placeholder="$t('Please_Select')"
                  clearable
                  style="width: 150px"
                >
                  <el-option :label="$t('All')" value="" />
                  <el-option :label="$t('Pending_Payment')" :value="0" />
                  <el-option :label="$t('Paid')" :value="1" />
                  <el-option :label="$t('Payment_Failed')" :value="2" />
                  <el-option :label="$t('Cancelled')" :value="3" />
                </el-select>
              </el-form-item>
              <el-form-item :label="$t('Order_No')" prop="order_no">
                <el-input
                  v-model="queryParams.order_no"
                  :placeholder="$t('Please_Enter') + ' ' + $t('Order_No')"
                  clearable
                />
              </el-form-item>
              <el-form-item :label="$t('User_Id')" prop="user_id">
                <Member v-model="queryParams.user_id" />
              </el-form-item>
              <el-form-item :label="$t('Partition_Date')" prop="partition_date">
                <el-date-picker
                  v-model="queryParams.partition_date"
                  type="daterange"
                  format="YYYY-MM-DD"
                  value-format="YYYY-MM-DD"
                  :placeholder="$t('Select_Date_Range')"
                  style="width: 250px"
                  range-separator="-"
                  :start-placeholder="$t('Start_Date')"
                  :end-placeholder="$t('End_Date')"
                  :disabled-date="isDateDisabled"
                />
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
                  v-hasPerm="['rechargeInsert']"
                  type="success"
                  icon="plus"
                  @click="handleOpenDialog()"
                >
                  {{ $t("Add") }}
                </el-button>
                <el-button
                  v-hasPerm="'rechargeDelete'"
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
              <el-table-column
                :label="$t('Order_No')"
                align="center"
                prop="order_no"
                width="180"
              />
              <el-table-column
                :label="$t('User_Id')"
                align="center"
                prop="user_id"
                width="100"
              />
              <el-table-column
                :label="$t('Amount')"
                align="center"
                prop="amount"
                width="180"
              >
                <template #default="scope">
                  <div style="text-align: left">
                    <div>{{ $t("Amount") }}:{{ scope.row.amount }}</div>
                    <div>
                      {{ $t("Actual_Amount") }}:{{ scope.row.actual_amount }}
                    </div>
                    <div>{{ $t("Fee") }}:{{ scope.row.fee }}</div>
                    <div>{{ $t("Currency") }}:{{ scope.row.currency }}</div>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('Status')"
                align="center"
                prop="status"
                width="100"
              >
                <template #default="scope">
                  <el-tag v-if="scope.row.status === 0" type="warning">
                    {{ $t("Pending_Payment") }}
                  </el-tag>
                  <el-tag v-else-if="scope.row.status === 1" type="success">
                    {{ $t("Paid") }}
                  </el-tag>
                  <el-tag v-else-if="scope.row.status === 2" type="danger">
                    {{ $t("Payment_Failed") }}
                  </el-tag>
                  <el-tag v-else-if="scope.row.status === 3" type="info">
                    {{ $t("Cancelled") }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('Third_Party_Order_No')"
                align="center"
                prop="third_party_order_no"
                width="180"
              />
              <el-table-column
                :label="$t('Payment_Time')"
                align="center"
                prop="payment_time"
                width="160"
              />
              <el-table-column
                :label="$t('Client_IP')"
                align="center"
                prop="client_ip"
                width="120"
              />
              <el-table-column
                :label="$t('Remark')"
                align="center"
                prop="remark"
                width="120"
              />
              <el-table-column
                :label="$t('Update_Time')"
                align="center"
                prop="updated_at"
                width="160"
              />
              <el-table-column
                :label="$t('Operate')"
                fixed="right"
                align="center"
                width="200"
              >
                <template #default="scope">
                  <el-button
                    v-hasPerm="'rechargeUpdate'"
                    type="primary"
                    icon="edit"
                    link
                    size="small"
                    @click="handleOpenDialog(scope.row)"
                  >
                    {{ $t("Edit") }}
                  </el-button>
                  <!-- 补单按钮：仅待支付状态显示 -->
                  <el-button
                    v-if="scope.row.status === 0"
                    v-hasPerm="'rechargeUpdate'"
                    type="success"
                    icon="CircleCheck"
                    link
                    size="small"
                    @click="handleManualRecharge(scope.row)"
                  >
                    {{ $t("Manual_Recharge") }}
                  </el-button>
                  <el-button
                    v-hasPerm="'rechargeDelete'"
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
        </el-card>
      </el-col>
    </el-row>

    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="800"
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
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('User_Id')" prop="user_id">
              <Member v-model="formData.user_id" />
            </el-form-item>
            <el-form-item :label="$t('Payment_Id')" prop="lang">
              <Payment v-model="formData.payment_id" />
            </el-form-item>
            <el-form-item :label="$t('Amount')" prop="amount">
              <el-input-number
                v-model="formData.amount"
                :min="0"
                :step="0.01"
                style="width: 100%"
                :placeholder="$t('Please_Enter') + ' ' + $t('Amount')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Status')" prop="status">
              <el-select
                v-model="formData.status"
                :placeholder="$t('Please_Select')"
              >
                <el-option :label="$t('Pending_Payment')" :value="0" />
                <el-option :label="$t('Paid')" :value="1" />
                <el-option :label="$t('Payment_Failed')" :value="2" />
                <el-option :label="$t('Cancelled')" :value="3" />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Remark')" prop="remark">
              <el-input
                v-model="formData.remark"
                :placeholder="$t('Please_Enter') + ' ' + $t('Remark')"
              />
            </el-form-item>
          </el-col>
        </el-row>
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

    <!-- 补单对话框 -->
    <el-dialog
      v-model="manualRechargeDialog.visible"
      :title="$t('Manual_Recharge')"
      width="500"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form
        ref="manualRechargeFormRef"
        :model="manualRechargeForm"
        label-width="140px"
      >
        <el-form-item :label="$t('Order_No')">
          <el-input v-model="manualRechargeForm.order_no" disabled />
        </el-form-item>
        <el-form-item
          :label="$t('Third_Party_Order_No')"
          prop="third_party_order_no"
        >
          <el-input
            v-model="manualRechargeForm.third_party_order_no"
            :placeholder="$t('Please_Enter') + ' ' + $t('Third_Party_Order_No')"
          />
        </el-form-item>
        <el-form-item :label="$t('Amount')" prop="amount">
          <el-input-number
            v-model="manualRechargeForm.amount"
            :disabled="true"
          />
        </el-form-item>
        <el-form-item :label="$t('Actual_Amount')" prop="actual_amount">
          <el-input-number
            v-model="manualRechargeForm.actual_amount"
            :min="0"
            :step="0.01"
            style="width: 100%"
          />
        </el-form-item>
        <el-form-item :label="$t('Remark')" prop="remark">
          <el-input
            v-model="manualRechargeForm.remark"
            type="textarea"
            :rows="3"
            :placeholder="$t('Please_Enter') + ' ' + $t('Remark')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmitManualRecharge">
            {{ $t("Confirm") }}
          </el-button>
          <el-button @click="manualRechargeDialog.visible = false">
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
import Member from "@/components/Member/index.vue";
import Payment from "@/components/Payment/index.vue";
import { t} from "@/utils/i18n";
import RechargeAPI, {
  RechargeInfo,
  RechargeListVO,
  RechargePageQuery,
  RechargeList,
} from "@/api/pay/recharge.api";

defineOptions({
  name: "Recharge",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<RechargePageQuery>({
  page: 1,
  pageSize: 15,
  field: "created_at",
  order: "desc",
});

const selectable = (row: RechargeInfo) => ![1].includes(Number(row.id));
const pageData = ref<RechargeList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("Recharge"),
});

// 补单对话框
const manualRechargeDialog = reactive({
  visible: false,
});
const manualRechargeFormRef = ref();
const manualRechargeForm = reactive<RechargeInfo>({
  id: "",
  order_no: "",
  third_party_order_no: "",
  remark: "",
  actual_amount: 0,
  amount: 0,
  fee: 0,
  status: 0,
});

const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

let formData = reactive<RechargeInfo>({
  user_id: "",
  payment_id: "",
  amount: 0,
  remark: "",
  fee: 0,
  status: 0,
});

const rules = reactive({
  user_id: [
    {
      required: true,
      message: t("User_Id") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  payment_id: [
    {
      required: true,
      message: t("Payment_Id") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  amount: [
    {
      required: true,
      message: t("Amount") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
});
// 选中的ID
const selectIds = ref<string[]>([]);

// Function to disable dates beyond 60 days from start date
const isDateDisabled = (time: Date) => {
  // If no start date is selected yet, don't disable any dates
  if (!queryParams.partition_date || !queryParams.partition_date[0]) {
    return false;
  }
  
  // Get the start date selected
  const startDate = new Date(queryParams.partition_date[0]);
  // Calculate max allowed date (start date + 60 days)
  const maxDate = new Date(startDate);
  maxDate.setDate(startDate.getDate() + 60);
  
  // Disable dates that are more than 60 days after the start date
  return time.getTime() > maxDate.getTime();
};

// 查询
async function handleQuery() {
  loading.value = true;
  let queryParamsData = {
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    keywords: queryParams.keywords,
    status: queryParams.status,
    order_no: queryParams.order_no,
    user_id: queryParams.user_id,
    field: queryParams.field,
    order: queryParams.order,
    partition_date:queryParams.partition_date
  };
  RechargeAPI.getPage(queryParamsData)
    .then((data: RechargeListVO) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

// 重置查询
function handleResetQuery() {
  queryFormRef.value?.resetFields();
  queryParams.page = 1;
  queryParams.keywords = "";
  queryParams.status = "";
  queryParams.order_no = "";
  queryParams.user_id = "";
  handleQuery();
}

// 处理选择变化
function handleSelectionChange(selection: RechargeInfo[]) {
  selectIds.value = selection.map((item) => item.id as string);
}

// 打开对话框
function handleOpenDialog(row?: RechargeInfo) {
  resetForm();
  if (row?.id) {
    dialog.title = t("Edit") + t("Recharge");
    Object.assign(formData, row);
  } else {
    dialog.title = t("Add") + t("Recharge");
  }
  dialog.visible = true;
}

// 提交表单
function handleSubmit() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      const id = formData.id;
      if (id) {
        RechargeAPI.update(formData).then(() => {
          ElMessage.success(t("Operate_Success"));
          handleCloseDialog();
          handleQuery();
        });
      } else {
        RechargeAPI.create(formData).then(() => {
          ElMessage.success(t("Operate_Success"));
          handleCloseDialog();
          handleQuery();
        });
      }
    }
  });
}

// 删除
function handleDelete(id?: string) {
  const ids = id ? [id] : selectIds.value;
  if (!ids.length) {
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
  ).then(() => {
    loading.value = true;
    RechargeAPI.deleteByIds({ id: ids.join(",") })
      .then(() => {
        ElMessage.success(t("Operate_Success"));
        handleQuery();
      })
      .finally(() => {
        loading.value = false;
      });
  });
}

// 重置表单
function resetForm() {
  dataFormRef.value?.resetFields();
  dataFormRef.value?.clearValidate();
  Object.assign(formData, {
    user_id: "",
    payment_id: 0,
    amount: 0,
    remark: "",
  });
}

// 关闭对话框
function handleCloseDialog() {
  dialog.visible = false;
  resetForm();
}

// 打开补单对话框
function handleManualRecharge(row: RechargeInfo) {
  Object.assign(manualRechargeForm, {
    id: row.id,
    order_no: row.order_no,
    third_party_order_no: "",
    amount: row.amount,
    actual_amount: 0,
    status: 1,
    fee: row.fee,
    remark: "",
  });
  manualRechargeDialog.visible = true;
}

// 提交补单
function handleSubmitManualRecharge() {
  RechargeAPI.update(manualRechargeForm).then(() => {
    ElMessage.success(t("Operate_Success"));
    manualRechargeDialog.visible = false;
    handleQuery();
  });
}

onMounted(() => {
  handleQuery();
});
</script>
