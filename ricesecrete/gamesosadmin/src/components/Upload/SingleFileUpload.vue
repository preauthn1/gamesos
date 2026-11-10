<template>
  <div class="file-upload-container">
    <el-upload
      v-model="modelValue"
      class="file-upload"
      :show-file-list="false"
      :accept="props.accept"
      :before-upload="handleBeforeUpload"
      :http-request="handleUpload"
      :on-success="onSuccess"
      :on-error="onError"
      :on-progress="onProgress"
      :auto-upload="true"
    >
      <template #trigger>
        <el-button type="primary" :icon="Upload">
          {{ props.uploadBtnText }}
        </el-button>
      </template>
      
      <!-- 文件显示区域 -->
      <div v-if="modelValue" class="file-preview">
        <div class="file-info">
          <el-icon class="file-icon"><Document /></el-icon>
          <div class="file-details">
            <span class="file-name">{{ fileName }}</span>
            <span class="file-size" v-if="fileSize">{{ formatFileSize(fileSize) }}</span>
          </div>
          <el-icon class="delete-btn" @click.stop="handleDelete">
            <CircleCloseFilled />
          </el-icon>
        </div>
        
        <!-- 上传进度条 -->
        <el-progress
          v-if="uploading"
          :percentage="uploadPercentage"
          :stroke-width="2"
          class="upload-progress"
        />
      </div>
    </el-upload>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { UploadRawFile, UploadRequestOptions, UploadProgressEvent } from "element-plus";
import { FileInfo } from "@/api/file.api";
import { uploadFileS3 } from "@/utils/uploadFileS3";
import { Upload, Document, CircleCloseFilled } from "@element-plus/icons-vue";

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
   * 是否显示文件大小
   */
  showFileSize?: boolean;
  /**
   * 自定义样式
   */
  style?: Record<string, string>;
}

const props = withDefaults(defineProps<FileUploadProps>(), {
  data: () => ({}),
  folder: "files",
  name: "file",
  maxFileSize: 100,
  accept: "*",
  uploadBtnText: "选择文件",
  showFileSize: true,
  style: () => ({
    width: "100%",
  }),
});

const modelValue = defineModel<string>({
  type: String,
  default: ""
});

// 状态
const uploading = ref(false);
const uploadPercentage = ref(0);
const currentFile = ref<File | null>(null);
const fileSize = ref(0);

// 计算文件名
const fileName = computed(() => {
  if (currentFile.value) {
    return currentFile.value.name;
  }
  if (modelValue.value) {
    // 从URL中提取文件名
    const url = modelValue.value;
    const filename = url.substring(url.lastIndexOf('/') + 1);
    // 解码URL编码的文件名
    return decodeURIComponent(filename);
  }
  return "";
});

/**
 * 格式化文件大小
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

/**
 * 校验文件类型
 */
const validateFileType = (file: UploadRawFile, acceptTypes: string[]): boolean => {
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
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  // 保存文件信息
  currentFile.value = file;
  fileSize.value = file.size;
  
  // 校验文件类型
  const acceptTypes = props.accept.split(",").map((type) => type.trim());
  
  if (!validateFileType(file, acceptTypes)) {
    ElMessage.warning(`文件格式不正确，仅支持：${props.accept}`);
    return false;
  }

  // 限制文件大小
  const maxSize = props.maxFileSize * 1024 * 1024;
  if (file.size > maxSize) {
    ElMessage.warning(`文件大小不能超过 ${props.maxFileSize} MB`);
    return false;
  }
  
  // 重置上传状态
  uploading.value = true;
  uploadPercentage.value = 0;
  
  return true;
}

/**
 * 上传文件
 */
function handleUpload(options: UploadRequestOptions) {
  return new Promise((resolve, reject) => {
    const file = options.file;
    
    uploadFileS3(
      props.folder,
      file.uid + "",
      file,
      (fileData) => {
        uploading.value = false;
        if (fileData?.url) {
          resolve(fileData);
        } else {
          reject(new Error("上传失败，未返回有效URL"));
        }
      },
      (progress) => {
        if (typeof progress === 'number') {
          uploadPercentage.value = progress;
        } else if (typeof progress === 'object' && progress !== undefined) {
          uploadPercentage.value = progress;
        }
      }
    );
  });
}

/**
 * 上传进度回调
 */
const onProgress = (event: UploadProgressEvent) => {
  uploadPercentage.value = event.percent || 0;
};

/**
 * 删除文件
 */
function handleDelete() {
  modelValue.value = "";
  currentFile.value = null;
  fileSize.value = 0;
  uploading.value = false;
  uploadPercentage.value = 0;
}

/**
 * 上传成功回调
 */
const onSuccess = (fileInfo: FileInfo) => {
  uploading.value = false;
  ElMessage.success("文件上传成功");
  modelValue.value = fileInfo.url;
  
  // 触发change事件
  emit('change', fileInfo.url);
};

/**
 * 上传失败回调
 */
const onError = (error: any) => {
  uploading.value = false;
  console.error("上传失败:", error);
  const errorMessage = error?.message || error?.toString() || '未知错误';
  ElMessage.error("文件上传失败: " + errorMessage);
};

// 定义事件
const emit = defineEmits<{
  (e: 'change', value: string): void;
  (e: 'upload-success', fileInfo: FileInfo): void;
  (e: 'upload-error', error: Error): void;
}>();
</script>

<style scoped lang="scss">
.file-upload-container {
  width: v-bind("props.style.width");
  
  .file-upload {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .file-preview {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px;
    background-color: var(--el-fill-color-light);
    border-radius: var(--el-border-radius-base);
    border: 1px solid var(--el-border-color-lighter);
    
    .file-info {
      display: flex;
      align-items: center;
      gap: 12px;
      
      .file-icon {
        font-size: 24px;
        color: var(--el-color-primary);
      }
      
      .file-details {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;
        overflow: hidden;
        
        .file-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--el-text-color-primary);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        
        .file-size {
          font-size: 12px;
          color: var(--el-text-color-secondary);
        }
      }
      
      .delete-btn {
        font-size: 18px;
        color: var(--el-text-color-secondary);
        cursor: pointer;
        padding: 4px;
        border-radius: 50%;
        transition: all 0.3s ease;
        
        &:hover {
          color: var(--el-color-danger);
          background-color: var(--el-fill-color);
        }
      }
    }
    
    .upload-progress {
      margin-top: 4px;
    }
  }
  
  :deep(.el-upload) {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  :deep(.el-button) {
    align-self: flex-start;
  }
}
</style>