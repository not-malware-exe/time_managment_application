import { startTimer, resetTimerDisplay, isTimerRunning, clearTimerState } from './timer.js'; 
import { saveTasks } from './timeline.js'; 

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const mainContent = document.getElementById('main-content'); 

let taskIdCounter = 0; 
const TASK_PROGRESS_KEY = 'taskProgress'; // Key used for garden persistence

function showNotification(message) {
    console.log(`[Notification] ${message}`); 
    alert(message); 
}

function createTask() {
    const taskName = taskInput.value.trim();

    if (taskName !== '') {
        // Ensure unique IDs start higher than any ID loaded from storage
        const currentMaxId = Array.from(document.querySelectorAll('[id^="task-"]'))
            .map(el => parseInt(el.id.split('-')[1]))
            .filter(n => !isNaN(n));
        
        if (currentMaxId.length > 0) {
             taskIdCounter = Math.max(...currentMaxId) + 1;
        } else {
             taskIdCounter = 0;
        }

        const uniqueId = `task-${taskIdCounter++}`;

        const listItem = document.createElement('li');
        
        listItem.id = uniqueId;
        listItem.setAttribute('draggable', 'true'); 
        listItem.classList.add('unscheduled-task'); 
        
        listItem.innerHTML = `
            <span>${taskName}</span>
            <div class="task-controls">
                <button class="delete-task-btn">🗑️</button>
            </div>
        `;
        
        taskList.appendChild(listItem); 
        taskInput.value = '';
        
        // 🎯 GARDEN INTEGRATION: Initialize Task Progress in Local Storage (Stage 0: Seed)
        let progress = JSON.parse(localStorage.getItem(TASK_PROGRESS_KEY) || '{}');
        progress[uniqueId] = { 
            name: taskName, 
            status: 'Seed', 
            growthStage: 0 
        };
        localStorage.setItem(TASK_PROGRESS_KEY, JSON.stringify(progress));

        saveTasks(); 
    }
}

// --- Listeners ---

// 1. Button Click Listener
addTaskBtn.addEventListener('click', createTask);

// 2. Enter Key Listener
taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); 
        createTask();
    }
});

// 3. Unified Click Handler for Timer and Deletion
mainContent.addEventListener('click', function(event) {
    
    // Timer Start Logic
    if (event.target.matches('.start-pomodoro-btn')) {
        
        if (isTimerRunning()) {
            showNotification("Timer was reset because a new task was started.");
            resetTimerDisplay(); 
        }
        
        startTimer(1); 

        // Update 'running' class 
        document.querySelectorAll('.running').forEach(el => el.classList.remove('running'));
        event.target.closest('li').classList.add('running'); 
    }
    
    // Task Deletion Logic
    else if (event.target.matches('.delete-task-btn')) {
        const taskToDelete = event.target.closest('li');
        
        if (taskToDelete) {
            const taskId = taskToDelete.id; 
            const wasRunning = taskToDelete.classList.contains('running');
            
            taskToDelete.remove(); 
            
            // 🎯 GARDEN INTEGRATION: Remove task from persistent progress data
            let progress = JSON.parse(localStorage.getItem(TASK_PROGRESS_KEY) || '{}');
            delete progress[taskId];
            localStorage.setItem(TASK_PROGRESS_KEY, JSON.stringify(progress));

            if (wasRunning) {
                resetTimerDisplay(); 
                clearTimerState(); 
                showNotification("The running task was deleted, so the timer was reset.");
            }
            
            saveTasks(); 
        }
    }
});
