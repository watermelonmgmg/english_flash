// =====================================================
//  WordQuest — ui_game.js（カテゴリ対応・改良版）
// =====================================================

const MAX_LIVES = 3;

// ===============================
//  ゲーム開始（カテゴリ＋モード対応）
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
    const mistakes = loadMistakes();

    // ★ カテゴリ内だけに絞る
    let mistakeWords = getMistakeWords()
      .filter(w => w.category === selectedCategory);

    if (mistakeWords.length === 0) {
      alert('このカテゴリにまちがいがありません');
      return;
    }

    // ★ 苦手順（間違い多い順）
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

// ===============================
function makeChoices(correct) {
  const pool = filteredWords.filter(w => w.id !== correct.id);
  return shuffle([correct, ...shuffle(pool).slice(0, 3)]);
}

// ===============================
//  問題画面（音修正あり）
// ===============================
function renderGameQuestion(choices) {
  const pct       = (answeredCount / totalQuestions * 100).toFixed(0);
  const isReverse = gameDirection === 'reverse';

  const hearts = Array.from({ length: MAX_LIVES }, (_, i) =>
    `<span class="heart ${i < lives ? 'active' : 'lost'}">♥</span>`
  ).join('');

  const questionHTML = isReverse
    ? `<p>にほんごは なに？</p>
       <div>${currentQuestion.english}</div>`
    : `<p>えいごは なに？</p>
       <div><ruby>${currentQuestion.kanji}<rt>${currentQuestion.hiragana}</rt></ruby></div>`;

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
      <div>${answeredCount + 1}/${totalQuestions}（${pct}%）</div>
      <div>${hearts} ⭐${score}</div>

      ${questionHTML}

      <button onclick="speak('${currentQuestion.english}')">🔊 きく</button>

      <div>${choicesHTML}</div>

      <button onclick="skipQuestion()">わからない</button>
    </div>
  `;
}

// ===============================
//  回答チェック
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

    speak(currentQuestion.english, 0.7);

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
//  ゲーム終了
// ===============================
function renderGameOver() {
  document.getElementById('app').innerHTML = `
    <div>
      <h2>おわり！</h2>
      <p>${score}点</p>

      <button onclick="startGame('normal','all')">全問</button>
      <button onclick="startGame('normal','weak')">苦手</button>
      <button onclick="renderMenu()">もどる</button>
    </div>
  `;
}

// ===============================
//  まちがいモード（流用）
// ===============================
function startMistakeGame(direction = 'normal') {
  startGame(direction, 'weak');
}

function startMistakeTyping() {
  const mistakeWords = getMistakeWords()
    .filter(w => w.category === selectedCategory);

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

// ===============================
//  音声（安全版）
// ===============================
function speak(text, rate = 1) {
  if (!window.speechSynthesis) return;

  const uttr = new SpeechSynthesisUtterance(text);
  uttr.lang = 'en-US';
  uttr.rate = rate;

  speechSynthesis.cancel(); // ★ 連続再生対策
  speechSynthesis.speak(uttr);
}
