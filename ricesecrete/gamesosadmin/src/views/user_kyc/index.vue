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
            <el-form-item :label="$t('User_Id')" prop="user_id">
              <el-input
                v-model="queryParams.user_id"
                :placeholder="$t('Please_Enter') + ' ' + $t('User_Id')"
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
            <el-form-item :label="$t('Keyword')" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                :placeholder="
                  $t('Please_Enter') + ' ' + $t('Name') + '/' + $t('ID_Number')
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
                v-hasPerm="['user_kycInsert']"
                type="success"
                icon="plus"
                @click="handleOpenDialog()"
              >
                {{ $t("Add") }}
              </el-button>
              <el-button
                v-hasPerm="'user_kycDelete'"
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
              prop="user_info"
              width="260"
            >
              <template #default="scope">
                <!-- //用户id 用户昵称 两行显示 -->
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
            <el-table-column :label="$t('Type')" align="center" prop="type">
              <!-- //类型 1:身份证 2:护照 -->
              <template #default="scope">
                <el-tag v-if="scope.row.type === 1">{{ $t("ID_Card") }}</el-tag>
                <el-tag v-else>{{ $t("Passport") }}</el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('KycName')"
              align="center"
              prop="name"
            />
            <el-table-column
              :label="$t('ID_Number')"
              align="center"
              prop="id_number"
            />
            <el-table-column :label="$t('Photo')" align="center" width="350">
              <template #default="scope">
                <template v-if="scope.row.id_photo">
                  <el-image
                    v-for="value in JSON.parse(scope.row.id_photo) ?? []"
                    style="width: 100px"
                    :src="value"
                    :preview-src-list="[value]"
                    :append-to-body="true"
                    preview-teleported
                  />
                </template>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Status')" align="center" prop="status">
              <template #default="scope">
                <el-tag v-if="scope.row.status === 1" type="info">
                  {{ $t("Pending_Review") }}
                </el-tag>
                <el-tag v-if="scope.row.status === 2" type="success">
                  {{ $t("Approved") }}
                </el-tag>
                <el-tag v-if="scope.row.status === 3" type="danger">
                  {{ $t("Rejected") }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Audit_Time')"
              align="center"
              prop="audit_time"
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
                  v-hasPerm="'user_kycUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("Edit") }}
                </el-button>
                <el-button
                  v-hasPerm="'user_kycDelete'"
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
        <el-form-item :label="$t('Type')" prop="type">
          <el-radio-group v-model="formData.type">
            <el-radio :label="1">{{ $t("ID_Card") }}</el-radio>
            <el-radio :label="2">{{ $t("Passport") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('User_Id')" prop="user_id">
          <el-input
            v-model="formData.user_id"
            :placeholder="$t('Please_Enter') + $t('User_Id')"
          />
        </el-form-item>
        <el-form-item :label="$t('Name')" prop="name">
          <el-input
            v-model="formData.name"
            :placeholder="$t('Please_Enter') + $t('Name')"
          />
        </el-form-item>
        <el-form-item :label="$t('ID_Number')" prop="id_number">
          <el-input
            v-model="formData.id_number"
            :placeholder="$t('Please_Enter') + $t('ID_Number')"
          />
        </el-form-item>
        <el-form-item :label="$t('Photo')">
          <MultiImageUploadJson
            :accept="'image/png,image/jpg'"
            v-model="formData.id_photo"
          />
        </el-form-item>
        <el-form-item :label="$t('Audit_Time')">
          <el-date-picker
            v-model="formData.audit_time"
            type="datetime"
            :placeholder="$t('Please_Select') + $t('Audit_Time')"
            value-format="YYYY-MM-DD HH:mm:ss"
            format="YYYY-MM-DD HH:mm:ss"
          />
        </el-form-item>
        <el-form-item :label="$t('Status')">
          <el-radio-group v-model="formData.status">
            <el-radio :label="1">{{ $t("Pending_Review") }}</el-radio>
            <el-radio :label="2">{{ $t("Approved") }}</el-radio>
            <el-radio :label="3">{{ $t("Rejected") }}</el-radio>
          </el-radio-group>
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
import MultiImageUploadJson from "@/components/Upload/MultiImageUploadJson.vue";
import { t} from "@/utils/i18n";
import { getYmdHis } from "@/utils/utils";
import UserKycAPI, {
  UserKycInfo,
  UserKycListVO,
  UserKycPageQuery,
  UserKycList,
} from "@/api/member/userkyc.api";

defineOptions({
  name: "SysUserKyc",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<UserKycPageQuery>({
  page: 1,
  pageSize: 15,
});
const selectable = (row: UserKycInfo) => ![1].includes(Number(row.id));
const pageData = ref<UserKycList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("UserKyc"),
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

const formData = reactive<UserKycInfo>({
  id: "",
  user_id: "",
  type: 1,
  name: "",
  id_number: "",
  id_photo: "",
  audit_time: getYmdHis(),
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
  name: [
    {
      required: true,
      message: t("Name") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: t("Type") + t("Not_Empty"),
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
    id_number__name: ["like", queryParams.keywords],
    user_id: queryParams.user_id,
    user_name: queryParams.user_name,
  };
  UserKycAPI.getPage(queryParamsData)
    .then((data: UserKycListVO) => {
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
async function handleOpenDialog(user?: UserKycInfo) {
  dialog.visible = true;
  if (user?.id) {
    dialog.title = t("Edit") + t("UserKyc");
    // 复制 user 给 formData
    Object.assign(formData, user);

    // 确保 audit_time 是有效日期
    if (formData.audit_time) {
      const date = new Date(formData.audit_time);
      if (isNaN(date.getTime())) {
        formData.audit_time = getYmdHis();
      } else {
        // 格式化日期字符串为 YYYY-MM-DD HH:mm:ss
        formData.audit_time = formatDateTime(date);
      }
    } else {
      formData.audit_time = getYmdHis();
    }
  } else {
    dialog.title = t("Add") + t("UserKyc");
    // 重置表单
    resetFormData();
  }
}

// 格式化日期时间
function formatDateTime(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// 重置表单数据
function resetFormData() {
  formData.id = "";
  formData.user_id = "";
  formData.type = 1;
  formData.name = "";
  formData.id_number = "";
  formData.id_photo = "";
  formData.audit_time = getYmdHis();
  formData.status = 1;
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  resetFormData();
}

// 提交语言表单（防抖）
const handleSubmit = useDebounceFn(() => {
  dataFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;
      if (userId) {
        UserKycAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        UserKycAPI.create(formData)
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
      UserKycAPI.deleteByIds({ id: userIds })
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
