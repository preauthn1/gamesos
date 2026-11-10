<script setup>
import { ref } from 'vue'
import DiceGame from '@/components/DiceGame.vue'

const games = ref([
  { id: 1, name: 'EVOLUTION', type: '真人百家乐', img: '🎴', hot: true },
  { id: 2, name: 'SEXY Gaming', type: '真人荷官', img: '👩', hot: false },
  { id: 3, name: 'AG真人', type: '真人娱乐', img: '🎲', hot: true },
  { id: 4, name: 'DG真人', type: '真人娱乐', img: '🃏', hot: false }
])
</script>

<template>
  <div class="casino-view">
    <div class="header">
      <h1 class="title">赌场游戏</h1>
    </div>

    <!-- 骰子游戏 -->
    <DiceGame />

    <div class="games-container">
      <div class="game-card" v-for="game in games" :key="game.id">
        <div class="game-badge" v-if="game.hot">HOT</div>
        <div class="game-img">{{ game.img }}</div>
        <div class="game-info">
          <div class="game-name">{{ game.name }}</div>
          <div class="game-type">{{ game.type }}</div>
        </div>
        <button class="btn-play">立即游玩</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.casino-view {
  background: var(--bg-primary);
  min-height: 100vh;
  padding-bottom: 80px;
}

.header {
  padding: 20px 16px;
  padding-top: calc(env(safe-area-inset-top, 0px) + 20px);
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: var(--color-primary);
  text-align: center;
}

.games-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
  padding: 0 16px;
}

.game-card {
  background: var(--bg-card);
  border-radius: 12px;
  padding: 16px;
  border: 1px solid var(--border-primary);
  position: relative;
}

.game-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  background: var(--gradient-hot);
  color: var(--text-primary);
  font-size: 10px;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: bold;
}

.game-img {
  font-size: 64px;
  text-align: center;
  margin: 20px 0;
}

.game-info {
  margin-bottom: 12px;
  text-align: center;
}

.game-name {
  font-size: 16px;
  font-weight: bold;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.game-type {
  font-size: 12px;
  color: var(--text-secondary);
}

.btn-play {
  width: 100%;
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-play:active {
  transform: scale(0.98);
}
</style>
