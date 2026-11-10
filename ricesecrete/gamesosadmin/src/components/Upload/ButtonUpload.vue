<template>
  <el-button
    type="primary"
    :icon="Upload"
    :loading="uploading"
    @click="handleButtonClick"
    :style="props.style"
  >
    {{ props.uploadBtnText }}
  </el-button>
  
  <!-- 隐藏的文件输入框 -->
  <input
    ref="fileInputRef"
    type="file"
    :accept="props.accept"
    @change="handleFileChange"
    style="display: none"
  />
</template>

<script setup lang="ts">
import { ref } from "vue";
import { FileInfo } from "@/api/file.api";
import { uploadFileS3 } from "@/utils/uploadFileS3";
import { Upload } from "@element-plus/icons-vue";
import i18n from "@/lang";

interface FileUploadProps {
  /**
   * 请求携带的额外参数
   */
  data?: Record<string, any>;
  /**
   * 文件存储文件夹
   */
  folder?: string;
  /**
   * 上传文件的参数名
   */
  name?: string;
  /**
   * 最大文件大小（单位：M）
   */
  maxFileSize?: number;
  /**
   * 接受的文件类型，例如：'.pdf,.doc,.docx,.xls,.xlsx'
   */
  accept?: string;
  /**
   * 上传按钮文本
   */
  uploadBtnText?: string;
  /**
   * 自定义样式
   */
  style?: Record<string, string>;
  /**
   * 上传后是否自动清空输入框
   */
  autoClear?: boolean;
}

const props = withDefaults(defineProps<FileUploadProps>(), {
  data: () => ({}),
  folder: "files",
  name: "file",
  maxFileSize: 100,
  accept: "*",
  uploadBtnText: t('Upload'),
  style: () => ({}),
  autoClear: true,
});

const modelValue = defineModel<FileInfo[]>({
  type: [Array] as PropType<FileInfo[]>,
  required: true,
  default: () => [],
});

// 状态
const uploading = ref(false);
const uploadPercentage = ref(0);
const fileInputRef = ref<HTMLInputElement | null>(null);

// 定义事件
const emit = defineEmits<{
  (e: 'success', fileInfo: FileInfo): void;
  (e: 'error', error: Error): void;
  (e: 'progress', percentage: number): void;
}>();

/**
 * 校验文件类型
 */
const validateFileType = (file: File, acceptTypes: string[]): boolean => {
  // 如果接受所有文件类型
  if (acceptTypes.includes("*")) return true;
  
  return acceptTypes.some((type) => {
    if (type.includes("/*")) {
      // 处理通配符类型，如 "image/*", "application/*"
      const [category] = type.split("/");
      return file.type.startsWith(`${category}/`);
    } else if (type.startsWith(".")) {
      // 处理文件扩展名
      const extension = type.toLowerCase();
      const fileNameLower = file.name.toLowerCase();
      return fileNameLower.endsWith(extension);
    } else {
      // 处理完整的MIME类型
      return file.type === type;
    }
  });
};

/**
 * 处理按钮点击
 */
const handleButtonClick = () => {
  if (fileInputRef.value) {
    fileInputRef.value.value = ""; // 清除之前的文件选择
    fileInputRef.value.click();
  }
};

/**
 * 处理文件选择
 */
const handleFileChange = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;
  
  // 校验文件类型
  const acceptTypes = props.accept.split(",").map((type) => type.trim());
  
  if (!validateFileType(file, acceptTypes)) {
    ElMessage.warning(`文件格式不正确，仅支持：${props.accept}`);
    clearFileInput();
    return;
  }

  // 限制文件大小
  const maxSize = props.maxFileSize * 1024 * 1024;
  if (file.size > maxSize) {
    ElMessage.warning(`文件大小不能超过 ${props.maxFileSize} MB`);
    clearFileInput();
    return;
  }

  // 开始上传
  try {
    uploading.value = true;
    uploadPercentage.value = 0;
    
    const fileInfo = await uploadFile(file);
    // console.log("fileInfo", fileInfo);
    ElMessage.success("文件上传成功");
    emit('success', fileInfo);
  } catch (error: any) {
    console.error("上传失败:", error);
    const errorMessage = error?.message || error?.toString() || '未知错误';
    ElMessage.error("文件上传失败: " + errorMessage);
    emit('error', new Error(errorMessage));
  } finally {
    uploading.value = false;
    if (props.autoClear) {
      clearFileInput();
    }
  }
};

/**
 * 上传文件
 */
const uploadFile = (file: File): Promise<FileInfo> => {
  return new Promise((resolve, reject) => {
    uploadFileS3(
      props.folder,
      `${Date.now()}_${file.name}`,
      file,
      (fileData) => {
        if (fileData?.url) {
          // console.log("fileData", fileData);
          resolve(fileData);
        } else {
          reject(new Error("上传失败，未返回有效URL"));
        }
      },
      (progress) => {
        let percentage = 0;
        if (typeof progress === 'number') {
          percentage = progress;
        } else if (typeof progress === 'object' && progress !== undefined) {
          percentage = progress as number;
        }
        uploadPercentage.value = percentage;
        emit('progress', percentage);
      }
    );
  });
};

/**
 * 清空文件输入框
 */
const clearFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.value = "";
  }
};

/**
 * 重置状态（外部可调用）
 */
const reset = () => {
  uploading.value = false;
  uploadPercentage.value = 0;
  clearFileInput();
};

// 暴露方法给父组件
defineExpose({
  reset
});
</script>

<style scoped lang="scss">
.el-button {
  // 使用传入的样式
}
</style>