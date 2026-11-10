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
                v-hasPerm="['sys_langInsert']"
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
            <el-table-column
              :label="$t('Language') + $t('Title')"
              align="center"
              prop="title"
            />
            <el-table-column
              :label="$t('Language') + $t('Name')"
              align="center"
              prop="remark"
            />
            <el-table-column
              :label="$t('Language') + $t('Code')"
              align="center"
              prop="lang"
            />
            <el-table-column :label="$t('Sort')" align="center" prop="sort" />
            <el-table-column
              :label="$t('Default')"
              align="center"
              prop="is_default"
            >
              <template #default="scope">
                <el-switch
                  v-model="scope.row.is_default"
                  :active-value="1"
                  :inactive-value="2"
                  inline-prompt
                  :active-text="$t('Normal')"
                  :inactive-text="$t('Disable')"
                  @change="
                    (val) => handleStatusChange(scope.row, val, 'is_default')
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
        <el-form-item :label="$t('Language') + $t('Title')" prop="title">
          <el-input
            v-model="formData.title"
            :placeholder="$t('Please_Enter') + $t('Language') + $t('Title')"
          />
        </el-form-item>
        <el-form-item :label="$t('Language') + $t('Name')" prop="name">
          <el-input
            v-model="formData.remark"
            :placeholder="$t('Please_Enter') + $t('Language') + $t('Name')"
          />
        </el-form-item>
        <el-form-item :label="$t('Language') + $t('Code')" prop="lang">
          <el-input
            v-model="formData.lang"
            :placeholder="$t('Please_Enter') + $t('Language') + $t('Code')"
          />
        </el-form-item>
        <el-form-item :label="$t('Default')" prop="is_default">
          <el-switch
            v-model="formData.is_default"
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
import LangAPI, {
  LangInfo,
  LangListVO,
  LangPageQuery,
  LangList,
} from "@/api/system/lang.api";

defineOptions({
  name: "SysLang",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<LangPageQuery>({
  page: 1,
  pageSize: 15,
});
const selectable = (row: LangInfo) => ![1].includes(Number(row.id));
const pageData = ref<LangList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("Language"),
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

let formData = reactive<LangInfo>({
  id: "",
  title: "",
  remark: "",
  lang: "",
  is_default: 2,
  status: 1,
  sort: 0,
});

const rules = reactive({
  title: [
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
      LangAPI.update(row)
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
    title__remark: ["like", queryParams.keywords],
  };
  LangAPI.getPage(queryParamsData)
    .then((data: LangListVO) => {
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
async function handleOpenDialog(user?: LangInfo) {
  dialog.visible = true;
  if (user?.id) {
    dialog.title = t("Edit") + t("Language");
    //复制 user 给formData.value
    Object.assign(formData, user);
  } else {
    dialog.title = t("Add") + t("Language");
  }
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = "";
  formData.title = "";
  formData.remark = "";
  formData.lang = "";
  formData.is_default = 2;
  formData.status = 1;
  formData.sort = 0;
}

// 提交语言表单（防抖）
const handleSubmit = useDebounceFn(() => {
  dataFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;
      if (userId) {
        LangAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        LangAPI.create(formData)
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
      LangAPI.deleteByIds({ id: userIds })
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
