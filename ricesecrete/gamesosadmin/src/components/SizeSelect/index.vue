<template>
  <el-dropdown trigger="click" @command="handleSizeChange">
    <div>
      <svg-icon icon-class="size" />
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of sizeOptions"
          :key="item.value"
          :disabled="appStore.size == item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { SizeEnum } from "@/enums/SizeEnum";
import { useAppStore } from "@/store/modules/app";

const { t } = useI18n();
const sizeOptions = computed(() => {
  return [
    { label: t("SizeSelect_Default"), value: SizeEnum.DEFAULT },
    { label: t("SizeSelect_Large"), value: SizeEnum.LARGE },
    { label: t("SizeSelect_Small"), value: SizeEnum.SMALL },
  ];
});

const appStore = useAppStore();
function handleSizeChange(size: string) {
  appStore.changeSize(size);
  ElMessage.success(t("SizeSelect_Message_Success"));
}
</script>
