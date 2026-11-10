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
            v-hasPerm="['auth_roleInsert']"
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
        <el-table-column :label="$t('Name')" min-width="200">
          <template #default="scope">
            <template
              v-if="scope.row.icon && scope.row.icon.startsWith('el-icon')"
            >
              <el-icon style="vertical-align: -0.15em">
                <component :is="scope.row.icon.replace('el-icon-', '')" />
              </el-icon>
            </template>
            <template v-else-if="scope.row.icon">
              <div :class="`i-svg:${scope.row.icon}`" />
            </template>
            {{ scope.row.title }}
          </template>
        </el-table-column>

        <el-table-column
          :label="$t('Menu') + $t('Type')"
          align="center"
          width="150"
        >
          <template #default="scope">
            <!-- 0目录，1菜单，2页面，3按钮元素，4接口 -->
            <el-tag v-if="scope.row.type === 0" type="warning">
              {{ $t("Directory") }}
            </el-tag>
            <el-tag v-if="scope.row.type === 1" type="success">
              {{ $t("Menu") }}
            </el-tag>
            <el-tag v-if="scope.row.type === 2" type="primary">
              {{ $t("Page") }}
            </el-tag>
            <el-tag v-if="scope.row.type === 3" type="danger">
              {{ $t("Button") }}
            </el-tag>
            <el-tag v-if="scope.row.type === 4" type="info">
              {{ $t("Api") }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('Request') + $t('Type')"
          align="center"
          width="150"
        >
          <template #default="scope">
            <!-- 0无，1get，2post，3delete，4put -->
            <el-tag v-if="scope.row.api_method === 0" type="warning">
              {{ $t("None") }}
            </el-tag>
            <el-tag v-if="scope.row.api_method === 1" type="success">
              GET
            </el-tag>
            <el-tag v-if="scope.row.api_method === 2" type="primary">
              POST
            </el-tag>
            <el-tag v-if="scope.row.api_method === 3" type="danger">
              DELETE
            </el-tag>
            <el-tag v-if="scope.row.api_method === 4" type="info">PUT</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          :label="$t('Request') + $t('Name')"
          align="left"
          width="150"
          prop="name"
        />
        <el-table-column
          :label="$t('Router') + $t('Path')"
          align="left"
          width="150"
          prop="url"
        />
        <el-table-column
          :label="$t('Parameter') + $t('Path')"
          align="left"
          width="150"
          prop="url_param"
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
              v-hasPerm="['auth_roleInsert']"
              type="primary"
              link
              size="small"
              icon="plus"
              @click.stop="handleOpenDialog(scope.row.id)"
            >
              {{ $t("Add") }}
            </el-button>

            <el-button
              v-hasPerm="['auth_roleUpdate']"
              type="primary"
              link
              size="small"
              icon="edit"
              @click.stop="handleOpenDialog(undefined, scope.row)"
            >
              {{ $t("Edit") }}
            </el-button>
            <el-button
              v-hasPerm="['auth_ruleDelete']"
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
        <el-form-item :label="$t('Parent') + $t('Menu')" prop="pid">
          <el-tree-select
            v-model="formData.pid"
            :placeholder="$t('Parent') + $t('Menu')"
            :data="menuOptions"
            filterable
            check-strictly
            :render-after-expand="false"
          />
        </el-form-item>
        <el-form-item :label="$t('Menu') + $t('Title')" prop="title">
          <el-input
            v-model="formData.title"
            :placeholder="$t('Please_Enter') + $t('Menu') + $t('Title')"
          />
        </el-form-item>
        <el-form-item :label="$t('Menu') + $t('Name')" prop="name">
          <el-input
            v-model="formData.name"
            :placeholder="$t('Please_Enter') + $t('Menu') + $t('Name')"
          />
        </el-form-item>

        <el-form-item :label="$t('Menu') + $t('Type')" prop="type">
          <el-radio-group
            v-model="formData.type"
            @change="handleMenuTypeChange"
          >
            <!--  菜单类型，0目录，1菜单，2页面，3按钮元素，4接口 -->
            <el-radio :value="0">{{ $t("Directory") }}</el-radio>
            <el-radio :value="1">{{ $t("Menu") }}</el-radio>
            <el-radio :value="2">{{ $t("Page") }}</el-radio>
            <el-radio :value="3">{{ $t("Api") }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('Request') + $t('Type')" prop="api_method">
          <el-radio-group v-model="formData.api_method">
            <!--  接口类型，0无，1get，2post，3delete，4put -->
            <el-radio :value="0">{{ $t("None") }}</el-radio>
            <el-radio :value="1">GET</el-radio>
            <el-radio :value="2">POST</el-radio>
            <!-- <el-radio :value="3">DELETE</el-radio>
            <el-radio :value="4">PUT</el-radio> -->
          </el-radio-group>
        </el-form-item>
        <el-form-item :label="$t('Icon')" prop="icon">
          <!-- 图标选择器 -->
          <icon-select
            v-model="formData.icon"
            :placeholder="$t('IconSelectPlaceholder')"
            :search-placeholder="$t('IconSelectPsearchPlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="$t('Router') + 'url'" prop="url">
          <el-input
            v-model="formData.url"
            :placeholder="$t('Please_Enter') + $t('Router') + 'url'"
          />
        </el-form-item>
        <el-form-item
          :label="$t('Router') + 'url' + $t('Parameter')"
          prop="url_param"
        >
          <el-input
            v-model="formData.url_param"
            :placeholder="
              $t('Please_Enter') + $t('Router') + 'url' + $t('Parameter')
            "
          />
        </el-form-item>
        <el-form-item prop="status" :label="$t('Status')">
          <el-radio-group v-model="formData.status">
            <el-radio :value="1">{{ $t("Normal") }}</el-radio>
            <el-radio :value="2">{{ $t("Disable") }}</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item :label="$t('Sort')" prop="sort">
          <el-input-number
            v-model="formData.sort"
            style="width: 100px"
            controls-position="right"
            :min="0"
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

import RuleAPI, { RulePageQuery, RuleInfo } from "@/api/auth/rule.api";

defineOptions({
  name: "AuthRule",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const menuFormRef = ref();

const loading = ref(false);
const dialog = reactive({
  title: t("Add") + t("Menu"),
  visible: false,
});

const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);
// 查询参数
const queryParams = reactive<RulePageQuery>({});
// 菜单表格数据
const menuTableData = ref<RuleInfo[]>([]);
// 顶级菜单下拉选项
const menuOptions = ref<OptionType[]>([]);
// 初始菜单表单数据
const initialMenuFormData = ref<RuleInfo>({
  /** 菜单ID */
  id: "",
  /** 菜单名称 */
  title: "",
  /** 菜单唯一标识 */
  name: "",
  /** 菜单URL */
  url: "",
  /** 路由参数 */
  url_param: "",
  /** 图标 */
  icon: "",
  /** 菜单类型，0目录，1菜单，2页面，3按钮元素，4接口 */
  type: 0,
  /** 接口类型，0无，1get，2post，3delete，4put */
  api_method: 1,
  /** 排序，数值越大权重越高 */
  sort: 0,
  /** 父级ID */
  pid: "",
  /** 菜单状态：2禁用，1正常 */
  status: 1,
});
// 菜单表单数据
const formData = ref({ ...initialMenuFormData.value });
// 表单验证规则
const rules = reactive({
  title: [
    {
      required: true,
      message:
        t("Please_Enter") +
        t("Menu") +
        t("Title"),
      trigger: "blur",
    },
  ],
  parent_id: [
    {
      required: true,
      message:
        t("Please_Enter") +
        t("Parent") +
        t("Menu"),
      trigger: "blur",
    },
  ],
  name: [
    {
      required: true,
      message:
        t("Please_Enter") +
        t("Menu") +
        t("Name"),
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message:
        t("Please_Enter") +
        t("Menu") +
        t("Type"),
      trigger: "blur",
    },
  ],
});

// 选择表格的行菜单ID
const selectedMenuId = ref<string | undefined>();

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
      RuleAPI.update(row)
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
  RuleAPI.getPage({
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
  RuleAPI.getPage({
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
function handleRowClick(row: RuleInfo) {
  selectedMenuId.value = row.id;
}

/**
 * 打开表单弹窗
 *
 * @param parentId 父菜单ID
 * @param menuId 菜单ID
 */
function handleOpenDialog(parentId?: string, data?: RuleInfo) {
  dialog.visible = true;
  if (data?.id) {
    dialog.title = t("Edit") + t("Menu");
    //复制 data 给formData.value
    Object.assign(formData.value, data);
  } else {
    dialog.title = t("Add") + t("Menu");
    Object.assign(formData.value, initialMenuFormData.value);
    formData.value.pid = parentId ?? "0";
  }
}

// 菜单类型切换
function handleMenuTypeChange() {
  // 如果菜单类型改变
  if (formData.value.type !== initialMenuFormData.value.type) {
    // 目录切换到菜单时，清空组件路径
    if (initialMenuFormData.value.type === 0) {
      formData.value.url = "";
    } else {
      // 其他情况，保留原有的组件路径
      formData.value.url = initialMenuFormData.value.url;
      formData.value.url_param = initialMenuFormData.value.url_param;
    }
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
          ElMessage.error(t("Operate_Menu_Error"));
          return;
        }
        RuleAPI.update(formData.value).then(() => {
          ElMessage.success(t("Operate_Success"));
          handleCloseDialog();
          handleQuery();
        });
      } else {
        RuleAPI.create(formData.value).then(() => {
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
      RuleAPI.deleteByIds({ id: menuIds })
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
  // formData.value = {
  //   /** 菜单ID */
  //   id: "",
  //   /** 菜单名称 */
  //   title: "",
  //   /** 菜单唯一标识 */
  //   name: "",
  //   /** 菜单URL */
  //   url: "",
  //   /** 路由参数 */
  //   url_param: "",
  //   /** 图标 */
  //   icon: "",
  //   /** 菜单类型，0目录，1菜单，2页面，3按钮元素，4接口 */
  //   type: 0,
  //   /** 接口类型，0无，1get，2post，3delete，4put */
  //   api_method: 1,
  //   /** 排序，数值越大权重越高 */
  //   sort: 0,
  //   /** 父级ID */
  //   pid: "",
  //   /** 菜单状态：2禁用，1正常 */
  //   status: 1,
  // };
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
