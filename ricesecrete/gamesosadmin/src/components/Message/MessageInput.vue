<!-- 消息输入组件 -->
<template>
  <div class="message-input">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="rules"
      @submit.prevent="handleSubmit"
    >
      <el-form-item prop="content">
        <el-input
          v-model="formData.content"
          type="textarea"
          :rows="rows"
          :placeholder="placeholder"
          :maxlength="maxLength"
          :show-word-limit="showWordLimit"
          :resize="resize"
          :disabled="disabled"
          @keydown.enter.exact.prevent="handleSubmit"
          @keydown.enter.shift.exact="handleNewLine"
        />
      </el-form-item>
      
      <div class="message-input__actions">
        <div class="message-input__tools">
          <el-button
            v-if="showImageButton"
            type="text"
            icon="picture"
            :disabled="disabled"
            @click="handleImageClick"
          >
            {{ $t("Image") }}
          </el-button>
          
          <el-button
            v-if="showFileButton"
            type="text"
            icon="upload"
            :disabled="disabled"
            @click="handleFileClick"
          >
            {{ $t("File") }}
          </el-button>
          
          <el-button
            v-if="showEmojiButton"
            type="text"
            icon="emoji"
            :disabled="disabled"
            @click="handleEmojiClick"
          >
            {{ $t("Emoji") }}
          </el-button>
          
          <el-button
            v-if="showVoiceButton"
            type="text"
            :icon="isRecording ? 'microphone-slash' : 'microphone'"
            :disabled="disabled"
            @click="handleVoiceClick"
          >
            {{ isRecording ? $t("Stop_Recording") : $t("Voice") }}
          </el-button>
        </div>
        
        <div class="message-input__send">
          <el-button
            type="primary"
            :loading="loading"
            :disabled="!formData.content.trim() || disabled"
            @click="handleSubmit"
          >
            {{ sendButtonText }}
          </el-button>
        </div>
      </div>
    </el-form>
    
    <!-- 图片上传对话框 -->
    <el-dialog
      v-model="imageDialogVisible"
      :title="$t('Upload_Image')"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="imageUploadRef"
        class="upload-demo"
        action="#"
        :multiple="false"
        :limit="1"
        :auto-upload="false"
        :on-change="handleImageChange"
        :on-remove="handleImageRemove"
        :file-list="imageFileList"
        accept=".jpg,.jpeg,.png,.gif,.webp"
      >
        <template #trigger>
          <el-button type="primary">{{ $t("Select_Image") }}</el-button>
        </template>
        <template #tip>
          <div class="el-upload__tip">
            {{ $t("Upload_Image_Tip") }}
          </div>
        </template>
      </el-upload>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="imageDialogVisible = false">
            {{ $t("Cancel") }}
          </el-button>
          <el-button
            type="primary"
            :loading="uploadingImage"
            :disabled="imageFileList.length === 0"
            @click="handleImageUpload"
          >
            {{ $t("Upload") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 文件上传对话框 -->
    <el-dialog
      v-model="fileDialogVisible"
      :title="$t('Upload_File')"
      width="500px"
      :close-on-click-modal="false"
    >
      <el-upload
        ref="fileUploadRef"
        class="upload-demo"
        action="#"
        :multiple="false"
        :limit="1"
        :auto-upload="false"
        :on-change="handleFileChange"
        :on-remove="handleFileRemove"
        :file-list="fileFileList"
        :accept="fileAccept"
      >
        <template #trigger>
          <el-button type="primary">{{ $t("Select_File") }}</el-button>
        </template>
        <template #tip>
          <div class="el-upload__tip">
            {{ $t("Upload_File_Tip") }}
          </div>
        </template>
      </el-upload>
      
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="fileDialogVisible = false">
            {{ $t("Cancel") }}
          </el-button>
          <el-button
            type="primary"
            :loading="uploadingFile"
            :disabled="fileFileList.length === 0"
            @click="handleFileUpload"
          >
            {{ $t("Upload") }}
          </el-button>
        </span>
      </template>
    </el-dialog>
    
    <!-- 表情选择器 -->
    <el-dialog
      v-model="emojiDialogVisible"
      :title="$t("Select_Emoji")"
      width="400px"
    >
      <div class="emoji-container">
        <div
          v-for="emoji in emojiList"
          :key="emoji"
          class="emoji-item"
          @click="handleEmojiSelect(emoji)"
        >
          {{ emoji }}
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { ElMessage } from "element-plus";
import type { UploadFile, UploadFiles, UploadInstance } from "element-plus";

// 组件属性
interface Props {
  /** 会话ID */
  sessionId?: string;
  /** 输入框占位符 */
  placeholder?: string;
  /** 输入框行数 */
  rows?: number;
  /** 最大长度 */
  maxLength?: number;
  /** 是否显示字数限制 */
  showWordLimit?: boolean;
  /** 是否可调整大小 */
  resize?: "none" | "both" | "horizontal" | "vertical";
  /** 是否禁用 */
  disabled?: boolean;
  /** 发送按钮文本 */
  sendButtonText?: string;
  /** 是否显示图片按钮 */
  showImageButton?: boolean;
  /** 是否显示文件按钮 */
  showFileButton?: boolean;
  /** 是否显示表情按钮 */
  showEmojiButton?: boolean;
  /** 是否显示语音按钮 */
  showVoiceButton?: boolean;
  /** 文件上传接受类型 */
  fileAccept?: string;
  /** 加载状态 */
  loading?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: "请输入消息...",
  rows: 3,
  maxLength: 1000,
  showWordLimit: true,
  resize: "none",
  disabled: false,
  sendButtonText: "发送",
  showImageButton: true,
  showFileButton: true,
  showEmojiButton: true,
  showVoiceButton: false,
  fileAccept: "*",
  loading: false
});

// 组件事件
interface Emits {
  /** 发送消息事件 */
  (e: "send", content: string, type?: number, extra?: Record<string, any>): void;
  /** 上传图片事件 */
  (e: "upload-image", file: File): void;
  /** 上传文件事件 */
  (e: "upload-file", file: File): void;
  /** 开始录音事件 */
  (e: "start-recording"): void;
  /** 停止录音事件 */
  (e: "stop-recording"): void;
}

const emit = defineEmits<Emits>();

// 表单引用
const formRef = ref();
const imageUploadRef = ref<UploadInstance>();
const fileUploadRef = ref<UploadInstance>();

// 响应式数据
const formData = reactive({
  content: ""
});

const imageDialogVisible = ref(false);
const fileDialogVisible = ref(false);
const emojiDialogVisible = ref(false);
const isRecording = ref(false);
const uploadingImage = ref(false);
const uploadingFile = ref(false);

const imageFileList = ref<UploadFile[]>([]);
const fileFileList = ref<UploadFile[]>([]);

// 表情列表
const emojiList = [
  "😀", "😃", "😄", "😁", "😆", "😅", "😂", "🤣", "😊", "😇",
  "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚",
  "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥸",
  "🤩", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "☹️",
  "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡",
  "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓",
  "🤗", "🤔", "🤭", "🤫", "🤥", "😶", "😐", "😑", "😬", "🙄",
  "😯", "😦", "😧", "😮", "😲", "🥱", "😴", "🤤", "😪", "😵",
  "🤐", "🥴", "🤢", "🤮", "🤧", "😷", "🤒", "🤕", "🤑", "🤠",
  "😈", "👿", "👹", "👺", "🤡", "💩", "👻", "💀", "☠️", "👽",
  "👾", "🤖", "🎃", "😺", "😸", "😹", "😻", "😼", "😽", "🙀",
  "😿", "😾", "🤲", "👐", "🙌", "👏", "🤝", "👍", "👎", "👊",
  "✊", "🤛", "🤜", "🤞", "✌️", "🤟", "🤘", "👌", "🤌", "🤏",
  "👈", "👉", "👆", "👇", "☝️", "✋", "🤚", "🖐", "🖖", "👋",
  "🤙", "💪", "🦾", "🦿", "🦵", "🦶", "👂", "🦻", "👃", "🧠",
  "🦷", "🦴", "👀", "👁", "👅", "👄", "💋", "🩸", "💘", "💝",
  "💖", "💗", "💓", "💞", "💕", "💟", "❣️", "💔", "❤️", "🧡",
  "💛", "💚", "💙", "💜", "🤎", "🖤", "🤍", "💯", "💢", "💥",
  "💫", "💦", "💨", "🕳️", "💣", "💬", "👁️‍🗨️", "🗨️", "🗯️", "💭",
  "💤", "👋", "🤚", "🖐", "✋", "🖖", "👌", "🤌", "🤏", "✌️",
  "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👍",
  "👎", "✊", "👊", "🤛", "🤜", "👏", "🙌", "👐", "🤲", "🤝",
  "🙏", "✍️", "💅", "🤳", "💪", "🦾", "🦿", "🦵", "🦶", "👂",
  "🦻", "👃", "🧠", "🦷", "🦴", "👀", "👁", "👅", "👄", "💋"
];

// 表单验证规则
const rules = {
  content: [
    { required: true, message: "请输入消息内容", trigger: "blur" },
    { max: props.maxLength, message: `消息内容不能超过${props.maxLength}个字符`, trigger: "blur" }
  ]
};

// 计算属性
const hasContent = computed(() => {
  return formData.content.trim().length > 0;
});

// 监听会话ID变化
watch(() => props.sessionId, () => {
  // 切换会话时清空输入框
  formData.content = "";
});

// 处理提交
const handleSubmit = () => {
  if (!hasContent.value || props.disabled) return;
  
  const content = formData.content.trim();
  emit("send", content, 1, {});
  formData.content = "";
};

// 处理换行
const handleNewLine = () => {
  formData.content += "\n";
};

// 处理图片点击
const handleImageClick = () => {
  imageDialogVisible.value = true;
};

// 处理文件点击
const handleFileClick = () => {
  fileDialogVisible.value = true;
};

// 处理表情点击
const handleEmojiClick = () => {
  emojiDialogVisible.value = true;
};

// 处理语音点击
const handleVoiceClick = () => {
  if (isRecording.value) {
    isRecording.value = false;
    emit("stop-recording");
  } else {
    isRecording.value = true;
    emit("start-recording");
  }
};

// 处理图片选择
const handleImageChange = (file: UploadFile, fileList: UploadFiles) => {
  imageFileList.value = fileList;
};

// 处理图片移除
const handleImageRemove = (file: UploadFile, fileList: UploadFiles) => {
  imageFileList.value = fileList;
};

// 处理图片上传
const handleImageUpload = async () => {
  if (imageFileList.value.length === 0) {
    ElMessage.warning("请选择图片");
    return;
  }

  const file = imageFileList.value[0].raw;
  if (!file) {
    ElMessage.error("文件不存在");
    return;
  }

  // 检查文件类型
  const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
  if (!allowedTypes.includes(file.type)) {
    ElMessage.error("只支持 JPG、PNG、GIF、WebP 格式的图片");
    return;
  }

  // 检查文件大小（限制为 5MB）
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    ElMessage.error("图片大小不能超过 5MB");
    return;
  }

  try {
    uploadingImage.value = true;
    emit("upload-image", file);
    imageDialogVisible.value = false;
    imageFileList.value = [];
  } catch (error) {
    console.error("上传图片失败:", error);
    ElMessage.error("上传图片失败");
  } finally {
    uploadingImage.value = false;
  }
};

// 处理文件选择
const handleFileChange = (file: UploadFile, fileList: UploadFiles) => {
  fileFileList.value = fileList;
};

// 处理文件移除
const handleFileRemove = (file: UploadFile, fileList: UploadFiles) => {
  fileFileList.value = fileList;
};

// 处理文件上传
const handleFileUpload = async () => {
  if (fileFileList.value.length === 0) {
    ElMessage.warning("请选择文件");
    return;
  }

  const file = fileFileList.value[0].raw;
  if (!file) {
    ElMessage.error("文件不存在");
    return;
  }

  // 检查文件大小（限制为 50MB）
  const maxSize = 50 * 1024 * 1024;
  if (file.size > maxSize) {
    ElMessage.error("文件大小不能超过 50MB");
    return;
  }

  try {
    uploadingFile.value = true;
    emit("upload-file", file);
    fileDialogVisible.value = false;
    fileFileList.value = [];
  } catch (error) {
    console.error("上传文件失败:", error);
    ElMessage.error("上传文件失败");
  } finally {
    uploadingFile.value = false;
  }
};

// 处理表情选择
const handleEmojiSelect = (emoji: string) => {
  formData.content += emoji;
  emojiDialogVisible.value = false;
};

// 公开方法：清空输入框
const clear = () => {
  formData.content = "";
  formRef.value?.resetFields();
};

// 公开方法：聚焦输入框
const focus = () => {
  const textarea = document.querySelector(".message-input textarea") as HTMLTextAreaElement;
  if (textarea) {
    textarea.focus();
  }
};

// 公开方法：设置内容
const setContent = (content: string) => {
  formData.content = content;
};

defineExpose({
  clear,
  focus,
  setContent
});
</script>

<style scoped lang="scss">
.message-input {
  width: 100%;

  &__actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 12px;

    &__tools {
      display: flex;
      gap: 12px;
    }

    &__send {
      .el-button {
        min-width: 80px;
      }
    }
  }
}

.upload-demo {
  width: 100%;

  :deep(.el-upload) {
    width: 100%;
  }

  :deep(.el-upload-dragger) {
    width: 100%;
    height: 150px;
  }
}

.emoji-container {
  display: grid;
  grid-template-columns: repeat(10, 1fr);
  gap: 8px;
  max-height: 300px;
  overflow-y: auto;
  padding: 8px;

  .emoji-item {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 32px;
    font-size: 20px;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.2s;

    &:hover {
      background-color: #f0f0f0;
    }
  }
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

// 响应式设计
@media (max-width: 768px) {
  .message-input {
    &__actions {
      flex-direction: column;
      gap: 12px;

      &__tools {
        width: 100%;
        justify-content: space-between;
      }

      &__send {
        width: 100%;

        .el-button {
          width: 100%;
        }
      }
    }
  }

  .emoji-container {
    grid-template-columns: repeat(8, 1fr);
  }
}
</style>
