<script setup>
import { ref, computed } from 'vue'

// ==================== 导航标签 ====================
const navTabs = [
  { id: 'live', name: '直播', count: null },
  { id: 'today', name: '今日', count: null },
  { id: 'early', name: '早盘', count: null },
  { id: 'champion', name: '冠军', count: null },
]
const activeNavTab = ref('live')

// ==================== 体育分类 ====================
const sportCategories = [
  { id: 'soccer', name: '足球', icon: '⚽', count: 128 },
  { id: 'basketball', name: '篮球', icon: '🏀', count: 85 },
  { id: 'tennis', name: '网球', icon: '🎾', count: 42 },
  { id: 'volleyball', name: '排球', icon: '🏐', count: 28 },
  { id: 'badminton', name: '羽毛球', icon: '🏸', count: 15 },
]
const activeSport = ref('basketball')

// ==================== 筛选标签 ====================
const filterTabs = [
  { id: 'advanced', name: '高级' },
  { id: 'newbie', name: '新手' },
  { id: 'league', name: '联赛' },
]
const activeFilter = ref('advanced')

// ==================== 比赛数据 ====================
const matches = ref([
  {
    id: 1,
    league: '日本B联赛3',
    leagueIcon: '🇯🇵',
    isLive: true,
    period: '第4节',
    time: '08:36',
    homeTeam: 'Tryhoop Okayama',
    awayTeam: 'Yamaguchi Pats Five',
    homeScore: 69,
    awayScore: 52,
    odds: {
      homeWin: { value: '-19.5', odds: '1.78' },
      awayWin: { value: '+19.5', odds: '1.87' },
      homeHandicap: { label: '主', value: '-19.5', odds: '1.78' },
      awayHandicap: { label: '客', value: '+19.5', odds: '1.87' },
      over: { label: '大', value: '154.5', odds: '1.87' },
      under: { label: '小', value: '154.5', odds: '1.77' },
    },
    recentScores: '27-15 18-19 20-18 4-0',
    totalLine: 12,
  },
  {
    id: 2,
    league: '中国CDBL',
    leagueIcon: '🇨🇳',
    isLive: true,
    period: '第3节',
    time: '06:32',
    homeTeam: 'Ningbo Waves',
    awayTeam: 'Fuzhou Guardians',
    homeScore: 63,
    awayScore: 63,
    odds: {
      homeWin: { value: '-1.5', odds: '1.72' },
      awayWin: { value: '+1.5', odds: '1.88' },
      homeHandicap: { label: '主', value: '-1.5', odds: '1.72' },
      awayHandicap: { label: '客', value: '+1.5', odds: '1.88' },
      over: { label: '大', value: '199.5', odds: '1.68' },
      under: { label: '小', value: '199.5', odds: '1.78' },
    },
    recentScores: '28-22 25-29 10-12',
    totalLine: 12,
  },
  {
    id: 3,
    league: '台湾大学女篮',
    leagueIcon: '🇹🇼',
    isLive: true,
    period: '第3节',
    time: '09:49',
    homeTeam: 'National Taipei University (女)',
    awayTeam: 'National Taiwan Sport University (女)',
    homeScore: 51,
    awayScore: 36,
    odds: {
      homeWin: { value: '-18.5', odds: '1.8' },
      awayWin: { value: '+18.5', odds: '1.84' },
      homeHandicap: { label: '主', value: '-18.5', odds: '1.8' },
      awayHandicap: { label: '客', value: '+18.5', odds: '1.84' },
      over: { label: '大', value: '155.5', odds: '1.74' },
      under: { label: '小', value: '155.5', odds: '1.74' },
    },
    recentScores: '25-20 24-16 2-0',
    totalLine: 6,
  },
  {
    id: 4,
    league: 'NBA',
    leagueIcon: '🇺🇸',
    isLive: false,
    period: '未开始',
    time: '10:30',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Golden State Warriors',
    homeScore: null,
    awayScore: null,
    odds: {
      homeWin: { value: '-3.5', odds: '1.85' },
      awayWin: { value: '+3.5', odds: '1.95' },
      homeHandicap: { label: '主', value: '-3.5', odds: '1.85' },
      awayHandicap: { label: '客', value: '+3.5', odds: '1.95' },
      over: { label: '大', value: '228.5', odds: '1.90' },
      under: { label: '小', value: '228.5', odds: '1.90' },
    },
    recentScores: null,
    totalLine: 8,
  },
])

// 格式化球队名称（截断过长的名称）
const formatTeamName = (name) => {
  if (name.length > 18) {
    return name.substring(0, 18) + '...'
  }
  return name
}
</script>

<template>
  <div class="sports-view">
    <!-- 顶部导航 -->
    <div class="header">
      <div class="header-left">
        <span class="provider-badge">FB体育</span>
      </div>
      <div class="nav-tabs">
        <div
          v-for="tab in navTabs"
          :key="tab.id"
          :class="['nav-tab', { active: activeNavTab === tab.id }]"
          @click="activeNavTab = tab.id"
        >
          {{ tab.name }}
        </div>
      </div>
    </div>

    <!-- 体育分类 -->
    <div class="sport-categories">
      <div
        v-for="sport in sportCategories"
        :key="sport.id"
        :class="['category-item', { active: activeSport === sport.id }]"
        @click="activeSport = sport.id"
      >
        <span class="category-icon">{{ sport.icon }}</span>
        <span class="category-count">{{ sport.count }}</span>
      </div>
    </div>

    <!-- 筛选标签 -->
    <div class="filter-section">
      <div class="filter-tabs">
        <div
          v-for="filter in filterTabs"
          :key="filter.id"
          :class="['filter-tab', { active: activeFilter === filter.id }]"
          @click="activeFilter = filter.id"
        >
          {{ filter.name }}
        </div>
      </div>
      <div class="filter-actions">
        <span class="filter-icon">🔍</span>
        <span class="filter-icon">📊</span>
      </div>
    </div>

    <!-- 比赛列表 -->
    <div class="matches-list">
      <div class="match-card" v-for="match in matches" :key="match.id">
        <!-- 联赛头部 -->
        <div class="league-header">
          <span class="league-icon">{{ match.leagueIcon }}</span>
          <span class="league-name">{{ match.league }}</span>
          <span class="league-arrow">›</span>
        </div>

        <!-- 比赛时间状态 -->
        <div class="match-status">
          <span v-if="match.isLive" class="live-badge">
            <span class="live-dot"></span>
            {{ match.period }} {{ match.time }}
          </span>
          <span v-else class="time-badge">{{ match.time }}</span>

          <!-- 表头 -->
          <div class="odds-header">
            <span class="odds-label">让球</span>
            <span class="odds-label">大/小</span>
          </div>
        </div>

        <!-- 主队信息 -->
        <div class="team-row">
          <div class="team-info">
            <span class="team-indicator home">主</span>
            <span class="team-name">{{ formatTeamName(match.homeTeam) }}</span>
            <span v-if="match.homeScore !== null" class="team-score">{{ match.homeScore }}</span>
          </div>
          <div class="odds-row">
            <div class="odds-cell">
              <span class="odds-value handicap">{{ match.odds.homeHandicap.value }}</span>
              <span class="odds-number">{{ match.odds.homeHandicap.odds }}</span>
            </div>
            <div class="odds-cell">
              <span class="odds-value over">{{ match.odds.over.label }} {{ match.odds.over.value }}</span>
              <span class="odds-number">{{ match.odds.over.odds }}</span>
            </div>
          </div>
        </div>

        <!-- 客队信息 -->
        <div class="team-row">
          <div class="team-info">
            <span class="team-indicator away">客</span>
            <span class="team-name">{{ formatTeamName(match.awayTeam) }}</span>
            <span v-if="match.awayScore !== null" class="team-score">{{ match.awayScore }}</span>
          </div>
          <div class="odds-row">
            <div class="odds-cell">
              <span class="odds-value handicap">{{ match.odds.awayHandicap.value }}</span>
              <span class="odds-number">{{ match.odds.awayHandicap.odds }}</span>
            </div>
            <div class="odds-cell">
              <span class="odds-value under">{{ match.odds.under.label }} {{ match.odds.under.value }}</span>
              <span class="odds-number">{{ match.odds.under.odds }}</span>
            </div>
          </div>
        </div>

        <!-- 比分详情 -->
        <div class="match-footer" v-if="match.recentScores">
          <span class="score-icon">📊</span>
          <span class="recent-scores">{{ match.recentScores }}</span>
          <span class="total-markets">共 {{ match.totalLine }} 项</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.sports-view {
  background: var(--bg-primary);
  min-height: 100vh;
  padding-bottom: 100px;
}

/* 顶部导航 */
.header {
  display: flex;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  gap: var(--spacing-md);
  background: var(--bg-secondary);
  padding-top: calc(env(safe-area-inset-top, 0px) + var(--spacing-md));
}

.header-left {
  flex-shrink: 0;
}

.provider-badge {
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  font-size: 12px;
  font-weight: 700;
  padding: 6px 10px;
  border-radius: var(--radius-md);
}

.nav-tabs {
  display: flex;
  gap: var(--spacing-sm);
  flex: 1;
  overflow-x: auto;
  scrollbar-width: none;
}

.nav-tabs::-webkit-scrollbar {
  display: none;
}

.nav-tab {
  flex-shrink: 0;
  padding: var(--spacing-sm) var(--spacing-lg);
  font-size: 14px;
  color: var(--text-secondary);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: var(--transition-fast);
  white-space: nowrap;
}

.nav-tab.active {
  background: var(--gradient-primary);
  color: var(--text-on-primary);
  font-weight: 600;
}

/* 体育分类 */
.sport-categories {
  display: flex;
  padding: var(--spacing-md) var(--spacing-lg);
  gap: var(--spacing-lg);
  overflow-x: auto;
  scrollbar-width: none;
  background: var(--bg-hover);
}

.sport-categories::-webkit-scrollbar {
  display: none;
}

.category-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  transition: var(--transition-fast);
  opacity: 0.6;
}

.category-item.active {
  opacity: 1;
}

.category-icon {
  font-size: 28px;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-secondary);
  border-radius: var(--radius-lg);
  transition: var(--transition-fast);
}

.category-item.active .category-icon {
  background: var(--bg-active);
  box-shadow: var(--shadow-md);
}

.category-count {
  font-size: 12px;
  color: var(--text-secondary);
}

.category-item.active .category-count {
  color: var(--color-primary);
}

/* 筛选区域 */
.filter-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--border-light);
}

.filter-tabs {
  display: flex;
  gap: var(--spacing-lg);
}

.filter-tab {
  font-size: 14px;
  color: var(--text-tertiary);
  cursor: pointer;
  position: relative;
  padding-bottom: var(--spacing-xs);
}

.filter-tab.active {
  color: var(--color-primary);
}

.filter-tab.active::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-primary);
  border-radius: 1px;
}

.filter-actions {
  display: flex;
  gap: var(--spacing-lg);
}

.filter-icon {
  font-size: 18px;
  cursor: pointer;
  opacity: 0.6;
}

/* 比赛列表 */
.matches-list {
  padding: 0 var(--spacing-md);
}

.match-card {
  background: var(--bg-card);
  border-radius: var(--radius-lg);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
  border: 1px solid var(--border-light);
}

/* 联赛头部 */
.league-header {
  display: flex;
  align-items: center;
  padding: 10px var(--spacing-md);
  background: var(--bg-secondary);
  gap: var(--spacing-sm);
}

.league-icon {
  font-size: 16px;
}

.league-name {
  flex: 1;
  font-size: 13px;
  color: var(--text-secondary);
}

.league-arrow {
  color: var(--text-tertiary);
  font-size: 16px;
}

/* 比赛状态 */
.match-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid var(--border-light);
}

.live-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--color-success);
}

.live-dot {
  width: 6px;
  height: 6px;
  background: var(--color-success);
  border-radius: var(--radius-circle);
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.time-badge {
  font-size: 12px;
  color: var(--text-secondary);
}

.odds-header {
  display: flex;
  gap: var(--spacing-xl);
}

.odds-label {
  font-size: 12px;
  color: var(--text-tertiary);
  width: 70px;
  text-align: center;
}

/* 球队行 */
.team-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-sm) var(--spacing-md);
}

.team-info {
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  flex: 1;
}

.team-indicator {
  font-size: 10px;
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  font-weight: 600;
}

.team-indicator.home {
  background: color-mix(in srgb, var(--color-error) 20%, transparent);
  color: var(--color-error);
}

.team-indicator.away {
  background: color-mix(in srgb, var(--color-info) 20%, transparent);
  color: var(--color-info);
}

.team-name {
  font-size: 13px;
  color: var(--text-primary);
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 140px;
}

.team-score {
  font-size: 18px;
  font-weight: 700;
  color: var(--color-primary);
  min-width: 30px;
  text-align: right;
}

/* 赔率区域 */
.odds-row {
  display: flex;
  gap: var(--spacing-sm);
}

.odds-cell {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-secondary);
  border-radius: var(--radius-md);
  padding: 6px var(--spacing-sm);
  min-width: 70px;
  cursor: pointer;
  transition: var(--transition-fast);
}

.odds-cell:active {
  background: var(--bg-active);
}

.odds-value {
  font-size: 11px;
  color: var(--text-secondary);
  margin-bottom: 2px;
}

.odds-value.handicap {
  color: var(--color-success);
}

.odds-value.over {
  color: var(--color-error);
}

.odds-value.under {
  color: var(--color-info);
}

.odds-number {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
}

/* 比赛底部 */
.match-footer {
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  background: var(--bg-hover);
  gap: var(--spacing-sm);
  font-size: 12px;
  color: var(--text-tertiary);
}

.score-icon {
  font-size: 14px;
}

.recent-scores {
  flex: 1;
  font-family: monospace;
}

.total-markets {
  color: var(--text-secondary);
}
</style>
