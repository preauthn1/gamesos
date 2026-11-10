<script setup>
import { ref, onMounted, onUnmounted, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user.js'
import tokenManager from '@/utils/token-manager.js'
import { toast } from '@/composables/useToast.js'
import SockJS from 'sockjs-client/dist/sockjs'
import { Client } from '@stomp/stompjs'

const router = useRouter()
const userStore = useUserStore()

// 聊天消息列表
const messages = ref([])
// 输入框内容
const inputMessage = ref('')
// 连接状态
const connected = ref(false)
const connecting = ref(false)
// 消息列表容器引用
const messageListRef = ref(null)

// STOMP 客户端
let stompClient = null

// 当前用户名
const currentUser = computed(() => {
  return userStore.userInfo?.username || userStore.userInfo?.nick_name || '匿名用户'
})

// 当前用户ID（API返回的sender是user_id）
const currentUserId = computed(() => {
  return String(userStore.userInfo?.user_id || '')
})

// 聊天服务器地址
const CHAT_BASE_URL = 'http://192.168.12.84:8077'
const CHAT_WS_URL = `${CHAT_BASE_URL}/game-bet/ws`
const CHAT_HISTORY_URL = `${CHAT_BASE_URL}/game-bet/chat/queryChatPageList`

// 连接聊天 WebSocket
const connectChat = () => {
  const token = tokenManager.getToken()
  if (!token) {
    toast('请先登录', 'warning')
    userStore.openLoginModal()
    return
  }

  connecting.value = true

  const socket = new SockJS(CHAT_WS_URL)

  stompClient = new Client({
    webSocketFactory: () => socket,
    connectHeaders: {
      Authorization: `Bearer ${token}`
    },
    debug: (str) => {
      console.log('[Chat STOMP]', str)
    },
    onConnect: (frame) => {
      console.log('聊天室已连接:', frame)
      connected.value = true
      connecting.value = false

      // 订阅群聊消息
      stompClient.subscribe('/topic/chatroom', (message) => {
        try {
          const msg = JSON.parse(message.body)
          addMessage(msg)
        } catch (e) {
          console.error('解析群聊消息失败:', e)
        }
      })

      // 订阅私聊消息
      stompClient.subscribe('/user/queue/private', (message) => {
        try {
          const msg = JSON.parse(message.body)
          msg._private = true
          addMessage(msg)
        } catch (e) {
          console.error('解析私聊消息失败:', e)
        }
      })

      // 发送加入聊天室通知
      stompClient.publish({
        destination: '/app/chat.addUser',
        body: JSON.stringify({})
      })

      addSystemMessage('已连接到聊天室')
    },
    onStompError: (frame) => {
      console.error('STOMP 错误:', frame)
      connected.value = false
      connecting.value = false
      addSystemMessage('连接出错，请重试')
    },
    onWebSocketClose: () => {
      connected.value = false
      connecting.value = false
    }
  })

  stompClient.activate()
}

// 断开连接
const disconnectChat = () => {
  if (stompClient && stompClient.active) {
    stompClient.deactivate()
    stompClient = null
    connected.value = false
    addSystemMessage('已断开连接')
  }
}

// 发送群聊消息
const sendMessage = () => {
  const content = inputMessage.value.trim()
  if (!content) return
  if (!stompClient || !connected.value) {
    toast('未连接到聊天室', 'warning')
    return
  }

  stompClient.publish({
    destination: '/app/chat.sendMessage',
    body: JSON.stringify({
      content: content,
      type: 'CHAT'
    })
  })

  inputMessage.value = ''
}

// 添加消息到列表
const addMessage = (msg) => {
  messages.value.push({
    ...msg,
    id: Date.now() + Math.random(),
    time: new Date().toLocaleTimeString()
  })
  scrollToBottom()
}

// 添加系统消息
const addSystemMessage = (text) => {
  messages.value.push({
    id: Date.now() + Math.random(),
    type: 'SYSTEM',
    content: text,
    time: new Date().toLocaleTimeString()
  })
  scrollToBottom()
}

// 格式化时间
const formatTime = (isoStr) => {
  try {
    const date = new Date(isoStr)
    return date.toLocaleTimeString()
  } catch {
    return ''
  }
}

// 获取聊天历史记录
const fetchChatHistory = async () => {
  const token = tokenManager.getToken()
  if (!token) return

  try {
    const res = await fetch(CHAT_HISTORY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ current: 1, size: 50 })
    })
    const result = await res.json()
    if (result.code === 0 && result.data?.list) {
      const historyMessages = result.data.list.map(item => ({
        id: item.id,
        sender: item.sender,
        content: item.content,
        type: item.type,
        _private: item.type === 'PRIVATE',
        time: formatTime(item.create_time)
      }))
      // 按id正序排列（旧消息在前）
      historyMessages.sort((a, b) => a.id - b.id)
      messages.value = historyMessages
      scrollToBottom()
    }
  } catch (e) {
    console.error('获取聊天记录失败:', e)
  }
}

// 滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (messageListRef.value) {
      messageListRef.value.scrollTop = messageListRef.value.scrollHeight
    }
  })
}

// 返回上一页
const goBack = () => {
  router.back()
}

onMounted(() => {
  fetchChatHistory()
  connectChat()
})

onUnmounted(() => {
  disconnectChat()
})
</script>

<template>
  <div class="chatroom-page">
    <!-- 顶部导航栏 -->
    <div class="chatroom-header">
      <button class="back-btn" @click="goBack">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M15 18L9 12L15 6" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </button>
      <div class="header-title">聊天室</div>
      <div class="header-status">
        <span class="status-dot" :class="{ online: connected, connecting: connecting }"></span>
        <span class="status-text">{{ connected ? '在线' : connecting ? '连接中...' : '离线' }}</span>
      </div>
    </div>

    <!-- 消息列表 -->
    <div class="message-list" ref="messageListRef">
      <div
        v-for="msg in messages"
        :key="msg.id"
        class="message-item"
        :class="{
          'system-msg': msg.type === 'SYSTEM' || msg.type === 'JOIN' || msg.type === 'LEAVE',
          'self-msg': msg.sender === currentUser || msg.sender === currentUserId,
          'private-msg': msg._private
        }"
      >
        <!-- 系统消息 -->
        <div v-if="msg.type === 'SYSTEM' || msg.type === 'JOIN' || msg.type === 'LEAVE'" class="system-bubble">
          <template v-if="msg.type === 'JOIN'">{{ msg.sender }} 加入了聊天室</template>
          <template v-else-if="msg.type === 'LEAVE'">{{ msg.sender }} 离开了聊天室</template>
          <template v-else>{{ msg.content }}</template>
        </div>

        <!-- 聊天消息 -->
        <template v-else>
          <div class="msg-header">
            <span class="msg-sender">{{ msg.sender || '未知用户' }}</span>
            <span v-if="msg._private" class="private-tag">[私信]</span>
            <span class="msg-time">{{ msg.time }}</span>
          </div>
          <div class="msg-bubble">
            {{ msg.content }}
          </div>
        </template>
      </div>

      <!-- 空状态 -->
      <div v-if="messages.length === 0" class="empty-state">
        <p>暂无消息，发送第一条消息吧</p>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <input
        v-model="inputMessage"
        type="text"
        class="message-input"
        placeholder="输入消息..."
        :disabled="!connected"
        @keyup.enter="sendMessage"
      />
      <button
        class="send-btn"
        :disabled="!connected || !inputMessage.trim()"
        @click="sendMessage"
      >
        发送
      </button>
    </div>
  </div>
</template>

<style scoped>
.chatroom-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #0a1a0f;
  color: #fff;
}

/* 顶部导航 */
.chatroom-header {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: #0f2518;
  border-bottom: 1px solid #1a3a25;
  flex-shrink: 0;
}

.back-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.header-title {
  flex: 1;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
}

.header-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #666;
}

.status-dot.online {
  background: #4caf50;
}

.status-dot.connecting {
  background: #ff9800;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.status-text {
  color: #aaa;
}

/* 消息列表 */
.message-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.message-item {
  max-width: 80%;
}

.message-item.self-msg {
  align-self: flex-end;
}

.message-item.system-msg {
  align-self: center;
  max-width: 100%;
}

/* 系统消息 */
.system-bubble {
  background: rgba(255, 255, 255, 0.1);
  padding: 6px 16px;
  border-radius: 12px;
  font-size: 12px;
  color: #888;
  text-align: center;
}

/* 聊天消息 */
.msg-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
  font-size: 12px;
}

.msg-sender {
  color: #4caf50;
  font-weight: 500;
}

.self-msg .msg-sender {
  color: #2196f3;
}

.private-tag {
  color: #ff9800;
  font-size: 11px;
}

.msg-time {
  color: #666;
  margin-left: auto;
}

.msg-bubble {
  background: #1a3a25;
  padding: 10px 14px;
  border-radius: 12px;
  border-top-left-radius: 4px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.self-msg .msg-bubble {
  background: #1a3050;
  border-top-left-radius: 12px;
  border-top-right-radius: 4px;
}

.private-msg .msg-bubble {
  border-left: 2px solid #ff9800;
}

/* 空状态 */
.empty-state {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #555;
  font-size: 14px;
}

/* 输入区域 */
.input-area {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 10px;
  background: #0f2518;
  border-top: 1px solid #1a3a25;
  flex-shrink: 0;
}

.message-input {
  flex: 1;
  height: 40px;
  padding: 0 14px;
  border: 1px solid #1a3a25;
  border-radius: 20px;
  background: #0a1a0f;
  color: #fff;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;
}

.message-input:focus {
  border-color: #4caf50;
}

.message-input:disabled {
  opacity: 0.5;
}

.message-input::placeholder {
  color: #555;
}

.send-btn {
  height: 40px;
  padding: 0 20px;
  border: none;
  border-radius: 20px;
  background: #4caf50;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
  flex-shrink: 0;
}

.send-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.send-btn:not(:disabled):active {
  opacity: 0.8;
}
</style>
