const question = document.getElementById('question');
const choices = Array.from(document.getElementsByClassName('choice-text'));
const progressText = document.getElementById('progressText');
const scoreText = document.getElementById('score');
const progressBarFull = document.getElementById('progressBarFull');
const loader = document.getElementById('loader');
const game = document.getElementById('game');
const timerText = document.getElementById('timer'); // New timer element

// Power-up buttons
const timeExtendBtn = document.getElementById('timeExtendBtn');
const fiftyFiftyBtn = document.getElementById('fiftyFiftyBtn');
const scoreMultiplierBtn = document.getElementById('scoreMultiplierBtn');

let currentQuestion = {};
let acceptingAnswers = false;
let score = 0;
let questionCounter = 0;
let availableQuestions = [];
let questions = [];

// Timer variables
const QUIZ_DURATION = 300; // 2 minutes = 120 seconds
let timeRemaining = QUIZ_DURATION;
let timerInterval;

// Power-up states
let availableBoosters = parseInt(localStorage.getItem('availableBoosters') || '0');
let powerUpStates = {
  timeExtension: false,
  fiftyFifty: false,
  scoreMultiplier: false
};

// Mapping subjects to OpenTDB category IDs
const SUBJECT_CATEGORIES = {
  'science': 17,  // Science & Nature
  'math': 19,     // Math
  'history': 23,  // History
  'geography': 22,// Geography
  'general': 9    // General Knowledge
};

const CORRECT_BONUS = 10;
const MAX_QUESTIONS = 10;
const STREAK_BONUS = 5;
let currentStreak = 0;

const selectedSubject = localStorage.getItem('selectedSubject') || 'general';
const categoryId = SUBJECT_CATEGORIES[selectedSubject];

// Timer function to manage quiz time
function startTimer() {
  timerInterval = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining <= 0) {
      endQuiz();
    }
  }, 1000);
}

// Update timer display
function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  timerText.textContent = `Time: ${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// End quiz when time runs out or all questions answered
function endQuiz() {
  clearInterval(timerInterval);
  localStorage.setItem('mostRecentScore', score);
  window.location.assign('/end.html');
}

// Update power-up button states
function updatePowerUpButtons() {
  const powerUpButtons = [timeExtendBtn, fiftyFiftyBtn, scoreMultiplierBtn];
  powerUpButtons.forEach((btn, index) => {
    if (availableBoosters > index) {
      btn.classList.add('active');
      btn.disabled = false;
    } else {
      btn.classList.remove('active');
      btn.disabled = true;
    }
  });
}

// Power-up event listeners with timer considerations
timeExtendBtn.addEventListener('click', () => {
  if (availableBoosters > 0 && !powerUpStates.timeExtension) {
    powerUpStates.timeExtension = true;
    availableBoosters--;
    timeExtendBtn.classList.add('used');
    
    // Extend timer by 15 seconds
    timeRemaining += 15;
    updateTimerDisplay();

    localStorage.setItem('availableBoosters', availableBoosters);
    updatePowerUpButtons();
  }
});

fiftyFiftyBtn.addEventListener('click', () => {
  if (availableBoosters > 1 && !powerUpStates.fiftyFifty) {
    powerUpStates.fiftyFifty = true;
    availableBoosters--;
    fiftyFiftyBtn.classList.add('used');
    
    // Remove two incorrect answers
    const incorrectChoices = choices.filter(choice => 
      parseInt(choice.dataset.number) !== currentQuestion.answer
    );
    const choicesToRemove = incorrectChoices
      .sort(() => 0.5 - Math.random())
      .slice(0, 2);
    
    choicesToRemove.forEach(choice => {
      choice.parentElement.style.display = 'none';
    });

    localStorage.setItem('availableBoosters', availableBoosters);
    updatePowerUpButtons();
  }
});

scoreMultiplierBtn.addEventListener('click', () => {
  if (availableBoosters > 2 && !powerUpStates.scoreMultiplier) {
    powerUpStates.scoreMultiplier = true;
    availableBoosters--;
    scoreMultiplierBtn.classList.add('used');
    // Score multiplier will be applied in incrementScore function
    localStorage.setItem('availableBoosters', availableBoosters);
    updatePowerUpButtons();
  }
});

fetch(`https://opentdb.com/api.php?amount=10&category=${categoryId}&difficulty=medium&type=multiple`)
  .then((res) => res.json())
  .then((loadedQuestions) => {
    questions = loadedQuestions.results.map((loadedQuestion) => {
      const formattedQuestion = {
        question: decodeURIComponent(loadedQuestion.question),
      };

      const answerChoices = [...loadedQuestion.incorrect_answers];
      formattedQuestion.answer = Math.floor(Math.random() * 4) + 1;
      answerChoices.splice(
        formattedQuestion.answer - 1,
        0,
        loadedQuestion.correct_answer
      );

      answerChoices.forEach((choice, index) => {
        formattedQuestion['choice' + (index + 1)] = decodeURIComponent(choice);
      });

      return formattedQuestion;
    });

    startGame();
  })
  .catch((err) => {
    console.error(err);
  });

function startGame() {
  questionCounter = 0;
  score = 0;
  currentStreak = 0;
  availableQuestions = [...questions];
  timeRemaining = QUIZ_DURATION; // Reset timer
  
  // Reset power-up states and update buttons
  powerUpStates = {
    timeExtension: false,
    fiftyFifty: false,
    scoreMultiplier: false
  };
  updatePowerUpButtons();
  
  // Reset any hidden choices from 50/50 power-up
  choices.forEach(choice => {
    choice.parentElement.style.display = '';
  });

  startTimer(); // Start the timer when the game begins
  getNewQuestion();
  game.classList.remove('hidden');
  loader.classList.add('hidden');
}

function getNewQuestion() {
  if (availableQuestions.length === 0 || questionCounter >= MAX_QUESTIONS) {
    endQuiz();
    return;
  }
  
  questionCounter++;
  progressText.innerText = `${selectedSubject.toUpperCase()} Quiz - Question ${questionCounter}/${MAX_QUESTIONS}`;
  progressBarFull.style.width = `${(questionCounter / MAX_QUESTIONS) * 100}%`;

  const questionIndex = Math.floor(Math.random() * availableQuestions.length);
  currentQuestion = availableQuestions[questionIndex];
  question.innerHTML = currentQuestion.question;

  choices.forEach((choice) => {
    const number = choice.dataset['number'];
    choice.innerHTML = currentQuestion['choice' + number];
    choice.parentElement.style.display = ''; // Ensure all choices are visible
  });

  availableQuestions.splice(questionIndex, 1);
  acceptingAnswers = true;
}

choices.forEach((choice) => {
  choice.addEventListener('click', (e) => {
    if (!acceptingAnswers) return;

    acceptingAnswers = false;
    const selectedChoice = e.target;
    const selectedAnswer = selectedChoice.dataset['number'];

    const classToApply =
      selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

    if (classToApply === 'correct') {
      incrementScore(CORRECT_BONUS);
      currentStreak++;
      
      // Streak bonus
      if (currentStreak % 3 === 0) {
        incrementScore(STREAK_BONUS);
        // Potential booster unlock
        localStorage.setItem('availableBoosters', currentStreak / 3);
      }
    } else {
      currentStreak = 0;
    }

    selectedChoice.parentElement.classList.add(classToApply);

    setTimeout(() => {
      selectedChoice.parentElement.classList.remove(classToApply);
      getNewQuestion();
    }, 1000);
  });
});

// Modify incrementScore function to support score multiplier
function incrementScore(num) {
  // Apply score multiplier if active
  const finalScore = powerUpStates.scoreMultiplier ? num * 2 : num;
  score += finalScore;
  scoreText.innerText = score;
}

// Initialize power-up buttons on game start
updatePowerUpButtons();
