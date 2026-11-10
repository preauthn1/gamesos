<template>
  <div class="app-container">
    <!-- 搜索区域 -->
    <div class="search-container">
      <el-form
        ref="queryFormRef"
        :model="queryParams"
        :inline="true"
        label-width="auto"
      >
        <el-form-item class="search-buttons">
          <el-button icon="refresh" @click="handleResetQuery">
            {{ $t("Reset") }}
          </el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-card shadow="hover" class="data-table">
      <div class="data-table__toolbar">
        <div class="data-table__toolbar--actions">
          <el-button
            v-hasPerm="['game_typeInsert']"
            type="success"
            icon="plus"
            @click="handleOpenDialog('0')"
          >
            {{ $t("Add") }}
          </el-button>
        </div>
      </div>

      <el-table
        ref="dataTableRef"
        v-loading="loading"
        row-key="id"
        :data="menuTableData"
        :tree-props="{
          children: 'children',
          hasChildren: 'hasChildren',
        }"
        class="data-table__content"
        @row-click="handleRowClick"
      >
        <el-table-column label="ID" width="100" prop="id"></el-table-column>
        <el-table-column
          :label="$t('Name')"
          width="100"
          prop="name"
        ></el-table-column>
        <el-table-column :label="$t('Icon')" width="160" align="center">
          <template #default="scope">
            <el-image
              :src="scope.row.icon"
              :preview-src-list="[scope.row.icon]"
              style="width: 50px"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Icon_Active')" width="160" align="center">
          <template #default="scope">
            <el-image
              :src="scope.row.icon_active"
              :preview-src-list="[scope.row.icon_active]"
              style="width: 50px"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column :label="$t('Remark')" width="150" prop="remark" />
        <el-table-column :label="$t('Status')" align="center" prop="status">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              :active-value="1"
              :inactive-value="2"
              inline-prompt
              :active-text="$t('Normal')"
              :inactive-text="$t('Disable')"
              @change="(val) => handleStatusChange(scope.row, val, 'status')"
            />
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('Sort')"
          align="center"
          width="80"
          prop="sort"
        />
        <el-table-column fixed="right" align="center" :label="$t('Operate')">
          <template #default="scope">
            <el-button
              v-if="scope.row.type == 0 || scope.row.type == 1"
              v-hasPerm="['game_typeInsert']"
              type="primary"
              link
              size="small"
              icon="plus"
              @click.stop="handleOpenDialog(scope.row.id)"
            >
              {{ $t("Add") }}
            </el-button>

            <el-button
              v-hasPerm="['game_typeUpdate']"
              type="primary"
              link
              size="small"
              icon="edit"
              @click.stop="handleOpenDialog(undefined, scope.row)"
            >
              {{ $t("Edit") }}
            </el-button>
            <el-button
              v-hasPerm="['game_typeDelete']"
              type="danger"
              link
              size="small"
              icon="delete"
              @click.stop="handleDelete(scope.row.id)"
            >
              {{ $t("Delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="1000"
      :before-close="handleCloseDialog"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form
        ref="menuFormRef"
        :model="formData"
        :rules="rules"
        label-width="100px"
      >
        <el-form-item :label="$t('Parent') + $t('Name')" prop="pid">
          <el-tree-select
            v-model="formData.pid"
            :placeholder="$t('Parent') + $t('Name')"
            :data="menuOptions"
            filterable
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>
        <el-form-item :label="$t('Name')" prop="name">
          <el-input
            v-model="formData.name"
            :placeholder="$t('Please_Enter') + $t('Type') + $t('Name')"
          />
        </el-form-item>

        <el-form-item :label="$t('Icon')" prop="icon">
          <SingleImageUpload
            :style="{ width: '80px' }"
            v-model="formData.icon"
          />
        </el-form-item>
        <el-form-item :label="$t('Icon_Active')" prop="icon_active">
          <SingleImageUpload
            :style="{ width: '80px' }"
            v-model="formData.icon_active"
          />
        </el-form-item>
        <el-form-item :label="$t('Remark')" prop="remark">
          <el-input
            v-model="formData.remark"
            :placeholder="$t('Please_Enter') + $t('Remark')"
          />
        </el-form-item>
        <el-form-item :label="$t('Sort')" prop="sort">
          <el-input v-model="formData.sort" />
        </el-form-item>
        <el-form-item prop="status" :label="$t('Status')">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">{{ $t("Normal") }}</el-radio>
            <el-radio :value="2">{{ $t("Disable") }}</el-radio>
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
import { t} from "@/utils/i18n";
import SingleImageUpload from "@/components/Upload/SingleImageUpload.vue";
import GameTypeAPI, {
  GameTypePageQuery,
  GameTypeInfo,
} from "@/api/game/gametype.api";

defineOptions({
  name: "GameType",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const menuFormRef = ref();

const loading = ref(false);
const dialog = reactive({
  title: t("Add") + t("Game_Type"),
  visible: false,
});

const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);
// 查询参数
const queryParams = reactive<GameTypePageQuery>({});
// 菜单表格数据
const menuTableData = ref<GameTypeInfo[]>([]);
// 顶级菜单下拉选项
const menuOptions = ref<OptionType[]>([]);
// 初始菜单表单数据
const initialTypeFormData = ref<GameTypeInfo>({
  /** 菜单ID */
  id: "",
  pid: "",
  type: 0,
  name: "",
  icon: "",
  icon_active: "",
  status: 1,
  sort: 0,
  remark: "",
});
// 菜单表单数据
const formData = ref({ ...initialTypeFormData.value });
// 表单验证规则
const rules = reactive({
  name: [
    {
      required: true,
      message: t("Please_Enter") + t("Name"),
      trigger: "blur",
    },
  ],
});

// 选择表格的行菜单ID
const selectedTypeId = ref<string | undefined>();

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
      GameTypeAPI.update(row)
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

//获取分类列表
const fetchCategories = async () => {
  GameTypeAPI.getPage({
    format: "table_tree",
    pageSize: 5000,
    field: "sort",
    order: "desc",
  })
    .then((data) => {
      menuOptions.value = data.options;
    })
    .finally(() => {
      loading.value = false;
    });
};

// 查询菜单
function handleQuery() {
  loading.value = true;
  GameTypeAPI.getPage({
    format: "tree",
    pageSize: 5000,
    field: "sort",
    order: "desc",
  })
    .then((data) => {
      menuTableData.value = data.list;
      fetchCategories();
    })
    .finally(() => {
      loading.value = false;
    });
}

// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.pageSize = 5000;
  queryParams.keywords = "";
  handleQuery();
}

// 行点击事件
function handleRowClick(row: GameTypeInfo) {
  selectedTypeId.value = row.id;
}

/**
 * 打开表单弹窗
 *
 * @param parentId 父菜单ID
 * @param menuId 菜单ID
 */
function handleOpenDialog(parentId?: string, data?: GameTypeInfo) {
  dialog.visible = true;
  if (data?.id) {
    dialog.title = t("Edit") + t("Game_Type");
    //复制 data 给formData.value
    Object.assign(formData.value, data);
  } else {
    dialog.title = t("Add") + t("Game_Type");
    Object.assign(formData.value, initialTypeFormData.value);
    formData.value.pid = parentId ?? "0";
  }
}
/**
 * 提交表单
 */
function handleSubmit() {
  menuFormRef.value.validate((isValid: boolean) => {
    if (isValid) {
      const menuId = formData.value.id;
      if (menuId) {
        //修改时父级菜单不能为当前菜单
        if (formData.value.pid == menuId) {
          ElMessage.error(t("Operate_Type_Error"));
          return;
        }
        GameTypeAPI.update(formData.value).then(() => {
          ElMessage.success(t("Operate_Success"));
          handleCloseDialog();
          handleQuery();
        });
      } else {
        GameTypeAPI.create(formData.value).then(() => {
          ElMessage.success(t("Operate_Success"));
          handleCloseDialog();
          handleQuery();
        });
      }
    }
  });
}

// 删除菜单
function handleDelete(menuId: string) {
  const menuIds = [menuId].join(",");
  if (!menuIds) {
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
    () => {
      loading.value = true;
      GameTypeAPI.deleteByIds({ id: menuIds })
        .then(() => {
          ElMessage.success(t("Operate_Success"));
          handleQuery();
        })
        .finally(() => {
          loading.value = false;
        });
    },
    () => {
      ElMessage.info(t("Operate_Cancel"));
    }
  );
}

function resetForm() {
  menuFormRef.value.resetFields();
  menuFormRef.value.clearValidate();
  formData.value.id = "";
  formData.value.name = "";
  formData.value.status = 1;
  formData.value.sort = 0;
  formData.value.remark = "";
  formData.value.icon = "";
  formData.value.icon_active = "";
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  resetForm();
}

onMounted(() => {
  handleQuery();
});
</script>
