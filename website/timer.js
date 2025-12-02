// Get the display element once
const timerDisplay = document.getElementById('timer-display');

let totalSeconds;
let timerInterval;

// The main function that app.js will call
export function startTimer(durationMinutes) {
    // Clear any existing timer
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    totalSeconds = durationMinutes * 60; 

    // Define the update function
    function updateTimer() {
        if (totalSeconds <= 0) {
            clearInterval(timerInterval); 
            timerDisplay.textContent = "Time's up!";
            return;
        }

        totalSeconds--; 

        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;

        // Pad Start ensures 5 seconds looks like 05
        const formattedTime = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            
        timerDisplay.textContent = formattedTime;
    }
    
    // Start the interval and save its reference
    timerInterval = setInterval(updateTimer, 1000); 
}

// Optional: Function to display the default state
export function resetTimerDisplay(minutes = 25) {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:00`;
}

// Ensure the timer displays the default time when loaded
resetTimerDisplay();