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
            <el-form-item :label="$t('Username')" prop="user_name">
              <el-input
                v-model="queryParams.user_name"
                :placeholder="$t('Please_Enter') + ' ' + $t('Username')"
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
            <el-table-column
              :label="$t('Userinfo')"
              align="center"
              width="260"
              prop="user_info"
            >
              <template #default="scope">
                <div class="user-info">
                  <div class="user-id">
                    <span class="label">{{ $t("User_Id") }}:</span>
                    <span class="value">{{ scope.row.user_info.id }}</span>
                  </div>
                  <div class="user-username">
                    <span class="label">{{ $t("Username") }}:</span>
                    <span class="value">
                      {{ scope.row.user_info.username }}
                    </span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('IP')" align="center" prop="ip" />
            <el-table-column :label="$t('Area')" align="center" prop="area" />
            <el-table-column :label="$t('Type')" align="center" prop="type">
              <!-- 登录类型 0修改用户信息  1修改用户密码 2重置用户密码 3重置支付密码 4登录 5注册 6退出登录-->
              <template #default="scope">
                <el-tag v-if="scope.row.type === 0">
                  {{ $t("Modify_User_Info") }}
                </el-tag>
                <el-tag v-if="scope.row.type === 1">
                  {{ $t("Modify_User_Password") }}
                </el-tag>
                <el-tag v-if="scope.row.type === 2">
                  {{ $t("Reset_User_Password") }}
                </el-tag>
                <el-tag v-if="scope.row.type === 3">
                  {{ $t("Reset_Pay_Password") }}
                </el-tag>
                <el-tag v-if="scope.row.type === 4">
                  {{ $t("Login") }}
                </el-tag>
                <el-tag v-if="scope.row.type === 5">
                  {{ $t("Register") }}
                </el-tag>
                <el-tag v-if="scope.row.type === 6">
                  {{ $t("Logout") }}
                </el-tag>
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
                  v-hasPerm="'sys_langUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("View") }}
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
        <el-form-item :label="$t('User') + ' ID'" prop="user_id">
          <el-input
            v-model="formData.user_id"
            :placeholder="$t('Please_Enter') + $t('User') + ' ID'"
          />
        </el-form-item>
        <el-form-item :label="$t('IP')" prop="ip">
          <el-input
            v-model="formData.ip"
            :placeholder="$t('Please_Enter') + $t('IP')"
          />
        </el-form-item>
        <el-form-item :label="$t('Area')" prop="area">
          <el-input
            v-model="formData.area"
            :placeholder="$t('Please_Enter') + $t('Area')"
          />
        </el-form-item>
        <el-form-item :label="$t('Device')" prop="device">
          <el-input
            v-model="formData.device"
            :placeholder="$t('Please_Enter') + $t('Device')"
          />
        </el-form-item>
        <el-form-item :label="$t('Uuid')" prop="uuid">
          <el-input
            v-model="formData.uuid"
            :placeholder="$t('Please_Enter') + $t('Uuid')"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
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
import UserLogAPI, {
  UserLogInfo,
  UserLogListVO,
  UserLogPageQuery,
  UserLogList,
} from "@/api/member/userlog.api";

defineOptions({
  name: "SysUserLog",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<UserLogPageQuery>({
  page: 1,
  pageSize: 15,
});
const selectable = (row: UserLogInfo) => ![1].includes(Number(row.id));
const pageData = ref<UserLogList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("User") + t("Log"),
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

let formData = reactive<UserLogInfo>({
  id: "",
  user_id: "",
  ip: "",
  area: "",
  type: "",
  device: "",
  uuid: "",
});

const rules = reactive({});

// 选中的语言ID
const selectIds = ref<number[]>([]);
// 查询
async function handleQuery() {
  loading.value = true;
  let queryParamsData = {
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    ip__area: ["like", queryParams.keywords],
    user_name: queryParams.user_name,
    user_id: queryParams.user_id,
  };
  UserLogAPI.getPage(queryParamsData)
    .then((data: UserLogListVO) => {
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
async function handleOpenDialog(user?: UserLogInfo) {
  dialog.visible = true;
  if (user?.id) {
    dialog.title =
      t("Edit") + t("User") + t("Log");
    //复制 user 给formData.value
    Object.assign(formData, user);
  } else {
    dialog.title =
      t("Add") + t("User") + t("Log");
  }
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = "";
  formData.user_id = "";
  formData.ip = "";
  formData.area = "";
  formData.type = "";
  formData.device = "";
  formData.uuid = "";
}

// 提交语言表单（防抖）
const handleSubmit = useDebounceFn(() => {
  dataFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;
      if (userId) {
        UserLogAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        UserLogAPI.create(formData)
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
      console.log(userIds);
      UserLogAPI.deleteByIds({ id: userIds })
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
  .user-info {
    text-align: left;
    padding: 8px 0;
  
    div {
      margin-bottom: 4px;
  
      &:last-child {
        margin-bottom: 0;
      }
    }
  
    .label {
      font-weight: 600;
      color: #606266;
      margin-right: 6px;
      display: inline-block;
    }
  
    .value {
      color: #303133;
      font-weight: 500;
    }
  
    .user-username {
      .value {
        color: #409eff; // Blue color for nickname to distinguish it
      }
    }
  }
  </style>
  