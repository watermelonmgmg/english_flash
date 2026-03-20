// 英検5級 重要単語 - 形容詞・副詞・前置詞
// (画像より No.1〜20)

const WORDS_ADJECTIVES = [
  { id: 1,  english: "new",       kanji: "新しい",         hiragana: "あたらしい",      category: "adjectives", emoji: "✨" },
  { id: 2,  english: "old",       kanji: "古い",           hiragana: "ふるい",          category: "adjectives", emoji: "🏚️" },
  { id: 3,  english: "big",       kanji: "大きい",         hiragana: "おおきい",        category: "adjectives", emoji: "🔵" },
  { id: 4,  english: "large",     kanji: "大きい・広い",   hiragana: "おおきい・ひろい",category: "adjectives", emoji: "📐" },
  { id: 5,  english: "small",     kanji: "小さい",         hiragana: "ちいさい",        category: "adjectives", emoji: "🔹" },
  { id: 6,  english: "fast",      kanji: "速い",           hiragana: "はやい",          category: "adjectives", emoji: "⚡" },
  { id: 7,  english: "early",     kanji: "早い",           hiragana: "はやい",          category: "adjectives", emoji: "🌅" },
  { id: 8,  english: "slow",      kanji: "遅い",           hiragana: "おそい",          category: "adjectives", emoji: "🐢" },
  { id: 9,  english: "long",      kanji: "長い",           hiragana: "ながい",          category: "adjectives", emoji: "📏" },
  { id: 10, english: "short",     kanji: "短い",           hiragana: "みじかい",        category: "adjectives", emoji: "📐" },
  { id: 11, english: "happy",     kanji: "うれしい",       hiragana: "うれしい",        category: "adjectives", emoji: "😊" },
  { id: 12, english: "sad",       kanji: "悲しい",         hiragana: "かなしい",        category: "adjectives", emoji: "😢" },
  { id: 13, english: "angry",     kanji: "怒った",         hiragana: "おこった",        category: "adjectives", emoji: "😠" },
  { id: 14, english: "tired",     kanji: "疲れた",         hiragana: "つかれた",        category: "adjectives", emoji: "😴" },
  { id: 15, english: "good",      kanji: "よい",           hiragana: "よい",            category: "adjectives", emoji: "👍" },
  { id: 16, english: "nice",      kanji: "すてきな",       hiragana: "すてきな",        category: "adjectives", emoji: "🌟" },
  { id: 17, english: "bad",       kanji: "悪い",           hiragana: "わるい",          category: "adjectives", emoji: "👎" },
  { id: 18, english: "many",      kanji: "たくさんの（数）",hiragana: "たくさんの",      category: "adjectives", emoji: "🔢" },
  { id: 19, english: "much",      kanji: "たくさんの（量）",hiragana: "たくさんの",      category: "adjectives", emoji: "⚖️" },
  { id: 20, english: "beautiful", kanji: "美しい",         hiragana: "うつくしい",      category: "adjectives", emoji: "🌸" },
];