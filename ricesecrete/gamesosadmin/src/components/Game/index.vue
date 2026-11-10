<template>
  <el-select
    v-model="innerValue"
    :placeholder="placeholder"
    :loading="loading"
    filterable
    remote
    :remote-method="handleRemoteSearch"
    clearable
    @change="handleChange"
    @focus="handleFocus"
  >
    <el-option
      v-for="item in optionsList"
      :key="item.id"
      :label="item.name"
      :value="item.id ? item.id + '' : ''"
    />
  </el-select>
</template>

<script setup lang="ts">
import GameAPI, { GameInfo } from "@/api/game/game.api";
import i18n from "@/lang";
import { ref, watch, onMounted } from "vue"; // Added onMounted import

interface Props {
  modelValue?: number | string;
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: t("Please_Select"),
  modelValue: undefined,
});

const emit = defineEmits<{
  "update:modelValue": [value: number | string];
  change: [value: number | string];
}>();

// Local ref to handle v-model binding
const innerValue = ref<number | string | undefined>(props.modelValue);
const loading = ref(false);
const optionsList = ref<GameInfo[]>([]);

// Sync local ref with prop when prop changes
watch(
  () => props.modelValue,
  (newValue) => {
    innerValue.value = newValue;
    // Add the current value to options if not present, so it displays correctly
    if (
      newValue &&
      !optionsList.value.some(
        (item) => (item.id ? item.id + "" : "") === newValue
      )
    ) {
      // Try to fetch the specific game info if not in the list
      getList(newValue + "");
    }
  }
);

// Handle remote search
const handleRemoteSearch = async (query: string) => {
  if (!query.trim()) {
    return;
  }
  await getList(query);
};

// Handle value change
const handleChange = (value: number | string) => {
  innerValue.value = value;
  emit("update:modelValue", value);
  emit("change", value);
};

// Handle focus event
const handleFocus = async () => {
  // If no options loaded yet and we have a current value, load it specifically
  if (optionsList.value.length === 0 && innerValue.value) {
    await getList(innerValue.value + "");
  }
};

const getList = async (query: string, is_init = "") => {
  loading.value = true;
  try {
    if (is_init == "init") {
      const result = await GameAPI.getPage({
        id: query,
      });
      optionsList.value = result.list;
    } else {
      const result = await GameAPI.getPage({
        name__code: ["like", query],
      });
      optionsList.value = result.list;
    }
  } catch (error) {
    console.error("Error fetching remote data:", error);
    optionsList.value = [];
  } finally {
    loading.value = false;
  }
};

onMounted(async () => {
  // Fetch initial options when component is mounted
  if (props.modelValue) {
    await getList(props.modelValue + "", "init");
  } else {
    await getList("");
  }
});
</script>

<style scoped>
/* Add custom styles if needed */
</style>
