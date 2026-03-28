// =====================================================
//  WordQuest — data.js
//  変更頻度の高い「設定値・定数」をここに集約
//  ロジックは持たない純粋なデータ定義ファイル
//  読み込み順: data.js → storage.js → game.js
// =====================================================

// ===============================
//  バッジ定義
// ===============================
const BADGE_DEFS = [
  // ===== 累計正解 =====
  { id: 'first_correct',  icon: '⭐', name: 'はじめての せいかい！',   cond: s => s.totalCorrect >= 1 },
  { id: 'correct_10',     icon: '🌟', name: '10もん せいかい！',        cond: s => s.totalCorrect >= 10 },
  { id: 'correct_50',     icon: '💫', name: '50もん せいかい！',        cond: s => s.totalCorrect >= 50 },
  { id: 'correct_100',    icon: '🏆', name: '100もん せいかい！',       cond: s => s.totalCorrect >= 100 },
  // ===== コンボ =====
  { id: 'combo_3',        icon: '🔥', name: '3れんぞく せいかい！',     cond: s => s.maxComboEver >= 3 },
  { id: 'combo_5',        icon: '🌈', name: '5れんぞく せいかい！',     cond: s => s.maxComboEver >= 5 },
  { id: 'combo_10',       icon: '⚡', name: '10れんぞく せいかい！',    cond: s => s.maxComboEver >= 10 },
  // ===== 全問正解・プレイ回数 =====
  { id: 'perfect',        icon: '💎', name: 'ぜんもん せいかい！',      cond: s => s.perfectClears >= 1 },
  { id: 'play_5',         icon: '🎮', name: '5かい あそんだ！',         cond: s => s.totalGames >= 5 },
  { id: 'play_20',        icon: '👑', name: '20かい あそんだ！',        cond: s => s.totalGames >= 20 },
  // ===== モード別 =====
  { id: 'mode_normal',    icon: '🎯', name: 'ゲーム①を クリア！',       cond: s => s.normalClears >= 1 },
  { id: 'mode_reverse',   icon: '🔄', name: 'ゲーム②を クリア！',       cond: s => s.reverseClears >= 1 },
  { id: 'mode_typing',    icon: '⌨️', name: 'タイピングを クリア！',    cond: s => s.typingClears >= 1 },
  { id: 'all_modes',      icon: '🌐', name: '3モード ぜんぶ クリア！',   cond: s => s.normalClears >= 1 && s.reverseClears >= 1 && s.typingClears >= 1 },
  // ===== カテゴリ別 =====
  { id: 'cat_adjectives', icon: '📝', name: 'けいようし マスター！',     cond: s => (s.catClears||{}).adjectives >= 1 },
  { id: 'cat_places',     icon: '🏠', name: 'ばしょ マスター！',         cond: s => (s.catClears||{}).places >= 1 },
  { id: 'cat_sports',     icon: '⚽', name: 'スポーツ マスター！',       cond: s => (s.catClears||{}).sports >= 1 },
  { id: 'cat_weather',    icon: '🌤️', name: 'てんき マスター！',         cond: s => (s.catClears||{}).weather >= 1 },
  { id: 'cat_all',        icon: '🌍', name: 'ぜんカテゴリ マスター！',   cond: s => {
    const c = s.catClears || {};
    return c.adjectives >= 1 && c.places >= 1 && c.sports >= 1 && c.weather >= 1;
  }},
  // ===== まちがい系 =====
  { id: 'retry_5',        icon: '💪', name: 'あきらめない！ 5かい チャレンジ！', cond: s => s.totalRetries >= 5 },
  { id: 'retry_20',       icon: '🦾', name: 'ど根性！ 20かい チャレンジ！',      cond: s => s.totalRetries >= 20 },
  { id: 'retry_50',       icon: '🔱', name: 'つよい心！ 50かい チャレンジ！',    cond: s => s.totalRetries >= 50 },
];

// ===============================
//  称号定義
// ===============================
const TITLE_DEFS = [
  { need: 1,  icon: '🔰', title: 'えいごの たまご',        msg: 'よーし！はじめの いっぽだ！' },
  { need: 3,  icon: '📚', title: 'えいごの まなびや',       msg: 'どんどん おぼえてるね！すごい！' },
  { need: 5,  icon: '🌸', title: 'えいごの がんばりや',     msg: 'もう こんなに できるようになったね！' },
  { need: 7,  icon: '🚀', title: 'えいごの チャレンジャー', msg: 'きみは ほんとうに すごい！！' },
  { need: 10, icon: '👑', title: 'えいごの マスター',       msg: '🎉 ぜんぶ クリア！きみは えいごの おうじゃだ！！' },
];

// ===============================
//  ペット進化ステージ定義
// ===============================
const PET_STAGES = [
  { need: 0,    emoji: '🥚',  name: 'たまご',             msg: 'まだ　うまれていないよ…' },
  { need: 30,   emoji: '🐣',  name: 'うまれたて',          msg: 'うまれたよ！よろしくね！' },
  { need: 80,   emoji: '🐥',  name: 'ひよこ',             msg: 'すこし　おおきくなったよ！' },
  { need: 200,  emoji: '🐤',  name: 'そだちざかり',        msg: 'どんどん　つよくなってるよ！' },
  { need: 400,  emoji: '🐦',  name: 'こどり',             msg: 'もう　こんなに　そだったね！' },
  { need: 700,  emoji: '🦅',  name: 'おおとり',           msg: 'すごい！　おおきなとりになったよ！' },
  { need: 1000, emoji: '🐉',  name: 'りゅう',             msg: '🔥 つよいりゅうに　なったよ！！' },
  { need: 1500, emoji: '🦄',  name: 'でんせつのいきもの',  msg: '✨ きみは　でんせつの　えいごマスターだ！！' },
];
