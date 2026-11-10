<template>
  <div class="json-viewer">
    <div>
        <div v-for="(item, key) in formattedData" :key="key">
          <el-tag type="success">{{ key }}</el-tag>
          <span>:</span>
          <el-tag type="primary">
            {{ formatValue(item) }}
          </el-tag>
        </div>
      </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { ElTag } from "element-plus";

// 定义 props
interface Props {
  jsonValue: string;
}

const formattedData = ref<Record<string, any>>({});
const props = withDefaults(defineProps<Props>(), {
  jsonValue: () => "{}",
});

// 初始化时解析JSON
onMounted(() => {
  parseJSON(props.jsonValue);
});

// 解析JSON字符串
const parseJSON = (jsonStr: string) => {
  try {
    const parsed = JSON.parse(jsonStr);

    // 确保解析后是对象类型
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      formattedData.value = parsed;
    } else {
      console.warn("JSON解析结果不是对象类型");
      formattedData.value = {};
    }
  } catch (error) {
    console.error("JSON解析错误:", error);
    formattedData.value = {};
  }
};

// 格式化值显示
const formatValue = (value: any): string => {
  if (value === null) return "null";
  if (value === undefined) return "undefined";
  if (typeof value === "string") return `${value}`;
  return String(value);
};

// 监听外部 jsonValue 变化
watch(
  () => props.jsonValue,
  (newVal) => {
    if (newVal) {
      parseJSON(newVal);
    }
  },
  { immediate: true }
);
</script>