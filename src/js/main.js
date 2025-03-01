// Get uuid from query
const uuid = getQueryParam("user");
// Load skin with uuid
const skinUrl = `https://crafatar.com/skins/${uuid}`;


// Create top skin viewer
const viewer = new skinview3d.SkinViewer({
    canvas: document.getElementById("skin-container"),
    width: 300,
    height: 400,
    skin: skinUrl
});

viewer.animation = new skinview3d.IdleAnimation();
viewer.controls.enableRotate = true;
viewer.controls.enableZoom = false;
viewer.zoom = 0.8;
viewer.autoRotate = true;
viewer.autoRotateSpeed = 0.65;

// Create bottom inventory skin viewer
const invViewer = new skinview3d.SkinViewer({
  canvas: document.getElementById("inv-skin-container"),
  height: 202,
  width: 140,
  skin: skinUrl
});

invViewer.controls.enableRotate = false;
invViewer.controls.enableZoom = false;

// Load player stats and both capes
loadStats(uuid);
loadCape(uuid);

async function loadCape(uuid) {
  const url = `https://crafatar.com/capes/${uuid}`;
  const res = await fetch(url);
  if (res.status === 400) {
    viewer.loadCape(null);
    invViewer.loadCape(null);
  } else if (res.ok) {
    viewer.loadCape(url);
    invViewer.loadCape(url);
  } else {
    console.log(`User ${uuid} has no cape.`)
    viewer.loadCape(null);
    invViewer.loadCape(null);
  }
}

async function loadStats(uuid) {
  const response = await fetch(`https://api.minetools.eu/uuid/${uuid}`);
  const data = await response.json();

  const formattedUuid = formatUUID(uuid);
  const hgStats = await loadHGLaborStats(formattedUuid);

  const statsContainer = document.querySelector('.stats');
  statsContainer.innerHTML = `
    <div><img class="icon" src="./images/items/421-0.png" alt="username"> Username: ${data.name}</div>
    ${hgStats}
  `;

}

// Get stats from hglabor api and load them as html
async function loadHGLaborStats(uuid) {
  const response = await fetch(`https://api.hglabor.de/stats/ffa/${uuid}`)
  const data = await response.json();
  const kdr = (data.deaths === 0) ? data.kills : (data.kills / data.deaths).toFixed(2);

  const stats = `
  <div><img class="icon" src="./images/items/276-0.png" alt="kills"> Kills: ${data.kills}</div>
  <div><img class="icon" src="./images/items/397-0.png" alt="deaths"> Deaths: ${data.deaths}</div>
  <div><img class="icon" src="./images/items/327-0.png" alt="kdr"> KDR: ${kdr}</div>
  <div><img class="icon" src="./images/items/266-0.png" alt="bounty"> Bounty: ${data.bounty}</div>
  <div><img class="icon" src="./images/items/449-0.png" alt="top killstreak"> Highest Killstreak: ${data.highestKillStreak}</div>
  <div><img class="icon" src="./images/items/377-0.png" alt="killstreak"> Current Killstreak: ${data.currentKillStreak}</div>
  `
  return stats;
}

// Formate uuids from normal string to string with dashes
function formatUUID(uuid) {
  return uuid.replace(/^(.{8})(.{4})(.{4})(.{4})(.{12})$/, '$1-$2-$3-$4-$5');
}

// Pares querey parameters
function getQueryParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
}



// Move head rotation to look at cursor
let lastMouseX = 0;
let lastMouseY = 0;

function updatePlayerRotation(mouseX, mouseY) {
    const rect = invViewer.canvas.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const diffX = (mouseX - centerX) / rect.width;
    const diffY = (mouseY - centerY) / rect.height;

    const maxAngleX = Math.PI / 25;
    const maxAngleY = Math.PI / 18;
    const bodyFactor = 0.5;

    let rotX = -diffY * maxAngleY;
    let rotY = -diffX * maxAngleX; 

    const player = invViewer.playerObject;

    player.skin.head.innerLayer.rotation.set(-rotX, -rotY, 0);
    player.skin.head.outerLayer.rotation.set(-rotX, -rotY, 0);

    player.rotation.set(-rotX * bodyFactor, -rotY * bodyFactor, 0);
}

document.addEventListener("mousemove", (e) => {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;
    updatePlayerRotation(lastMouseX, lastMouseY);
});

document.addEventListener("scroll", () => {
    updatePlayerRotation(lastMouseX, lastMouseY);
});


/* Skinn rotation timeout */

let isDragging = false;
let timeout;

// Funktion zum Stoppen der Rotation
function stopAutoRotate() {
    viewer.autoRotate = false;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
        viewer.autoRotate = true;
    }, 1000); // Nach 3 Sekunden Inaktivität AutoRotate wieder aktivieren
}

// Maus-Events für das Bewegen der Kamera
viewer.canvas.addEventListener("mousedown", () => {
    isDragging = true;
    stopAutoRotate();
});

viewer.canvas.addEventListener("mouseup", () => {
    isDragging = false;
});

viewer.canvas.addEventListener("mousemove", () => {
    if (isDragging) {
        stopAutoRotate();
    }
});

// Touch-Events für mobile Geräte
viewer.canvas.addEventListener("touchstart", stopAutoRotate);
viewer.canvas.addEventListener("touchend", () => {
    timeout = setTimeout(() => {
        viewer.autoRotate = true;
    }, 1000);
});
viewer.canvas.addEventListener("touchmove", stopAutoRotate);

/* =================================================================
 *                      Inventory Items
 * ================================================================= */

async function fetchInventory(uuid, gm) {
  const res = await fetch(`https://api.hglabor.de/ffa/inventory/${uuid}/${gm}`);
  if (!res.ok) {
      console.error(`Fehler: ${res.status} ${res.statusText}`);
      return;
  }

  const data = await res.json();
  const armor = {
    helmet: fixAndParseJson(data.armor[3]),
    chestplate: fixAndParseJson(data.armor[2]),
    leggings: fixAndParseJson(data.armor[1]),
    boots: fixAndParseJson(data.armor[0]),
  }

  const offhand = fixAndParseJson(data.offhand[0]);
  const { inventoryItems, hotbarItems } = organizeInventory(data.main);

  const armorSlots = document.querySelector('.armor')
  const offhandSlot = document.querySelector('.offhand');
  const inventorySlots = document.querySelector('.inv_container');
  const hotbarSlots = document.querySelector('.hotbar');
  console.log(offhand);

  loadSlots(armorSlots, Object.values(armor));
  loadSlots(offhandSlot, [offhand]);
  loadSlots(inventorySlots, inventoryItems); // 3x9 Inventar
  loadSlots(hotbarSlots, hotbarItems); // 1x9 Hotbar}
}


function fixAndParseJson(brokenString) {
  if (typeof brokenString !== "string") {
      console.error("Not a string!", brokenString);
      return null;
  }

  try {
      // Remove \n
      let fixedString = brokenString.replace(/\n/g, "").trim();
      // Remove other random string stuff
      fixedString = fixedString.replace(/([{,]\s*)(\w+)(\s*:)/g, '$1"$2"$3');

      // Filters
      // Return empty if string contains empty (no need to/can't parse)
      if (fixedString === "EMPTY") {
        return { id: "EMPTY" };
      }
      // Fix compass return bcs smth is broken with the raw given string from the api
      if (fixedString.includes('"id": "minecraft:compass"')) {
        fixedString = '{"data":[],"count":1,"id":"minecraft:compass"}';
      }

      const parsedData = JSON.parse(fixedString);

      return parsedData;
  } catch (error) {
      console.error("JSON konnte nicht repariert werden:", error);
      console.error("Fehlerhafter String:", brokenString);
      return null;
  }
}

function organizeInventory(main) {
  const inventoryItems = []; // 3x9 Inventar
  const hotbarItems = []; // 1x9 Hotbar

  main.forEach((slot, index) => {
      const parsedItem = fixAndParseJson(slot);
      
      if (parsedItem === "EMPTY" || !parsedItem) {
          return; // Überspringt leere Slots
      }

      if (index < 9) {
          hotbarItems.push(parsedItem); // Erste 9 Slots in die Hotbar
      } else {
          inventoryItems.push(parsedItem); // Der Rest ins Inventar
      }
  });

  return { inventoryItems, hotbarItems };
}


function loadSlots(targetContainer, items) {
    // Stelle sicher, dass der Container existiert
    if (!targetContainer || !Array.isArray(items)) {
        console.error("Ungültige Parameter für loadSlots!");
        return;
    }

    // Container leeren, um vorherige Elemente zu entfernen
    targetContainer.innerHTML = "";

    items.forEach((item, index) => {
        if (!item || item === "EMPTY") {
          const placeholder = document.createElement("div");
          placeholder.classList.add("inventory-slot");
          targetContainer.appendChild(placeholder);  
          return;
        }

        // Extrahiere den Item-Namen (entferne "minecraft:")
        const itemName = item.id.replace("minecraft:", "");

        // Neues div-Element erstellen
        const slot = document.createElement("div");
        slot.classList.add("inventory-slot"); // Falls du spezifische Styles anwenden willst

        // Hintergrundbild setzen
        slot.style.backgroundImage = `url('./images/inventory/${itemName}.png')`;
        slot.style.backgroundSize = "contain"; // Sicherstellen, dass das Bild vollständig sichtbar ist
        slot.style.backgroundRepeat = "no-repeat";
        slot.style.backgroundPosition = "center";

        // Item-Anzahl als Text hinzufügen, falls vorhanden und größer als 1
        if (item.count > 1) {
            const countLabel = document.createElement("span");
            countLabel.classList.add("item-count");
            countLabel.textContent = item.count;
            slot.appendChild(countLabel);
        }

        // Slot dem Container hinzufügen
        targetContainer.appendChild(slot);
    });
}

fetchInventory(uuid, 'uhc')