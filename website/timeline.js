const taskList = document.getElementById('task-list');
const timelineGrid = document.getElementById('timeline-grid');
const tasksPanel = document.getElementById('tasks-panel'); 
const DRAG_TYPE = 'text/plain';

// ----------------------------------------------------------------------
// --- SAVE/LOAD LOGIC 🎯 NEW ---
// ----------------------------------------------------------------------

/**
 * Gathers all task data from the DOM (scheduled and unscheduled) and saves it
 * to Local Storage.
 */
export function saveTasks() {
    const tasks = [];
    
    // Gather all unscheduled tasks
    document.querySelectorAll('#task-list > li').forEach(taskElement => {
        tasks.push({
            id: taskElement.id,
            name: taskElement.querySelector('span').textContent,
            status: 'unscheduled',
            isRunning: taskElement.classList.contains('running')
        });
    });

    // Gather all scheduled tasks
    document.querySelectorAll('#timeline-grid .time-slot > li').forEach(taskElement => {
        const slotId = taskElement.parentElement.id;
        tasks.push({
            id: taskElement.id,
            name: taskElement.querySelector('span').textContent,
            status: 'scheduled',
            slotId: slotId,
            isRunning: taskElement.classList.contains('running')
        });
    });

    localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Reads task data from Local Storage and recreates the corresponding DOM elements.
 * This should be called immediately after the timeline slots are generated.
 */
function loadTasks() {
    const savedTasks = localStorage.getItem('tasks');
    if (!savedTasks) return;
    
    const tasks = JSON.parse(savedTasks);
    
    // Clear existing lists before loading (only necessary if tasks were hardcoded)
    // taskList.innerHTML = '';
    
    tasks.forEach(taskData => {
        // Find existing element or create a new one
        let listItem = document.getElementById(taskData.id);

        if (!listItem) {
            listItem = document.createElement('li');
            listItem.id = taskData.id;
            listItem.setAttribute('draggable', 'true');
            
            // Recreate innerHTML structure
            listItem.innerHTML = `
                <span>${taskData.name}</span>
                <div class="task-controls">
                    <button class="delete-task-btn">🗑️</button>
                </div>
            `;
        }
        
        // Remove existing status classes for clean assignment
        listItem.classList.remove('unscheduled-task', 'scheduled-task', 'running');
        
        if (taskData.status === 'unscheduled') {
            listItem.classList.add('unscheduled-task');
            taskList.appendChild(listItem);
        } else if (taskData.status === 'scheduled') {
            listItem.classList.add('scheduled-task');
            
            // Re-add the Start button required for scheduled tasks
            const taskControls = listItem.querySelector('.task-controls');
            if (taskControls && !listItem.querySelector('.start-pomodoro-btn')) {
                const startButton = document.createElement('button');
                startButton.classList.add('start-pomodoro-btn');
                startButton.textContent = 'Start';
                taskControls.insertBefore(startButton, taskControls.firstChild);
            }
            
            const targetSlot = document.getElementById(taskData.slotId);
            if (targetSlot) {
                targetSlot.appendChild(listItem);
            }
        }
        
        if (taskData.isRunning) {
            listItem.classList.add('running');
        }
    });
}


// ----------------------------------------------------------------------
// --- DRAGSTART / DRAGEND LOGIC (FIXED) ---
// ----------------------------------------------------------------------

// 🎯 FIX: Changed dragstart to a global listener on document
document.addEventListener('dragstart', function(event) {
    // Only proceed if the target is an LI and it is marked as draggable
    if (event.target.matches('li[draggable="true"]')) {
        const draggedElement = event.target;
        
        event.dataTransfer.setData(DRAG_TYPE, draggedElement.id);
        
        // Timeout hides the original element immediately after drag starts
        setTimeout(() => {
            draggedElement.style.display = 'none';
        }, 0); 

        // Optional: Set a clearer drag image (uses the original element, but this can be tricky)
        // event.dataTransfer.setDragImage(draggedElement, 0, 0); 
        draggedElement.classList.add('is-dragging'); 
    }
});

// 🎯 MODIFIED: dragend now saves tasks state
document.addEventListener('dragend', function(event) {
    const draggedElement = event.target;
    
    draggedElement.style.display = ''; 
    draggedElement.classList.remove('is-dragging'); 
    timelineGrid.classList.remove('is-drag-target');
    tasksPanel.classList.remove('is-drag-target');
    
    // Clean up dragover visual cues on all time slots
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('is-drag-target');
    });

    saveTasks(); // 🎯 SAVE CALL ADDED HERE
});

// ----------------------------------------------------------------------
// --- DROP ZONE LISTENERS (No logic changes per user request) ---
// ----------------------------------------------------------------------

timelineGrid.addEventListener('dragover', function(event) {
    event.preventDefault(); 
    // Target the specific time slot being dragged over
    const target = event.target.closest('.time-slot');
    
    // Remove highlight from all slots before highlighting the target
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('is-drag-target');
    });

    if (target) {
        target.classList.add('is-drag-target');
    } else {
        // Fallback for dragging over timelineGrid but missing a slot
        timelineGrid.classList.add('is-drag-target');
    }
});

timelineGrid.addEventListener('drop', function(event) {
    event.preventDefault();
    timelineGrid.classList.remove('is-drag-target');

    const taskId = event.dataTransfer.getData(DRAG_TYPE);
    const draggedElement = document.getElementById(taskId);

    let targetSlot = event.target.closest('.time-slot');
    
    if (!targetSlot) return; // Must drop into a time slot

    // Positioning logic (keep existing)
    const slotRect = targetSlot.getBoundingClientRect();
    const mouseY = event.clientY;
    const dropInBottomHalf = mouseY > (slotRect.top + slotRect.height / 2);
    const existingTasks = targetSlot.querySelectorAll('.scheduled-task');

    if (draggedElement) {
        if (existingTasks.length === 1) {
            if (dropInBottomHalf) {
                targetSlot.appendChild(draggedElement);
            } else {
                targetSlot.insertBefore(draggedElement, existingTasks[0]);
            }
        } else {
            targetSlot.appendChild(draggedElement);
        }

        draggedElement.classList.remove('unscheduled-task', 'running');
        draggedElement.classList.add('scheduled-task'); 
        draggedElement.style.height = '100%'; 
        
        const taskControls = draggedElement.querySelector('.task-controls');
        // Add start button if it doesn't exist
        if (taskControls && !draggedElement.querySelector('.start-pomodoro-btn')) {
            const startButton = document.createElement('button');
            startButton.classList.add('start-pomodoro-btn');
            startButton.textContent = 'Start';
            taskControls.insertBefore(startButton, taskControls.firstChild); 
        }
        
        saveTasks(); // Save after successful drop
    }
});


tasksPanel.addEventListener('dragover', function(event) {
    event.preventDefault(); 
    tasksPanel.classList.add('is-drag-target');
});

tasksPanel.addEventListener('dragleave', function(event) {
    tasksPanel.classList.remove('is-drag-target');
});

tasksPanel.addEventListener('drop', function(event) { 
    event.preventDefault();
    tasksPanel.classList.remove('is-drag-target'); 

    const taskId = event.dataTransfer.getData(DRAG_TYPE);
    const draggedElement = document.getElementById(taskId);
    
    if (draggedElement) {
        // Move task back to the unscheduled list
        taskList.appendChild(draggedElement); 
        
        draggedElement.style.height = ''; 
        
        draggedElement.classList.remove('scheduled-task', 'running');
        draggedElement.classList.add('unscheduled-task'); 
        
        // Remove start button
        const startButton = draggedElement.querySelector('.start-pomodoro-btn');
        if (startButton) {
            startButton.remove();
        }
        
        saveTasks(); // Save after successful drag back
    }
});

// ----------------------------------------------------------------------
// --- TIMELINE GENERATION / INITIALIZATION ---
// ----------------------------------------------------------------------

function generateTimelineSlots() {
    const startHour = 8; 
    const endHour = 24; 
    
    timelineGrid.innerHTML = ''; 

    for (let hour = startHour; hour < endHour; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
            
            const time24 = hour;
            const ampm = time24 < 12 || time24 === 24 ? 'AM' : 'PM';
            let displayHour = time24 % 12;
            if (displayHour === 0) displayHour = 12;

            const timeString = `${displayHour}:${String(minute).padStart(2, '0')} ${ampm}`;

            // Add time label for the start of the hour
            if (minute === 0) {
                const timeLabel = document.createElement('div');
                timeLabel.classList.add('time-label');
                timeLabel.textContent = timeString;
                timelineGrid.appendChild(timeLabel);
            }
            
            const timeSlot = document.createElement('div');
            timeSlot.classList.add('time-slot');
            timeSlot.id = `slot-${time24}-${minute}`;

            // Add a blank space next to the 30-minute mark to align the grid
            if (minute === 30) {
                 const blankLabel = document.createElement('div');
                 timelineGrid.appendChild(blankLabel);
            }

            timelineGrid.appendChild(timeSlot);
        }
    }
}

// 🎯 INITIALIZATION: Generate slots, then load any saved tasks
generateTimelineSlots();
loadTasks();
