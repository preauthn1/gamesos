<!-- 配置管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="24">
      <!-- 配置列表 -->
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
                v-hasPerm="'file_exportDelete'"
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
              :label="$t('Number')"
              align="center"
              prop="number"
            />
            <el-table-column :label="$t('Name')" align="center" prop="name" />
            <el-table-column
              :label="$t('File_Url')"
              align="center"
              prop="url"
            />
            <el-table-column
              :label="$t('Page')"
              align="center"
              prop="file_page"
            />
            <el-table-column :label="$t('Status')" align="center" prop="status">
              <template #default="scope">
                <!-- 状态 0未开始 1进行中 2已完成 3导出错误 -->
                <el-tag v-if="scope.row.status === 0" type="info">
                  {{ $t("Not_Started") }}
                </el-tag>
                <el-tag v-else-if="scope.row.status === 1" type="success">
                  {{ $t("In_Progress") }}
                </el-tag>
                <el-tag v-else-if="scope.row.status === 2" type="warning">
                  {{ $t("Completed") }}
                </el-tag>
                <el-tag v-else-if="scope.row.status === 3" type="danger">
                  {{ $t("Export_Error") }}
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
                  v-hasPerm="'file_exportUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDownload(scope.row)"
                >
                  {{ $t("Download") }}
                </el-button>
                <el-button
                  v-hasPerm="'file_exportDelete'"
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
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { DeviceEnum } from "@/enums/DeviceEnum";
import { t} from "@/utils/i18n";

import FileExportAPI, {
  FileExportInfo,
  FileExportInfoListVO,
  FileExportPageQuery,
  FileExportInfoList,
} from "@/api/system/fileexport.api";
import FileAPI from "@/api/file.api";

defineOptions({
  name: "SysFileExport",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<FileExportPageQuery>({
  page: 1,
  pageSize: 15,
});
const selectable = (row: FileExportInfo) => ![1].includes(Number(row.id));
const pageData = ref<FileExportInfoList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("FileExport"),
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

let formData = reactive<FileExportInfo>({
  id: "",
  number: "",
  /** 名称 */
  name: "",
  /** 键 */
  url: "",
  /** 值 */
  file_page: 1,
  // 类型
  status: 1,
});

const rules = reactive({
  name: [
    {
      required: true,
      message: t("Name") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
});

// 选中的配置ID
const selectIds = ref<number[]>([]);

// 查询
async function handleQuery() {
  loading.value = true;
  let queryParamsData = {
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    name: ["like", queryParams.keywords],
  };
  FileExportAPI.getPage(queryParamsData)
    .then((data: FileExportInfoListVO) => {
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

// 打开下载
async function handleOpenDownload(row: any) {
  const url = row.url;
  ///export/用户列表_011650823.csv 获取文件名
  const filename = url.split("/").pop();
  FileAPI.download(url, filename).then(() => {
    ElMessage.success(t("Operate_Success"));
  });
}

/**
 * 删除配置
 *
 * @param id  配置ID
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
      FileExportAPI.deleteByIds({ id: userIds })
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
