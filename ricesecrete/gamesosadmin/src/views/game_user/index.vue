<!-- 管理 -->
<template>
  <div class="app-container">
    <el-row :gutter="24">
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
            <el-form-item :label="$t('User')" prop="user_id">
              <Member v-model="queryParams.user_id" />
            </el-form-item>
            <el-form-item :label="$t('Game_Platform')" prop="platform_id">
              <GamePlatform v-model="queryParams.platform_id" />
            </el-form-item>
            <el-form-item :label="$t('Game_Id')" prop="game_id">
              <Game v-model="queryParams.game_id" />
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
              <!-- <el-button
                v-hasPerm="['game_userInsert']"
                type="success"
                icon="plus"
                @click="handleOpenDialog()"
              >
                {{ $t("Add") }}
              </el-button>
              <el-button
                v-hasPerm="'game_userDelete'"
                type="danger"
                icon="delete"
                :disabled="selectIds.length === 0"
                @click="handleDelete()"
              >
                {{ $t("Delete") }}
              </el-button> -->
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
            <el-table-column label="ID" align="center" prop="id" />
            <el-table-column
              :label="$t('Game_Info')"
              align="left"
              width="280"
              prop="game_id"
            >
              <template #default="scope">
                <div class="bet-price">
                  <span class="label">{{ $t("Game_Name") }}:</span>
                  <span class="value">{{ scope.row.game_info.name }}</span>
                </div>
                <div class="bet-price">
                  <span class="label">{{ $t("Game_Platform") }}:</span>
                  <span class="value">
                    {{ getPlatformString(scope.row.platform_id) }}
                  </span>
                </div>
                <div class="bet-price">
                  <span class="label">{{ $t("Game_Url") }}:</span>
                  <div class="url-container">
                    <span
                      class="value url-text"
                      @click="copyUrl(scope.row.game_url)"
                    >
                      {{ scope.row.game_url }}
                    </span>
                    <el-icon
                      class="copy-icon"
                      @click="copyUrl(scope.row.game_url)"
                    >
                      <DocumentCopy />
                    </el-icon>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Platform_Type')"
              align="center"
              width="100"
            >
              <template #default="scope">
                <el-tag v-if="scope.row.platform_type === 1">
                  {{ $t("Seameless") }}
                </el-tag>
                <el-tag v-if="scope.row.platform_type === 2">
                  {{ $t("Transfer") }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Userinfo')"
              align="left"
              prop="user_info"
              width="260"
            >
              <template #default="scope">
                <!-- //用户id 用户昵称 两行显示 -->
                <div class="user-info">
                  <div class="user-id">
                    <span class="label">{{ $t("User_Id") }}:</span>
                    <span class="value">{{ scope.row.user_info.id }}</span>
                  </div>
                  <div class="user-username">
                    <span class="label">{{ $t("Username") }}:</span>
                    <span class="value">
                      {{ scope.row.user_info.username }}
                    </span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Language')"
              align="center"
              width="80"
              prop="lang"
            />
            <el-table-column
              :label="$t('Currency')"
              align="center"
              width="80"
              prop="currency"
            />
            <el-table-column
              :label="$t('Balance_In')"
              align="center"
              prop="balance_in"
              width="100"
            >
              <template #default="scope">
                <span v-if="scope.row.platform_type == 2">
                  {{ scope.row.balance_in }}
                </span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Balance_Now')"
              align="center"
              prop="balance"
              width="100"
            >
              <template #default="scope">
                <span v-if="scope.row.platform_type == 2">
                  {{ scope.row.balance }}
                </span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Balance_Out')"
              align="center"
              prop="balance_out"
              width="100"
            >
              <template #default="scope">
                <span v-if="scope.row.platform_type == 2">
                  {{ scope.row.balance_out }}
                </span>
                <span v-else>--</span>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('In_Time') + ' / ' + $t('Out_Time')"
              align="center"
              prop="last_in_time"
              width="250"
            >
              <template #default="scope">
                <div class="user-info">
                  <div class="user-id">
                    <span class="label">{{ $t("In_Time") }}:</span>
                    <span class="value">{{ scope.row.last_in_time }}</span>
                  </div>
                  <div class="user-username">
                    <span class="label">{{ $t("Out_Time") }}:</span>
                    <span class="value">
                      {{ scope.row.last_out_time }}
                    </span>
                  </div>
                </div>
              </template>
            </el-table-column>

            <el-table-column
              :label="$t('Update_Time')"
              align="center"
              prop="updated_at"
              width="150"
            />
            <el-table-column
              :label="$t('Operate')"
              fixed="right"
              align="center"
            >
              <template #default="scope">
                <el-button
                  v-hasPerm="'game_userUpdate'"
                  type="warning"
                  link
                  size="small"
                  v-if="scope.row.platform_type == 2"
                  @click="handleGameOut(scope.row)"
                >
                  {{ $t("Game_Out") }}
                </el-button>
                <el-button
                  v-hasPerm="'game_userUpdate'"
                  type="success"
                  link
                  size="small"
                  v-if="scope.row.platform_type == 2"
                  @click="handleGameBalance(scope.row)"
                >
                  {{ $t("Game_Balance") }}
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
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from "@/store/modules/app";
import { DeviceEnum } from "@/enums/DeviceEnum";
import Game from "@/components/Game/index.vue";
import Member from "@/components/Member/index.vue";
import GamePlatform from "@/components/Game/platform.vue";
import { DocumentCopy } from "@element-plus/icons-vue";
import { t} from "@/utils/i18n";
import GameUserAPI, {
  GameUserInfo,
  GameUserListVO,
  GameUserPageQuery,
  GameUserList,
} from "@/api/game/gameuser.api";
import GameUserPlatformAPI, {
  GamePlatformInfo,
} from "@/api/game/gameplatform.api";

defineOptions({
  name: "SysGameUser",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<GameUserPageQuery>({
  page: 1,
  pageSize: 15,
  field: "updated_at",
  order: "desc",
});
const selectable = (row: GameUserInfo) => ![1].includes(Number(row.id));
const pageData = ref<GameUserList[]>();
const total = ref(0);
const loading = ref(false);

const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

// Reactive data
const platformList = ref<GamePlatformInfo[]>([]);

const getPlatformString = (id: number) => {
  const platform = platformList.value.find((item) => Number(item.id) === id);
  return platform ? platform.name : "";
};

let formData = reactive<GameUserInfo>({
  id: "",
  platform_id: 0,
  platform_type: 0,
  game_id: 0,
  user_id: 0,
  user_thirds_id: 0,
  user_thirds_name: "",
  lang: "",
  currency: "",
  game_url: "",
  user_token: "",
  user_token_time: "",
  balance_in: 0,
  balance: 0,
  balance_out: 0,
  play_count: 0,
  last_in_time: "",
  last_out_time: "",
  business_sn: "",
});

const rules = reactive({
  title: [
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

const fetchInitList = async () => {
  try {
    GameUserPlatformAPI.getPage({
      pageSize: 5000,
      field: "sort",
      order: "desc",
    })
      .then((data) => {
        platformList.value = data.list;
      })
      .finally(() => {});
  } catch (error) {}
};
// 查询
async function handleQuery() {
  loading.value = true;
  let queryParamsData = {
    page: queryParams.page,
    pageSize: queryParams.pageSize,
    platform_id: queryParams.platform_id,
    user_id: queryParams.user_id,
    game_id: queryParams.game_id,
    field: queryParams.field,
    order: queryParams.order,
  };
  GameUserAPI.getPage(queryParamsData)
    .then((data: GameUserListVO) => {
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

const copyUrl = (url: string) => {
  navigator.clipboard
    .writeText(url)
    .then(() => {
      ElMessage.success(t("Copy_Success"));
    })
    .catch((err) => {
      ElMessage.error(t("Copy_Failed"));
      console.error("Failed to copy: ", err);
    });
};

/**
 * 强制退出游戏
 *
 * @param data
 */
function handleGameOut(data: GameUserInfo) {
  ElMessageBox.confirm(
    t("Confirm_Operate"),
    t("Warning"),
    {
      confirmButtonText: t("Confirm"),
      cancelButtonText: t("Cancel"),
      type: "warning",
    }
  ).then(
    function () {
      if (data.platform_type != 2) {
        ElMessage.error(t("Operate_Failed"));
        return;
      }
      loading.value = true;
      // console.log(userIds);
      let operate_data = {
        operate_type: "game_out",
        user_id: data.user_id,
        game_id: data.game_id,
        platform_id: data.platform_id,
      };
      GameUserAPI.update(operate_data)
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
/**
 * 获取游戏余额
 *
 * @param data
 */
function handleGameBalance(data: GameUserInfo) {
  ElMessageBox.confirm(
    t("Confirm_Operate"),
    t("Warning"),
    {
      confirmButtonText: t("Confirm"),
      cancelButtonText: t("Cancel"),
      type: "warning",
    }
  ).then(
    function () {
      if (data.platform_type != 2) {
        ElMessage.error(t("Operate_Failed"));
        return;
      }
      loading.value = true;
      // console.log(userIds);
      let operate_data = {
        operate_type: "game_balance",
        user_id: data.user_id,
        game_id: data.game_id,
        platform_id: data.platform_id,
      };
      GameUserAPI.update(operate_data)
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
  fetchInitList();
  handleQuery();
});
</script>
<style scoped>
.url-container {
  display: flex;
  align-items: center;
  gap: 5px;
}
.url-text {
  max-width: 200px; /* Leave space for copy icon */
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
  flex: 1;
}

.copy-icon {
  cursor: pointer;
  color: #409eff;
}

.copy-icon:hover {
  color: #409eff;
  opacity: 0.8;
}
</style>
