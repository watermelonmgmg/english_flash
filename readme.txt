# WordQuest - 英単語学習アプリ

## ファイル構成

```
project/
├── index.html          ← ブラウザで開くファイル（スタイルも含む）
├── game.js             ← ゲームロジック全体
├── words_adjectives.js ← 単語データ：形容詞・副詞（No.1〜20）
└── README.md           ← このファイル
```

---

## 単語ファイルを追加する手順（3ステップ）

### Step 1｜単語ファイルを作る

ファイル名は `words_〇〇.js` の形式で統一する。

```js
// 例: words_verbs.js
const WORDS_VERBS = [
  { id: 101, english: "run",  kanji: "走る",  hiragana: "はしる", category: "verbs", emoji: "🏃" },
  { id: 102, english: "eat",  kanji: "食べる", hiragana: "たべる", category: "verbs", emoji: "😋" },
  // ...
];
```

#### ⚠️ id のルール（重複厳禁）
ゲームの正誤判定に id を使っているため、ファイルをまたいで重複しないようにする。

| ファイル              | id の範囲   |
|-----------------------|-------------|
| words_adjectives.js   | 1 〜 100    |
| words_nouns.js        | 101 〜 200  |
| words_verbs.js        | 201 〜 300  |
| words_phrases.js      | 301 〜 400  |
| （以降100刻みで追加） |             |

---

### Step 2｜`index.html` に読み込みを追加する

`game.js` より**前**に `<script>` タグを追加する。

```html
<!-- 単語ファイル（game.js より前に書く） -->
<script src="words_adjectives.js"></script>
<script src="words_verbs.js"></script>  ← 追加
<script src="words_nouns.js"></script>  ← 追加

<script src="game.js"></script>
```

---

### Step 3｜`game.js` の `init()` に配列を追加する

```js
function init() {
  allWords = [
    ...WORDS_ADJECTIVES,
    ...WORDS_VERBS,   // ← 追加
    ...WORDS_NOUNS,   // ← 追加
  ];
  filteredWords = [...allWords];
  renderMenu();
}
```

---

## 単語データのフォーマット

| キー       | 内容               | 例             |
|------------|--------------------|----------------|
| id         | 一意の番号（重複不可）| 1              |
| english    | 英語               | "happy"        |
| kanji      | 日本語（漢字・かな）| "うれしい"     |
| hiragana   | ひらがな読み       | "うれしい"     |
| category   | カテゴリ名         | "adjectives"   |
| emoji      | 絵文字             | "😊"           |

> `kanji` キーは漢字がない言葉でもそのまま日本語を入れる（例: `kanji: "うれしい"`）

---

## 現在の単語ファイル一覧

| ファイル              | 定数名            | 内容              | id範囲  | 語数 |
|-----------------------|-------------------|-------------------|---------|------|
| words_adjectives.js   | WORDS_ADJECTIVES  | 形容詞・副詞      | 1〜20   | 20語 |

---

## ゲームの仕様メモ

- **あんきモード**：カードをタップして表裏をめくる。英語をタップで音声再生。
- **ゲームモード**：4択クイズ。❤️3つ、10問制。正解+10点。
- **音声**：Web Speech API（`en-US`）。問題表示時に自動読み上げ、🔊ボタンで再生。
- **カテゴリフィルター**：メニューのセレクトボックスで絞り込み可能。