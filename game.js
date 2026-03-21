// ===============================
//  WordQuest - game.js
//  単語データ＋ゲームロジック 統合版
// ===============================

// ===== 英検5級 単語データ =====
const WORDS = [
  // animals
  { id:1,  kanji:"猫",      hiragana:"ねこ",        english:"cat",        category:"animals", emoji:"🐱" },
  { id:2,  kanji:"犬",      hiragana:"いぬ",        english:"dog",        category:"animals", emoji:"🐶" },
  { id:3,  kanji:"鳥",      hiragana:"とり",        english:"bird",       category:"animals", emoji:"🐦" },
  { id:4,  kanji:"魚",      hiragana:"さかな",      english:"fish",       category:"animals", emoji:"🐟" },
  { id:5,  kanji:"馬",      hiragana:"うま",        english:"horse",      category:"animals", emoji:"🐴" },
  { id:6,  kanji:"牛",      hiragana:"うし",        english:"cow",        category:"animals", emoji:"🐄" },
  { id:7,  kanji:"豚",      hiragana:"ぶた",        english:"pig",        category:"animals", emoji:"🐷" },
  { id:8,  kanji:"兔",      hiragana:"うさぎ",      english:"rabbit",     category:"animals", emoji:"🐰" },
  { id:9,  kanji:"象",      hiragana:"ぞう",        english:"elephant",   category:"animals", emoji:"🐘" },
  { id:10, kanji:"猿",      hiragana:"さる",        english:"monkey",     category:"animals", emoji:"🐒" },
  // food
  { id:11, kanji:"林檎",    hiragana:"りんご",      english:"apple",      category:"food", emoji:"🍎" },
  { id:12, kanji:"バナナ",  hiragana:"ばなな",      english:"banana",     category:"food", emoji:"🍌" },
  { id:13, kanji:"パン",    hiragana:"ぱん",        english:"bread",      category:"food", emoji:"🍞" },
  { id:14, kanji:"ケーキ",  hiragana:"けーき",      english:"cake",       category:"food", emoji:"🎂" },
  { id:15, kanji:"牛乳",    hiragana:"ぎゅうにゅう",english:"milk",       category:"food", emoji:"🥛" },
  { id:16, kanji:"水",      hiragana:"みず",        english:"water",      category:"food", emoji:"💧" },
  { id:17, kanji:"ご飯",    hiragana:"ごはん",      english:"rice",       category:"food", emoji:"🍚" },
  { id:18, kanji:"卵",      hiragana:"たまご",      english:"egg",        category:"food", emoji:"🥚" },
  { id:19, kanji:"肉",      hiragana:"にく",        english:"meat",       category:"food", emoji:"🥩" },
  { id:20, kanji:"野菜",    hiragana:"やさい",      english:"vegetable",  category:"food", emoji:"🥦" },
  // colors
  { id:21, kanji:"赤",      hiragana:"あか",        english:"red",        category:"colors", emoji:"🔴" },
  { id:22, kanji:"青",      hiragana:"あお",        english:"blue",       category:"colors", emoji:"🔵" },
  { id:23, kanji:"黄色",    hiragana:"きいろ",      english:"yellow",     category:"colors", emoji:"🟡" },
  { id:24, kanji:"緑",      hiragana:"みどり",      english:"green",      category:"colors", emoji:"🟢" },
  { id:25, kanji:"白",      hiragana:"しろ",        english:"white",      category:"colors", emoji:"⬜" },
  { id:26, kanji:"黒",      hiragana:"くろ",        english:"black",      category:"colors", emoji:"⬛" },
  // places
  { id:27, kanji:"学校",    hiragana:"がっこう",    english:"school",     category:"places", emoji:"🏫" },
  { id:28, kanji:"家",      hiragana:"いえ",        english:"house",      category:"places", emoji:"🏠" },
  { id:29, kanji:"病院",    hiragana:"びょういん",  english:"hospital",   category:"places", emoji:"🏥" },
  { id:30, kanji:"公園",    hiragana:"こうえん",    english:"park",       category:"places", emoji:"🌳" },
  { id:31, kanji:"図書館",  hiragana:"としょかん",  english:"library",    category:"places", emoji:"📚" },
  { id:32, kanji:"店",      hiragana:"みせ",        english:"shop",       category:"places", emoji:"🏪" },
  { id:33, kanji:"駅",      hiragana:"えき",        english:"station",    category:"places", emoji:"🚉" },
  // transport
  { id:34, kanji:"車",      hiragana:"くるま",      english:"car",        category:"transport", emoji:"🚗" },
  { id:35, kanji:"バス",    hiragana:"ばす",        english:"bus",        category:"transport", emoji:"🚌" },
  { id:36, kanji:"電車",    hiragana:"でんしゃ",    english:"train",      category:"transport", emoji:"🚃" },
  { id:37, kanji:"飛行機",  hiragana:"ひこうき",    english:"airplane",   category:"transport", emoji:"✈️" },
  { id:38, kanji:"自転車",  hiragana:"じてんしゃ",  english:"bicycle",    category:"transport", emoji:"🚲" },
  // nature
  { id:39, kanji:"山",      hiragana:"やま",        english:"mountain",   category:"nature", emoji:"⛰️" },
  { id:40, kanji:"海",      hiragana:"うみ",        english:"sea",        category:"nature", emoji:"🌊" },
  { id:41, kanji:"川",      hiragana:"かわ",        english:"river",      category:"nature", emoji:"🏞️" },
  { id:42, kanji:"花",      hiragana:"はな",        english:"flower",     category:"nature", emoji:"🌸" },
  { id:43, kanji:"木",      hiragana:"き",          english:"tree",       category:"nature", emoji:"🌳" },
  { id:44, kanji:"太陽",    hiragana:"たいよう",    english:"sun",        category:"nature", emoji:"☀️" },
  { id:45, kanji:"雨",      hiragana:"あめ",        english:"rain",       category:"nature", emoji:"🌧️" },
  { id:46, kanji:"雪",      hiragana:"ゆき",        english:"snow",       category:"nature", emoji:"❄️" },
  // school
  { id:47, kanji:"本",      hiragana:"ほん",        english:"book",       category:"school", emoji:"📖" },
  { id:48, kanji:"鉛筆",    hiragana:"えんぴつ",    english:"pencil",     category:"school", emoji:"✏️" },
  { id:49, kanji:"消しゴム",hiragana:"けしごむ",    english:"eraser",     category:"school", emoji:"🧹" },
  { id:50, kanji:"机",      hiragana:"つくえ",      english:"desk",       category:"school", emoji:"🪑" },
  { id:51, kanji:"椅子",    hiragana:"いす",        english:"chair",      category:"school", emoji:"💺" },
  { id:52, kanji:"黒板",    hiragana:"こくばん",    english:"blackboard", category:"school", emoji:"🖊️" },
  { id:53, kanji:"ノート",  hiragana:"のーと",      english:"notebook",   category:"school", emoji:"📓" },
  // family
  { id:54, kanji:"お父さん",hiragana:"おとうさん",  english:"father",     category:"family", emoji:"👨" },
  { id:55, kanji:"お母さん",hiragana:"おかあさん",  english:"mother",     category:"family", emoji:"👩" },
  { id:56, kanji:"兄",      hiragana:"あに",        english:"brother",    category:"family", emoji:"👦" },
  { id:57, kanji:"姉",      hiragana:"あね",        english:"sister",     category:"family", emoji:"👧" },
  { id:58, kanji:"友達",    hiragana:"ともだち",    english:"friend",     category:"family", emoji:"👫" },
  { id:59, kanji:"先生",    hiragana:"せんせい",    english:"teacher",    category:"family", emoji:"👩‍🏫" },
  { id:60, kanji:"生徒",    hiragana:"せいと",      english:"student",    category:"family", emoji:"🧑‍🎓" },
  // sports
  { id:61, kanji:"野球",    hiragana:"やきゅう",    english:"baseball",   category:"sports", emoji:"⚾" },
  { id:62, kanji:"サッカー",hiragana:"さっかー",    english:"soccer",     category:"sports", emoji:"⚽" },
  { id:63, kanji:"水泳",    hiragana:"すいえい",    english:"swimming",   category:"sports", emoji:"🏊" },
  { id:64, kanji:"音楽",    hiragana:"おんがく",    english:"music",      category:"sports", emoji:"🎵" },
  { id:65, kanji:"絵",      hiragana:"え",          english:"picture",    category:"sports", emoji:"🎨" },
  // body
  { id:66, kanji:"目",      hiragana:"め",          english:"eye",        category:"body", emoji:"👁️" },
  { id:67, kanji:"耳",      hiragana:"みみ",        english:"ear",        category:"body", emoji:"👂" },
  { id:68, kanji:"鼻",      hiragana:"はな",        english:"nose",       category:"body", emoji:"👃" },
  { id:69, kanji:"口",      hiragana:"くち",        english:"mouth",      category:"body", emoji:"👄" },
  { id:70, kanji:"手",      hiragana:"て",          english:"hand",       category:"body", emoji:"✋" },
  { id:71, kanji:"足",      hiragana:"あし",        english:"foot",       category:"body", emoji:"🦶" },
  { id:72, kanji:"頭",      hiragana:"あたま",      english:"head",       category:"body", emoji:"🤔" },
  // time
  { id:73, kanji:"朝",      hiragana:"あさ",        english:"morning",    category:"time", emoji:"🌅" },
  { id:74, kanji:"昼",      hiragana:"ひる",        english:"noon",       category:"time", emoji:"🌞" },
  { id:75, kanji:"夜",      hiragana:"よる",        english:"night",      category:"time", emoji:"🌙" },
  { id:76, kanji:"今日",    hiragana:"きょう",      english:"today",      category:"time", emoji:"📅" },
  { id:77, kanji:"明日",    hiragana:"あした",      english:"tomorrow",   category:"time", emoji:"📆" },
  { id:78, kanji:"昨日",    hiragana:"きのう",      english:"yesterday",  category:"time", emoji:"⏪" },
  // adjectives
  { id:79, kanji:"大きい",  hiragana:"おおきい",    english:"big",        category:"adjectives", emoji:"🔵" },
  { id:80, kanji:"小さい",  hiragana:"ちいさい",    english:"small",      category:"adjectives", emoji:"🔹" },
  { id:81, kanji:"速い",    hiragana:"はやい",      english:"fast",       category:"adjectives", emoji:"⚡" },
  { id:82, kanji:"遅い",    hiragana:"おそい",      english:"slow",       category:"adjectives", emoji:"🐢" },
  { id:83, kanji:"熱い",    hiragana:"あつい",      english:"hot",        category:"adjectives", emoji:"🔥" },
  { id:84, kanji:"冷たい",  hiragana:"つめたい",    english:"cold",       category:"adjectives", emoji:"🧊" },
  { id:85, kanji:"新しい",  hiragana:"あたらしい",  english:"new",        category:"adjectives", emoji:"✨" },
  { id:86, kanji:"古い",    hiragana:"ふるい",      english:"old",        category:"adjectives", emoji:"🏚️" },
  { id:87, kanji:"長い",    hiragana:"ながい",      english:"long",       category:"adjectives", emoji:"📏" },
  { id:88, kanji:"短い",    hiragana:"みじかい",    english:"short",      category:"adjectives", emoji:"📐" },
  // verbs
  { id:89, kanji:"食べる",  hiragana:"たべる",      english:"eat",        category:"verbs", emoji:"😋" },
  { id:90, kanji:"飲む",    hiragana:"のむ",        english:"drink",      category:"verbs", emoji:"🥤" },
  { id:91, kanji:"走る",    hiragana:"はしる",      english:"run",        category:"verbs", emoji:"🏃" },
  { id:92, kanji:"歩く",    hiragana:"あるく",      english:"walk",       category:"verbs", emoji:"🚶" },
  { id:93, kanji:"読む",    hiragana:"よむ",        english:"read",       category:"verbs", emoji:"📖" },
  { id:94, kanji:"書く",    hiragana:"かく",        english:"write",      category:"verbs", emoji:"✍️" },
  { id:95, kanji:"見る",    hiragana:"みる",        english:"watch",      category:"verbs", emoji:"👀" },
  { id:96, kanji:"聞く",    hiragana:"きく",        english:"listen",     category:"verbs", emoji:"🎧" },
  { id:97, kanji:"話す",    hiragana:"はなす",      english:"speak",      category:"verbs", emoji:"💬" },
  { id:98, kanji:"買う",    hiragana:"かう",        english:"buy",        category:"verbs", emoji:"🛒" },
  { id:99, kanji:"寝る",    hiragana:"ねる",        english:"sleep",      category:"verbs", emoji:"😴" },
  { id:100,kanji:"起きる",  hiragana:"おきる",      english:"wake up",    category:"verbs", emoji:"⏰" },
];

// ===============================
//  ゲームロジック
// ===============================
let allWords = [];
let filteredWords = [];
let currentMode = 'menu';
let studyIndex = 0;
let studyFlipped = false;

let gameQueue = [];
let currentQuestion = null;
let score = 0;
let lives = 3;
let totalQuestions = 0;
let answeredCount = 0;
let selectedCategory = 'all';
let combo = 0; // 連続正解数
let maxCombo = 0; // セッション最大コンボ

// ===============================
//  バッジ・実績（localStorage）
// ===============================
const BADGE_KEY = 'wordquest_badges';
const STATS_KEY = 'wordquest_stats';

const BADGE_DEFS = [
  { id: 'first_correct',  icon: '⭐', name: 'はじめての せいかい！',  cond: s => s.totalCorrect >= 1 },
  { id: 'correct_10',     icon: '🌟', name: '10もん せいかい！',       cond: s => s.totalCorrect >= 10 },
  { id: 'correct_50',     icon: '💫', name: '50もん せいかい！',       cond: s => s.totalCorrect >= 50 },
  { id: 'correct_100',    icon: '🏆', name: '100もん せいかい！',      cond: s => s.totalCorrect >= 100 },
  { id: 'combo_3',        icon: '🔥', name: '3れんぞく せいかい！',    cond: s => s.maxComboEver >= 3 },
  { id: 'combo_5',        icon: '🌈', name: '5れんぞく せいかい！',    cond: s => s.maxComboEver >= 5 },
  { id: 'combo_10',       icon: '⚡', name: '10れんぞく せいかい！',   cond: s => s.maxComboEver >= 10 },
  { id: 'perfect',        icon: '💎', name: 'ぜんもん せいかい！',     cond: s => s.perfectClears >= 1 },
  { id: 'play_5',         icon: '🎮', name: '5かい あそんだ！',        cond: s => s.totalGames >= 5 },
  { id: 'play_20',        icon: '👑', name: '20かい あそんだ！',       cond: s => s.totalGames >= 20 },
];

// 称号：バッジ獲得数に応じて解放
const TITLE_DEFS = [
  { need: 1,  icon: '🔰', title: 'えいごの たまご',      msg: 'よーし！はじめの いっぽだ！' },
  { need: 3,  icon: '📚', title: 'えいごの まなびや',     msg: 'どんどん おぼえてるね！すごい！' },
  { need: 5,  icon: '🌸', title: 'えいごの がんばりや',   msg: 'もう こんなに できるようになったね！' },
  { need: 7,  icon: '🚀', title: 'えいごの チャレンジャー', msg: 'きみは ほんとうに すごい！！' },
  { need: 10, icon: '👑', title: 'えいごの マスター',     msg: '🎉 ぜんぶ クリア！きみは えいごの おうじゃだ！！' },
];

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

function loadStats() {
  try { return JSON.parse(localStorage.getItem(STATS_KEY) || '{}'); } catch { return {}; }
}
function saveStats(stats) {
  localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}
function loadBadges() {
  try { return JSON.parse(localStorage.getItem(BADGE_KEY) || '[]'); } catch { return []; }
}
function saveBadges(badges) {
  localStorage.setItem(BADGE_KEY, JSON.stringify(badges));
}

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

function addCorrectStats(isPerfect = false) {
  const stats = loadStats();
  stats.totalCorrect  = (stats.totalCorrect  || 0) + 1;
  stats.totalGames    = (stats.totalGames    || 0);
  stats.maxComboEver  = Math.max(stats.maxComboEver || 0, combo);
  stats.perfectClears = (stats.perfectClears || 0) + (isPerfect ? 1 : 0);
  saveStats(stats);
  return checkNewBadges(stats);
}

function addGameStats(isPerfect) {
  const stats = loadStats();
  stats.totalGames    = (stats.totalGames    || 0) + 1;
  stats.maxComboEver  = Math.max(stats.maxComboEver || 0, maxCombo);
  stats.perfectClears = (stats.perfectClears || 0) + (isPerfect ? 1 : 0);
  saveStats(stats);
  return checkNewBadges(stats);
}

// ===============================
//  まちがいノート（localStorage）
// ===============================
const STORAGE_KEY = 'wordquest_mistakes';

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
  return allWords.filter(w => mistakes[w.id]).sort((a, b) => (mistakes[b.id] || 0) - (mistakes[a.id] || 0));
}

function getMistakeCount() {
  return Object.keys(loadMistakes()).filter(id => allWords.some(w => w.id === Number(id))).length;
}

// ===== 音声読み上げ =====
function speak(text, rate = 0.85) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'en-US';
  utter.rate = rate;
  utter.pitch = 1.1;
  // 英語音声を優先して選択
  const voices = speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith('en'));
  if (enVoice) utter.voice = enVoice;
  speechSynthesis.speak(utter);
}

// 音声リスト読み込み待ち（Chrome対策）
if (window.speechSynthesis) {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

function init() {
  allWords = [
    ...WORDS_ADJECTIVES,
    ...WORDS_PLACES,
    ...WORDS_SPORTS,
    ...WORDS_WEATHER,
  ];
  filteredWords = [...allWords];
  renderMenu();
}

function getCategories() {
  return [...new Set(allWords.map(w => w.category))];
}

function applyFilter(cat) {
  selectedCategory = cat;
  filteredWords = cat === 'all' ? [...allWords] : allWords.filter(w => w.category === cat);
  const badge = document.querySelector('.word-count-badge');
  if (badge) badge.textContent = `${filteredWords.length}語 学習できます`;
}

// ===============================
//  メニュー
// ===============================
function renderMenu() {
  currentMode = 'menu';
  const cats = getCategories();
  const catOptions =
    `<option value="all">すべて (${allWords.length}語)</option>` +
    cats.map(c =>
      `<option value="${c}" ${selectedCategory===c?'selected':''}>${c} (${allWords.filter(w=>w.category===c).length}語)</option>`
    ).join('');

  document.getElementById('app').innerHTML = `
    <div class="menu-screen">
      <div class="logo-area">
        <div class="logo-icon">📖</div>
        <h1 class="logo-title">WordQuest</h1>
        <p class="logo-sub">えいごたんごを　おぼえよう！</p>
      </div>
      <div class="filter-bar">
        <label class="filter-label">カテゴリー</label>
        <select id="catSelect" class="cat-select" onchange="applyFilter(this.value)">
          ${catOptions}
        </select>
      </div>
      <div class="mode-cards">
        <button class="mode-card study-card" onclick="startStudy()">
          <div class="mode-icon">🃏</div>
          <div class="mode-name">あんきモード</div>
          <div class="mode-desc">カードをめくって<br>おぼえよう</div>
        </button>
        <button class="mode-card game-card" onclick="startGame('normal')">
          <div class="mode-icon">🎮</div>
          <div class="mode-name">ゲーム①</div>
          <div class="mode-desc">にほんご→えいご<br>4たくで こたえよう</div>
        </button>
        <button class="mode-card reverse-card" onclick="startGame('reverse')">
          <div class="mode-icon">🔄</div>
          <div class="mode-name">ゲーム②</div>
          <div class="mode-desc">えいご→にほんご<br>4たくで こたえよう</div>
        </button>
        <button class="mode-card typing-card" onclick="startTyping()" style="grid-column:1/-1;">
          <div class="mode-icon">⌨️</div>
          <div class="mode-name">タイピングモード</div>
          <div class="mode-desc">えいごをみて　にほんごを　うちこもう</div>
        </button>
      </div>
      <div class="word-count-badge">${filteredWords.length}語 学習できます</div>
      ${(() => {
        const title = getCurrentTitle();
        const earnedCount = loadBadges().length;
        const next = getNextTitle();
        return `
        <button class="badge-menu-btn" onclick="renderBadgePage()">
          <span class="badge-menu-left">
            ${title ? `<span class="current-title-icon">${title.icon}</span><span class="current-title-text">${title.title}</span>` : `<span class="current-title-text">バッジを あつめよう！</span>`}
          </span>
          <span class="badge-menu-right">
            🏅 ${earnedCount}/${BADGE_DEFS.length}
            ${next ? `<span class="next-title-hint">あと${next.need - earnedCount}こで「${next.title}」</span>` : ''}
          </span>
        </button>`;
      })()}
      ${getMistakeCount() > 0 ? `
      <button class="mistake-menu-btn" onclick="renderMistakeMenu()">
        📝 まちがいノート <span class="mistake-count-badge">${getMistakeCount()}語</span>
      </button>` : ''}
    </div>
  `;
}

// ===============================
//  暗記モード
// ===============================
function startStudy() {
  applyFilter(selectedCategory);
  if (filteredWords.length === 0) { alert('単語がありません'); return; }
  gameQueue = shuffle([...filteredWords]);
  studyIndex = 0;
  studyFlipped = false;
  currentMode = 'study';
  renderStudyCard();
}

function renderStudyCard() {
  const word = gameQueue[studyIndex];
  const total = gameQueue.length;
  const pct = ((studyIndex + 1) / total * 100).toFixed(0);

  document.getElementById('app').innerHTML = `
    <div class="study-screen">
      <div class="study-header">
        <button class="back-btn" onclick="renderMenu()">← もどる</button>
        <div class="study-progress-wrap">
          <div class="study-progress-bar" style="width:${pct}%"></div>
        </div>
        <span class="study-counter">${studyIndex + 1} / ${total}</span>
      </div>
      <div class="card-area">
        <div class="flash-card ${studyFlipped?'flipped':''}" onclick="flipCard()">
          <div class="card-front">
            <div class="card-kanji">${word.kanji}</div>
            <div class="card-hiragana">${word.hiragana}</div>
            <div class="card-hint">タップして　こたえをみる</div>
          </div>
          <div class="card-back">
            <div class="card-english">${word.english}</div>
            <div class="card-kanji-small">${word.kanji}（${word.hiragana}）</div>
            <button class="sound-btn" onclick="event.stopPropagation(); speak('${word.english}')">🔊 きく</button>
          </div>
        </div>
      </div>
      <div class="study-nav">
        <button class="nav-btn prev-btn" onclick="prevCard()" ${studyIndex===0?'disabled':''}>◀ まえ</button>
        <button class="nav-btn next-btn" onclick="nextCard()">${studyIndex===total-1?'🏁 おわり':'つぎ ▶'}</button>
      </div>
      <div class="study-category-tag">${word.category}</div>
    </div>
  `;
}

function flipCard() {
  studyFlipped = !studyFlipped;
  const card = document.querySelector('.flash-card');
  if (card) card.classList.toggle('flipped', studyFlipped);
}
function nextCard() {
  if (studyIndex >= gameQueue.length - 1) { renderStudyComplete(); return; }
  studyIndex++; studyFlipped = false; renderStudyCard();
}
function prevCard() {
  if (studyIndex <= 0) return;
  studyIndex--; studyFlipped = false; renderStudyCard();
}
function renderStudyComplete() {
  document.getElementById('app').innerHTML = `
    <div class="complete-screen">
      <div class="complete-icon">🎉</div>
      <h2 class="complete-title">すべておわったよ！</h2>
      <p class="complete-msg">${gameQueue.length}まい のカードを おぼえたね！</p>
      <div class="complete-btns">
        <button class="action-btn primary"   onclick="startStudy()">もう一度</button>
        <button class="action-btn secondary" onclick="startGame()">ゲームへ</button>
        <button class="action-btn ghost"     onclick="renderMenu()">メニュー</button>
      </div>
    </div>
  `;
}

// ===============================
//  ゲームモード
// ===============================
const TOTAL_Q = 10;
const MAX_LIVES = 3;
let gameDirection = 'normal'; // 'normal': 日本語→英語, 'reverse': 英語→日本語

function startGame(direction = 'normal') {
  applyFilter(selectedCategory);
  if (filteredWords.length < 4) { alert('ゲームには4語以上必要です'); return; }
  currentMode = 'game';
  gameDirection = direction;
  score = 0; lives = MAX_LIVES; answeredCount = 0;
  combo = 0; maxCombo = 0;
  totalQuestions = Math.min(TOTAL_Q, filteredWords.length);
  gameQueue = shuffle([...filteredWords]).slice(0, totalQuestions);
  nextQuestion();
}

function nextQuestion() {
  if (answeredCount >= totalQuestions || lives <= 0) { renderGameOver(); return; }
  currentQuestion = gameQueue[answeredCount];
  renderGameQuestion(makeChoices(currentQuestion));
}

function makeChoices(correct) {
  const pool = filteredWords.filter(w => w.id !== correct.id);
  return shuffle([correct, ...shuffle(pool).slice(0, 3)]);
}

function renderGameQuestion(choices) {
  const pct = (answeredCount / totalQuestions * 100).toFixed(0);
  const hearts = Array.from({length: MAX_LIVES}, (_, i) =>
    `<span class="heart ${i < lives ? 'active' : 'lost'}">♥</span>`
  ).join('');

  const isReverse = gameDirection === 'reverse';

  // 問題文と選択肢の表示を direction によって切り替え
  const questionHTML = isReverse
    ? `<p class="question-label">にほんごは　なに？</p>
       <div class="question-word">
         <span class="q-kanji" style="letter-spacing:2px;">${currentQuestion.english}</span>
       </div>
       <button class="sound-btn" onclick="speak('${currentQuestion.english}')">🔊 もう一度きく</button>`
    : `<p class="question-label">えいごは　なに？</p>
       <div class="question-word">
         <span class="q-kanji">${currentQuestion.kanji}</span>
       </div>
       <p class="question-sub">${currentQuestion.hiragana}</p>
       <button class="sound-btn" onclick="speak('${currentQuestion.english}')">🔊 もう一度きく</button>`;

  const choicesHTML = choices.map(c => {
    const label = isReverse ? c.kanji : c.english;
    return `<button class="choice-btn" data-id="${c.id}" onclick="checkAnswer(${c.id}, this)">
              <span class="choice-text">${label}</span>
            </button>`;
  }).join('');

  const choiceLabel = isReverse ? 'にほんごを　えらんでね' : 'えいごを　えらんでね';

  document.getElementById('app').innerHTML = `
    <div class="game-screen">
      <div class="game-header">
        <button class="back-btn" onclick="renderMenu()">← もどる</button>
        <div class="game-progress-wrap">
          <div class="game-progress-bar" style="width:${pct}%"></div>
        </div>
        <span class="game-counter">${answeredCount + 1}/${totalQuestions}</span>
      </div>
      <div class="game-hud">
        <div class="hearts-wrap">${hearts}</div>
        <div class="score-badge">⭐ ${score}</div>
      </div>
      <div class="question-area">${questionHTML}</div>
      <p class="choice-label">${choiceLabel}</p>
      <div class="choices-grid">${choicesHTML}</div>
      <button class="skip-btn" onclick="skipQuestion()">わからない</button>
    </div>
  `;
  setTimeout(() => speak(currentQuestion.english), 300);
}

function checkAnswer(chosenId, btn) {
  const isCorrect = chosenId === currentQuestion.id;
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (Number(b.dataset.id) === currentQuestion.id) b.classList.add('correct');
  });
  if (isCorrect) {
    score += 10;
    combo++;
    maxCombo = Math.max(maxCombo, combo);
    if (combo >= 3) score += 5; // コンボボーナス
    speak(currentQuestion.english);
    showFeedback(true, combo >= 3 ? `${combo}れんぞく！ +${combo>=3?15:10}てん🔥` : `せいかい！ +10てん 🎉`);
    showCombo(combo);
    const newBadges = addCorrectStats();
    if (newBadges.length) setTimeout(() => showBadgeNotification(newBadges), 400);
    answeredCount++;
    setTimeout(nextQuestion, 1100);
  } else {
    btn.classList.add('wrong');
    combo = 0;
    lives--;
    saveMistake(currentQuestion.id);
    speak(currentQuestion.english, 0.75);
    showFeedback(false, `こたえは「${currentQuestion.english}」だよ！`);
    answeredCount++;
    setTimeout(lives <= 0 ? renderGameOver : nextQuestion, 1400);
  }
}

function skipQuestion() {
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (Number(b.dataset.id) === currentQuestion.id) b.classList.add('correct');
  });
  combo = 0;
  lives--;
  saveMistake(currentQuestion.id);
  speak(currentQuestion.english, 0.75);
  showFeedback(false, `こたえは「${currentQuestion.english}」だよ！`);
  answeredCount++;
  setTimeout(lives <= 0 ? renderGameOver : nextQuestion, 1400);
}

function showFeedback(ok, msg) {
  document.querySelectorAll('.feedback-toast').forEach(e => e.remove());
  const fb = document.createElement('div');
  fb.className = `feedback-toast ${ok ? 'fb-correct' : 'fb-wrong'}`;
  fb.textContent = msg;
  document.getElementById('app').appendChild(fb);
  setTimeout(() => fb.remove(), 1300);
}

function showCombo(n) {
  document.querySelectorAll('.combo-toast').forEach(e => e.remove());
  if (n < 3) return;
  const el = document.createElement('div');
  el.className = 'combo-toast';
  const labels = {3:'🔥 3コンボ！', 4:'🔥🔥 4コンボ！', 5:'🌈 5コンボ！！'};
  el.textContent = labels[n] || `⚡ ${n}コンボ！！！`;
  document.getElementById('app').appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function showBadgeNotification(badges) {
  badges.forEach((badge, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'badge-toast';
      el.innerHTML = `<span class="badge-toast-icon">${badge.icon}</span><span>バッジゲット！<br><b>${badge.name}</b></span>`;
      document.getElementById('app').appendChild(el);
      setTimeout(() => el.remove(), 2500);
    }, i * 600);
  });
}

function renderGameOver() {
  const cleared = lives > 0;
  const isPerfect = cleared && score === totalQuestions * (combo >= 3 ? 15 : 10);
  const rank = score >= totalQuestions*12 ? '🥇' : score >= totalQuestions*8 ? '🥈' : '🥉';
  const newBadges = addGameStats(isPerfect);
  const earnedBadges = loadBadges();
  const badgeList = BADGE_DEFS.filter(d => earnedBadges.includes(d.id));

  document.getElementById('app').innerHTML = `
    <div class="gameover-screen">
      ${cleared ? '<canvas id="fireworksCanvas" style="position:fixed;inset:0;pointer-events:none;z-index:50;width:100%;height:100%;"></canvas>' : ''}
      <div class="go-icon">${cleared ? '🎊' : '😢'}</div>
      <h2 class="go-title">${cleared ? 'クリア！すごい！' : 'ゲームオーバー'}</h2>
      <div class="go-score-block">
        <div class="go-rank">${rank}</div>
        <div class="go-score">${score} <span class="go-score-unit">てん</span></div>
        <div class="go-detail">${answeredCount}もん中 ${Math.round(score/10)}せいかい　さいこうコンボ ${maxCombo}</div>
      </div>
      ${newBadges.length ? `
        <div class="new-badges">
          <p class="new-badge-label">🎉 あたらしい バッジ！</p>
          ${newBadges.map(b => `<div class="badge-item new">${b.icon} ${b.name}</div>`).join('')}
        </div>` : ''}
      ${badgeList.length ? `
        <div class="all-badges">
          <p class="badge-section-label">もっているバッジ</p>
          <div class="badge-grid">${badgeList.map(b => `<span class="badge-chip" title="${b.name}">${b.icon}</span>`).join('')}</div>
        </div>` : ''}
      <div class="complete-btns">
        <p class="retry-label">もう一度あそぶ</p>
        <div class="retry-grid">
          <button class="retry-btn" onclick="startGame('normal')">🎮 ゲーム①<span>にほんご→えいご</span></button>
          <button class="retry-btn" onclick="startGame('reverse')">🔄 ゲーム②<span>えいご→にほんご</span></button>
          <button class="retry-btn" onclick="startTyping()" style="grid-column:1/-1;">⌨️ タイピング<span>えいごをみてうちこむ</span></button>
        </div>
        <button class="action-btn primary"   onclick="renderBadgePage()">🏅 バッジをみる</button>
        <button class="action-btn secondary" onclick="startStudy()">🃏 あんきモードへ</button>
        <button class="action-btn ghost"     onclick="renderMenu()">メニューへもどる</button>
      </div>
    </div>
  `;
  if (cleared) setTimeout(launchFireworks, 100);
  if (newBadges.length) setTimeout(() => showBadgeNotification(newBadges), 800);
}

// ===============================
//  タイピングモード
// ===============================
function startTyping() {
  applyFilter(selectedCategory);
  if (filteredWords.length === 0) { alert('単語がありません'); return; }
  currentMode = 'typing';
  score = 0; lives = MAX_LIVES; answeredCount = 0;
  totalQuestions = Math.min(TOTAL_Q, filteredWords.length);
  gameQueue = shuffle([...filteredWords]).slice(0, totalQuestions);
  nextTypingQuestion();
}

function nextTypingQuestion() {
  if (answeredCount >= totalQuestions || lives <= 0) { renderTypingOver(); return; }
  currentQuestion = gameQueue[answeredCount];
  renderTypingQuestion();
}

function renderTypingQuestion() {
  const pct = (answeredCount / totalQuestions * 100).toFixed(0);
  const hearts = Array.from({length: MAX_LIVES}, (_, i) =>
    `<span class="heart ${i < lives ? 'active' : 'lost'}">♥</span>`
  ).join('');

  document.getElementById('app').innerHTML = `
    <div class="game-screen">
      <div class="game-header">
        <button class="back-btn" onclick="renderMenu()">← もどる</button>
        <div class="game-progress-wrap">
          <div class="game-progress-bar" style="width:${pct}%"></div>
        </div>
        <span class="game-counter">${answeredCount + 1}/${totalQuestions}</span>
      </div>
      <div class="game-hud">
        <div class="hearts-wrap">${hearts}</div>
        <div class="score-badge">⭐ ${score}</div>
      </div>
      <div class="question-area">
        <p class="question-label">にほんごは　なに？</p>
        <div class="question-word">
          <span class="q-kanji" style="font-size:2.4rem;letter-spacing:2px;">${currentQuestion.english}</span>
        </div>
        <button class="sound-btn" onclick="speak('${currentQuestion.english}')">🔊 きく</button>
      </div>
      <p class="choice-label">よみかた（ひらがな）を　いれてね</p>
      <div class="typing-area">
        <input id="typingInput" class="typing-input" type="text"
          placeholder="ひらがなでいれてね"
          autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false"
          onkeydown="if(event.key==='Enter')checkTyping()" />
        <button class="typing-submit-btn" onclick="checkTyping()">こたえる</button>
      </div>
      <button class="skip-btn" onclick="skipTyping()">わからない</button>
    </div>
  `;
  // 表示後すぐフォーカス＆読み上げ
  setTimeout(() => {
    const inp = document.getElementById('typingInput');
    if (inp) inp.focus();
    speak(currentQuestion.english);
  }, 300);
}

function checkTyping() {
  const inp = document.getElementById('typingInput');
  if (!inp) return;
  const userInput = inp.value.trim();
  if (!userInput) return;

  // 正解判定：kanji・hiragana を「・」「、」「（」で分割し、どれか1つと一致で正解
  const normalize = s => s.replace(/\s/g, '');
  const input = normalize(userInput);
  const candidates = [
    ...currentQuestion.kanji.split(/[・、（]/),
    ...currentQuestion.hiragana.split(/[・、（]/),
  ].map(s => normalize(s.replace(/）.*$/, ''))).filter(s => s.length > 0);

  const isCorrect = candidates.some(c => input === c);

  inp.disabled = true;
  document.querySelector('.typing-submit-btn').disabled = true;

  if (isCorrect) {
    inp.classList.add('input-correct');
    score += 10;
    speak(currentQuestion.english);
    showFeedback(true, `せいかい！ +10てん 🎉`);
    answeredCount++;
    setTimeout(nextTypingQuestion, 1100);
  } else {
    inp.classList.add('input-wrong');
    lives--;
    saveMistake(currentQuestion.id);
    speak(currentQuestion.english, 0.75);
    showFeedback(false, `こたえは「${currentQuestion.kanji}（${currentQuestion.hiragana}）」だよ！`);
    answeredCount++;
    setTimeout(lives <= 0 ? renderTypingOver : nextTypingQuestion, 1800);
  }
}

function skipTyping() {
  lives--;
  saveMistake(currentQuestion.id);
  speak(currentQuestion.english, 0.75);
  showFeedback(false, `こたえは「${currentQuestion.kanji}（${currentQuestion.hiragana}）」だよ！`);
  answeredCount++;
  setTimeout(lives <= 0 ? renderTypingOver : nextTypingQuestion, 1800);
}

function renderTypingOver() {
  const cleared = lives > 0;
  const rank = score >= totalQuestions*9 ? '🥇' : score >= totalQuestions*6 ? '🥈' : '🥉';
  const newBadges = addGameStats(cleared && lives === MAX_LIVES);
  const earnedBadges = loadBadges();
  const badgeList = BADGE_DEFS.filter(d => earnedBadges.includes(d.id));

  document.getElementById('app').innerHTML = `
    <div class="gameover-screen">
      ${cleared ? '<canvas id="fireworksCanvas" style="position:fixed;inset:0;pointer-events:none;z-index:50;width:100%;height:100%;"></canvas>' : ''}
      <div class="go-icon">${cleared ? '🎊' : '😢'}</div>
      <h2 class="go-title">${cleared ? 'クリア！すごい！' : 'ゲームオーバー'}</h2>
      <div class="go-score-block">
        <div class="go-rank">${rank}</div>
        <div class="go-score">${score} <span class="go-score-unit">てん</span></div>
        <div class="go-detail">${answeredCount}もん中 ${Math.round(score/10)}せいかい</div>
      </div>
      ${newBadges.length ? `
        <div class="new-badges">
          <p class="new-badge-label">🎉 あたらしい バッジ！</p>
          ${newBadges.map(b => `<div class="badge-item new">${b.icon} ${b.name}</div>`).join('')}
        </div>` : ''}
      ${badgeList.length ? `
        <div class="all-badges">
          <p class="badge-section-label">もっているバッジ</p>
          <div class="badge-grid">${badgeList.map(b => `<span class="badge-chip" title="${b.name}">${b.icon}</span>`).join('')}</div>
        </div>` : ''}
      <div class="complete-btns">
        <p class="retry-label">もう一度あそぶ</p>
        <div class="retry-grid">
          <button class="retry-btn" onclick="startGame('normal')">🎮 ゲーム①<span>にほんご→えいご</span></button>
          <button class="retry-btn" onclick="startGame('reverse')">🔄 ゲーム②<span>えいご→にほんご</span></button>
          <button class="retry-btn" onclick="startTyping()" style="grid-column:1/-1;">⌨️ タイピング<span>えいごをみてうちこむ</span></button>
        </div>
        <button class="action-btn primary"   onclick="renderBadgePage()">🏅 バッジをみる</button>
        <button class="action-btn secondary" onclick="startStudy()">🃏 あんきモードへ</button>
        <button class="action-btn ghost"     onclick="renderMenu()">メニューへもどる</button>
      </div>
    </div>
  `;
  if (cleared) setTimeout(launchFireworks, 100);
  if (newBadges.length) setTimeout(() => showBadgeNotification(newBadges), 800);
}

// ===============================
//  まちがいノート メニュー
// ===============================
function renderMistakeMenu() {
  const mistakeWords = getMistakeWords();
  const mistakes = loadMistakes();

  document.getElementById('app').innerHTML = `
    <div class="menu-screen">
      <div class="logo-area">
        <div class="logo-icon">📝</div>
        <h1 class="logo-title" style="font-size:2rem;">まちがいノート</h1>
        <p class="logo-sub">${mistakeWords.length}語 まちがえたことがあるよ</p>
      </div>

      <div class="mistake-list">
        ${mistakeWords.slice(0, 10).map(w => `
          <div class="mistake-item">
            <span class="mistake-word">${w.kanji}</span>
            <span class="mistake-english">${w.english}</span>
            <span class="mistake-times">${mistakes[w.id]}回まちがい</span>
          </div>
        `).join('')}
        ${mistakeWords.length > 10 ? `<p class="mistake-more">…ほか ${mistakeWords.length - 10}語</p>` : ''}
      </div>

      <div class="mode-cards">
        <button class="mode-card game-card" onclick="startMistakeGame('normal')">
          <div class="mode-icon">🎮</div>
          <div class="mode-name">ゲーム①</div>
          <div class="mode-desc">にほんご→えいご<br>まちがいだけで</div>
        </button>
        <button class="mode-card reverse-card" onclick="startMistakeGame('reverse')">
          <div class="mode-icon">🔄</div>
          <div class="mode-name">ゲーム②</div>
          <div class="mode-desc">えいご→にほんご<br>まちがいだけで</div>
        </button>
        <button class="mode-card typing-card" onclick="startMistakeTyping()" style="grid-column:1/-1;">
          <div class="mode-icon">⌨️</div>
          <div class="mode-name">タイピング</div>
          <div class="mode-desc">まちがいだけで　うちこもう</div>
        </button>
      </div>

      <div style="display:flex;gap:12px;width:100%;">
        <button class="action-btn ghost" style="flex:1;" onclick="renderMenu()">← もどる</button>
        <button class="action-btn ghost" style="flex:1;color:#ff4b4b;" onclick="confirmResetMistakes()">🗑️ リセット</button>
      </div>
    </div>
  `;
}

function confirmResetMistakes() {
  if (confirm('まちがいノートをリセットしますか？')) {
    localStorage.removeItem(STORAGE_KEY);
    renderMenu();
  }
}

function startMistakeGame(direction = 'normal') {
  const mistakeWords = getMistakeWords();
  if (mistakeWords.length < 4) {
    // 間違い語が4未満の場合は全体から補填
    filteredWords = [...allWords];
  } else {
    filteredWords = mistakeWords;
  }
  currentMode = 'game';
  gameDirection = direction;
  score = 0; lives = MAX_LIVES; answeredCount = 0;
  totalQuestions = Math.min(TOTAL_Q, filteredWords.length);
  // 間違い回数が多い順に並べてシャッフル（上位を優先）
  gameQueue = filteredWords.slice(0, totalQuestions);
  nextQuestion();
}

function startMistakeTyping() {
  const mistakeWords = getMistakeWords();
  if (mistakeWords.length === 0) { alert('まちがいがありません'); return; }
  filteredWords = mistakeWords.length >= 4 ? mistakeWords : [...allWords];
  currentMode = 'typing';
  score = 0; lives = MAX_LIVES; answeredCount = 0;
  totalQuestions = Math.min(TOTAL_Q, filteredWords.length);
  gameQueue = filteredWords.slice(0, totalQuestions);
  nextTypingQuestion();
}

// ===============================
//  バッジ・称号 画面
// ===============================
function renderBadgePage() {
  const earned = loadBadges();
  const stats  = loadStats();
  const title  = getCurrentTitle();
  const next   = getNextTitle();

  // 称号ロードマップHTML
  const titleRoadmap = TITLE_DEFS.map(t => {
    const unlocked = earned.length >= t.need;
    return `
      <div class="title-row ${unlocked ? 'unlocked' : 'locked'}">
        <span class="title-row-icon">${unlocked ? t.icon : '🔒'}</span>
        <div class="title-row-info">
          <span class="title-row-name">${unlocked ? t.title : '？？？'}</span>
          <span class="title-row-cond">バッジ ${t.need}こ で かいほう</span>
          ${unlocked ? `<span class="title-row-msg">${t.msg}</span>` : ''}
        </div>
        ${unlocked ? '<span class="title-row-check">✅</span>' : ''}
      </div>`;
  }).join('');

  // バッジ一覧HTML
  const badgeGrid = BADGE_DEFS.map(def => {
    const got = earned.includes(def.id);
    return `
      <div class="badge-card ${got ? 'got' : 'notyet'}">
        <span class="badge-card-icon">${got ? def.icon : '❓'}</span>
        <span class="badge-card-name">${got ? def.name : '？？？'}</span>
      </div>`;
  }).join('');

  document.getElementById('app').innerHTML = `
    <div class="badge-page">
      <div class="badge-page-header">
        <button class="back-btn" onclick="renderMenu()">← もどる</button>
        <h2 class="badge-page-title">🏅 バッジ・しょうごう</h2>
      </div>

      ${title ? `
      <div class="current-title-card">
        <div class="ct-icon">${title.icon}</div>
        <div class="ct-info">
          <p class="ct-label">いまの しょうごう</p>
          <p class="ct-title">${title.title}</p>
          <p class="ct-msg">${title.msg}</p>
        </div>
      </div>` : `
      <div class="current-title-card no-title">
        <div class="ct-icon">🥚</div>
        <div class="ct-info">
          <p class="ct-label">いまの しょうごう</p>
          <p class="ct-title">まだ しょうごうが ないよ</p>
          <p class="ct-msg">バッジを あつめて しょうごうを もらおう！</p>
        </div>
      </div>`}

      ${next ? `
      <div class="next-title-bar">
        <span>つぎの しょうごう「${next.title}」まで</span>
        <span class="next-need">あと <b>${next.need - earned.length}</b> こ</span>
        <div class="next-title-progress-wrap">
          <div class="next-title-progress-bar" style="width:${Math.min(earned.length/next.need*100,100).toFixed(0)}%"></div>
        </div>
      </div>` : `
      <div class="next-title-bar complete">🎉 すべての しょうごうを かいほう！！</div>`}

      <h3 class="section-title">しょうごう ロードマップ</h3>
      <div class="title-roadmap">${titleRoadmap}</div>

      <h3 class="section-title">バッジ いちらん <span class="badge-count-text">${earned.length}/${BADGE_DEFS.length}</span></h3>
      <div class="badge-cards-grid">${badgeGrid}</div>

      <h3 class="section-title">きろく</h3>
      <div class="stats-grid">
        <div class="stat-item"><span class="stat-val">${stats.totalCorrect||0}</span><span class="stat-label">せいかい</span></div>
        <div class="stat-item"><span class="stat-val">${stats.totalGames||0}</span><span class="stat-label">プレイ回数</span></div>
        <div class="stat-item"><span class="stat-val">${stats.maxComboEver||0}</span><span class="stat-label">さいこうコンボ</span></div>
        <div class="stat-item"><span class="stat-val">${stats.perfectClears||0}</span><span class="stat-label">ぜんもんせいかい</span></div>
      </div>

      <button class="action-btn ghost" style="width:100%;margin-top:8px;" onclick="renderMenu()">メニューへもどる</button>
    </div>
  `;
}

// ===============================
//  花火・紙吹雪アニメーション
// ===============================
function launchFireworks() {
  const canvas = document.getElementById('fireworksCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#58cc02','#ffc800','#1cb0f6','#ff4b4b','#ce82ff','#ff9f43','#ffffff'];

  function createBurst(x, y) {
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 / 60) * i;
      const speed = 3 + Math.random() * 5;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 4,
        decay: 0.015 + Math.random() * 0.01,
      });
    }
  }

  // 複数箇所で花火を打ち上げる
  const positions = [
    [canvas.width * 0.25, canvas.height * 0.3],
    [canvas.width * 0.75, canvas.height * 0.25],
    [canvas.width * 0.5,  canvas.height * 0.4],
    [canvas.width * 0.2,  canvas.height * 0.5],
    [canvas.width * 0.8,  canvas.height * 0.45],
  ];
  positions.forEach(([x, y], i) => setTimeout(() => createBurst(x, y), i * 250));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.12; // 重力
      p.vx *= 0.98;
      p.alpha -= p.decay;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (particles.length > 0) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}

// ===== ユーティリティ =====
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

window.addEventListener('DOMContentLoaded', init);
