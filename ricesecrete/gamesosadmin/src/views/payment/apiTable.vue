<template>
  <div class="api-list-table">
    <div class="table-header">
      <h3>{{ $t("Api_Config") }}</h3>
      <el-button type="primary" @click="addApiConfig">
        {{ $t("Add_Api_Config") }}
      </el-button>
    </div>

    <el-table :data="apiList" style="width: 100%; margin-top: 20px" border>
      <el-table-column prop="id" label="ID" width="50" />

      <el-table-column
        prop="payment_id"
        :label="$t('Platform_ID')"
        width="80"
      ></el-table-column>

      <el-table-column :label="$t('Request_Info')" width="220">
        <template #default="{ row }">
          <div>
            <el-tag>{{ $t("Request_Type") }}:</el-tag>
            <el-select v-model="row.method" size="small" style="width: 100%">
              <el-option label="GET" value="GET" />
              <el-option label="POST" value="POST" />
              <!-- <el-option label="PUT" value="PUT" />
            <el-option label="DELETE" value="DELETE" /> -->
            </el-select>
          </div>
          <div>
            <el-tag>{{ $t("Interface_Type") }}:</el-tag>
            <el-select v-model="row.type" size="small" style="width: 100%">
              <!-- //pay_in:代收,pay_out:代付,pay_in_query:代收查询,pay_out_query:代付查询,pay_in_notify:代收回调,pay_out_notify:代付回调 -->
              <el-option :label="$t('Pay_In')" value="pay_in" />
              <el-option :label="$t('Pay_Out')" value="pay_out" />
              <el-option :label="$t('Pay_In_Query')" value="pay_in_query" />
              <el-option :label="$t('Pay_Out_Query')" value="pay_out_query" />
              <el-option :label="$t('Pay_In_Notify')" value="pay_in_notify" />
              <el-option :label="$t('Pay_Out_Notify')" value="pay_out_notify" />
            </el-select>
          </div>
          <div>
            <el-tag>{{ $t("Request_URL") }}:</el-tag>
            <el-input v-model="row.url" size="small" />
          </div>
        </template>
      </el-table-column>
      <el-table-column :label="$t('Request_Info')" width="300">
        <template #default="{ row }">
          <h3>{{ $t('Headers') }}</h3>
          <el-popover placement="auto" :width="900" trigger="click">
            <template #reference>
              <el-button size="small">{{ $t("Edit") }}</el-button>
            </template>
            <Json_string v-model="row.header_json" />
          </el-popover>
          <Json_view :json-value="row.header_json" />
          <h3>{{ $t('Body') }}</h3>
          <el-popover placement="auto" :width="900" trigger="click">
            <template #reference>
              <el-button size="small">{{ $t("Edit") }}</el-button>
            </template>
            <Json_string v-model="row.body_json" />
          </el-popover>
          <Json_view :json-value="row.body_json" />
        </template>
      </el-table-column>
      <el-table-column :label="$t('Response')" width="250">
        <template #default="{ row }">
          <el-popover placement="auto" :width="900" trigger="click">
            <template #reference>
              <el-button size="small">{{ $t("Edit") }}</el-button>
            </template>
            <Json_string v-model="row.request_json" />
          </el-popover>
          <Json_view :json-value="row.request_json" />
        </template>
      </el-table-column>

      <el-table-column :label="$t('Signature')" width="250">
        <template #default="{ row }">
          <el-popover placement="auto" :width="900" trigger="click">
            <template #reference>
              <el-button size="small">{{ $t("Edit") }}</el-button>
            </template>
            <Json_string v-model="row.sign_json" />
          </el-popover>
          <Json_view :json-value="row.sign_json" />
        </template>
      </el-table-column>

      <el-table-column prop="status" :label="$t('Status')" width="120">
        <template #default="{ row }">
          <el-switch
            v-model="row.status"
            :active-value="1"
            :inactive-value="2"
            :active-text="$t('Normal')"
            :inactive-text="$t('Disable')"
          />
        </template>
      </el-table-column>
      <el-table-column :label="$t('Operate')" fixed="right">
        <template #default="{ row, $index }">
          <el-button
            size="small"
            type="danger"
            @click="deleteApiConfig($index)"
          >
            {{ $t("Delete") }}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick } from "vue";
import { ElMessageBox } from "element-plus";
import { PaymentApi } from "@/api/pay/payment.api";
import { t} from "@/utils/i18n";
import Json_string from "@/components/Form/json_string.vue";
import Json_view from "@/components/Form/json_view.vue";

// Define props
const props = withDefaults(
  defineProps<{
    modelValue: PaymentApi[] | null | undefined;
  }>(),
  {
    modelValue: () => [],
  }
);

// Define emits
const emit = defineEmits(["update:modelValue"]);

// Reactive data
const apiList = ref<PaymentApi[]>([]);

// 标记是否是内部更新，避免循环更新
let isInternalUpdate = false;

// Watch for changes in modelValue and update local data
watch(
  () => props.modelValue,
  (newVal) => {
    // 如果是内部更新，跳过此监听器
    if (isInternalUpdate) return;

    // 安全地处理可能为 null 或 undefined 的情况
    if (Array.isArray(newVal)) {
      apiList.value = [...newVal];
    } else {
      apiList.value = [];
    }
  },
  { immediate: true }
);

// Watch for changes in local data and emit updates
watch(
  () => apiList.value,
  (newVal) => {
    console.log("apiList.value:", newVal);
    // 标记为内部更新
    isInternalUpdate = true;
    emit("update:modelValue", newVal);

    // 在下一个 tick 重置标记
    nextTick(() => {
      isInternalUpdate = false;
    });
  },
  { deep: true }
);

// Methods
const addApiConfig = () => {
  const newConfig: PaymentApi = {
    id: "",
    payment_id: "",
    method: "POST",
    type: "",
    url: "",
    header_json: "{}",
    body_json: "{}",
    request_json: "{}",
    sign_json: "{}",
    status: 1,
    sort: 0,
    created_at: "",
    updated_at: "",
  };
  apiList.value.push(newConfig);
};

const deleteApiConfig = async (index: number) => {
  try {
    await ElMessageBox.confirm(
      t("Confirm_Delete"),
      t("Confirm"),
      {
        confirmButtonText: t("Confirm"),
        cancelButtonText: t("Cancel"),
        type: "warning",
      }
    );
    apiList.value.splice(index, 1);
  } catch (error) {
    // User cancelled deletion
  }
};
</script>

<style scoped>
.api-list-table {
  padding: 20px;
}

.table-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
</style>
