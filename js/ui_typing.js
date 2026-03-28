// =====================================================
//  WordQuest — ui_typing.js
//  タイピングモードのUI
//  依存: game.js のグローバル変数 / ui_game.js の MAX_LIVES・TOTAL_Q
// =====================================================

function startTyping() {
  applyFilter(selectedCategory);
  if (filteredWords.length === 0) { alert('単語がありません'); return; }
  currentMode    = 'typing';
  score = 0; lives = MAX_LIVES; answeredCount = 0;
  totalQuestions = Math.min(TOTAL_Q, filteredWords.length);
  gameQueue      = shuffle([...filteredWords]).slice(0, totalQuestions);
  nextTypingQuestion();
}

function nextTypingQuestion() {
  if (answeredCount >= totalQuestions || lives <= 0) { renderTypingOver(); return; }
  currentQuestion = gameQueue[answeredCount];
  renderTypingQuestion();
}

function renderTypingQuestion() {
  const pct    = (answeredCount / totalQuestions * 100).toFixed(0);
  const hearts = Array.from({ length: MAX_LIVES }, (_, i) =>
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
          onkeydown="if(event.key==='Enter') checkTyping()" />
        <button class="typing-submit-btn" onclick="checkTyping()">こたえる</button>
      </div>
      <button class="skip-btn" onclick="skipTyping()">わからない</button>
    </div>
  `;
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

  const normalize   = s => s.replace(/\s/g, '');
  const input       = normalize(userInput);
  const candidates  = [
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
    showFeedback(true, 'せいかい！ +10てん 🎉');
    answeredCount++;
    setTimeout(nextTypingQuestion, 1100);
  } else {
    inp.classList.add('input-wrong');
    lives--;
    saveMistake(currentQuestion.id);
    speak(currentQuestion.english, 0.6);
    showFeedback(false, `こたえは「${currentQuestion.kanji}（${currentQuestion.hiragana}）」だよ！`);
    answeredCount++;
    const retryBadges = addRetryStats();
    if (retryBadges.length) setTimeout(() => showBadgeNotification(retryBadges), 400);
    setTimeout(lives <= 0 ? renderTypingOver : nextTypingQuestion, 1800);
  }
}

function skipTyping() {
  lives--;
  saveMistake(currentQuestion.id);
  speak(currentQuestion.english, 0.6);
  showFeedback(false, `こたえは「${currentQuestion.kanji}（${currentQuestion.hiragana}）」だよ！`);
  answeredCount++;
  const retryBadges = addRetryStats();
  if (retryBadges.length) setTimeout(() => showBadgeNotification(retryBadges), 400);
  setTimeout(lives <= 0 ? renderTypingOver : nextTypingQuestion, 1800);
}

function renderTypingOver() {
  const cleared   = lives > 0;
  const rank      = score >= totalQuestions * 9 ? '🥇' : score >= totalQuestions * 6 ? '🥈' : '🥉';
  const newBadges = addGameStats(cleared && lives === MAX_LIVES, 'typing', selectedCategory);
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
        <div class="go-detail">${answeredCount}もん中 ${Math.round(score / 10)}せいかい</div>
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
