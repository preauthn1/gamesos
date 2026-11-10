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
          v-hasPerm="['activity_listExport']"
          icon="download"
          @click="handleExport"
        >
          {{ $t($t('Export')) }}
        </el-button>
        <el-button
          v-hasPerm="['activity_listStats']"
          :icon="showStats ? 'arrow-up' : 'arrow-down'"
          @click="toggleStats"
        >
          {{ $t($t('Statistics')) }}
        </el-button>
      </template>
    </BaseSearchForm>

    <!-- 统计卡片 -->
    <div v-if="showStats" class="stats-container">
      <el-row :gutter="16">
        <el-col :span="6">
          <el-card shadow="hover" class="stats-card">
            <div class="stats-content">
              <div class="stats-icon" style="background-color: #409eff;">
                <el-icon><collection /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-label">{{ $t('activity.stats.totalActivities') }}</div>
                <div class="stats-value">{{ statsData.total_activities || 0 }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stats-card">
            <div class="stats-content">
              <div class="stats-icon" style="background-color: #67c23a;">
                <el-icon><promotion /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-label">{{ $t('activity.stats.publishedActivities') }}</div>
                <div class="stats-value">{{ statsData.published_activities || 0 }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stats-card">
            <div class="stats-content">
              <div class="stats-icon" style="background-color: #e6a23c;">
                <el-icon><timer /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-label">{{ $t('activity.stats.ongoingActivities') }}</div>
                <div class="stats-value">{{ statsData.ongoing_activities || 0 }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
        <el-col :span="6">
          <el-card shadow="hover" class="stats-card">
            <div class="stats-content">
              <div class="stats-icon" style="background-color: #f56c6c;">
                <el-icon><close /></el-icon>
              </div>
              <div class="stats-info">
                <div class="stats-label">{{ $t('activity.stats.endedActivities') }}</div>
                <div class="stats-value">{{ statsData.ended_activities || 0 }}</div>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>

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
          v-hasPerm="['activity_listInsert']"
          type="success"
          icon="plus"
          @click="handleOpenDialog()"
        >
          {{ $t($t('Add')) }}
        </el-button>
        <el-button
          v-hasPerm="['activity_listDelete']"
          type="danger"
          icon="delete"
          :disabled="!tableState.hasSelection"
          @click="handleDelete()"
        >
          {{ $t($t('Delete')) }}
        </el-button>
      </template>

      <!-- 封面图列 -->
      <template #cover_image="{ row }">
        <el-image
          v-if="row.cover_image"
          :src="row.cover_image"
          :preview-src-list="[row.cover_image]"
          fit="cover"
          style="width: 60px; height: 40px; border-radius: 4px;"
        />
        <span v-else>--</span>
      </template>

      <!-- 活动类型列 -->
      <template #activity_type="{ row }">
        <el-tag :type="getActivityTypeTagType(row.activity_type)">
          {{ formatActivityType(row.activity_type) }}
        </el-tag>
      </template>

      <!-- 状态列 -->
      <template #status="{ row }">
        <ActivityStatusBadge :status="row.status" />
      </template>

      <!-- 时间范围列 -->
      <template #time_range="{ row }">
        <div class="time-range">
          <div>{{ formatDateTime(row.start_time, 'MM-DD HH:mm') }}</div>
          <div style="color: #909399; font-size: 12px;">~</div>
          <div>{{ formatDateTime(row.end_time, 'MM-DD HH:mm') }}</div>
        </div>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <el-button
          v-hasPerm="['activity_listUpdate']"
          type="primary"
          size="small"
          icon="edit"
          @click="handleOpenDialog(row)"
        >
          {{ $t($t('Edit')) }}
        </el-button>
        
        <el-dropdown
          v-if="hasExtraActions(row)"
          @command="(command) => handleExtraAction(command, row)"
        >
          <el-button size="small" type="info">
            {{ $t($t('More')) }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item
                v-if="row.status === 0 && hasPermission('activity_listPublish')"
                command="publish"
                icon="promotion"
              >
                {{ $t($t('Publish')) }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="row.status === 1 && hasPermission('activity_listEnd')"
                command="end"
                icon="close"
              >
                {{ $t($t('End')) }}
              </el-dropdown-item>
              <el-dropdown-item
                v-if="hasPermission('activity_listDelete')"
                command="delete"
                icon="delete"
                divided
              >
                {{ $t($t('Delete')) }}
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
        <el-button
          v-else-if="hasPermission('activity_listDelete')"
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
      :title="$t('activity.list.management')"
      :width="'800px'"
      :submit-loading="formState.loading"
      :show-cancel-button="true"
      :show-submit-button="true"
      @submit="handleSubmit"
      @cancel="handleCancel"
    >
      <template #form-content="{ formData }">
        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('Activity_List_Title')" prop="title">
              <el-input
                v-model="formData.title"
                :placeholder="$t('Please_Enter') + ' ' + $t('Activity_List_Title')"
                maxlength="100"
                show-word-limit
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item :label="$t('Activity_Category_Name')" prop="category_id">
              <el-select
                v-model="formData.category_id"
                :placeholder="$t('Please_Select') + ' ' + $t('Activity_Category_Name')"
                style="width: 100%"
                filterable
              >
                <el-option
                  v-for="category in categoryOptions" :key="category.id || category.key || index"
                  :label="$t('Category_Name')"
                  :value="category.id"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('Activity_List_Type')" prop="activity_type">
              <el-select
                v-model="formData.activity_type"
                :placeholder="$t('Please_Select') + ' ' + $t('Activity_List_Type')"
                style="width: 100%"
                @change="handleActivityTypeChange"
              >
                <el-option
                  v-for="type in activityTypeOptions" :key="type.id || type.key || index"
                  :label="$t('Type_Label')"
                  :value="type.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item :label="$t('activity.list.sort')" prop="sort">
              <el-input-number
                v-model="formData.sort"
                :min="0"
                :max="999"
                :placeholder="$t('Please_Enter') + ' ' + $t('activity.list.sort')"
                style="width: 100%"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12">
            <el-form-item :label="$t('activity.list.startTime')" prop="start_time">
              <el-date-picker
                v-model="formData.start_time"
                type="datetime"
                :placeholder="$t('Please_Select') + ' ' + $t('activity.list.startTime')"
                style="width: 100%"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
          
          <el-col :span="12">
            <el-form-item :label="$t('activity.list.endTime')" prop="end_time">
              <el-date-picker
                v-model="formData.end_time"
                type="datetime"
                :placeholder="$t('Please_Select') + ' ' + $t('activity.list.endTime')"
                style="width: 100%"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-form-item :label="$t('activity.list.coverImage')" prop="cover_image">
          <el-upload
            v-model:file-list="coverImageList"
            class="avatar-uploader"
            action="#"
            :show-file-list="false"
            :auto-upload="false"
            :on-change="handleCoverImageChange"
            :before-upload="beforeCoverImageUpload"
          >
            <el-image
              v-if="formData.cover_image"
              :src="formData.cover_image"
              class="avatar"
              fit="cover"
            />
            <el-icon v-else class="avatar-uploader-icon">
              <plus />
            </el-icon>
          </el-upload>
          <div class="upload-tips">
            {{ $t('建议尺寸：800×400px，支持JPG、PNG格式，大小不超过2MB') }}
          </div>
        </el-form-item>

        <el-form-item :label="$t('activity.list.description')" prop="description">
          <el-input
            v-model="formData.description"
            type="textarea"
            :rows="4"
            :placeholder="$t('Please_Enter') + ' ' + $t('activity.list.description')"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <el-form-item :label="$t('activity.list.rules')" prop="rules">
          <el-input
            v-model="formData.rules"
            type="textarea"
            :rows="3"
            :placeholder="$t('Please_Enter') + ' ' + $t('activity.list.rules')"
            maxlength="1000"
            show-word-limit
          />
        </el-form-item>

        <el-form-item :label="$t('activity.list.participantLimit')" prop="participant_limit">
          <el-input-number
            v-model="formData.participant_limit"
            :min="0"
            :placeholder="$t('0表示不限制')"
            style="width: 200px"
          />
          <span style="margin-left: 8px; color: #909399;">
            {{ $t('0表示不限制参与人数') }}
          </span>
        </el-form-item>
      </template>
    </BaseDialogForm>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import {
  Collection,
  Promotion,
  Timer,
  Close,
  ArrowDown,
  Plus
} from '@element-plus/icons-vue'
import type { UploadFile } from 'element-plus'

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
import {
  getValidators,
  ACTIVITY_TYPE_OPTIONS,
  ACTIVITY_STATUS,
  formatDateTime,
  formatActivityType
} from '@/utils/activity'

// API
import ActivityListAPI from '@/api/activity/activity-list.api.ts'
import ActivityCategoryAPI from '@/api/activity/activity-category.api'

// 类型
import type { Activity, ActivityStats } from '@/types/activity'

const { t } = useI18n()

// ==================== 搜索配置 ====================
const searchItems: FormItem[] = [
  {
    prop: 'title',
    type: 'input',
    label: t('Activity_List_Title'),
    placeholder: t('Please_Enter') + ' ' + t('Activity_List_Title'),
    clearable: true
  },
  {
    prop: 'category_id',
    type: 'select',
    label: t('Activity_Category_Name'),
    placeholder: t('Please_Select') + ' ' + t('Activity_Category_Name'),
    optionsFn: getCategoryOptionsForSearch,
    clearable: true,
    filterable: true
  },
  {
    prop: 'activity_type',
    type: 'select',
    label: t('Activity_List_Type'),
    placeholder: t('Please_Select') + ' ' + t('Activity_List_Type'),
    options: ACTIVITY_TYPE_OPTIONS,
    clearable: true
  },
  {
    prop: 'status',
    type: 'select',
    label: t('common.status'),
    placeholder: t('Please_Select') + ' ' + t('common.status'),
    options: [
      { value: ACTIVITY_STATUS.DRAFT, label: t('activity.status.draft') },
      { value: ACTIVITY_STATUS.PUBLISHED, label: t('activity.status.published') },
      { value: ACTIVITY_STATUS.ENDED, label: t('activity.status.ended') },
      { value: ACTIVITY_STATUS.CANCELLED, label: t('activity.status.cancelled') }
    ],
    clearable: true
  }
]

// ==================== 表格配置 ====================
const tableColumns: TableColumn[] = [
  { prop: 'cover_image', label: t('activity.list.coverImage'), width: '80', align: 'center', slot: 'cover_image' },
  { prop: 'title', label: t('Activity_List_Title'), width: '200', sortable: true, showOverflowTooltip: true },
  { prop: 'category_name', label: t('Activity_Category_Name'), width: '120' },
  { prop: 'activity_type', label: t('Activity_List_Type'), width: '100', align: 'center', slot: 'activity_type' },
  { prop: 'status', label: t('common.status'), width: '100', align: 'center', slot: 'status' },
  { prop: 'time_range', label: t('activity.list.timeRange'), width: '180', slot: 'time_range' },
  { prop: 'participant_count', label: t('activity.list.participantCount'), width: '100', align: 'center' },
  { prop: 'sort', label: t('activity.list.sort'), width: '80', align: 'center', sortable: true },
  { prop: 'create_time', label: t('Create_Time'), width: '160', formatter: formatDateTime }
]

// ==================== 表格逻辑 ====================
const { state: tableState, ...tableMethods } = useTable<Activity>({
  fetchData: getActivityList,
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
const initialFormData: Partial<Activity> = {
  title: '',
  category_id: undefined,
  activity_type: 1,
  start_time: '',
  end_time: '',
  cover_image: '',
  description: '',
  rules: '',
  participant_limit: 0,
  sort: 0,
  status: ACTIVITY_STATUS.DRAFT
}

const { state: formState, formRef, ...formMethods } = useForm<Partial<Activity>>({
  initialData: initialFormData,
  rules: getValidators('activity'),
  submitFn: submitFormData,
  showSuccessMessage: true,
  successMessage: t($t('操作成功')),
  resetAfterSubmit: true
})

const formData = formState.data
const formRules = getValidators('activity')

// ==================== 对话框状态 ====================
const dialogVisible = ref(false)
const dialogOperation = ref<'add' | 'edit'>('add')
const editingId = ref<number>()

// ==================== 统计相关 ====================
const showStats = ref(false)
const statsData = ref<ActivityStats>({
  total_activities: 0,
  published_activities: 0,
  ongoing_activities: 0,
  ended_activities: 0
})

// ==================== 分类选项 ====================
const categoryOptions = ref<Array<{ id: number; name: string }>>([])

// ==================== 封面图上传 ====================
const coverImageList = ref<UploadFile[]>([])

// ==================== 表格引用 ====================
const tableRef = ref()

// ==================== 工具函数 ====================
// 获取分类选项（搜索用）
async function getCategoryOptionsForSearch() {
  try {
    const response = await ActivityCategoryAPI.getCategoryOptions()
    return response.map((item: any) => ({
      label: item.name,
      value: item.id
    }))
  } catch (error) {
    console.error('获取分类选项失败:', error)
    return []
  }
}

// 获取活动类型标签类型
function getActivityTypeTagType(type: number): 'success' | 'info' | 'warning' | 'danger' {
  const typeMap: Record<number, 'success' | 'info' | 'warning' | 'danger'> = {
    1: 'success',  // 普通活动
    2: 'info',     // 签到活动
    3: 'warning'   // 转盘活动
  }
  return typeMap[type] || 'info'
}

// 检查是否有额外操作
function hasExtraActions(row: Activity): boolean {
  return (
    (row.status === ACTIVITY_STATUS.DRAFT && hasPermission('activity_listPublish')) ||
    (row.status === ACTIVITY_STATUS.PUBLISHED && hasPermission('activity_listEnd')) ||
    hasPermission('activity_listDelete')
  )
}

// 检查权限
function hasPermission(permission: string): boolean {
  // 这里应该根据实际的权限系统实现
  // 暂时返回 true，实际项目中需要替换为真实的权限检查
  return true
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
  if (showStats.value) {
    loadStatsData()
  }
}

// 分页变化
const handleSizeChange = (size: number) => {
  tableMethods.handleSizeChange(size)
}

const handlePageChange = (page: number) => {
  tableMethods.handlePageChange(page)
}

// 选择变化
const handleSelectionChange = (selection: Activity[]) => {
  tableMethods.handleSelectionChange(selection)
}

// 切换统计显示
const toggleStats = () => {
  showStats.value = !showStats.value
  if (showStats.value && !statsData.value.total_activities) {
    loadStatsData()
  }
}

// 加载统计数据
const loadStatsData = async () => {
  try {
    const data = await getActivityStats()
    statsData.value = data
  } catch (error) {
    console.error('加载统计数据失败:', error)
  }
}

// 打开对话框
const handleOpenDialog = async (row?: Activity) => {
  // 加载分类选项
  if (categoryOptions.value.length === 0) {
    try {
      const response = await ActivityCategoryAPI.getCategoryOptions()
      categoryOptions.value = response
    } catch (error) {
      console.error('加载分类选项失败:', error)
    }
  }
  
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
  coverImageList.value = []
}

// 提交表单数据
const submitFormData = async (data: Partial<Activity>) => {
  if (dialogOperation.value === 'add') {
    return await ActivityListAPI.create(data)
  } else {
    return await ActivityListAPI.update({ ...data, id: editingId.value })
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
      await ActivityListAPI.deleteByIds(id)
    } else {
      // 批量删除
      const ids = tableMethods.selectedIds.value
      if (ids.length === 0) {
        ElMessage.warning(t($t('请选择要删除的数据')))
        return
      }
      await ActivityListAPI.deleteByIds(ids)
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

// 额外操作
const handleExtraAction = async (command: string, row: Activity) => {
  try {
    switch (command) {
      case 'publish':
        await publishActivity(row.id)
        ElMessage.success(t($t('发布成功')))
        break
      case 'end':
        await endActivity(row.id)
        ElMessage.success(t($t('活动已结束')))
        break
      case 'delete':
        await handleDelete(row.id)
        return
    }
    
    handleRefresh()
  } catch (error) {
    console.error(`${command} 操作失败:`, error)
  }
}

// 导出
const handleExport = async () => {
  try {
    await tableMethods.handleExport(exportActivity)
    ElMessage.success(t($t('导出成功')))
  } catch (error) {
    console.error('导出失败:', error)
  }
}

// 活动类型变化
const handleActivityTypeChange = (type: number) => {
  // 可以根据活动类型显示不同的表单字段
  console.log('活动类型变化:', type)
}

// 封面图变化
const handleCoverImageChange = (file: UploadFile) => {
  if (file.raw) {
    // 这里应该上传到服务器并获取URL
    // 暂时使用本地预览
    const reader = new FileReader()
    reader.onload = (e) => {
      formData.cover_image = e.target?.result as string
    }
    reader.readAsDataURL(file.raw)
  }
}

// 封面图上传前检查
const beforeCoverImageUpload = (file: File) => {
  const isImage = file.type.startsWith('image/')
  const isLt2M = file.size / 1024 / 1024 < 2
  
  if (!isImage) {
    ElMessage.error('只能上传图片文件!')
    return false
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过2MB!')
    return false
  }
  
  return true
}

// ==================== 生命周期 ====================
onMounted(() => {
  // 初始化数据
  handleRefresh()
})

// ==================== 计算属性 ====================
const activityTypeOptions = ACTIVITY_TYPE_OPTIONS
</script>

<style scoped lang="scss">
.app-container {
  .stats-container {
    margin: 16px 0;
    
    .stats-card {
      .stats-content {
        display: flex;
        align-items: center;
        gap: 12px;
        
        .stats-icon {
          width: 40px;
          height: 40px;
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          
          .el-icon {
            font-size: 20px;
          }
        }
        
        .stats-info {
          flex: 1;
          
          .stats-label {
            font-size: 12px;
            color: #909399;
            margin-bottom: 4px;
          }
          
          .stats-value {
            font-size: 20px;
            font-weight: 600;
            color: #303133;
          }
        }
      }
    }
  }
  
  .time-range {
    display: flex;
    flex-direction: column;
    gap: 2px;
    font-size: 12px;
  }
  
  .avatar-uploader {
    :deep(.el-upload) {
      border: 1px dashed #d9d9d9;
      border-radius: 6px;
      cursor: pointer;
      position: relative;
      overflow: hidden;
      transition: var(--el-transition-duration-fast);
      
      &:hover {
        border-color: var(--el-color-primary);
      }
    }
    
    .avatar {
      width: 200px;
      height: 100px;
      display: block;
    }
    
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 200px;
      height: 100px;
      text-align: center;
      line-height: 100px;
    }
  }
  
  .upload-tips {
    margin-top: 8px;
    font-size: 12px;
    color: #909399;
  }
}
</style>