// =====================================================
//  WordQuest — ui_study.js
//  暗記モード（フラッシュカード）のUI
//  依存: game.js のグローバル変数
//        gameQueue / studyIndex / studyFlipped / filteredWords / selectedCategory / currentMode
// =====================================================

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
  const word  = gameQueue[studyIndex];
  const total = gameQueue.length;
  const pct   = ((studyIndex + 1) / total * 100).toFixed(0);

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
        <div class="flash-card ${studyFlipped ? 'flipped' : ''}" onclick="flipCard()">
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
        <button class="nav-btn prev-btn" onclick="prevCard()" ${studyIndex === 0 ? 'disabled' : ''}>◀ まえ</button>
        <button class="nav-btn next-btn" onclick="nextCard()">${studyIndex === total - 1 ? '🏁 おわり' : 'つぎ ▶'}</button>
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
