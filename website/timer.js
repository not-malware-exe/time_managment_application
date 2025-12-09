const timerDisplay = document.getElementById('timer-display');
const DEFAULT_DURATION = 25; 

let totalSeconds;
let timerInterval = null;
let runningTaskTime; // 🎯 NEW: Store the time (in seconds) the timer was set for

// 🎯 NEW: Helper function to save the timer state to Local Storage
function saveTimerState(startTime, duration) {
    localStorage.setItem('timerState', JSON.stringify({
        startTime: startTime,
        duration: duration, // original duration in minutes
        taskTime: runningTaskTime // total seconds of the task
    }));
}

// 🎯 NEW: Helper function to retrieve the timer state from Local Storage
function loadTimerState() {
    const savedState = localStorage.getItem('timerState');
    if (savedState) {
        return JSON.parse(savedState);
    }
    return null;
}

// 🎯 NEW: Function to clear the timer state from Local Storage
export function clearTimerState() {
    localStorage.removeItem('timerState');
}

function updateTimer() {
    if (totalSeconds <= 0) {
        clearInterval(timerInterval); 
        timerInterval = null; // Important: reset interval handle
        timerDisplay.textContent = "Time's up!";
        clearTimerState(); // Clear state when timer finishes
        return;
    }

    totalSeconds--; 
    
    // Save state every second while running
    saveTimerState(Date.now(), runningTaskTime / 60);

    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    const formattedTime = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
        
    timerDisplay.textContent = formattedTime;
}

export function startTimer(durationMinutes) {
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    runningTaskTime = durationMinutes * 60; // Store the full duration
    totalSeconds = runningTaskTime; 

    timerInterval = setInterval(updateTimer, 1000); 
}

// 🎯 MODIFIED: Reset function now also clears local storage
export function resetTimerDisplay(minutes = DEFAULT_DURATION) {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    clearTimerState(); // Clear state on manual reset
    totalSeconds = minutes * 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:00`;
}

// 🎯 MODIFIED: Function to check if the timer is currently running
export function isTimerRunning() {
    return timerInterval !== null;
}

// 🎯 NEW: Logic to resume the timer upon loading
export function resumeTimer() {
    const state = loadTimerState();
    if (state) {
        const elapsedMilliseconds = Date.now() - state.startTime;
        const remainingSeconds = Math.max(0, state.taskTime - Math.floor(elapsedMilliseconds / 1000));
        
        if (remainingSeconds > 0) {
            totalSeconds = remainingSeconds;
            runningTaskTime = state.taskTime; // Restore full duration
            timerInterval = setInterval(updateTimer, 1000);
            return true;
        } else {
            // Timer expired while app was closed
            clearTimerState();
            resetTimerDisplay();
        }
    }
    resetTimerDisplay();
    return false;
}

resumeTimer(); // Call resume logic when module loads
