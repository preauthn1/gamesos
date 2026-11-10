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
                v-hasPerm="['sys_configUpdate']"
                type="success"
                icon="plus"
                @click="handleOpenDialog()"
              >
                {{ $t("Add") }}
              </el-button>
              <el-button
                v-hasPerm="'sys_configDelete'"
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
              :label="$t('Rpc') + $t('Name')"
              align="center"
              prop="name"
            />
            <el-table-column
              :label="$t('Rpc_Model')"
              align="center"
              prop="server_model"
            />
            <el-table-column :label="'IP'" align="center" prop="ip" />
            <el-table-column
              :label="$t('Port')"
              align="center"
              prop="server_port"
            />
            <el-table-column
              :label="$t('Rpc_Namespace')"
              align="center"
              prop="server_namespace"
            />
            <el-table-column :label="$t('Path')" align="center" prop="path" />
            <el-table-column
              :label="$t('Number')"
              align="center"
              prop="server_number"
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
            <el-table-column :label="$t('Sys_Info')" align="center" width="260">
              <template #default="scope">
                <div v-if="scope.row.sys_monit?.status == 1">
                  <el-tag>{{ $t("Run") }}</el-tag>
                  <p>
                    <strong>CPU:</strong>
                    {{ scope.row.sys_monit?.cpu }}
                  </p>
                  <p>
                    <strong>{{ $t("Remaining_Memory") }}:</strong>
                    {{ scope.row.sys_monit?.memory }}
                  </p>
                  <p>
                    <strong>{{ $t("Remaining_Disk") }}:</strong>
                    {{ scope.row.sys_monit?.disk }}
                  </p>
                  <p>
                    <strong>{{ $t("Update_Time") }}:</strong>
                    {{ scope.row.sys_monit?.day }}
                  </p>
                </div>
                <div v-if="scope.row.sys_monit?.status == 0">
                  {{ $t("Stop") }}
                </div>
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
              width="220"
            >
              <template #default="scope">
                <el-button
                  v-hasPerm="'sys_configUpdate'"
                  v-if="
                    scope.row.sys_monit?.status == 0 &&
                    scope.row.server_model != 'manage'
                  "
                  type="success"
                  link
                  size="small"
                  @click="handleSendCommand(scope.row, 'start', 'sys_server')"
                >
                  {{ $t("Start_Server") }}
                </el-button>
                <el-button
                  v-hasPerm="'sys_configUpdate'"
                  v-if="
                    scope.row.sys_monit?.status == 1 &&
                    scope.row.server_model != 'manage'
                  "
                  type="danger"
                  link
                  size="small"
                  @click="handleSendCommand(scope.row, 'stop', 'sys_server')"
                >
                  {{ $t("Stop_Server") }}
                </el-button>
                <el-button
                  v-hasPerm="'sys_configUpdate'"
                  type="primary"
                  link
                  size="small"
                  @click="handleSendCommand(scope.row, 'update', 'sys_server')"
                >
                  {{ $t("Update_Server") }}
                </el-button>
                <el-button
                  v-hasPerm="'sys_configUpdate'"
                  type="warning"
                  link
                  size="small"
                  @click="handleSendCommand(scope.row, 'start', 'sys_server')"
                >
                  {{ $t("Restart_Server") }}
                </el-button>
                <el-button
                  v-hasPerm="'sys_configUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("Edit") }}
                </el-button>
                <el-button
                  v-hasPerm="'sys_configDelete'"
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
        <el-form-item :label="$t('Rpc') + $t('Name')" prop="name">
          <el-input
            v-model="formData.name"
            :placeholder="$t('Please_Enter') + $t('Rpc') + $t('Name')"
          />
        </el-form-item>
        <el-form-item :label="$t('Rpc_Model')" prop="server_model">
          <el-input
            v-model="formData.server_model"
            :placeholder="$t('Please_Enter') + $t('Rpc_Model')"
          />
        </el-form-item>
        <el-form-item :label="'IP'" prop="ip">
          <el-input
            v-model="formData.ip"
            :placeholder="$t('Please_Enter') + 'IP'"
          />
        </el-form-item>
        <el-form-item :label="$t('Port')" prop="server_port">
          <el-input
            v-model="formData.server_port"
            :placeholder="$t('Please_Enter') + $t('Port')"
          />
        </el-form-item>
        <el-form-item :label="$t('Path')" prop="path">
          <el-input
            v-model="formData.path"
            :placeholder="$t('Please_Enter') + $t('Path')"
          />
        </el-form-item>
        <el-form-item :label="$t('Rpc_Namespace')" prop="server_namespace">
          <el-input
            v-model="formData.server_namespace"
            :placeholder="$t('Please_Enter') + $t('Rpc_Namespace')"
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
      v-model="cmdDialog.Visible"
      :title="cmdDialog.title"
      width="600px"
    >
      <pre><code>{{ cmdDialog.info }}</code></pre>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { DeviceEnum } from "@/enums/DeviceEnum";
import { t} from "@/utils/i18n";

import ServerConfigAPI, {
  ServerConfigInfo,
  ServerConfigInfoListVO,
  ServerConfigPageQuery,
  ServerConfigInfoList,
} from "@/api/system/serverconfig.api";

defineOptions({
  name: "SysServerConfig",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<ServerConfigPageQuery>({
  page: 1,
  pageSize: 15,
});
const selectable = (row: ServerConfigInfo) => ![1].includes(Number(row.id));
const pageData = ref<ServerConfigInfoList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("ServerConfig"),
});

const cmdDialog = reactive({
  Visible: false,
  title: t("Command_Info"),
  info: "",
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

let formData = reactive<ServerConfigInfo>({
  id: "",
  name: "",
  ip: "",
  server_port: "",
  server_namespace: "",
  server_model: "",
  server_number: "",
  path: "",
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
  server_model: [
    {
      required: true,
      message: t("Not_Empty"),
      trigger: "blur",
    },
  ],
});

// 选中的配置ID
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
      ServerConfigAPI.update(row)
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
      if (field === "status") {
        row.status = row.status === 1 ? 2 : 1;
      }
      // Revert the UI change if user cancels
      ElMessage.info(t("Operate_Cancel"));
    });
}

/**
 * 发送指令
 * @param row
 * @param value
 */
function handleSendCommand(
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
      let cmd_data = {
        ip: row.ip,
        port: row.server_port,
        sys_server: value,
        path: row.path,
      };
      // Call API to persist the change
      ServerConfigAPI.update(cmd_data)
        .then((res) => {
          //Updating 94d96f1..f60e782\nFast-forward\n app/manage/controller/v1/SysServerConfigController.php | 6 +++---\n 1 file changed, 3 insertions(+), 3 deletions(-)\n
          //怎么展示好看一点
          cmdDialog.info = String(res);
          cmdDialog.Visible = true;
          handleQuery();
          // console.log(res);
        })
        .catch(() => {
          // Revert the change if API call fails
          ElMessage.error(t("Operate_Failed"));
        });
    })
    .catch(() => {
      ElMessage.info(t("Operate_Cancel"));
    });
}
// 查询
async function handleQuery() {
  loading.value = true;
  let queryParamsData = {
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    name__server_model: ["like", queryParams.keywords],
    status: queryParams.status,
  };
  ServerConfigAPI.getPage(queryParamsData)
    .then((data: ServerConfigInfoListVO) => {
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
 * @param id 配置ID
 */
async function handleOpenDialog(user?: ServerConfigInfo) {
  dialog.visible = true;
  if (user?.id) {
    dialog.title = t("Edit") + t("ServerConfig");
    //复制 user 给formData.value
    Object.assign(formData, user);
  } else {
    dialog.title = t("Add") + t("ServerConfig");
  }
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = "";
  formData.name = "";
  formData.ip = "";
  formData.server_port = "";
  formData.server_namespace = "";
  formData.server_model = "";
  formData.path = "";
  formData.server_number = "";
  formData.status = 1;
  formData.status = 1;
}

// 提交配置表单（防抖）
const handleSubmit = useDebounceFn(() => {
  dataFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;
      if (userId) {
        ServerConfigAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        ServerConfigAPI.create(formData)
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
      ServerConfigAPI.deleteByIds({ id: userIds })
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
