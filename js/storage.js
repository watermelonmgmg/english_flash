// =====================================================
//  WordQuest — storage.js
//  localStorage の読み書きをすべてここに集約する
//  game.js の該当関数をそのまま移動したもの
// =====================================================

// ===== キー定数 =====
const STORAGE_KEY = 'wordquest_mistakes';
const STATS_KEY   = 'wordquest_stats';
const BADGE_KEY   = 'wordquest_badges';
const PET_KEY     = 'wordquest_pet';

// =====================================================
//  まちがいノート
// =====================================================
function loadMistakes() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch { return {}; }
}

function saveMistake(wordId) {
  const mistakes = loadMistakes();
  mistakes[wordId] = (mistakes[wordId] || 0) + 1;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(mistakes));
}

function getMistakeWords() {
  const mistakes = loadMistakes();
  return allWords
    .filter(w => mistakes[w.id])
    .sort((a, b) => (mistakes[b.id] || 0) - (mistakes[a.id] || 0));
}

function getMistakeCount() {
  return Object.keys(loadMistakes())
    .filter(id => allWords.some(w => w.id === Number(id)))
    .length;
}

// =====================================================
//  統計（プレイ回数・正解数・コンボ等）
// =====================================================
function loadStats() {
  try { return JSON.parse(localStorage.getItem(STATS_KEY) || '{}'); } catch { return {}; }
}

function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

// =====================================================
//  バッジ
// =====================================================
function loadBadges() {
  try { return JSON.parse(localStorage.getItem(BADGE_KEY) || '[]'); } catch { return []; }
}

function saveBadges(badges) {
  localStorage.setItem(BADGE_KEY, JSON.stringify(badges));
}

// =====================================================
//  ペット
// =====================================================
function loadPet() {
  try { return JSON.parse(localStorage.getItem(PET_KEY) || '{}'); } catch { return {}; }
}

function savePet(pet) {
  localStorage.setItem(PET_KEY, JSON.stringify(pet));
}
