// =====================================================
//  WordQuest — ui_game.js
// =====================================================

const TOTAL_Q  = 50;
const MAX_LIVES = 3;

// ===============================
function startGame(direction = 'normal') {
  applyFilter(selectedCategory);

  if (filteredWords.length < 4) {
    alert('ゲームには4語以上必要です');
    return;
  }

  currentMode   = 'game';
  gameDirection = direction;

  score = 0;
  lives = MAX_LIVES;
  answeredCount = 0;
  combo = 0;
  maxCombo = 0;

  totalQuestions = Math.min(TOTAL_Q, filteredWords.length);
  gameQueue = shuffle([...filteredWords]).slice(0, totalQuestions);

  nextQuestion();
}

// ===============================
function nextQuestion() {
  if (answeredCount >= totalQuestions || lives <= 0) {
    renderGameOver();
    return;
  }

  currentQuestion = gameQueue[answeredCount];
  renderGameQuestion(makeChoices(currentQuestion));
}

// ===============================
function makeChoices(correct) {
  const pool = filteredWords.filter(w => w.id !== correct.id);
  return shuffle([correct, ...shuffle(pool).slice(0, 3)]);
}

// ===============================
function renderGameQuestion(choices) {
  const pct = (answeredCount / totalQuestions * 100).toFixed(0);
  const isReverse = gameDirection === 'reverse';

  const hearts = Array.from({ length: MAX_LIVES }, (_, i) =>
    `<span class="heart ${i < lives ? 'active' : 'lost'}">♥</span>`
  ).join('');

  const questionHTML = isReverse
    ? `
      <p class="question-label">にほんごは　なに？</p>
      <div class="question-word">
        <span class="q-kanji">${currentQuestion.english}</span>
      </div>
      <button class="sound-btn" onclick="speak('${currentQuestion.english}')">🔊 もう一度きく</button>
    `
    : `
      <p class="question-label">えいごは　なに？</p>
      <div class="question-word">
        <ruby class="q-kanji">${currentQuestion.kanji}<rt>${currentQuestion.hiragana}</rt></ruby>
      </div>
      <button class="sound-btn" onclick="speak('${currentQuestion.english}')">🔊 もう一度きく</button>
    `;

  const choicesHTML = choices.map(c => {
    const label = isReverse
      ? `<ruby>${c.kanji}<rt>${c.hiragana}</rt></ruby>`
      : c.english;

    return `
      <button class="choice-btn" data-id="${c.id}" onclick="checkAnswer(${c.id}, this)">
        <span class="choice-text">${label}</span>
      </button>
    `;
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

      <div class="question-area">
        ${questionHTML}
      </div>

      <p class="choice-label">
        ${isReverse ? 'にほんごを　えらんでね' : 'えいごを　えらんでね'}
      </p>

      <div class="choices-grid">
        ${choicesHTML}
      </div>

      <button class="skip-btn" onclick="skipQuestion()">わからない</button>
    </div>
  `;

  setTimeout(() => speak(currentQuestion.english), 300);
}

// ===============================
function checkAnswer(chosenId, btn) {
  const isCorrect = chosenId === currentQuestion.id;

  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (Number(b.dataset.id) === currentQuestion.id) {
      b.classList.add('correct');
    }
  });

  if (isCorrect) {
    score += 10;
    combo++;
    maxCombo = Math.max(maxCombo, combo);

    if (combo >= 3) score += 5;

    speak(currentQuestion.english);

    showFeedback(
      true,
      combo >= 3
        ? `${combo}れんぞく！ +15てん🔥`
        : 'せいかい！ +10てん 🎉'
    );

    showCombo(combo);

    const newBadges = addCorrectStats();
    if (newBadges.length) {
      setTimeout(() => showBadgeNotification(newBadges), 400);
    }

    answeredCount++;
    setTimeout(nextQuestion, 1100);

  } else {
    btn.classList.add('wrong');

    combo = 0;
    lives--;

    saveMistake(currentQuestion.id);
    speak(currentQuestion.english, 0.6);

    showFeedback(false, `こたえは「${currentQuestion.english}」だよ！`);

    answeredCount++;

    const retryBadges = addRetryStats();
    if (retryBadges.length) {
      setTimeout(() => showBadgeNotification(retryBadges), 400);
    }

    setTimeout(
      lives <= 0 ? renderGameOver : nextQuestion,
      1400
    );
  }
}

// ===============================
function skipQuestion() {
  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (Number(b.dataset.id) === currentQuestion.id) {
      b.classList.add('correct');
    }
  });

  combo = 0;
  lives--;

  saveMistake(currentQuestion.id);
  speak(currentQuestion.english, 0.6);

  showFeedback(false, `こたえは「${currentQuestion.english}」だよ！`);

  answeredCount++;

  const retryBadges = addRetryStats();
  if (retryBadges.length) {
    setTimeout(() => showBadgeNotification(retryBadges), 400);
  }

  setTimeout(
    lives <= 0 ? renderGameOver : nextQuestion,
    1400
  );
}
