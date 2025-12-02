// Import the necessary function from the timer module
import { startTimer } from './timer.js'; 

// References to HTML elements
const taskInput = document.getElementById('task-input');
const addTaskBtn = document.getElementById('add-task-btn');
const taskList = document.getElementById('task-list');

// Variable to ensure each task has a unique ID for drag/drop
let taskIdCounter = 0; 


// --- A. Task Creation Logic ---
addTaskBtn.addEventListener('click', function() {
    const taskName = taskInput.value.trim();

    if (taskName !== '') {
        const uniqueId = `task-${taskIdCounter++}`;

        // 1. Create the new list item
        const listItem = document.createElement('li');
        
        // 2. Set the ID and make it draggable!
        listItem.id = uniqueId;
        listItem.setAttribute('draggable', 'true');
        
        // 3. Set the content
        listItem.innerHTML = `
            <span>${taskName}</span>
            <button class="start-pomodoro-btn">Start</button>
        `;
        
        // 4. Add to the list and clear input
        taskList.appendChild(listItem);
        taskInput.value = '';
    }
});


// --- B. Timer Start Logic (Event Delegation) ---
// Listen on the parent container (taskList) for any clicks inside it
taskList.addEventListener('click', function(event) {
    // If the clicked element matches the 'Start' button class
    if (event.target.matches('.start-pomodoro-btn')) {
        // Find the task name (optional)
        const taskElement = event.target.closest('li');
        const taskName = taskElement.querySelector('span').textContent;

        console.log(`Starting Pomodoro for: ${taskName}`);
        
        // **Call the imported function!** // We call the startTimer function that came from timer.js
        startTimer(25); // 25 minutes standard
    }
});