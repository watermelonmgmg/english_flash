// =====================================================
//  WordQuest — ui_menu.js
//  メニュー画面・バッジ/称号ページ・ペットページ
// =====================================================

// ===============================
//  メニュー
// ===============================
function renderMenu() {
  currentMode = 'menu';
  const cats = getCategories();
  const catOptions =
    `<option value="all">すべて (${allWords.length}語)</option>` +
    cats.map(c =>
      `<option value="${c}" ${selectedCategory === c ? 'selected' : ''}>${c} (${allWords.filter(w => w.category === c).length}語)</option>`
    ).join('');

  document.getElementById('app').innerHTML = `
    <div class="menu-screen">
      <div class="logo-area">
        <div class="logo-icon">📖</div>
        <h1 class="logo-title">WordQuest</h1>
        <p class="logo-sub">えいごたんごを　おぼえよう！</p>
      </div>
      ${renderPetWidget()}
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
        ${typeof TEXTS !== 'undefined' && TEXTS.length > 0 ? `
        <button class="mode-card reading-card" onclick="renderReadingList()" style="grid-column:1/-1;">
          <div class="mode-icon">📖</div>
          <div class="mode-name">リーディングモード</div>
          <div class="mode-desc">ぶんしょうを よんで　もんだいに こたえよう</div>
        </button>` : ''}
      </div>
      <div class="word-count-badge">${filteredWords.length}語 学習できます</div>
      ${(() => {
        const title      = getCurrentTitle();
        const earnedCount = loadBadges().length;
        const next       = getNextTitle();
        return `
          <button class="badge-menu-btn" onclick="renderBadgePage()">
            <span class="badge-menu-left">
              ${title
                ? `<span class="current-title-icon">${title.icon}</span><span class="current-title-text">${title.title}</span>`
                : `<span class="current-title-text">バッジを あつめよう！</span>`}
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
//  バッジ・称号ページ
// ===============================
function renderBadgePage() {
  const earned = loadBadges();
  const stats  = loadStats();
  const title  = getCurrentTitle();
  const next   = getNextTitle();

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
          <div class="next-title-progress-bar" style="width:${Math.min(earned.length / next.need * 100, 100).toFixed(0)}%"></div>
        </div>
      </div>` : `
      <div class="next-title-bar complete">🎉 すべての しょうごうを かいほう！！</div>`}
      <h3 class="section-title">しょうごう ロードマップ</h3>
      <div class="title-roadmap">${titleRoadmap}</div>
      <h3 class="section-title">バッジ いちらん <span class="badge-count-text">${earned.length}/${BADGE_DEFS.length}</span></h3>
      <div class="badge-cards-grid">${badgeGrid}</div>
      <h3 class="section-title">きろく</h3>
      <div class="stats-grid">
        <div class="stat-item"><span class="stat-val">${stats.totalCorrect  || 0}</span><span class="stat-label">せいかい</span></div>
        <div class="stat-item"><span class="stat-val">${stats.totalGames    || 0}</span><span class="stat-label">プレイ回数</span></div>
        <div class="stat-item"><span class="stat-val">${stats.maxComboEver || 0}</span><span class="stat-label">さいこうコンボ</span></div>
        <div class="stat-item"><span class="stat-val">${stats.perfectClears|| 0}</span><span class="stat-label">ぜんもんせいかい</span></div>
      </div>
      <button class="action-btn ghost" style="width:100%;margin-top:8px;" onclick="renderMenu()">メニューへもどる</button>
    </div>
  `;
}

// ===============================
//  ペットページ
// ===============================
function renderPetWidget() {
  const stats   = loadStats();
  const total   = stats.totalCorrect || 0;
  const stage   = getPetStage(total);
  const next    = getNextPetStage(total);
  const pet     = loadPet();
  const petName = pet.name || stage.name;
  const pct     = next
    ? Math.min((total - stage.need) / (next.need - stage.need) * 100, 100).toFixed(0)
    : 100;

  return `
    <div class="pet-widget" onclick="renderPetPage()">
      <div class="pet-emoji-wrap"><span class="pet-emoji">${stage.emoji}</span></div>
      <div class="pet-info">
        <div class="pet-name-row">
          <span class="pet-name">${petName}</span>
          <span class="pet-stage-label">${stage.name}</span>
        </div>
        <div class="pet-progress-wrap">
          <div class="pet-progress-bar" style="width:${pct}%"></div>
        </div>
        <span class="pet-next-label">
          ${next ? `あと ${next.need - total}もん で しんか！` : '✨ さいこうレベル！'}
        </span>
      </div>
    </div>
  `;
}

function renderPetPage() {
  const stats   = loadStats();
  const total   = stats.totalCorrect || 0;
  const stage   = getPetStage(total);
  const next    = getNextPetStage(total);
  const pet     = loadPet();
  const petName = pet.name || stage.name;

  const stagesHTML = PET_STAGES.map(s => {
    const unlocked  = total >= s.need;
    const isCurrent = getPetStage(total).need === s.need;
    return `
      <div class="pet-stage-row ${unlocked ? 'unlocked' : 'locked'} ${isCurrent ? 'current' : ''}">
        <span class="pet-stage-emoji">${unlocked ? s.emoji : '❓'}</span>
        <div class="pet-stage-info">
          <span class="pet-stage-name">${unlocked ? s.name : '？？？'}</span>
          <span class="pet-stage-cond">${s.need}もん せいかいで かいほう</span>
          ${isCurrent ? `<span class="pet-stage-msg">${s.msg}</span>` : ''}
        </div>
        ${isCurrent ? '<span class="pet-current-mark">👈 いまここ</span>' : ''}
        ${unlocked && !isCurrent ? '<span class="pet-cleared-mark">✅</span>' : ''}
      </div>`;
  }).join('');

  document.getElementById('app').innerHTML = `
    <div class="badge-page">
      <div class="badge-page-header">
        <button class="back-btn" onclick="renderMenu()">← もどる</button>
        <h2 class="badge-page-title">🥚 そだてっこ</h2>
      </div>
      <div class="pet-big-card">
        <div class="pet-big-emoji">${stage.emoji}</div>
        <div class="pet-big-info">
          <p class="pet-big-name">${petName}</p>
          <p class="pet-big-stage">${stage.name}</p>
          <p class="pet-big-msg">${stage.msg}</p>
        </div>
      </div>
      <div class="pet-name-edit">
        <input id="petNameInput" class="typing-input" type="text"
          placeholder="なまえをつけてね"
          value="${pet.name || ''}"
          maxlength="10"
          autocomplete="off" spellcheck="false" />
        <button class="typing-submit-btn"
          onclick="setPetName(document.getElementById('petNameInput').value.trim() || '${stage.name}')">
          きめる
        </button>
      </div>
      ${next ? `
      <div class="next-title-bar">
        <span>つぎのすがた「${next.emoji} ${next.name}」まで</span>
        <span class="next-need">あと <b>${next.need - total}</b> もん</span>
        <div class="next-title-progress-wrap">
          <div class="next-title-progress-bar" style="width:${Math.min((total - stage.need) / (next.need - stage.need) * 100, 100).toFixed(0)}%"></div>
        </div>
      </div>` : `
      <div class="next-title-bar complete">✨ さいこうのすがたに なったよ！！</div>`}
      <h3 class="section-title">せいちょう ロードマップ</h3>
      <div class="title-roadmap">${stagesHTML}</div>
      <button class="action-btn ghost" style="width:100%;margin-top:8px;" onclick="renderMenu()">メニューへもどる</button>
    </div>
  `;
}
