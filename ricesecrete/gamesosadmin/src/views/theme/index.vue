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
            <el-form-item :label="$t('Language')" prop="lang">
              <el-select
                v-model="queryParams.lang"
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
                v-hasPerm="['themeUpdate']"
                type="success"
                icon="plus"
                @click="handleOpenDialog(0)"
              >
                {{ $t("Add") }}
              </el-button>
              <el-button
                v-hasPerm="'themeDelete'"
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
            <el-table-column :label="$t('Title')" align="center" prop="title" />
            <el-table-column :label="$t('Menu_Type')" align="center">
              <template #default="scope">
                <div>
                  {{ $t("Type") }}:
                  {{ scope.row.type }}
                </div>
                <div>
                  {{ $t("Language") }}:
                  {{ scope.row.lang }}
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="icon" :label="$t('Icon')" width="80">
              <template #default="{ row }">
                <el-image
                  :src="row.icon"
                  :preview-src-list="[row.icon]"
                  fit="cover"
                  :preview-teleported="true"
                  lazy
                  style="width: 40px; height: 40px; border-radius: 4px"
                  :hide-on-click-modal="true"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </template>
            </el-table-column>

            <el-table-column
              prop="icon_active"
              :label="$t('Icon_Active')"
              width="80"
            >
              <template #default="{ row }">
                <el-image
                  :src="row.icon_active"
                  :preview-src-list="[row.icon_active]"
                  fit="cover"
                  lazy
                  style="width: 40px; height: 40px; border-radius: 4px"
                  :hide-on-click-modal="true"
                  :preview-teleported="true"
                >
                  <template #error>
                    <div class="image-slot">
                      <el-icon><Picture /></el-icon>
                    </div>
                  </template>
                </el-image>
              </template>
            </el-table-column>
            <el-table-column prop="url" :label="$t('Url_Info')" width="150">
              <template #default="scope">
                <div>
                  {{ $t("Url") }}:
                  {{ scope.row.url }}
                </div>
                <div>
                  {{ $t("Parameters") }}:
                  {{ scope.row.param }}
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Content')" align="center" width="650">
              <template #default="scope">
                <MenuEdit
                  v-model="scope.row.content"
                  :is-edit="false"
                ></MenuEdit>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Sort')"
              align="center"
              prop="sort"
            ></el-table-column>
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
                  v-hasPerm="'themeUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row.id, scope.row)"
                >
                  {{ $t("Edit") }}
                </el-button>
                <el-button
                  v-hasPerm="'themeDelete'"
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
        <el-form-item :label="$t('Title')" prop="title">
          <el-input
            v-model="formData.title"
            :placeholder="$t('Please_Enter') + $t('Title')"
          />
        </el-form-item>
        <el-form-item :label="$t('Menu_Type')" prop="type">
          <el-input
            v-model="formData.type"
            :placeholder="$t('Please_Enter') + $t('Title')"
          />
        </el-form-item>

        <el-form-item :label="$t('Icon_Type')" prop="icon_type">
          <el-select v-model="formData.icon_type">
            <el-option :label="$t('Image')" value="image" />
            <el-option :label="$t('Video')" value="video" />
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('Icon')" prop="icon">
          <div v-if="formData.icon_type === 'video'">
            <SingleVideoUpload
              v-model="formData.icon"
              :style="{ width: '80px', height: '80px' }"
            />
          </div>
          <div v-else>
            <SingleImageUpload
              v-model="formData.icon"
              :style="{ width: '80px', height: '80px' }"
            />
          </div>
        </el-form-item>

        <el-form-item :label="$t('Icon_Active')" prop="icon_active">
          <div v-if="formData.icon_type === 'video'">
            <SingleVideoUpload
              v-model="formData.icon_active"
              :style="{ width: '80px', height: '80px' }"
            />
          </div>
          <div v-else>
            <SingleImageUpload
              v-model="formData.icon_active"
              :style="{ width: '80px', height: '80px' }"
            />
          </div>
        </el-form-item>

        <el-form-item :label="$t('Url')" prop="url">
          <el-input v-model="formData.url" />
        </el-form-item>

        <el-form-item :label="$t('Parameters')" prop="param">
          <el-input v-model="formData.param" />
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
        <el-form-item :label="$t('Theme_Menu')" prop="content">
          <MenuEdit v-model="formData.content" :is-edit="true"></MenuEdit>
        </el-form-item>
        <el-form-item :label="$t('Sort')" prop="sort">
          <el-input-number
            v-model="formData.sort"
            :placeholder="$t('Please_Enter') + $t('Sort')"
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
import MenuEdit from "@/components/Menu/menu.vue";
import { t} from "@/utils/i18n";

import ThemeAPI, {
  ThemeInfo,
  ThemeInfoList,
  ThemeInfoListVO,
  ThemePageQuery,
} from "@/api/system/theme.api";
import SingleImageUpload from "@/components/Upload/SingleImageUpload.vue";
import SingleVideoUpload from "@/components/Upload/SingleVideoUpload.vue";
import MenuAPI from "@/api/menu";

defineOptions({
  name: "SysTheme",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

// Define the category type
interface Category {
  name: string;
  value: string;
}
// Reactive data
const langList = ref<Category[]>([]);

const queryParams = reactive<ThemePageQuery>({
  page: 1,
  pageSize: 15,
  field: "sort",
  order: "desc",
});
const selectable = (row: ThemeInfo) => ![1].includes(Number(row.id));
const pageData = ref<ThemeInfoList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("Theme"),
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

let formData = reactive<ThemeInfo>({
  id: 0,
  /** 名称 */
  title: "",
  /** 父级ID */
  pid: 0,
  /** 类型 */
  type: "",
  icon: "",
  icon_active: "",
  url: "",
  param: "",
  /** 值 */
  status: 1,
  /** 内容 */
  content: "",
  /** 语言 */
  lang: "",
  /** 排序 */
  sort: 0,
  icon_type: "image",
});

const rules = reactive({
  title: [
    {
      required: true,
      message: t("Title") + t("Not_Empty"),
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
      ThemeAPI.update(row)
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

const fetchlangList = async () => {
  try {
    const result = await MenuAPI.getLangList();
    langList.value = result || [];
  } catch (error) {}
};

// 查询
async function handleQuery() {
  loading.value = true;
  let queryParamsData = {
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    title__type: ["like", queryParams.keywords],
    lang: queryParams.lang,
    field: queryParams.field,
    order: queryParams.order,
  };
  ThemeAPI.getPage(queryParamsData)
    .then((data: ThemeInfoListVO) => {
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
  queryParams.lang = "";
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
async function handleOpenDialog(parentId: number, data?: ThemeInfo) {
  dialog.visible = true;
  if (data?.id) {
    dialog.title = t("Edit") + t("Theme");

    //复制 user 给formData.value
    Object.assign(formData, data);
  } else {
    formData.pid = parentId;
    dialog.title = t("Add") + t("Theme");
  }
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = 0;
  formData.type = "";
  formData.icon = "";
  formData.icon_active = "";
  formData.url = "";
  formData.param = "";
  formData.pid = 0;
  formData.lang = "";
  formData.content = "";
  formData.title = "";
  formData.status = 1;
  formData.sort = 0;
  formData.icon_type = "image";
}

// 提交配置表单（防抖）
const handleSubmit = useDebounceFn(() => {
  dataFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;
      if (userId) {
        ThemeAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        ThemeAPI.create(formData)
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
      ThemeAPI.deleteByIds({ id: userIds })
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
  fetchlangList();
  handleQuery();
});
</script>
