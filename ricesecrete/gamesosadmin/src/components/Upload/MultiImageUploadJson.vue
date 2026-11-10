<template>
  <div class="multi-image-upload-json">
    <el-upload
      v-model:file-list="fileList"
      list-type="picture-card"
      :before-upload="handleBeforeUpload"
      :http-request="handleUpload"
      :on-success="handleSuccess"
      :on-error="handleError"
      :on-exceed="handleExceed"
      :on-remove="handleRemoveByFile"
      :accept="props.accept"
      :limit="props.limit"
      multiple
    >
      <el-icon><Plus /></el-icon>
      <template #file="{ file }">
        <div style="width: 100%">
          <img class="el-upload-list__item-thumbnail" :src="file.url" />
          <span class="el-upload-list__item-actions">
            <!-- 预览 -->
            <span @click="handlePreviewImage(file.url!)">
              <el-icon><zoom-in /></el-icon>
            </span>
            <!-- 删除 -->
            <span @click="handleRemoveByUrl(file.url!)">
              <el-icon><Delete /></el-icon>
            </span>
          </span>
        </div>
      </template>
    </el-upload>

    <el-image-viewer
      v-if="previewVisible"
      :zoom-rate="1.2"
      :initial-index="previewImageIndex"
      :url-list="currentValue"
      @close="handlePreviewClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from "vue";
import { UploadRawFile, UploadRequestOptions, UploadUserFile } from "element-plus";
import { ElMessage } from "element-plus";
import { FileInfo } from "@/api/file.api";
import { uploadFileS3 } from "@/utils/uploadFileS3";


interface Props {
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
   * 文件上传数量限制
   */
  limit?: number;
  /**
   * 单个文件的最大允许大小
   */
  maxFileSize?: number;
  /**
   * 上传文件类型
   */
  accept?: string;
}

const props = withDefaults(defineProps<Props>(), {
  data: () => ({}),
  folder: "images",
  name: "file",
  limit: 10,
  maxFileSize: 10,
  accept: "image/*", // 默认支持所有图片格式
});

// 修改 modelValue 类型为 string | string[] 以支持更多格式
const modelValue = defineModel<string | string[]>({
  required: true,
});

const previewVisible = ref(false); // 是否显示预览
const previewImageIndex = ref(0); // 预览图片的索引
const fileList = ref<UploadUserFile[]>([]);

// 计算属性：将 modelValue 转换为统一的字符串数组格式
const currentValue = computed<string[]>({
  get: (): string[] => {
    if (typeof modelValue.value === 'string') {
      try {
        // 尝试解析 JSON 字符串
        const parsed = JSON.parse(modelValue.value);
        return Array.isArray(parsed) ? parsed : [String(parsed)];
      } catch {
        // 如果不是 JSON 格式，则作为单个 URL 处理
        return [];
      }
    }
    return Array.isArray(modelValue.value) ? [...modelValue.value] : [String(modelValue.value)];
  },
  set: (value: string[]) => {
    // 更新 modelValue，可以选择保持为数组或转换为 JSON 字符串
    modelValue.value = JSON.stringify(value);
  }
});

// 监听 currentValue 变化并同步到 fileList
watch(
  () => currentValue.value,
  (newUrls) => {
    fileList.value = newUrls.map((url) => ({ url } as UploadUserFile));
  },
  { immediate: true }
);

/**
 * 删除图片（通过 URL）
 */
function handleRemoveByUrl(imageUrl: string) {
  const index = currentValue.value.indexOf(imageUrl);
  if (index !== -1) {
    // 从 currentValue 中移除
    const newUrls = [...currentValue.value];
    newUrls.splice(index, 1);
    currentValue.value = newUrls;
    
    // 从 fileList 中移除
    fileList.value.splice(index, 1);
  }
}

/**
 * 删除图片（通过文件对象）
 */
function handleRemoveByFile(uploadFile: UploadUserFile) {
  const index = fileList.value.findIndex((file) => file.uid === uploadFile.uid);
  if (index !== -1) {
    // 从 currentValue 中移除对应的 URL
    const url = fileList.value[index].url;
    if (url) {
      const newUrls = [...currentValue.value];
      const modelIndex = newUrls.indexOf(url);
      if (modelIndex !== -1) {
        newUrls.splice(modelIndex, 1);
        currentValue.value = newUrls;
      }
    }
  }
}

/**
 * 上传前校验
 */
function handleBeforeUpload(file: UploadRawFile) {
  // 校验文件类型：虽然 accept 属性限制了用户在文件选择器中可选的文件类型，但仍需在上传时再次校验文件实际类型，确保符合 accept 的规则
  const acceptTypes = props.accept.split(",").map((type) => type.trim());

  // 检查文件格式是否符合 accept
  const isValidType = acceptTypes.some((type) => {
    if (type === "image/*") {
      // 如果是 image/*，检查 MIME 类型是否以 "image/" 开头
      return file.type.startsWith("image/");
    } else if (type.startsWith(".")) {
      // 如果是扩展名 (.png, .jpg)，检查文件名是否以指定扩展名结尾
      return file.name.toLowerCase().endsWith(type.toLowerCase());
    } else {
      // 如果是具体的 MIME 类型 (image/png, image/jpeg)，检查是否完全匹配
      return file.type === type;
    }
  });

  if (!isValidType) {
    ElMessage.warning(`上传文件的格式不正确，仅支持：${props.accept}`);
    return false;
  }

  // 限制文件大小
  if (file.size > props.maxFileSize * 1024 * 1024) {
    ElMessage.warning("上传图片不能大于" + props.maxFileSize + "M");
    return false;
  }
  return true;
}

/**
 * 上传
 * @param options 上传参数
 */
 function handleUpload(options: UploadRequestOptions) {
  return new Promise((resolve, reject) => {
    const file = options.file;
    uploadFileS3(props.folder, file.uid + "", file, (fileData) => {
      // console.log(fileData);
      if (fileData.url == "") {
        reject("上传失败");
      } else {
        resolve(fileData);
      }
    });
    // uploadFileOss(props.folder, file.uid + "", file, (fileData) => {
    //   // console.log(fileData);
    //   if (fileData.url == "") {
    //     reject("上传失败");
    //   } else {
    //     resolve(fileData);
    //   }
    // });
  });
}

// /**
//  * 上传文件
//  */
// function handleUpload(options: UploadRequestOptions) {
//   return new Promise((resolve, reject) => {
//     const file = options.file as UploadRawFile;

//     const formData = new FormData();
//     formData.append(props.name, file);

//     // 处理附加参数
//     Object.keys(props.data).forEach((key) => {
//       formData.append(key, props.data[key]);
//     });
//     formData.append("uid", file.uid + "");
//     formData.append("folder", props.folder);
    
//     FileAPI.upload(formData)
//       .then((data: FileInfo) => {
//         resolve({ ...options, data });
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// }

/**
 * 上传文件超出限制
 */
function handleExceed() {
  ElMessage.warning("最多只能上传" + props.limit + "张图片");
}

/**
 * 上传成功回调
 */
const handleSuccess = (response: any, uploadFile: UploadUserFile) => {
  ElMessage.success("上传成功");
  
  const fileInfo: FileInfo = response.data || response; // 根据实际返回结构调整
  
  // 更新 fileList 中的 URL
  const index = fileList.value.findIndex((file) => file.uid === uploadFile.uid);
  if (index !== -1) {
    fileList.value[index].url = fileInfo.url;
    fileList.value[index].status = "success";
  }
  
  // 添加到 currentValue
  if (!currentValue.value.includes(fileInfo.url)) {
    currentValue.value = [...currentValue.value, fileInfo.url];
  }
};

/**
 * 上传失败回调
 */
const handleError = (error: any) => {
  console.error("Upload error:", error);
  ElMessage.error("上传失败: " + error?.message || "未知错误");
};

/**
 * 预览图片
 */
const handlePreviewImage = (imageUrl: string) => {
  previewImageIndex.value = currentValue.value.findIndex(
    (url) => url === imageUrl
  );
  previewVisible.value = true;
};

/**
 * 关闭预览
 */
const handlePreviewClose = () => {
  previewVisible.value = false;
};

onMounted(() => {
  // 初始化 fileList 与 currentValue 保持一致
  fileList.value = currentValue.value.map((url) => ({ url } as UploadUserFile));
});
</script>

<style scoped>
.multi-image-upload-json {
  width: 100%;
}
</style>