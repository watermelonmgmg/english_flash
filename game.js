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
  allWords = WORDS_ADJECTIVES;
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
        <button class="mode-card game-card" onclick="startGame()">
          <div class="mode-icon">🎮</div>
          <div class="mode-name">ゲームモード</div>
          <div class="mode-desc">もんだいに こたえて<br>スコアをかせごう</div>
        </button>
        <button class="mode-card typing-card" onclick="startTyping()" style="grid-column:1/-1;">
          <div class="mode-icon">⌨️</div>
          <div class="mode-name">タイピングモード</div>
          <div class="mode-desc">えいごをみて　にほんごを　うちこもう</div>
        </button>
      </div>
      <div class="word-count-badge">${filteredWords.length}語 学習できます</div>
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

function startGame() {
  applyFilter(selectedCategory);
  if (filteredWords.length < 4) { alert('ゲームには4語以上必要です'); return; }
  currentMode = 'game';
  score = 0; lives = MAX_LIVES; answeredCount = 0;
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
        <p class="question-label">えいごは　なに？</p>
        <div class="question-word">
          <span class="q-kanji">${currentQuestion.kanji}</span>
        </div>
        <p class="question-sub">${currentQuestion.hiragana}</p>
        <button class="sound-btn" onclick="speak('${currentQuestion.english}')">🔊 もう一度きく</button>
      </div>
      <p class="choice-label">えいごを　えらんでね</p>
      <div class="choices-grid">
        ${choices.map(c => `
          <button class="choice-btn" data-id="${c.id}" onclick="checkAnswer(${c.id}, this)">
            <span class="choice-text">${c.english}</span>
          </button>
        `).join('')}
      </div>
      <button class="skip-btn" onclick="skipQuestion()">わからない</button>
    </div>
  `;
  // 問題表示時に英語を読み上げ
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
    speak(currentQuestion.english);
    showFeedback(true, `せいかい！ +10てん 🎉`);
    answeredCount++;
    setTimeout(nextQuestion, 1100);
  } else {
    btn.classList.add('wrong');
    lives--;
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
  lives--;
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

function renderGameOver() {
  const cleared = lives > 0;
  const rank = score >= totalQuestions*9 ? '🥇' : score >= totalQuestions*6 ? '🥈' : '🥉';
  document.getElementById('app').innerHTML = `
    <div class="gameover-screen">
      <div class="go-icon">${cleared ? '🎊' : '😢'}</div>
      <h2 class="go-title">${cleared ? 'クリア！' : 'ゲームオーバー'}</h2>
      <div class="go-score-block">
        <div class="go-rank">${rank}</div>
        <div class="go-score">${score} <span class="go-score-unit">てん</span></div>
        <div class="go-detail">${answeredCount}もん中 ${Math.round(score/10)}せいかい</div>
      </div>
      <div class="complete-btns">
        <button class="action-btn primary"   onclick="startGame()">もう一度</button>
        <button class="action-btn secondary" onclick="startStudy()">あんきへ</button>
        <button class="action-btn ghost"     onclick="renderMenu()">メニュー</button>
      </div>
    </div>
  `;
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

  // 正解判定：kanji または hiragana と一致で正解
  const correct1 = currentQuestion.kanji.replace(/[・。、]/g, '');
  const correct2 = currentQuestion.hiragana.replace(/[・。、]/g, '');
  const input    = userInput.replace(/[・。、\s]/g, '');
  const isCorrect = input === correct1 || input === correct2;

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
    speak(currentQuestion.english, 0.75);
    showFeedback(false, `こたえは「${currentQuestion.kanji}（${currentQuestion.hiragana}）」だよ！`);
    answeredCount++;
    setTimeout(lives <= 0 ? renderTypingOver : nextTypingQuestion, 1800);
  }
}

function skipTyping() {
  lives--;
  speak(currentQuestion.english, 0.75);
  showFeedback(false, `こたえは「${currentQuestion.kanji}（${currentQuestion.hiragana}）」だよ！`);
  answeredCount++;
  setTimeout(lives <= 0 ? renderTypingOver : nextTypingQuestion, 1800);
}

function renderTypingOver() {
  const cleared = lives > 0;
  const rank = score >= totalQuestions*9 ? '🥇' : score >= totalQuestions*6 ? '🥈' : '🥉';
  document.getElementById('app').innerHTML = `
    <div class="gameover-screen">
      <div class="go-icon">${cleared ? '🎊' : '😢'}</div>
      <h2 class="go-title">${cleared ? 'クリア！' : 'ゲームオーバー'}</h2>
      <div class="go-score-block">
        <div class="go-rank">${rank}</div>
        <div class="go-score">${score} <span class="go-score-unit">てん</span></div>
        <div class="go-detail">${answeredCount}もん中 ${Math.round(score/10)}せいかい</div>
      </div>
      <div class="complete-btns">
        <button class="action-btn primary"   onclick="startTyping()">もう一度</button>
        <button class="action-btn secondary" onclick="startGame()">ゲームモードへ</button>
        <button class="action-btn ghost"     onclick="renderMenu()">メニュー</button>
      </div>
    </div>
  `;
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