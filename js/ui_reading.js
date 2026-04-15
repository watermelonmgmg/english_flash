// =====================================================
//  WordQuest — ui_reading.js
//  リーディングモード（長文・リピート・穴埋め・内容問題）
// =====================================================

function renderReadingList() {
  const items = TEXTS.map(t => `
    <button class="reading-item" onclick="startReading(${t.id})">
      <div class="reading-item-left">
        <span class="reading-track">TRACK ${t.track}</span>
        <span class="reading-title">${t.title}</span>
      </div>
      <span class="reading-arrow">▶</span>
    </button>
  `).join('');
  document.getElementById('app').innerHTML = `
    <div class="menu-screen">
      <div class="study-header">
        <button class="back-btn" onclick="renderMenu()">← もどる</button>
        <h2 style="font-size:1.1rem;font-weight:900;">📖 リーディング</h2>
      </div>
      <div class="reading-list">${items}</div>
    </div>
  `;
}

function startReading(textId) {
  readingText  = TEXTS.find(t => t.id === textId);
  if (!readingText) return;
  readingPhase = 'read';
  renderReadingPage();
}

function renderReadingPage() {
  const t = readingText;
  const sentencesHTML = t.sentences.map(s => {
    const wordSpans = s.split(/(\s+|(?=[.,!?])|(?<=[.,!?]))/).filter(Boolean).map(w => {
      const clean   = w.replace(/[.,!?]/g, '').toLowerCase();
      const meaning = t.words[clean];
      return meaning
        ? `<span class="tappable-word" onclick="showWordPop('${clean}','${meaning}')">${w}</span>`
        : `<span>${w}</span>`;
    }).join('');
    return `
      <div class="reading-sentence">
        <button class="sentence-speak-btn"
          data-text='${s}'
          onclick="speak(this.dataset.text)">🔊</button>
        <p class="sentence-text">${wordSpans}</p>
      </div>`;
  }).join('');

  document.getElementById('app').innerHTML = `
    <div class="reading-screen">
      <div class="study-header">
        <button class="back-btn" onclick="renderReadingList()">← もどる</button>
        <span class="reading-track-badge">TRACK ${t.track}</span>
      </div>
      <div class="reading-content-card">
        <h2 class="reading-content-title">${t.title}</h2>
        <div class="reading-sentences">${sentencesHTML}</div>
        <button class="speak-all-btn" onclick="speakAll()">🔊 ぜんぶ きく</button>
      </div>
      <div class="reading-jp-card" id="jpCard">
        <button class="jp-toggle-btn" onclick="toggleJp()">👁️ にほんごやくを みる</button>
        <p class="reading-jp-text" id="jpText" style="display:none;">${t.japanese}</p>
      </div>
      <div id="wordPopup" class="word-popup" style="display:none;"></div>
    </div>
  `;
}

function showWordPop(word, meaning) {
  const popup = document.getElementById('wordPopup');
  if (!popup) return;
  popup.innerHTML = `<b>${word}</b> = ${meaning}`;
  popup.style.display = 'block';
  speak(word);
  clearTimeout(popup._timer);
  popup._timer = setTimeout(() => { popup.style.display = 'none'; }, 2000);
}

function toggleJp() {
  const txt = document.getElementById('jpText');
  const btn = document.querySelector('.jp-toggle-btn');
  if (!txt) return;
  const showing     = txt.style.display !== 'none';
  txt.style.display = showing ? 'none' : 'block';
  btn.textContent   = showing ? '👁️ にほんごやくを みる' : '🙈 にほんごやくを かくす';
}

function speakAll() {
  if (!readingText) return;
  speak(readingText.sentences.join(' '), 0.8);
}

// ===== リピート =====
function startRepeat() {
  repeatIndex = 0; repeatDoneCount = 0;
  renderRepeatStep();
}

function renderRepeatStep() {
  const t = readingText;
  if (repeatIndex >= t.sentences.length) { renderRepeatComplete(); return; }
  const s   = t.sentences[repeatIndex];
  const pct = (repeatIndex / t.sentences.length * 100).toFixed(0);
  const wordSpans = s.split(/(\s+|(?=[.,!?])|(?<=[.,!?]))/).filter(Boolean).map(w => {
    const clean = w.replace(/[.,!?]/g, '').toLowerCase();
    const meaning = t.words[clean];
    return meaning
      ? `<span class="tappable-word" onclick="showWordPop('${clean}','${meaning}')">${w}</span>`
      : `<span>${w}</span>`;
  }).join('');
  document.getElementById('app').innerHTML = `
    <div class="repeat-screen">
      <div class="study-header">
        <button class="back-btn" onclick="renderReadingPage()">← もどる</button>
        <div class="study-progress-wrap"><div class="study-progress-bar" style="width:${pct}%"></div></div>
        <span class="study-counter">${repeatIndex + 1} / ${t.sentences.length}</span>
      </div>
      <div class="repeat-card">
        <p class="repeat-step-label">🎤 きいて　まねしてみよう</p>
        <div class="repeat-sentence-box"><p class="repeat-sentence-text">${wordSpans}</p></div>
        <button class="repeat-listen-btn" id="listenBtn" onclick="doListen()">🔊 きく</button>
        <div class="repeat-mic-area">
          <div class="repeat-mic-icon">🎤</div>
          <p class="repeat-mic-label">↑ まねして　よんでみよう！</p>
        </div>
      </div>
      <div class="repeat-judge-btns">
        <p class="repeat-judge-label">よめたかな？</p>
        <div class="repeat-judge-grid">
          <button class="repeat-ng-btn" onclick="repeatJudge(false)">😢 もう一度</button>
          <button class="repeat-ok-btn" onclick="repeatJudge(true)">😊 よめた！</button>
        </div>
      </div>
      <div id="wordPopup" class="word-popup" style="display:none;"></div>
    </div>
  `;
  setTimeout(() => doListen(), 400);
}

function doListen() {
  const s   = readingText.sentences[repeatIndex];
  const btn = document.getElementById('listenBtn');
  if (btn) { btn.textContent = '🔊 きいてね…'; btn.disabled = true; }
  speak(s, 0.75);
  setTimeout(() => { if (btn) { btn.textContent = '🔊 もう一度きく'; btn.disabled = false; } },
    Math.max(1500, s.length * 80));
}

function repeatJudge(ok) {
  if (ok) repeatDoneCount++;
  if (!ok) {
    const box = document.querySelector('.repeat-sentence-box');
    if (box) { box.style.borderColor = 'var(--red)'; setTimeout(() => { box.style.borderColor = ''; }, 500); }
    setTimeout(() => doListen(), 300);
    return;
  }
  const box = document.querySelector('.repeat-sentence-box');
  if (box) { box.style.borderColor = 'var(--accent)'; box.style.background = 'rgba(88,204,2,.1)'; }
  repeatIndex++;
  setTimeout(renderRepeatStep, 700);
}

function renderRepeatComplete() {
  const total = readingText.sentences.length;
  const perfect = repeatDoneCount === total;
  document.getElementById('app').innerHTML = `
    <div class="gameover-screen">
      ${perfect ? '<canvas id="fireworksCanvas" style="position:fixed;inset:0;pointer-events:none;z-index:50;width:100%;height:100%;"></canvas>' : ''}
      <div class="go-icon">${perfect ? '🎊' : '😊'}</div>
      <h2 class="go-title">${perfect ? 'ぜんぶ よめた！！' : 'よくがんばった！'}</h2>
      <div class="go-score-block">
        <div class="go-score">${repeatDoneCount}<span class="go-score-unit"> / ${total}</span></div>
        <div class="go-detail">${total}ぶん中 ${repeatDoneCount}ぶん よめたよ！</div>
      </div>
      <div class="complete-btns">
        <button class="action-btn primary"   onclick="startRepeat()">🎤 もう一度リピート</button>
        <button class="action-btn secondary" onclick="startBlanks()">✍️ あなうめもんだいへ</button>
        <button class="action-btn ghost"     onclick="renderReadingPage()">ぶんしょうに もどる</button>
      </div>
    </div>
  `;
  if (perfect) setTimeout(launchFireworks, 100);
}

// ===== 穴埋め =====
function startBlanks() {
  readingIndex = 0; readingScore = 0; readingPhase = 'blank';
  renderBlankQuestion();
}

function renderBlankQuestion() {
  const blanks = readingText.blanks;
  if (readingIndex >= blanks.length) { renderReadingResult('blank'); return; }
  const q   = blanks[readingIndex];
  const pct = (readingIndex / blanks.length * 100).toFixed(0);
  const displaySentence = q.sentence.replace('_____',
    '<span style="border-bottom:3px solid var(--blue);padding:0 16px;margin:0 4px;">　　　</span>');
  document.getElementById('app').innerHTML = `
    <div class="game-screen">
      <div class="game-header">
        <button class="back-btn" onclick="renderReadingPage()">← もどる</button>
        <div class="game-progress-wrap"><div class="game-progress-bar" style="width:${pct}%"></div></div>
        <span class="game-counter">${readingIndex + 1}/${blanks.length}</span>
      </div>
      <div class="question-area">
        <p class="question-label">✍️ あなうめ もんだい</p>
        <p class="blank-sentence">${displaySentence}</p>
        <p class="blank-hint">${q.hint}</p>
      </div>
      <p class="choice-label">ことばを　えらんでね</p>
      <div class="choices-grid">
        ${q.choices.map(c => `<button class="choice-btn" data-word="${c}" onclick="checkBlank('${c}',this)"><span class="choice-text">${c}</span></button>`).join('')}
      </div>
    </div>
  `;
}

function checkBlank(chosen, btn) {
  const q = readingText.blanks[readingIndex];
  const isCorrect = chosen === q.answer;
  document.querySelectorAll('.choice-btn').forEach(b => { b.disabled = true; if (b.dataset.word === q.answer) b.classList.add('correct'); });
  if (isCorrect) { readingScore++; speak(chosen); showFeedback(true, `せいかい！「${chosen}」🎉`); }
  else { btn.classList.add('wrong'); speak(q.answer, 0.75); showFeedback(false, `こたえは「${q.answer}」だよ！`); }
  readingIndex++;
  setTimeout(renderBlankQuestion, 1300);
}

// ===== 内容理解 =====
function startQuestions() {
  readingIndex = 0; readingScore = 0; readingPhase = 'question';
  renderContentQuestion();
}

function renderContentQuestion() {
  const qs = readingText.questions;
  if (readingIndex >= qs.length) { renderReadingResult('question'); return; }
  const q   = qs[readingIndex];
  const pct = (readingIndex / qs.length * 100).toFixed(0);
  document.getElementById('app').innerHTML = `
    <div class="game-screen">
      <div class="game-header">
        <button class="back-btn" onclick="renderReadingPage()">← もどる</button>
        <div class="game-progress-wrap"><div class="game-progress-bar" style="width:${pct}%"></div></div>
        <span class="game-counter">${readingIndex + 1}/${qs.length}</span>
      </div>
      <div class="question-area">
        <p class="question-label">❓ ないよう もんだい</p>
        <p class="content-question">${q.question}</p>
        <button class="sound-btn" onclick="renderReadingPage()">📖 ぶんしょうを みる</button>
      </div>
      <p class="choice-label">こたえを　えらんでね</p>
      <div class="choices-grid">
        ${q.choices.map(c => `<button class="choice-btn" data-ans="${c}" onclick="checkContentQ('${c}',this)"><span class="choice-text">${c}</span></button>`).join('')}
      </div>
    </div>
  `;
}

function checkContentQ(chosen, btn) {
  const q = readingText.questions[readingIndex];
  const isCorrect = chosen === q.answer;
  document.querySelectorAll('.choice-btn').forEach(b => { b.disabled = true; if (b.dataset.ans === q.answer) b.classList.add('correct'); });
  if (isCorrect) { readingScore++; showFeedback(true, `せいかい！🎉`); }
  else { btn.classList.add('wrong'); showFeedback(false, `こたえは「${q.answer}」だよ！`); }
  readingIndex++;
  setTimeout(renderContentQuestion, 1300);
}

// ===== 結果 =====
function renderReadingResult(phase) {
  const total   = phase === 'blank' ? readingText.blanks.length : readingText.questions.length;
  const perfect = readingScore === total;
  document.getElementById('app').innerHTML = `
    <div class="gameover-screen">
      ${perfect ? '<canvas id="fireworksCanvas" style="position:fixed;inset:0;pointer-events:none;z-index:50;width:100%;height:100%;"></canvas>' : ''}
      <div class="go-icon">${perfect ? '🎊' : readingScore >= total * 0.6 ? '😊' : '😢'}</div>
      <h2 class="go-title">${perfect ? 'ぜんもん せいかい！' : 'おわったよ！'}</h2>
      <div class="go-score-block">
        <div class="go-score">${readingScore}<span class="go-score-unit"> / ${total}</span></div>
        <div class="go-detail">${total}もん中 ${readingScore}せいかい</div>
      </div>
      <div class="complete-btns">
        <button class="action-btn primary"   onclick="${phase === 'blank' ? 'startBlanks' : 'startQuestions'}()">もう一度</button>
        <button class="action-btn secondary" onclick="renderReadingPage()">ぶんしょうに もどる</button>
        <button class="action-btn ghost"     onclick="renderMenu()">メニューへ</button>
      </div>
    </div>
  `;
  if (perfect) setTimeout(launchFireworks, 100);
}
