<!-- 条目管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="24">
      <!-- 条目列表 -->
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
            <el-form-item :label="$t('Type')" prop="type">
              <el-select
                v-model="queryParams.type"
                :placeholder="$t('All')"
                clearable
                style="width: 100px"
              >
                <el-option :label="$t('Frontend')" :value="0" />
                <el-option :label="$t('Backend')" :value="1" />
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
                v-hasPerm="['sys_lang_itemInsert']"
                type="success"
                icon="plus"
                @click="handleOpenDialog()"
              >
                {{ $t("Add") }}
              </el-button>
              <el-button
                v-hasPerm="'sys_lang_itemDelete'"
                type="danger"
                icon="delete"
                :disabled="selectIds.length === 0"
                @click="handleDelete()"
              >
                {{ $t("Delete") }}
              </el-button>
              <el-button
                v-hasPerm="['sys_lang_itemUpdate']"
                type="warning"
                icon="refresh"
                @click="handleUpdateLang()"
              >
                {{ $t("Update") }}
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
              :label="$t('Item') + $t('Name')"
              align="center"
              prop="title"
            />
            <el-table-column :label="$t('Type')" align="center" prop="type">
              <template #default="scope">
                <el-tag v-if="scope.row.type === 0">
                  {{ $t("Frontend") }}
                </el-tag>
                <el-tag v-else>
                  {{ $t("Backend") }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              v-for="(item, index) in headData"
              :key="index"
              :label="item.title"
              align="center"
              :prop="'lang_' + item.id"
            />
            <el-table-column
              :label="$t('Operate')"
              fixed="right"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-hasPerm="'sys_lang_itemUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("Edit") }}
                </el-button>
                <el-button
                  v-hasPerm="'sys_lang_itemDelete'"
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
        <el-form-item :label="$t('Item') + $t('Name')" prop="title">
          <el-input
            v-model="formData.title"
            :placeholder="$t('Please_Enter') + $t('Item') + $t('Name')"
          />
        </el-form-item>
        <el-form-item :label="$t('Type')" prop="type">
          <el-select v-model="formData.type" :placeholder="$t('Please_Select')">
            <el-option :label="$t('Frontend')" :value="0" />
            <el-option :label="$t('Backend')" :value="1" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button
            v-hasPerm="['sys_lang_itemUpdate']"
            type="success"
            icon="refresh"
            @click="handleTranslate(formData.title)"
          >
            {{ $t("Translate") }}
          </el-button>
        </el-form-item>
        <el-form-item
          v-for="(item, index) in formDataHead"
          :key="index"
          :label="item.lang_title"
        >
          <el-input
            v-model="item.text"
            :placeholder="$t('Please_Enter') + $t('Content')"
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
import LangItemAPI, {
  LangInfo,
  LangItemUpdate,
  LangItemInfo,
  LangItemListVO,
  LangItemPageQuery,
  LangItemList,
} from "@/api/system/langitem.api";
import AuthAPI from "@/api/auth";

defineOptions({
  name: "SysLangItem",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<LangItemPageQuery>({
  page: 1,
  pageSize: 15,
});
const selectable = (row: LangItemInfo) => ![1].includes(Number(row.id));
const pageData = ref<LangItemList[]>();
const headData = ref<LangInfo[]>([]);
const formDataHead = ref<LangItemUpdate[]>([]);
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("Item"),
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

let formData = reactive<LangItemInfo>({
  id: "",
  title: "",
});

let tempItem = reactive<LangItemUpdate>({
  lang_title: "",
  lang_id: "",
  item_id: "",
  text: "",
});

const rules = reactive({
  title: [
    {
      required: true,
      message: t("Item") + t("Name"),
      trigger: "blur",
    },
  ],
});

// 选中的条目ID
const selectIds = ref<number[]>([]);

// 查询
async function handleQuery() {
  loading.value = true;
  let queryParamsData = {
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    title: ["like", queryParams.keywords],
    type: queryParams.type,
  };
  LangItemAPI.getPage(queryParamsData)
    .then((data: LangItemListVO) => {
      pageData.value = data.list;
      total.value = data.total;
      headData.value = data.head;
      formDataHead.value = [];
      headData.value.forEach((element) => {
        formDataHead.value.push({
          lang_title: element.title,
          lang_id: element.id,
          item_id: "",
          text: "",
        });
      });
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
 * @param id 条目ID
 */
async function handleOpenDialog(data?: any) {
  dialog.visible = true;
  if (data?.id) {
    dialog.title = t("Edit") + t("Item");
    //复制 data 给formData.value
    formDataHead.value.forEach((element) => {
      element.item_id = data.id;
      element.text = "";
      if (data && element.lang_id) {
        const langKey = "lang_" + element.lang_id;
        element.text = data[langKey] || "";
      }
    });
    // console.log(formDataHead.value);
    Object.assign(formData, data);
  } else {
    formDataHead.value.forEach((element) => {
      element.item_id = "";
      element.text = "";
    });
    dialog.title = t("Add") + t("Item");
  }
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = "";
  formData.title = "";
}

/**
 * One-click translate items
 */
function handleTranslate(title: string) {
  console.log(title);
  AuthAPI.translate(title)
    .then((res) => {
      console.log(res);
      formDataHead.value.forEach((element) => {
        element.text = res["lang_" + element.lang_id];
      });
    })
    .catch(() => {
      ElMessage.error(t("Operate_Failed"));
    })
    .finally(() => (loading.value = false));
}

// 提交条目表单（防抖）
const handleSubmit = useDebounceFn(() => {
  dataFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const dataId = formData.id;
      formData.detail = JSON.stringify(formDataHead.value);
      loading.value = true;
      if (dataId) {
        LangItemAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        LangItemAPI.create(formData)
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
 * 删除条目
 *
 * @param id  条目ID
 */
function handleDelete(id?: number) {
  const dataIds = [id || selectIds.value].join(",");
  if (!dataIds) {
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
      LangItemAPI.deleteByIds({ id: dataIds })
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

/*
 * 更新语言
 */
function handleUpdateLang() {
  ElMessageBox.confirm(
    t("Confirm_Update_Item"),
    t("Warning"),
    {
      confirmButtonText: t("Confirm"),
      cancelButtonText: t("Cancel"),
      type: "warning",
    }
  ).then(
    function () {
      loading.value = true;
      LangItemAPI.update({
        is_update: "file",
        title: "",
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

onMounted(() => {
  handleQuery();
});
</script>
