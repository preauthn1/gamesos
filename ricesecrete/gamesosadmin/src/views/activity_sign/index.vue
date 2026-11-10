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
          v-hasPerm="['activity_signExport']"
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
          v-hasPerm="['activity_signInsert']"
          type="success"
          icon="plus"
          @click="handleOpenDialog()"
        >
          {{ $t($t('Add')) }}
        </el-button>
        <el-button
          v-hasPerm="['activity_signDelete']"
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

      <!-- 状态列 -->
      <template #status="{ row }">
        <ActivityStatusBadge :status="row.status" />
      </template>

      <!-- 签到规则列 -->
      <template #sign_rules="{ row }">
        <el-tooltip
          :content="row.sign_rules"
          placement="top"
          :disabled="!row.sign_rules || row.sign_rules.length <= 20"
        >
          <span>{{ row.sign_rules ? (row.sign_rules.length > 20 ? row.sign_rules.substring(0, 20) + '...' : row.sign_rules) : '--' }}</span>
        </el-tooltip>
      </template>

      <!-- 连续签到奖励列 -->
      <template #continuous_rewards="{ row }">
        <div v-if="row.continuous_rewards && row.continuous_rewards.length > 0">
          <el-tag size="small" type="info">
            {{ $t('activity.sign.rewardsCount', { count: row.continuous_rewards.length }) }}
          </el-tag>
        </div>
        <span v-else>--</span>
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
          v-hasPerm="['activity_signUpdate']"
          type="primary"
          size="small"
          icon="edit"
          @click="handleOpenDialog(row)"
        >
          {{ $t($t('Edit')) }}
        </el-button>
        <el-button
          v-hasPerm="['activity_signDelete']"
          type="danger"
          size="small"
          icon="delete"
          @click="handleDelete(row.id)"
        >
          {{ $t($t('Delete')) }}
        </el-button>
        <el-button
          v-hasPerm="['activity_signView']"
          type="info"
          size="small"
          icon="view"
          @click="handleViewRecords(row)"
        >
          {{ $t('activity.sign.viewRecords') }}
        </el-button>
      </template>
    </BaseDataTable>

    <!-- 添加/编辑对话框 -->
    <BaseDialogForm
      v-model:visible="dialogVisible"
      v-model:form-data="formData"
      :form-rules="formRules"
      :operation="dialogOperation"
      :title="$t('activity.sign.management')"
      :width="'900px'"
      :submit-loading="formState.loading"
      :show-cancel-button="true"
      :show-submit-button="true"
      @submit="handleSubmit"
      @cancel="handleCancel"
    >
      <template #form-content="{ formData }">
        <!-- 基础信息 -->
        <el-card shadow="never" class="form-section">
          <template #header>
            <div class="form-section-header">
              <span>{{ $t('activity.sign.basicInfo') }}</span>
            </div>
          </template>
          
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
              :rows="3"
              :placeholder="$t('Please_Enter') + ' ' + $t('activity.list.description')"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>
        </el-card>

        <!-- 签到规则 -->
        <el-card shadow="never" class="form-section">
          <template #header>
            <div class="form-section-header">
              <span>{{ $t('activity.sign.signRules') }}</span>
            </div>
          </template>
          
          <el-form-item :label="$t('activity.sign.rulesDescription')" prop="sign_rules">
            <el-input
              v-model="formData.sign_rules"
              type="textarea"
              :rows="3"
              :placeholder="$t('Please_Enter') + ' ' + $t('activity.sign.rulesDescription')"
              maxlength="500"
              show-word-limit
            />
          </el-form-item>

          <el-form-item :label="$t('activity.sign.dailyReward')" prop="daily_reward">
            <el-row :gutter="20" style="width: 100%;">
              <el-col :span="8">
                <el-form-item prop="daily_reward.type" style="margin-bottom: 0;">
                  <el-select
                    v-model="formData.daily_reward.type"
                    :placeholder="$t('Please_Select') + ' ' + $t('activity.sign.rewardType')"
                    style="width: 100%"
                  >
                    <el-option
                      v-for="type in rewardTypeOptions" :key="type.id || type.key || index"
                      :label="$t('Type_Label')"
                      :value="type.value"
                    />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-form-item prop="daily_reward.value" style="margin-bottom: 0;">
                  <el-input-number
                    v-model="formData.daily_reward.value"
                    :min="1"
                    :placeholder="$t('Please_Enter') + ' ' + $t('activity.sign.rewardValue')"
                    style="width: 100%"
                  />
                </el-form-item>
              </el-col>
              <el-col :span="8">
                <el-tag type="info">
                  {{ getRewardTypeUnit(formData.daily_reward.type) }}
                </el-tag>
              </el-col>
            </el-row>
          </el-form-item>
        </el-card>

        <!-- 连续签到奖励 -->
        <el-card shadow="never" class="form-section">
          <template #header>
            <div class="form-section-header">
              <span>{{ $t('activity.sign.continuousRewards') }}</span>
              <el-button
                type="primary"
                size="small"
                icon="plus"
                @click="addContinuousReward"
              >
                {{ $t($t('Add')) }}
              </el-button>
            </div>
          </template>
          
          <el-form-item prop="continuous_rewards">
            <div v-if="formData.continuous_rewards.length === 0" class="empty-rewards">
              <el-empty :description="$t('activity.sign.noContinuousRewards')" :image-size="80" />
            </div>
            
            <div v-else class="rewards-list">
              <div
                v-for="(reward, index) in formData.continuous_rewards" :key="index"
                class="reward-item"
              >
                <el-row :gutter="20" style="width: 100%;">
                  <el-col :span="6">
                    <el-form-item
                      :label="$t('activity.sign.days')"
                      :prop="`continuous_rewards.${index}.days`"
                      :rules="continuousRewardRules.days"
                      style="margin-bottom: 0;"
                    >
                      <el-input-number
                        v-model="reward.days"
                        :min="1"
                        :max="365"
                        :placeholder="$t('Please_Enter') + ' ' + $t('activity.sign.days')"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      :label="$t('activity.sign.rewardType')"
                      :prop="`continuous_rewards.${index}.type`"
                      :rules="continuousRewardRules.type"
                      style="margin-bottom: 0;"
                    >
                      <el-select
                        v-model="reward.type"
                        :placeholder="$t('Please_Select') + ' ' + $t('activity.sign.rewardType')"
                        style="width: 100%"
                      >
                        <el-option
                          v-for="type in rewardTypeOptions" :key="type.id || type.key || index"
                          :label="$t('Type_Label')"
                          :value="type.value"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="6">
                    <el-form-item
                      :label="$t('activity.sign.rewardValue')"
                      :prop="`continuous_rewards.${index}.value`"
                      :rules="continuousRewardRules.value"
                      style="margin-bottom: 0;"
                    >
                      <el-input-number
                        v-model="reward.value"
                        :min="1"
                        :placeholder="$t('Please_Enter') + ' ' + $t('activity.sign.rewardValue')"
                        style="width: 100%"
                      />
                    </el-form-item>
                  </el-col>
                  <el-col :span="4">
                    <div class="reward-unit">
                      <el-tag type="info">
                        {{ getRewardTypeUnit(reward.type) }}
                      </el-tag>
                    </div>
                  </el-col>
                  <el-col :span="2">
                    <div class="reward-actions">
                      <el-button
                        type="danger"
                        icon="delete"
                        size="small"
                        circle
                        @click="removeContinuousReward(index)"
                      />
                    </div>
                  </el-col>
                </el-row>
              </div>
            </div>
          </el-form-item>
        </el-card>

        <!-- 其他设置 -->
        <el-card shadow="never" class="form-section">
          <template #header>
            <div class="form-section-header">
              <span>{{ $t('activity.sign.otherSettings') }}</span>
            </div>
          </template>
          
          <el-row :gutter="20">
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
            
            <el-col :span="12">
              <el-form-item :label="$t('common.status')" prop="status">
                <el-select
                  v-model="formData.status"
                  :placeholder="$t('Please_Select') + ' ' + $t('common.status')"
                  style="width: 100%"
                >
                  <el-option
                    v-for="status in statusOptions" :key="status.id || status.key || index"
                    :label="$t('Status_Label')"
                    :value="status.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-card>
      </template>
    </BaseDialogForm>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useI18n } from 'vue-i18n'
import { Plus } from '@element-plus/icons-vue'
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
  ACTIVITY_STATUS,
  REWARD_TYPE_OPTIONS,
  formatDateTime,
  getRewardTypeUnit
} from '@/utils/activity'

// API
import ActivitySignAPI from '@/api/activity/activity-sign.api.ts'
import ActivityCategoryAPI from '@/api/activity/activity-category.api'

// 类型
import type { SignActivity, ContinuousReward } from '@/types/activity'

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
    prop: 'status',
    type: 'select',
    label: t('common.status'),
    placeholder: t('Please_Select') + ' ' + t('common.status'),
    options: [
      { value: ACTIVITY_STATUS.DRAFT, label: t('activity.status.draft') },
      { value: ACTIVITY_STATUS.PUBLISHED, label: t('activity.status.published') },
      { value: ACTIVITY_STATUS.ENDED, label: t('activity.status.ended') }
    ],
    clearable: true
  }
]

// ==================== 表格配置 ====================
const tableColumns: TableColumn[] = [
  { prop: 'cover_image', label: t('activity.list.coverImage'), width: '80', align: 'center', slot: 'cover_image' },
  { prop: 'title', label: t('Activity_List_Title'), width: '200', sortable: true, showOverflowTooltip: true },
  { prop: 'category_name', label: t('Activity_Category_Name'), width: '120' },
  { prop: 'sign_rules', label: t('activity.sign.signRules'), width: '150', slot: 'sign_rules' },
  { prop: 'continuous_rewards', label: t('activity.sign.continuousRewards'), width: '120', align: 'center', slot: 'continuous_rewards' },
  { prop: 'status', label: t('common.status'), width: '100', align: 'center', slot: 'status' },
  { prop: 'time_range', label: t('activity.list.timeRange'), width: '180', slot: 'time_range' },
  { prop: 'participant_count', label: t('activity.list.participantCount'), width: '100', align: 'center' },
  { prop: 'sort', label: t('activity.list.sort'), width: '80', align: 'center', sortable: true },
  { prop: 'create_time', label: t('Create_Time'), width: '160', formatter: formatDateTime }
]

// ==================== 表格逻辑 ====================
const { state: tableState, ...tableMethods } = useTable<SignActivity>({
  fetchData: getSignActivityList,
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
const initialFormData: Partial<SignActivity> = {
  title: '',
  category_id: undefined,
  start_time: '',
  end_time: '',
  cover_image: '',
  description: '',
  sign_rules: '',
  daily_reward: {
    type: 1,
    value: 10
  },
  continuous_rewards: [],
  sort: 0,
  status: ACTIVITY_STATUS.DRAFT
}

const { state: formState, formRef, ...formMethods } = useForm<Partial<SignActivity>>({
  initialData: initialFormData,
  rules: getValidators('sign'),
  submitFn: submitFormData,
  showSuccessMessage: true,
  successMessage: t($t('操作成功')),
  resetAfterSubmit: true
})

const formData = formState.data
const formRules = getValidators('sign')

// 连续签到奖励验证规则
const continuousRewardRules = {
  days: [
    { required: true, message: t($t('签到天数不能为空')), trigger: 'blur' },
    { type: 'number', min: 1, max: 365, message: t('签到天数在1-365之间'), trigger: 'blur' }
  ],
  type: [
    { required: true, message: t($t('奖励类型不能为空')), trigger: 'change' }
  ],
  value: [
    { required: true, message: t($t('奖励值不能为空')), trigger: 'blur' },
    { type: 'number', min: 1, message: t('奖励值必须大于0'), trigger: 'blur' }
  ]
}

// ==================== 对话框状态 ====================
const dialogVisible = ref(false)
const dialogOperation = ref<'add' | 'edit'>('add')
const editingId = ref<number>()

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

// 添加连续签到奖励
const addContinuousReward = () => {
  formData.continuous_rewards.push({
    days: 7,
    type: 1,
    value: 50
  })
}

// 移除连续签到奖励
const removeContinuousReward = (index: number) => {
  formData.continuous_rewards.splice(index, 1)
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
const handleSelectionChange = (selection: SignActivity[]) => {
  tableMethods.handleSelectionChange(selection)
}

// 打开对话框
const handleOpenDialog = async (row?: SignActivity) => {
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
      ...row,
      daily_reward: row.daily_reward || { type: 1, value: 10 },
      continuous_rewards: row.continuous_rewards || []
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
const submitFormData = async (data: Partial<SignActivity>) => {
  if (dialogOperation.value === 'add') {
    return await createSignActivity(data)
  } else {
    return await updateSignActivity({ ...data, id: editingId.value })
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
      await deleteSignActivity(id)
    } else {
      // 批量删除
      const ids = tableMethods.selectedIds.value
      if (ids.length === 0) {
        ElMessage.warning(t($t('请选择要删除的数据')))
        return
      }
      await batchDeleteSignActivity(ids)
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

// 查看签到记录
const handleViewRecords = (row: SignActivity) => {
  // 这里应该跳转到签到记录页面
  ElMessage.info(`查看签到记录: ${row.title}`)
  // router.push({ name: 'SignRecords', params: { activityId: row.id } })
}

// 导出
const handleExport = async () => {
  try {
    await tableMethods.handleExport(exportSignActivity)
    ElMessage.success(t($t('导出成功')))
  } catch (error) {
    console.error('导出失败:', error)
  }
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
const rewardTypeOptions = REWARD_TYPE_OPTIONS
const statusOptions = [
  { value: ACTIVITY_STATUS.DRAFT, label: t('activity.status.draft') },
  { value: ACTIVITY_STATUS.PUBLISHED, label: t('activity.status.published') }
]
</script>

<style scoped lang="scss">
.app-container {
  .form-section {
    margin-bottom: 20px;
    
    .form-section-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
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
  
  .empty-rewards {
    padding: 20px;
    text-align: center;
    background-color: #f5f7fa;
    border-radius: 4px;
  }
  
  .rewards-list {
    .reward-item {
      padding: 16px;
      margin-bottom: 12px;
      background-color: #f9f9f9;
      border-radius: 4px;
      border: 1px solid #ebeef5;
      
      &:last-child {
        margin-bottom: 0;
      }
      
      .reward-unit {
        display: flex;
        align-items: center;
        height: 100%;
      }
      
      .reward-actions {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
      }
    }
  }
}
</style>