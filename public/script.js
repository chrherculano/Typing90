let quotes = [];
fetch('/api/quotes')
  .then(response => response.json())
  .then(data => {
    quotes = data.quotes;
  });

let currentQuoteIndex = 0;
let currentQuote = "";
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
    currentQuote = displayQuote(); // Atribui a frase amostrada a currentQuote
    startTimer(); 
    answerInput.disabled = false; // Enable the text area

    // Exibir o popup para escolher o número de frases novamente
    showNumberOfQuotesPopup();
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
  startButton.disabled = false; // Habilitar o botão de iniciar o jogo novamente
  answerInput.disabled = false;
  answerInput.value = "";
  quoteDisplay.innerHTML = "";
  resultMessage.textContent = "";
  score = 0;
  clearInterval(timerInterval);
  timerInterval = undefined;
  currentQuoteIndex = 0; // Reset the current quote index
  displayQuote(); // Display the first quote again
  document.getElementById("pontos").textContent = "Pontuação: 0";
  answerInput.disabled = true; // Disable the text area
}

function displayQuote() {
  if (quotes.length === 0) return; // Retorna se não houver mais frases disponíveis
  const randomIndex = Math.floor(Math.random() * quotes.length);
  currentQuote = quotes[randomIndex];
  quotes.splice(randomIndex, 1); // Remove a frase atual da lista

  const quoteArray = currentQuote.split("");

  quoteDisplay.innerHTML = "";
  quoteArray.forEach((char) => {
    const span = document.createElement("span");
    span.textContent = char;
    quoteDisplay.appendChild(span);
  });

  return currentQuote; // Retorna a frase amostrada
}

answerInput.addEventListener("input", function () {
  // Play the typing sound
  typingSound.currentTime = 0;
  typingSound.play();
});

function checkAnswer() {
  const answer = answerInput.value.toLowerCase();
  const quoteArray = currentQuote.split(""); // Use currentQuote em vez de quotes[currentQuote]
  
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

  if (answer === currentQuote.toLowerCase()) { // Comparar com currentQuote em vez de quote
    resultMessage.innerHTML = "";
    updateScore(1);
    answerInput.focus();
    clearInterval(timerInterval);
    timerInterval = undefined;
    timeInSeconds = 30;
    startTimer();

    // Obter uma nova frase aleatória
    currentQuote = displayQuote();
    // Se todas as frases foram concluídas, encerre o jogo
    if (!currentQuote) {
      clearInterval(timerInterval);
      timerInterval = undefined;
      saveScore(); // Salvar a pontuação no banco de dados
      alert("Parabéns! Você concluiu todas as frases.");
      resetGame();
      return;
    }
    correctAnswerSound.play();
    answerInput.value = "";
  }
}

function updateScore() {
  score++;
  if (score > 20) {
    score = 20;
  }
  document.getElementById("pontos").textContent = `Pontuação: ${score}`;
}

// Função para exibir o popup para escolher o número de frases
function showNumberOfQuotesPopup() {
  const numberOfQuotes = window.prompt("Quantas frases você quer desafiar? (1 - 50)", "5");
  let parsedNumberOfQuotes = parseInt(numberOfQuotes);

  if (!isNaN(parsedNumberOfQuotes) && parsedNumberOfQuotes > 0 && parsedNumberOfQuotes <= 50) {
    // Mantenha apenas o número solicitado de frases
    quotes = quotes.slice(0, parsedNumberOfQuotes);
  } else {
    alert("Número de frases definido para padrão de 20");
    parsedNumberOfQuotes = 20;
    quotes = quotes.slice(0, parsedNumberOfQuotes);
  }
}

// Função para enviar pontuação para o servidor
function saveScore() {
  const playerName = prompt("Digite seu nome:");
  if (playerName) {
    fetch('/api/scores', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ player_name: playerName, score: score })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Score saved:', data);
    })
    .catch(error => {
      console.error('Error saving score:', error);
    });
  }
}
