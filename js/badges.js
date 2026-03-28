// =====================================================
//  WordQuest — badges.js
//  バッジ・称号・ペット進化のロジック
//  依存: data.js / storage.js
//  読み込み順: data.js → storage.js → badges.js → ui_*.js → game.js
// =====================================================

// ===============================
//  称号ロジック
// ===============================
function getCurrentTitle() {
  const earned = loadBadges().length;
  let current = null;
  for (const t of TITLE_DEFS) {
    if (earned >= t.need) current = t;
  }
  return current;
}

function getNextTitle() {
  const earned = loadBadges().length;
  return TITLE_DEFS.find(t => t.need > earned) || null;
}

// ===============================
//  ペット進化ロジック
// ===============================
function getPetStage(totalCorrect) {
  let stage = PET_STAGES[0];
  for (const s of PET_STAGES) {
    if (totalCorrect >= s.need) stage = s;
  }
  return stage;
}

function getNextPetStage(totalCorrect) {
  return PET_STAGES.find(s => s.need > totalCorrect) || null;
}

function checkPetEvolution(prevCorrect, newCorrect) {
  const prevStage = getPetStage(prevCorrect);
  const newStage  = getPetStage(newCorrect);
  return prevStage.need !== newStage.need ? newStage : null;
}

// ===============================
//  バッジチェック
// ===============================
function checkNewBadges(stats) {
  const earned = loadBadges();
  const newOnes = [];
  for (const def of BADGE_DEFS) {
    if (!earned.includes(def.id) && def.cond(stats)) {
      earned.push(def.id);
      newOnes.push(def);
    }
  }
  if (newOnes.length) saveBadges(earned);
  return newOnes;
}

// ===============================
//  統計更新 + バッジチェック
// ===============================
function addCorrectStats() {
  const stats = loadStats();
  const prevCorrect = stats.totalCorrect || 0;
  stats.totalCorrect = prevCorrect + 1;
  stats.maxComboEver = Math.max(stats.maxComboEver || 0, combo);
  saveStats(stats);
  const evolved = checkPetEvolution(prevCorrect, stats.totalCorrect);
  if (evolved) setTimeout(() => showEvolutionNotification(evolved), 600);
  return checkNewBadges(stats);
}

function addGameStats(isPerfect, mode = '', category = 'all') {
  const stats = loadStats();
  stats.totalGames    = (stats.totalGames    || 0) + 1;
  stats.maxComboEver  = Math.max(stats.maxComboEver || 0, maxCombo);
  stats.perfectClears = (stats.perfectClears || 0) + (isPerfect ? 1 : 0);
  if (isPerfect || lives > 0) {
    if (mode === 'normal')  stats.normalClears  = (stats.normalClears  || 0) + 1;
    if (mode === 'reverse') stats.reverseClears = (stats.reverseClears || 0) + 1;
    if (mode === 'typing')  stats.typingClears  = (stats.typingClears  || 0) + 1;
    if (category && category !== 'all') {
      if (!stats.catClears) stats.catClears = {};
      stats.catClears[category] = (stats.catClears[category] || 0) + 1;
    }
  }
  saveStats(stats);
  return checkNewBadges(stats);
}

function addRetryStats() {
  const stats = loadStats();
  stats.totalRetries = (stats.totalRetries || 0) + 1;
  saveStats(stats);
  return checkNewBadges(stats);
}
