// variables defined
let currQuesIndex = 0;
let questionsEl = document.getElementById('questions');
let choicesEl = document.getElementById('choices');
let totalTime = questions.length * 10;
let timerEl = document.getElementById('timer');
let playBtn = document.getElementById('play');
let saveBtn = document.getElementById('save');
let informEl = document.getElementById('inform');
let playersIntlsEl = document.getElementById('playersIntls');

function beginQuiz() {
  // this hides the home page screen
  let homePageEl = document.getElementById('homePage');
  homePageEl.setAttribute('class', 'hide');

  // this removes the hide attribute from the questions
  questionsEl.removeAttribute('class');

  // start the timer
  timerId = setInterval(clockTick, 1000);

  // show the starting time for player
  timerEl.textContent = totalTime;

  //grab questions for game
  getQuestion();
}

function getQuestion() {
  // get current question object from array
  let currentQuestion = questions[currQuesIndex];

  // update title with current question
  let titleEl = document.getElementById('question-title');
  titleEl.textContent = currentQuestion.title;

  // clear out any old question choices
  choicesEl.innerHTML = '';

  // loop over choices
  for (let i = 0; i < currentQuestion.choices.length; i++) {
    // create new button for each choice
    let choice = currentQuestion.choices[i];
    let choiceNode = document.createElement('button');
    choiceNode.setAttribute('class', 'choice');
    choiceNode.setAttribute('value', choice);
    choiceNode.textContent = i + 1 + '. ' + choice;
    choicesEl.appendChild(choiceNode);
  }
}

function questionClick(event) {
  let buttonEl = event.target;

  if (!buttonEl.matches('.choice')) {
    return;
  }

  // verify if player chose wrong answer
  if (buttonEl.value !== questions[currQuesIndex].answer) {
    // penalize totalTime for incorrect answer
    totalTime -= 10;

    if (totalTime < 0) {
      totalTime = 0;
    }

    // display new totalTime 
    timerEl.textContent = totalTime;
    informEl.textContent = 'Incorrect Answer';
  } else {
    informEl.textContent = 'Correct Answer';
  }

  // show correct or incorrect to player 
  informEl.setAttribute('class', 'inform');
  setTimeout(function () {
    informEl.setAttribute('class', 'inform hide');
  }, 1000);

  // proceed to the next question
  currQuesIndex++;

  // verify if there are questions left
  if (totalTime <= 0 || currQuesIndex === questions.length) {
    quizEnd();
  } else {
    getQuestion();
  }
}

function quizEnd() {
  // stop timer
  clearInterval(timerId);

  // hide questions section
  questionsEl.setAttribute('class', 'hide');

  // show game over screen
  let gameOverEl = document.getElementById('gameOver');
  gameOverEl.removeAttribute('class');

  // show player's score
  let playersScoreEl = document.getElementById('playersScore');
  playersScoreEl.textContent = totalTime;

}

function clockTick() {
  // update totalTime
  totalTime--;
  timerEl.textContent = totalTime;

  // verify if player has time left 
  if (totalTime <= 0) {
    quizEnd();
  }
}

function saveScore() {
  
  let playersIntls = playersIntlsEl.value.trim();

  // check to make sure play entered initals
  if (playersIntls !== '') {
    // obtain highscors from local storage; if none have been stored display empty array
    let highscores =
      JSON.parse(window.localStorage.getItem('highscores')) || [];

    // create new score including finish time and players initals
    let newScore = {
      score: totalTime,
      playersIntls: playersIntls,
    };

    // save score and initials to localstorage
    highscores.push(newScore);
    window.localStorage.setItem('highscores', JSON.stringify(highscores));

    // bring up next page for player (highscores board page)
    window.location.href = 'highscores.html';
  }
}

function checkForEnter(event) {
  if (event.key === 'Enter') {
    saveScore();
  }
}

// player clicks on save button to save their score
saveBtn.onclick = saveScore;

// player clicks the play button to begin quiz
playBtn.onclick = beginQuiz;

// player clicks on an answer choice
choicesEl.onclick = questionClick;

playersIntlsEl.onkeyup = checkForEnter;
