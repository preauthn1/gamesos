<template>
  <div class="json-string-editor">
    <div class="editor-header">
      <el-button size="small" @click="formatJson">
        {{ $t('Format_JSON') }}
      </el-button>
      <el-button size="small" @click="compressJson">
        {{ $t('Compress_JSON') }}
      </el-button>
    </div>
    <el-input
      v-model="internalValue"
      type="textarea"
      :rows="12"
      @input="onInput"
    />
    <div v-if="error" class="error-message">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { t} from "@/utils/i18n";
// 定义 props
interface Props {
  modelValue: string;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => '{}',
});

// 定义 emits
const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

// 内部值和错误状态
const internalValue = ref<string>(props.modelValue);
const error = ref<string>('');

// 验证 JSON 格式
const validateJson = (value: string): boolean => {
  if (!value.trim()) {
    error.value = '';
    return true;
  }
  
  try {
    JSON.parse(value);
    error.value = '';
    return true;
  } catch (e: any) {
    error.value = e.message;
    return false;
  }
};

// 格式化 JSON
const formatJson = () => {
  if (!internalValue.value.trim()) {
    return;
  }
  
  try {
    const parsed = JSON.parse(internalValue.value);
    internalValue.value = JSON.stringify(parsed, null, 2);
    emit('update:modelValue', internalValue.value);
    error.value = '';
  } catch (e: any) {
    error.value = t('Invalid_JSON_Format') + ': ' + e.message;
  }
};

// 压缩 JSON（移除格式化空格）
const compressJson = () => {
  if (!internalValue.value.trim()) {
    return;
  }
  
  try {
    const parsed = JSON.parse(internalValue.value);
    internalValue.value = JSON.stringify(parsed);
    emit('update:modelValue', internalValue.value);
    error.value = '';
  } catch (e: any) {
    error.value = t('Invalid_JSON_Format') + ': ' + e.message;
  }
};

// 处理输入事件
const onInput = () => {
  if (validateJson(internalValue.value)) {
    emit('update:modelValue', internalValue.value);
  }
};

// 监听外部 modelValue 变化
watch(
  () => props.modelValue,
  (newVal) => {
    // 验证新值是否为有效的 JSON
    if (validateJson(newVal)) {
      // 只有当内部值与外部值不同时才更新，避免循环更新
      if (internalValue.value !== newVal) {
        internalValue.value = newVal;
      }
    } else {
      // 如果外部值无效，可以选择性地通知用户或保持当前有效值
      console.error('Invalid JSON received from parent:', newVal);
    }
  }
);

// 初始化验证
validateJson(props.modelValue);
</script>

<style scoped>
.json-string-editor {
  width: 100%;
}

.editor-header {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}

.error-message {
  color: #f56c6c;
  font-size: 12px;
  margin-top: 5px;
}
</style>