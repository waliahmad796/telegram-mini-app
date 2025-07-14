const questionSets = [
  {
    id: 1,
    level: "Easy",
    questions: [
      {
        text: "What is the capital of France?",
        options: ["Paris", "London", "Berlin", "Madrid"],
        answer: "Paris",
      },
      {
        text: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Saturn"],
        answer: "Mars",
      },
      {
        text: "Who wrote 'To Kill a Mockingbird'?",
        options: [
          "Harper Lee",
          "Mark Twain",
          "Ernest Hemingway",
          "F. Scott Fitzgerald",
        ],
        answer: "Harper Lee",
      },
    ],
  },
  {
    id: 2,
    level: "Medium",
    questions: [
      {
        text: "What is the largest ocean on Earth?",
        options: ["Atlantic", "Indian", "Pacific", "Arctic"],
        answer: "Pacific",
      },
      {
        text: "What is the chemical symbol for gold?",
        options: ["Au", "Ag", "Gd", "Go"],
        answer: "Au",
      },
      {
        text: "Who painted the Mona Lisa?",
        options: [
          "Leonardo da Vinci",
          "Pablo Picasso",
          "Vincent Van Gogh",
          "Claude Monet",
        ],
        answer: "Leonardo da Vinci",
      },
    ],
  },
  {
    id: 3,
    level: "Hard",
    questions: [
      {
        text: "Which language is primarily spoken in Brazil?",
        options: ["Spanish", "Portuguese", "French", "English"],
        answer: "Portuguese",
      },
      {
        text: "What is the smallest prime number?",
        options: ["0", "1", "2", "3"],
        answer: "2",
      },
      {
        text: "What year did the first man land on the moon?",
        options: ["1965", "1969", "1972", "1959"],
        answer: "1969",
      },
    ],
  },
  {
    id: 4,
    level: "Weekly Challenge",
    questions: [
      {
        text: "What is the tallest mountain in the world?",
        options: ["K2", "Everest", "Kilimanjaro", "Denali"],
        answer: "Everest",
      },
      {
        text: "Which element has the chemical symbol 'O'?",
        options: ["Oxygen", "Gold", "Osmium", "Oganesson"],
        answer: "Oxygen",
      },
      {
        text: "Who developed the theory of relativity?",
        options: [
          "Isaac Newton",
          "Albert Einstein",
          "Nikola Tesla",
          "Marie Curie",
        ],
        answer: "Albert Einstein",
      },
    ],
  },
];

export default questionSets;
