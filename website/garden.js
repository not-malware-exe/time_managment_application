const grid = document.getElementById("gardenGrid");

// Inventory
let inventory = {
  Carrot: 100,
  Sunflower: 100,
  Pumpkin: 100
};

const inventoryElements = {
  Carrot: document.getElementById("carrotCount"),
  Sunflower: document.getElementById("sunflowerCount"),
  Pumpkin: document.getElementById("pumpkinCount")
};

// Growth Stages
const growthStages = {
  Carrot: ["🌱", "🥕"],
  Sunflower: ["🌱", "🌻"],
  Pumpkin: ["🌱", "🎃"]
};

// Create Soil
for (let i = 0; i < 20; i++) {
  const soil = document.createElement("div");
  soil.classList.add("soil");
  soil.dataset.stage = "0";
  soil.dataset.type = "";

  soil.addEventListener("dragover", (e) => {
    e.preventDefault();
    soil.classList.add("drag-over");
  });

  soil.addEventListener("dragleave", () => {
    soil.classList.remove("drag-over");
  });

  soil.addEventListener("drop", (e) => {
    e.preventDefault();
    soil.classList.remove("drag-over");

    const data = e.dataTransfer.getData("text/plain");

    if (data === "water") {
      waterPlant(soil);
    } else {
      plantSeed(soil, data);
    }
  });

  grid.appendChild(soil);
}

// Drag seeds
document.querySelectorAll(".seed").forEach(seed => {
  seed.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", seed.dataset.seed);
  });
});

// Drag watering can
document.querySelector(".tool").addEventListener("dragstart", (e) => {
  e.dataTransfer.setData("text/plain", "water");
});

// Plant seed
function plantSeed(soil, type) {
  if (soil.dataset.type !== "") return;
  if (inventory[type] <= 0) {
    alert("Out of seeds!");
    return;
  }

  inventory[type]--;
  inventoryElements[type].textContent = inventory[type];

  soil.dataset.type = type;
  soil.dataset.stage = "0";
  soil.textContent = growthStages[type][0];

  soil.ondblclick = () => {
    soil.textContent = "";
    soil.dataset.type = "";
    soil.dataset.stage = "0";
  };
}

// Water plant to grow
function waterPlant(soil) {
  if (!soil.dataset.type) return;

  let stage = Number(soil.dataset.stage);
  let plant = soil.dataset.type;

  if (stage < growthStages[plant].length - 1) {
    stage++;
    soil.dataset.stage = stage;
    soil.textContent = growthStages[plant][stage];
  }
}
