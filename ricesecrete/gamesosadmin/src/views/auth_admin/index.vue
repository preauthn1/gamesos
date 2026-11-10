<!-- 用户管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="24">
      <!-- 用户列表 -->
      <el-col :lg="24" :xs="24">
        <!-- 搜索区域 -->
        <div class="search-container">
          <el-form
            ref="queryFormRef"
            :model="queryParams"
            :inline="true"
            label-width="auto"
          >
            <el-form-item :label="$t('Auth_Role')" prop="role_id">
              <el-select
                v-model="queryParams.role_id"
                :placeholder="$t('All')"
                clearable
                style="width: 100px"
              >
                <el-option :label="$t('All')" value="" />
                <el-option
                  v-for="item in groupOptions"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id ?? ''"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Keyword')" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                :placeholder="$t('Please_Enter') + $t('Keyword')"
                clearable
              />
            </el-form-item>

            <el-form-item :label="$t('Status')" prop="status">
              <el-select
                v-model="queryParams.status"
                :placeholder="$t('All')"
                clearable
                style="width: 100px"
              >
                <el-option :label="$t('Normal')" :value="1" />
                <el-option :label="$t('Disable')" :value="2" />
              </el-select>
            </el-form-item>

            <el-form-item :label="$t('Create_Time')">
              <el-date-picker
                v-model="queryParams.created_at"
                :editable="false"
                type="daterange"
                range-separator="~"
                :start-placeholder="$t('Start_Time')"
                :end-placeholder="$t('End_Time')"
                value-format="YYYY-MM-DD"
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
                v-hasPerm="['auth_adminInsert']"
                type="success"
                icon="plus"
                @click="handleOpenDialog()"
              >
                {{ $t("Add") }}
              </el-button>
              <el-button
                v-hasPerm="'auth_adminDelete'"
                type="danger"
                icon="delete"
                :disabled="selectIds.length === 0"
                @click="handleDelete()"
              >
                {{ $t("Delete") }}
              </el-button>
              <el-button
                v-hasPerm="'auth_adminExport'"
                icon="download"
                @click="handleExport(1000)"
              >
                {{ $t("Export") }}
              </el-button>
            </div>
          </div>

          <el-table
            v-loading="loading"
            :data="pageData"
            border
            stripe
            highlight-current-row
            class="data-table__content"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              type="selection"
              width="50"
              align="center"
              :selectable="selectable"
            />
            <el-table-column label="ID" align="center" width="80" prop="id" />
            <el-table-column
              :label="$t('User_Name')"
              prop="username"
              width="150"
            />
            <el-table-column :label="$t('Avatar')" align="center" width="100">
              <template #default="scope">
                <el-avatar :size="50" :src="scope.row.avatar" />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Nick_Name')"
              align="center"
              prop="nickname"
              width="150"
            />
            <el-table-column
              :label="$t('Auth_Role')"
              width="200"
              align="center"
              prop="role_name"
            />
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
              :label="$t('Login_Num')"
              align="center"
              prop="login_num"
              width="120"
            />
            <el-table-column
              :label="$t('Login_IP')"
              align="center"
              prop="login_ip"
              width="200"
            />
            <el-table-column
              :label="$t('Login_Time')"
              align="center"
              prop="login_at"
              width="200"
            />
            <el-table-column
              :label="$t('Create_Time')"
              align="center"
              prop="created_at"
              width="200"
            />
            <el-table-column
              :label="$t('Operate')"
              fixed="right"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-hasPerm="'auth_adminUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("Edit") }}
                </el-button>
                <el-button
                  v-hasPerm="'auth_adminDelete'"
                  v-if="userStore.user.id != scope.row.id"
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
        ref="userFormRef"
        :model="formData"
        :rules="rules"
        label-width="130px"
      >
        <el-form-item :label="$t('User_Name')" prop="username">
          <el-input
            v-model="formData.username"
            :readonly="!!formData.id"
            :placeholder="$t('User_Name')"
          />
        </el-form-item>
        <el-form-item :label="$t('Password')" prop="password">
          <el-input v-model="formData.password" :placeholder="$t('Password')" />
        </el-form-item>
        <el-form-item :label="$t('Nick_Name')" prop="nickname">
          <el-input
            v-model="formData.nickname"
            :placeholder="$t('Nick_Name')"
          />
        </el-form-item>
        <el-form-item :label="$t('Avatar')" prop="avatar">
          <SingleImageUpload v-model="formData.avatar" />
        </el-form-item>
        <el-form-item :label="$t('Auth_Role')" prop="group_id">
          <el-select v-model="formData.role_id" :placeholder="$t('Auth_Role')">
            <el-option
              v-for="item in groupOptions"
              :key="item.id + ''"
              :label="item.name"
              :value="item.id ? item.id + '' : ''"
            />
          </el-select>
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
import SingleImageUpload from "@/components/Upload/SingleImageUpload.vue";
import { useAppStore } from "@/store/modules/app";
import { DeviceEnum } from "@/enums/DeviceEnum";
import { t} from "@/utils/i18n";
import { useUserStore } from "@/store";

import RoleAPI, { RoleListVO, RoleList } from "@/api/auth/role.api";
import AdminAPI, {
  UserForm,
  UserListVO,
  UserPageQuery,
  UserList,
} from "@/api/auth/admin.api";

defineOptions({
  name: "User",
  inheritAttrs: false,
});

const appStore = useAppStore();
const userStore = useUserStore();

const queryFormRef = ref();
const userFormRef = ref();

const queryParams = reactive<UserPageQuery>({
  page: 1,
  pageSize: 15,
});
const selectable = (row: UserForm) => {
  return userStore.user.id !== row.id;
};
const pageData = ref<UserList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("User"),
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

let formData = reactive<UserForm>({
  id: "",
  username: "",
  password: "",
  nickname: "",
  avatar: "",
  role_id: "",
  status: 1,
});

const rules = reactive({
  username: [
    {
      required: true,
      message: t("User_Name") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  nickname: [
    {
      required: true,
      message: t("Nick_Name") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  role_id: [
    {
      required: true,
      message: t("Auth_Role") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
});

// 选中的用户ID
const selectIds = ref<number[]>([]);
// 角色下拉数据源
const groupOptions = ref<RoleList[]>();
// 导入弹窗显示状态
const importDialogVisible = ref(false);

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
      AdminAPI.update(row)
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
      // Revert the UI change if user cancels
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
    username__nickname: ["like", queryParams.keywords],
    status: queryParams.status,
    role_id: ["in", queryParams.role_id],
    created_at: queryParams.created_at,
    format_field: "role_id",
  };
  AdminAPI.getPage(queryParamsData)
    .then((data: UserListVO) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}

// 初始化查询参数
async function initParams() {
  RoleAPI.getPage({ page: 1, pageSize: 1000 })
    .then((data: RoleListVO) => {
      groupOptions.value = data.list;
    })
    .finally(() => {
      loading.value = false;
    });
}

// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.page = 1;
  queryParams.role_id = "";
  queryParams.status = "";
  queryParams.keywords = "";
  queryParams.created_at = undefined;
  handleQuery();
}

// 选中项发生变化
function handleSelectionChange(selection: any[]) {
  selectIds.value = selection.map((item) => item.id);
}

/**
 * 打开弹窗
 *
 * @param id 用户ID
 */
async function handleOpenDialog(user?: UserForm) {
  dialog.visible = true;
  if (user?.id) {
    dialog.title = t("Edit") + t("User");
    //复制 user 给formData.value
    //密码清除
    user.password = "";
    Object.assign(formData, user);
  } else {
    dialog.title = t("Add") + t("User");
  }
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();
  formData.id = "";
  formData.username = "";
  formData.password = "";
  formData.role_id = "";
  formData.nickname = "";
  formData.status = 1;
}

// 提交用户表单（防抖）
const handleSubmit = useDebounceFn(() => {
  userFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;
      if (userId) {
        AdminAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        AdminAPI.create(formData)
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
 * 删除用户
 *
 * @param id  用户ID
 */
function handleDelete(id?: number) {
  const userIds = [id || selectIds.value];
  if (!userIds) {
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
      console.log(userIds);
      AdminAPI.deleteByIds({ id: userIds })
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
    export_name: "管理员列表",
    pageSize: num || 1000,
  };
  AdminAPI.export(queryParamsExport).then((response: any) => {
    ElMessage.success(t("Operate_Success"));
  });
}

onMounted(() => {
  initParams();
  handleQuery();
});
</script>
