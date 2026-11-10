<template>
  <div class="container">
    <!-- Controls for adding new items -->
    <div class="controls" v-if="isEdit">
      <el-button @click="addItem" type="primary">{{ $t("Add") }}</el-button>
    </div>

    <!-- Table view -->
    <div class="table-container">
      <el-table
        :data="sortedItems"
        style="width: 100%"
        row-key="id"
        :empty-text="'No data'"
        v-loading="false"
        ref="tableRef"
      >
        <el-table-column prop="#" label="#" width="50" v-if="isEdit">
          <template #default="{ $index }">
            {{ $index + 1 }}
          </template>
        </el-table-column>

        <el-table-column prop="icon" :label="$t('Icon')" width="80">
          <template #default="{ row }">
            <div v-if="row.icon_type === 'video'">
              <video
                :src="row.icon"
                style="
                  width: 40px;
                  height: 40px;
                  border-radius: 4px;
                  object-fit: cover;
                "
                muted
                playsinline
              />
            </div>
            <div v-else>
              <el-image
                :src="row.icon"
                :preview-src-list="[row.icon]"
                fit="cover"
                :preview-teleported="true"
                lazy
                style="width: 40px; height: 40px; border-radius: 4px"
                :hide-on-click-modal="true"
              >
                <template #error>
                  <div class="image-slot">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="icon_active"
          :label="$t('Icon_Active')"
          width="80"
        >
          <template #default="{ row }">
            <div v-if="row.icon_type === 'video'">
              <video
                :src="row.icon_active"
                style="
                  width: 40px;
                  height: 40px;
                  border-radius: 4px;
                  object-fit: cover;
                "
                muted
                playsinline
              />
            </div>
            <div v-else>
              <el-image
                :src="row.icon_active"
                :preview-src-list="[row.icon_active]"
                fit="cover"
                :preview-teleported="true"
                lazy
                style="width: 40px; height: 40px; border-radius: 4px"
                :hide-on-click-modal="true"
              >
                <template #error>
                  <div class="image-slot">
                    <el-icon><Picture /></el-icon>
                  </div>
                </template>
              </el-image>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="name" :label="$t('Name')" width="150" />
        <el-table-column prop="url" :label="$t('Url')" width="150" />
        <el-table-column prop="param" :label="$t('Parameter')" width="100" />
        <el-table-column
          prop="sort"
          :label="$t('Sort')"
          width="80"
          v-if="isEdit"
        />
        <el-table-column :label="$t('Operate')" width="180" v-if="isEdit">
          <template #default="{ $index }">
            <div class="action-buttons">
              <el-button size="small" @click="editItem($index)" v-if="isEdit">
                {{ $t("Edit") }}
              </el-button>
              <el-button
                size="small"
                type="danger"
                @click="deleteItem($index)"
                v-if="isEdit"
              >
                {{ $t("Delete") }}
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Edit Dialog using Element UI -->
    <el-dialog
      v-model="showModal"
      :title="editingIndex !== null ? $t('Edit') : $t('Add')"
      width="800px"
      :close-on-click-modal="false"
      v-if="isEdit"
    >
      <el-form
        :model="currentItem"
        ref="editFormRef"
        label-width="110px"
        @submit.prevent="saveItem"
      >
        <el-form-item :label="$t('Name')" prop="name">
          <el-input v-model="currentItem.name" />
        </el-form-item>
        <el-form-item :label="$t('Sort')" prop="sort">
          <el-input v-model.number="currentItem.sort" type="number" />
        </el-form-item>

        <el-form-item :label="$t('Icon_Type')" prop="icon_type">
          <el-select v-model="currentItem.icon_type">
            <el-option :label="$t('Image')" value="image" />
            <el-option :label="$t('Video')" value="video" />
          </el-select>
        </el-form-item>

        <el-form-item :label="$t('Icon')" prop="icon">
          <div v-if="currentItem.icon_type === 'video'">
            <SingleVideoUpload
              v-model="currentItem.icon"
              :style="{ width: '80px', height: '80px' }"
            />
          </div>
          <div v-else>
            <SingleImageUpload
              v-model="currentItem.icon"
              :style="{ width: '80px', height: '80px' }"
            />
          </div>
        </el-form-item>

        <el-form-item :label="$t('Icon_Active')" prop="icon_active">
          <div v-if="currentItem.icon_type === 'video'">
            <SingleVideoUpload
              v-model="currentItem.icon_active"
              :style="{ width: '80px', height: '80px' }"
            />
          </div>
          <div v-else>
            <SingleImageUpload
              v-model="currentItem.icon_active"
              :style="{ width: '80px', height: '80px' }"
            />
          </div>
        </el-form-item>

        <el-form-item :label="$t('Url')" prop="url">
          <el-input v-model="currentItem.url" />
        </el-form-item>

        <el-form-item :label="$t('Parameters')" prop="param">
          <el-input v-model="currentItem.param" />
        </el-form-item>
      </el-form>

      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="saveItem">
            {{ $t("Confirm") }}
          </el-button>
          <el-button @click="closeModal">{{ $t("Cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, computed } from "vue";
import SingleImageUpload from "@/components/Upload/SingleImageUpload.vue";
import SingleVideoUpload from "@/components/Upload/SingleVideoUpload.vue"; // Assuming you have this component
import {
  ElTable,
  ElTableColumn,
  ElDialog,
  ElForm,
  ElFormItem,
  ElInput,
  ElButton,
  ElImage,
  ElIcon,
  ElSelect,
  ElOption,
} from "element-plus";
import { Picture } from "@element-plus/icons-vue";

interface GridItem {
  id: string;
  name: string;
  icon: string;
  icon_active: string;
  url: string;
  param: string;
  sort: number;
  icon_type: string;
}

// Define props and emits
const props = defineProps<{
  modelValue: string;
  isEdit: boolean;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();
// Generate unique ID
const generateId = () => Math.random().toString(36).substr(2, 9);

// Reactive state
const items = ref<GridItem[]>([]);
const showModal = ref(false);
const editingIndex = ref<number | null>(null);
const currentItem = ref<GridItem>({
  id: "",
  name: "",
  icon: "",
  icon_active: "",
  url: "",
  param: "",
  sort: 100,
  icon_type: "image", // Default to image
});

// 计算属性：按照 sort 从大到小排序
const sortedItems = computed(() => {
  return [...items.value].sort((a, b) => b.sort - a.sort);
});

// Watch for changes in the prop and update local items
watch(
  () => props.modelValue,
  (newVal) => {
    try {
      const parsed = JSON.parse(newVal);
      if (Array.isArray(parsed)) {
        items.value = parsed.map((item, index) => ({
          id: item.id || generateId(),
          name: item.name || "",
          icon: item.icon || "",
          icon_active: item.icon_active || item.icon || "",
          url: item.url || "",
          param: item.param || "",
          sort: item.sort !== undefined ? item.sort : parsed.length - index,
          icon_type: item.icon_type || "image", // Default to image if not provided
        }));
      }
    } catch (error) {
      items.value = [];
      //   console.error("Invalid JSON string passed to Menu component:", error);
    }
  },
  { immediate: true }
);

// Computed property to convert items back to JSON string
const jsonString = computed(() => {
  const itemsWithoutInternalId = items.value.map(({ id, ...rest }) => rest);
  return JSON.stringify(itemsWithoutInternalId);
});
// Add a new item (opens dialog)
const addItem = () => {
  editingIndex.value = null;
  // 设置默认排序值为当前最大排序值+1
  const minSort =
    items.value.length > 0
      ? Math.min(...items.value.map((item) => item.sort))
      : 0;
  currentItem.value = {
    id: generateId(),
    name: "",
    icon: "",
    icon_active: "",
    url: "",
    param: "",
    sort: minSort <= 1 ? 100 : minSort - 1,
    icon_type: "image", // Default to image
  };
  showModal.value = true;
};

// Edit existing item
const editItem = (index: number) => {
  const sortedItem = sortedItems.value[index];
  const originalIndex = items.value.findIndex(
    (item) => item.id === sortedItem.id
  );
  editingIndex.value = originalIndex;
  currentItem.value = { ...items.value[originalIndex] };
  // Ensure icon_type is set if it doesn't exist
  if (!currentItem.value.icon_type) {
    currentItem.value.icon_type = "image";
  }
  showModal.value = true;
};

// Save item (either create or update)
const saveItem = () => {
  if (editingIndex.value !== null) {
    // Update existing item
    items.value[editingIndex.value] = { ...currentItem.value };
  } else {
    // Add new item
    items.value.push({ ...currentItem.value });
  }

  closeModal();
  emit("update:modelValue", jsonString.value);
};

// Delete an item
const deleteItem = (index: number) => {
  const sortedItem = sortedItems.value[index];
  const originalIndex = items.value.findIndex(
    (item) => item.id === sortedItem.id
  );

  if (
    confirm(
      `Are you sure you want to delete "${items.value[originalIndex].name}"?`
    )
  ) {
    items.value.splice(originalIndex, 1);
    emit("update:modelValue", jsonString.value);
  }
};

// Close dialog
const closeModal = () => {
  showModal.value = false;
  editingIndex.value = null;
};

// Initialize with sample data from props if available, otherwise with default
try {
  const parsed = JSON.parse(props.modelValue);
  if (Array.isArray(parsed)) {
    items.value = parsed.map((item, index) => ({
      id: item.id || generateId(),
      name: item.name || "",
      icon: item.icon || "",
      icon_active: item.icon_active || item.icon || "",
      url: item.url || "",
      param: item.param || "",
      sort: item.sort !== undefined ? item.sort : parsed.length - index,
      icon_type: item.icon_type || "image", // Default to image if not provided
    }));
  }
} catch (error) {
  //   console.warn("Invalid initial JSON string, using default data:", error);
  // Initialize with sample data
  items.value = [
    {
      id: generateId(),
      name: "",
      icon: "",
      icon_active: "",
      url: "",
      param: "",
      sort: 10,
      icon_type: "image",
    },
  ];
}
</script>
<style lang="scss" scoped>
.el-form-item .el-form-item {
  margin-bottom: 10px;
}
</style>
