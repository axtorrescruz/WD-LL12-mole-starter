// DOM SELECT ELEMENTS
const holes = document.querySelectorAll(".hole");
const scoreDisplay = document.getElementById("score");
const moleCountDisplay = document.getElementById("moleCount");
const startButton = document.getElementById("startButton");
const timeLeftDisplay = document.getElementById("timeLeft");
const messageDiv = document.getElementById("message");

// Initialize game board
function initializeGame() {
  // Create one ".mole" inside each ".hole" and attach click listeners
  for (let i = 0; i < holes.length; i++) {
    const hole = holes[i];
    const mole = document.createElement("div");
    mole.className = "mole";
    hole.appendChild(mole);

    // Allow mouse clicking to whack
    hole.addEventListener("click", whack);
  }

  // Also enable keyboard controls (keys 1-9)
  // We listen once on the whole page and map the key to a hole
  document.addEventListener("keydown", handleKeyDown);
}

function whack(event) {
  console.log(event);
  // 1) prevent fake clicks
  if (!event.isTrusted) return; // Prevents fake clicks

  const hole = event.currentTarget;
  if (!hole.classList.contains("up")) return;
  // 2) handle the click - remove the up class

  // Use the same hit logic used by keyboard input
  hitHole(hole);
}

// Shared logic to "hit" a hole (used by both mouse and keyboard)
function hitHole(hole) {
  // Only score if a mole is up in this hole
  if (!hole.classList.contains("up")) return;

  // Remove the mole (down) and increase score
  hole.classList.remove("up");

  // "score" is a global set in startGame() from provided.js
  // We assume the game has started so score exists
  score++;
  scoreDisplay.textContent = score;
}

// Keyboard handler: keys 1-9 map to the 9 holes
function handleKeyDown(event) {
  // Only allow keyboard input while the game is running
  // "gameRunning" is defined in provided.js
  if (typeof gameRunning !== "undefined" && !gameRunning) {
    return;
  }

  // event.key is a string like '1', '2', ... '9'
  const key = event.key;
  if (key < "1" || key > "9") return; // Ignore any other keys

  // Convert '1'-'9' to index 0-8
  const index = parseInt(key, 10) - 1;
  if (index < 0 || index >= holes.length) return;

  const hole = holes[index];
  hitHole(hole);
}

startButton.addEventListener("click", startGame);
initializeGame();

// ------- Timer logic -------
// We'll start a countdown when the game starts. If the project already
// defines a game duration or gameRunning control in provided.js we use
// those; otherwise we fallback to 30 seconds.

// Local timer state (used if provided.js doesn't manage time)
var localTimerId = null;
var localTimeLeft = 30; // default

// Hook into startGame: wrap the existing startGame (from provided.js)
// if present so we can also start our timer display. If startGame is
// not defined yet at load time, this will still work because the
// Start button calls startGame (which should then be defined).
function startGameWrapper() {
  // If there is an original startGame function provided by provided.js,
  // call it first so global game state is initialized there.
  if (typeof startGame === "function" && startGame !== startGameWrapper) {
    // Call the original startGame implementation
    try {
      startGame();
    } catch (e) {
      // If provided.js expects a different signature, ignore errors and continue
      console.error("startGame threw an error:", e);
    }
  }

  // Decide the duration: prefer a provided global if available
  if (typeof gameDuration !== "undefined") {
    localTimeLeft = gameDuration;
  } else if (typeof DEFAULT_GAME_DURATION !== "undefined") {
    localTimeLeft = DEFAULT_GAME_DURATION;
  } else {
    localTimeLeft = 30;
  }

  // Reset UI and start local timer
  timeLeftDisplay.textContent = localTimeLeft;
  messageDiv.textContent = "";

  // Clear any existing timer
  if (localTimerId !== null) {
    clearInterval(localTimerId);
    localTimerId = null;
  }

  // Start a 1-second countdown
  localTimerId = setInterval(function () {
    localTimeLeft = localTimeLeft - 1;
    timeLeftDisplay.textContent = localTimeLeft;

    if (localTimeLeft <= 0) {
      clearInterval(localTimerId);
      localTimerId = null;

      // Show end message
      messageDiv.textContent =
        "Time is up! Final score: " +
        (typeof score !== "undefined" ? score : "0");

      // Attempt to stop the game using a provided function if available
      if (typeof stopGame === "function") {
        try {
          stopGame();
        } catch (e) {
          console.error("stopGame threw an error:", e);
        }
      }

      // If provided.js uses a boolean, try to flip it
      if (typeof gameRunning !== "undefined") {
        try {
          gameRunning = false;
        } catch (e) {
          // ignore if not writable
        }
      }
    }
  }, 1000);
}

// Replace the click handler on the start button to call our wrapper.
// This preserves existing behavior while adding the timer view.
startButton.removeEventListener("click", startGame);
startButton.addEventListener("click", startGameWrapper);

// Mark todo item 1 done and move next
functions.manage_todo_list({
  operation: "write",
  todoList: [
    {
      id: 1,
      title: "Add UI elements for timer and message",
      description:
        "Add a timer display and a message area to `index.html` so players can see time left and the end message.",
      status: "completed",
    },
    {
      id: 2,
      title: "Implement timer logic",
      description:
        "Add functions in `script.js` to start a countdown when the Start button is clicked, update the timer display each second, show a message when time is up, and attempt to stop the game cleanly.",
      status: "in-progress",
    },
    {
      id: 3,
      title: "Integrate with existing game state",
      description:
        "Try to use any existing globals from `provided.js` (like `gameDuration`, `stopGame`, or `gameRunning`) if present; otherwise, fallback to safe defaults (30s and manual cleanup).",
      status: "not-started",
    },
  ],
});
