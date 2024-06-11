
let quotes = [];
fetch('/api/quotes')
  .then(response => response.json())
  .then(data => {
    quotes = data.quotes;
  });

let currentQuote = 0;
const answerInput = document.getElementById("answer");
const quoteDisplay = document.getElementById("quote");
const countdownElement = document.getElementById("countdown");
const resultMessage = document.getElementById("message");
const startButton = document.getElementById("start-game");
let timeInSeconds = 30; // Tempo inicial do timer (em segundos)
let timerInterval;
let gameStarted = false;
let score = 0;
const audio = document.getElementById("myaudio");
audio.volume = 0.2; 
const typingSound = new Audio("./AUDIO/keyboard.mp3");
typingSound.preload = "auto";
typingSound.volume = 0.3;
const correctAnswerSound = new Audio("./AUDIO/correct.mp3");

startButton.addEventListener("click", startGame);

function startGame() {
  if (!gameStarted) {
    timeInSeconds = 30; // Reiniciar o tempo do timer para 30 segundos
    countdownElement.textContent = formatTime(timeInSeconds);
    startButton.disabled = true;
    answerInput.disabled = false;
    answerInput.focus();
    answerInput.value = "";
    answerInput.addEventListener("input", checkAnswer);
    resultMessage.textContent = "";
    score = 0;
    gameStarted = true;
    displayQuote();
    startTimer(); // Chama a função startTimer() para iniciar o timer
    answerInput.disabled = false; // Enable the text area
  }
}

function startTimer() {
  if (gameStarted && !timerInterval) {
    timerInterval = setInterval(updateTimer, 1000);
  }
}

function updateTimer() {
  if (timeInSeconds === 0) {
    clearInterval(timerInterval);
    alert("Tempo acabou! Tente Novamente :)");
    resetGame();
  } else {
    timeInSeconds--;
    countdownElement.textContent = formatTime(timeInSeconds);
  }
}

function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = timeInSeconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
}

function resetGame() {
  gameStarted = false;
  startButton.disabled = false;
  answerInput.disabled = false;
  answerInput.value = "";
  quoteDisplay.innerHTML = "";
  resultMessage.textContent = "";
  score = 0;
  clearInterval(timerInterval);
  timerInterval = undefined;
  currentQuote = 0; // Reset the current quote index
  displayQuote(); // Display the first quote again
  document.getElementById("pontos").textContent = "Pontuação: 0";
  answerInput.disabled = true; // Disable the text area
}

function displayQuote() {
  const quote = quotes[currentQuote];
  const quoteArray = quote.split("");

  quoteDisplay.innerHTML = "";
  quoteArray.forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    quoteDisplay.appendChild(span);
  });
}

answerInput.addEventListener("input", function () {
  // Play the typing sound
  typingSound.currentTime = 0;
  typingSound.play();
});

function checkAnswer() {
  const answer = answerInput.value.toLowerCase();
  const quote = quotes[currentQuote];
  const quoteArray = quote.split("");

  quoteDisplay.textContent = "";
  let errorFound = false;

  for (let i = 0; i < quoteArray.length; i++) {
    const char = quoteArray[i];

    const span = document.createElement("span");
    span.textContent = char;

    if (i < answer.length) {
      const userInputChar = answer.charAt(i);
      if (userInputChar.toLowerCase() === char.toLowerCase()) {
        if (errorFound) {
          span.style.color = "red";
        } else {
          span.style.color = "blue";
          resultMessage.innerHTML = "";
        }
      } else {
        span.style.color = "red";
        errorFound = true;
        resultMessage.innerHTML = "Incorreto Digite novamente";
      }
    } else {
      span.style.color = "black";
    }

    quoteDisplay.appendChild(span);
  }

  if (answer === quote.toLowerCase()) {
    resultMessage.innerHTML = "";
    updateScore(1);
    answerInput.focus();
    clearInterval(timerInterval);
    timerInterval = undefined;
    timeInSeconds = 30;
    startTimer();

    currentQuote++;
    if (currentQuote >= quotes.length) {
      alert("Parabéns! Você digitou todas as frases.");
      resetGame();
    } else {
      correctAnswerSound.play();
      answerInput.value = "";
      displayQuote();
    }
  }
}

function updateScore() {
  score++;
  if (score > 20) {
    score = 20;
  }
  document.getElementById("pontos").textContent = `Pontuação: ${score}`;
}

// Enviar pontuação para o servidor
function saveScore() {
  const playerName = prompt("Digite seu nome:");
  if (playerName) {
    fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ player_name: playerName, score: score })
    }).then(response => response.json())
      .then(data => {
        console.log('Score saved:', data);
      });
  }
}

answerInput.addEventListener("keydown", (e) => {
  if (e.keyCode === 13) {
    if (gameStarted) {
      e.preventDefault();
    }
  }
});

answerInput.addEventListener("input", (e) => {
  const answer = e.target.value;
  const quote = quotes[currentQuote];
  const maxChars = quote.length;

  if (answer.length > maxChars) {
    e.target.value = answer.slice(0, maxChars);
  }
});

// Pop-up for the user to choose the number of quotes
window.addEventListener("load", () => {
  setTimeout(() => {
    const numberOfQuotes = window.prompt("Quantas frases você quer desafiar?  1 - 20", "5");
    const parsedNumberOfQuotes = parseInt(numberOfQuotes, 10);

    if (!isNaN(parsedNumberOfQuotes) && parsedNumberOfQuotes > 0 && parsedNumberOfQuotes <= quotes.length) {
      quotes = quotes.slice(0, parsedNumberOfQuotes);
    } else {
      alert("Numero de frases definido para padrão de 20");
    }
  }, 1000); // Adjust the delay time (in milliseconds) as needed
});
