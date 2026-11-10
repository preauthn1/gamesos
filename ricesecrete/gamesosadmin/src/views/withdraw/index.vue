<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <el-card shadow="hover">
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
                >
                  <el-option :label="$t('Pending_Review')" :value="0" />
                  <el-option :label="$t('Review_Approved')" :value="1" />
                  <el-option :label="$t('Review_Rejected')" :value="2" />
                  <el-option :label="$t('Processing')" :value="3" />
                  <el-option :label="$t('Completed')" :value="4" />
                  <el-option :label="$t('Cancelled')" :value="5" />
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
                <el-input
                  v-model="queryParams.user_id"
                  :placeholder="$t('Please_Enter') + ' ' + $t('User_Id')"
                  clearable
                />
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
                  v-hasPerm="['withdrawInsert']"
                  type="success"
                  icon="plus"
                  @click="handleOpenDialog()"
                >
                  {{ $t("Add") }}
                </el-button>
                <el-button
                  v-hasPerm="'withdrawDelete'"
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
                width="100"
              >
                <template #default="scope">
                  <span>{{ scope.row.amount }}</span>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('Actual_Amount')"
                align="center"
                prop="actual_amount"
                width="120"
              />
              <el-table-column
                :label="$t('Fee')"
                align="center"
                prop="fee"
                width="80"
              />
              <el-table-column
                :label="$t('Currency')"
                align="center"
                prop="currency"
                width="80"
              />
              <el-table-column
                :label="$t('Status')"
                align="center"
                prop="status"
                width="100"
              >
                <template #default="scope">
                  <el-tag v-if="scope.row.status === 0" type="warning">
                    {{ $t("Pending_Review") }}
                  </el-tag>
                  <el-tag v-else-if="scope.row.status === 1" type="success">
                    {{ $t("Review_Approved") }}
                  </el-tag>
                  <el-tag v-else-if="scope.row.status === 2" type="danger">
                    {{ $t("Review_Rejected") }}
                  </el-tag>
                  <el-tag v-else-if="scope.row.status === 3" type="info">
                    {{ $t("Processing") }}
                  </el-tag>
                  <el-tag v-else-if="scope.row.status === 4" type="success">
                    {{ $t("Completed") }}
                  </el-tag>
                  <el-tag v-else-if="scope.row.status === 5" type="info">
                    {{ $t("Cancelled") }}
                  </el-tag>
                </template>
              </el-table-column>
              <el-table-column
                :label="$t('Bank_Name')"
                align="center"
                prop="bank_name"
                width="120"
              />
              <el-table-column
                :label="$t('Account_Name')"
                align="center"
                prop="account_name"
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
                width="280"
              >
                <template #default="scope">
                  <el-button
                    v-hasPerm="'withdrawUpdate'"
                    type="primary"
                    icon="edit"
                    link
                    size="small"
                    @click="handleOpenDialog(scope.row)"
                  >
                    {{ $t("Edit") }}
                  </el-button>
                  <!-- 审核按钮：仅待审核状态显示 -->
                  <el-button
                    v-if="scope.row.status === 0"
                    v-hasPerm="'withdrawUpdate'"
                    type="success"
                    icon="CircleCheck"
                    link
                    size="small"
                    @click="handleAuditApprove(scope.row)"
                  >
                    {{ $t("Approve") }}
                  </el-button>
                  <el-button
                    v-if="scope.row.status === 0"
                    v-hasPerm="'withdrawUpdate'"
                    type="danger"
                    icon="CircleClose"
                    link
                    size="small"
                    @click="handleAuditReject(scope.row)"
                  >
                    {{ $t("Reject") }}
                  </el-button>
                  <!-- 处理中 -> 已完成 -->
                  <el-button
                    v-if="scope.row.status === 3"
                    v-hasPerm="'withdrawUpdate'"
                    type="success"
                    icon="Check"
                    link
                    size="small"
                    @click="handleComplete(scope.row)"
                  >
                    {{ $t("Complete") }}
                  </el-button>
                  
                  <!-- 手动打款按钮：仅处理中状态显示 -->
                  <el-button
                    v-if="scope.row.status === 1"
                    v-hasPerm="'withdrawUpdate'"
                    type="warning"
                    icon="Money"
                    link
                    size="small"
                    @click="handleManualPayment(scope.row)"
                  >
                    {{ $t("Manual_Payment") }}
                  </el-button>
                  
                  <el-button
                    v-hasPerm="'withdrawDelete'"
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
            <el-form-item :label="$t('Payment_Id')" prop="payment_id">
              <Payment v-model="formData.payment_id" />
            </el-form-item>
            <el-form-item :label="$t('Amount')" prop="amount">
              <el-input
                v-model="formData.amount"
                :placeholder="$t('Please_Enter') + ' ' + $t('Amount')"
              />
            </el-form-item>
            <el-form-item :label="$t('Status')" prop="status">
              <el-select
                v-model="formData.status"
                :placeholder="$t('Please_Select')"
              >
                <el-option :label="$t('Pending_Review')" :value="0" />
                <el-option :label="$t('Review_Approved')" :value="1" />
                <el-option :label="$t('Review_Rejected')" :value="2" />
                <el-option :label="$t('Processing')" :value="3" />
                <el-option :label="$t('Completed')" :value="4" />
                <el-option :label="$t('Cancelled')" :value="5" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Bank_Name')" prop="bank_name">
              <el-input
                v-model="formData.bank_name"
                :placeholder="$t('Please_Enter') + ' ' + $t('Bank_Name')"
              />
            </el-form-item>
            <el-form-item :label="$t('Bank_Card_No')" prop="bank_card_no">
              <el-input
                v-model="formData.bank_card_no"
                :placeholder="$t('Please_Enter') + ' ' + $t('Bank_Card_No')"
              />
            </el-form-item>
            <el-form-item :label="$t('Account_Name')" prop="account_name">
              <el-input
                v-model="formData.account_name"
                :placeholder="$t('Please_Enter') + ' ' + $t('Account_Name')"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item :label="$t('Remark')" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="3"
            :placeholder="$t('Please_Enter') + ' ' + $t('Remark')"
          />
        </el-form-item>
        <el-form-item :label="$t('Admin_Remark')" prop="admin_remark">
          <el-input
            v-model="formData.admin_remark"
            type="textarea"
            :rows="3"
            :placeholder="$t('Please_Enter') + ' ' + $t('Admin_Remark')"
          />
        </el-form-item>
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

    <!-- 审核通过对话框 -->
    <el-dialog
      v-model="auditApproveDialog.visible"
      :title="$t('Approve')"
      width="500"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form
        ref="auditApproveFormRef"
        :model="auditApproveForm"
        label-width="140px"
      >
        <el-form-item :label="$t('Order_No')">
          <el-input v-model="auditApproveForm.order_no" disabled />
        </el-form-item>
        <el-form-item :label="$t('Amount')">
          <el-input :value="auditApproveForm.amount" disabled />
        </el-form-item>
        <el-form-item :label="$t('Audit_Remark')" prop="audit_remark">
          <el-input
            v-model="auditApproveForm.audit_remark"
            type="textarea"
            :rows="3"
            :placeholder="$t('Please_Enter') + ' ' + $t('Audit_Remark')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmitAuditApprove">
            {{ $t("Confirm") }}
          </el-button>
          <el-button @click="auditApproveDialog.visible = false">
            {{ $t("Cancel") }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 审核拒绝对话框 -->
    <el-dialog
      v-model="auditRejectDialog.visible"
      :title="$t('Reject')"
      width="500"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form
        ref="auditRejectFormRef"
        :model="auditRejectForm"
        label-width="140px"
      >
        <el-form-item :label="$t('Order_No')">
          <el-input v-model="auditRejectForm.order_no" disabled />
        </el-form-item>
        <el-form-item :label="$t('Fail_Reason')" prop="fail_reason">
          <el-input
            v-model="auditRejectForm.fail_reason"
            type="textarea"
            :rows="3"
            :placeholder="$t('Please_Enter') + ' ' + $t('Fail_Reason')"
          />
        </el-form-item>
        <el-form-item :label="$t('Audit_Remark')" prop="audit_remark">
          <el-input
            v-model="auditRejectForm.audit_remark"
            type="textarea"
            :rows="3"
            :placeholder="$t('Please_Enter') + ' ' + $t('Audit_Remark')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="danger" @click="handleSubmitAuditReject">
            {{ $t("Confirm") }}
          </el-button>
          <el-button @click="auditRejectDialog.visible = false">
            {{ $t("Cancel") }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 完成提现对话框 -->
    <el-dialog
      v-model="completeDialog.visible"
      :title="$t('Complete')"
      width="500"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form ref="completeFormRef" :model="completeForm" label-width="140px">
        <el-form-item :label="$t('Order_No')">
          <el-input v-model="completeForm.order_no" disabled />
        </el-form-item>
        <el-form-item :label="$t('Admin_Remark')" prop="admin_remark">
          <el-input
            v-model="completeForm.admin_remark"
            type="textarea"
            :rows="3"
            :placeholder="$t('Please_Enter') + ' ' + $t('Admin_Remark')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmitComplete">
            {{ $t("Confirm") }}
          </el-button>
          <el-button @click="completeDialog.visible = false">
            {{ $t("Cancel") }}
          </el-button>
        </div>
      </template>
    </el-dialog>

    <!-- 手动打款对话框 -->
    <el-dialog
      v-model="manualPaymentDialog.visible"
      :title="$t('Manual_Payment')"
      width="500"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form ref="manualPaymentFormRef" :model="manualPaymentForm" label-width="140px">
        <el-form-item :label="$t('Order_No')">
          <el-input v-model="manualPaymentForm.order_no" disabled />
        </el-form-item>
        <el-form-item :label="$t('Amount')">
          <el-input :value="manualPaymentForm.amount" disabled />
        </el-form-item>
        <el-form-item :label="$t('Admin_Remark')" prop="admin_remark">
          <el-input
            v-model="manualPaymentForm.admin_remark"
            type="textarea"
            :rows="3"
            :placeholder="$t('Please_Enter') + ' ' + $t('Admin_Remark')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmitManualPayment">
            {{ $t("Confirm") }}
          </el-button>
          <el-button @click="manualPaymentDialog.visible = false">
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
import { t} from "@/utils/i18n";
import WithdrawAPI, {
  WithdrawInfo,
  WithdrawListVO,
  WithdrawPageQuery,
  WithdrawList,
} from "@/api/pay/withdraw.api";

defineOptions({
  name: "Withdraw",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<WithdrawPageQuery>({
  page: 1,
  pageSize: 15,
  field: "created_at",
  order: "desc",
});

const selectable = (row: WithdrawInfo) => ![1].includes(Number(row.id));
const pageData = ref<WithdrawList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("Withdraw"),
});

// 审核通过对话框
const auditApproveDialog = reactive({ visible: false });
const auditApproveFormRef = ref();
const auditApproveForm = reactive({
  order_no: "",
  amount: 0,
  audit_remark: "",
});

// 审核拒绝对话框
const auditRejectDialog = reactive({ visible: false });
const auditRejectFormRef = ref();
const auditRejectForm = reactive({
  order_no: "",
  fail_reason: "",
  audit_remark: "",
});

// 完成提现对话框
const completeDialog = reactive({ visible: false });
const completeFormRef = ref();
const completeForm = reactive({
  order_no: "",
  admin_remark: "",
});

// 手动打款对话框
const manualPaymentDialog = reactive({ visible: false });
const manualPaymentFormRef = ref();
const manualPaymentForm = reactive({
  order_no: "",
  amount: 0,
  admin_remark: "",
});

const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

let formData = reactive<WithdrawInfo>({
  id: "",
  user_id: "",
  payment_id: "",
  amount: 0,
  bank_name: "",
  bank_card_no: "",
  account_name: "",
  status: 0,
  remark: "",
  admin_remark: "",
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
  status: [
    {
      required: true,
      message: t("Status") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
});

// 选中的ID
const selectIds = ref<string[]>([]);

// Function to disable dates beyond 60 days from start date
const isDateDisabled = (time: Date) => {
  // 如果已有日期范围，限制在60天内
  if (
    queryParams.partition_date &&
    queryParams.partition_date[0] &&
    queryParams.partition_date[1]
  ) {
    const startDate = new Date(queryParams.partition_date[0]);
    const endDate = new Date(queryParams.partition_date[1]);

    // 检查是否超出60天范围
    const diffDays =
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    if (diffDays > 60) {
      return true;
    }
  }

  // 限制单个日期不能超过今天+60天
  const maxAllowedDate = new Date();
  maxAllowedDate.setDate(maxAllowedDate.getDate() + 60);

  // 比较年月日部分
  const dateWithoutTime = new Date(
    time.getFullYear(),
    time.getMonth(),
    time.getDate()
  );
  const maxDateWithoutTime = new Date(
    maxAllowedDate.getFullYear(),
    maxAllowedDate.getMonth(),
    maxAllowedDate.getDate()
  );

  return dateWithoutTime.getTime() > maxDateWithoutTime.getTime();
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
    partition_date: queryParams.partition_date,
  };
  WithdrawAPI.getPage(queryParamsData)
    .then((data: WithdrawListVO) => {
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
function handleSelectionChange(selection: WithdrawInfo[]) {
  selectIds.value = selection.map((item) => item.id as string);
}

// 打开对话框
function handleOpenDialog(row?: WithdrawInfo) {
  resetForm();
  if (row?.id) {
    dialog.title = t("Edit") + t("Withdraw");
    Object.assign(formData, row);
  } else {
    dialog.title = t("Add") + t("Withdraw");
  }
  dialog.visible = true;
}

// 提交表单
function handleSubmit() {
  dataFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      const id = formData.id;
      if (id) {
        WithdrawAPI.update(formData).then(() => {
          ElMessage.success(t("Operate_Success"));
          handleCloseDialog();
          handleQuery();
        });
      } else {
        WithdrawAPI.create(formData).then(() => {
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
    WithdrawAPI.deleteByIds({ id: ids.join(",") })
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
    id: "",
    user_id: "",
    payment_id: "",
    amount: 0,
    bank_name: "",
    bank_card_no: "",
    account_name: "",
    status: 0,
    remark: "",
    admin_remark: "",
  });
}

// 关闭对话框
function handleCloseDialog() {
  dialog.visible = false;
  resetForm();
}

// 打开审核通过对话框
function handleAuditApprove(row: WithdrawInfo) {
  Object.assign(auditApproveForm, {
    order_no: row.order_no,
    amount: row.amount,
    audit_remark: "",
  });
  auditApproveDialog.visible = true;
}

// 提交审核通过
function handleSubmitAuditApprove() {
  WithdrawAPI.auditApprove({
    order_no: auditApproveForm.order_no,
    audit_remark: auditApproveForm.audit_remark,
    operation_type: "update",
  }).then(() => {
    ElMessage.success(t("Operate_Success"));
    auditApproveDialog.visible = false;
    handleQuery();
  });
}

// 打开审核拒绝对话框
function handleAuditReject(row: WithdrawInfo) {
  Object.assign(auditRejectForm, {
    order_no: row.order_no,
    fail_reason: "",
    audit_remark: "",
  });
  auditRejectDialog.visible = true;
}

// 提交审核拒绝
function handleSubmitAuditReject() {
  if (!auditRejectForm.fail_reason) {
    ElMessage.warning(
      t("Fail_Reason") + t("Not_Empty")
    );
    return;
  }
  WithdrawAPI.auditReject({
    order_no: auditRejectForm.order_no,
    fail_reason: auditRejectForm.fail_reason,
    audit_remark: auditRejectForm.audit_remark,
    operation_type: "update",
  }).then(() => {
    ElMessage.success(t("Operate_Success"));
    auditRejectDialog.visible = false;
    handleQuery();
  });
}

// 打开完成对话框
function handleComplete(row: WithdrawInfo) {
  Object.assign(completeForm, {
    order_no: row.order_no,
    admin_remark: "",
  });
  completeDialog.visible = true;
}

// 提交完成提现
function handleSubmitComplete() {
  WithdrawAPI.completeWithdraw({
    order_no: completeForm.order_no,
    admin_remark: completeForm.admin_remark,
    operation_type: "complete",
  }).then(() => {
    ElMessage.success(t("Operate_Success"));
    completeDialog.visible = false;
    handleQuery();
  });
}

// 打开手动打款对话框
function handleManualPayment(row: WithdrawInfo) {
  Object.assign(manualPaymentForm, {
    order_no: row.order_no,
    amount: row.amount,
    admin_remark: "",
  });
  manualPaymentDialog.visible = true;
}

// 提交手动打款
function handleSubmitManualPayment() {
  WithdrawAPI.processWithdraw({
    order_no: manualPaymentForm.order_no,
    admin_remark: manualPaymentForm.admin_remark,
    operation_type: "process",
  }).then(() => {
    ElMessage.success(t("Operate_Success"));
    manualPaymentDialog.visible = false;
    handleQuery();
  });
}

onMounted(() => {
  handleQuery();
});
</script>
