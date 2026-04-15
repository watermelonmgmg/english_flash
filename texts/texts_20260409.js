window.TEXTS = window.TEXTS || [];
TEXTS.push[{
    id: 2,
    title: "Laura's Pet",
    track: 54,
    sentences: [
      "Laura has a big dog.",
      "His name is Snoopy.",
      "Laura walks him every day.",
      "They sometimes sleep together."
    ],
    japanese: "ローラは大きな犬を飼っています。名前はスヌーピーです。ローラは毎日その犬を散歩させます。ときどき一緒に寝ます。",

    words: {
      "has": "持っている／飼っている",
      "big": "大きい",
      "dog": "犬",
      "name": "名前",
      "walks": "散歩させる",
      "every": "毎〜",
      "day": "日",
      "sometimes": "ときどき",
      "sleep": "眠る",
      "together": "一緒に"
    },

    blanks: [
      {
        sentence: "Laura has a big ____.",
        answer: "dog",
        choices: ["dog", "cat", "bird", "fish"],
        hint: "ローラは大きな＿＿＿を飼っています。"
      },
      {
        sentence: "His name is ____.",
        answer: "Snoopy",
        choices: ["Snoopy", "Lucky", "Mike", "John"],
        hint: "彼の名前は＿＿＿です。"
      },
      {
        sentence: "Laura walks him every ____.",
        answer: "day",
        choices: ["day", "week", "month", "year"],
        hint: "ローラは毎＿＿＿散歩させます。"
      }
    ],

    questions: [
      {
        question: "ローラは何を飼っていますか？",
        choices: ["犬", "猫", "鳥", "魚"],
        answer: "犬"
      },
      {
        question: "犬の名前は何ですか？",
        choices: ["スヌーピー", "ラッキー", "マイク", "ジョン"],
        answer: "スヌーピー"
      },
      {
        question: "ローラは犬と何をしますか？",
        choices: ["毎日散歩する", "料理する", "学校に行く", "買い物する"],
        answer: "毎日散歩する"
      }
    ]
  }
];
