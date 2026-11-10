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
            <el-form-item :label="$t('Game_Type')" prop="type_id">
              <GameType v-model="queryParams.type_id" />
            </el-form-item>
            <el-form-item :label="$t('Game_Id')" prop="game_id">
              <Game v-model="queryParams.game_id" />
            </el-form-item>
            <el-form-item :label="$t('Status')" prop="win_lose_status">
              <el-select
                v-model="queryParams.win_lose_status"
                :placeholder="$t('Please_Select')"
                clearable
                filterable
              >
                <el-option
                  v-for="status in statusOptions"
                  :key="status.value"
                  :label="$t(status.label)"
                  :value="status.value"
                />
              </el-select>
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
                v-hasPerm="['game_betInsert']"
                type="success"
                icon="plus"
                @click="handleOpenDialog()"
              >
                {{ $t("Add") }}
              </el-button>
              <el-button
                v-hasPerm="'game_betDelete'"
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
              width="200"
              prop="game_id"
            >
              <template #default="scope">
                <div class="bet-price">
                  <span class="label">{{ $t("Game_Name") }}:</span>
                  <span class="value">{{ scope.row.game_info.name }}</span>
                </div>
                <div class="bet-price">
                  <span class="label">{{ $t("Game_Type") }}:</span>
                  <span class="value">
                    {{ getTypeString(scope.row.type_id) }}
                  </span>
                </div>
                <div class="bet-price">
                  <span class="label">{{ $t("Game_Platform") }}:</span>
                  <span class="value">
                    {{ getPlatformString(scope.row.platform_id) }}
                  </span>
                </div>
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
              :label="$t('Bet_Sn')"
              align="center"
              width="180"
              prop="bet_sn"
            />

            <el-table-column
              :label="$t('Bet_Price')"
              align="left"
              width="180"
              prop="bet_price"
            >
              <template #default="scope">
                <!-- //游戏下注金额 -->
                <div class="bet-price">
                  <span class="label">{{ $t("Platform") }}:</span>
                  <span class="value">{{ scope.row.bet_price }}</span>
                </div>
                <div class="bet-price">
                  <span class="label">{{ $t("Original") }}:</span>
                  <span class="value">{{ scope.row.original_bet_price }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Win_Price')"
              align="left"
              width="180"
              prop="win_price"
            >
              <template #default="scope">
                <!-- //赢金额 -->
                <div class="bet-price">
                  <span class="label">{{ $t("Platform") }}:</span>
                  <span class="value">{{ scope.row.win_price }}</span>
                </div>
                <div class="bet-price">
                  <span class="label">{{ $t("Original") }}:</span>
                  <span class="value">{{ scope.row.original_win_price }}</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Win_Lose_Status')"
              align="center"
              prop="win_lose_status"
            >
              <template #default="scope">
                <!-- //0无效 1未结算 2输 3赢 4平 -->
                <el-tag
                  :type="scope.row.win_lose_status == 2 ? 'success' : 'danger'"
                >
                  {{ getWinLoseStatusString(scope.row.win_lose_status) }}
                </el-tag>
              </template>
            </el-table-column>
            <el-table-column
              :label="$t('Bet_Time')"
              align="center"
              prop="bet_time"
              width="150"
            />
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
                  v-hasPerm="'game_betUpdate'"
                  type="primary"
                  icon="edit"
                  link
                  size="small"
                  @click="handleOpenDialog(scope.row)"
                >
                  {{ $t("Edit") }}
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
          <el-col :span="12"></el-col>
          <el-col :span="12"></el-col>
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
import Game from "@/components/Game/index.vue";
import Member from "@/components/Member/index.vue";
import GamePlatform from "@/components/Game/platform.vue";
import GameType from "@/components/Game/type.vue";
import { t} from "@/utils/i18n";
import GameBetAPI, {
  GameBetInfo,
  GameBetListVO,
  GameBetPageQuery,
  GameBetList,
} from "@/api/game/gamebet.api";
import GameBetPlatformAPI, {
  GamePlatformInfo,
} from "@/api/game/gameplatform.api";
import GameTypeAPI, { GameTypeInfo } from "@/api/game/gametype.api";

defineOptions({
  name: "SysGameBet",
  inheritAttrs: false,
});

const appStore = useAppStore();

const queryFormRef = ref();
const dataFormRef = ref();

const queryParams = reactive<GameBetPageQuery>({
  page: 1,
  pageSize: 15,
  field: "sort",
  order: "desc",
});
const selectable = (row: GameBetInfo) => ![1].includes(Number(row.id));
const pageData = ref<GameBetList[]>();
const total = ref(0);
const loading = ref(false);

const dialog = reactive({
  visible: false,
  title: t("Add") + t("GameBet"),
});
const drawerSize = computed(() =>
  appStore.device === DeviceEnum.DESKTOP ? "600px" : "90%"
);

// Reactive data
const platformList = ref<GamePlatformInfo[]>([]);
const typeList = ref<GameTypeInfo[]>([]);

const getPlatformString = (id: number) => {
  const platform = platformList.value.find((item) => Number(item.id) === id);
  return platform ? platform.name : "";
};

const getTypeString = (id: number) => {
  const type = typeList.value.find((item) => Number(item.id) === id);
  return type ? type.name : "";
};
//0无效 1未结算 2输 3赢 4平
const statusOptions = [
  {
    value: 0,
    label: t("Invalid"),
  },
  {
    value: 1,
    label: t("Unsettled"),
  },
  {
    value: 2,
    label: t("Lose"),
  },
  {
    value: 3,
    label: t("Win"),
  },
  {
    value: 4,
    label: t("Tie"),
  },
];

const getWinLoseStatusString = (status: number) => {
  const item = statusOptions.find((item) => Number(item.value) === status);
  return item ? item.label : "";
};

let formData = reactive<GameBetInfo>({
  id: "",
  platform_id: 0,
  game_id: 0,
  user_id: 0,
  type_id: 0,
  bet_sn: "",
  trans_no: "",
  bet_price: 0,
  win_lose_status: 0,
  win_lose_price: 0,
  win_price: 0,
  bet_time: "",
  over_time: "",
  bet_info: "",
  user_reports_stat: 0,
  sys_reports_stat: 0,
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
    GameBetPlatformAPI.getPage({
      pageSize: 5000,
      field: "sort",
      order: "desc",
    })
      .then((data) => {
        platformList.value = data.list;
      })
      .finally(() => {});
  } catch (error) {}
  try {
    GameTypeAPI.getPage({
      pageSize: 5000,
      field: "sort",
      order: "desc",
    })
      .then((data) => {
        typeList.value = data.list;
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
    bet_sn__trans_no: ["like", queryParams.keywords],
    win_lose_status: queryParams.win_lose_status,
    type_id: queryParams.type_id,
    platform_id: queryParams.platform_id,
    user_id: queryParams.user_id,
    game_id: queryParams.game_id,
    field: queryParams.field,
    order: queryParams.order,
  };
  GameBetAPI.getPage(queryParamsData)
    .then((data: GameBetListVO) => {
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
async function handleOpenDialog(user?: GameBetInfo) {
  dialog.visible = true;
  if (user?.id) {
    dialog.title = t("Edit") + t("GameBet");
    //复制 user 给formData.value
    Object.assign(formData, user);
  } else {
    dialog.title = t("Add") + t("GameBet");
  }
}

// 关闭弹窗
function handleCloseDialog() {
  dialog.visible = false;
  dataFormRef.value.resetFields();
  dataFormRef.value.clearValidate();
  formData.id = "";
  formData.platform_id = 0;
  formData.game_id = 0;
  formData.user_id = 0;
  formData.type_id = 0;
  formData.bet_sn = "";
  formData.trans_no = "";
  formData.bet_price = 0;
  formData.win_lose_status = 0;
  formData.win_lose_price = 0;
  formData.win_price = 0;
  formData.bet_time = "";
  formData.over_time = "";
  formData.bet_info = "";
  formData.user_reports_stat = 0;
  formData.sys_reports_stat = 0;
}

// 提交语言表单（防抖）
const handleSubmit = useDebounceFn(() => {
  dataFormRef.value.validate((valid: boolean) => {
    if (valid) {
      const userId = formData.id;
      loading.value = true;
      if (userId) {
        GameBetAPI.update(formData)
          .then(() => {
            ElMessage.success(t("Operate_Success"));
            handleCloseDialog();
            handleResetQuery();
          })
          .finally(() => (loading.value = false));
      } else {
        GameBetAPI.create(formData)
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


onMounted(() => {
  fetchInitList();
  handleQuery();
});
</script>
