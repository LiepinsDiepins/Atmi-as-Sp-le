const flagPairs = [
  "https://flagcdn.com/w80/lv.png", // Latvia
  "https://flagcdn.com/w80/ca.png", // Canada
  "https://flagcdn.com/w80/us.png", // USA
  "https://flagcdn.com/w80/fi.png", // Finland
  "https://flagcdn.com/w80/se.png", // Sweden
  "https://flagcdn.com/w80/cz.png", // Czechia
  "https://flagcdn.com/w80/de.png", // Germany
  "https://flagcdn.com/w80/ch.png", // Switzerland
  "https://flagcdn.com/w80/sk.png", // Slovakia
  "https://flagcdn.com/w80/ru.png", // Russia
  "https://flagcdn.com/w80/no.png", // Norway
  "https://flagcdn.com/w80/dk.png"  // Denmark
];

let boardCards = [];
let firstCard = null;
let secondCard = null;
let canPlay = false;
let currentPlayer = 1;
let player1Score = 0;  // punktu skaits spēlētājam 1
let player2Score = 0;  // punktu skaits spēlētājam 2

function generateShuffledCards() {
  const pairList = [...flagPairs, ...flagPairs];
  for (let i = pairList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pairList[i], pairList[j]] = [pairList[j], pairList[i]];
  }
  return pairList;
}

function startNewGame() {
  const board = document.getElementById("game-board");
  board.innerHTML = "";
  boardCards = [];
  firstCard = null;
  secondCard = null;
  canPlay = false;
  player1Score = 0;  // restartē punktus
  player2Score = 0;
  updateScoreboard(); // atjauno displeju

  const cards = generateShuffledCards();
  cards.forEach((imgUrl, index) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.dataset.img = imgUrl;
    card.dataset.index = index;
    card.addEventListener("click", () => handleCardClick(card));
    board.appendChild(card);
    boardCards.push(card);
  });

  document.getElementById("status").textContent = "Met kauliņu!";
}

function updateScoreboard() {
  document.getElementById('scoreboard').textContent = `${player1Score} : ${player2Score}`;
}

function handleCardClick(card) {
  if (!canPlay || card.classList.contains("revealed") || card === firstCard) return;

  card.innerHTML = `<img src="${card.dataset.img}" class="flag-img">`;

  if (!firstCard) {
    firstCard = card;
  } else {
    secondCard = card;
    canPlay = false;

    setTimeout(() => {
      if (firstCard.dataset.img === secondCard.dataset.img) {
        firstCard.classList.add("revealed");
        secondCard.classList.add("revealed");
        
        // Piešķiram punktus pašreizējam spēlētājam
        if (currentPlayer === 1) player1Score++;
        else player2Score++;
        updateScoreboard();

        firstCard = null;
        secondCard = null;
        canPlay = true;
        document.getElementById("status").textContent = ` ${currentPlayer} spēlētājs uzminēja! Vēlreiz mēģini!`;
      } else {
        firstCard.innerHTML = "";
        secondCard.innerHTML = "";
        firstCard = null;
        secondCard = null;

        // Mainam spēlētāju
        document.getElementById("status").textContent = `Neuzminēji! Tagad ${3 - currentPlayer} spēlētājs met kauliņu.`;
        currentPlayer = 3 - currentPlayer;
        document.getElementById(`player1-btn`).disabled = currentPlayer !== 1;
        document.getElementById(`player2-btn`).disabled = currentPlayer !== 2;
        canPlay = false;
      }
    }, 1000);
  }
}

function rollDice(player) {
  if (player !== currentPlayer) return;

  const result = Math.floor(Math.random() * 6) + 1;
  document.getElementById("dice-result").textContent = `Kauliņa rezultāts: ${result}`;

  if (result === 1 || result === 6) {
    canPlay = true;
    document.getElementById("status").textContent = ` ${player} spēlētājs TRĀPIJA, un drīkst meklēt!!`;
  } else {
    document.getElementById("status").textContent = ` ${player} spēlētājs netrāpija. Tagad ${3 - player} spēlētājs met kauliņu.`;
    currentPlayer = 3 - player;
    document.getElementById(`player1-btn`).disabled = currentPlayer !== 1;
    document.getElementById(`player2-btn`).disabled = currentPlayer !== 2;
    canPlay = false;
  }
}
