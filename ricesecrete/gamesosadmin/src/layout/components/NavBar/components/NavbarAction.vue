<template>
  <div class="flex">
    <audio ref="audioRef">
      <source src="@/assets/notify.mp3" />
    </audio>
    <template v-if="!isMobile">
      <!--全屏 -->
      <div class="nav-action-item" @click="toggle">
        <svg-icon
          :icon-class="isFullscreen ? 'fullscreen-exit' : 'fullscreen'"
        />
      </div>

      <!-- 布局大小 -->
      <el-tooltip
        :content="$t('SizeSelect_Tooltip')"
        effect="dark"
        placement="bottom"
      >
        <size-select class="nav-action-item" />
      </el-tooltip>

      <!-- 语言选择 -->
      <lang-select class="nav-action-item" />

      <!-- 消息通知 -->
      <el-dropdown class="message nav-action-item" trigger="click">
        <el-badge :value="unreadCount" :max="10">
          <div class="flex-center h100% pt6px">
            <i-ep-bell />
          </div>
        </el-badge>
        <template #dropdown>
          <div class="px-5 py-2">
            <el-tabs v-model="activeTab" @tab-change="playAudio">
              <el-tab-pane
                v-for="(label, key) in MessageTypeLabels"
                :label="label"
                :name="key"
                :key="key"
              >
                <div
                  class="w-[380px] py-2"
                  v-for="message in getFilteredMessages(key)"
                  :key="message.id"
                >
                  <el-link type="primary">
                    <el-text
                      class="w-350px"
                      size="default"
                      truncated
                      @click="readMessage(message.id)"
                    >
                      {{ message.title }}
                    </el-text>
                  </el-link>
                </div>
              </el-tab-pane>
            </el-tabs>
            <el-divider />
            <div class="flex-x-between">
              <el-link
                type="primary"
                :underline="false"
                @click="readAllMessage()"
              >
                <span class="text-xs">全部已读</span>
              </el-link>
            </div>
          </div>
        </template>
      </el-dropdown>
    </template>

    <!-- 用户头像 -->
    <el-dropdown class="nav-action-item" trigger="click">
      <div class="flex-center h100% p10px">
        <img
          :src="userStore.user.avatar + '?imageView2/1/w/80/h/80'"
          class="rounded-full mr-10px w24px h24px"
        />
        <span>{{ userStore.user.username }}</span>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item divided @click="logout">
            {{ $t("Logout") }}
          </el-dropdown-item>
          <el-dropdown-item divided @click="clear_cache">
            {{ $t("Clear_Cache") }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>

    <!-- 设置 -->
    <template v-if="defaultSettings.showSettings">
      <div class="nav-action-item" @click="settingStore.settingsVisible = true">
        <svg-icon icon-class="setting" />
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import {
  useAppStore,
  useTagsViewStore,
  useUserStore,
  useSettingsStore,
} from "@/store";
import defaultSettings from "@/settings";
import { DeviceEnum } from "@/enums/DeviceEnum";
import {
  MessageTypeEnum,
  MessageTypeLabels,
  NotifyMessageItem,
} from "@/enums/MessageTypeEnum";
import { t} from "@/utils/i18n";
const audioRef = ref<HTMLAudioElement | null>(null);
const isPlayAudio = ref(true);
const appStore = useAppStore();
const userStore = useUserStore();
const settingStore = useSettingsStore();
const tagsViewStore = useTagsViewStore();
const router = useRouter();
const route = useRoute();

const isMobile = computed(() => appStore.device === DeviceEnum.MOBILE);

const { isFullscreen, toggle } = useFullscreen();

const activeTab = ref(MessageTypeEnum.MESSAGE);

const unreadCount = computed(() => {
  var length = messages.value.filter((item) => item.status === 0).length;
  return length > 0 ? length : "";
});

const messages = ref<NotifyMessageItem[]>([]);

const getFilteredMessages = (type: MessageTypeEnum) => {
  return messages.value.filter((message) => message.type === type);
};
//读取消息
const readMessage = (id: string) => {
  for (let index = 0; index < messages.value.length; index++) {
    const element = messages.value[index];
    if (element.id === id) {
      element.status = 1;
    }
  }
};
const readAllMessage = () => {
  for (let index = 0; index < messages.value.length; index++) {
    const element = messages.value[index];
    element.status = 1;
  }
};

watch(
  () => userStore.chatData.userMessageCount,
  (newValue, oldValue) => {
    if (newValue > oldValue) {
      playAudio();
    }
  },
  { deep: true }
);

watch(
  [
    () => userStore.chatData.userMessageCount,
    () => userStore.chatData.notifyMessages.length,
  ],
  (
    [newUserMessageCount, newNotifyMessagesLen],
    [oldUserMessageCount, oldNotifyMessagesLen]
  ) => {
    if (newUserMessageCount > oldUserMessageCount) {
      playAudio();
    }
    console.log("newNotifyMessagesLen", newNotifyMessagesLen);
    console.log("oldNotifyMessagesLen", oldNotifyMessagesLen);
    if (newNotifyMessagesLen > oldNotifyMessagesLen) {
      userStore.chatData.notifyMessages.forEach((element: any) => {
        messages.value.push({
          id: element.id,
          title: element.content.title,
          type: element.content.type,
          url: element.content.url,
          status: 0,
        });
      });
      userStore.chatData.notifyMessages = [];
    }
  },
  { deep: true }
);

function playAudio() {
  const audio = audioRef.value;
  if (audio && isPlayAudio.value) {
    isPlayAudio.value = false;
    audio.muted = false;
    audio.play().catch((err) => console.error("播放失败:", err));
    setTimeout(() => {
      isPlayAudio.value = true;
    }, 2000);
  }
}

/* 注销 */
function logout() {
  console.log("logout", userStore.chatData.notifyMessages);
  ElMessageBox.confirm(t("Logout") + "?", t("Tip"), {
    confirmButtonText: t("Confirm"),
    cancelButtonText: t("Cancel"),
    type: "warning",
    lockScroll: false,
  }).then(() => {
    userStore
      .logout()
      .then(() => {
        tagsViewStore.delAllViews();
      })
      .then(() => {
        router.push(`/login?redirect=${route.fullPath}`);
      });
  });
}

/**
 * 清除系统缓存
 */
function clear_cache() {
  ElMessageBox.confirm(
    t("Clear_Cache") + "?",
    t("Tip"),
    {
      confirmButtonText: t("Confirm"),
      cancelButtonText: t("Cancel"),
      type: "warning",
      lockScroll: false,
    }
  ).then(() => {
    userStore.clear_cache().then(() => {
      ElMessage.success(t("Operate_Success"));
    });
  });
}
</script>
<style lang="scss" scoped>
.nav-action-item {
  display: inline-block;
  min-width: 40px;
  height: $navbar-height;
  line-height: $navbar-height;
  color: var(--el-text-color);
  text-align: center;
  cursor: pointer;

  &:hover {
    background: rgb(0 0 0 / 10%);
  }
}

:deep(.message .el-badge__content.is-fixed.is-dot) {
  top: 5px;
  right: 10px;
}

:deep(.el-divider--horizontal) {
  margin: 10px 0;
}

.dark .nav-action-item:hover {
  background: rgb(255 255 255 / 20%);
}

.layout-top .nav-action-item,
.layout-mix .nav-action-item {
  color: #fff;
}
</style>
