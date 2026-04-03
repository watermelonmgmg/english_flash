// =====================================================
//  WordQuest — main.js
//  ・グローバル状態変数
//  ・init() エントリーポイント
//  ・共通ユーティリティ（shuffle, speak, launchFireworks）
//  ・共通UI通知（showFeedback, showCombo, showBadgeNotification,
//               showEvolutionNotification）
//  読み込み順: 最後に読み込む
// =====================================================

// ===============================
//  グローバル状態変数
// ===============================
let allWords      = [];
let filteredWords = [];
let currentMode   = 'menu';
let selectedCategory = 'all';

// 暗記モード
let studyIndex   = 0;
let studyFlipped = false;

// ゲーム共通
let gameQueue       = [];
let currentQuestion = null;
let score           = 0;
let lives           = 3;
let totalQuestions  = 0;
let answeredCount   = 0;
let combo           = 0;
let maxCombo        = 0;
let gameDirection   = 'normal';

// リーディングモード
let readingText  = null;
let readingPhase = 'read';
let readingScore = 0;
let readingIndex = 0;

// リピートモード
let repeatIndex     = 0;
let repeatDoneCount = 0;

// ゲーム設定定数
const TOTAL_Q  = 10;
const MAX_LIVES = 3;

// ===============================
//  初期化
// ===============================
function init() {
  allWords = [
    ...WORDS_ADJECTIVES,
    ...spring_word_verb02,
    ...(typeof WORDS_PLACES  !== 'undefined' ? WORDS_PLACES  : []),
    ...(typeof WORDS_SPORTS  !== 'undefined' ? WORDS_SPORTS  : []),
    ...(typeof WORDS_WEATHER !== 'undefined' ? WORDS_WEATHER : []),
  ];
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
//  音声読み上げ
// ===============================
function speak(text, rate = 0.65) {
  if (!window.speechSynthesis) return;
  speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang  = 'en-US';
  utter.rate  = rate;
  utter.pitch = 1.1;
  const voices  = speechSynthesis.getVoices();
  const enVoice = voices.find(v => v.lang.startsWith('en'));
  if (enVoice) utter.voice = enVoice;
  speechSynthesis.speak(utter);
}

if (window.speechSynthesis) {
  speechSynthesis.getVoices();
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

// ===============================
//  共通UI通知
// ===============================
function showFeedback(ok, msg) {
  document.querySelectorAll('.feedback-toast').forEach(e => e.remove());
  const fb = document.createElement('div');
  fb.className = `feedback-toast ${ok ? 'fb-correct' : 'fb-wrong'}`;
  fb.textContent = msg;
  document.getElementById('app').appendChild(fb);
  setTimeout(() => fb.remove(), 1300);
}

function showCombo(n) {
  document.querySelectorAll('.combo-toast').forEach(e => e.remove());
  if (n < 3) return;
  const el = document.createElement('div');
  el.className = 'combo-toast';
  const labels = { 3: '🔥 3コンボ！', 4: '🔥🔥 4コンボ！', 5: '🌈 5コンボ！！' };
  el.textContent = labels[n] || `⚡ ${n}コンボ！！！`;
  document.getElementById('app').appendChild(el);
  setTimeout(() => el.remove(), 1000);
}

function showBadgeNotification(badges) {
  badges.forEach((badge, i) => {
    setTimeout(() => {
      const el = document.createElement('div');
      el.className = 'badge-toast';
      el.innerHTML = `<span class="badge-toast-icon">${badge.icon}</span><span>バッジゲット！<br><b>${badge.name}</b></span>`;
      document.getElementById('app').appendChild(el);
      setTimeout(() => el.remove(), 2500);
    }, i * 600);
  });
}

function showEvolutionNotification(stage) {
  const el = document.createElement('div');
  el.className = 'evolution-toast';
  el.innerHTML = `
    <div class="evo-emoji">${stage.emoji}</div>
    <div class="evo-text"><b>しんか！</b><br>「${stage.name}」に なったよ！</div>
  `;
  document.getElementById('app').appendChild(el);
  setTimeout(() => el.remove(), 3000);
}

// ===============================
//  花火アニメーション
// ===============================
function launchFireworks() {
  const canvas = document.getElementById('fireworksCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;

  const particles = [];
  const colors = ['#58cc02','#ffc800','#1cb0f6','#ff4b4b','#ce82ff','#ff9f43','#ffffff'];

  function createBurst(x, y) {
    for (let i = 0; i < 60; i++) {
      const angle = (Math.PI * 2 / 60) * i;
      const speed = 3 + Math.random() * 5;
      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        size:  4 + Math.random() * 4,
        decay: 0.015 + Math.random() * 0.01,
      });
    }
  }

  const positions = [
    [canvas.width * 0.25, canvas.height * 0.3 ],
    [canvas.width * 0.75, canvas.height * 0.25],
    [canvas.width * 0.5,  canvas.height * 0.4 ],
    [canvas.width * 0.2,  canvas.height * 0.5 ],
    [canvas.width * 0.8,  canvas.height * 0.45],
  ];
  positions.forEach(([x, y], i) => setTimeout(() => createBurst(x, y), i * 250));

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x  += p.vx;
      p.y  += p.vy;
      p.vy += 0.12;
      p.vx *= 0.98;
      p.alpha -= p.decay;
      if (p.alpha <= 0) { particles.splice(i, 1); continue; }
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle   = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    if (particles.length > 0) requestAnimationFrame(animate);
    else ctx.clearRect(0, 0, canvas.width, canvas.height);
  }
  animate();
}

// ===============================
//  ユーティリティ
// ===============================
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ===============================
//  エントリーポイント
// ===============================
window.addEventListener('DOMContentLoaded', init);
