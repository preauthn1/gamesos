<template>
  <div class="dashboard-container">
    <!-- github 角标 -->
    <github-corner class="github-corner" />
    <!-- 数据统计 -->
    <el-row :gutter="10" class="mt-5">
      <el-col :span="6">
        <el-card shadow="never">
          <div class="flex-x-between mt-2 text-sm text-gray">
            <span class="text-black">管理员人数</span>
            <span>11</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div class="flex-x-between mt-2 text-sm text-gray">
            <span class="text-black">总用户人数</span>
            <span>22</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div class="flex-x-between mt-2 text-sm text-gray">
            <span class="text-black">会员用户人数</span>
            <span>33</span>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="never">
          <div class="flex-x-between mt-2 text-sm text-gray">
            <span class="text-black">超级会员人数</span>
            <span>44</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from "vue";

defineOptions({
  name: "Dashboard",
  inheritAttrs: false,
});

import { StatisticsStatsVO } from "@/api/user";

const statisticsStats = ref<StatisticsStatsVO>();
// 组件挂载后加载访客统计数据和通知公告数据
onMounted(() => {});
</script>

<style lang="scss" scoped>
.dashboard-container {
  position: relative;
  padding: 24px;

  .github-corner {
    position: absolute;
    top: 0;
    right: 0;
    z-index: 1;
    border: 0;
  }

  .version-item {
    padding: 16px;
    margin-bottom: 12px;
    background: var(--el-fill-color-lighter);
    border-radius: 8px;
    transition: all 0.2s;

    &.latest-item {
      background: var(--el-color-primary-light-9);
      border: 1px solid var(--el-color-primary-light-5);
    }
    &:hover {
      transform: translateX(5px);
    }
    .version-content {
      margin-bottom: 12px;
      font-size: 13px;
      line-height: 1.5;
      color: var(--el-text-color-secondary);
    }
  }
}
</style>
