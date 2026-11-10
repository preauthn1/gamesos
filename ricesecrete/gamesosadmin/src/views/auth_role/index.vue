<!-- 角色管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="24">
      <!-- 角色列表 -->
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
                :placeholder="$t('All')"
                clearable
                style="width: 100px"
              >
                <el-option :label="$t('Normal')" :value="1" />
                <el-option :label="$t('Disable')" :value="2" />
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
                v-hasPerm="['auth_roleInsert']"
                type="success"
                icon="plus"
                @click="handleOpenDialog()"
              >
                {{ $t("Add") }}
              </el-button>
              <el-button
                v-hasPerm="'auth_roleDelete'"
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
            <el-table-column :label="$t('Role') + ' ID'" prop="id" />
            <el-table-column
              :label="$t('Role') + '' + $t('Name')"
              prop="name"
            />
            <el-table-column :label="$t('Menu') + 'ID'" prop="rules" />
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
            <!-- 显示时间戳 -->
            <el-table-column
              :label="$t('Create_Time')"
              align="center"
              prop="created_at"
              width="200"
            />
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
                  v-hasPerm="'auth_roleUpdate'"
                  v-if="scope.row.id != 1"
                  type="success"
                  icon="edit"
                  link
                  size="small"
                  @click="authOpenDialog(scope.row)"
                >
                  {{ $t("Auth") }}
                </el-button>
                <el-button
                  v-hasPerm="'auth_roleUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("Edit") }}
                </el-button>
                <el-button
                  v-hasPerm="'auth_roleDelete'"
                  v-if="scope.row.id != 1"
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
        <el-form-item :label="$t('Role') + ' ' + $t('Name')" prop="title">
          <el-input
            v-model="formData.name"
            :placeholder="$t('Role') + ' ' + $t('Name')"
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
      v-model="authDialog.visible"
      :title="authDialog.title"
      width="500"
      :before-close="authCloseDialog"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-tree
        ref="authTreeRef"
        node-key="value"
        show-checkbox
        :data="menuPermOptions"
        :default-expand-all="false"
        :default-checked-keys="checkedIds"
        @check-change="handlePermCheckChange"
        :check-strictly="false"
        class="mt-5"
      >
        <template #default="{ data }">
          {{ data.label }}
        </template>
      </el-tree>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="authHandleSubmit">
            {{ $t("Confirm") }}
          </el-button>
          <el-button @click="authDialog.visible = false">
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

import RoleAPI, {
  RoleListVO,
  RoleList,
  RoleInfo,
  GroupPageQuery,
} from "@/api/auth/role.api";
import RuleAPI from "@/api/auth/rule.api";
defineOptions({
  name: "AuthGroup",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const userFormRef = ref();
const authTreeRef = ref();

const queryParams = reactive<GroupPageQuery>({
  page: 1,
  pageSize: 15,
});
const selectable = (row: RoleInfo) => ![1].includes(Number(row.id));
const pageData = ref<RoleList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("Role"),
});
// 菜单权限下拉
const menuPermOptions = ref<OptionType[]>([]);
// 选中的菜单ID
const checkedIds = ref<number[]>([]);
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

const authDialog = reactive({
  visible: false,
  title: t("Role") + t("Auth"),
});

let formData = reactive<RoleInfo>({
  id: "",
  name: "",
  rules: "",
  status: 1,
});

const rules = reactive({
  name: [
    {
      required: true,
      message:
        t("Role") +
        t("Name") +
        t("Not_Empty"),
      trigger: "blur",
    },
  ],
});

// 选中的角色ID
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
      RoleAPI.update(row)
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
    name: ["like", queryParams.keywords],
    status: queryParams.status,
  };
  RoleAPI.getPage(queryParamsData)
    .then((data: RoleListVO) => {
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
  handleQuery();
}

// 选中项发生变化
function handleSelectionChange(selection: any[]) {
  selectIds.value = selection.map((item) => item.id);
}

/**
 * 打开弹窗
 *
 * @param id 角色ID
 */
async function handleOpenDialog(data?: RoleInfo) {
  dialog.visible = true;
  if (data?.id) {
    dialog.title = t("Edit") + t("Role");
    Object.assign(formData, data);
  } else {
    dialog.title = t("Add") + t("Role");
  }
}

// 关闭弹窗
function handleCloseDialog() {
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();
  dialog.visible = false;
  formData.id = "";
  formData.name = "";
  formData.rules = "";
  formData.status = 1;
}

// 打开角色授权
async function authOpenDialog(data?: RoleInfo) {
  // console.log(data);
  authDialog.visible = true;
  authDialog.title = t("Role") + t("Auth");
  let menulist = await RuleAPI.getPage({
    format: "table_tree",
    pageSize: 5000,
  });
  Object.assign(formData, data);
  menuPermOptions.value = menulist.options;
  checkedIds.value = data?.rules_ids
    ? data.rules_ids.split(",").map(Number)
    : [];
}

// 角色权限选中变化
function handlePermCheckChange() {
  // console.log(data);
  const checkedMenuIds: number[] = authTreeRef
    .value!.getCheckedNodes(false, true)
    .map((node: any) => node.value);
  // console.log(checkedMenuIds);
  formData.rules = checkedMenuIds.join(",");
}

// 关闭权限弹窗
function authCloseDialog() {
  authDialog.visible = false;
  formData.id = "";
  formData.name = "";
  formData.rules = "";
  formData.status = 1;
}

// 提交角色表单（防抖）
const authHandleSubmit = useDebounceFn(() => {
  RoleAPI.update(formData)
    .then(() => {
      ElMessage.success(t("Operate_Success"));
      authCloseDialog();
      handleResetQuery();
    })
    .finally(() => (loading.value = false));
}, 1000);

// 提交角色表单（防抖）
const handleSubmit = useDebounceFn(() => {
  userFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;
      if (userId) {
        RoleAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        RoleAPI.create(formData)
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
 * 删除角色
 *
 * @param id  角色ID
 */
function handleDelete(id?: number) {
  const userIds = [id || selectIds.value].join(",");
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
      RoleAPI.deleteByIds({ id: userIds })
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
