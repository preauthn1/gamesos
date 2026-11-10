<template>
  <div class="logo-container">
    <transition enter-active-class="animate__animated animate__fadeInLeft">
      <router-link class="wh-full flex-center" to="/" :key="+collapse">
        <img :src="logo" class="logo-image" />
        <div class="logo-text" v-if="!collapse">
          <span class="logo-title">
            {{ defaultSettings.title }}
          </span>
          <span class="logo-time">
            {{ currentTime }}
          </span>
        </div>
      </router-link>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import logo from "@/assets/logo.png";
import defaultSettings from "@/settings";
import { ref, onMounted, onUnmounted } from "vue";

defineProps({
  collapse: {
    type: Boolean,
    required: true,
  },
});

const sys_time = ref(defaultSettings.sys_time);

const currentTime = ref("");
let timeInterval: number | null = null;

const updateTime = () => {
  // "sys_time": 1765784172,
  // "sys_timezone": "Asia/Hong_Kong"

  const now = new Date(sys_time.value * 1000);
  sys_time.value++;
  currentTime.value = new Intl.DateTimeFormat("zh-CN", {
    timeZone: defaultSettings.sys_timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(now);
};

onMounted(() => {
  updateTime();
  timeInterval = window.setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval);
  }
});
</script>

<style lang="scss" scoped>
.logo-container {
  width: 100%;
  height: $navbar-height;
  background-color: $sidebar-logo-background;
  display: flex;
  align-items: center;

  .logo-image {
    width: 20px;
    height: 20px;
  }

  .logo-text {
    display: flex;
    flex-direction: column;
    margin-left: 10px;
  }

  .logo-title {
    flex-shrink: 0;
    font-size: 14px;
    font-weight: bold;
    color: white;
  }

  .logo-time {
    flex-shrink: 0;
    font-size: 12px;
    color: #ccc;
    margin-top: 4px;
  }
}

.layout-top,
.layout-mix {
  .logo-container {
    width: $sidebar-width;
  }

  &.hideSidebar {
    .logo-container {
      width: $sidebar-width-collapsed;
    }
  }
}
</style>
