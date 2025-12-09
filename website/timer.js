const timerDisplay = document.getElementById('timer-display');
const DEFAULT_DURATION = 1; 

// Local Storage Keys
const TIMER_STATE_KEY = 'timerState';
const TASK_PROGRESS_KEY = 'taskProgress'; // Key used for garden persistence

let totalSeconds;
let timerInterval = null;
let runningTaskTime; 

// --- Persistence Functions ---

function saveTimerState(startTime, duration) {
    localStorage.setItem(TIMER_STATE_KEY, JSON.stringify({
        startTime: startTime,
        duration: duration,
        taskTime: runningTaskTime
    }));
}

function loadTimerState() {
    const savedState = localStorage.getItem(TIMER_STATE_KEY);
    if (savedState) {
        return JSON.parse(savedState);
    }
    return null;
}

export function clearTimerState() {
    localStorage.removeItem(TIMER_STATE_KEY);
}

// --- Core Timer Logic ---

function updateTimer() {
    if (totalSeconds <= 0) {
        clearInterval(timerInterval); 
        timerInterval = null; 
        timerDisplay.textContent = "Time's up!";
        clearTimerState(); 
        
        // 🎯 GARDEN INTEGRATION: Auto-Grow to Stage 1 (Fruit)
        const runningTask = document.querySelector('.running');
        if (runningTask) {
            const taskId = runningTask.id;
            const taskName = runningTask.querySelector('span').textContent;

            let progress = JSON.parse(localStorage.getItem(TASK_PROGRESS_KEY) || '{}');
            
            // Set GROWTH STAGE TO 1 (Fully Grown)
            if (progress[taskId]) {
                progress[taskId].status = 'Completed'; 
                progress[taskId].growthStage = 1; 
            }
            localStorage.setItem(TASK_PROGRESS_KEY, JSON.stringify(progress));
            
            runningTask.classList.remove('running');
            
            alert(`Task "${taskName}" is complete! Your seed has fully grown in the Garden. 🍅`);
            
            // Re-save task list state (via timeline.js) to persist the running class removal
            if (window.saveTasks) window.saveTasks(); 
        }
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
    
    runningTaskTime = durationMinutes * 60; 
    totalSeconds = runningTaskTime; 

    timerInterval = setInterval(updateTimer, 1000); 
}

export function resetTimerDisplay(minutes = DEFAULT_DURATION) {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    clearTimerState(); 
    totalSeconds = minutes * 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:00`;
}

export function isTimerRunning() {
    return timerInterval !== null;
}

export function resumeTimer() {
    const state = loadTimerState();
    if (state) {
        const elapsedMilliseconds = Date.now() - state.startTime;
        const remainingSeconds = Math.max(0, state.taskTime - Math.floor(elapsedMilliseconds / 1000));
        
        if (remainingSeconds > 0) {
            totalSeconds = remainingSeconds;
            runningTaskTime = state.taskTime; 
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

// Run resume logic when the module loads
resumeTimer();
