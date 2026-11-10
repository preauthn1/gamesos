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
            <el-form-item :label="$t('User') + ' ID'" prop="id">
              <el-input
                v-model="queryParams.id"
                :placeholder="$t('Please_Enter') + ' ' + $t('User') + ' ID'"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('Invitation_Code')" prop="invitation_code">
              <el-input
                v-model="queryParams.invitation_code"
                :placeholder="$t('Please_Enter') + ' ' + $t('Invitation_Code')"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('Username')" prop="username">
              <el-input
                v-model="queryParams.username"
                :placeholder="$t('Please_Enter') + ' ' + $t('Username')"
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('Superior_Id')" prop="superior_id">
              <el-input
                v-model="queryParams.superior_id"
                :placeholder="$t('Please_Enter') + ' ' + $t('Superior_Id')"
                clearable
              />
            </el-form-item>
            <el-form-item
              :label="$t('Superior_Invitation_Code')"
              prop="superior_invitation_code"
            >
              <el-input
                v-model="queryParams.superior_invitation_code"
                :placeholder="
                  $t('Please_Enter') + ' ' + $t('Superior_Invitation_Code')
                "
                clearable
              />
            </el-form-item>
            <el-form-item :label="$t('Top_Id')" prop="top_id">
              <el-input
                v-model="queryParams.top_id"
                :placeholder="$t('Please_Enter') + ' ' + $t('Top_Id')"
                clearable
              />
            </el-form-item>
            <el-form-item
              :label="$t('Top_Invitation_Code')"
              prop="top_invitation_code"
            >
              <el-input
                v-model="queryParams.top_invitation_code"
                :placeholder="
                  $t('Please_Enter') + ' ' + $t('Top_Invitation_Code')
                "
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
                v-hasPerm="['userInsert']"
                type="success"
                icon="plus"
                @click="handleOpenDialog()"
              >
                {{ $t("Add") }}
              </el-button>
              <!-- <el-button
                v-hasPerm="'userDelete'"
                type="danger"
                icon="delete"
                :disabled="selectIds.length === 0"
                @click="handleDelete()"
              >
                {{ $t("Delete") }}
              </el-button> -->
              <el-button
                v-hasPerm="'userExport'"
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
            :selectable="selectable"
            border
            stripe
            highlight-current-row
            class="data-table__content"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column label="ID" align="center" width="80" prop="id" />
            <el-table-column :label="$t('Avatar')" align="center" width="100">
              <template #default="scope">
                <el-avatar :size="50" :src="scope.row.avatar" />
              </template>
            </el-table-column>
            <el-table-column :label="$t('On_Line_Status')"
              align="center"
              prop="on_line"
            >
              <template v-slot="scope">
                <span v-if="scope.row.on_line == 1">
                  <el-tag type="success">{{ $t("On_Line") }}</el-tag>
                </span>
                <span v-else>
                  <el-tag type="danger">{{ $t("Off_Line") }}</el-tag>
                </span>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Userinfo')" width="250" align="center">
              <template #default="scope">
                <div class="user-info">
                  <div class="user-label">
                    {{ $t("Username") }}：
                    <span class="user-span">{{ scope.row.username }}</span>
                  </div>
                  <div class="user-label">
                    {{ $t("Nickname") }}：
                    <span class="user-span">{{ scope.row.nickname }}</span>
                  </div>
                  <div class="user-label">
                    {{ $t("Email") }}：
                    <span class="user-span">{{ scope.row.email }}</span>
                  </div>
                  <div class="user-label">
                    {{ $t("Phone") }}：
                    <span class="user-span">
                      {{ scope.row.qh }}{{ scope.row.phone }}
                    </span>
                  </div>
                  <div class="user-label">
                    {{ $t("UserLevel") }}
                    <span class="user-span">{{ scope.row.level }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('User_Money')"
              align="center"
              prop="wallet_balance"
            />
            <el-table-column
              :label="$t('LoginInfo')"
              width="210"
              align="center"
            >
              <template #default="scope">
                <div class="user-info">
                  <div class="user-label">
                    {{ $t("Login_Count") }}：
                    <span class="user-span">{{ scope.row.login_num }}</span>
                  </div>
                  <div class="user-label">
                    {{ $t("Login_Time") }}：
                    <span class="user-span">{{ scope.row.login_at }}</span>
                  </div>
                  <div class="user-label">
                    {{ $t("Login_IP") }}：
                    <span class="user-span">{{ scope.row.login_ip }}</span>
                  </div>
                  <div class="user-label">
                    {{ $t("Register_Time") }}：
                    <span class="user-span">{{ scope.row.register_at }}</span>
                  </div>
                  <div class="user-label">
                    {{ $t("Register_IP") }}：
                    <span class="user-span">{{ scope.row.register_ip }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Invitation_Code')"
              align="center"
              prop="invitation_code"
            />
            <el-table-column
              :label="$t('Agent_Info')"
              align="center"
              prop="superior_info"
              width="260"
            >
              <template #default="scope">
                <!-- //用户id 用户昵称 两行显示 -->
                <div class="users-info">
                  <div>{{ $t("Superior_Agent") }}</div>
                  <div class="user-id">
                    <span class="label">{{ $t("User_Id") }}:</span>
                    <span class="value">
                      {{ scope.row?.superior_info?.id }}
                    </span>
                  </div>
                  <div class="user-username">
                    <span class="label">{{ $t("Username") }}:</span>
                    <span class="value">
                      {{ scope.row?.superior_info?.username }}
                    </span>
                  </div>
                  <div class="users-info">
                    <div>{{ $t("Top_Agent") }}</div>
                    <div class="user-id">
                      <span class="label">{{ $t("User_Id") }}:</span>
                      <span class="value">{{ scope.row?.top_info?.id }}</span>
                    </div>
                    <div class="user-username">
                      <span class="label">{{ $t("Username") }}:</span>
                      <span class="value">
                        {{ scope.row?.top_info?.username }}
                      </span>
                    </div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Kyc_Status')"
              align="center"
              prop="kyc_status"
            >
              <!-- KYC认证状态 0未认证 1认证中 2认证成功 3认证失败 -->
              <template v-slot="scope">
                <span v-if="scope.row.kyc_status === 0">
                  <el-tag>{{ $t("Kyc_Status_0") }}</el-tag>
                </span>
                <span v-if="scope.row.kyc_status === 1">
                  <el-tag type="warning">{{ $t("Kyc_Status_1") }}</el-tag>
                </span>
                <span v-if="scope.row.kyc_status === 2">
                  <el-tag type="success">{{ $t("Kyc_Status_2") }}</el-tag>
                </span>
                <span v-if="scope.row.kyc_status === 3">
                  <el-tag type="danger">{{ $t("Kyc_Status_3") }}</el-tag>
                </span>
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
                  v-hasPerm="'userUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("Edit") }}
                </el-button>
                <!-- <el-button
                  v-hasPerm="'userDelete'"
                  type="danger"
                  icon="delete"
                  link
                  size="small"
                  @click="handleDelete(scope.row.id)"
                >
                  {{ $t("Delete") }}
                </el-button> -->
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
        <el-form-item :label="$t('Username')" prop="username">
          <el-input
            v-model="formData.username"
            :placeholder="$t('Please_Enter') + $t('Username')"
          />
        </el-form-item>
        <el-form-item :label="$t('Password')" prop="password">
          <el-input
            v-model="formData.password"
            :placeholder="$t('Please_Enter') + $t('Password')"
          />
        </el-form-item>
        <el-form-item :label="$t('Nickname')" prop="nickname">
          <el-input
            v-model="formData.nickname"
            :placeholder="$t('Please_Enter') + $t('Nickname')"
          />
        </el-form-item>

        <el-form-item :label="$t('Avatar')">
          <SingleImageUpload
            :accept="'.png,.jpg'"
            :style="{ width: '100px', height: '100px' }"
            v-model="formData.avatar"
          />
        </el-form-item>
        <el-form-item :label="$t('Email')" prop="email">
          <el-input
            v-model="formData.email"
            :placeholder="$t('Please_Enter') + $t('Email')"
          />
        </el-form-item>
        <el-form-item :label="$t('Phone')" prop="phone">
          <el-input
            v-model="formData.phone"
            :placeholder="$t('Please_Enter') + $t('Phone')"
          />
        </el-form-item>
        <el-form-item :label="$t('Phone') + $t('Code')" prop="qh">
          <el-input
            v-model="formData.qh"
            :placeholder="$t('Please_Enter') + $t('Phone') + $t('Code')"
          />
        </el-form-item>
        <el-form-item :label="$t('Language')" prop="lang">
          <el-select
            v-model="formData.lang"
            :placeholder="$t('Please_Select')"
            clearable
            filterable
          >
            <el-option
              v-for="langdata in langList"
              :key="langdata.value"
              :label="langdata.name"
              :value="langdata.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('UserLevel')" prop="level">
          <el-select
            v-model="formData.level"
            :placeholder="$t('Please_Select')"
            clearable
            filterable
          >
            <el-option
              v-for="leveldata in levelList"
              :key="Number(leveldata.number)"
              :label="leveldata.name"
              :value="Number(leveldata.number)"
            />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Invitation_Code')" prop="inv_code">
          <el-input
            v-model="formData.inv_code"
            :placeholder="$t('Please_Enter') + $t('Invitation_Code')"
          />
        </el-form-item>
        <el-form-item :label="$t('Kyc_Status')" prop="kyc_status">
          <!-- //我想用 el-radio 来代替 el-select -->
          <el-radio-group v-model="formData.kyc_status">
            <el-radio :label="0">{{ $t("Kyc_Status_0") }}</el-radio>
            <el-radio :label="1">{{ $t("Kyc_Status_1") }}</el-radio>
            <el-radio :label="2">{{ $t("Kyc_Status_2") }}</el-radio>
            <el-radio :label="3">{{ $t("Kyc_Status_3") }}</el-radio>
          </el-radio-group>
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
import { useAppStore } from "@/store/modules/app";
import { DeviceEnum } from "@/enums/DeviceEnum";
import SingleImageUpload from "@/components/Upload/SingleImageUpload.vue";
import { t} from "@/utils/i18n";
import UserAPI, {
  UserInfo,
  UserListVO,
  UserPageQuery,
  UserList,
} from "@/api/member/user.api";
import MenuAPI from "@/api/menu";
import UserLevelAPI, {
  UserLevelList,
  UserLevelListVO,
} from "@/api/member/userlevel.api";

defineOptions({
  name: "User",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<UserPageQuery>({
  page: 1,
  pageSize: 15,
});

interface Category {
  name: string;
  value: string;
}
// Reactive data
const statusOptions = ref<Category[]>([]);
const levelList = ref<UserLevelList[]>([]);
const langList = ref<Category[]>([]);

// Improved error handling in fetchStatus
const fetchStatus = async () => {
  try {
    let result = await MenuAPI.dictionary("default_status");
    statusOptions.value = result || [];
  } catch (error) {
    console.error("Failed to fetch status options:", error);
    ElMessage.error(t("Failed_To_Load") + t("Status"));
  }

  try {
    const { list } = await UserLevelAPI.getPage({});
    // Create default user level and append fetched levels
    levelList.value = [
      {
        name: "VIP0",
        number: "0",
        updated_at: "",
        created_at: "",
      },
      ...list,
    ];
  } catch (error) {
    console.error("Failed to fetch user levels:", error);
    ElMessage.error(t("Failed_To_Load") + t("UserLevel"));
  }

  try {
    const result = await MenuAPI.getLangList();
    langList.value = result || [];
  } catch (error) {
    console.error("Failed to fetch language list:", error);
    ElMessage.error(t("Failed_To_Load") + t("Language"));
  }
};

const selectable = (row: UserInfo) => ![1].includes(Number(row.id));
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

let formData = reactive<UserInfo>({
  id: "",
  username: "",
  nickname: "",
  password: "",
  avatar: "",
  email: "",
  phone: "",
  qh: "",
  level: "",
  inv_code: "",
  status: 1,
  kyc_status: 0,
  lang: "",
});

// Import required types for form validation
import type { FormItemRule } from 'element-plus';

// Fixed rules definition with proper Element Plus types
const rules = reactive<Record<string, FormItemRule[]>>({ // Using standard Element Plus types
  username: [
    {
      required: true,
      message: t("Name") + t("Not_Empty"),
      trigger: "blur",
    },
    {
      min: 3,
      max: 20,
      message: t("Username_Range"),
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
  email: [
    {
      type: "email",
      message: t("Email_Format_Invalid"),
      trigger: ["blur", "change"],
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
  row: UserInfo,
  value: number | boolean | string,
  field: keyof UserInfo
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
    .then(async () => {
      const originalStatus = row[field];
      (row as any)[field] = value;
      
      try {
        await UserAPI.update(row);
        ElMessage.success(t("Operate_Success"));
      } catch (error) {
        (row as any)[field] = originalStatus;
        console.error("Status update failed:", error);
        ElMessage.error(t("Operate_Failed") + ": " + (error as Error).message);
      }
    })
    .catch(() => {
      (row as any)[field] = row[field] === 1 ? 2 : 1;
      ElMessage.info(t("Operate_Cancel"));
    });
}

// Optimized query parameter construction
const getQueryParams = computed(() => ({
  page: queryParams.page,
  pageSize: queryParams.pageSize,
  username__email__mobile__invitation_code: ["like", queryParams.keywords],
  status: queryParams.status,
  id: queryParams.id,
  invitation_code: queryParams.invitation_code,
  username: ["like", queryParams.username],
  superior_id: queryParams.superior_id,
  superior_invitation_code: queryParams.superior_invitation_code,
  top_id: queryParams.top_id,
  top_invitation_code: queryParams.top_invitation_code,
}));

async function handleQuery() {
  loading.value = true;
  try {
    const { list, total: totalData } = await UserAPI.getPage(getQueryParams.value);
    pageData.value = list;
    total.value = totalData;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    ElMessage.error(t("Failed_To_Load") + t("User"));
  } finally {
    loading.value = false;
  }
}

// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.page = 1;
  queryParams.keywords = "";
  queryParams.username = "";
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
async function handleOpenDialog(user?: UserInfo) {
  dialog.visible = true;
  if (user?.id) {
    dialog.title = t("Edit") + t("User");
    //复制 user 给formData.value
    user.password = "";
    Object.assign(formData, user);
  } else {
    dialog.title = t("Add") + t("User");
  }
}

// Optimized dialog handling with proper cleanup
function handleCloseDialog() {
  dialog.visible = false;
  nextTick(() => {
    dataFormRef.value?.resetFields();
    dataFormRef.value?.clearValidate();
    Object.assign(formData, {
      id: "",
      username: "",
      nickname: "",
      lang: "",
      avatar: "",
      status: 1,
      kyc_status: 0,
      email: "",
      phone: "",
      qh: "",
      password: "",
      level: "",
      inv_code: "",
    });
  });
}

// 提交语言表单（防抖）
const handleSubmit = useDebounceFn(() => {
  dataFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;
      if (userId) {
        UserAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        UserAPI.create(formData)
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
      UserAPI.deleteByIds({ id: userIds })
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

// Optimized export function with better error handling
function handleExport(num?: number) {
  const exportParams = {
    ...queryParams,
    export_name: t("User_List"),
    pageSize: num || 1000,
  };

  UserAPI.export(exportParams)
    .then(() => {
      ElMessage.success(t("Export_Success"));
    })
    .catch((error) => {
      console.error("Export failed:", error);
      ElMessage.error(t("Export_Failed") + ": " + (error as Error).message);
    });
}

onMounted(() => {
  fetchStatus();
  handleQuery();
});
</script>
<style scoped>
.user-info {
  text-align: center;
  padding: 8px 0;
}

.user-label {
  margin: 4px 0;
  font-size: 12px;
  color: #666;
  word-break: break-all;
  text-align: left;
}
.user-span {
  margin: 4px 0;
  color: #2486e2;
}
</style>
<style lang="scss" scoped>
.users-info {
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
