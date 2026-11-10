<template>
  <div class="app-container">
    <!-- 搜索表单 -->
    <BaseSearchForm
      v-model="searchParams"
      :items="searchItems"
      :loading="tableState.loading"
      @search="handleSearch"
      @reset="handleResetSearch"
    >
      <template #extra-buttons>
        <el-button
          v-hasPerm="['activity_categoryExport']"
          icon="download"
          @click="handleExport"
        >
          {{ $t($t('Export')) }}
        </el-button>
      </template>
    </BaseSearchForm>

    <!-- 数据表格 -->
    <BaseDataTable
      ref="tableRef"
      :data="tableState.data"
      :columns="tableColumns"
      :loading="tableState.loading"
      :show-selection="true"
      :show-index="true"
      :show-action-column="true"
      :show-pagination="true"
      :page="tableState.page"
      :page-size="tableState.pageSize"
      :total="tableState.total"
      :page-sizes="tableState.pageSizes"
      @selection-change="handleSelectionChange"
      @refresh="handleRefresh"
      @size-change="handleSizeChange"
      @current-page-change="handlePageChange"
    >
      <!-- 工具栏左侧 -->
      <template #toolbar-left>
        <el-button
          v-hasPerm="['activity_categoryInsert']"
          type="success"
          icon="plus"
          @click="handleOpenDialog()"
        >
          {{ $t($t('Add')) }}
        </el-button>
        <el-button
          v-hasPerm="['activity_categoryDelete']"
          type="danger"
          icon="delete"
          :disabled="!tableState.hasSelection"
          @click="handleDelete()"
        >
          {{ $t($t('Delete')) }}
        </el-button>
      </template>

      <!-- 分类图标列 -->
      <template #icon="{ row }">
        <el-icon :size="20">
          <component :is="row.icon" />
        </el-icon>
      </template>

      <!-- 状态列 -->
      <template #status="{ row }">
        <ActivityStatusBadge :status="row.status" />
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <el-button
          v-hasPerm="['activity_categoryUpdate']"
          type="primary"
          size="small"
          icon="edit"
          @click="handleOpenDialog(row)"
        >
          {{ $t($t('Edit')) }}
        </el-button>
        <el-button
          v-hasPerm="['activity_categoryDelete']"
          type="danger"
          size="small"
          icon="delete"
          @click="handleDelete(row.id)"
        >
          {{ $t($t('Delete')) }}
        </el-button>
      </template>
    </BaseDataTable>

    <!-- 添加/编辑对话框 -->
    <BaseDialogForm
      v-model:visible="dialogVisible"
      v-model:form-data="formData"
      :form-rules="formRules"
      :operation="dialogOperation"
      :title="$t('activity.category.management')"
      :submit-loading="formState.loading"
      :show-cancel-button="true"
      :show-submit-button="true"
      @submit="handleSubmit"
      @cancel="handleCancel"
    >
      <template #form-content="{ formData }">
        <el-form-item :label="$t('Activity_Category_Name')" prop="name">
          <el-input
            v-model="formData.name"
            :placeholder="$t('Please_Enter') + ' ' + $t('Activity_Category_Name')"
            maxlength="50"
            show-word-limit
          />
        </el-form-item>

        <el-form-item :label="$t('Activity_Category_Icon')" prop="icon">
          <el-select
            v-model="formData.icon"
            :placeholder="$t('Please_Select') + ' ' + $t('Activity_Category_Icon')"
            style="width: 100%"
          >
            <el-option
              v-for="icon in categoryIconOptions" :key="icon.id || icon.key || index"
              :label="$t('Icon_Label')"
              :value="icon.value"
            >
              <div style="display: flex; align-items: center; gap: 8px">
                <el-icon :size="16">
                  <component :is="icon.value" />
                </el-icon>
                <span>{{ icon.label }}</span>
              </div>
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('Activity_Category_Type')" prop="type">
          <el-select
            v-model="formData.type"
            :placeholder="$t('Please_Select') + ' ' + $t('Activity_Category_Type')"
            style="width: 100%"
          >
            <el-option
              v-for="type in activityTypeOptions" :key="type.id || type.key || index"
              :label="$t('Type_Label')"
              :value="type.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('Activity_Category_Sort')" prop="sort">
          <el-input-number
            v-model="formData.sort"
            :min="0"
            :max="999"
            :placeholder="$t('Please_Enter') + ' ' + $t('Activity_Category_Sort')"
            style="width: 100%"
          />
        </el-form-item>

        <el-form-item :label="$t('activity.category.description')" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="3"
            :placeholder="$t('Please_Enter') + ' ' + $t('activity.category.description')"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </template>
    </BaseDialogForm>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'

// 组件
import {
  BaseSearchForm,
  BaseDataTable,
  BaseDialogForm,
  type FormItem,
  type TableColumn
} from '@/components/activity'
import { ActivityStatusBadge } from '@/components/activity'

// Hooks
import { useTable, useForm, useSearch } from '@/hooks/activity'

// 工具函数
import { getValidators, ACTIVITY_TYPE_OPTIONS, CATEGORY_ICON_OPTIONS } from '@/utils/activity'

// API
import ActivityCategoryAPI from '@/api/activity/activity-category.api'

// 类型
import type { ActivityCategory } from '@/types/activity'

const { t } = useI18n()

// ==================== 搜索配置 ====================
const searchItems: FormItem[] = [
  {
    prop: 'name',
    type: 'input',
    label: t('Activity_Category_Name'),
    placeholder: t('Please_Enter') + ' ' + t('Activity_Category_Name'),
    clearable: true
  },
  {
    prop: 'type',
    type: 'select',
    label: t('Activity_Category_Type'),
    placeholder: t('Please_Select') + ' ' + t('Activity_Category_Type'),
    options: ACTIVITY_TYPE_OPTIONS,
    clearable: true
  },
  {
    prop: 'status',
    type: 'select',
    label: t('common.status'),
    placeholder: t('Please_Select') + ' ' + t('common.status'),
    options: [
      { value: 0, label: t('activity.status.draft') },
      { value: 1, label: t('activity.status.published') }
    ],
    clearable: true
  }
]

// ==================== 表格配置 ====================
const tableColumns: TableColumn[] = [
  { prop: 'name', label: t('Activity_Category_Name'), width: '150', sortable: true },
  { prop: 'icon', label: t('Activity_Category_Icon'), width: '80', align: 'center', slot: 'icon' },
  { prop: 'type', label: t('Activity_Category_Type'), width: '120', formatter: formatActivityType },
  { prop: 'sort', label: t('Activity_Category_Sort'), width: '80', align: 'center', sortable: true },
  { prop: 'status', label: t('common.status'), width: '100', align: 'center', slot: 'status' },
  { prop: 'description', label: t('activity.category.description'), minWidth: '200', showOverflowTooltip: true },
  { prop: 'create_time', label: t('Create_Time'), width: '160', formatter: formatDateTime }
]

// ==================== 表格逻辑 ====================
const { state: tableState, ...tableMethods } = useTable<ActivityCategory>({
  fetchData: ActivityCategoryAPI.getPage,
  initialQuery: {},
  pagination: {
    pageSizes: [10, 20, 50, 100]
  },
  autoLoad: true,
  columns: tableColumns,
  selection: {
    enabled: true,
    rowKey: 'id'
  },
  sorting: {
    enabled: true
  }
})

// ==================== 搜索逻辑 ====================
const { state: searchState, ...searchMethods } = useSearch({
  initialParams: {},
  searchItems,
  onSearch: tableMethods.handleSearch,
  onReset: tableMethods.handleResetSearch
})

const searchParams = searchState.params

// ==================== 表单逻辑 ====================
const initialFormData: Partial<ActivityCategory> = {
  name: '',
  icon: 'star',
  type: 1,
  sort: 0,
  description: '',
  status: 1
}

const { state: formState, formRef, ...formMethods } = useForm<Partial<ActivityCategory>>({
  initialData: initialFormData,
  rules: getValidators('category'),
  submitFn: submitFormData,
  showSuccessMessage: true,
  successMessage: t($t('操作成功')),
  resetAfterSubmit: true
})

const formData = formState.data
const formRules = getValidators('category')

// ==================== 对话框状态 ====================
const dialogVisible = ref(false)
const dialogOperation = ref<'add' | 'edit'>('add')
const editingId = ref<number>()

// ==================== 表格引用 ====================
const tableRef = ref()

// ==================== 格式化函数 ====================
const formatDateTime = (row: any, column: any, cellValue: any) => {
  if (!cellValue) return '--'
  return new Date(cellValue).toLocaleString('zh-CN')
}

const formatActivityType = (row: any, column: any, cellValue: any) => {
  const type = ACTIVITY_TYPE_OPTIONS.find(item => item.value === cellValue)
  return type ? type.label : '--'
}

// ==================== 事件处理 ====================
// 搜索
const handleSearch = (params: Record<string, any>) => {
  tableMethods.handleSearch(params)
}

// 重置搜索
const handleResetSearch = () => {
  searchMethods.handleReset()
}

// 刷新表格
const handleRefresh = () => {
  tableMethods.handleRefresh()
}

// 分页变化
const handleSizeChange = (size: number) => {
  tableMethods.handleSizeChange(size)
}

const handlePageChange = (page: number) => {
  tableMethods.handlePageChange(page)
}

// 选择变化
const handleSelectionChange = (selection: ActivityCategory[]) => {
  tableMethods.handleSelectionChange(selection)
}

// 打开对话框
const handleOpenDialog = (row?: ActivityCategory) => {
  if (row) {
    // 编辑模式
    dialogOperation.value = 'edit'
    editingId.value = row.id
    formMethods.setFormData({
      ...row
    })
  } else {
    // 添加模式
    dialogOperation.value = 'add'
    editingId.value = undefined
    formMethods.resetForm()
  }
  
  dialogVisible.value = true
}

// 提交表单
const handleSubmit = async () => {
  await formMethods.submitForm()
  dialogVisible.value = false
  handleRefresh()
}

// 取消表单
const handleCancel = () => {
  dialogVisible.value = false
  formMethods.resetForm()
}

// 提交表单数据
const submitFormData = async (data: Partial<ActivityCategory>) => {
  if (dialogOperation.value === 'add') {
    return await ActivityCategoryAPI.create(data)
  } else {
    return await ActivityCategoryAPI.update({ ...data, id: editingId.value })
  }
}

// 删除
const handleDelete = async (id?: number) => {
  try {
    await ElMessageBox.confirm(
      t('确认要删除选中的数据吗？'),
      t($t('Warning')),
      {
        confirmButtonText: t($t('Confirm')),
        cancelButtonText: t($t('Cancel')),
        type: 'warning'
      }
    )

    if (id) {
      // 单条删除
      await ActivityCategoryAPI.deleteByIds([id])
    } else {
      // 批量删除
      const ids = tableMethods.selectedIds.value
      if (ids.length === 0) {
        ElMessage.warning(t($t('请选择要删除的数据')))
        return
      }
      await ActivityCategoryAPI.deleteByIds(ids)
    }

    ElMessage.success(t($t('删除成功')))
    handleRefresh()
  } catch (error) {
    // 用户取消删除
    if (error !== 'cancel') {
      console.error('删除失败:', error)
    }
  }
}

// 导出
const handleExport = async () => {
  try {
    await tableMethods.handleExport(ActivityCategoryAPI.export)
    ElMessage.success(t($t('导出成功')))
  } catch (error) {
    console.error('导出失败:', error)
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 初始化数据
  handleRefresh()
})

// ==================== 计算属性 ====================
const categoryIconOptions = CATEGORY_ICON_OPTIONS
const activityTypeOptions = ACTIVITY_TYPE_OPTIONS
</script>

<style scoped lang="scss">
.app-container {
  .search-container {
    margin-bottom: 16px;
  }
  
  .data-table {
    margin-top: 16px;
  }
}
</style>