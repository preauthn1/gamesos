<!-- 消息管理页面 -->
<template>
  <div class="message-container">
    <!-- 顶部导航栏 -->
    <div class="message-header">
      <el-button type="primary" icon="arrow-left" @click="handleBack">
        {{ $t("Back") }}
      </el-button>
      <div class="session-info">
        <h3>{{ sessionName || $t("Message_List") }}</h3>
        <div class="session-meta">
          <el-tag size="small" type="info">
            {{ sessionId }}
          </el-tag>
          <el-tag v-if="unreadCount > 0" size="small" type="danger">
            {{ $t("Unread") }}: {{ unreadCount }}
          </el-tag>
        </div>
      </div>
      <div class="header-actions">
        <el-button
          v-hasPerm="['messageExport']"
          icon="download"
          @click="handleExport"
        >
          {{ $t("Export") }}
        </el-button>
        <el-button
          v-if="unreadCount > 0"
          type="success"
          icon="check"
          @click="handleMarkAllRead"
        >
          {{ $t("Mark_All_Read") }}
        </el-button>
      </div>
    </div>

    <!-- 消息列表区域 -->
    <div ref="messageListRef" class="message-list" @scroll="handleScroll">
      <div v-if="loading && messageList.length === 0" class="loading-container">
        <el-skeleton :rows="10" animated />
      </div>

      <div v-else-if="messageList.length === 0" class="empty-container">
        <el-empty :description="$t('No_Messages')" />
      </div>

      <div v-else class="messages">
        <!-- 加载更多提示 -->
        <div v-if="hasMore && !loading" class="load-more">
          <el-button
            type="text"
            :loading="loadingMore"
            @click="loadMoreMessages"
          >
            {{ $t("Load_More") }}
          </el-button>
        </div>

        <!-- 消息列表 -->
        <div
          v-for="message in messageList"
          :key="message.message_id"
          :class="[
            'message-item',
            { 'message-item--sent': isSentByCurrentUser(message) },
          ]"
        >
          <!-- 消息气泡 -->
          <div class="message-bubble">
            <!-- 消息头部 -->
            <div class="message-header">
              <div class="message-sender">
                <el-avatar
                  :size="24"
                  :src="message.sender_info?.avatar"
                  :alt="message.sender_info?.username"
                />
                <span class="sender-name">
                  {{
                    message.sender_info?.username || `用户${message.sender_id}`
                  }}
                </span>
              </div>
              <div class="message-time">
                {{ formatMessageTime(message.created_at) }}
              </div>
            </div>

            <!-- 消息内容 -->
            <div class="message-content">
              <!-- 文本消息 -->
              <div v-if="message.type === 1" class="text-message">
                {{ message.content }}
              </div>

              <!-- 图片消息 -->
              <div v-else-if="message.type === 2" class="image-message">
                <el-image
                  :src="message.extra?.attachment_url || message.content"
                  :preview-src-list="[
                    message.extra?.attachment_url || message.content,
                  ]"
                  fit="cover"
                  style="
                    max-width: 200px;
                    max-height: 200px;
                    border-radius: 4px;
                  "
                  lazy
                  :hide-on-click-modal="true"
                  :preview-teleported="true"
                />
              </div>

              <!-- 文件消息 -->
              <div v-else-if="message.type === 4" class="file-message">
                <div class="file-info">
                  <el-icon size="24" style="margin-right: 8px">
                    <Document />
                  </el-icon>
                  <div class="file-details">
                    <div class="file-name">
                      {{ message.extra?.attachment_name || "文件" }}
                    </div>
                    <div class="file-size">
                      {{ formatFileSize(message.extra?.attachment_size) }}
                    </div>
                  </div>
                  <el-button
                    v-if="message.extra?.attachment_url"
                    type="text"
                    @click="handleDownloadFile(message)"
                  >
                    下载
                  </el-button>
                </div>
              </div>

              <!-- 系统消息 -->
              <div v-else-if="message.type === 7" class="system-message">
                <el-alert
                  :title="message.content"
                  type="info"
                  :closable="false"
                  show-icon
                />
              </div>

              <!-- 其他类型消息 -->
              <div v-else class="other-message">
                [{{ getMessageTypeText(message.type) }}] {{ message.content }}
              </div>
            </div>

            <!-- 消息状态 -->
            <div class="message-status">
              <!-- 已读状态 -->
              <span v-if="isSentByCurrentUser(message)" class="read-status">
                <el-icon v-if="message.extra?.read_count" color="#67C23A">
                  <Check />
                </el-icon>
              </span>

              <!-- 消息操作 -->
              <div class="message-actions">
                <el-dropdown
                  trigger="click"
                  @command="(command) => handleMessageCommand(command, message)"
                >
                  <el-button type="text" size="small" icon="more" />
                  <template #dropdown>
                    <el-dropdown-menu>
                      <el-dropdown-item
                        v-if="isSentByCurrentUser(message)"
                        command="edit"
                      >
                        {{ $t("Edit") }}
                      </el-dropdown-item>
                      <el-dropdown-item command="delete">
                        {{ $t("Delete") }}
                      </el-dropdown-item>
                      <el-dropdown-item command="copy">
                        {{ $t("Copy") }}
                      </el-dropdown-item>
                      <el-dropdown-item command="reply">
                        {{ $t("Reply") }}
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </template>
                </el-dropdown>
              </div>
            </div>
          </div>
        </div>

        <!-- 滚动到底部提示 -->
        <div v-if="!hasMore" class="no-more">
          <el-divider>
            <el-text type="info">{{ $t("No_More_Messages") }}</el-text>
          </el-divider>
        </div>
      </div>
    </div>

    <!-- 消息输入区域 -->
    <div class="message-input-container">
      <el-form
        ref="messageFormRef"
        :model="messageForm"
        :rules="messageRules"
        @submit.prevent="handleSendMessage"
      >
        <el-form-item prop="content">
          <el-input
            v-model="messageForm.content"
            type="textarea"
            :rows="3"
            :placeholder="$t('Please_Enter_Message')"
            :maxlength="1000"
            show-word-limit
            resize="none"
            @keydown.enter.exact.prevent="handleSendMessage"
          />
        </el-form-item>
        <div class="input-actions">
          <div class="input-tools">
            <el-button type="text" icon="picture" @click="handleUploadImage">
              {{ $t("Image") }}
            </el-button>
            <el-button type="text" icon="upload" @click="handleUploadFile">
              {{ $t("File") }}
            </el-button>
            <el-button type="text" icon="emoji" @click="handleInsertEmoji">
              {{ $t("Emoji") }}
            </el-button>
          </div>
          <el-button
            type="primary"
            :loading="sending"
            :disabled="!messageForm.content.trim()"
            @click="handleSendMessage"
          >
            {{ $t("Send") }}
          </el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, nextTick, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ElMessage, ElMessageBox } from "element-plus";
import { Document, Check } from "@element-plus/icons-vue";
import MessageAPI, {
  type MessagePageQuery,
  type MessageList,
} from "@/api/message/message.api";
import SessionAPI from "@/api/message/session.api";
import { useUserStore } from "@/store/modules/user";

// 路由实例
const route = useRoute();
const router = useRouter();

// 添加用户store实例
const userStore = useUserStore();

// DOM 引用
const messageListRef = ref<HTMLElement>();
const messageFormRef = ref();

// 响应式数据
const loading = ref(false);
const loadingMore = ref(false);
const sending = ref(false);
const messageList = ref<MessageList[]>([]);
const total = ref(0);
const hasMore = ref(true);
const unreadCount = ref(0);

// 会话信息
const sessionId = computed(() => (route.query.sessionId as string) || "");
const sessionName = computed(() => (route.query.sessionName as string) || "");

// 添加当前用户ID计算属性
const currentUserId = computed(() => userStore.userInfo.user_id);

// 查询参数
const queryParams = reactive<MessagePageQuery>({
  conversation_id: "",
  page: 1,
  pageSize: 20,
});

// 消息表单
const messageForm = reactive({
  content: "",
});

// 表单验证规则
const messageRules = {
  content: [
    { required: true, message: "请输入消息内容", trigger: "blur" },
    { max: 1000, message: "消息内容不能超过1000个字符", trigger: "blur" },
  ],
};

// 生命周期钩子
onMounted(() => {
  if (!sessionId.value) {
    ElMessage.warning("请先选择会话");
    router.push("/message/session");
    return;
  }

  queryParams.conversation_id = sessionId.value;
  loadSessionInfo();
  getMessageList();
});

// 加载会话信息
const loadSessionInfo = async () => {
  try {
    const response = await SessionAPI.getInfo({
      conversation_id: sessionId.value,
    });
    unreadCount.value = response?.unread_count || 0;
  } catch (error) {
    console.error("加载会话信息失败:", error);
  }
};

// 获取消息列表
const getMessageList = async (loadMore = false) => {
  try {
    if (loadMore) {
      loadingMore.value = true;
      queryParams.page += 1;
    } else {
      loading.value = true;
      queryParams.page = 1;
    }

    const response = await MessageAPI.getPage(queryParams);

    if (loadMore) {
      messageList.value = [...response.list, ...messageList.value];
    } else {
      messageList.value = response.list;
      // 滚动到底部
      nextTick(() => {
        scrollToBottom();
      });
    }

    total.value = response.total;
    hasMore.value = messageList.value.length < total.value;

    // 更新未读计数
    if (!loadMore && unreadCount.value > 0) {
      await handleMarkAllRead();
    }
  } catch (error) {
    console.error("获取消息列表失败:", error);
    ElMessage.error("获取消息列表失败");
  } finally {
    loading.value = false;
    loadingMore.value = false;
  }
};

// 加载更多消息
const loadMoreMessages = () => {
  getMessageList(true);
};

// 处理滚动
const handleScroll = () => {
  if (!messageListRef.value) return;

  const { scrollTop } = messageListRef.value;
  if (scrollTop === 0 && hasMore.value && !loadingMore.value) {
    loadMoreMessages();
  }
};

// 滚动到底部
const scrollToBottom = () => {
  if (!messageListRef.value) return;

  nextTick(() => {
    messageListRef.value!.scrollTop = messageListRef.value!.scrollHeight;
  });
};

// 发送消息
const handleSendMessage = async () => {
  try {
    await messageFormRef.value?.validate();

    sending.value = true;

    const response = await MessageAPI.create({
      conversation_id: sessionId.value,
      content: messageForm.content.trim(),
    });

    // 添加新消息到列表
    const newMessage: MessageList = {
      message_id: response.data.message_id || Date.now().toString(),
      conversation_id: response.data.conversation_id || sessionId.value,
      sender_id: currentUserId.value || 0,
      type: 1,
      content: messageForm.content,
      status: 1,
      created_at: response.data.created_at || new Date().toISOString(),
      updated_at: response.data.updated_at || new Date().toISOString(),
      sender_info: {
        user_id: currentUserId.value || 0,
        username: userStore.userInfo?.username || "",
      },
    };

    messageList.value.push(newMessage);
    messageForm.content = "";

    // 滚动到底部
    nextTick(() => {
      scrollToBottom();
    });

    ElMessage.success("发送成功");
  } catch (error) {
    console.error("发送消息失败:", error);
    ElMessage.error("发送消息失败");
  } finally {
    sending.value = false;
  }
};

// 删除消息
const handleDeleteMessage = async (message: MessageList) => {
  try {
    await ElMessageBox.confirm(
      "确定要删除这条消息吗？删除后无法恢复。",
      "确认删除",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );

    await MessageAPI.deleteByIds({ message_ids: [message.message_id] });

    // 从列表中移除
    const index = messageList.value.findIndex(
      (m) => m.message_id === message.message_id
    );
    if (index !== -1) {
      messageList.value.splice(index, 1);
    }

    ElMessage.success("删除消息成功");
  } catch (error) {
    if (error !== "cancel") {
      console.error("删除消息失败:", error);
      ElMessage.error("删除消息失败");
    }
  }
};

// 标记所有已读
const handleMarkAllRead = async () => {
  try {
    await MessageAPI.batchMarkRead({
      user_id: parseInt(currentUserId.value.toString()), // 确保转换为数字
      conversation_ids: [sessionId.value],
    });

    unreadCount.value = 0;
    ElMessage.success("已标记所有消息为已读");
  } catch (error) {
    console.error("标记已读失败:", error);
    ElMessage.error("标记已读失败");
  }
};

// 处理消息命令
const handleMessageCommand = (command: string, message: MessageList) => {
  switch (command) {
    case "delete":
      handleDeleteMessage(message);
      break;
    case "copy":
      handleCopyMessage(message);
      break;
    case "edit":
      handleEditMessage(message);
      break;
    case "reply":
      handleReplyMessage(message);
      break;
  }
};

// 复制消息
const handleCopyMessage = (message: MessageList) => {
  navigator.clipboard
    .writeText(message.content)
    .then(() => {
      ElMessage.success("已复制到剪贴板");
    })
    .catch(() => {
      ElMessage.error("复制失败");
    });
};

// 编辑消息
const handleEditMessage = (message: MessageList) => {
  ElMessage.info("编辑功能开发中...");
};

// 回复消息
const handleReplyMessage = (message: MessageList) => {
  messageForm.content = `回复 ${message.sender_info?.username || "用户"}: ${message.content}\n`;
  nextTick(() => {
    const textarea = document.querySelector(
      ".message-input-container textarea"
    ) as HTMLTextAreaElement;
    if (textarea) {
      textarea.focus();
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
    }
  });
};

// 上传图片
const handleUploadImage = () => {
  ElMessage.info("图片上传功能开发中...");
};

// 上传文件
const handleUploadFile = () => {
  ElMessage.info("文件上传功能开发中...");
};

// 插入表情
const handleInsertEmoji = () => {
  ElMessage.info("表情功能开发中...");
};

// 下载文件
const handleDownloadFile = (message: MessageList) => {
  if (message.extra?.attachment_url) {
    window.open(message.extra.attachment_url, "_blank");
  }
};

// 导出消息
const handleExport = async () => {
  try {
    loading.value = true;
    const response = await MessageAPI.export({
      conversation_id: sessionId.value,
    });

    // 创建下载链接
    const dataStr = JSON.stringify(response.data, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `messages_${sessionId.value}_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
    ElMessage.success("导出成功");
  } catch (error) {
    console.error("导出失败:", error);
    ElMessage.error("导出失败");
  } finally {
    loading.value = false;
  }
};

// 返回会话列表
const handleBack = () => {
  router.push("/message/session");
};

// 判断消息是否由当前用户发送
const isSentByCurrentUser = (message: MessageList) => {
  // 修改参数类型为 MessageList
  return message.sender_id === currentUserId.value;
};

// 格式化消息时间
const formatMessageTime = (time: string) => {
  const date = new Date(time);
  const now = new Date();

  // 如果是今天，只显示时间
  if (date.toDateString() === now.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  // 如果是昨天
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  if (date.toDateString() === yesterday.toDateString()) {
    return `昨天 ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  // 如果是今年，显示月日
  if (date.getFullYear() === now.getFullYear()) {
    return `${date.getMonth() + 1}月${date.getDate()}日 ${date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  }

  // 其他情况显示完整日期
  return date.toLocaleString();
};

// 格式化文件大小
const formatFileSize = (bytes?: number) => {
  if (!bytes) return "未知大小";

  const units = ["B", "KB", "MB", "GB"];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex++;
  }

  return `${size.toFixed(1)} ${units[unitIndex]}`;
};

// 获取消息类型文本
const getMessageTypeText = (type: number) => {
  const typeMap: Record<number, string> = {
    1: "文本",
    2: "图片",
    3: "语音",
    4: "文件",
    5: "视频",
    6: "位置",
    7: "系统",
  };

  return typeMap[type] || "未知";
};
</script>

<style scoped lang="scss">
.message-container {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 84px);
  padding: 20px;
  background-color: #f5f5f5;
}

.message-header {
  display: flex;
  align-items: center;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px 8px 0 0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  margin-bottom: 1px;

  .session-info {
    flex: 1;
    margin-left: 16px;

    h3 {
      margin: 0 0 4px 0;
      font-size: 18px;
      font-weight: 600;
    }

    .session-meta {
      display: flex;
      gap: 8px;
      align-items: center;
    }
  }

  .header-actions {
    display: flex;
    gap: 8px;
  }
}

.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 0 0 8px 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .loading-container,
  .empty-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
  }

  .load-more {
    text-align: center;
    padding: 16px;
  }

  .messages {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .no-more {
    margin-top: 16px;
  }
}

.message-item {
  display: flex;
  max-width: 70%;

  &--sent {
    align-self: flex-end;
    flex-direction: row-reverse;

    .message-bubble {
      background-color: #95ec69;
      border-radius: 12px 12px 0 12px;
    }

    .message-header {
      flex-direction: row-reverse;
    }

    .message-sender {
      flex-direction: row-reverse;
    }

    .sender-name {
      margin-right: 8px;
      margin-left: 0;
    }

    .message-status {
      flex-direction: row-reverse;
    }

    .message-actions {
      margin-right: 8px;
      margin-left: 0;
    }
  }
}

.message-bubble {
  background-color: #fff;
  border-radius: 12px 12px 12px 0;
  padding: 12px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.message-sender {
  display: flex;
  align-items: center;
}

.sender-name {
  margin-left: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.message-time {
  font-size: 12px;
  color: #999;
}

.message-content {
  margin-bottom: 8px;

  .text-message {
    font-size: 14px;
    line-height: 1.5;
    color: #333;
    word-break: break-word;
  }

  .image-message {
    cursor: pointer;
    transition: opacity 0.2s;

    &:hover {
      opacity: 0.9;
    }
  }

  .file-message {
    .file-info {
      display: flex;
      align-items: center;
      padding: 12px;
      background-color: #f8f9fa;
      border-radius: 6px;
      border: 1px solid #e9ecef;

      .file-details {
        flex: 1;
        margin-left: 12px;

        .file-name {
          font-weight: 500;
          margin-bottom: 4px;
        }

        .file-size {
          font-size: 12px;
          color: #6c757d;
        }
      }
    }
  }

  .system-message {
    margin: 8px 0;
  }

  .other-message {
    padding: 8px;
    background-color: #f8f9fa;
    border-radius: 4px;
    font-size: 14px;
    color: #6c757d;
  }
}

.message-status {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .read-status {
    display: flex;
    align-items: center;
  }

  .message-actions {
    margin-left: 8px;
    opacity: 0;
    transition: opacity 0.2s;

    .message-item:hover & {
      opacity: 1;
    }
  }
}

.message-input-container {
  margin-top: 16px;
  padding: 16px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .input-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;

    .input-tools {
      display: flex;
      gap: 12px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .message-container {
    height: calc(100vh - 60px);
    padding: 10px;
  }

  .message-item {
    max-width: 85%;
  }

  .message-header {
    padding: 12px;

    h3 {
      font-size: 16px;
    }
  }

  .message-list {
    padding: 12px;
  }

  .message-bubble {
    padding: 10px;
  }
}
</style>
