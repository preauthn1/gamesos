<!-- 语言管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="24">
      <!-- 语言列表 -->
      <el-col :lg="24" :xs="24">
        <!-- 搜索区域 -->
        <div class="search-container">
          <el-form
            ref="queryFormRef"
            :model="queryParams"
            :inline="true"
            label-width="auto"
          >
            <el-form-item :label="$t('Keyword')" prop="keywords">
              <el-input
                v-model="queryParams.keywords"
                :placeholder="$t('Please_Enter') + ' ' + $t('Keyword')"
                clearable
              />
            </el-form-item>
            <el-form-item class="search-buttons">
              <el-button type="primary" icon="search" @click="handleQuery">
                {{ $t("Search") }}
              </el-button>
              <el-button icon="refresh" @click="handleResetQuery">
                {{ $t("Reset") }}
              </el-button>
            </el-form-item>
          </el-form>
        </div>

        <el-card shadow="hover" class="data-table">
          <div class="data-table__toolbar" style="margin-bottom: 10px">
            <div class="data-table__toolbar--actions">
              <el-button
                v-hasPerm="['user_levelInsert']"
                type="success"
                icon="plus"
                @click="handleOpenDialog()"
              >
                {{ $t("Add") }}
              </el-button>
              <el-button
                v-hasPerm="'user_levelDelete'"
                type="danger"
                icon="delete"
                :disabled="selectIds.length === 0"
                @click="handleDelete()"
              >
                {{ $t("Delete") }}
              </el-button>
            </div>
          </div>

          <el-table
            v-loading="loading"
            :data="pageData"
            :selectable="selectable"
            border
            stripe
            highlight-current-row
            class="data-table__content"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="50" align="center" />
            <el-table-column
              :label="$t('Level_Number')"
              align="center"
              prop="number"
            />
            <el-table-column
              :label="$t('Level_Name')"
              align="center"
              prop="name"
            />
            <el-table-column :label="$t('Icon')" align="center" width="100">
              <template #default="scope">
                <el-image :size="50" :src="scope.row.icon" />
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Team_Number')"
              align="center"
              prop="team_limit"
            />
            <el-table-column
              :label="$t('Recharge_Amount')"
              align="center"
              prop="recharge"
            />
            <el-table-column
              :label="$t('Upgrade_Reward')"
              align="center"
              prop="bonus"
            />
            <el-table-column
              :label="$t('Game_Wagers')"
              width="250"
              align="center"
            >
              <template #default="scope">
                <div class="tag-group">
                  <el-tag>{{ $t("Game_Wagers") }}：</el-tag>
                  <el-tag type="warning">{{ scope.row.game_wagers }}</el-tag>
                </div>
                <div class="tag-group">
                  <el-tag>{{ $t("Game_Wagers_Day") }}：</el-tag>
                  <el-tag type="warning">
                    {{ scope.row.day_game_wagers }}
                  </el-tag>
                </div>
                <div class="tag-group">
                  <el-tag>{{ $t("Game_Wagers_Week") }}：</el-tag>
                  <el-tag type="warning">
                    {{ scope.row.week_game_wagers }}
                  </el-tag>
                </div>
                <div class="tag-group">
                  <el-tag>{{ $t("Game_Wagers_Month") }}：</el-tag>
                  <el-tag type="warning">
                    {{ scope.row.month_game_wagers }}
                  </el-tag>
                </div>
                <div class="tag-group">
                  <el-tag>{{ $t("Game_Wagers_Multiple") }}：</el-tag>
                  <el-tag type="warning">
                    {{ scope.row.game_wagers_multiple }}
                  </el-tag>
                </div>
              </template>
            </el-table-column>
          
            <el-table-column
              :label="$t('Withdraw_Limit')"
              width="250"
              align="center"
            >
              <template #default="scope">
                <div class="tag-group">
                  <el-tag>{{ $t("Withdrawal_Min_Limit") }}：</el-tag>
                  <el-tag type="warning">
                    {{ scope.row.withdrawal_min_limit }}
                  </el-tag>
                </div>
                <div class="tag-group">
                  <el-tag>{{ $t("Withdrawal_Max_Limit") }}：</el-tag>
                  <el-tag type="warning">
                    {{ scope.row.withdrawal_min_limit }}
                  </el-tag>
                </div>
                <div class="tag-group">
                  <el-tag>{{ $t("Withdrawal_Count_Limit") }}：</el-tag>
                  <el-tag type="warning">
                    {{ scope.row.withdrawal_count_limit }}
                  </el-tag>
                </div>
                <div class="tag-group">
                  <el-tag>{{ $t("Withdrawal_Fee_Limit") }}：</el-tag>
                  <el-tag type="warning">
                    {{ scope.row.withdrawal_fee_limit }}
                  </el-tag>
                </div>
                <div class="tag-group">
                  <el-tag>{{ $t("Withdrawal_Fee") }}：</el-tag>
                  <el-tag type="warning">
                    {{ scope.row.withdrawal_fee }}%
                  </el-tag>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Update_Time')"
              align="center"
              prop="updated_at"
              width="200"
            />
            <el-table-column
              :label="$t('Operate')"
              fixed="right"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-hasPerm="'user_levelUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("Edit") }}
                </el-button>
                <el-button
                  v-hasPerm="'user_levelDelete'"
                  type="danger"
                  icon="delete"
                  link
                  size="small"
                  @click="handleDelete(scope.row.id)"
                >
                  {{ $t("Delete") }}
                </el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-pagination
            v-model:current-page="queryParams.page"
            v-model:page-size="queryParams.pageSize"
            :page-sizes="[15, 20, 50, 100]"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total"
            @size-change="handleQuery"
            @current-change="handleQuery"
          />
        </el-card>
      </el-col>
    </el-row>
    <el-dialog
      v-model="dialog.visible"
      :title="dialog.title"
      width="1000"
      :before-close="handleCloseDialog"
      :align-center="true"
      :close-on-click-modal="false"
    >
      <el-form
        ref="dataFormRef"
        :model="formData"
        :rules="rules"
        label-width="130px"
      >
        <el-row>
          <el-col :span="12">
            <el-form-item :label="$t('Number')" prop="number">
              <el-input
                v-model="formData.number"
                :placeholder="$t('Please_Enter') + $t('Number')"
              />
            </el-form-item>
            <el-form-item :label="$t('Name')" prop="name">
              <el-input
                v-model="formData.name"
                :placeholder="$t('Please_Enter') + $t('Name')"
              />
            </el-form-item>
            <el-form-item :label="$t('Icon')">
              <SingleImageUpload
                :accept="'.png,.jpg'"
                :style="{ width: '100px', height: '100px' }"
                v-model="formData.icon"
              />
            </el-form-item>
            <el-form-item :label="$t('Type')">
              <el-radio-group v-model="formData.type">
                <el-radio :label="1">{{ $t("Cumulative") }}</el-radio>
                <el-radio :label="2">{{ $t("Single") }}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label="$t('Team_Number')">
              <el-input
                v-model="formData.team_limit"
                :placeholder="$t('Please_Enter') + $t('Team_Number')"
              />
            </el-form-item>
            <el-form-item :label="$t('Upgrade_Reward')">
              <el-input
                v-model="formData.bonus"
                :placeholder="$t('Please_Enter') + $t('Upgrade_Reward')"
              />
            </el-form-item>
            <el-form-item :label="$t('Recharge_Amount')">
              <el-input
                v-model="formData.recharge"
                :placeholder="$t('Please_Enter') + $t('Recharge_Amount')"
              />
            </el-form-item>
            <el-form-item :label="$t('Game_Wagers')">
              <el-input
                v-model="formData.game_wagers"
                :placeholder="$t('Please_Enter') + $t('Game_Wagers')"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item :label="$t('Game_Wagers_Multiple')">
              <el-input
                v-model="formData.game_wagers_multiple"
                :placeholder="$t('Please_Enter') + $t('Game_Wagers_Multiple')"
              />
            </el-form-item>
            <el-form-item :label="$t('Game_Wagers_Day')">
              <el-input
                v-model="formData.day_game_wagers"
                :placeholder="$t('Please_Enter') + $t('Game_Wagers_Day')"
              />
            </el-form-item>
            <el-form-item :label="$t('Game_Wagers_Week')">
              <el-input
                v-model="formData.week_game_wagers"
                :placeholder="$t('Please_Enter') + $t('Game_Wagers_Week')"
              />
            </el-form-item>
            <el-form-item :label="$t('Game_Wagers_Month')">
              <el-input
                v-model="formData.month_game_wagers"
                :placeholder="$t('Please_Enter') + $t('Game_Wagers_Month')"
              />
            </el-form-item>
            <el-form-item :label="$t('Withdrawal_Min_Limit')">
              <el-input
                v-model="formData.withdrawal_min_limit"
                :placeholder="$t('Please_Enter') + $t('Withdrawal_Min_Limit')"
              />
            </el-form-item>
            <el-form-item :label="$t('Withdrawal_Max_Limit')">
              <el-input
                v-model="formData.withdrawal_max_limit"
                :placeholder="$t('Please_Enter') + $t('Withdrawal_Max_Limit')"
              />
            </el-form-item>
            <el-form-item :label="$t('Withdrawal_Count_Limit')">
              <el-input
                v-model="formData.withdrawal_count_limit"
                :placeholder="$t('Please_Enter') + $t('Withdrawal_Count_Limit')"
              />
            </el-form-item>
            <el-form-item :label="$t('Withdrawal_Fee_Limit')">
              <el-input
                v-model="formData.withdrawal_fee_limit"
                :placeholder="$t('Please_Enter') + $t('Withdrawal_Fee_Limit')"
              />
            </el-form-item>
            <el-form-item :label="$t('Withdrawal_Fee') + '%'">
              <el-input
                v-model="formData.withdrawal_fee"
                :placeholder="$t('Please_Enter') + $t('Withdrawal_Fee')"
              />
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div class="dialog-footer">
          <el-button type="primary" @click="handleSubmit">
            {{ $t("Confirm") }}
          </el-button>
          <el-button @click="handleCloseDialog">{{ $t("Cancel") }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { DeviceEnum } from "@/enums/DeviceEnum";
import SingleImageUpload from "@/components/Upload/SingleImageUpload.vue";
import { t} from "@/utils/i18n";
import UserLevelAPI, {
  UserLevelInfo,
  UserLevelListVO,
  UserLevelPageQuery,
  UserLevelList,
} from "@/api/member/userlevel.api";

defineOptions({
  name: "SysUserLevel",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<UserLevelPageQuery>({
  page: 1,
  pageSize: 15,
  field: "number",
  order: "desc",
});
const selectable = (row: UserLevelInfo) => ![1].includes(Number(row.id));
const pageData = ref<UserLevelList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("UserLevel"),
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

let formData = reactive<UserLevelInfo>({
  id: "",
  number: "",
  name: "",
  icon: "",
  type: 1,
  recharge: 0,
  team_limit: 0,
  game_wagers: 0,
  game_wagers_multiple: 0,
  day_game_wagers: 0,
  week_game_wagers: 0,
  month_game_wagers: 0,
  withdrawal_min_limit: 0,
  withdrawal_max_limit: 0,
  withdrawal_count_limit: 0,
  withdrawal_fee_limit: 0,
  withdrawal_fee: 0,
  bonus: 0,
  remark: "",
});

const rules = reactive({
  number: [
    {
      required: true,
      message: t("Number") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  name: [
    {
      required: true,
      message: t("Name") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: t("Type") + t("Not_Empty"),
      trigger: "blur",
    },
  ],
});

// 选中的语言ID
const selectIds = ref<number[]>([]);

// 查询
async function handleQuery() {
  loading.value = true;
  let queryParamsData = {
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    number__name: ["like", queryParams.keywords],
    field: queryParams.field,
    order: queryParams.order
  };
  UserLevelAPI.getPage(queryParamsData)
    .then((data: UserLevelListVO) => {
      pageData.value = data.list;
      total.value = data.total;
    })
    .finally(() => {
      loading.value = false;
    });
}
// 重置查询
function handleResetQuery() {
  queryFormRef.value.resetFields();
  queryParams.page = 1;
  queryParams.keywords = "";
  handleQuery();
}

// 选中项发生变化
function handleSelectionChange(selection: any[]) {
  selectIds.value = selection.map((item) => item.id);
}

/**
 * 打开弹窗
 *
 * @param id 语言ID
 */
async function handleOpenDialog(user?: UserLevelInfo) {
  dialog.visible = true;
  if (user?.id) {
    dialog.title = t("Edit") + t("UserLevel");
    //复制 user 给formData.value
    Object.assign(formData, user);
  } else {
    dialog.title = t("Add") + t("UserLevel");
  }
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = "";
  formData.number = "";
  formData.name = "";
  formData.icon = "";
  formData.type = 1;
  formData.recharge = 0;
  formData.team_limit = 0;
  formData.game_wagers = 0;
  formData.game_wagers_multiple = 0;
  formData.day_game_wagers = 0;
  formData.week_game_wagers = 0;
  formData.month_game_wagers = 0;
  formData.withdrawal_min_limit = 0;
  formData.withdrawal_max_limit = 0;
  formData.withdrawal_count_limit = 0;
  formData.withdrawal_fee_limit = 0;
  formData.withdrawal_fee = 0;
  formData.bonus = 0;
  formData.remark = "";
}

// 提交语言表单（防抖）
const handleSubmit = useDebounceFn(() => {
  dataFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;
      if (userId) {
        UserLevelAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        UserLevelAPI.create(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      }
    }
  });
}, 1000);

/**
 * 删除语言
 *
 * @param id  语言ID
 */
function handleDelete(id?: number) {
  const userIds = [id || selectIds.value].join(",");
  if (!userIds) {
    ElMessage.warning(t("Please_Select_Delete_Item"));
    return;
  }
  ElMessageBox.confirm(
    t("Confirm_Delete"),
    t("Warning"),
    {
      confirmButtonText: t("Confirm"),
      cancelButtonText: t("Cancel"),
      type: "warning",
    }
  ).then(
    function () {
      loading.value = true;
      console.log(userIds);
      UserLevelAPI.deleteByIds({ id: userIds })
        .then(() => {
          ElMessage.success(t("Operate_Success"));
          handleResetQuery();
        })
        .finally(() => (loading.value = false));
    },
    function () {
      ElMessage.info(t("Operate_Cancel"));
    }
  );
}

onMounted(() => {
  handleQuery();
});
</script>
<style lang="scss" scoped>
.tag-group {
  text-align: left;
  margin: 5px 0;
}
</style>
