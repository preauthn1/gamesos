<script setup>
import { ref, computed } from 'vue'

// ==================== 彩票类型配置 ====================
const lotteryType = ref('dlt') // dlt: 大乐透, ssq: 双色球

const lotteryConfig = {
  dlt: {
    name: '大乐透',
    frontName: '前区',
    backName: '后区',
    frontMax: 35,
    backMax: 12,
    frontPick: 5,
    backPick: 2,
    betAmount: 2,
    drawTime: '每周一、三、六 21:10',
    hasAddBet: true // 大乐透有追加投注
  },
  ssq: {
    name: '双色球',
    frontName: '红球',
    backName: '蓝球',
    frontMax: 33,
    backMax: 16,
    frontPick: 6,
    backPick: 1,
    betAmount: 2,
    drawTime: '每周二、四、日 21:15',
    hasAddBet: false // 双色球没有追加投注
  }
}

const currentConfig = computed(() => lotteryConfig[lotteryType.value])

// 切换彩票类型
const switchLotteryType = (type) => {
  if (type === lotteryType.value) return
  lotteryType.value = type
  // 清空当前选号和生成的号码
  frontNumbers.value = []
  backNumbers.value = []
  selectedFront.value = []
  selectedBack.value = []
  isAddBet.value = false
}

// ==================== 随机选号器 ====================
const frontNumbers = ref([])
const backNumbers = ref([])
const isGenerating = ref(false)
const historyList = ref([])

// 生成随机号码
const generateNumbers = () => {
  isGenerating.value = true
  const config = currentConfig.value

  let count = 0
  const interval = setInterval(() => {
    // 前区/红球
    const front = []
    while (front.length < config.frontPick) {
      const num = Math.floor(Math.random() * config.frontMax) + 1
      if (!front.includes(num)) front.push(num)
    }
    front.sort((a, b) => a - b)
    frontNumbers.value = front

    // 后区/蓝球
    const back = []
    while (back.length < config.backPick) {
      const num = Math.floor(Math.random() * config.backMax) + 1
      if (!back.includes(num)) back.push(num)
    }
    back.sort((a, b) => a - b)
    backNumbers.value = back

    count++
    if (count >= 15) {
      clearInterval(interval)
      isGenerating.value = false
      historyList.value.unshift({
        id: Date.now(),
        type: lotteryType.value,
        typeName: config.name,
        front: [...frontNumbers.value],
        back: [...backNumbers.value],
        time: new Date().toLocaleTimeString()
      })
      if (historyList.value.length > 10) {
        historyList.value.pop()
      }
    }
  }, 80)
}

// 清空历史
const clearHistory = () => {
  historyList.value = []
}

// ==================== 投注计算器 ====================
const selectedFront = ref([])
const selectedBack = ref([])
const isAddBet = ref(false)

// 动态号码池
const frontPool = computed(() =>
  Array.from({ length: currentConfig.value.frontMax }, (_, i) => i + 1)
)
const backPool = computed(() =>
  Array.from({ length: currentConfig.value.backMax }, (_, i) => i + 1)
)

// 计算组合数 C(n, k)
const combination = (n, k) => {
  if (k > n || k < 0) return 0
  if (k === 0 || k === n) return 1
  let result = 1
  for (let i = 0; i < k; i++) {
    result = result * (n - i) / (i + 1)
  }
  return Math.round(result)
}

// 切换前区号码选择
const toggleFront = (num) => {
  const index = selectedFront.value.indexOf(num)
  if (index > -1) {
    selectedFront.value.splice(index, 1)
  } else {
    selectedFront.value.push(num)
  }
}

// 切换后区号码选择
const toggleBack = (num) => {
  const index = selectedBack.value.indexOf(num)
  if (index > -1) {
    selectedBack.value.splice(index, 1)
  } else {
    selectedBack.value.push(num)
  }
}

// 清空选号
const clearSelection = () => {
  selectedFront.value = []
  selectedBack.value = []
  isAddBet.value = false
}

// 机选一注
const quickPick = () => {
  const config = currentConfig.value

  const front = []
  while (front.length < config.frontPick) {
    const num = Math.floor(Math.random() * config.frontMax) + 1
    if (!front.includes(num)) front.push(num)
  }
  selectedFront.value = front.sort((a, b) => a - b)

  const back = []
  while (back.length < config.backPick) {
    const num = Math.floor(Math.random() * config.backMax) + 1
    if (!back.includes(num)) back.push(num)
  }
  selectedBack.value = back.sort((a, b) => a - b)
}

// 计算注数
const betCount = computed(() => {
  const config = currentConfig.value
  const frontCount = selectedFront.value.length
  const backCount = selectedBack.value.length
  if (frontCount < config.frontPick || backCount < config.backPick) return 0
  return combination(frontCount, config.frontPick) * combination(backCount, config.backPick)
})

// 计算总投注金额
const totalBet = computed(() => {
  const config = currentConfig.value
  const base = config.betAmount * betCount.value
  // 只有大乐透有追加投注
  return (config.hasAddBet && isAddBet.value) ? base * 1.5 : base
})

// 是否可以投注
const canBet = computed(() => {
  const config = currentConfig.value
  return selectedFront.value.length >= config.frontPick &&
         selectedBack.value.length >= config.backPick
})

// 投注方式文本
const betTypeText = computed(() => {
  const config = currentConfig.value
  if (selectedFront.value.length < config.frontPick ||
      selectedBack.value.length < config.backPick) {
    return '请选号'
  }
  return (selectedFront.value.length > config.frontPick ||
          selectedBack.value.length > config.backPick) ? '复式投注' : '单式投注'
})

// 奖级说明 - 大乐透
const dltPrizeInfo = [
  { level: '一等奖', match: '前区5+后区2', prize: '浮动（最高1000万）' },
  { level: '二等奖', match: '前区5+后区1', prize: '浮动' },
  { level: '三等奖', match: '前区5', prize: '10,000元' },
  { level: '四等奖', match: '前区4+后区2', prize: '3,000元' },
  { level: '五等奖', match: '前区4+后区1', prize: '300元' },
  { level: '六等奖', match: '前区4 或 前区3+后区2', prize: '200元' },
  { level: '七等奖', match: '前区3+后区1 或 前区2+后区2', prize: '100元' },
  { level: '八等奖', match: '前区3 或 前区1+后区2 或 前区2+后区1', prize: '15元' },
  { level: '九等奖', match: '前区2 或 前区1+后区1 或 仅后区2', prize: '5元' },
]

// 奖级说明 - 双色球
const ssqPrizeInfo = [
  { level: '一等奖', match: '红球6+蓝球1', prize: '浮动（最高1000万）' },
  { level: '二等奖', match: '红球6', prize: '浮动' },
  { level: '三等奖', match: '红球5+蓝球1', prize: '3,000元' },
  { level: '四等奖', match: '红球5 或 红球4+蓝球1', prize: '200元' },
  { level: '五等奖', match: '红球4 或 红球3+蓝球1', prize: '10元' },
  { level: '六等奖', match: '红球2+蓝球1 或 红球1+蓝球1 或 仅蓝球1', prize: '5元' },
]

// 当前奖级信息
const currentPrizeInfo = computed(() =>
  lotteryType.value === 'dlt' ? dltPrizeInfo : ssqPrizeInfo
)

// ==================== Tab切换 ====================
const activeTab = ref('picker')

</script>

<template>
  <div class="cards-view">
    <!-- 顶部标题 -->
    <div class="header">
      <h1 class="title">彩票工具</h1>
      <p class="subtitle">随机选号 · 投注计算</p>
    </div>

    <!-- 彩票类型切换 -->
    <div class="lottery-type-switch">
      <div
        :class="['type-item', { active: lotteryType === 'dlt' }]"
        @click="switchLotteryType('dlt')"
      >
        <span class="type-icon dlt">乐</span>
        <span class="type-name">大乐透</span>
      </div>
      <div
        :class="['type-item', { active: lotteryType === 'ssq' }]"
        @click="switchLotteryType('ssq')"
      >
        <span class="type-icon ssq">双</span>
        <span class="type-name">双色球</span>
      </div>
    </div>

    <!-- Tab切换 -->
    <div class="tabs">
      <div
        :class="['tab-item', { active: activeTab === 'picker' }]"
        @click="activeTab = 'picker'"
      >
        随机选号
      </div>
      <div
        :class="['tab-item', { active: activeTab === 'calculator' }]"
        @click="activeTab = 'calculator'"
      >
        投注计算
      </div>
      <div
        :class="['tab-item', { active: activeTab === 'rules' }]"
        @click="activeTab = 'rules'"
      >
        玩法规则
      </div>
    </div>

    <!-- 随机选号器 -->
    <div v-if="activeTab === 'picker'" class="picker-section">
      <!-- 号码展示区 -->
      <div class="number-display">
        <div class="number-group">
          <div class="group-label">
            {{ currentConfig.frontName }}
            <span class="hint">(1-{{ currentConfig.frontMax }}选{{ currentConfig.frontPick }})</span>
          </div>
          <div class="number-balls front">
            <template v-if="frontNumbers.length > 0">
              <div
                v-for="num in frontNumbers"
                :key="'front-' + num"
                class="ball front-ball"
                :class="{ generating: isGenerating }"
              >
                {{ num.toString().padStart(2, '0') }}
              </div>
            </template>
            <template v-else>
              <div class="ball empty" v-for="i in currentConfig.frontPick" :key="'empty-front-' + i">--</div>
            </template>
          </div>
        </div>

        <div class="number-group">
          <div class="group-label">
            {{ currentConfig.backName }}
            <span class="hint">(1-{{ currentConfig.backMax }}选{{ currentConfig.backPick }})</span>
          </div>
          <div class="number-balls back">
            <template v-if="backNumbers.length > 0">
              <div
                v-for="num in backNumbers"
                :key="'back-' + num"
                class="ball back-ball"
                :class="{ generating: isGenerating }"
              >
                {{ num.toString().padStart(2, '0') }}
              </div>
            </template>
            <template v-else>
              <div class="ball empty" v-for="i in currentConfig.backPick" :key="'empty-back-' + i">--</div>
            </template>
          </div>
        </div>
      </div>

      <!-- 生成按钮 -->
      <button
        class="btn-generate"
        @click="generateNumbers"
        :disabled="isGenerating"
      >
        <span v-if="isGenerating">生成中...</span>
        <span v-else>随机选号</span>
      </button>

      <!-- 提示信息 -->
      <div class="disclaimer">
        本功能仅提供随机数字生成，不构成任何投注建议。彩票开奖完全随机，请理性购彩。
      </div>

      <!-- 历史记录 -->
      <div class="history-section" v-if="historyList.length > 0">
        <div class="history-header">
          <span class="history-title">生成记录</span>
          <span class="history-clear" @click="clearHistory">清空</span>
        </div>
        <div class="history-list">
          <div class="history-item" v-for="item in historyList" :key="item.id">
            <div class="history-left">
              <span :class="['history-type-tag', item.type]">{{ item.typeName }}</span>
              <div class="history-numbers">
                <span class="history-front" v-for="num in item.front" :key="'h-front-' + item.id + '-' + num">
                  {{ num.toString().padStart(2, '0') }}
                </span>
                <span class="history-divider">|</span>
                <span class="history-back" v-for="num in item.back" :key="'h-back-' + item.id + '-' + num">
                  {{ num.toString().padStart(2, '0') }}
                </span>
              </div>
            </div>
            <div class="history-time">{{ item.time }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 投注计算器 -->
    <div v-if="activeTab === 'calculator'" class="calculator-section">
      <!-- 选号区域 -->
      <div class="selection-area">
        <!-- 前区选号 -->
        <div class="number-section">
          <div class="section-label">
            {{ currentConfig.frontName }}
            <span class="hint">至少选{{ currentConfig.frontPick }}个号码</span>
            <span class="count-badge">已选 {{ selectedFront.length }}</span>
          </div>
          <div class="number-grid" :class="lotteryType === 'ssq' ? 'ssq-front-grid' : 'front-grid'">
            <div
              v-for="num in frontPool"
              :key="'front-' + num"
              :class="['number-item', { selected: selectedFront.includes(num) }]"
              @click="toggleFront(num)"
            >
              {{ num.toString().padStart(2, '0') }}
            </div>
          </div>
        </div>

        <!-- 后区选号 -->
        <div class="number-section">
          <div class="section-label">
            {{ currentConfig.backName }}
            <span class="hint">至少选{{ currentConfig.backPick }}个号码</span>
            <span class="count-badge back">已选 {{ selectedBack.length }}</span>
          </div>
          <div class="number-grid" :class="lotteryType === 'ssq' ? 'ssq-back-grid' : 'back-grid'">
            <div
              v-for="num in backPool"
              :key="'back-' + num"
              :class="['number-item back', { selected: selectedBack.includes(num) }]"
              @click="toggleBack(num)"
            >
              {{ num.toString().padStart(2, '0') }}
            </div>
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="action-buttons">
          <button class="btn-action" @click="quickPick">机选一注</button>
          <button class="btn-action secondary" @click="clearSelection">清空选号</button>
        </div>

        <!-- 追加投注开关 (仅大乐透) -->
        <div v-if="currentConfig.hasAddBet" class="add-bet-toggle" @click="isAddBet = !isAddBet">
          <span class="toggle-label">追加投注 (+1元/注)</span>
          <div :class="['toggle-switch', { active: isAddBet }]">
            <div class="toggle-thumb"></div>
          </div>
        </div>
      </div>

      <!-- 计算结果 -->
      <div class="calc-result">
        <div class="result-row">
          <span class="result-label">投注方式</span>
          <span class="result-value">{{ betTypeText }}</span>
        </div>
        <div class="result-row">
          <span class="result-label">注数</span>
          <span class="result-value">{{ betCount }} 注</span>
        </div>
        <div class="result-row">
          <span class="result-label">单注金额</span>
          <span class="result-value">¥{{ currentConfig.hasAddBet && isAddBet ? 3 : 2 }}</span>
        </div>
        <div class="result-row total">
          <span class="result-label">总投注金额</span>
          <span class="result-value highlight">¥{{ totalBet }}</span>
        </div>
      </div>

      <!-- 选号预览 -->
      <div v-if="canBet" class="selection-preview">
        <div class="preview-label">已选号码</div>
        <div class="preview-numbers">
          <span class="preview-ball front" v-for="num in [...selectedFront].sort((a,b) => a-b)" :key="'pf-' + num">
            {{ num.toString().padStart(2, '0') }}
          </span>
          <span class="preview-divider">+</span>
          <span class="preview-ball back" v-for="num in [...selectedBack].sort((a,b) => a-b)" :key="'pb-' + num">
            {{ num.toString().padStart(2, '0') }}
          </span>
        </div>
      </div>

      <!-- 奖级说明表格 -->
      <div class="prize-table">
        <div class="table-header">
          <span class="col-level">奖级</span>
          <span class="col-match">中奖条件</span>
          <span class="col-prize">奖金</span>
        </div>
        <div class="table-row" v-for="(prize, index) in currentPrizeInfo" :key="index">
          <span class="col-level">{{ prize.level }}</span>
          <span class="col-match">{{ prize.match }}</span>
          <span class="col-prize">{{ prize.prize }}</span>
        </div>
      </div>
    </div>

    <!-- 玩法规则 -->
    <div v-if="activeTab === 'rules'" class="rules-section">
      <!-- 大乐透规则 -->
      <template v-if="lotteryType === 'dlt'">
        <div class="rule-card">
          <h3 class="rule-title">大乐透基本规则</h3>
          <div class="rule-content">
            <p><strong>选号方式：</strong></p>
            <p>前区：从01-35中选择5个号码</p>
            <p>后区：从01-12中选择2个号码</p>
            <p class="rule-divider"></p>
            <p><strong>开奖时间：</strong></p>
            <p>每周一、三、六 21:10</p>
            <p class="rule-divider"></p>
            <p><strong>单注金额：</strong>2元</p>
            <p class="rule-divider"></p>
            <p><strong>兑奖期限：</strong>开奖之日起60个自然日内</p>
          </div>
        </div>

        <div class="rule-card">
          <h3 class="rule-title">追加投注</h3>
          <div class="rule-content">
            <p>每注可额外支付1元进行追加投注</p>
            <p>追加投注中得一至七等奖，奖金为对应基本奖金的80%</p>
          </div>
        </div>
      </template>

      <!-- 双色球规则 -->
      <template v-else>
        <div class="rule-card">
          <h3 class="rule-title">双色球基本规则</h3>
          <div class="rule-content">
            <p><strong>选号方式：</strong></p>
            <p>红球：从01-33中选择6个号码</p>
            <p>蓝球：从01-16中选择1个号码</p>
            <p class="rule-divider"></p>
            <p><strong>开奖时间：</strong></p>
            <p>每周二、四、日 21:15</p>
            <p class="rule-divider"></p>
            <p><strong>单注金额：</strong>2元</p>
            <p class="rule-divider"></p>
            <p><strong>兑奖期限：</strong>开奖之日起60个自然日内</p>
          </div>
        </div>

        <div class="rule-card">
          <h3 class="rule-title">中奖概率</h3>
          <div class="rule-content">
            <p>一等奖概率：1/17,721,088</p>
            <p>二等奖概率：1/1,180,739</p>
            <p>三等奖概率：1/63,349</p>
            <p>整体中奖概率：约1/6.7</p>
          </div>
        </div>
      </template>

      <div class="rule-card warning">
        <h3 class="rule-title">温馨提示</h3>
        <div class="rule-content">
          <p>彩票开奖结果完全随机，任何预测方法均无科学依据</p>
          <p>购买彩票须年满18周岁</p>
          <p>理性购彩，量力而行</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.cards-view {
  background: var(--bg-primary);
  min-height: 100vh;
  padding-bottom: 100px;
}

.header {
  padding: 20px 16px 10px;
  text-align: center;
  padding-top: calc(env(safe-area-inset-top, 0px) + 20px);
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-primary);
  margin-bottom: 4px;
}

.subtitle {
  font-size: 14px;
  color: var(--text-muted);
}

/* 彩票类型切换 */
.lottery-type-switch {
  display: flex;
  gap: 12px;
  margin: 0 16px 16px;
}

.type-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 12px;
  background: var(--bg-card);
  border: 2px solid var(--border-primary);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.type-item.active {
  border-color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 10%, var(--bg-card));
}

.type-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: bold;
  color: #fff;
}

.type-icon.dlt {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.type-icon.ssq {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.type-name {
  font-size: 15px;
  font-weight: 600;
  color: var(--text-primary);
}

/* Tab切换 */
.tabs {
  display: flex;
  margin: 0 16px 16px;
  background: var(--bg-hover);
  border-radius: 12px;
  padding: 4px;
}

.tab-item {
  flex: 1;
  text-align: center;
  padding: 12px;
  font-size: 14px;
  color: var(--text-light);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.tab-item.active {
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  font-weight: 600;
}

/* ==================== 随机选号器 ==================== */
.picker-section {
  padding: 0 16px;
}

.number-display {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid var(--border-primary);
  margin-bottom: 16px;
}

.number-group {
  margin-bottom: 20px;
}

.number-group:last-child {
  margin-bottom: 0;
}

.group-label {
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 12px;
}

.group-label .hint {
  font-size: 12px;
  color: var(--text-muted);
}

.number-balls {
  display: flex;
  gap: 8px;
  justify-content: center;
  flex-wrap: wrap;
}

.ball {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
  transition: all 0.2s ease;
}

.ball.empty {
  background: var(--bg-hover);
  color: var(--text-muted);
  border: 2px dashed var(--border-primary);
}

.ball.front-ball {
  background: var(--gradient-danger);
  color: var(--text-primary);
  box-shadow: 0 4px 12px rgba(239, 68, 68, 0.4);
}

.ball.back-ball {
  background: var(--gradient-info);
  color: var(--text-primary);
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.ball.generating {
  animation: pulse 0.15s ease-in-out;
}

@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
}

.btn-generate {
  width: 100%;
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  border: none;
  padding: 16px;
  border-radius: 12px;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-bottom: 16px;
}

.btn-generate:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-generate:active:not(:disabled) {
  transform: scale(0.98);
}

.disclaimer {
  background: rgba(234, 179, 8, 0.1);
  border: 1px solid rgba(234, 179, 8, 0.3);
  border-radius: 8px;
  padding: 12px;
  font-size: 12px;
  color: var(--color-warning);
  text-align: center;
  line-height: 1.6;
  margin-bottom: 20px;
}

/* 历史记录 */
.history-section {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid var(--border-primary);
}

.history-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.history-title {
  font-size: 14px;
  color: var(--text-light);
}

.history-clear {
  font-size: 12px;
  color: var(--color-error);
  cursor: pointer;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.history-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background: var(--bg-secondary);
  border-radius: 8px;
}

.history-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.history-type-tag {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  color: #fff;
}

.history-type-tag.dlt {
  background: linear-gradient(135deg, #f97316, #ea580c);
}

.history-type-tag.ssq {
  background: linear-gradient(135deg, #ef4444, #dc2626);
}

.history-numbers {
  display: flex;
  gap: 4px;
  align-items: center;
  flex-wrap: wrap;
}

.history-front {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: var(--color-error);
  color: var(--text-primary);
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
}

.history-back {
  display: inline-block;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: var(--color-info);
  color: var(--text-primary);
  border-radius: 50%;
  font-size: 11px;
  font-weight: 600;
}

.history-divider {
  color: var(--text-muted);
  margin: 0 2px;
  font-size: 12px;
}

.history-time {
  font-size: 12px;
  color: var(--text-muted);
  flex-shrink: 0;
}

/* ==================== 投注计算器 ==================== */
.calculator-section {
  padding: 0 16px;
}

/* 选号区域 */
.selection-area {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid var(--border-primary);
  margin-bottom: 16px;
}

.number-section {
  margin-bottom: 20px;
}

.number-section:last-of-type {
  margin-bottom: 16px;
}

.section-label {
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-label .hint {
  font-size: 12px;
  color: var(--text-muted);
}

.count-badge {
  margin-left: auto;
  font-size: 12px;
  background: color-mix(in srgb, var(--color-error) 20%, transparent);
  color: var(--color-error);
  padding: 2px 8px;
  border-radius: 10px;
}

.count-badge.back {
  background: color-mix(in srgb, var(--color-info) 20%, transparent);
  color: var(--color-info);
}

.number-grid {
  display: grid;
  gap: 8px;
}

.front-grid {
  grid-template-columns: repeat(7, 1fr);
}

.back-grid {
  grid-template-columns: repeat(6, 1fr);
}

.ssq-front-grid {
  grid-template-columns: repeat(6, 1fr);
}

.ssq-back-grid {
  grid-template-columns: repeat(8, 1fr);
}

.number-item {
  aspect-ratio: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-hover);
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 14px;
  color: var(--text-light);
  cursor: pointer;
  transition: all 0.2s ease;
  user-select: none;
  -webkit-tap-highlight-color: transparent;
}

.number-item:active {
  transform: scale(0.95);
}

.number-item.selected {
  background: var(--gradient-danger);
  border-color: var(--color-error);
  color: var(--text-primary);
  font-weight: 600;
  box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
}

.number-item.back.selected {
  background: var(--gradient-info);
  border-color: var(--color-info);
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}

.btn-action {
  flex: 1;
  padding: 12px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
  background: var(--gradient-primary);
  color: var(--text-on-primary);
}

.btn-action.secondary {
  background: var(--bg-hover);
  border: 1px solid var(--border-primary);
  color: var(--text-light);
}

.btn-action:active {
  transform: scale(0.98);
}

/* 追加投注开关 */
.add-bet-toggle {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-secondary);
  border-radius: 10px;
  cursor: pointer;
}

.toggle-label {
  font-size: 14px;
  color: var(--text-primary);
}

.toggle-switch {
  width: 48px;
  height: 26px;
  background: var(--bg-hover);
  border-radius: 13px;
  position: relative;
  transition: all 0.3s ease;
}

.toggle-switch.active {
  background: var(--gradient-primary);
}

.toggle-thumb {
  width: 22px;
  height: 22px;
  background: var(--text-primary);
  border-radius: 50%;
  position: absolute;
  top: 2px;
  left: 2px;
  transition: all 0.3s ease;
}

.toggle-switch.active .toggle-thumb {
  left: 24px;
}

/* 计算结果 */
.calc-result {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid var(--border-primary);
  margin-bottom: 16px;
}

.result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid var(--border-light);
}

.result-row:last-child {
  border-bottom: none;
}

.result-row.total {
  margin-top: 8px;
  padding-top: 12px;
  border-top: 1px solid var(--border-primary);
}

.result-label {
  font-size: 14px;
  color: var(--text-light);
}

.result-value {
  font-size: 14px;
  color: var(--text-primary);
  font-weight: 600;
}

.result-value.highlight {
  color: var(--color-primary);
  font-size: 20px;
}

/* 选号预览 */
.selection-preview {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid var(--border-primary);
  margin-bottom: 16px;
}

.preview-label {
  font-size: 14px;
  color: var(--text-light);
  margin-bottom: 12px;
}

.preview-numbers {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.preview-ball {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 600;
  color: var(--text-primary);
}

.preview-ball.front {
  background: var(--gradient-danger);
}

.preview-ball.back {
  background: var(--gradient-info);
}

.preview-divider {
  color: var(--text-muted);
  font-size: 16px;
  margin: 0 4px;
}

/* 奖级表格 */
.prize-table {
  background: var(--bg-card);
  border-radius: 16px;
  border: 1px solid var(--border-primary);
  overflow: hidden;
  margin-bottom: 16px;
}

.table-header {
  display: flex;
  padding: 12px;
  background: var(--bg-secondary);
  font-size: 12px;
  color: var(--text-light);
  font-weight: 600;
}

.table-row {
  display: flex;
  padding: 12px;
  border-bottom: 1px solid var(--border-light);
  font-size: 13px;
}

.table-row:last-child {
  border-bottom: none;
}

.col-level {
  width: 60px;
  flex-shrink: 0;
  color: var(--color-primary);
  font-weight: 600;
}

.col-match {
  flex: 1;
  color: var(--text-primary);
}

.col-prize {
  width: 100px;
  flex-shrink: 0;
  text-align: right;
  color: var(--color-warning);
  font-weight: 600;
}

.table-header .col-level,
.table-header .col-match,
.table-header .col-prize {
  color: var(--text-light);
}

/* ==================== 玩法规则 ==================== */
.rules-section {
  padding: 0 16px;
}

.rule-card {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 16px;
  border: 1px solid var(--border-primary);
  margin-bottom: 16px;
}

.rule-card.warning {
  background: color-mix(in srgb, var(--color-warning) 10%, var(--bg-secondary));
  border-color: color-mix(in srgb, var(--color-warning) 30%, transparent);
}

.rule-title {
  font-size: 16px;
  color: var(--color-primary);
  font-weight: 600;
  margin-bottom: 12px;
}

.rule-card.warning .rule-title {
  color: var(--color-warning);
}

.rule-content {
  font-size: 14px;
  color: var(--text-primary);
  line-height: 1.8;
}

.rule-content p {
  margin: 0;
}

.rule-content strong {
  color: var(--text-primary);
}

.rule-divider {
  height: 1px;
  background: var(--border-light);
  margin: 12px 0;
}
</style>
