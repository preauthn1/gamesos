<!-- 日志管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="24">
      <!-- 日志列表 -->
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
          <!-- <div class="data-table__toolbar" style="margin-bottom: 10px">
            <div class="data-table__toolbar--actions">
              <el-button
                v-hasPerm="'authOperateDelBtn'"
                type="danger"
                icon="delete"
                :disabled="selectIds.length === 0"
                @click="handleDelete()"
              >
                {{ $t("Delete") }}
              </el-button>
            </div>
          </div> -->

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
              :label="$t('Administrator') + 'id'"
              prop="admin_id"
              width="100"
            />
            <el-table-column
              :label="$t('Administrator') + $t('Name')"
              prop="admin_name"
            />
            <el-table-column
              :label="$t('Administrator') + $t('Router')"
              prop="path"
            />
            <el-table-column :label="$t('Operate') + $t('Name')" prop="title">
              <template #default="scope">
                <el-tag v-if="scope.row.title">
                  {{ getTitleStr(scope.row.title) }}
                </el-tag>
              </template>
            </el-table-column>
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
                  v-hasPerm="'auth_operateInfo'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("View") }}
                </el-button>
                <!-- <el-button
                  v-hasPerm="'authOperateDelBtn'"
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
      <el-form ref="userFormRef" :model="formData" label-width="130px">
        <el-form-item :label="$t('Administrator')">
          <label>{{ formData.admin_name }} ({{ formData.admin_id }})</label>
        </el-form-item>
        <el-form-item :label="$t('Operate') + $t('Name')">
          <el-input v-model="formData.title" />
        </el-form-item>
        <el-form-item :label="$t('Operate') + $t('Router')">
          <el-input v-model="formData.path" />
        </el-form-item>
        <el-form-item :label="$t('Data')">
          <el-input :rows="10" type="textarea" v-model="formData.param" />
        </el-form-item>
        <el-form-item :label="$t('Create_Time')">
          <el-input v-model="formData.created_at" />
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

import OperateAPI, {
  OperateInfo,
  OperateInfoListVO,
  OperatePageQuery,
  OperateInfoList,
} from "@/api/auth/operate.api";

defineOptions({
  name: "AuthOperate",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const userFormRef = ref();

const queryParams = reactive<OperatePageQuery>({
  page: 1,
  pageSize: 15,
});
const selectable = (row: OperateInfo) => ![1].includes(Number(row.id));
const pageData = ref<OperateInfoList[]>();
const total = ref(0);
const loading = ref(false);

const getTitleStr = (title: string) => {
  //权限管理->权限菜单->更新
  const titleArr = title.split("->");
  return titleArr
    .map((item) => {
      return t(item);
    })
    .join("->");
};

const dialog = reactive({
  visible: false,
  title: t("View") + t("Log"),
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

let formData = reactive<OperateInfo>({
  id: "",
  admin_id: "",
  title: "",
  path: "",
  param: "",
  created_at: "",
});

const rules = reactive({
  name: [{ required: true, message: "操作名称", trigger: "blur" }],
  url: [{ required: true, message: "路由地址", trigger: "blur" }],
});

// 选中的日志ID
const selectIds = ref<number[]>([]);
// 角色下拉数据源
const groupOptions = ref<OperateInfoList[]>();
// 导入弹窗显示状态
const importDialogVisible = ref(false);

// 查询
async function handleQuery() {
  loading.value = true;
  let queryParamsData = {
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    title: ["like", queryParams.keywords],
    status: queryParams.status,
    format_field: "admin_id",
  };
  OperateAPI.getPage(queryParamsData)
    .then((data: OperateInfoListVO) => {
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
 * @param id 日志ID
 */
async function handleOpenDialog(user?: OperateInfo) {
  dialog.visible = true;
  if (user?.id) {
    dialog.title = t("Edit") + t("Log");
    //复制 user 给formData.value
    Object.assign(formData, user);
  } else {
    dialog.title = t("Add") + t("Log");
  }
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  userFormRef.value.resetFields();
  userFormRef.value.clearValidate();
}

onMounted(() => {
  handleQuery();
});
</script>
