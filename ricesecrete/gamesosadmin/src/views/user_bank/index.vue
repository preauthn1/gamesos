<!-- 用户银行卡管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="24">
      <!-- 银行卡列表 -->
      <el-col :lg="24" :xs="24">
        <!-- 搜索区域 -->
        <div class="search-container">
          <el-form
            ref="queryFormRef"
            :model="queryParams"
            :inline="true"
            label-width="auto"
          >
            <el-form-item :label="$t('User_Id')" prop="user_id">
              <el-input
                v-model="queryParams.user_id"
                :placeholder="$t('Please_Enter') + ' ' + $t('User_Id')"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('Card_Number')" prop="card_number">
              <el-input
                v-model="queryParams.card_number"
                :placeholder="$t('Please_Enter') + ' ' + $t('Card_Number')"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('Keyword')" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                :placeholder="
                  $t('Please_Enter') + ' ' + $t('Card_Holder') + '/' + $t('Bank_Name')
                "
                clearable
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
                v-hasPerm="['user_bankInsert']"
                type="success"
                icon="plus"
                @click="handleOpenDialog()"
              >
                {{ $t("Add") }}
              </el-button>
              <el-button
                v-hasPerm="'user_bankDelete'"
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
            <el-table-column
              :label="$t('User_Id')"
              align="center"
              prop="user_id"
              width="100"
            />
            <el-table-column
              :label="$t('Bank_Name')"
              align="center"
              prop="bank_name"
            />
            <el-table-column
              :label="$t('Card_Number')"
              align="center"
              prop="card_number"
            />
            <el-table-column
              :label="$t('Card_Holder')"
              align="center"
              prop="card_holder"
            />
            <el-table-column
              :label="$t('Phone')"
              align="center"
              prop="phone"
            />
            <el-table-column
              :label="$t('Province_City')"
              align="center"
              width="150"
            >
              <template #default="scope">
                {{ scope.row.province }}/{{ scope.row.city }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Branch_Name')"
              align="center"
              prop="branch_name"
            />
            <el-table-column
              :label="$t('Is_Default')"
              align="center"
              prop="is_default"
              width="100"
            >
              <template #default="scope">
                <el-tag v-if="scope.row.is_default === 1" type="success">
                  {{ $t("Yes") }}
                </el-tag>
                <el-tag v-else type="info">
                  {{ $t("No") }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Status')"
              align="center"
              prop="status"
              width="100"
            >
              <template #default="scope">
                <el-tag v-if="scope.row.status === 1" type="success">
                  {{ $t("Enable") }}
                </el-tag>
                <el-tag v-else type="danger">
                  {{ $t("Disable") }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Create_Time')"
              align="center"
              prop="created_at"
              width="180"
            />
            <el-table-column
              :label="$t('Update_Time')"
              align="center"
              prop="updated_at"
              width="180"
            />
            <el-table-column
              :label="$t('Operate')"
              fixed="right"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-hasPerm="'user_bankUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("Edit") }}
                </el-button>
                <el-button
                  v-hasPerm="'user_bankDelete'"
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
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('User_Id')" prop="user_id">
              <Member v-model="formData.user_id" />
            </el-form-item>
            <el-form-item :label="$t('Bank_Name')" prop="bank_name">
              <el-input
                v-model="formData.bank_name"
                :placeholder="$t('Please_Enter') + $t('Bank_Name')"
              />
            </el-form-item>
            <el-form-item :label="$t('Bank_Code')" prop="bank_code">
              <el-input
                v-model="formData.bank_code"
                :placeholder="$t('Please_Enter') + $t('Bank_Code')"
              />
            </el-form-item>
            <el-form-item :label="$t('Card_Number')" prop="card_number">
              <el-input
                v-model="formData.card_number"
                :placeholder="$t('Please_Enter') + $t('Card_Number')"
              />
            </el-form-item>
            <el-form-item :label="$t('Card_Holder')" prop="card_holder">
              <el-input
                v-model="formData.card_holder"
                :placeholder="$t('Please_Enter') + $t('Card_Holder')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Phone')" prop="phone">
              <el-input
                v-model="formData.phone"
                :placeholder="$t('Please_Enter') + $t('Phone')"
              />
            </el-form-item>
            <el-form-item :label="$t('Province')" prop="province">
              <el-input
                v-model="formData.province"
                :placeholder="$t('Please_Enter') + $t('Province')"
              />
            </el-form-item>
            <el-form-item :label="$t('City')" prop="city">
              <el-input
                v-model="formData.city"
                :placeholder="$t('Please_Enter') + $t('City')"
              />
            </el-form-item>
            <el-form-item :label="$t('Branch_Name')" prop="branch_name">
              <el-input
                v-model="formData.branch_name"
                :placeholder="$t('Please_Enter') + $t('Branch_Name')"
              />
            </el-form-item>
            <el-form-item :label="$t('Is_Default')">
              <el-radio-group v-model="formData.is_default">
                <el-radio :label="1">{{ $t("Yes") }}</el-radio>
                <el-radio :label="0">{{ $t("No") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('Status')">
              <el-radio-group v-model="formData.status">
                <el-radio :label="1">{{ $t("Enable") }}</el-radio>
                <el-radio :label="0">{{ $t("Disable") }}</el-radio>
              </el-radio-group>
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
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { DeviceEnum } from "@/enums/DeviceEnum";
import Member from "@/components/Member/index.vue";
import { t} from "@/utils/i18n";
import UserBankAPI, {
  UserBankInfo,
  UserBankListVO,
  UserBankPageQuery,
  UserBankList,
} from "@/api/member/userbank.api";

defineOptions({
  name: "SysUserBank",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<UserBankPageQuery>({
  page: 1,
  pageSize: 15,
});
const selectable = (row: UserBankInfo) => ![1].includes(Number(row.id));
const pageData = ref<UserBankList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("UserBank"),
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

const formData = reactive<UserBankInfo>({
  id: "",
  user_id: "",
  bank_name: "",
  bank_code: "",
  card_number: "",
  card_holder: "",
  phone: "",
  province: "",
  city: "",
  branch_name: "",
  is_default: 0,
  status: 1,
});

const rules = reactive({
  user_id: [
    {
      required: true,
      message: t("User_Id") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  bank_name: [
    {
      required: true,
      message: t("Bank_Name") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  card_number: [
    {
      required: true,
      message: t("Card_Number") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  card_holder: [
    {
      required: true,
      message: t("Card_Holder") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
});

// 选中的银行卡ID
const selectIds = ref<number[]>([]);

// 查询
async function handleQuery() {
  loading.value = true;
  let queryParamsData = {
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    card_holder__bank_name: ["like", queryParams.keywords],
    user_id: queryParams.user_id,
    card_number: queryParams.card_number,
  };
  UserBankAPI.getPage(queryParamsData)
    .then((data: UserBankListVO) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}
// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.page = 1;
  queryParams.keywords = "";
  handleQuery();
}

// 选中项发生变化
function handleSelectionChange(selection: any[]) {
  selectIds.value = selection.map((item) => item.id);
}

/**
 * 打开弹窗
 *
 * @param row 银行卡信息
 */
async function handleOpenDialog(row?: UserBankInfo) {
  dialog.visible = true;
  if (row?.id) {
    dialog.title = t("Edit") + t("UserBank");
    // 复制 row 给 formData
    Object.assign(formData, row);
  } else {
    dialog.title = t("Add") + t("UserBank");
    // 重置表单
    resetFormData();
  }
}

// 重置表单数据
function resetFormData() {
  formData.id = "";
  formData.user_id = "";
  formData.bank_name = "";
  formData.bank_code = "";
  formData.card_number = "";
  formData.card_holder = "";
  formData.phone = "";
  formData.province = "";
  formData.city = "";
  formData.branch_name = "";
  formData.is_default = 0;
  formData.status = 1;
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  resetFormData();
}

// 提交银行卡表单（防抖）
const handleSubmit = useDebounceFn(() => {
  dataFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const bankId = formData.id;
      loading.value = true;
      if (bankId) {
        UserBankAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        UserBankAPI.create(formData)
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
 * 删除银行卡
 *
 * @param id  银行卡ID
 */
function handleDelete(id?: number) {
  const bankIds = [id || selectIds.value].join(",");
  if (!bankIds) {
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
      UserBankAPI.deleteByIds({ id: bankIds })
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

onMounted(() => {
  handleQuery();
});
</script>
<style lang="scss" scoped>
.tag-group {
  text-align: left;
  margin: 5px 0;
}
</style>