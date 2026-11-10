<!-- 会话管理页面 -->
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
            <el-form-item :label="$t('Keyword')" prop="keyword">
              <el-input
                v-model="queryParams.keyword"
                :placeholder="$t('Please_Enter') + ' ' + $t('Keyword')"
                clearable
                @keyup.enter="handleQuery"
              />
            </el-form-item>
            <el-form-item :label="$t('Conversation_Type')" prop="type">
              <el-select
                v-model="queryParams.conversation_type"
                :placeholder="$t('Please_Select')"
                clearable
                filterable
              >
                <el-option
                  :label="$t('Single_Chat')"
                  :value="1"
                />
                <el-option
                  :label="$t('Group_Chat')"
                  :value="2"
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
                  :label="$t('Normal')"
                  :value="1"
                />
                <el-option
                  :label="$t('Deleted')"
                  :value="2"
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
                v-hasPerm="['messageSessionExport']"
                icon="download"
                @click="handleExport"
              >
                {{ $t("Export") }}
              </el-button>
            </div>
          </div>

          <el-table
            v-loading="loading"
            :data="pageData"
            border
            stripe
            highlight-current-row
            class="data-table__content"
            @row-click="handleRowClick"
          >
            <el-table-column :label="$t('Avatar')" align="center" width="80">
              <template #default="scope">
                <el-avatar
                  :size="40"
                  :src="scope.row.avatar"
                  :alt="scope.row.name"
                >
                  <span v-if="!scope.row.avatar">
                    {{ scope.row.name?.charAt(0) || 'C' }}
                  </span>
                </el-avatar>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Conversation_Name')" align="center" prop="name">
              <template #default="scope">
                <div class="conversation-name">
                  <strong>{{ scope.row.name }}</strong>
                  <div class="conversation-id">
                    <small>{{ scope.row.conversation_id }}</small>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Conversation_Type')" align="center" prop="type">
              <template #default="scope">
                <el-tag :type="scope.row.type === 1 ? 'success' : 'primary'">
                  {{ getConversationTypeText(scope.row.type) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Member_Count')" align="center" prop="member_count">
              <template #default="scope">
                <el-tag type="info">
                  {{ scope.row.actual_member_count || scope.row.member_count }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Last_Message')" align="center" prop="last_message_content">
              <template #default="scope">
                <div class="last-message">
                  <div class="message-content">
                    {{ scope.row.last_message_content || $t('No_Message') }}
                  </div>
                  <div class="message-time">
                    <small>{{ formatTime(scope.row.last_message_time) }}</small>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Unread_Count')" align="center" prop="unread_count">
              <template #default="scope">
                <el-badge
                  :value="scope.row.unread_count"
                  :max="99"
                  :hidden="scope.row.unread_count === 0"
                  type="danger"
                >
                  <el-tag :type="scope.row.unread_count > 0 ? 'danger' : 'info'">
                    {{ scope.row.unread_count }}
                  </el-tag>
                </el-badge>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Status')" align="center" prop="status">
              <template #default="scope">
                <el-tag :type="scope.row.status === 1 ? 'success' : 'danger'">
                  {{ getStatusText(scope.row.status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column :label="$t('Create_Time')" align="center" prop="created_at">
              <template #default="scope">
                {{ formatTime(scope.row.created_at) }}
              </template>
            </el-table-column>
            <el-table-column :label="$t('Actions')" align="center" width="180" fixed="right">
              <template #default="scope">
                <el-button
                  type="primary"
                  size="small"
                  icon="view"
                  @click.stop="handleViewMessages(scope.row)"
                >
                  {{ $t("View_Messages") }}
                </el-button>
                <el-button
                  v-hasPerm="['messageSessionDelete']"
                  type="danger"
                  size="small"
                  icon="delete"
                  @click.stop="handleDelete(scope.row)"
                >
                  {{ $t("Delete") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <!-- 分页组件 -->
          <div class="pagination-container">
            <el-pagination
              v-model:current-page="queryParams.page"
              v-model:page-size="queryParams.pageSize"
              :page-sizes="[10, 20, 50, 100]"
              :total="total"
              layout="total, sizes, prev, pager, next, jumper"
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
            />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { useI18n } from "vue-i18n";
import SessionAPI, { type SessionPageQuery, type SessionList, SessionListVO } from "@/api/message/session.api";

// 路由实例
const router = useRouter();
const { t } = useI18n();

// 响应式数据
const loading = ref(false);
const pageData = ref<SessionList[]>([]);
const total = ref(0);

// 查询参数
const queryParams = reactive<SessionPageQuery>({
  page: 1,
  pageSize: 20,
  keywords: "",
  conversation_type: undefined,
  status: undefined
});

// 表单引用
const queryFormRef = ref();

// 生命周期钩子
onMounted(() => {
  getSessionList();
});

// 获取会话列表
const getSessionList = async () => {
  loading.value = true;
  let queryParamsData = {
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    conversation_name: ["like", queryParams.keywords],
    conversation_type: queryParams.conversation_type,
    status: queryParams.status
  };
  SessionAPI.getPage(queryParamsData)
    .then((data: SessionListVO) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
};


// 处理查询
const handleQuery = () => {
  queryParams.page = 1;
  getSessionList();
};

// 重置查询
const handleResetQuery = () => {
  queryFormRef.value?.resetFields();
  queryParams.page = 1;
  queryParams.pageSize = 20;
  getSessionList();
};

// 处理分页大小变化
const handleSizeChange = (val: number) => {
  queryParams.pageSize = val;
  getSessionList();
};

// 处理页码变化
const handleCurrentChange = (val: number) => {
  queryParams.page = val;
  getSessionList();
};

// 处理行点击
const handleRowClick = (row: SessionList) => {
  handleViewMessages(row);
};

// 查看消息
const handleViewMessages = (row: SessionList) => {
  router.push({
    path: "/message/list",
    query: {
      sessionId: row.conversation_id,
      sessionName: row.conversation_name
    }
  });
};

// 删除会话
const handleDelete = async (row: SessionList) => {
  try {
    await ElMessageBox.confirm(
      t('Confirm_Delete_Content', { name: row.conversation_name }),
      t('Confirm_Delete_Title'),
      {
        confirmButtonText: t('Confirm'),
        cancelButtonText: t('Cancel'),
        type: "warning"
      }
    );

    await SessionAPI.deleteByIds({ conversation_ids: [row.conversation_id] });
    ElMessage.success(t('Delete_Success'));
    getSessionList();
  } catch (error) {
    if (error !== "cancel") {
      console.error(t('Delete_Failed'), error);
      ElMessage.error(t('Delete_Failed'));
    }
  }
};

// 导出数据
const handleExport = async () => {
  try {
    loading.value = true;
    // TODO: 实现导出功能
    ElMessage.info(t('Feature_In_Development'));
  } catch (error) {
    console.error(t('Export_Failed'), error);
    ElMessage.error(t('Export_Failed'));
  } finally {
    loading.value = false;
  }
};

// 格式化时间
const formatTime = (time?: string) => {
  if (!time) return "-";
  return new Date(time).toLocaleString();
};

// 获取会话类型文本
const getConversationTypeText = (type: number) => {
  if (type === 1) {
    return t('Single_Chat');
  } else if (type === 2) {
    return t('Group_Chat');
  }
  return '';
};

// 获取状态文本
const getStatusText = (status: number) => {
  if (status === 1) {
    return t('Normal');
  } else if (status === 2) {
    return t('Deleted');
  }
  return '';
};
</script>

<style scoped lang="scss">
.app-container {
  padding: 20px;
}

.search-container {
  margin-bottom: 20px;
  padding: 20px;
  background-color: #f8f9fa;
  border-radius: 4px;

  .search-buttons {
    margin-left: 10px;
  }
}

.data-table {
  margin-bottom: 20px;

  &__toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    &--actions {
      display: flex;
      gap: 8px;
    }
  }

  &__content {
    width: 100%;
  }
}

.conversation-name {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .conversation-id {
    margin-top: 4px;
    color: #909399;
    font-size: 12px;
  }
}

.last-message {
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  .message-content {
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-align: left;
  }

  .message-time {
    margin-top: 4px;
    color: #909399;
    font-size: 12px;
  }
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}
</style>