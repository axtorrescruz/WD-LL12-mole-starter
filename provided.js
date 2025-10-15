let moleCount = 0;
let gameRunning = false;
let lastHole = null;

const GAME_DURATION = 15000;
const MIN_PEEP_TIME = 500;
const MAX_PEEP_TIME = 1000;

// Make a mole appear
function showMole() {
  if (!gameRunning) return;

  const peepDuration = getRandomTime(MIN_PEEP_TIME, MAX_PEEP_TIME);
  const hole = getRandomHole(holes);

  // Add the proper class 
  hole.classList.add('up');
  moleCount++;
  moleCountDisplay.textContent = moleCount;

  setTimeout(() => {
    hole.classList.remove('up');
    if (gameRunning) showMole();
  }, peepDuration);
}

// Start the game
function startGame() {
  console.log("Game started");
  score = 0;
  moleCount = 0;
  gameRunning = true;

  scoreDisplay.textContent = score;
  moleCountDisplay.textContent = moleCount;
  startButton.disabled = true;

  showMole();

  setTimeout(() => {
    gameRunning = false;
    startButton.disabled = false;
  }, GAME_DURATION);
}

// Generate random time between min and max
function getRandomTime(min, max) {
  return Math.round(Math.random() * (max - min) + min);
}

// Select a random hole that's different from the last one
function getRandomHole(holes) {
  const randomIndex = Math.floor(Math.random() * holes.length);
  const selectedHole = holes[randomIndex];

  if (selectedHole === lastHole) {
    return getRandomHole(holes);
  }

  lastHole = selectedHole;
  return selectedHole;
}
