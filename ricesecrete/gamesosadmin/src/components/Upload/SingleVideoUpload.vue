<!-- 单视频上传组件 -->
<template>
  <el-upload
    v-model="modelValue"
    class="single-upload"
    list-type="picture-card"
    :show-file-list="false"
    :accept="props.accept"
    :before-upload="handleBeforeUpload"
    :http-request="handleUpload"
    :on-success="onSuccess"
    :on-error="onError"
  >
    <template #default>
      <div v-if="modelValue" class="video-wrapper">
        <video 
          :src="modelValue" 
          class="video-preview"
          muted 
          playsinline
        />
        <el-icon
          class="single-upload__delete-btn"
          @click.stop="handleDelete"
        >
          <CircleCloseFilled />
        </el-icon>
      </div>
      <div v-else-if="uploading" class="upload-progress">
        <el-progress 
          type="circle" 
          :percentage="uploadProgress" 
          :width="120"
          :status="uploadStatus"
        />
        <el-icon
          class="single-upload__cancel-btn"
          @click.stop="handleCancelUpload"
        >
          <CloseBold />
        </el-icon>
      </div>
      <el-icon v-else class="single-upload__add-btn">
        <Plus />
      </el-icon>
    </template>
  </el-upload>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { UploadRawFile, UploadRequestOptions } from "element-plus";
import { FileInfo } from "@/api/file.api";
import { uploadFileS3 } from "@/utils/uploadFileS3";

const props = withDefaults(defineProps<{
  /**
   * 请求携带的额外参数
   */
  data?: Record<string, any>;
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
   * 上传视频格式，默认支持常见视频格式
   */
  accept?: string;
  /**
   * 自定义样式，用于设置组件的宽度和高度等其他样式
   */
  style?: Record<string, any>;
}>(), {
  data: () => ({}),
  folder: "videos",
  name: "file",
  maxFileSize: 50, // 视频通常比图片大，增加默认大小
  accept: ".mp4,.webm,.ogg,.mov", // 常见视频格式
  style: () => ({
    width: "150px",
    height: "150px",
  })
});

const modelValue = defineModel<string>({
  type: String,
  default: ""
});

// 新增状态变量
const uploading = ref(false);
const uploadProgress = ref(0);
const uploadStatus = ref<'success' | 'exception' | undefined>(undefined);
let cancelToken: (() => void) | null = null;

/**
 * 限制用户上传文件的格式和大小
 */
function handleBeforeUpload(file: UploadRawFile) {
  // 校验文件类型：虽然 accept 属性限制了用户在文件选择器中可选的文件类型，但仍需在上传时再次校验文件实际类型，确保符合 accept 的规则
  const acceptTypes = props.accept.split(",").map((type) => type.trim());

  // 检查文件格式是否符合 accept
  const isValidType = acceptTypes.some((type) => {
    if (type === "video/*") {
      // 如果是 video/*，检查 MIME 类型是否以 "video/" 开头
      return file.type.startsWith("video/");
    } else if (type.startsWith(".")) {
      // 如果是扩展名 (.mp4, .webm)，检查文件名是否以指定扩展名结尾
      return file.name.toLowerCase().endsWith(type);
    } else {
      // 如果是具体的 MIME 类型 (video/mp4, video/webm)，检查是否完全匹配
      return file.type === type;
    }
  });

  if (!isValidType) {
    ElMessage.warning(`上传文件的格式不正确，仅支持：${props.accept}`);
    return false;
  }

  // 限制文件大小
  if (file.size > props.maxFileSize * 1024 * 1024) {
    ElMessage.warning(`上传视频不能大于 ${props.maxFileSize}M`);
    return false;
  }
  
  // 重置上传状态
  uploading.value = true;
  uploadProgress.value = 0;
  uploadStatus.value = undefined;
  
  return true;
}

/**
 * 上传
 * @param options 上传参数
 */
function handleUpload(options: UploadRequestOptions) {
  return new Promise((resolve, reject) => {
    const file = options.file;
    
    // 创建取消函数
    let isCancelled = false;
    cancelToken = () => {
      isCancelled = true;
      uploading.value = false;
      ElMessage.info("上传已取消");
      reject(new Error("Upload cancelled"));
    };
    
    uploadFileS3(
      props.folder, 
      file.uid + "", 
      file, 
      (fileData) => {
        if (isCancelled) return;
        
        if (fileData.url == "") {
          uploadStatus.value = 'exception';
          reject("上传失败");
        } else {
          uploadStatus.value = 'success';
          setTimeout(() => {
            uploading.value = false;
          }, 500); // 短暂延迟显示成功状态
          resolve(fileData);
        }
      },
      // 传递进度回调函数
      (progress) => {
        if (!isCancelled) {
          uploadProgress.value = progress;
        }
      }
    );
  });
}

/**
 * 取消上传
 */
function handleCancelUpload() {
  if (cancelToken) {
    cancelToken();
    cancelToken = null;
  }
}

/**
 * 删除视频
 */
function handleDelete() {
  modelValue.value = "";
}

/**
 * 上传成功回调
 *
 * @param fileInfo 上传成功后的文件信息
 */
const onSuccess = (fileInfo: FileInfo) => {
  ElMessage.success("上传成功");
  modelValue.value = fileInfo.url;
};

/**
 * 上传失败回调
 */
const onError = (error: any) => {
  console.log("onError");
  uploading.value = false;
  uploadStatus.value = 'exception';
  ElMessage.error("上传失败: " + error.message);
};
</script>

<style scoped lang="scss">
:deep(.el-upload--picture-card) {
  width: v-bind("props.style.width");
  height: v-bind("props.style.height");
}

.video-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.video-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 5px;
}

.upload-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  position: relative;
}

.single-upload__cancel-btn {
  position: absolute;
  top: -10px;
  right: -10px;
  font-size: 20px;
  color: #ff7901;
  cursor: pointer;
  background: white;
  border-radius: 50%;
  padding: 2px;
  box-shadow: 0 2px 6px rgba(0,0,0,0.2);

  &:hover {
    color: #ff4500;
  }
}

.single-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px var(--el-border-color) solid;
  border-radius: 5px;

  &:hover {
    border-color: var(--el-color-primary);
  }

  &__delete-btn {
    position: absolute;
    top: 1px;
    right: 1px;
    font-size: 16px;
    color: #ff7901;
    cursor: pointer;
    background: #fff;
    border-radius: 100%;

    &:hover {
      color: #ff4500;
    }
  }
}
</style>