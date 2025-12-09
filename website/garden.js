const gardenContainer = document.getElementById("plant-display-grid"); // Matches the updated HTML
const TASK_PROGRESS_KEY = 'taskProgress'; 

// Growth Stages: Index 0=Seed, Index 1=Fruit
const growthIcons = ["🌱", "🍅"]; 

// --- Display Functions ---

function renderGarden() {
    gardenContainer.innerHTML = ''; // Clear previous content
    
    // Load all task progress saved by the scheduler app
    const taskProgress = JSON.parse(localStorage.getItem(TASK_PROGRESS_KEY) || '{}');

    // Create a plant item for every tracked task
    for (const [taskId, data] of Object.entries(taskProgress)) {
        
        const stage = data.growthStage || 0; // 0 for Seed, 1 for Fruit
        const icon = growthIcons[stage];
        const statusText = stage === 1 ? 'Grown Fruit' : 'Seed';

        const gardenItem = document.createElement('div');
        gardenItem.id = `garden-${taskId}`; 
        gardenItem.classList.add('garden-item', `stage-${stage}`);
        
        gardenItem.innerHTML = `
            <span class="plant-icon">${icon}</span>
            <span class="plant-label">${data.name}</span>
            <span style="font-size: 0.6em; color: #888;">(${statusText})</span>
        `;
        
        gardenContainer.appendChild(gardenItem);
    }
}

// --- Initialization ---
document.addEventListener('DOMContentLoaded', renderGarden);
