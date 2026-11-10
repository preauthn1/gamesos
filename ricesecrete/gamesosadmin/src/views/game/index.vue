<!-- 管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="24">
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
            <el-form-item :label="$t('Game_Platform')" prop="platform_id">
              <el-select
                v-model="queryParams.platform_id"
                :placeholder="$t('Please_Select')"
                clearable
                filterable
              >
                <el-option
                  v-for="tempdata in platformList"
                  :key="tempdata.id"
                  :label="tempdata.name"
                  :value="tempdata.id || 0"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Game_Type')" prop="type_id">
              <el-select
                v-model="queryParams.type_id"
                :placeholder="$t('Please_Select')"
                clearable
                filterable
              >
                <el-option
                  v-for="langdata in typeList"
                  :key="langdata.id"
                  :label="langdata.name"
                  :value="langdata.id || 0"
                />
              </el-select>
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
                  :label="$t(status.label)"
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
                v-hasPerm="['bannerInsert']"
                type="success"
                icon="plus"
                @click="handleOpenDialog()"
              >
                {{ $t("Add") }}
              </el-button>
              <el-button
                v-hasPerm="'bannerDelete'"
                type="danger"
                icon="delete"
                :disabled="selectIds.length === 0"
                @click="handleDelete()"
              >
                {{ $t("Delete") }}
              </el-button>
              <el-button
                v-hasPerm="['bannerUpdate']"
                type="success"
                @click="handleStatusChangeAll(1, 'status')"
              >
                {{ $t("Enable") }}
              </el-button>
              <el-button
                v-hasPerm="['bannerUpdate']"
                type="danger"
                @click="handleStatusChangeAll(2, 'status')"
              >
                {{ $t("Disable") }}
              </el-button>
              <el-button
                v-hasPerm="['bannerUpdate']"
                type="warning"
                @click="handleStatusChangeAll(3, 'status')"
              >
                {{ $t("Maintain") }}
              </el-button>
              <el-button
                v-hasPerm="'userExport'"
                icon="download"
                @click="handleExport(1000)"
              >
                {{ $t("Export") }}
              </el-button>
              <ButtonUpload :accept="'.csv'" @success="handleUpload" />
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
            <el-table-column :label="$t('Name')" align="center" prop="name" />
            <el-table-column :label="$t('Icon')" align="center" prop="icon">
              <template #default="scope">
                <el-image
                  :src="scope.row.icon"
                  :preview-src-list="[scope.row.icon]"
                  style="width: 80px"
                  lazy
                  :hide-on-click-modal="true"
                  :preview-teleported="true"
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Game_Code')"
              align="center"
              prop="code"
            />
            <el-table-column
              :label="$t('Game_Tag')"
              align="center"
              prop="tag"
            />
            <el-table-column
              :label="$t('Game_Type')"
              align="center"
              prop="type_id"
            >
              <template #default="scope">
                <el-tag>
                  {{ getTypeString(scope.row.type_id) }}
                </el-tag>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('Game_Platform')"
              align="center"
              prop="platform_id"
            >
              <template #default="scope">
                <el-tag>
                  {{ getPlatformString(scope.row.platform_id) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Game_Hot')" align="center" prop="hot">
              <template #default="scope">
                <el-switch
                  v-model="scope.row.hot"
                  :active-value="1"
                  :inactive-value="2"
                  inline-prompt
                  :active-text="$t('Normal')"
                  :inactive-text="$t('Disable')"
                  @change="(val) => handleStatusChange(scope.row, val, 'hot')"
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Game_Recommend')"
              align="center"
              prop="recommend"
            >
              <template #default="scope">
                <el-switch
                  v-model="scope.row.recommend"
                  :active-value="1"
                  :inactive-value="2"
                  inline-prompt
                  :active-text="$t('Normal')"
                  :inactive-text="$t('Disable')"
                  @change="
                    (val) => handleStatusChange(scope.row, val, 'recommend')
                  "
                />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Game_Lock')"
              align="center"
              prop="lock"
            >
              <template #default="scope">
                <el-switch
                  v-model="scope.row.lock"
                  :active-value="1"
                  :inactive-value="2"
                  inline-prompt
                  :active-text="$t('Normal')"
                  :inactive-text="$t('Disable')"
                  @change="(val) => handleStatusChange(scope.row, val, 'lock')"
                />
              </template>
            </el-table-column>
            <el-table-column :label="$t('Status')" align="center" prop="status">
              <template #default="scope">
                <el-tag
                  v-if="scope.row.status === 1"
                  type="success"
                  effect="dark"
                >
                  {{ $t("Enable") }}
                </el-tag>
                <el-tag
                  v-if="scope.row.status === 2"
                  type="danger"
                  effect="dark"
                >
                  {{ $t("Disable") }}
                </el-tag>
                <el-tag
                  v-if="scope.row.status === 3"
                  type="warning"
                  effect="dark"
                >
                  {{ $t("Maintain") }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Remark')"
              align="center"
              prop="remark"
            />
            <el-table-column :label="$t('Sort')" align="center" prop="sort" />

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
                  v-hasPerm="'bannerUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("Edit") }}
                </el-button>
                <el-button
                  v-hasPerm="'bannerDelete'"
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
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('Game_Platform')" prop="platform_id">
              <el-select
                v-model="formData.platform_id"
                :placeholder="$t('Please_Select')"
                clearable
                filterable
              >
                <el-option
                  v-for="tempdata in platformList"
                  :key="tempdata.id"
                  :label="tempdata.name"
                  :value="tempdata.id || 0"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Game_Type')" prop="type_id">
              <el-select
                v-model="formData.type_id"
                :placeholder="$t('Please_Select')"
                clearable
                filterable
              >
                <el-option
                  v-for="langdata in typeList"
                  :key="langdata.id"
                  :label="langdata.name"
                  :value="langdata.id || 0"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="$t('Game_Name')" prop="name">
              <el-input
                v-model="formData.name"
                :placeholder="$t('Please_Enter') + $t('Game_Name')"
              />
            </el-form-item>
            <el-form-item :label="$t('Game_Code')" prop="code">
              <el-input
                v-model="formData.code"
                :placeholder="$t('Please_Enter') + $t('Game_Code')"
              />
            </el-form-item>
            <el-form-item :label="$t('Game_Tag')" prop="tag">
              <el-input
                v-model="formData.tag"
                :placeholder="$t('Please_Enter') + $t('Game_Tag')"
              />
            </el-form-item>
            <el-form-item :label="$t('Game_Remark')" prop="remark">
              <el-input
                v-model="formData.remark"
                :placeholder="$t('Please_Enter') + $t('Game_Remark')"
              />
            </el-form-item>
            <el-form-item :label="$t('Sort')" prop="sort">
              <el-input
                v-model="formData.sort"
                :placeholder="$t('Please_Enter') + $t('Sort')"
              />
            </el-form-item>
            <el-form-item :label="$t('Game_Hot')" prop="hot">
              <el-switch
                v-model="formData.hot"
                inline-prompt
                :active-text="$t('Normal')"
                :inactive-text="$t('Disable')"
                :active-value="1"
                :inactive-value="2"
              />
            </el-form-item>
            <el-form-item :label="$t('Game_Recommend')" prop="recommend">
              <el-switch
                v-model="formData.recommend"
                inline-prompt
                :active-text="$t('Normal')"
                :inactive-text="$t('Disable')"
                :active-value="1"
                :inactive-value="2"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Game_Icon')" prop="icon">
              <SingleImageUpload
                v-model="formData.icon"
                :folder="'game_icon'"
                :filename="formData.name + formData.code + formData.tag"
                :style="{ width: '100px', height: '100px' }"
              />
            </el-form-item>
            <el-form-item :label="$t('Game_Image')" prop="image">
              <SingleImageUpload
                v-model="formData.image"
                :folder="'game_image'"
                :style="{ width: '100px', height: '100px' }"
              />
            </el-form-item>

            <el-form-item :label="$t('Game_Lock')" prop="lock">
              <el-switch
                v-model="formData.lock"
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
          </el-col>
        </el-row>
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
import ButtonUpload from "@/components/Upload/ButtonUpload.vue";
import { t} from "@/utils/i18n";
import GameAPI, {
  GameInfo,
  GameListVO,
  GamePageQuery,
  GameList,
} from "@/api/game/game.api";
import GamePlatformAPI, {
  GamePlatformInfo,
} from "@/api/game/gameplatform.api";
import GameTypeAPI, { GameTypeInfo } from "@/api/game/gametype.api";
import { FileInfo } from "@/api/file.api";

defineOptions({
  name: "SysGameBet",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<GamePageQuery>({
  page: 1,
  pageSize: 15,
  field: "sort",
  order: "desc",
});
const selectable = (row: GameInfo) => ![1].includes(Number(row.id));
const pageData = ref<GameList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("Game"),
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

// Reactive data
const platformList = ref<GamePlatformInfo[]>([]);
const typeList = ref<GameTypeInfo[]>([]);

const getPlatformString = (id: number) => {
  const platform = platformList.value.find((item) => Number(item.id) === id);
  return platform ? platform.name : "";
};

const getTypeString = (id: number) => {
  const type = typeList.value.find((item) => Number(item.id) === id);
  return type ? type.name : "";
};

const statusOptions = [
  {
    value: 1,
    label: t("Enable"),
  },
  {
    value: 2,
    label: t("Disable"),
  },
  {
    value: 3,
    label: t("Maintain"),
  },
];

let formData = reactive<GameInfo>({
  id: "",
  platform_id: 0,
  type_id: 0,
  code: "",
  tag: "",
  name: "",
  icon: "",
  image: "",
  status: 1,
  sort: 0,
  hot: 2,
  recommend: 2,
  lock: 2,
  remark: "",
  keyword: "",
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
      GameAPI.update(row)
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

/**
 * 改变状态
 * @param row
 * @param value
 */
function handleStatusChangeAll(
  value: number | boolean | string,
  field: string
) {
  const Ids = [selectIds.value].join(",");
  if (!Ids) {
    ElMessage.warning(t("Please_Select_Delete_Item"));
    return;
  }
  ElMessageBox.confirm(
    t("Confirm_Status_Change"),
    t("Warning"),
    {
      confirmButtonText: t("Confirm"),
      cancelButtonText: t("Cancel"),
      type: "warning",
    }
  ).then(
    function () {
      loading.value = true;
      // console.log(Ids);
      GameAPI.updateAll({
        id: Ids,
        field: field,
        value: value,
        update_all: "update_all",
      })
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

const fetchInitList = async () => {
  try {
    GamePlatformAPI.getPage({
      pageSize: 5000,
      field: "sort",
      order: "desc",
    })
      .then((data) => {
        platformList.value = data.list;
      })
      .finally(() => {});
  } catch (error) {}
  try {
    GameTypeAPI.getPage({
      pageSize: 5000,
      field: "sort",
      order: "desc",
    })
      .then((data) => {
        typeList.value = data.list;
      })
      .finally(() => {});
  } catch (error) {}
};
// 查询
async function handleQuery() {
  loading.value = true;
  let queryParamsData = {
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    name__code__tag__keyword: ["like", queryParams.keywords],
    status: queryParams.status,
    type_id: queryParams.type_id,
    platform_id: queryParams.platform_id,
    field: queryParams.field,
    order: queryParams.order,
  };
  GameAPI.getPage(queryParamsData)
    .then((data: GameListVO) => {
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
async function handleOpenDialog(user?: GameInfo) {
  dialog.visible = true;
  if (user?.id) {
    dialog.title = t("Edit") + t("Game");
    //复制 user 给formData.value
    Object.assign(formData, user);
  } else {
    dialog.title = t("Add") + t("Game");
  }
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = "";
  formData.platform_id = 0;
  formData.type_id = 0;
  formData.code = "";
  formData.tag = "";
  formData.name = "";
  formData.icon = "";
  formData.image = "";
  formData.status = 1;
  formData.sort = 0;
  formData.hot = 2;
  formData.recommend = 2;
  formData.lock = 2;
  formData.remark = "";
}

// 提交语言表单（防抖）
const handleSubmit = useDebounceFn(() => {
  dataFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;
      if (userId) {
        GameAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        GameAPI.create(formData)
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
      // console.log(userIds);
      GameAPI.deleteByIds({ id: userIds })
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
    export_name: "游戏列表",
    pageSize: num || 1000,
  };
  GameAPI.export(queryParamsExport).then((response: any) => {
    ElMessage.success(t("Operate_Success"));
  });
}

// 批量导入
function handleInput(file_url: string) {
  GameAPI.createAll({
    file_url: file_url,
    input_all: "input_all",
  })
    .then(() => {
      ElMessage.success(t("Operate_Success"));
      handleResetQuery();
    })
    .finally(() => (loading.value = false));
}

function handleUpload(data: FileInfo) {
  // console.log(data);
  handleInput(data.url);
}

onMounted(() => {
  fetchInitList();
  handleQuery();
});
</script>
