// =====================================================
//  WordQuest — ui_game.js
//  4択ゲームモード（normal / reverse）＋まちがいノートのUI
//  依存: game.js のグローバル変数
//        score / lives / combo / maxCombo / answeredCount / totalQuestions
//        currentQuestion / gameQueue / filteredWords / gameDirection / selectedCategory
// =====================================================

const TOTAL_Q  = 10;
const MAX_LIVES = 3;

// ===============================
//  ゲーム開始
// ===============================
function startGame(direction = 'normal') {
  applyFilter(selectedCategory);
  if (filteredWords.length < 4) { alert('ゲームには4語以上必要です'); return; }
  currentMode   = 'game';
  gameDirection = direction;
  score = 0; lives = MAX_LIVES; answeredCount = 0;
  combo = 0;  maxCombo = 0;
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

// ===============================
//  問題画面
// ===============================
function renderGameQuestion(choices) {
  const pct      = (answeredCount / totalQuestions * 100).toFixed(0);
  const isReverse = gameDirection === 'reverse';
  const hearts   = Array.from({ length: MAX_LIVES }, (_, i) =>
    `<span class="heart ${i < lives ? 'active' : 'lost'}">♥</span>`
  ).join('');

  const questionHTML = isReverse
    ? `<p class="question-label">にほんごは　なに？</p>
       <div class="question-word">
         <span class="q-kanji" style="letter-spacing:2px;">${currentQuestion.english}</span>
       </div>
       <button class="sound-btn" onclick="speak('${currentQuestion.english}')">🔊 もう一度きく</button>`
    : `<p class="question-label">えいごは　なに？</p>
       <div class="question-word">
         <ruby class="q-kanji">${currentQuestion.kanji}<rt>${currentQuestion.hiragana}</rt></ruby>
       </div>
       <button class="sound-btn" onclick="speak('${currentQuestion.english}')">🔊 もう一度きく</button>`;

  const choicesHTML = choices.map(c => {
    const label = isReverse
      ? `<ruby>${c.kanji}<rt>${c.hiragana}</rt></ruby>`
      : c.english;
    return `<button class="choice-btn" data-id="${c.id}" onclick="checkAnswer(${c.id}, this)">
              <span class="choice-text">${label}</span>
            </button>`;
  }).join('');

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
      <p class="choice-label">${isReverse ? 'にほんごを　えらんでね' : 'えいごを　えらんでね'}</p>
      <div class="choices-grid">${choicesHTML}</div>
      <button class="skip-btn" onclick="skipQuestion()">わからない</button>
    </div>
  `;
  setTimeout(() => speak(currentQuestion.english), 300);
}

// ===============================
//  回答チェック
// ===============================
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
    if (combo >= 3) score += 5;
    speak(currentQuestion.english);
    showFeedback(true, combo >= 3 ? `${combo}れんぞく！ +${combo >= 3 ? 15 : 10}てん🔥` : 'せいかい！ +10てん 🎉');
    showCombo(combo);
    const newBadges = addCorrectStats();
    if (newBadges.length) setTimeout(() => showBadgeNotification(newBadges), 400);
    answeredCount++;
    setTimeout(nextQuestion, 1100);
  } else {
    btn.classList.add('wrong');
    combo = 0; lives--;
    saveMistake(currentQuestion.id);
    speak(currentQuestion.english, 0.6);
    showFeedback(false, `こたえは「${currentQuestion.english}」だよ！`);
    answeredCount++;
    const retryBadges = addRetryStats();
    if (retryBadges.length) setTimeout(() => showBadgeNotification(retryBadges), 400);
    setTimeout(lives <= 0 ? renderGameOver : nextQuestion, 1400);
  }
}

function skipQuestion() {
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (Number(b.dataset.id) === currentQuestion.id) b.classList.add('correct');
  });
  combo = 0; lives--;
  saveMistake(currentQuestion.id);
  speak(currentQuestion.english, 0.6);
  showFeedback(false, `こたえは「${currentQuestion.english}」だよ！`);
  answeredCount++;
  const retryBadges = addRetryStats();
  if (retryBadges.length) setTimeout(() => showBadgeNotification(retryBadges), 400);
  setTimeout(lives <= 0 ? renderGameOver : nextQuestion, 1400);
}

// ===============================
//  ゲームオーバー画面
// ===============================
function renderGameOver() {
  const cleared   = lives > 0;
  const isPerfect = cleared && score === totalQuestions * (combo >= 3 ? 15 : 10);
  const rank      = score >= totalQuestions * 12 ? '🥇' : score >= totalQuestions * 8 ? '🥈' : '🥉';
  const newBadges = addGameStats(isPerfect, gameDirection, selectedCategory);
  const earned    = loadBadges();
  const badgeList = BADGE_DEFS.filter(d => earned.includes(d.id));

  document.getElementById('app').innerHTML = `
    <div class="gameover-screen">
      ${cleared ? '<canvas id="fireworksCanvas" style="position:fixed;inset:0;pointer-events:none;z-index:50;width:100%;height:100%;"></canvas>' : ''}
      <div class="go-icon">${cleared ? '🎊' : '😢'}</div>
      <h2 class="go-title">${cleared ? 'クリア！すごい！' : 'ゲームオーバー'}</h2>
      <div class="go-score-block">
        <div class="go-rank">${rank}</div>
        <div class="go-score">${score} <span class="go-score-unit">てん</span></div>
        <div class="go-detail">${answeredCount}もん中 ${Math.round(score / 10)}せいかい　さいこうコンボ ${maxCombo}</div>
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
//  まちがいノート
// ===============================
function renderMistakeMenu() {
  const mistakeWords = getMistakeWords();
  const mistakes     = loadMistakes();

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
  filteredWords  = mistakeWords.length >= 4 ? mistakeWords : [...allWords];
  currentMode    = 'game';
  gameDirection  = direction;
  score = 0; lives = MAX_LIVES; answeredCount = 0;
  totalQuestions = Math.min(TOTAL_Q, filteredWords.length);
  gameQueue      = filteredWords.slice(0, totalQuestions);
  nextQuestion();
}

function startMistakeTyping() {
  const mistakeWords = getMistakeWords();
  if (mistakeWords.length === 0) { alert('まちがいがありません'); return; }
  filteredWords  = mistakeWords.length >= 4 ? mistakeWords : [...allWords];
  currentMode    = 'typing';
  score = 0; lives = MAX_LIVES; answeredCount = 0;
  totalQuestions = Math.min(TOTAL_Q, filteredWords.length);
  gameQueue      = filteredWords.slice(0, totalQuestions);
  nextTypingQuestion();
}
