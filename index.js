"use strict";
// const questions = [
//   {
//     question: "Which is the largest animal in the world?",
//     answers: [
//       {
//         text: "Shark",
//         correct: false,
//       },
//       {
//         text: "Blue Whale",
//         correct: true,
//       },
//       {
//         text: "Elephant",
//         correct: false,
//       },
//       {
//         text: "Giraffe",
//         correct: false,
//       },
//     ],
//   },
//   {
//     question: "Which is the largest desert in the world?",
//     answers: [
//       {
//         text: "Kalahari",
//         correct: false,
//       },
//       {
//         text: "Gorbi",
//         correct: false,
//       },
//       {
//         text: "Sahara",
//         correct: false,
//       },
//       {
//         text: "Antartica",
//         correct: true,
//       },
//     ],
//   },
//   {
//     question: "Which is the smallest country in the world?",
//     answers: [
//       {
//         text: "Vatican city",
//         correct: true,
//       },
//       {
//         text: "Bhutan",
//         correct: false,
//       },
//       {
//         text: "Nepal",
//         correct: false,
//       },
//       {
//         text: "Sri Lanka",
//         correct: false,
//       },
//     ],
//   },
//   {
//     question: "Which is the smallest continent in the world?",
//     answers: [
//       {
//         text: "Asia",
//         correct: false,
//       },
//       {
//         text: "Australia",
//         correct: true,
//       },
//       {
//         text: "Arctic",
//         correct: false,
//       },
//       {
//         text: "Africa",
//         correct: false,
//       },
//     ],
//   },
// ];

let questions = [];

fetch("https://opentdb.com/api.php?amount=10&type=multiple").then(
  (Response) => {
    Response.json()
      .then((data) => {
        questions = data.results.map((question) => {
          const formattedQuestion = {
            question: question.question,
            answers: [
              ...question.incorrect_answers.map((answer) => ({
                text: answer,
                correct: false,
              })),
              {
                text: question.correct_answer,
                correct: true,
              },
            ],
          };
          return formattedQuestion;
        });
        startQuiz();
        console.log(data);
      })
      .catch((error) => console.log("Error loading questions:", error));
  }
);

const questionElement = document.getElementById("question");
const answerButtons = document.getElementById("answer-buttons");
const nextButton = document.getElementById("next-btn");

let currentQuestionIndex = 0;
let score = 0;

let startQuiz = () => {
  currentQuestionIndex = 0;
  score = 0;
  nextButton.innerHTML = "Next";
  showQuestion();
};

let showQuestion = () => {
  resetState();
  let currentQuestion = questions[currentQuestionIndex];
  let questionNo = currentQuestionIndex + 1;
  questionElement.innerHTML = questionNo + ". " + currentQuestion.question;

  currentQuestion.answers.forEach((answer) => {
    const button = document.createElement("button");
    button.innerHTML = answer.text;
    button.classList.add("btn");
    answerButtons.appendChild(button);
    if (answer.correct) {
      button.dataset.correct = answer.correct;
    }
    button.addEventListener("click", selectAnswer);
  });
};

let resetState = () => {
  nextButton.style.display = "none";
  answerButtons.innerHTML = "";
};

let selectAnswer = (e) => {
  const selectedBtn = e.target;
  const isCorrect = selectedBtn.dataset.correct === "true";
  if (isCorrect) {
    selectedBtn.classList.add("correct");
    score++;
  } else {
    selectedBtn.classList.add("incorrect");
  }
  Array.from(answerButtons.children).forEach((button) => {
    if (button.dataset.correct === "true") {
      button.classList.add("correct");
    }
    button.disabled = true;
  });
  nextButton.style.display = "block";
};

let showScore = () => {
  resetState();
  questionElement.innerHTML = `You scored ${score} out of ${questions.length}`;
  nextButton.innerHTML = "Play Again";
  nextButton.style.display = "block";
};

let handleNextButton = () => {
  currentQuestionIndex++;
  if (currentQuestionIndex < questions.length) {
    showQuestion();
  } else {
    showScore();
  }
};
nextButton.addEventListener("click", () => {
  if (currentQuestionIndex < questions.length) {
    handleNextButton();
  } else {
    startQuiz();
  }
});
startQuiz();
