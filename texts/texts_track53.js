window.TEXTS = window.TEXTS || [];

TEXTS.push({
  id: 1,
  title: "Mark's Best Friend",
  track: 53,
  sentences: [
    "Mark and Sam are good friends.",
    "They go to school together and play soccer after school.",
    "Mark likes Sam very much."
  ],
  japanese: "マークとサムはよい友達です。彼らは学校に一緒に行き、放課後はサッカーをします。マークはサムがとても好きです。",

  words: {
    "friends": "友達",
    "school": "学校",
    "together": "一緒に",
    "play": "する・遊ぶ",
    "soccer": "サッカー",
    "after": "〜のあとに",
    "likes": "好きです",
    "much": "とても",
    "good": "よい",
    "go": "行く",
  },

  blanks: [
    {
      sentence: "Mark and Sam are good _____.",
      answer: "friends",
      choices: ["friends", "teachers", "brothers", "students"],
      hint: "マークとサムはよい＿＿＿です。"
    }
  ],

  questions: [
    {
      question: "マークとサムはどこへ一緒に行きますか？",
      choices: ["学校", "公園", "お店", "図書館"],
      answer: "学校"
    }
  ]
});
