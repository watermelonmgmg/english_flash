// 長文データ
// texts/ フォルダに置く
// id は 1〜（長文ごとに連番）

window.TEXTS = window.TEXTS || [];
TEXTS.push[{
    id: 1,
    title: "Mark's Best Friend",
    track: 53,
    sentences: [
      "Mark and Sam are good friends.",
      "They go to school together and play soccer after school.",
      "Mark likes Sam very much."
    ],
    japanese: "マークとサムはよい友達です。彼らは学校に一緒に行き、放課後はサッカーをします。マークはサムがとても好きです。",

    // 単語の意味（タップで確認用）
    words: {
      "friends":   "友達",
      "school":    "学校",
      "together":  "一緒に",
      "play":      "する・遊ぶ",
      "soccer":    "サッカー",
      "after":     "〜のあとに",
      "likes":     "好きです",
      "much":      "とても",
      "good":      "よい",
      "go":        "行く",
    },

    // 穴埋め問題
    blanks: [
      {
        sentence: "Mark and Sam are good _____.",
        answer: "friends",
        choices: ["friends", "teachers", "brothers", "students"],
        hint: "マークとサムはよい＿＿＿です。"
      },
      {
        sentence: "They go to _____ together.",
        answer: "school",
        choices: ["school", "park", "shop", "home"],
        hint: "彼らは一緒に＿＿＿に行きます。"
      },
      {
        sentence: "They play _____ after school.",
        answer: "soccer",
        choices: ["soccer", "tennis", "baseball", "basketball"],
        hint: "放課後に＿＿＿をします。"
      },
    ],

    // 内容理解問題（日本語で答える）
    questions: [
      {
        question: "マークとサムはどこへ一緒に行きますか？",
        choices: ["学校", "公園", "お店", "図書館"],
        answer: "学校"
      },
      {
        question: "放課後に何をしますか？",
        choices: ["野球", "テニス", "サッカー", "バスケット"],
        answer: "サッカー"
      },
      {
        question: "マークはサムのことをどう思っていますか？",
        choices: ["とても好き", "きらい", "よく知らない", "こわい"],
        answer: "とても好き"
      },
    ]
  },
];
