// =====================================================
//  WordQuest — ui_game.js（改良版）
// =====================================================

const MAX_LIVES = 3;

// ===============================
//  ゲーム開始（★ここ進化）
// ===============================
function startGame(direction = 'normal', mode = 'all') {
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

  if (mode === 'weak') {
    const mistakeWords = getMistakeWords();
    const mistakes     = loadMistakes();

    if (mistakeWords.length === 0) {
      alert('まちがいがありません');
      return;
    }

    // ★ 苦手順ソート（ここが今回の追加）
    mistakeWords.sort((a, b) => (mistakes[b.id] || 0) - (mistakes[a.id] || 0));

    filteredWords  = mistakeWords;
    totalQuestions = Math.min(10, filteredWords.length);
    gameQueue      = filteredWords.slice(0, totalQuestions);

  } else {
    // ★ 全問モード
    totalQuestions = filteredWords.length;
    gameQueue      = shuffle([...filteredWords]);
  }

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

function makeChoices(correct) {
  const pool = filteredWords.filter(w => w.id !== correct.id);
  return shuffle([correct, ...shuffle(pool).slice(0, 3)]);
}

// ===============================
function renderGameQuestion(choices) {
  const pct       = (answeredCount / totalQuestions * 100).toFixed(0);
  const isReverse = gameDirection === 'reverse';

  const hearts = Array.from({ length: MAX_LIVES }, (_, i) =>
    `<span class="heart ${i < lives ? 'active' : 'lost'}">♥</span>`
  ).join('');

  const questionHTML = isReverse
    ? `<p class="question-label">にほんごは　なに？</p>
       <div class="question-word">
         <span class="q-kanji">${currentQuestion.english}</span>
       </div>`
    : `<p class="question-label">えいごは　なに？</p>
       <div class="question-word">
         <ruby>${currentQuestion.kanji}<rt>${currentQuestion.hiragana}</rt></ruby>
       </div>`;

  const choicesHTML = choices.map(c => {
    const label = isReverse
      ? `<ruby>${c.kanji}<rt>${c.hiragana}</rt></ruby>`
      : c.english;

    return `<button class="choice-btn" data-id="${c.id}" onclick="checkAnswer(${c.id}, this)">
      ${label}
    </button>`;
  }).join('');

  document.getElementById('app').innerHTML = `
    <div class="game-screen">
      <div>${answeredCount + 1}/${totalQuestions}</div>
      <div>${hearts} ⭐${score}</div>
      ${questionHTML}
      <div>${choicesHTML}</div>
      <button onclick="skipQuestion()">わからない</button>
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
    answeredCount++;
    setTimeout(nextQuestion, 800);

  } else {
    btn.classList.add('wrong');
    combo = 0;
    lives--;

    saveMistake(currentQuestion.id);
    speak(currentQuestion.english, 0.6);

    answeredCount++;
    setTimeout(lives <= 0 ? renderGameOver : nextQuestion, 1000);
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
  answeredCount++;

  setTimeout(lives <= 0 ? renderGameOver : nextQuestion, 1000);
}

// ===============================
function renderGameOver() {
  document.getElementById('app').innerHTML = `
    <div>
      <h2>おわり！</h2>
      <p>${score}点</p>

      <button onclick="startGame('normal','all')">全問もう一回</button>
      <button onclick="startGame('normal','weak')">苦手だけ10問</button>
      <button onclick="renderMenu()">もどる</button>
    </div>
  `;
}

// ===============================
//  既存のまちがいモード → 流用
// ===============================
function startMistakeGame(direction = 'normal') {
  startGame(direction, 'weak');
}

function startMistakeTyping() {
  const mistakeWords = getMistakeWords();

  if (mistakeWords.length === 0) {
    alert('まちがいがありません');
    return;
  }

  filteredWords  = mistakeWords;
  currentMode    = 'typing';
  score = 0;
  lives = MAX_LIVES;
  answeredCount = 0;
  totalQuestions = Math.min(10, filteredWords.length);
  gameQueue      = filteredWords.slice(0, totalQuestions);

  nextTypingQuestion();
}
