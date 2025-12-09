import { startTimer, resetTimerDisplay, isTimerRunning, clearTimerState } from './timer.js'; 
import { saveTasks } from './timeline.js'; // Must be exported from timeline.js

const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');
const mainContent = document.getElementById('main-content'); 

let taskIdCounter = 0; 

// 1. --- Helper Functions ---

function showNotification(message) {
    console.log(`[Notification] ${message}`); 
    // Using alert for temporary notification display
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
             // Use 0 if no tasks exist initially
             taskIdCounter = 0;
        }


        const uniqueId = `task-${taskIdCounter++}`;

        const listItem = document.createElement('li');
        
        listItem.id = uniqueId;
        listItem.setAttribute('draggable', 'true'); 
        listItem.classList.add('unscheduled-task'); 
        
        // Inner HTML structure for task name and control group
        listItem.innerHTML = `
            <span>${taskName}</span>
            <div class="task-controls">
                <button class="delete-task-btn">🗑️</button>
            </div>
        `;
        
        taskList.appendChild(listItem); 
        taskInput.value = '';
        
        saveTasks(); // Save state after creation
    }
}

// 2. --- Task Creation and Input Listeners ---

// A. Button Click Listener
addTaskBtn.addEventListener('click', createTask);

// B. Enter Key Listener on the Input Field
taskInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevent default form submission behavior
        createTask();
    }
});

// 3. --- Unified Click Handler for Timer and Deletion ---

mainContent.addEventListener('click', function(event) {
    
    // Timer Start Logic
    if (event.target.matches('.start-pomodoro-btn')) {
        
        if (isTimerRunning()) {
            showNotification("Timer was reset because a new task was started.");
            resetTimerDisplay(); 
        }
        
        startTimer(25); // Start 25-minute Pomodoro

        // Update 'running' class for visual feedback
        document.querySelectorAll('.running').forEach(el => el.classList.remove('running'));
        event.target.closest('li').classList.add('running'); 
    }
    
    // Task Deletion Logic
    else if (event.target.matches('.delete-task-btn')) {
        const taskToDelete = event.target.closest('li');
        
        if (taskToDelete) {
            const wasRunning = taskToDelete.classList.contains('running');
            
            taskToDelete.remove(); 

            if (wasRunning) {
                // Reset timer display and clear persistent state
                resetTimerDisplay(); 
                clearTimerState(); 
                showNotification("The running task was deleted, so the timer was reset.");
            }
            
            saveTasks(); // Save state after deletion
        }
    }
});
