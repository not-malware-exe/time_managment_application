const taskList = document.getElementById('task-list');
const timelinePanel = document.getElementById('timeline-panel');

// --- Drag Start (Attach to the task list parent via delegation) ---
taskList.addEventListener('dragstart', function(event) {
    // Only target list items (the tasks)
    if (event.target.matches('li')) {
        // Store the task's unique ID
        event.dataTransfer.setData('text/plain', event.target.id);
        // Optional: Add a style class to show the user what is being dragged
        event.target.classList.add('is-dragging'); 
    }
});

taskList.addEventListener('dragend', function(event) {
    // Remove the drag style when the drag is finished (whether dropped or not)
    event.target.classList.remove('is-dragging'); 
});


// --- Drag Over (On the timeline panel - The Drop Zone) ---
timelinePanel.addEventListener('dragover', function(event) {
    // Required to allow an element to be dropped
    event.preventDefault(); 
});


// --- Drop (On the timeline panel) ---
timelinePanel.addEventListener('drop', function(event) {
    event.preventDefault();

    // 1. Retrieve the task ID
    const taskId = event.dataTransfer.getData('text/plain');
    
    // 2. Find the element
    const draggedElement = document.getElementById(taskId);
    
    // 3. Move the element into the timeline
    if (draggedElement) {
        timelinePanel.appendChild(draggedElement);
        // Optional: Remove the Start button if it's now 'scheduled'
        const startButton = draggedElement.querySelector('.start-pomodoro-btn');
        if (startButton) {
             startButton.remove();
        }
        draggedElement.classList.add('scheduled-task');
        // You might want to add a timestamp display here!
    }
});