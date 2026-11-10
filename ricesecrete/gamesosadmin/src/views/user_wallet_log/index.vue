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
            <el-form-item :label="$t('Userinfo')" prop="user_name">
              <el-input
                v-model="queryParams.user_name"
                :placeholder="$t('Please_Enter') + ' ' + $t('Userinfo')"
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
                v-hasPerm="['user_wallet_logInsert']"
                type="success"
                icon="plus"
                @click="handleOpenDialog()"
              >
                {{ $t("Add") }}
              </el-button>
              <el-button
                v-hasPerm="'sys_langDelete'"
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
            <el-table-column label="ID" align="center" prop="id" />
            <el-table-column
              :label="$t('Userinfo')"
              align="center"
              prop="user_info"
            >
              <template #default="scope">
                <el-tag v-if="scope.row.user_info">
                  {{ scope.row.user_info.id }} /
                  {{ scope.row.user_info.username }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Type')" align="center" prop="type">
              <!-- 1:余额 2:佣金 3:体验金 4:积分-->
              <template #default="scope">
                <el-tag type="primary" v-if="scope.row.type === 1">
                  {{ $t("Balance") }}
                </el-tag>
                <el-tag type="info" v-if="scope.row.type === 2">
                  {{ $t("Commission") }}
                </el-tag>
                <el-tag type="warning" v-if="scope.row.type === 3">
                  {{ $t("Experience_Gold") }}
                </el-tag>
                <el-tag v-if="scope.row.type === 4">
                  {{ $t("Integral") }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Change')" align="center" prop="change">
              <template #default="scope">
                <!-- 操作类型 1增加 2减少 -->
                <el-tag type="success" v-if="scope.row.change === 1">
                  {{ $t("Increase") }}
                </el-tag>
                <el-tag type="warning" v-if="scope.row.change === 2">
                  {{ $t("Decrease") }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Operate_Balance')"
              align="center"
              prop="balance"
            />
            <el-table-column
              :label="$t('Operate_Before')"
              align="center"
              prop="before"
            />
            <el-table-column
              :label="$t('Operate_After')"
              align="center"
              prop="after"
            />

            <el-table-column :label="$t('Title')" align="center" prop="title" >
              <template #default="scope">
               {{ $t(scope.row.title) }}
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Remarks')"
              align="center"
              prop="remarks"
            />
            <el-table-column
              :label="$t('Update_Time')"
              align="center"
              prop="updated_at"
              width="200"
            />
            <!-- <el-table-column
              :label="$t('Operate')"
              fixed="right"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-hasPerm="'sys_langUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("Edit") }}
                </el-button>
                <el-button
                  v-hasPerm="'sys_langDelete'"
                  type="danger"
                  icon="delete"
                  link
                  size="small"
                  @click="handleDelete(scope.row.id)"
                >
                  {{ $t("Delete") }}
                </el-button>
              </template>
            </el-table-column> -->
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
      width="600"
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
        <el-form-item :label="$t('User') + ' ID'" prop="user_id">
          <el-input
            v-model="formData.user_id"
            :placeholder="$t('Please_Enter') + $t('User') + ' ID'"
          />
        </el-form-item>
        <el-form-item :label="$t('Type')" prop="type">
          <el-select v-model="formData.type" :placeholder="$t('Please_Select')">
            <el-option :label="$t('Balance')" :value="1" />
            <el-option :label="$t('Commission')" :value="2" />
            <el-option :label="$t('Experience_Gold')" :value="3" />
            <el-option :label="$t('Integral')" :value="4" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Change')" prop="change">
          <el-select
            v-model="formData.change"
            :placeholder="$t('Please_Select')"
          >
            <el-option :label="$t('Increase')" :value="1" />
            <el-option :label="$t('Decrease')" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Operate_Balance')" prop="balance">
          <el-input
            v-model="formData.balance"
            :placeholder="$t('Please_Enter') + $t('Operate_Balance')"
          />
        </el-form-item>
        <el-form-item :label="$t('Remarks')" prop="remarks">
          <el-input
            v-model="formData.remarks"
            :placeholder="$t('Please_Enter') + $t('Remarks')"
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
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { DeviceEnum } from "@/enums/DeviceEnum";
import { t} from "@/utils/i18n";
import UserWalletLogAPI, {
  UserWalletLogInfo,
  UserWalletLogListVO,
  UserWalletLogPageQuery,
  UserWalletLogList,
} from "@/api/member/userwalletlog.api";

defineOptions({
  name: "SysUserWalletLog",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<UserWalletLogPageQuery>({
  page: 1,
  pageSize: 15,
});
const selectable = (row: UserWalletLogInfo) => ![1].includes(Number(row.id));
const pageData = ref<UserWalletLogList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("UserWalletLog"),
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

let formData = reactive<UserWalletLogInfo>({
  id: "",
  user_id: "",
  rpc_user_id: "",
  admin_id: "",
  business_id: "",
  type: 1,
  detail_type: 1,
  change: 1,
  balance: 0,
  before: 0,
  after: 0,
  title: "",
  remarks: "",
});

const rules = reactive({
  user_id: [
    {
      required: true,
      message: t("Please_Enter") + t("User") + " ID",
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: t("Please_Select") + t("Type"),
      trigger: "blur",
    },
  ],
  change: [
    {
      required: true,
      message: t("Please_Select") + t("Change"),
      trigger: "blur",
    },
  ],
  balance: [
    {
      required: true,
      message: t("Please_Enter") + t("Operate_Balance"),
      trigger: "blur",
    },
  ],
});

// 选中的语言ID
const selectIds = ref<number[]>([]);
// 查询
async function handleQuery() {
  loading.value = true;
  let queryParamsData = {
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    title: ["like", queryParams.keywords],
    user_id: queryParams.user_id,
    user_name: queryParams.user_name,
    change: queryParams.change,
    type: queryParams.type,
  };
  UserWalletLogAPI.getPage(queryParamsData)
    .then((data: UserWalletLogListVO) => {
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
 * @param id 语言ID
 */
async function handleOpenDialog(user_wallet_log?: UserWalletLogInfo) {
  dialog.visible = true;
  if (user_wallet_log?.id) {
    dialog.title = t("Edit") + t("UserWalletLog");
    //复制 user_wallet_log 给formData.value
    Object.assign(formData, user_wallet_log);
  } else {
    dialog.title = t("Add") + t("UserWalletLog");
  }
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = "";
  formData.user_id = "";
  formData.admin_id = "";
  formData.rpc_user_id = "";
  formData.business_id = "";
  formData.type = 1;
  formData.detail_type = 1;
  formData.change = 1;
  formData.balance = 0;
  formData.before = 0;
  formData.after = 0;
  formData.title = "";
  formData.remarks = "";
}

// 提交语言表单（防抖）
const handleSubmit = useDebounceFn(() => {
  dataFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const user_wallet_logId = formData.id;
      formData.rpc_user_id = formData.user_id;
      loading.value = true;
      if (user_wallet_logId) {
        UserWalletLogAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        UserWalletLogAPI.create(formData)
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
 * 删除语言
 *
 * @param id  语言ID
 */
function handleDelete(id?: number) {
  const user_wallet_logIds = [id || selectIds.value].join(",");
  if (!user_wallet_logIds) {
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
      console.log(user_wallet_logIds);
      UserWalletLogAPI.deleteByIds({ id: user_wallet_logIds })
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
