<template>
  <div class="key-value-table">
    <div class="table-controls">
      <el-button type="primary" size="small" @click="addRow">
        {{ $t("Add") }}
      </el-button>
      <el-button type="danger" size="small" @click="deleteSelectedRows">
        {{ $t("Delete") }}
      </el-button>
    </div>
    <el-table
      :data="internalTableData"
      :style="{ width: '100%', marginTop: '10px' }"
      border
      @selection-change="handleSelectionChange"
      ref="tableRef"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column
        :label="$t('Key')"
        align="center"
        prop="name"
        width="220"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.name"
            size="small"
            @input="onInputChange"
          />
        </template>
      </el-table-column>
      <el-table-column
        :label="$t('Value')"
        align="center"
        prop="value"
        width="220"
      >
        <template #default="scope">
          <el-input
            v-model="scope.row.value"
            size="small"
            @input="onInputChange"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('Operate')" align="center" width="120">
        <template #default="scope">
          <div class="button-group">
            <el-button
              type="primary"
              size="small"
              :disabled="scope.$index === 0"
              @click="moveUp(scope.$index)"
            >
              <el-icon><Upload /></el-icon>
            </el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { t} from "@/utils/i18n";
import { ref, watch, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { Upload } from "@element-plus/icons-vue";

// Define interface for table row
interface KeyValueItem {
  key: string;
  value: string;
}

// Define props
const props = defineProps({
  modelValue: {
    type: [Array, String],
    default: () => [],
  },
});

// Define emits
const emit = defineEmits(["update:modelValue"]);

// 内部状态，用于存储表格数据
const internalTableData = ref<KeyValueItem[]>([]);

// 上一次发出的值，用于避免重复更新
let updateTimeout: NodeJS.Timeout | null = null;

// 将 modelValue 转换为内部表格数据
const parseModelValue = (
  value: string | KeyValueItem[] | unknown[]
): KeyValueItem[] => {
  if (typeof value === "string" && value) {
    try {
      const parsed = JSON.parse(value);

      // 如果是对象，转换为键值对数组
      if (
        typeof parsed === "object" &&
        parsed !== null &&
        !Array.isArray(parsed)
      ) {
        return Object.entries(parsed).map(([key, value]) => ({
          key,
          value: String(value), // 将所有值转换为字符串，便于在输入框中显示
        }));
      }
      // 如果已经是数组，直接返回
      else if (Array.isArray(parsed)) {
        return parsed as KeyValueItem[];
      }
      // 其他情况返回空数组
      else {
        return [];
      }
    } catch (e) {
      console.error("Failed to parse modelValue", e);
      return [];
    }
  }
  return Array.isArray(value) ? (value as KeyValueItem[]) : [];
};

// 更新 modelValue 的函数，带防抖
const updateModelValue = () => {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }

  updateTimeout = setTimeout(() => {
    const jsonStr = JSON.stringify(internalTableData.value);
    // 只有当值真正改变时才发出更新
    emit("update:modelValue", jsonStr);
  }, 300); // 300ms 防抖延迟
};

// 监听 modelValue 变化并更新内部数据
watch(
  () => props.modelValue,
  (newVal) => {
    const newData = parseModelValue(newVal);
    internalTableData.value = [...newData];
  },
  { immediate: true }
);

// 选中的行
const selectedRows = ref<KeyValueItem[]>([]);

// 方法
const onInputChange = () => {
  updateModelValue();
};

function addRow() {
  internalTableData.value = [
    ...internalTableData.value,
    {
      key: "",
      value: "",
    },
  ];
  updateModelValue();
}

function deleteSelectedRows() {
  if (selectedRows.value.length === 0) {
    ElMessage.warning(t("Please_Select_Delete_Item"));
    return;
  }

  // 过滤掉选中的行
  internalTableData.value = internalTableData.value.filter(
    (row) => !selectedRows.value.includes(row)
  );
  selectedRows.value = [];
  updateModelValue();
}

function handleSelectionChange(selection: KeyValueItem[]) {
  selectedRows.value = selection;
}

// Move item up in the list
function moveUp(index: number) {
  if (index > 0) {
    const newData = [...internalTableData.value];
    const temp = newData[index - 1];
    newData[index - 1] = newData[index];
    newData[index] = temp;
    internalTableData.value = newData;
    updateModelValue();
  }
}

// 组件卸载时清理定时器
onUnmounted(() => {
  if (updateTimeout) {
    clearTimeout(updateTimeout);
  }
});
</script>

<style scoped>
.key-value-table {
  margin: 10px 0;
}
.table-controls {
  display: flex;
  gap: 10px;
  margin-bottom: 10px;
}
.button-group {
  display: flex;
  gap: 5px;
  justify-content: center;
}
</style>
