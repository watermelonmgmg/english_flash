// =====================================================
//  WordQuest — ui_master.js
//  仕上げモード（Master Mode）
//
//  ルール:
//  ・全カテゴリーを順番に、各カテゴリーの単語を全部出しきる
//  ・1問ごとに direction を normal → reverse → normal … と交互
//  ・ライフ制なし（全単語クリアが目標）
//  ・ミスした単語は全カテゴリー終了後にまとめて再出題
//  ・再出題でもミスしたらもう一度（全員正解するまでループ）
// =====================================================

// -------------------------------------------------------
//  モジュールスコープ変数
// -------------------------------------------------------
let masterQueue        = [];   // [{word, direction}] 今フェーズの問題列
let masterRetryPool    = [];   // ミスした word オブジェクトを蓄積
let masterCurrentIndex = 0;    // masterQueue 内の現在位置
let masterScore        = 0;
let masterCorrect      = 0;
let masterMiss         = 0;
let masterMaxCombo     = 0;
let masterCombo        = 0;
let masterIsRetryPhase = false;
let masterCurrentItem  = null; // {word, direction}

// カテゴリー進捗表示用
let masterCategories   = [];   // ['動物','食べ物', …]
let masterCatIndex     = 0;    // 今何番目のカテゴリー

// -------------------------------------------------------
//  エントリーポイント
// -------------------------------------------------------
function startMasterMode() {
  // 全カテゴリーをリストアップ（重複除去・順序保持）
  const cats = [...new Set(allWords.map(w => w.category).filter(Boolean))];
  if (cats.length === 0) {
    // カテゴリー情報がない場合は全単語を1カテゴリーとして扱う
    cats.push('すべて');
  }

  masterCategories   = cats;
  masterCatIndex     = 0;
  masterScore        = 0;
  masterCorrect      = 0;
  masterMiss         = 0;
  masterMaxCombo     = 0;
  masterCombo        = 0;
  masterRetryPool    = [];
  masterIsRetryPhase = false;
  currentMode        = 'master';

  masterQueue        = buildMasterQueue(cats);
  masterCurrentIndex = 0;

  nextMasterQuestion();
}

// -------------------------------------------------------
//  問題キューを組み立てる
//  カテゴリー順 → 各カテゴリー内の単語をシャッフル
//  direction は交互（全体で通し番号を使う）
// -------------------------------------------------------
function buildMasterQueue(cats, directionOffset = 0) {
  const queue = [];
  let globalIdx = directionOffset; // direction の交互カウンター

  for (const cat of cats) {
    const words = cat === 'すべて'
      ? shuffle([...allWords])
      : shuffle(allWords.filter(w => w.category === cat));

    for (const word of words) {
      queue.push({
        word,
        direction: globalIdx % 2 === 0 ? 'normal' : 'reverse',
        category: cat,
      });
      globalIdx++;
    }
  }
  return queue;
}

// -------------------------------------------------------
//  次の問題へ
// -------------------------------------------------------
function nextMasterQuestion() {
  if (masterCurrentIndex >= masterQueue.length) {
    // フェーズ終了
    if (masterRetryPool.length > 0) {
      startMasterRetryPhase();
    } else {
      renderMasterComplete();
    }
    return;
  }

  masterCurrentItem = masterQueue[masterCurrentIndex];

  // カテゴリーインデックスを更新（通常フェーズのみ）
  if (!masterIsRetryPhase) {
    const cat = masterCurrentItem.category;
    masterCatIndex = masterCategories.indexOf(cat);
  }

  renderMasterQuestion(makeMasterChoices(masterCurrentItem.word));
}

// -------------------------------------------------------
//  再出題フェーズへ
// -------------------------------------------------------
function startMasterRetryPhase() {
  masterIsRetryPhase = true;

  // retryPool をシャッフルし direction を再付与（続きの交互から）
  const dirOffset = masterQueue.length; // 通し番号を引き継ぐ
  const retryWords = shuffle([...masterRetryPool]);
  masterRetryPool    = [];
  masterQueue        = retryWords.map((word, i) => ({
    word,
    direction: (dirOffset + i) % 2 === 0 ? 'normal' : 'reverse',
    category: 'もう一度',
  }));
  masterCurrentIndex = 0;

  // 再出題フェーズ突入アニメ
  showMasterPhaseTransition(() => nextMasterQuestion());
}

// -------------------------------------------------------
//  選択肢を作る（正解1 + ランダム3）
// -------------------------------------------------------
function makeMasterChoices(correct) {
  const pool = allWords.filter(w => w.id !== correct.id);
  return shuffle([correct, ...shuffle(pool).slice(0, 3)]);
}

// -------------------------------------------------------
//  問題画面
// -------------------------------------------------------
function renderMasterQuestion(choices) {
  const item       = masterCurrentItem;
  const isReverse  = item.direction === 'reverse';
  const totalQ     = masterQueue.length;
  const pct        = (masterCurrentIndex / totalQ * 100).toFixed(0);

  // カテゴリー進捗バー（通常フェーズ）
  const catProgress = masterIsRetryPhase
    ? `<div class="master-phase-badge retry">🔁 もう一度チャレンジ！</div>`
    : buildCatProgressBar();

  const questionHTML = isReverse
    ? `<p class="question-label">にほんごは　なに？</p>
       <div class="question-word">
         <span class="q-kanji" style="letter-spacing:2px;">${item.word.english}</span>
       </div>
       <button class="sound-btn" onclick="speak('${item.word.english}')">🔊 もう一度きく</button>`
    : `<p class="question-label">えいごは　なに？</p>
       <div class="question-word">
         <ruby class="q-kanji">${item.word.kanji}<rt>${item.word.hiragana}</rt></ruby>
       </div>
       <button class="sound-btn" onclick="speak('${item.word.english}')">🔊 もう一度きく</button>`;

  const choicesHTML = choices.map(c => {
    const label = isReverse
      ? `<ruby>${c.kanji}<rt>${c.hiragana}</rt></ruby>`
      : c.english;
    return `<button class="choice-btn" data-id="${c.id}" onclick="checkMasterAnswer(${c.id}, this)">
              <span class="choice-text">${label}</span>
            </button>`;
  }).join('');

  // 方向バッジ
  const dirBadge = isReverse
    ? `<span class="master-dir-badge reverse">えいご→にほんご</span>`
    : `<span class="master-dir-badge normal">にほんご→えいご</span>`;

  document.getElementById('app').innerHTML = `
    <div class="game-screen">
      <div class="game-header">
        <button class="back-btn" onclick="renderMenu()">← もどる</button>
        <div class="game-progress-wrap">
          <div class="game-progress-bar" style="width:${pct}%"></div>
        </div>
        <span class="game-counter">${masterCurrentIndex + 1}/${totalQ}</span>
      </div>

      <div class="master-hud">
        ${catProgress}
        <div class="master-hud-right">
          ${dirBadge}
          <div class="score-badge">⭐ ${masterScore}</div>
        </div>
      </div>

      <div class="question-area">${questionHTML}</div>
      <p class="choice-label">${isReverse ? 'にほんごを　えらんでね' : 'えいごを　えらんでね'}</p>
      <div class="choices-grid">${choicesHTML}</div>
    </div>
  `;

  setTimeout(() => speak(item.word.english), 300);
}

// -------------------------------------------------------
//  カテゴリー進捗バー
// -------------------------------------------------------
function buildCatProgressBar() {
  const dots = masterCategories.map((cat, i) => {
    const cls = i < masterCatIndex ? 'done' : i === masterCatIndex ? 'current' : 'todo';
    return `<span class="master-cat-dot ${cls}" title="${cat}"></span>`;
  }).join('');

  const catName = masterCategories[masterCatIndex] || '';
  return `
    <div class="master-cat-progress">
      <span class="master-cat-name">📂 ${catName}</span>
      <div class="master-cat-dots">${dots}</div>
    </div>`;
}

// -------------------------------------------------------
//  回答チェック
// -------------------------------------------------------
function checkMasterAnswer(chosenId, btn) {
  const word      = masterCurrentItem.word;
  const isCorrect = chosenId === word.id;

  document.querySelectorAll('.choice-btn').forEach(b => {
    b.disabled = true;
    if (Number(b.dataset.id) === word.id) b.classList.add('correct');
  });

  if (isCorrect) {
    masterScore += 10;
    masterCombo++;
    masterCorrect++;
    masterMaxCombo = Math.max(masterMaxCombo, masterCombo);
    if (masterCombo >= 3) masterScore += 5;
    speak(word.english);
    showFeedback(true, masterCombo >= 3
      ? `${masterCombo}れんぞく！ +${masterCombo >= 3 ? 15 : 10}てん🔥`
      : 'せいかい！ +10てん 🎉');
    showCombo(masterCombo);

    const newBadges = addCorrectStats();
    if (newBadges.length) setTimeout(() => showBadgeNotification(newBadges), 400);

    masterCurrentIndex++;
    setTimeout(nextMasterQuestion, 1100);
  } else {
    btn.classList.add('wrong');
    masterCombo = 0;
    masterMiss++;
    saveMistake(word.id);
    // ミスプールに追加（重複なし）
    if (!masterRetryPool.find(w => w.id === word.id)) {
      masterRetryPool.push(word);
    }
    speak(word.english, 0.6);
    showFeedback(false, `こたえは「${word.english}」だよ！`);

    const retryBadges = addRetryStats();
    if (retryBadges.length) setTimeout(() => showBadgeNotification(retryBadges), 400);

    masterCurrentIndex++;
    setTimeout(nextMasterQuestion, 1400);
  }
}

// -------------------------------------------------------
//  フェーズ切り替えアニメーション
// -------------------------------------------------------
function showMasterPhaseTransition(callback) {
  document.getElementById('app').innerHTML = `
    <div class="master-transition">
      <div class="transition-icon">🔁</div>
      <h2 class="transition-title">もう一度チャレンジ！</h2>
      <p class="transition-sub">まちがえた ${masterRetryPool.length === 0
        ? masterQueue.length
        : masterRetryPool.length}語 をもう一度といてみよう</p>
      <div class="transition-loader"></div>
    </div>
  `;
  setTimeout(callback, 2000);
}

// -------------------------------------------------------
//  クリア画面
// -------------------------------------------------------
function renderMasterComplete() {
  const accuracy  = masterCorrect + masterMiss > 0
    ? Math.round(masterCorrect / (masterCorrect + masterMiss) * 100)
    : 100;
  const rank      = accuracy >= 90 ? '🥇' : accuracy >= 70 ? '🥈' : '🥉';
  const isPerfect = masterMiss === 0;

  const newBadges = addGameStats(isPerfect, 'master', 'all');
  const earned    = loadBadges();
  const badgeList = BADGE_DEFS.filter(d => earned.includes(d.id));

  document.getElementById('app').innerHTML = `
    <div class="gameover-screen">
      <canvas id="fireworksCanvas" style="position:fixed;inset:0;pointer-events:none;z-index:50;width:100%;height:100%;"></canvas>
      <div class="go-icon">${isPerfect ? '🏆' : '🎊'}</div>
      <h2 class="go-title">${isPerfect ? 'かんぺき！ぜんもんせいかい！' : '仕上げクリア！すごい！'}</h2>

      <div class="go-score-block">
        <div class="go-rank">${rank}</div>
        <div class="go-score">${masterScore} <span class="go-score-unit">てん</span></div>
        <div class="go-detail">
          せいかい ${masterCorrect}もん　まちがい ${masterMiss}もん<br>
          せいかいりつ ${accuracy}%　さいこうコンボ ${masterMaxCombo}
        </div>
      </div>

      <div class="master-cat-summary">
        ${masterCategories.map(cat => `
          <span class="master-cat-chip done">✅ ${cat}</span>
        `).join('')}
      </div>

      ${newBadges.length ? `
        <div class="new-badges">
          <p class="new-badge-label">🎉 あたらしい バッジ！</p>
          ${newBadges.map(b => `<div class="badge-item new">${b.icon} ${b.name}</div>`).join('')}
        </div>` : ''}
      ${badgeList.length ? `
        <div class="all-badges">
          <p class="badge-section-label">もっているバッジ</p>
          <div class="badge-grid">${badgeList.map(b =>
            `<span class="badge-chip" title="${b.name}">${b.icon}</span>`).join('')}
          </div>
        </div>` : ''}

      <div class="complete-btns">
        <button class="action-btn primary"   onclick="startMasterMode()">🏁 もう一度　仕上げモード</button>
        <button class="action-btn secondary" onclick="renderBadgePage()">🏅 バッジをみる</button>
        <button class="action-btn ghost"     onclick="renderMenu()">メニューへもどる</button>
      </div>
    </div>
  `;

  setTimeout(launchFireworks, 100);
  if (newBadges.length) setTimeout(() => showBadgeNotification(newBadges), 800);
}
