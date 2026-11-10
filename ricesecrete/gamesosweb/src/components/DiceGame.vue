<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// 游戏状态
const gameState = ref('waiting') // waiting, rolling, result
const countdown = ref(20)
const diceResults = ref([1, 1, 1])
const displayResults = ref([1, 1, 1])
const isRolling = ref(false)
const diceRotations = ref([
  { x: 0, y: 0, z: 15 },
  { x: 0, y: 0, z: -20 },
  { x: 0, y: 0, z: 8 }
])

// 计时器
let countdownTimer = null
let rollAnimationTimer = null

// 骰子面的点数布局 (用于6个面)
const diceFaces = {
  1: [[2, 2]],
  2: [[0, 4], [4, 0]],
  3: [[0, 4], [2, 2], [4, 0]],
  4: [[0, 0], [0, 4], [4, 0], [4, 4]],
  5: [[0, 0], [0, 4], [2, 2], [4, 0], [4, 4]],
  6: [[0, 0], [0, 4], [2, 0], [2, 4], [4, 0], [4, 4]]
}

// 根据点数获取3D旋转角度 (结果面朝上，用户俯视能看到)
// CSS坐标系: +Y向下, -Y向上
const getRotationForFace = (face) => {
  // 旋转让对应面到达-Y位置（顶部，用户俯视能看到）
  // 根据测试: z=-90显示3点, z=90显示4点
  const rotations = {
    1: { x: 90, y: 0, z: 0 },
    2: { x: 0, y: 0, z: 0 },
    3: { x: 0, y: 0, z: -90 },   // 显示3点
    4: { x: 0, y: 0, z: 90 },    // 显示4点
    5: { x: 180, y: 0, z: 0 },
    6: { x: -90, y: 0, z: 0 },
  }
  return rotations[face]
}

// 计算总点数
const totalPoints = computed(() => {
  return displayResults.value.reduce((sum, val) => sum + val, 0)
})

// 判断大小
const sizeResult = computed(() => {
  const total = totalPoints.value
  if (total >= 11) return '大'
  return '小'
})

// 判断单双
const oddEvenResult = computed(() => {
  return totalPoints.value % 2 === 0 ? '双' : '单'
})

// 开始倒计时
const startCountdown = () => {
  gameState.value = 'waiting'
  countdown.value = 20
  isRolling.value = false

  countdownTimer = setInterval(() => {
    countdown.value--

    if (countdown.value <= 0) {
      clearInterval(countdownTimer)
      startRolling()
    }
  }, 1000)
}

// 开始摇骰子动画
const startRolling = () => {
  gameState.value = 'rolling'
  isRolling.value = true

  // 生成最终结果
  diceResults.value = [
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1,
    Math.floor(Math.random() * 6) + 1
  ]

  // 滚动动画 - 2秒后停止
  setTimeout(() => {
    isRolling.value = false
    displayResults.value = [...diceResults.value]

    // 设置最终旋转角度，让对应面朝上
    diceRotations.value = diceResults.value.map(face => {
      const rotation = getRotationForFace(face)
      return {
        x: rotation.x,
        y: rotation.y,
        z: rotation.z
      }
    })

    gameState.value = 'result'

    // 5秒后开始新一轮倒计时（不重置骰子）
    setTimeout(() => {
      startCountdown()
    }, 5000)
  }, 2000)
}

// 手动开始游戏
const manualStart = () => {
  if (gameState.value === 'waiting' && countdown.value > 5) {
    clearInterval(countdownTimer)
    countdown.value = 3
    startCountdown()
  }
}

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  if (countdownTimer) clearInterval(countdownTimer)
  if (rollAnimationTimer) clearInterval(rollAnimationTimer)
})
</script>

<template>
  <div class="dice-game">
    <div class="game-header">
      <h2 class="game-title">骰宝</h2>
      <div class="game-badge">HOT</div>
    </div>

    <!-- 倒计时显示 -->
    <div class="countdown-section">
      <div class="countdown-label">
        {{ gameState === 'waiting' ? '距离开奖' : gameState === 'rolling' ? '开奖中' : '开奖结果' }}
      </div>
      <div class="countdown-timer" :class="{ 'urgent': countdown <= 5 && gameState === 'waiting' }">
        <template v-if="gameState === 'waiting'">
          <span class="countdown-number">{{ String(countdown).padStart(2, '0') }}</span>
          <span class="countdown-unit">秒</span>
        </template>
        <template v-else-if="gameState === 'rolling'">
          <span class="rolling-text">摇骰中...</span>
        </template>
        <template v-else>
          <span class="result-text">已开奖</span>
        </template>
      </div>
    </div>

    <!-- 骰子区域 -->
    <div class="dice-container">
      <div class="dice-bowl">
        <div
          v-for="index in 3"
          :key="'dice-' + index"
          class="dice-wrapper"
          :class="{ 'rolling-pos': isRolling }"
        >
          <div
            class="dice-3d"
            :class="{ rolling: isRolling }"
            :style="{
              transform: `rotateX(${diceRotations[index - 1].x}deg) rotateY(${diceRotations[index - 1].y}deg) rotateZ(${diceRotations[index - 1].z || 0}deg)`
            }"
          >
            <!-- 1点 - 顶面 -->
            <div class="dice-face face-1">
              <span
                v-for="(dot, dotIndex) in diceFaces[1]"
                :key="dotIndex"
                class="dice-dot"
                :style="{ gridRow: dot[0] + 1, gridColumn: dot[1] + 1 }"
              ></span>
            </div>
            <!-- 6点 - 底面 -->
            <div class="dice-face face-6">
              <span
                v-for="(dot, dotIndex) in diceFaces[6]"
                :key="dotIndex"
                class="dice-dot"
                :style="{ gridRow: dot[0] + 1, gridColumn: dot[1] + 1 }"
              ></span>
            </div>
            <!-- 2点 - 前面 -->
            <div class="dice-face face-2">
              <span
                v-for="(dot, dotIndex) in diceFaces[2]"
                :key="dotIndex"
                class="dice-dot"
                :style="{ gridRow: dot[0] + 1, gridColumn: dot[1] + 1 }"
              ></span>
            </div>
            <!-- 5点 - 后面 -->
            <div class="dice-face face-5">
              <span
                v-for="(dot, dotIndex) in diceFaces[5]"
                :key="dotIndex"
                class="dice-dot"
                :style="{ gridRow: dot[0] + 1, gridColumn: dot[1] + 1 }"
              ></span>
            </div>
            <!-- 3点 - 右面 -->
            <div class="dice-face face-3">
              <span
                v-for="(dot, dotIndex) in diceFaces[3]"
                :key="dotIndex"
                class="dice-dot"
                :style="{ gridRow: dot[0] + 1, gridColumn: dot[1] + 1 }"
              ></span>
            </div>
            <!-- 4点 - 左面 -->
            <div class="dice-face face-4">
              <span
                v-for="(dot, dotIndex) in diceFaces[4]"
                :key="dotIndex"
                class="dice-dot"
                :style="{ gridRow: dot[0] + 1, gridColumn: dot[1] + 1 }"
              ></span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 开奖结果 -->
    <div class="result-section" :class="{ show: gameState === 'result' }">
      <div class="result-row">
        <div class="result-item">
          <span class="result-label">点数</span>
          <span class="result-value points">{{ totalPoints }}</span>
        </div>
        <div class="result-item">
          <span class="result-label">大小</span>
          <span class="result-value" :class="sizeResult === '大' ? 'big' : 'small'">
            {{ sizeResult }}
          </span>
        </div>
        <div class="result-item">
          <span class="result-label">单双</span>
          <span class="result-value" :class="oddEvenResult === '单' ? 'odd' : 'even'">
            {{ oddEvenResult }}
          </span>
        </div>
      </div>
      <div class="dice-numbers">
        <span class="dice-num" v-for="(d, i) in displayResults" :key="i">{{ d }}</span>
        <span class="dice-sum">= {{ totalPoints }}</span>
      </div>
    </div>

    <!-- 历史记录 -->
    <div class="history-section">
      <div class="history-title">近期开奖</div>
      <div class="history-hint">游戏进行中...</div>
    </div>
  </div>
</template>

<style scoped>
.dice-game {
  background: var(--bg-card);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid var(--border-primary);
  margin: 16px;
}

.game-header {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 20px;
}

.game-title {
  font-size: 22px;
  font-weight: bold;
  color: var(--color-primary);
  margin: 0;
}

.game-badge {
  background: var(--gradient-hot);
  color: var(--text-primary);
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}

/* 倒计时区域 */
.countdown-section {
  text-align: center;
  margin-bottom: 24px;
}

.countdown-label {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.countdown-timer {
  display: inline-flex;
  align-items: baseline;
  gap: 4px;
}

.countdown-number {
  font-size: 48px;
  font-weight: bold;
  color: var(--color-primary);
  font-family: 'Courier New', monospace;
}

.countdown-timer.urgent .countdown-number {
  color: var(--color-error);
  animation: pulse 0.5s ease-in-out infinite;
}

.countdown-unit {
  font-size: 18px;
  color: var(--text-secondary);
}

.rolling-text {
  font-size: 24px;
  color: var(--color-warning);
  animation: blink 0.3s ease-in-out infinite;
}

.result-text {
  font-size: 24px;
  color: var(--color-primary);
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* 骰子容器 */
.dice-container {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 24px;
  padding: 50px 0;
  perspective: 600px;
  transform-style: preserve-3d;
}

/* 骰子盘 - 三个骰子在里面环绕滚动 */
.dice-bowl {
  position: relative;
  width: 220px;
  height: 140px;
  display: flex;
  justify-content: center;
  align-items: center;
  transform-style: preserve-3d;
  /* 俯视角度 - 负值表示从上往下看 */
  transform: rotateX(-35deg);
}

.dice-wrapper {
  perspective: 300px;
  width: 50px;
  height: 50px;
  transform-style: preserve-3d;
  position: absolute;
  /* 默认居中 */
  left: 50%;
  top: 50%;
  margin-left: -25px;
  margin-top: -25px;
}

/* 三个骰子的初始位置 - 分开且有层次 */
.dice-wrapper:nth-child(1) {
  transform: translate(-70px, 20px);
}

.dice-wrapper:nth-child(2) {
  transform: translate(0px, -35px);
}

.dice-wrapper:nth-child(3) {
  transform: translate(70px, 20px);
}

/* 骰子阴影 */
.dice-wrapper::after {
  content: '';
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 40px;
  height: 18px;
  background: radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(3px);
}

/* 3D骰子 */
.dice-3d {
  width: 50px;
  height: 50px;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 1.2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 椭圆轨道环绕动画 */
.dice-wrapper:nth-child(1).rolling-pos {
  animation: orbitEllipse1 1.2s linear infinite;
}

.dice-wrapper:nth-child(2).rolling-pos {
  animation: orbitEllipse2 1.2s linear infinite;
}

.dice-wrapper:nth-child(3).rolling-pos {
  animation: orbitEllipse3 1.2s linear infinite;
}

/* 骰子自转动画 */
.dice-wrapper:nth-child(1) .dice-3d.rolling {
  animation: spinDice1 0.4s ease-in-out infinite;
}

.dice-wrapper:nth-child(2) .dice-3d.rolling {
  animation: spinDice2 0.35s ease-in-out infinite;
}

.dice-wrapper:nth-child(3) .dice-3d.rolling {
  animation: spinDice3 0.45s ease-in-out infinite;
}

/* 椭圆轨道 - 三个骰子相位差120度 */
@keyframes orbitEllipse1 {
  0% { transform: translate(-70px, 20px); }
  25% { transform: translate(0px, -35px); }
  50% { transform: translate(70px, 20px); }
  75% { transform: translate(0px, 40px); }
  100% { transform: translate(-70px, 20px); }
}

@keyframes orbitEllipse2 {
  0% { transform: translate(0px, -35px); }
  25% { transform: translate(70px, 20px); }
  50% { transform: translate(0px, 40px); }
  75% { transform: translate(-70px, 20px); }
  100% { transform: translate(0px, -35px); }
}

@keyframes orbitEllipse3 {
  0% { transform: translate(70px, 20px); }
  25% { transform: translate(0px, 40px); }
  50% { transform: translate(-70px, 20px); }
  75% { transform: translate(0px, -35px); }
  100% { transform: translate(70px, 20px); }
}

/* 骰子自转动画 */
@keyframes spinDice1 {
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  25% { transform: rotateX(-90deg) rotateY(45deg) rotateZ(-60deg); }
  50% { transform: rotateX(-180deg) rotateY(90deg) rotateZ(-120deg); }
  75% { transform: rotateX(-270deg) rotateY(135deg) rotateZ(-180deg); }
  100% { transform: rotateX(-360deg) rotateY(180deg) rotateZ(-240deg); }
}

@keyframes spinDice2 {
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  25% { transform: rotateX(60deg) rotateY(-90deg) rotateZ(45deg); }
  50% { transform: rotateX(120deg) rotateY(-180deg) rotateZ(90deg); }
  75% { transform: rotateX(180deg) rotateY(-270deg) rotateZ(135deg); }
  100% { transform: rotateX(240deg) rotateY(-360deg) rotateZ(180deg); }
}

@keyframes spinDice3 {
  0% { transform: rotateX(0deg) rotateY(0deg) rotateZ(0deg); }
  25% { transform: rotateX(-45deg) rotateY(-60deg) rotateZ(-90deg); }
  50% { transform: rotateX(-90deg) rotateY(-120deg) rotateZ(-180deg); }
  75% { transform: rotateX(-135deg) rotateY(-180deg) rotateZ(-270deg); }
  100% { transform: rotateX(-180deg) rotateY(-240deg) rotateZ(-360deg); }
}

.dice-face {
  position: absolute;
  width: 50px;
  height: 50px;
  background: linear-gradient(145deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%);
  border: 1.5px solid #ccc;
  border-radius: 8px;
  display: grid;
  grid-template-rows: repeat(5, 1fr);
  grid-template-columns: repeat(5, 1fr);
  padding: 5px;
  box-sizing: border-box;
  backface-visibility: visible;
  box-shadow: inset 0 2px 4px rgba(255,255,255,0.8), inset 0 -2px 4px rgba(0,0,0,0.1);
}

/* 6个面的3D位置 */
.face-1 { transform: rotateX(0deg) translateZ(25px); }      /* 前面 - 1点 */
.face-6 { transform: rotateX(180deg) translateZ(25px); }    /* 后面 - 6点 */
.face-2 { transform: rotateX(90deg) translateZ(25px); }     /* 顶面 - 2点 */
.face-5 { transform: rotateX(-90deg) translateZ(25px); }    /* 底面 - 5点 */
.face-3 { transform: rotateY(90deg) translateZ(25px); }     /* 交换: 3点 */
.face-4 { transform: rotateY(-90deg) translateZ(25px); }    /* 交换: 4点 */

.dice-dot {
  width: 7px;
  height: 7px;
  background: radial-gradient(circle at 30% 30%, #d32f2f 0%, #b71c1c 70%, #7f0000 100%);
  border-radius: 50%;
  box-shadow:
    inset 0 1px 2px rgba(255,255,255,0.4),
    inset 0 -1px 1px rgba(0,0,0,0.3),
    0 1px 1px rgba(0,0,0,0.2);
  align-self: center;
  justify-self: center;
}

/* 结果区域 */
.result-section {
  background: var(--bg-secondary);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
  opacity: 0.5;
  transition: all 0.3s ease;
}

.result-section.show {
  opacity: 1;
  background: color-mix(in srgb, var(--color-primary) 10%, var(--bg-secondary));
  border: 1px solid color-mix(in srgb, var(--color-primary) 30%, transparent);
}

.result-row {
  display: flex;
  justify-content: space-around;
  margin-bottom: 12px;
}

.result-item {
  text-align: center;
}

.result-label {
  display: block;
  font-size: 12px;
  color: var(--text-secondary);
  margin-bottom: 4px;
}

.result-value {
  font-size: 24px;
  font-weight: bold;
  color: var(--text-primary);
}

.result-value.points {
  color: var(--color-warning);
}

.result-value.big {
  color: var(--color-error);
}

.result-value.small {
  color: var(--color-info);
}

.result-value.odd {
  color: #8b5cf6;
}

.result-value.even {
  color: var(--color-success);
}

.dice-numbers {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  color: var(--text-primary);
}

.dice-num {
  background: color-mix(in srgb, var(--color-primary) 20%, transparent);
  padding: 4px 12px;
  border-radius: 6px;
  font-weight: bold;
}

.dice-sum {
  color: var(--color-warning);
  font-weight: bold;
}

/* 历史记录 */
.history-section {
  text-align: center;
  padding-top: 12px;
  border-top: 1px solid var(--border-light);
}

.history-title {
  font-size: 14px;
  color: var(--color-primary);
  margin-bottom: 8px;
}

.history-hint {
  font-size: 12px;
  color: var(--text-secondary);
}
</style>
