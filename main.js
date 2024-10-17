let standinDom = document.querySelector(".standin"); // Reference to the standin sprite
let trashDom = document.querySelector(".trash img"); // Reference to the trash element
let bins = document.querySelectorAll(".trashBins img"); // Reference to the bins
let moveSpeed = 10; // Movement speed for the sprites
let standinPosition = { top: 0, left: 100 }; // Initial position of the standin sprite
const gameContainer = document.querySelector('.game'); // Reference to the game container
const gameOverBox = document.querySelector(".gameOver"); // Reference to the Game Over box
let gameOver = false; // Variable to track game over state
let timer = 300; // Timer in seconds
let score = 0; // Player's score
let scoreText = document.querySelector('h4'); // Score display element
let timerText = document.querySelector('h3'); // Timer display element
scoreText.innerHTML = "Score: " + score; // Initialize score display
gameOverBox.style.display = 'none'; // Initially hide Game Over box




// Load trash items and set the initial trash
let trashes = loadTrashes(); 
let trash = getRandomTrash();
trashDom.src = trash.src;
trashDom.name = trash.type;

let trashHeld = false; // Track whether the trash is being held
let trashFalling = false; // Track whether the trash is falling


// Consolidated Timer Function
function updateTimer() {
    if (timer > 0 && !gameOver) {
        timer--;
        updateTimerDisplay(timer); // Update timer display every second
    } else if (timer === 0) {
        triggerGameOver(); // Trigger game over if time runs out
    }
}

// Timer Interval: This runs every second
setInterval(() => {
    if (gameStarted && !gameOver) {
        updateTimer(); // Call the timer update function only when the game is started
    }
}, 1000);

// Update Timer Display Function
function updateTimerDisplay(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    timerText.innerHTML = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Trigger game over logic
function triggerGameOver() {
    gameOver = true;
    gameOverBox.style.display = 'block'; // Show Game Over screen
}

function restartGame() {
    timer = 300; // Reset to 5 minutes
    updateTimerDisplay(timer); // Display the reset timer
    gameOverBox.style.display = 'none'; // Hide Game Over screen
    score = 0; // Reset score
    scoreText.innerHTML = "Score: " + score; // Update score display

    // Reset the position of the standin sprite in the DOM
    standinPosition = { bottom: 0, left: 255 }; // Reset standin position
    standinDom.style.position = 'absolute'; // Ensure it is positioned absolutely
    standinDom.style.bottom = `${standinPosition.bottom}px`; // Set the top position
    standinDom.style.left = `${standinPosition.left}px`; // Set the left position

    trashHeld = false; // Ensure the trash is not being held
    trashFalling = false; // Ensure the trash is not falling

    // Reset the trash item and position
    loadNewTrash(); // Load new random trash item

    gameOver = false; // Reset game over flag
}

// Replay button event listener
document.getElementById('replayBtn').addEventListener('click', restartGame);





// Move Sprite Function
function moveSprite(event) {
    if (gameOver) return; // Stop movement if the game is over

    const gameWidth = gameContainer.offsetWidth;
    const standinWidth = standinDom.offsetWidth;

    // Get the current position of the standin sprite from the DOM
    let currentLeft = parseInt(window.getComputedStyle(standinDom).left, 10) || standinPosition.left;

    // Arrow key movement
    switch (event.key) {
        case "ArrowLeft":
            standinPosition.left = Math.max(0, currentLeft - moveSpeed); // Move left, but not out of bounds
            break;
        case "ArrowRight":
            standinPosition.left = Math.min(gameWidth - standinWidth, currentLeft + moveSpeed); // Move right, but not out of bounds
            break;
    }

    // Update the position of the standin sprite in the DOM
    standinDom.style.left = `${standinPosition.left}px`;

    // Check for collision after moving
    checkCollision();
}

// Move Trash Function
function moveTrash() {
    if (trashFalling) return; // Prevent starting another drop if already falling

    // Define the game area dimensions
    const gameWidth = gameContainer.offsetWidth; // Width of the game area
    const gameHeight = gameContainer.offsetHeight; // Height of the game area

    // Generate a random horizontal position between the left edge and the right edge of the game area
    const randomLeft = Math.random() * (gameWidth - trashDom.offsetWidth);
    
    // Set the trash position at the top of the game area
    trashDom.style.left = `${randomLeft}px`; // Random position
    trashDom.style.top = '0px'; // Start at the top

    // Reset the transition to avoid conflicts
    trashDom.style.transition = 'none'; // Remove any previous transition

    // Allow a small timeout to reset the top position before starting the drop animation
    setTimeout(() => {
        trashDom.style.transition = 'top 5s linear'; // Set transition for the drop
        trashDom.style.top = `${gameHeight - trashDom.offsetHeight}px`; // Drop to the bottom
        trashFalling = true; // Mark trash as falling
    }, 50); // Small timeout to allow the initial position to be set
}

// Function to handle dropping of trash with spacebar
function dropTrash() {
    if (trashHeld) {
        // Check which bin the sprite is currently near
        bins.forEach(bin => {
            const binRect = bin.getBoundingClientRect();
            const standinRect = standinDom.getBoundingClientRect();
            
            // Check for overlap
            if (
                standinRect.x < binRect.x + binRect.width &&
                standinRect.x + standinRect.width > binRect.x &&
                standinRect.y < binRect.y + binRect.height &&
                standinRect.y + standinRect.height > binRect.y
            ) {
                const binName = bin.name; // Get the name of the bin
                if (trashDom.name === binName) {
                    // Correct bin - increase score
                    score += 1;
                    scoreText.innerHTML = "Score: " + score;

                    // Check if score reaches 20 and trigger game over
                    if (score >= 20) {
                        triggerGameOver(); // End the game if the score is 20 or more
                    }

                    // Reset trashHeld flag
                    trashHeld = false; 
                    loadNewTrash(); // Load new trash when dropped in the correct bin
                } else {
                    console.log("Wrong bin!"); // Debugging message
                }
            }
        });

        // Reset trashHeld status regardless of the drop outcome
        trashHeld = false;
    }
}

// Load trash items
function loadTrashes() {
    let trashes = [];
    for (let i = 1; i <= 4; i++) {
        trashes.push({
            type: 'plastic',
            src: `assets/trash/plastic/${i}.png`
        });
        trashes.push({
            type: 'glass',
            src: `assets/trash/glass/${i}.png`
        });
    }
    return trashes;
}

// Get random trash item
function getRandomTrash() {
    let randomIndex = Math.floor(Math.random() * trashes.length);
    return trashes[randomIndex];
}

// Load new trash
function loadNewTrash() {
    trash = getRandomTrash(); // Get new random trash
    trashDom.src = trash.src; // Update the image source
    trashDom.name = trash.type; // Update the trash type name
    moveTrash(); // Move trash to random position
}

// Trigger game over logic
function triggerGameOver() {
    gameOver = true;
    gameOverBox.style.display = 'block'; // Show Game Over screen
}






// Replay button event listener
document.getElementById('replayBtn').addEventListener('click', restartGame);

// Event listener for keypresses
document.addEventListener('keydown', (event) => {
    if (event.key === ' ') {
        // Check if trash is falling and drop it
        if (trashFalling) {
            // Move trash to the standin position
            trashDom.style.position = 'absolute';
            trashDom.style.top = `${standinPosition.top}px`; // Align trash with standin
            trashDom.style.left = `${standinPosition.left}px`;
            trashHeld = true; // Mark trash as held
            dropTrash(); // Call drop trash function to check for bin
        }
    } else {
        moveSprite(event); // Handle sprite movement for other keys
    }
});

// Timer logic
setInterval(() => {
    if (timer > 0) {
        timer -= 1;
        updateTimerDisplay(timer);
    }
    if (timer === 0) {
        gameOverBox.style.display = 'block';
        gameOver = true;
    }
}, 1000);

// Update Timer Display Function
function updateTimerDisplay(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    timerText.innerHTML = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}

// Function to check collision between standin and trash
function checkCollision() {
    const standinRect = standinDom.getBoundingClientRect();
    const trashRect = trashDom.getBoundingClientRect();

    // Check for overlap
    if (
        standinRect.x < trashRect.x + trashRect.width &&
        standinRect.x + standinRect.width > trashRect.x &&
        standinRect.y < trashRect.y + trashRect.height &&
        standinRect.y + standinRect.height > trashRect.y
    ) {
        // Collision detected
        if (!trashHeld) {
            trashHeld = true; // Mark trash as held
            console.log("Trash picked up!"); // Add logging for debugging
            // Position the trash to the sprite's position
            trashDom.style.position = 'absolute';
            trashDom.style.top = `${standinPosition.top}px`;
            trashDom.style.left = `${standinPosition.left}px`;
        }
    }
}

// Initial setup for trash
moveTrash(); // Start with moving trash


// Update Timer Display Function
function updateTimerDisplay(seconds) {
    let minutes = Math.floor(seconds / 60);
    let remainingSeconds = seconds % 60;
    timerText.innerHTML = `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}








// Drop Trash Function (Spacebar)
function dropTrash() {
    if (trashHeld) {
        bins.forEach(bin => {
            const binRect = bin.getBoundingClientRect();
            const standinRect = standinDom.getBoundingClientRect();
            
            if (
                standinRect.x < binRect.x + binRect.width &&
                standinRect.x + standinRect.width > binRect.x &&
                standinRect.y < binRect.y + binRect.height &&
                standinRect.y + standinRect.height > binRect.y
            ) {
                const binName = bin.name; // Get the name of the bin
                if (trashDom.name === binName) {
                    // Correct bin - increase score
                    score += 1;
                    scoreText.innerHTML = "Score: " + score;

                    // Increase the timer by 5 seconds when a point is scored
                    timer += 5; 
                    updateTimerDisplay(timer); // Update the timer display

                    // Check if score reaches 20 and trigger game over
                    if (score >= 20) {
                        triggerGameOver();
                    }

                    trashHeld = false; 
                    loadNewTrash(); // Load new trash when dropped in the correct bin
                } else {
                    // Wrong bin - lose 20 seconds
                    console.log("Wrong bin!"); // Debugging message
                    timer = Math.max(0, timer - 10); // Decrease timer by 10 seconds (but not below 0)
                    updateTimerDisplay(timer); // Update the timer display

                    if (timer === 0) {
                        triggerGameOver(); // Trigger game over if time runs out
                    }
                }
            }
        });

        trashHeld = false; // Reset trashHeld
    }
}

