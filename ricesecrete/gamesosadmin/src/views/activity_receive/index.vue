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
          v-hasPerm="['activity_receiveExport']"
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
          v-hasPerm="['activity_receiveDelete']"
          type="danger"
          icon="delete"
          :disabled="!tableState.hasSelection"
          @click="handleDelete()"
        >
          {{ $t($t('Delete')) }}
        </el-button>
        <el-button
          v-hasPerm="['activity_receiveAudit']"
          type="warning"
          icon="check"
          :disabled="!tableState.hasSelection"
          @click="handleBatchAudit('success')"
        >
          {{ $t('activity.receive.batchApprove') }}
        </el-button>
        <el-button
          v-hasPerm="['activity_receiveAudit']"
          type="info"
          icon="close"
          :disabled="!tableState.hasSelection"
          @click="handleBatchAudit('failed')"
        >
          {{ $t('activity.receive.batchReject') }}
        </el-button>
      </template>

      <!-- 用户信息列 -->
      <template #user_info="{ row }">
        <div class="user-info">
          <div class="user-name">{{ row.user_name || '--' }}</div>
          <div class="user-id">{{ $t('activity.receive.userId') }}: {{ row.user_id || '--' }}</div>
        </div>
      </template>

      <!-- 活动信息列 -->
      <template #activity_info="{ row }">
        <div class="activity-info">
          <div class="activity-title">{{ row.activity_title || '--' }}</div>
          <div class="activity-type">
            <el-tag size="small" :type="getActivityTypeTagType(row.activity_type)">
              {{ formatActivityType(row.activity_type) }}
            </el-tag>
          </div>
        </div>
      </template>

      <!-- 奖励信息列 -->
      <template #reward_info="{ row }">
        <div class="reward-info">
          <RewardTypeTag
            :type="row.reward_type"
            :value="row.reward_value"
            :show-value="true"
            size="small"
          />
          <div v-if="row.reward_description" class="reward-description">
            {{ row.reward_description }}
          </div>
        </div>
      </template>

      <!-- 状态列 -->
      <template #status="{ row }">
        <el-tag
          :type="getReceiveStatusType(row.status)"
          :effect="row.status === 0 ? 'light' : 'plain'"
        >
          {{ formatReceiveStatus(row.status) }}
        </el-tag>
      </template>

      <!-- 操作列 -->
      <template #actions="{ row }">
        <el-button
          v-if="row.status === 0 && hasPermission('activity_receiveAudit')"
          type="success"
          size="small"
          icon="check"
          @click="handleAudit(row, 'success')"
        >
          {{ $t('activity.receive.approve') }}
        </el-button>
        <el-button
          v-if="row.status === 0 && hasPermission('activity_receiveAudit')"
          type="danger"
          size="small"
          icon="close"
          @click="handleAudit(row, 'failed')"
        >
          {{ $t('activity.receive.reject') }}
        </el-button>
        <el-button
          v-if="hasPermission('activity_receiveUpdate')"
          type="primary"
          size="small"
          icon="edit"
          @click="handleOpenDialog(row)"
        >
          {{ $t($t('Edit')) }}
        </el-button>
        <el-button
          v-if="hasPermission('activity_receiveDelete')"
          type="danger"
          size="small"
          icon="delete"
          @click="handleDelete(row.id)"
        >
          {{ $t($t('Delete')) }}
        </el-button>
      </template>
    </BaseDataTable>

    <!-- 编辑对话框 -->
    <BaseDialogForm
      v-model:visible="dialogVisible"
      v-model:form-data="formData"
      :form-rules="formRules"
      :operation="dialogOperation"
      :title="$t('activity.receive.management')"
      :width="'600px'"
      :submit-loading="formState.loading"
      :show-cancel-button="true"
      :show-submit-button="true"
      @submit="handleSubmit"
      @cancel="handleCancel"
    >
      <template #form-content="{ formData }">
        <el-form-item :label="$t('Activity_Receive_Status')" prop="status">
          <el-select
            v-model="formData.status"
            :placeholder="$t('Please_Select') + ' ' + $t('Activity_Receive_Status')"
            style="width: 100%"
          >
            <el-option
              v-for="status in statusOptions" :key="status.id || status.key || index"
              :label="$t('Status_Label')"
              :value="status.value"
            />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('activity.receive.remark')" prop="remark">
          <el-input
            v-model="formData.remark"
            type="textarea"
            :rows="4"
            :placeholder="$t('Please_Enter') + ' ' + $t('activity.receive.remark')"
            maxlength="500"
            show-word-limit
          />
        </el-form-item>

        <!-- 只读信息 -->
        <el-card shadow="never" class="readonly-info">
          <template #header>
            <div class="readonly-info-header">
              <span>{{ $t('activity.receive.receiveInfo') }}</span>
            </div>
          </template>
          
          <el-descriptions :column="1" border size="small">
            <el-descriptions-item :label="$t('activity.receive.userName')">
              {{ formData.user_name || '--' }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('activity.receive.activityTitle')">
              {{ formData.activity_title || '--' }}
            </el-descriptions-item>
            <el-descriptions-item :label="$t('activity.receive.rewardInfo')">
              <RewardTypeTag
                :type="formData.reward_type"
                :value="formData.reward_value"
                :show-value="true"
              />
            </el-descriptions-item>
            <el-descriptions-item :label="$t('activity.receive.receiveTime')">
              {{ formatDateTime(formData.receive_time) }}
            </el-descriptions-item>
          </el-descriptions>
        </el-card>
      </template>
    </BaseDialogForm>

    <!-- 批量审核对话框 -->
    <el-dialog
      v-model="batchAuditDialogVisible"
      :title="$t('Batchaudittitle')"
      width="400px"
      :close-on-click-modal="false"
    >
      <el-form
        ref="batchAuditFormRef"
        :model="batchAuditForm"
        :rules="batchAuditRules"
        label-width="80px"
      >
        <el-form-item :label="$t('activity.receive.remark')" prop="remark">
          <el-input
            v-model="batchAuditForm.remark"
            type="textarea"
            :rows="3"
            :placeholder="$t('Please_Enter') + ' ' + $t('activity.receive.remark')"
            maxlength="200"
            show-word-limit
          />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="batchAuditDialogVisible = false">
            {{ $t($t('Cancel')) }}
          </el-button>
          <el-button
            type="primary"
            :loading="batchAuditLoading"
            @click="handleBatchAuditSubmit"
          >
            {{ $t($t('Confirm')) }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import type { FormInstance } from 'element-plus'

// 组件
import {
  BaseSearchForm,
  BaseDataTable,
  BaseDialogForm,
  type FormItem,
  type TableColumn
} from '@/components/activity'
import { RewardTypeTag } from '@/components/activity'

// Hooks
import { useTable, useForm, useSearch } from '@/hooks/activity'

// 工具函数
import {
  getValidators,
  RECEIVE_STATUS,
  RECEIVE_STATUS_OPTIONS,
  RECEIVE_TYPE_OPTIONS,
  formatDateTime,
  formatActivityType,
  formatReceiveStatus,
  getReceiveStatusType,
  getActivityTypeTagType
} from '@/utils/activity'

// API
import ActivityReceiveAPI from '@/api/activity/activity-receive.api.ts'

// 类型
import type { ReceiveRecord } from '@/types/activity'

const { t } = useI18n()

// ==================== 搜索配置 ====================
const searchItems: FormItem[] = [
  {
    prop: 'user_name',
    type: 'input',
    label: t('activity.receive.userName'),
    placeholder: t('Please_Enter') + ' ' + t('activity.receive.userName'),
    clearable: true
  },
  {
    prop: 'activity_title',
    type: 'input',
    label: t('activity.receive.activityTitle'),
    placeholder: t('Please_Enter') + ' ' + t('activity.receive.activityTitle'),
    clearable: true
  },
  {
    prop: 'receive_type',
    type: 'select',
    label: t('activity.receive.receiveType'),
    placeholder: t('Please_Select') + ' ' + t('activity.receive.receiveType'),
    options: RECEIVE_TYPE_OPTIONS,
    clearable: true
  },
  {
    prop: 'reward_type',
    type: 'select',
    label: t('activity.receive.rewardType'),
    placeholder: t('Please_Select') + ' ' + t('activity.receive.rewardType'),
    options: RECEIVE_TYPE_OPTIONS,
    clearable: true
  },
  {
    prop: 'status',
    type: 'select',
    label: t('Activity_Receive_Status'),
    placeholder: t('Please_Select') + ' ' + t('Activity_Receive_Status'),
    options: RECEIVE_STATUS_OPTIONS,
    clearable: true
  },
  {
    prop: 'date_range',
    type: 'daterange',
    label: t('activity.receive.receiveTime'),
    startPlaceholder: '$t("Start_Date")',
    endPlaceholder: '$t("End_Date")',
    valueFormat: 'YYYY-MM-DD',
    format: 'YYYY-MM-DD',
    clearable: true
  }
]

// ==================== 表格配置 ====================
const tableColumns: TableColumn[] = [
  { prop: 'user_info', label: t('activity.receive.userInfo'), width: '180', slot: 'user_info' },
  { prop: 'activity_info', label: t('activity.receive.activityInfo'), width: '200', slot: 'activity_info' },
  { prop: 'reward_info', label: t('activity.receive.rewardInfo'), width: '150', slot: 'reward_info' },
  { prop: 'receive_type', label: t('activity.receive.receiveType'), width: '120', formatter: formatReceiveType },
  { prop: 'status', label: t('Activity_Receive_Status'), width: '100', align: 'center', slot: 'status' },
  { prop: 'receive_time', label: t('activity.receive.receiveTime'), width: '160', formatter: formatDateTime },
  { prop: 'remark', label: t('activity.receive.remark'), width: '150', showOverflowTooltip: true }
]

// ==================== 表格逻辑 ====================
const { state: tableState, ...tableMethods } = useTable<ReceiveRecord>({
  fetchData: getReceiveList,
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
const initialFormData: Partial<ReceiveRecord> = {
  status: RECEIVE_STATUS.PENDING,
  remark: ''
}

const { state: formState, formRef, ...formMethods } = useForm<Partial<ReceiveRecord>>({
  initialData: initialFormData,
  rules: getValidators('receive'),
  submitFn: submitFormData,
  showSuccessMessage: true,
  successMessage: t($t('操作成功')),
  resetAfterSubmit: true
})

const formData = formState.data
const formRules = getValidators('receive')

// ==================== 对话框状态 ====================
const dialogVisible = ref(false)
const dialogOperation = ref<'edit'>('edit')
const editingId = ref<number>()

// ==================== 批量审核相关 ====================
const batchAuditDialogVisible = ref(false)
const batchAuditLoading = ref(false)
const batchAuditType = ref<'success' | 'failed'>('success')
const batchAuditForm = reactive({
  remark: ''
})
const batchAuditFormRef = ref<FormInstance>()
const batchAuditRules = {
  remark: [
    { max: 200, message: t('备注不能超过200个字符'), trigger: 'blur' }
  ]
}

// ==================== 表格引用 ====================
const tableRef = ref()

// ==================== 工具函数 ====================
// 格式化领取类型
function formatReceiveType(row: any, column: any, cellValue: any) {
  const type = RECEIVE_TYPE_OPTIONS.find(item => item.value === cellValue)
  return type ? type.label : '--'
}

// 检查权限
function hasPermission(permission: string): boolean {
  // 这里应该根据实际的权限系统实现
  // 暂时返回 true，实际项目中需要替换为真实的权限检查
  return true
}

// 获取批量审核标题
const batchAuditTitle = computed(() => {
  return batchAuditType.value === 'success' 
    ? t('activity.receive.batchApprove')
    : t('activity.receive.batchReject')
})

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
const handleSelectionChange = (selection: ReceiveRecord[]) => {
  tableMethods.handleSelectionChange(selection)
}

// 打开编辑对话框
const handleOpenDialog = (row: ReceiveRecord) => {
  dialogOperation.value = 'edit'
  editingId.value = row.id
  formMethods.setFormData({
    status: row.status,
    remark: row.remark || '',
    user_name: row.user_name,
    activity_title: row.activity_title,
    reward_type: row.reward_type,
    reward_value: row.reward_value,
    receive_time: row.receive_time
  })
  
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
const submitFormData = async (data: Partial<ReceiveRecord>) => {
  return await updateReceive({ ...data, id: editingId.value })
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
      await deleteReceive(id)
    } else {
      // 批量删除
      const ids = tableMethods.selectedIds.value
      if (ids.length === 0) {
        ElMessage.warning(t($t('请选择要删除的数据')))
        return
      }
      await batchDeleteReceive(ids)
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

// 审核单条记录
const handleAudit = async (row: ReceiveRecord, type: 'success' | 'failed') => {
  try {
    await ElMessageBox.confirm(
      type === 'success' 
        ? t('确认要通过此领取记录吗？')
        : t('确认要拒绝此领取记录吗？'),
      t($t('Warning')),
      {
        confirmButtonText: t($t('Confirm')),
        cancelButtonText: t($t('Cancel')),
        type: 'warning'
      }
    )

    const status = type === 'success' ? RECEIVE_STATUS.SUCCESS : RECEIVE_STATUS.FAILED
    await auditReceive({
      id: row.id,
      status,
      remark: ''
    })

    ElMessage.success(type === 'success' ? t($t('审核通过')) : t($t('审核拒绝')))
    handleRefresh()
  } catch (error) {
    // 用户取消审核
    if (error !== 'cancel') {
      console.error('审核失败:', error)
    }
  }
}

// 批量审核
const handleBatchAudit = (type: 'success' | 'failed') => {
  const ids = tableMethods.selectedIds.value
  if (ids.length === 0) {
    ElMessage.warning(t($t('请选择要审核的数据')))
    return
  }

  // 检查是否包含已审核的记录
  const hasAudited = tableState.selection.some(item => item.status !== RECEIVE_STATUS.PENDING)
  if (hasAudited) {
    ElMessage.warning(t($t('只能审核待处理的记录')))
    return
  }

  batchAuditType.value = type
  batchAuditForm.remark = ''
  batchAuditDialogVisible.value = true
}

// 提交批量审核
const handleBatchAuditSubmit = async () => {
  if (!batchAuditFormRef.value) return

  try {
    await batchAuditFormRef.value.validate()
    
    batchAuditLoading.value = true
    
    const ids = tableMethods.selectedIds.value
    const status = batchAuditType.value === 'success' ? RECEIVE_STATUS.SUCCESS : RECEIVE_STATUS.FAILED
    
    await batchAuditReceive({
      ids,
      status,
      remark: batchAuditForm.remark
    })

    ElMessage.success(batchAuditType.value === 'success' ? t($t('批量审核通过')) : t($t('批量审核拒绝')))
    batchAuditDialogVisible.value = false
    handleRefresh()
  } catch (error) {
    console.error('批量审核失败:', error)
  } finally {
    batchAuditLoading.value = false
  }
}

// 导出
const handleExport = async () => {
  try {
    await tableMethods.handleExport(exportReceive)
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
const statusOptions = RECEIVE_STATUS_OPTIONS
</script>

<style scoped lang="scss">
.app-container {
  .user-info {
    .user-name {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .user-id {
      font-size: 12px;
      color: #909399;
    }
  }
  
  .activity-info {
    .activity-title {
      font-weight: 500;
      margin-bottom: 4px;
    }
    
    .activity-type {
      display: inline-block;
    }
  }
  
  .reward-info {
    .reward-description {
      margin-top: 4px;
      font-size: 12px;
      color: #909399;
    }
  }
  
  .readonly-info {
    margin-top: 20px;
    
    .readonly-info-header {
      font-weight: 500;
    }
    
    :deep(.el-descriptions) {
      .el-descriptions-item__label {
        width: 100px;
      }
    }
  }
}
</style>