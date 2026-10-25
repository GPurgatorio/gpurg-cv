import { ASSETS } from "./assets.js";
import { PROJECTS_DATA } from "./data.js";

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
ctx.imageSmoothingEnabled = false;

// Internal resolution of the game screen (4:3 aspect ratio, retro-style)
const VIEW_WIDTH = 320;
const VIEW_HEIGHT = 240;
canvas.width = VIEW_WIDTH;
canvas.height = VIEW_HEIGHT;

// --------------------------------------------------
// 1. GAME MAP CONFIGURATION (Grid: 16x16 pixels per tile)
// --------------------------------------------------
const TILE_SIZE = 16;

// Tile dictionary matching indices to ASSETS.tiles key names
const TILE_TYPES = {
  0: "grass",       // Walkable
  1: "path",        // Walkable
  2: "water",       // Solid / Animated
  3: "floor",       // Lab Walkable
  4: "wall_brick",  // Solid / Traditional
  5: "wall_tech",   // Solid / Futuristic
  6: "roof",        // Solid / Generic
  7: "console",     // Solid / Tables
  8: "grass_flowers", // Walkable meadow
  9: "tree_top",    // Solid pine foliage
  10: "tree_trunk", // Solid pine wood base
  11: "signpost",   // Solid bulletin sign
  // Theme A: Cyber Center
  12: "cyber_roof_left",
  13: "cyber_roof_center",
  14: "cyber_roof_right",
  15: "cyber_roof_top",
  16: "cyber_wall_left",
  17: "cyber_wall_center",
  18: "cyber_wall_right",
  19: "cyber_window",
  20: "cyber_door_left",
  21: "cyber_door_right",
  // Theme B: Skills Academy
  22: "school_roof_left",
  23: "school_roof_center",
  24: "school_roof_right",
  25: "school_roof_top",
  26: "school_wall_left",
  27: "school_wall_center",
  28: "school_wall_right",
  29: "school_window",
  30: "school_door_left",
  31: "school_door_right",
  // Theme C: Cozy Lounge
  32: "cozy_roof_left",
  33: "cozy_roof_center",
  34: "cozy_roof_right",
  35: "cozy_roof_top",
  36: "cozy_wall_left",
  37: "cozy_wall_center",
  38: "cozy_wall_right",
  39: "cozy_window",
  40: "cozy_door_left",
  41: "cozy_door_right",
  // Interior Walls
  42: "wall_wood"
};

const SOLID_TILES = new Set([
  2, 4, 5, 6, 7,
  10, 11,
  16, 17, 18, 19,
  26, 27, 28, 29,
  36, 37, 38, 39,
  42
]);

// Helper to determine if a tile is drawn in the foreground (Pass B) on top of the player and NPCs
function isForegroundTile(tileIndex) {
  return tileIndex === 9 || // tree_top
         (tileIndex >= 12 && tileIndex <= 15) || // cyber roof
         (tileIndex >= 22 && tileIndex <= 25) || // school roof
         (tileIndex >= 32 && tileIndex <= 35);   // cozy roof
}

// Multi-Map State Engine
const MAPS = {
  town: {
    cols: 32,
    rows: 24,
    grid: [],
    npcs: [
      { id: "azzurra", sprite: "azzurra", x: 13 * TILE_SIZE, y: 18 * TILE_SIZE, dir: "right" },
      { id: "leone", sprite: "leone", x: 13 * TILE_SIZE, y: 19 * TILE_SIZE, dir: "right" },
      { id: "town-guide", sprite: "architect", x: 17 * TILE_SIZE, y: 18 * TILE_SIZE, dir: "left", isWandering: true },
      { id: "recruiter-npc", sprite: "engineer", x: 15 * TILE_SIZE, y: 15 * TILE_SIZE, dir: "down", isWandering: true }
    ],
    warps: [],
    signs: [],
    placedHouses: []
  },
  projects_interior: {
    cols: 10,
    rows: 10,
    grid: [],
    npcs: [
      { id: "tech-advisor", sprite: "architect", x: 5 * TILE_SIZE, y: 4 * TILE_SIZE, dir: "down" }
    ],
    warps: [
      { fromX: 4, fromY: 9, toMap: "town", toX: 4, toY: 15, facing: "down" }, // Adjusted dynamically in warp trigger
      { fromX: 5, fromY: 9, toMap: "town", toX: 5, toY: 15, facing: "down" }
    ]
  },
  skills_interior: {
    cols: 28,
    rows: 9,
    grid: [],
    npcs: [
      { id: "skills-advisor", sprite: "architect", x: 2 * TILE_SIZE, y: 5 * TILE_SIZE, dir: "right" },
      { id: "high-school", sprite: "developer", x: 5 * TILE_SIZE, y: 4 * TILE_SIZE, dir: "down" },
      { id: "thesis-helios", sprite: "engineer", x: 8 * TILE_SIZE, y: 6 * TILE_SIZE, dir: "up" },
      { id: "lab-assistant", sprite: "developer", x: 12 * TILE_SIZE, y: 4 * TILE_SIZE, dir: "down" },
      { id: "thesis-webshell", sprite: "developer", x: 16 * TILE_SIZE, y: 6 * TILE_SIZE, dir: "up" },
      { id: "storm-reply", sprite: "architect", x: 20 * TILE_SIZE, y: 4 * TILE_SIZE, dir: "down" },
      { id: "zero12", sprite: "engineer", x: 24 * TILE_SIZE, y: 6 * TILE_SIZE, dir: "up" }
    ],
    warps: [
      { fromX: 4, fromY: 8, toMap: "town", toX: 12, toY: 15, facing: "down" },
      { fromX: 5, fromY: 8, toMap: "town", toX: 13, toY: 15, facing: "down" }
    ]
  },
  contact_interior: {
    cols: 10,
    rows: 10,
    grid: [],
    npcs: [
      { id: "contact-assistant", sprite: "developer", x: 4 * TILE_SIZE, y: 5 * TILE_SIZE, dir: "down" },
      { id: "contact-linkedin", sprite: "logo_linkedin", x: 2 * TILE_SIZE, y: 4 * TILE_SIZE, dir: "right" },
      { id: "contact-email", sprite: "logo_email", x: 5 * TILE_SIZE, y: 2 * TILE_SIZE, dir: "down" },
      { id: "contact-github", sprite: "logo_github", x: 7 * TILE_SIZE, y: 4 * TILE_SIZE, dir: "left" }
    ],
    warps: [
      { fromX: 4, fromY: 9, toMap: "town", toX: 20, toY: 15, facing: "down" },
      { fromX: 5, fromY: 9, toMap: "town", toX: 21, toY: 15, facing: "down" }
    ]
  }
};

// Grid Procedural Constructor
function createGrid(w, h, fillVal = 0) {
  const grid = [];
  for (let r = 0; r < h; r++) {
    grid.push(new Array(w).fill(fillVal));
  }
  return grid;
}

function fillRectOnGrid(grid, w, h, startCol, startRow, width, height, tileIndex) {
  for (let r = startRow; r < startRow + height; r++) {
    for (let c = startCol; c < startCol + width; c++) {
      if (r >= 0 && r < h && c >= 0 && c < w) {
        grid[r][c] = tileIndex;
      }
    }
  }
}

// Draw a themed, modular house (6x5 size) on the grid
function drawHouseOnGrid(grid, startCol, startRow, houseType) {
  let p = {};
  if (houseType === "projects") {
    p = {
      roof_top: 15, roof_left: 12, roof_center: 13, roof_right: 14,
      wall_left: 16, wall_center: 17, wall_right: 18, wall_window: 19,
      door_left: 20, door_right: 21
    };
  } else if (houseType === "skills") {
    p = {
      roof_top: 25, roof_left: 22, roof_center: 23, roof_right: 24,
      wall_left: 26, wall_center: 27, wall_right: 28, wall_window: 29,
      door_left: 30, door_right: 31
    };
  } else if (houseType === "contact") {
    p = {
      roof_top: 35, roof_left: 32, roof_center: 33, roof_right: 34,
      wall_left: 36, wall_center: 37, wall_right: 38, wall_window: 39,
      door_left: 40, door_right: 41
    };
  }

  // Row 0: Roof Ridge Crest (Diagonal smoothing - 2 tiles wide at center)
  grid[startRow][startCol + 2] = p.roof_top;
  grid[startRow][startCol + 3] = p.roof_top;

  // Row 1: Upper slanted roof rows (Diagonal smoothing - 4 tiles wide)
  grid[startRow + 1][startCol + 1] = p.roof_left;
  grid[startRow + 1][startCol + 2] = p.roof_center;
  grid[startRow + 1][startCol + 3] = p.roof_center;
  grid[startRow + 1][startCol + 4] = p.roof_right;

  // Row 2: Lower slanted roof rows (Full 6 tiles wide)
  grid[startRow + 2][startCol] = p.roof_left;
  grid[startRow + 2][startCol + 1] = p.roof_center;
  grid[startRow + 2][startCol + 2] = p.roof_center;
  grid[startRow + 2][startCol + 3] = p.roof_center;
  grid[startRow + 2][startCol + 4] = p.roof_center;
  grid[startRow + 2][startCol + 5] = p.roof_right;

  // Row 3: Walls with dual window panels
  grid[startRow + 3][startCol] = p.wall_left;
  grid[startRow + 3][startCol + 1] = p.wall_center;
  grid[startRow + 3][startCol + 2] = p.wall_window;
  grid[startRow + 3][startCol + 3] = p.wall_window;
  grid[startRow + 3][startCol + 4] = p.wall_center;
  grid[startRow + 3][startCol + 5] = p.wall_right;

  // Row 4: Walls with doorway and right-side interactive wooden sign
  grid[startRow + 4][startCol] = p.wall_left;
  grid[startRow + 4][startCol + 1] = p.wall_center;
  grid[startRow + 4][startCol + 2] = p.door_left;
  grid[startRow + 4][startCol + 3] = p.door_right;
  grid[startRow + 4][startCol + 4] = 11; // Signpost (Solid)
  grid[startRow + 4][startCol + 5] = p.wall_right;
}

// Procedural World Builder
function initProceduralMap() {
  const town = MAPS.town;
  town.grid = createGrid(32, 24, 0);
  const townGrid = town.grid;

  // 1. Surrounding island border: Animated shimmering river/sea
  // Top and Bottom water borders
  fillRectOnGrid(townGrid, 32, 24, 0, 0, 32, 2, 2);  // Rows 0 and 1
  fillRectOnGrid(townGrid, 32, 24, 0, 22, 32, 2, 2); // Rows 22 and 23

  // Left and Right water borders
  fillRectOnGrid(townGrid, 32, 24, 0, 2, 2, 20, 2);   // Columns 0 and 1
  fillRectOnGrid(townGrid, 32, 24, 30, 2, 2, 20, 2);  // Columns 30 and 31

  // 3. Populate floral clusters randomly in green spaces (6% density)
  for (let r = 2; r < 22; r++) {
    for (let c = 2; c < 30; c++) {
      if (townGrid[r][c] === 0 && Math.random() < 0.06) {
        townGrid[r][c] = 8; // grass_flowers
      }
    }
  }

  // 4. Randomize themed houses on grid ensuring safe spawn zone, padding, and street clearance
  const housesToPlace = [
    { id: "projects", title: "Projects Center", text: "Projects Center: check out some real-world cloud designs, serverless code, and infrastructure setups!" },
    { id: "skills", title: "Career Journey", text: "Career Journey: a casual walk through my work history, from early school days to recent senior roles!" },
    { id: "contact", title: "Contact Lounge", text: "Contact Lounge: a cozy spot to grab my links and say hi!" }
  ];

  const placedHouses = [];
  const playerSpawnBox = { x: 11, y: 10, width: 9, height: 10 }; // Extended safe player/baseline zone to prevent house overlaps

  for (let house of housesToPlace) {
    let placed = false;
    let attempts = 0;
    while (!placed && attempts < 1000) {
      attempts++;
      const col = Math.floor(Math.random() * (24 - 2 + 1)) + 2; // Columns 2 to 24 (leaves right corridor clear)
      const row = Math.floor(Math.random() * (11 - 3 + 1)) + 3;  // Rows 3 to 11 (leaves bottom baseline clear)

      // Placement box including 1 tile padding around
      const box = { x: col - 1, y: row - 1, width: 8, height: 7 };

      // Collides player spawn / baseline area?
      const collidesPlayer = (box.x < playerSpawnBox.x + playerSpawnBox.width &&
                              box.x + box.width > playerSpawnBox.x &&
                              box.y < playerSpawnBox.y + playerSpawnBox.height &&
                              box.y + box.height > playerSpawnBox.y);
      if (collidesPlayer) continue;

      // Collides existing structures or their prospective vertical streets?
      let collidesHouseOrStreet = false;
      for (let placedHouse of placedHouses) {
        // 1. Direct bounding box overlap
        const otherBox = { x: placedHouse.col - 1, y: placedHouse.row - 1, width: 8, height: 7 };
        if (box.x < otherBox.x + otherBox.width &&
            box.x + box.width > otherBox.x &&
            box.y < otherBox.y + otherBox.height &&
            box.y + box.height > otherBox.y) {
          collidesHouseOrStreet = true;
          break;
        }

        // 2. Candidate house vs already placed house's vertical street
        const colOverlap1 = (col <= placedHouse.col + 3 && col + 5 >= placedHouse.col + 2);
        const minOtherY = Math.min(placedHouse.row + 5, 17);
        const maxOtherY = Math.max(placedHouse.row + 5, 17);
        const rowOverlap1 = (row <= maxOtherY && row + 4 >= minOtherY);
        if (colOverlap1 && rowOverlap1) {
          collidesHouseOrStreet = true;
          break;
        }

        // 3. Candidate house's vertical street vs already placed house
        const colOverlap2 = (col + 2 <= placedHouse.col + 5 && col + 3 >= placedHouse.col);
        const minCandY = Math.min(row + 5, 17);
        const maxCandY = Math.max(row + 5, 17);
        const rowOverlap2 = (placedHouse.row <= maxCandY && placedHouse.row + 4 >= minCandY);
        if (colOverlap2 && rowOverlap2) {
          collidesHouseOrStreet = true;
          break;
        }
      }
      if (collidesHouseOrStreet) continue;

      // Approved slot!
      placedHouses.push({ ...house, col, row });
      placed = true;
    }
  }

  town.placedHouses = placedHouses;

  // 5. Draw Houses on grid
  placedHouses.forEach((house) => {
    drawHouseOnGrid(townGrid, house.col, house.row, house.id);
  });

  // 6. Draw perfect dynamic sandstone connecting pathways
  fillRectOnGrid(townGrid, 32, 24, 13, 16, 6, 4, 1); // Central cobblestone starting plaza

  placedHouses.forEach((house) => {
    const doorCol = house.col + 2;
    const doorRow = house.row + 5; // grid cell immediately below door

    // Vertical street matching doorway to horizontal baseline row 17
    const startY = Math.min(doorRow, 17);
    const endY = Math.max(doorRow, 17);
    fillRectOnGrid(townGrid, 32, 24, doorCol, startY, 2, endY - startY + 1, 1);

    // Horizontal street connecting door's column to central plaza columns (13-18)
    if (doorCol < 13) {
      fillRectOnGrid(townGrid, 32, 24, doorCol, 17, 13 - doorCol + 1, 2, 1);
    } else if (doorCol > 18) {
      fillRectOnGrid(townGrid, 32, 24, 18, 17, doorCol - 18 + 1, 2, 1);
    }
  });

  // 6b. Place a few individual pine trees randomly on the map (8-12 trees)
  // Ensure they are not too close to buildings, roads, or spawn points to avoid collision issues.
  let treesPlaced = 0;
  let treeAttempts = 0;
  while (treesPlaced < 10 && treeAttempts < 500) {
    treeAttempts++;
    const tc = Math.floor(Math.random() * (28 - 3 + 1)) + 3; // Columns 3 to 28
    const tr = Math.floor(Math.random() * (19 - 3 + 1)) + 3; // Rows 3 to 19

    // Check if the two tiles (tr, tc) and (tr+1, tc) are vacant grass (index 0 or 8)
    if (townGrid[tr][tc] !== 0 && townGrid[tr][tc] !== 8) continue;
    if (townGrid[tr + 1][tc] !== 0 && townGrid[tr + 1][tc] !== 8) continue;

    // Check distance to player spawn plaza / baseline (cols 11-20, rows 9-20)
    if (tc >= 11 && tc <= 20 && tr >= 9 && tr <= 20) continue;

    // Check distance to any house with 1 tile padding
    let tooClose = false;
    for (let house of placedHouses) {
      if (tc >= house.col - 1 && tc <= house.col + 6 &&
          tr >= house.row - 1 && tr <= house.row + 5) {
        tooClose = true;
        break;
      }
    }
    if (tooClose) continue;

    // Place tree!
    townGrid[tr][tc] = 9;      // tree_top
    townGrid[tr + 1][tc] = 10;  // tree_trunk
    treesPlaced++;
  }

  // 7. Establish dynamic warp triggers and bulletin boards coordinates
  town.warps = [];
  town.signs = [];

  placedHouses.forEach((house) => {
    const toMap = house.id === "projects" ? "projects_interior" :
                  house.id === "skills" ? "skills_interior" : "contact_interior";

    // Double-tile doorway portals
    const enterY = toMap === "skills_interior" ? 7 : 8;
    town.warps.push({
      fromX: house.col + 2,
      fromY: house.row + 4,
      toMap: toMap,
      toX: 4,
      toY: enterY,
      facing: "up"
    });
    town.warps.push({
      fromX: house.col + 3,
      fromY: house.row + 4,
      toMap: toMap,
      toX: 5,
      toY: enterY,
      facing: "up"
    });

    // Dynamically adjust corresponding interior's exit warps to point right outside this building's door on the town map
    const interior = MAPS[toMap];
    if (interior) {
      const exitY = toMap === "skills_interior" ? 8 : 9;
      interior.warps = [
        { fromX: 4, fromY: exitY, toMap: "town", toX: house.col + 2, toY: house.row + 5, facing: "down" },
        { fromX: 5, fromY: exitY, toMap: "town", toX: house.col + 3, toY: house.row + 5, facing: "down" }
      ];
    }

    // Signboard registered on bottom row wall immediately to the right of door
    town.signs.push({
      x: house.col + 4,
      y: house.row + 4,
      title: house.title,
      text: house.text
    });
  });

  // Dynamic Town Guide dialogue based on randomized building positions
  const getHouseDirection = (house) => {
    const doorCol = house.col + 2;
    if (doorCol < 13) return "to the left";
    if (doorCol > 18) return "to the right";
    return "straight ahead";
  };

  const projectsHouse = placedHouses.find((h) => h.id === "projects");
  const skillsHouse = placedHouses.find((h) => h.id === "skills");
  const contactHouse = placedHouses.find((h) => h.id === "contact");

  if (projectsHouse && skillsHouse && contactHouse) {
    const projectsDir = getHouseDirection(projectsHouse);
    const skillsDir = getHouseDirection(skillsHouse);
    const contactDir = getHouseDirection(contactHouse);

    const townGuideData = PROJECTS_DATA.find((p) => p.id === "town-guide");
    if (townGuideData) {
      townGuideData.dialogue = [
        "Hi! Welcome to Giulio's interactive portfolio town.",
        "I'm here to help you find your way around!",
        `To the ${projectsDir} of our starting plaza, you'll find the Projects Center, which has some real-world cloud designs and infrastructure setups Giulio has worked on.`,
        `If you head ${skillsDir}, there's the Career Journey building, showing how he got started in tech and where he's worked.`,
        `And to the ${contactDir} is the Contact Lounge, if you'd like to get in touch with him or grab his links.`,
        "Have fun looking around!"
      ];
    }
  }
}

// 2. Populate 'projects_interior' Map (Futuristic Tech Lab)
MAPS.projects_interior.grid = createGrid(10, 10, 5); // Carbon black / Cyber boundaries
const projGrid = MAPS.projects_interior.grid;
fillRectOnGrid(projGrid, 10, 10, 2, 2, 6, 7, 3); // Walkable floor
fillRectOnGrid(projGrid, 10, 10, 4, 9, 2, 1, 3); // Exit door walkable floor
fillRectOnGrid(projGrid, 10, 10, 3, 2, 4, 1, 7); // Console tables

// 3. Populate 'skills_interior' Map (Chronological Career Journey Timeline Corridor)
MAPS.skills_interior.grid = createGrid(28, 9, 4); // Traditional red brick boundaries
const skillsGrid = MAPS.skills_interior.grid;
fillRectOnGrid(skillsGrid, 28, 9, 2, 2, 24, 6, 3); // Walkable floor
fillRectOnGrid(skillsGrid, 28, 9, 4, 8, 2, 1, 3); // Exit door walkable floor
fillRectOnGrid(skillsGrid, 28, 9, 2, 2, 24, 1, 4); // Simple wall instead of console tables

// 4. Populate 'contact_interior' Map (Warm Log Wood Panel Lounge)
MAPS.contact_interior.grid = createGrid(10, 10, 42); // Warm Log wood panel boundaries
const contactGrid = MAPS.contact_interior.grid;
fillRectOnGrid(contactGrid, 10, 10, 2, 2, 6, 7, 3); // Walkable floor
fillRectOnGrid(contactGrid, 10, 10, 4, 9, 2, 1, 3); // Exit door walkable floor




// Run map layout randomizer
initProceduralMap();

// Active map state tracking
let currentMapName = "town";
const getCurrentMap = () => MAPS[currentMapName];

// Contact email for social lounge
const contactEmail = "cva@gpurg.com";

// --------------------------------------------------
// 2. PLAYER ENTITY
// --------------------------------------------------
const player = {
  x: 15 * TILE_SIZE, // Center map spawn
  y: 18 * TILE_SIZE,
  dir: "down",
  frame: 0,
  speed: 120, // pixels per second
  animTimer: 0,
  width: 12,
  height: 8, // Collision box height isolated to bottom half
  colliderOffset: { x: 2, y: 8 } // Centered offset on bottom half
};

// --------------------------------------------------
// 3. DIALOGUE & POPUP OVERLAY MANAGERS (DOM-linked)
// --------------------------------------------------
let isProjectSelectorOpen = false;
let isPrivacyModalOpen = false;
let selectedProjectIndex = 0;
let marqueeResumeTimeout = null;

const SELECTOR_PROJECT_IDS = [
  "landing-zones",
  "data-lake",
  "garbage-collector",
  "vdi-cloud",
  "menupp-webapp"
];

const PROJECT_METADATA = {
  "landing-zones": { icon: "🌐", tags: ["AWS", "Terraform", "Security"] },
  "data-lake": { icon: "💧", tags: ["S3", "Python", "Glue", "Athena"] },
  "garbage-collector": { icon: "🧹", tags: ["Serverless", "Python", "DynamoDB"] },
  "vdi-cloud": { icon: "🖥️", tags: ["AppStream", "WorkSpaces", "ActiveDirectory"] },
  "menupp-webapp": { icon: "🍔", tags: ["CloudFront", "Lambda", "DynamoDB"] }
};

let activeDialogueNpc = null;
let currentDialogueIdx = 0;
let displayedDialogueText = "";
let typewriterTimer = null;
let isDialogueOpen = false;
let isWarping = false;

// Leone / Azzurra chase event states
let chaseState = "IDLE"; // "IDLE", "SPRINTING", "TIRED", "RESETTING"
let chaseTimer = 0;

// Recruiter escort cutscene states
let isRecruiterEscortActive = false;
let recruiterEscortPath = null;
let recruiterNodeIdx = 0;

let isRecruiterReturning = false;
let recruiterReturnPath = null;
let recruiterReturnNodeIdx = 0;


// Dynamic Camera Zoom States (Cinematic zoom-in focus during conversations)
const BASE_WALK_ZOOM = 1.0; // Base camera scale during overworld walking (restored to 1.0 for perfect crisp quality)
const DIALOGUE_ZOOM_START = 1.0; // Dialogue zoom scale when starting dialogue
let currentZoom = BASE_WALK_ZOOM; // Starts at normal walking resolution
let targetZoom = BASE_WALK_ZOOM;

const uiElements = {
  screenContainer: document.getElementById("screenContainer"),
  dialogBox: document.getElementById("dialogBox"),
  dialogNpc: document.getElementById("dialogNpcName"),
  dialogText: document.getElementById("dialogText"),
  dialogIndicator: document.getElementById("dialogIndicator"),
  choiceBox: document.getElementById("choiceBox"),
  projectPanel: document.getElementById("projectPanel"),
  projectTitle: document.getElementById("projectTitle"),
  projectDesc: document.getElementById("projectDesc"),
  diagramContent: document.getElementById("diagramContent"),
  tabsContainer: document.getElementById("tabsContainer"),
  tabContent: document.getElementById("tabContent"),
  closePanelBtn: document.getElementById("closePanelBtn")
};

// Start custom typewriter animation for retro style
function startTypewriter(text) {
  clearTimeout(typewriterTimer);
  displayedDialogueText = "";
  uiElements.dialogText.scrollTop = 0; // Reset scroll to top for new paragraph
  let i = 0;

  uiElements.dialogIndicator.style.display = "none";

  function tick() {
    if (i < text.length) {
      displayedDialogueText += text.charAt(i);
      uiElements.dialogText.innerText = displayedDialogueText;
      uiElements.dialogText.scrollTop = uiElements.dialogText.scrollHeight; // Auto-scroll to bottom to follow typed characters
      i++;
      typewriterTimer = setTimeout(tick, 20); // crisp, fast typing effect
    } else {
      uiElements.dialogIndicator.style.display = "block";
      // Instantly open the choice box when the final paragraph of dialogue finishes typing
      if (activeDialogueNpc && !activeDialogueNpc.isSign && currentDialogueIdx === activeDialogueNpc.dialogue.length - 1) {
        showDialogueChoices();
      }
    }
  }
  tick();
}

// Trigger dialogue trigger proximity checks
function openDialogue(npcId) {
  const proj = PROJECTS_DATA.find((p) => p.id === npcId);
  if (!proj) return;

  isDialogueOpen = true;
  targetZoom = DIALOGUE_ZOOM_START;
  activeDialogueNpc = proj;
  currentDialogueIdx = 0;

  if (uiElements.screenContainer) {
    uiElements.screenContainer.classList.add("zoomed");
  }

  // Align NPC direction to face player
  const activeMap = getCurrentMap();
  const npcObj = activeMap.npcs.find((n) => n.id === npcId);
  if (npcObj) {
    if (player.dir === "up") npcObj.dir = "down";
    else if (player.dir === "down") npcObj.dir = "up";
    else if (player.dir === "left") npcObj.dir = "right";
    else if (player.dir === "right") npcObj.dir = "left";
  }

  uiElements.dialogBox.style.display = "block";
  uiElements.dialogNpc.innerText = proj.npcName;
  startTypewriter(proj.dialogue[0]);
}

// Open dialogue from reading an interactive signboard
function openSignDialogue(text, title) {
  isDialogueOpen = true;
  targetZoom = DIALOGUE_ZOOM_START;
  activeDialogueNpc = {
    npcName: title,
    dialogue: [text],
    isSign: true
  };
  currentDialogueIdx = 0;

  if (uiElements.screenContainer) {
    uiElements.screenContainer.classList.add("zoomed");
  }

  uiElements.dialogBox.style.display = "block";
  uiElements.dialogNpc.innerText = title;
  startTypewriter(text);
}

function advanceDialogue() {
  // If typewriter is still typing, skip to the end instantly
  if (displayedDialogueText.length < activeDialogueNpc.dialogue[currentDialogueIdx].length) {
    clearTimeout(typewriterTimer);
    displayedDialogueText = activeDialogueNpc.dialogue[currentDialogueIdx];
    uiElements.dialogText.innerText = displayedDialogueText;
    uiElements.dialogText.scrollTop = uiElements.dialogText.scrollHeight; // Ensure fully typed text is scrolled into view
    uiElements.dialogIndicator.style.display = "block";
    // Instantly open the choice box if typewriter is skipped on the final paragraph of dialogue
    if (activeDialogueNpc && !activeDialogueNpc.isSign && currentDialogueIdx === activeDialogueNpc.dialogue.length - 1) {
      showDialogueChoices();
    }
    return;
  }

  currentDialogueIdx++;
  if (currentDialogueIdx < activeDialogueNpc.dialogue.length) {
    startTypewriter(activeDialogueNpc.dialogue[currentDialogueIdx]);
  } else {
    if (activeDialogueNpc.isSign) {
      closeDialogue();
    } else {
      // Show option menu deep dives
      showDialogueChoices();
    }
  }
}

function showDialogueChoices() {
  uiElements.dialogIndicator.style.display = "none";
  uiElements.choiceBox.innerHTML = "";
  uiElements.choiceBox.style.display = "flex";

  let options = [];
  if (activeDialogueNpc.id === "tech-advisor") {
    options = [
      { text: "Look at the Projects Display", action: () => { closeDialogue(); openProjectSelector(); } },
      { text: "Goodbye", action: () => closeDialogue() }
    ];
  } else if (activeDialogueNpc.id === "contact-linkedin") {
    options = [
      { text: "Open LinkedIn (New Tab)", action: () => { closeDialogue(); window.open("https://www.linkedin.com/in/giulio-purgatorio-701a77206", "_blank", "noopener,noreferrer"); } },
      { text: "Goodbye", action: () => closeDialogue() }
    ];
  } else if (activeDialogueNpc.id === "contact-email") {
    options = [
      { text: "Draft Email", action: () => { closeDialogue(); window.open("mailto:" + contactEmail, "_blank", "noopener,noreferrer"); } },
      { text: "Goodbye", action: () => closeDialogue() }
    ];
  } else if (activeDialogueNpc.id === "contact-github") {
    options = [
      { text: "Open GitHub (New Tab)", action: () => { closeDialogue(); window.open("https://github.com/GPurgatorio", "_blank", "noopener,noreferrer"); } },
      { text: "Goodbye", action: () => closeDialogue() }
    ];
  } else if (activeDialogueNpc.id === "recruiter-npc") {
    options = [
      { text: "Yes", action: () => { closeDialogue(); startRecruiterEscort(); } },
      { text: "No", action: () => closeDialogue() }
    ];
  } else if (activeDialogueNpc.deepDive && currentMapName !== "skills_interior") {
    options = [
      { text: `Explore Architecture: ${activeDialogueNpc.title}`, action: () => openProjectDeepDive() },
      { text: "Goodbye", action: () => closeDialogue() }
    ];
  } else {
    options = [
      { text: "Goodbye", action: () => closeDialogue() }
    ];
  }

  options.forEach((opt, idx) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.innerText = opt.text;
    btn.onclick = () => {
      uiElements.choiceBox.style.display = "none";
      opt.action();
    };
    uiElements.choiceBox.appendChild(btn);
    // Set auto-focus on first option for instant keyboard WASD/Enter access after element has been appended
    if (idx === 0) {
      btn.focus();
    }
  });
}

function closeDialogue() {
  const closedNpc = activeDialogueNpc;
  uiElements.dialogBox.style.display = "none";
  uiElements.choiceBox.style.display = "none";
  isDialogueOpen = false;
  targetZoom = BASE_WALK_ZOOM;
  activeDialogueNpc = null;

  if (uiElements.screenContainer) {
    uiElements.screenContainer.classList.remove("zoomed");
  }

  if (closedNpc && closedNpc.id === "leone") {
    triggerLeoneChase();
  } else if (closedNpc && closedNpc.id === "recruiter-npc-escort-end") {
    startRecruiterReturnWalk();
  }
}


// Open beautiful glassmorphic technical deep dive overlays
function openProjectDeepDive() {
  if (!activeDialogueNpc) return;

  const proj = activeDialogueNpc;
  uiElements.projectTitle.innerText = proj.title;
  uiElements.projectDesc.innerText = proj.shortDescription;
  uiElements.diagramContent.innerText = proj.deepDive.architectureDiagram.trim();

  // Populate dynamic modular project tabs
  uiElements.tabsContainer.innerHTML = "";
  proj.deepDive.details.forEach((tab, index) => {
    const btn = document.createElement("button");
    btn.className = `tab-btn ${index === 0 ? "active" : ""}`;
    btn.innerText = tab.tabTitle;
    btn.onclick = () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      showTabContent(tab);
    };
    uiElements.tabsContainer.appendChild(btn);
  });

  // Render initial tab content
  showTabContent(proj.deepDive.details[0]);
  uiElements.projectPanel.style.display = "block";
  updateConsoleOpenState();
}

function showTabContent(tab) {
  if (tab.code) {
    // Render formatted code block
    uiElements.tabContent.innerHTML = `<pre><code class="language-${escapeHtml(tab.language || "text")}">${escapeHtml(tab.code.trim())}</code></pre>`;
  } else {
    // Render text detail
    uiElements.tabContent.innerHTML = `<p>${tab.content}</p>`;
  }
}

function escapeHtml(str) {
  return String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

uiElements.closePanelBtn.onclick = () => {
  uiElements.projectPanel.style.display = "none";
  if (isProjectSelectorOpen) {
    renderProjectSelector();
  } else {
    closeDialogue();
  }
  updateConsoleOpenState();
};

function updateConsoleOpenState() {
  const isPanelOpen = uiElements.projectPanel && uiElements.projectPanel.style.display === "block";
  if (isProjectSelectorOpen || isPanelOpen) {
    document.body.classList.add("console-open");
  } else {
    document.body.classList.remove("console-open");
  }
}

// --- Project Selector Dashboard Functionality ---
function openProjectSelector() {
  isProjectSelectorOpen = true;
  selectedProjectIndex = 0;

  // Clear key states to prevent accidental movement on popup
  Object.keys(keysPressed).forEach((key) => {
    keysPressed[key] = false;
  });

  renderProjectSelector();

  const el = document.getElementById("projectSelector");
  if (el) {
    el.style.display = "flex";
    el.setAttribute("aria-hidden", "false");
  }
  updateConsoleOpenState();
}

function closeProjectSelector() {
  isProjectSelectorOpen = false;
  const el = document.getElementById("projectSelector");
  if (el) {
    el.style.display = "none";
    el.setAttribute("aria-hidden", "true");
  }
  const container = document.getElementById("selectorTileRow");
  if (container) {
    container.classList.remove("manual-mode");
    const tracks = container.querySelectorAll(".tiles-track");
    if (tracks.length > 0) {
      tracks[0].style.transform = "";
    }
  }
  if (marqueeResumeTimeout) {
    clearTimeout(marqueeResumeTimeout);
    marqueeResumeTimeout = null;
  }
  updateConsoleOpenState();
}

function renderProjectSelector(isUserInteraction = false) {
  const container = document.getElementById("selectorTileRow");
  if (!container) return;

  // Build the tracks once (keeps animation running continuously without resetting on click)
  let tracks = container.querySelectorAll(".tiles-track");
  let track1, track2;
  if (tracks.length < 2) {
    container.innerHTML = "";

    track1 = document.createElement("div");
    track1.className = "tiles-track";

    track2 = document.createElement("div");
    track2.className = "tiles-track";
    track2.setAttribute("aria-hidden", "true");

    function createTile(id, idx) {
      const proj = PROJECTS_DATA.find((p) => p.id === id);
      if (!proj) return null;

      const meta = PROJECT_METADATA[id] || { icon: "📁", tags: [] };
      const tile = document.createElement("div");
      tile.className = "project-tile";
      tile.dataset.index = idx;
      tile.innerHTML = `
        <div class="tile-icon">${escapeHtml(meta.icon)}</div>
        <div class="tile-title">${escapeHtml(proj.title)}</div>
      `;

      tile.onclick = (e) => {
        selectedProjectIndex = idx;
        renderProjectSelector(true);
      };

      tile.ondblclick = () => {
        openProjectDeepDiveById(id);
      };

      return tile;
    }

    SELECTOR_PROJECT_IDS.forEach((id, idx) => {
      const tile1 = createTile(id, idx);
      if (tile1) track1.appendChild(tile1);

      const tile2 = createTile(id, idx);
      if (tile2) track2.appendChild(tile2);
    });

    container.appendChild(track1);
    container.appendChild(track2);
  } else {
    track1 = tracks[0];
    track2 = tracks[1];
  }

  // Update active state across both tracks
  const allTiles = container.querySelectorAll(".project-tile");
  allTiles.forEach((tile) => {
    const tileIdx = parseInt(tile.dataset.index, 10);
    if (tileIdx === selectedProjectIndex) {
      tile.classList.add("active");
    } else {
      tile.classList.remove("active");
    }
  });

  // Dynamic live preview rendering
  const previewPanel = document.getElementById("selectorPreviewPanel");
  if (previewPanel) {
    const activeId = SELECTOR_PROJECT_IDS[selectedProjectIndex];
    const activeProj = PROJECTS_DATA.find((p) => p.id === activeId);

    if (activeProj) {
      const meta = PROJECT_METADATA[activeId] || { icon: "📁", tags: [] };
      const tagsHtml = meta.tags.map(t => `<span class="tag-badge">${escapeHtml(t)}</span>`).join("");

      previewPanel.innerHTML = `
        <div class="preview-title">${escapeHtml(activeProj.title)}</div>
        <div class="preview-tags">${tagsHtml}</div>
        <div class="preview-text">${escapeHtml(activeProj.shortDescription)}</div>
        <div class="preview-action">Press ENTER, SPACE or DOUBLE-CLICK to inspect blueprints</div>
      `;
    }
  }

  // Handle manual interaction pausing, centering, and auto-resume timeout
  if (marqueeResumeTimeout) {
    clearTimeout(marqueeResumeTimeout);
    marqueeResumeTimeout = null;
  }

  if (isUserInteraction) {
    const activeTile = track1.querySelector(".project-tile.active");
    if (activeTile) {
      // If transitioning from running marquee, capture position to prevent jump
      if (!container.classList.contains("manual-mode")) {
        const computedStyle = window.getComputedStyle(track1);
        const matrix = computedStyle.transform;
        if (matrix && matrix !== "none") {
          track1.style.transform = matrix;
        }
        track1.offsetHeight; // Force reflow
        container.classList.add("manual-mode");
      }

      const parentWidth = container.clientWidth;
      const tx = parentWidth / 2 - (activeTile.offsetLeft + activeTile.offsetWidth / 2);

      // Set target transform to center the card
      track1.style.transform = `translateX(${tx}px)`;

      // Set inactivity timeout of 5 seconds to resume continuous marquee
      marqueeResumeTimeout = setTimeout(() => {
        container.classList.remove("manual-mode");
        track1.style.transform = "";
        marqueeResumeTimeout = null;
      }, 5000);
    }
  } else {
    container.classList.remove("manual-mode");
    track1.style.transform = "";
  }
}

function openProjectDeepDiveById(projectId) {
  const proj = PROJECTS_DATA.find((p) => p.id === projectId);
  if (!proj) return;

  activeDialogueNpc = proj;
  uiElements.projectTitle.innerText = proj.title;
  uiElements.projectDesc.innerText = proj.shortDescription;
  uiElements.diagramContent.innerText = proj.deepDive.architectureDiagram.trim();

  // Populate tabs
  uiElements.tabsContainer.innerHTML = "";
  proj.deepDive.details.forEach((tab, index) => {
    const btn = document.createElement("button");
    btn.className = `tab-btn ${index === 0 ? "active" : ""}`;
    btn.innerText = tab.tabTitle;
    btn.onclick = () => {
      document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      showTabContent(tab);
    };
    uiElements.tabsContainer.appendChild(btn);
  });

  showTabContent(proj.deepDive.details[0]);
  uiElements.projectPanel.style.display = "block";
  updateConsoleOpenState();
}

// Bind Selector Close button click handler
const closeSelectorBtn = document.getElementById("closeSelectorBtn");
if (closeSelectorBtn) {
  closeSelectorBtn.onclick = () => {
    closeProjectSelector();
  };
}

// --- Privacy Notice Modal Functionality ---
function openPrivacyModal() {
  isPrivacyModalOpen = true;
  Object.keys(keysPressed).forEach((key) => {
    keysPressed[key] = false;
  });
  const el = document.getElementById("privacyModal");
  if (el) {
    el.style.display = "flex";
    el.setAttribute("aria-hidden", "false");
    const closeBtn = document.getElementById("closePrivacyBtn");
    if (closeBtn) closeBtn.focus();
  }
}

function closePrivacyModal() {
  isPrivacyModalOpen = false;
  const el = document.getElementById("privacyModal");
  if (el) {
    el.style.display = "none";
    el.setAttribute("aria-hidden", "true");
  }
  const trigger = document.getElementById("privacyLink");
  if (trigger) trigger.focus();
}

document.querySelectorAll(".privacy-link-trigger, #privacyLink, #mobilePrivacyBtn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    openPrivacyModal();
  });
});

const closePrivacyBtn = document.getElementById("closePrivacyBtn");
if (closePrivacyBtn) {
  closePrivacyBtn.addEventListener("click", () => {
    closePrivacyModal();
  });
}

const privacyModal = document.getElementById("privacyModal");
if (privacyModal) {
  privacyModal.addEventListener("click", (e) => {
    if (e.target === privacyModal) {
      closePrivacyModal();
    }
  });
}



// --------------------------------------------------
// 4. KEYBOARD INPUT CONTROLS
// --------------------------------------------------
const keysPressed = {};

function navigateChoices(dir) {
  const buttons = Array.from(uiElements.choiceBox.querySelectorAll(".choice-btn"));
  if (buttons.length === 0) return;

  const activeIndex = buttons.indexOf(document.activeElement);
  let nextIndex = activeIndex + dir;

  if (nextIndex < 0) {
    nextIndex = buttons.length - 1;
  } else if (nextIndex >= buttons.length) {
    nextIndex = 0;
  }

  buttons[nextIndex].focus();
}

window.addEventListener("keydown", (e) => {
  const code = e.code;
  keysPressed[code] = true;

  // Intercept keyboard controls if Privacy Notice modal is open
  if (isPrivacyModalOpen) {
    if (code === "Escape") {
      e.preventDefault();
      closePrivacyModal();
    }
    return;
  }

  // Intercept keyboard controls if the Project Console is open
  if (isProjectSelectorOpen) {
    if (uiElements.projectPanel.style.display === "block") {
      if (code === "Escape") {
        e.preventDefault();
        uiElements.projectPanel.style.display = "none";
        renderProjectSelector();
        updateConsoleOpenState();
      }
      return;
    }

    if (code === "KeyA" || code === "ArrowLeft" || code === "KeyW" || code === "ArrowUp") {
      e.preventDefault();
      selectedProjectIndex = (selectedProjectIndex - 1 + SELECTOR_PROJECT_IDS.length) % SELECTOR_PROJECT_IDS.length;
      renderProjectSelector(true);
    } else if (code === "KeyD" || code === "ArrowRight" || code === "KeyS" || code === "ArrowDown") {
      e.preventDefault();
      selectedProjectIndex = (selectedProjectIndex + 1) % SELECTOR_PROJECT_IDS.length;
      renderProjectSelector(true);
    } else if (code === "Space" || code === "Enter") {
      e.preventDefault();
      const activeId = SELECTOR_PROJECT_IDS[selectedProjectIndex];
      openProjectDeepDiveById(activeId);
    } else if (code === "Escape") {
      e.preventDefault();
      closeProjectSelector();
    }
    return;
  }

  // Key handlers for dialogue box advancement and choices selection
  if (isDialogueOpen) {
    if (uiElements.choiceBox.style.display === "flex") {
      if (code === "KeyW" || code === "ArrowUp") {
        e.preventDefault();
        navigateChoices(-1);
      } else if (code === "KeyS" || code === "ArrowDown") {
        e.preventDefault();
        navigateChoices(1);
      } else if (code === "Space" || code === "Enter") {
        e.preventDefault();
        const activeBtn = document.activeElement;
        if (activeBtn && activeBtn.classList.contains("choice-btn")) {
          activeBtn.click();
        }
      }
    } else {
      if (code === "Space" || code === "Enter") {
        e.preventDefault();
        advanceDialogue();
      }
    }
  } else if (!isWarping && (code === "Space" || code === "Enter")) {
    e.preventDefault();
    triggerInteraction();
  }
});

window.addEventListener("keyup", (e) => {
  keysPressed[e.code] = false;
});

window.addEventListener("blur", () => {
  Object.keys(keysPressed).forEach((k) => {
    keysPressed[k] = false;
  });
});


// --------------------------------------------------
// 5. PHYSICS, DIAGONAL SPEED NORMALIZATION, AND COLLISION
// --------------------------------------------------
function checkTileSolid(tx, ty) {
  const activeMap = getCurrentMap();
  if (tx < 0 || tx >= activeMap.cols || ty < 0 || ty >= activeMap.rows) return true; // Edge of world
  const tileIndex = activeMap.grid[ty][tx];
  return SOLID_TILES.has(tileIndex);
}

// Bounding Box checks against environment and NPCs
function checkCollision(x, y) {
  // 1. Check map tile bounds at player feet (collider box)
  const left = x + player.colliderOffset.x;
  const right = x + player.colliderOffset.x + player.width;
  const top = y + player.colliderOffset.y;
  const bottom = y + player.colliderOffset.y + player.height;

  const tilesToCheck = [
    { x: Math.floor(left / TILE_SIZE), y: Math.floor(top / TILE_SIZE) },
    { x: Math.floor(right / TILE_SIZE), y: Math.floor(top / TILE_SIZE) },
    { x: Math.floor(left / TILE_SIZE), y: Math.floor(bottom / TILE_SIZE) },
    { x: Math.floor(right / TILE_SIZE), y: Math.floor(bottom / TILE_SIZE) }
  ];

  for (let t of tilesToCheck) {
    if (checkTileSolid(t.x, t.y)) return true;
  }

  // 2. Check collision with NPC boundaries (treat as 16x16 solid colliders)
  const activeMap = getCurrentMap();
  for (let npc of activeMap.npcs) {
    const nLeft = npc.x;
    const nRight = npc.x + TILE_SIZE;
    const nTop = npc.y;
    const nBottom = npc.y + TILE_SIZE;

    if (right > nLeft && left < nRight && bottom > nTop && top < nBottom) {
      return true;
    }
  }

  return false;
}

// Resolves overlaps where NPCs walk into the player, pushing the player to the nearest valid tile
function resolvePlayerNpcOverlaps() {
  const activeMap = getCurrentMap();
  for (let npc of activeMap.npcs) {
    const pLeft = player.x + player.colliderOffset.x;
    const pRight = player.x + player.colliderOffset.x + player.width;
    const pTop = player.y + player.colliderOffset.y;
    const pBottom = player.y + player.colliderOffset.y + player.height;

    const nLeft = npc.x;
    const nRight = npc.x + TILE_SIZE;
    const nTop = npc.y;
    const nBottom = npc.y + TILE_SIZE;

    if (pRight > nLeft && pLeft < nRight && pBottom > nTop && pTop < nBottom) {
      const overlapLeft = pRight - nLeft;
      const overlapRight = nRight - pLeft;
      const overlapTop = pBottom - nTop;
      const overlapBottom = nBottom - pTop;

      const candidates = [
        { dir: "up", dx: 0, dy: -overlapTop },
        { dir: "down", dx: 0, dy: overlapBottom },
        { dir: "left", dx: -overlapLeft, dy: 0 },
        { dir: "right", dx: overlapRight, dy: 0 }
      ];

      // Sort by smallest push magnitude
      candidates.sort((a, b) => Math.hypot(a.dx, a.dy) - Math.hypot(b.dx, b.dy));

      let resolved = false;
      for (let cand of candidates) {
        const testX = player.x + cand.dx;
        const testY = player.y + cand.dy;

        if (!testPlayerPositionSolid(testX, testY, npc.id)) {
          player.x = testX;
          player.y = testY;
          resolved = true;
          break;
        }
      }

      if (!resolved) {
        const best = candidates[0];
        player.x += best.dx;
        player.y += best.dy;
      }
    }
  }
}

// Helper to check if a specific candidate position collides with tiles or other NPCs
function testPlayerPositionSolid(x, y, ignoreNpcId) {
  const left = x + player.colliderOffset.x;
  const right = x + player.colliderOffset.x + player.width;
  const top = y + player.colliderOffset.y;
  const bottom = y + player.colliderOffset.y + player.height;

  const tilesToCheck = [
    { x: Math.floor(left / TILE_SIZE), y: Math.floor(top / TILE_SIZE) },
    { x: Math.floor(right / TILE_SIZE), y: Math.floor(top / TILE_SIZE) },
    { x: Math.floor(left / TILE_SIZE), y: Math.floor(bottom / TILE_SIZE) },
    { x: Math.floor(right / TILE_SIZE), y: Math.floor(bottom / TILE_SIZE) }
  ];

  for (let t of tilesToCheck) {
    if (checkTileSolid(t.x, t.y)) return true;
  }

  const activeMap = getCurrentMap();
  for (let npc of activeMap.npcs) {
    if (npc.id === ignoreNpcId) continue;
    const nLeft = npc.x;
    const nRight = npc.x + TILE_SIZE;
    const nTop = npc.y;
    const nBottom = npc.y + TILE_SIZE;

    if (right > nLeft && left < nRight && bottom > nTop && top < nBottom) {
      return true;
    }
  }

  return false;
}

// Bounding box collision helper for wandering NPCs
function checkNpcCollision(npc, nextX, nextY) {
  const left = nextX;
  const right = nextX + TILE_SIZE;
  const top = nextY;
  const bottom = nextY + TILE_SIZE;

  // 1. Check map tile boundaries and solid tiles
  const activeMap = getCurrentMap();
  const startCol = Math.floor(left / TILE_SIZE);
  const endCol = Math.floor((right - 0.1) / TILE_SIZE);
  const startRow = Math.floor(top / TILE_SIZE);
  const endRow = Math.floor((bottom - 0.1) / TILE_SIZE);

  if (startCol < 0 || endCol >= activeMap.cols || startRow < 0 || endRow >= activeMap.rows) {
    return true; // Out of bounds
  }

  for (let r = startRow; r <= endRow; r++) {
    for (let c = startCol; c <= endCol; c++) {
      if (checkTileSolid(c, r)) return true;
    }
  }

  // 2. Check collision with other NPCs (treat as 16x16 solid colliders)
  for (let other of activeMap.npcs) {
    if (other.id === npc.id) continue;

    // Ignore collision between Azzurra and Leone during active chase/reset event states
    if (chaseState !== "IDLE") {
      if ((npc.id === "azzurra" && other.id === "leone") || (npc.id === "leone" && other.id === "azzurra")) {
        continue;
      }
    }

    const oLeft = other.x;
    const oRight = other.x + TILE_SIZE;
    const oTop = other.y;
    const oBottom = other.y + TILE_SIZE;

    if (right > oLeft && left < oRight && bottom > oTop && top < oBottom) {
      return true;
    }
  }

  // 3. Check collision with the Player's physical collision box (ignore for chase/reset NPCs during active events)
  if (chaseState !== "IDLE" && (npc.id === "azzurra" || npc.id === "leone")) {
    // Skip player collision checking so the NPCs never get softlocked/stuck by the player
  } else {
    const pLeft = player.x + player.colliderOffset.x;
    const pRight = player.x + player.colliderOffset.x + player.width;
    const pTop = player.y + player.colliderOffset.y;
    const pBottom = player.y + player.colliderOffset.y + player.height;

    if (right > pLeft && left < pRight && bottom > pTop && top < pBottom) {
      return true;
    }
  }

  return false;
}

// Fading warper helper with CSS transition synchronization
function warpToMap(toMapName, toX, toY, facing) {
  if (isWarping) return;
  isWarping = true;

  const overlay = document.getElementById("transitionOverlay");
  if (overlay) {
    overlay.classList.add("active");
  }

  // Wait for fade-out transition to complete (250ms)
  setTimeout(() => {
    currentMapName = toMapName;


    player.x = toX * TILE_SIZE;
    player.y = toY * TILE_SIZE;
    player.dir = facing;
    player.frame = 0;

    // Trigger immediate render to update viewport cleanly before fade-in
    render();

    if (overlay) {
      overlay.classList.remove("active");
    }

    // Wait for fade-in transition to complete (250ms)
    setTimeout(() => {
      isWarping = false;
    }, 250);
  }, 250);
}

// Handle trigger mechanics for map doors/entrances
function checkWarp() {
  const activeMap = getCurrentMap();
  const pGridX = Math.floor((player.x + 8) / TILE_SIZE);
  const pGridY = Math.floor((player.y + 12) / TILE_SIZE);

  const warp = activeMap.warps.find((w) => w.fromX === pGridX && w.fromY === pGridY);
  if (warp) {
    warpToMap(warp.toMap, warp.toX, warp.toY, warp.facing);
  }
}

// Proximity triggers to talk to NPCs or read signposts
function triggerInteraction() {
  const pGridX = Math.floor((player.x + 8) / TILE_SIZE);
  const pGridY = Math.floor((player.y + 12) / TILE_SIZE);

  let targetX = pGridX;
  let targetY = pGridY;

  // Project interaction vector depending on facing direction
  if (player.dir === "up") targetY -= 1;
  else if (player.dir === "down") targetY += 1;
  else if (player.dir === "left") targetX -= 1;
  else if (player.dir === "right") targetX += 1;

  const activeMap = getCurrentMap();

  // 1. Check NPC interactions
  const targetNpc = activeMap.npcs.find(
    (n) => Math.floor(n.x / TILE_SIZE) === targetX && Math.floor(n.y / TILE_SIZE) === targetY
  );

  if (targetNpc) {
    openDialogue(targetNpc.id);
    return;
  }

  // 1b. Check Console interaction inside projects_interior
  if (currentMapName === "projects_interior") {
    if (targetY === 2 && targetX >= 3 && targetX <= 6) {
      openProjectSelector();
      return;
    }
  }

  // 2. Check Signpost interactions
  if (activeMap.signs) {
    const targetSign = activeMap.signs.find(
      (s) => s.x === targetX && s.y === targetY
    );
    if (targetSign) {
      openSignDialogue(targetSign.text, targetSign.title);
    }
  }
}

// BFS grid pathfinder to navigate town map avoiding collision tiles
function findGridPath(startCol, startRow, targetCol, targetRow, avoidCol = null, avoidRow = null) {
  const cols = MAPS.town.cols;
  const rows = MAPS.town.rows;
  const queue = [[startCol, startRow]];
  const visited = {};
  const parent = {};
  visited[`${startCol},${startRow}`] = true;

  let found = false;
  while (queue.length > 0) {
    const [c, r] = queue.shift();
    if (c === targetCol && r === targetRow) {
      found = true;
      break;
    }

    const neighbors = [
      [c, r - 1], // up
      [c, r + 1], // down
      [c - 1, r], // left
      [c + 1, r]  // right
    ];

    for (const [nc, nr] of neighbors) {
      if (nc >= 0 && nc < cols && nr >= 0 && nr < rows) {
        if (avoidCol !== null && avoidRow !== null && nc === avoidCol && nr === avoidRow && !(nc === targetCol && nr === targetRow)) {
          continue;
        }
        const key = `${nc},${nr}`;
        // Is tile walk-passable?
        if (!visited[key] && !checkTileSolid(nc, nr)) {
          visited[key] = true;
          parent[key] = `${c},${r}`;
          queue.push([nc, nr]);
        }
      }
    }
  }

  if (!found) return null;

  const path = [];
  let curr = `${targetCol},${targetRow}`;
  const startKey = `${startCol},${startRow}`;
  while (curr !== startKey) {
    const [c, r] = curr.split(",").map(Number);
    path.push({ col: c, row: r });
    curr = parent[curr];
  }
  path.reverse();
  return path;
}

function startRecruiterEscort() {
  const recruiter = MAPS.town.npcs.find(n => n.id === "recruiter-npc");
  if (!recruiter) return;

  const startCol = Math.round(recruiter.x / TILE_SIZE);
  const startRow = Math.round(recruiter.y / TILE_SIZE);
  const contactHouse = MAPS.town.placedHouses.find(h => h.id === "contact");
  if (!contactHouse) return;

  const targetCol = contactHouse.col + 2;
  const targetRow = contactHouse.row + 5;

  const path = findGridPath(startCol, startRow, targetCol, targetRow);
  if (path) {
    recruiter.isWandering = false;
    recruiterEscortPath = path.map(node => ({ x: node.col * TILE_SIZE, y: node.row * TILE_SIZE }));
    recruiterNodeIdx = 0;
    isRecruiterEscortActive = true;
    targetZoom = BASE_WALK_ZOOM;
  }
}

function updateRecruiterEscort(dt) {
  const recruiter = MAPS.town.npcs.find(n => n.id === "recruiter-npc");
  if (!recruiter) {
    isRecruiterEscortActive = false;
    return;
  }

  const speed = 120; // normal speed

  // Target position for recruiter
  const recTarget = recruiterEscortPath[recruiterNodeIdx];
  if (recTarget) {
    const rdx = recTarget.x - recruiter.x;
    const rdy = recTarget.y - recruiter.y;
    const rdist = Math.hypot(rdx, rdy);
    const rstep = speed * dt;

    if (rdist <= rstep) {
      recruiter.x = recTarget.x;
      recruiter.y = recTarget.y;
      recruiterNodeIdx++;
    } else {
      recruiter.x += (rdx / rdist) * rstep;
      recruiter.y += (rdy / rdist) * rstep;
      recruiter.dir = Math.abs(rdx) > Math.abs(rdy) ? (rdx > 0 ? "right" : "left") : (rdy > 0 ? "down" : "up");
      recruiter.frameTimer = (recruiter.frameTimer || 0) + dt;
      if (recruiter.frameTimer > 0.12) {
        recruiter.frame = (recruiter.frame === 1) ? 2 : 1;
        recruiter.frameTimer = 0;
      }
    }
  }

  // Player follows recruiter. Player's target is the previous node of recruiter (or recruiterNodeIdx - 1)
  const playerTargetIdx = recruiterNodeIdx - 1;
  const playerTarget = playerTargetIdx >= 0 ? recruiterEscortPath[playerTargetIdx] : null;
  if (playerTarget) {
    const pdx = playerTarget.x - player.x;
    const pdy = playerTarget.y - player.y;
    const pdist = Math.hypot(pdx, pdy);
    const pstep = speed * dt;

    if (pdist <= pstep) {
      player.x = playerTarget.x;
      player.y = playerTarget.y;
      player.frame = 0;
    } else {
      player.x += (pdx / pdist) * pstep;
      player.y += (pdy / pdist) * pstep;
      player.dir = Math.abs(pdx) > Math.abs(pdy) ? (pdx > 0 ? "right" : "left") : (pdy > 0 ? "down" : "up");
      player.animTimer = (player.animTimer || 0) + dt;
      if (player.animTimer > 0.12) {
        player.frame = player.frame === 0 ? 1 : player.frame === 1 ? 2 : 0;
        player.animTimer = 0;
      }
    }
  }

  // Check if recruiter has completed the path
  if (recruiterNodeIdx >= recruiterEscortPath.length) {
    isRecruiterEscortActive = false;
    recruiter.frame = 0;
    player.frame = 0;

    // Face each other dynamically based on relative positions
    const dx = player.x - recruiter.x;
    const dy = player.y - recruiter.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      recruiter.dir = dx > 0 ? "right" : "left";
      player.dir = dx > 0 ? "left" : "right";
    } else {
      recruiter.dir = dy > 0 ? "down" : "up";
      player.dir = dy > 0 ? "up" : "down";
    }

    // Trigger end dialogue
    openEscortEndDialogue();
  }
}

function openEscortEndDialogue() {
  isDialogueOpen = true;
  targetZoom = DIALOGUE_ZOOM_START;

  activeDialogueNpc = {
    id: "recruiter-npc-escort-end",
    npcName: "Tech Recruiter",
    dialogue: [
      "Agh! You're in luck, my friend! I was so sure I had everything set up to finally onboard him...",
      "It seems he only wants to work in fully-remote (or at most 15 minutes from his house), because working in front of a screen seems to be possible from any location...",
      "I thought he'd consider contracts without having this explicitly guaranteed, but apparently he doesn't like companies that enforce RTOs very much...",
      "Meh... I guess I'll just have to wander back and retry another time! Good luck!"
    ]
  };
  currentDialogueIdx = 0;

  if (uiElements.screenContainer) {
    uiElements.screenContainer.classList.add("zoomed");
  }

  uiElements.dialogBox.style.display = "block";
  uiElements.dialogNpc.innerText = activeDialogueNpc.npcName;
  startTypewriter(activeDialogueNpc.dialogue[0]);
}

function startRecruiterReturnWalk() {
  const recruiter = MAPS.town.npcs.find(n => n.id === "recruiter-npc");
  if (!recruiter) return;

  const startCol = Math.round(recruiter.x / TILE_SIZE);
  const startRow = Math.round(recruiter.y / TILE_SIZE);

  const playerCol = Math.round(player.x / TILE_SIZE);
  const playerRow = Math.round(player.y / TILE_SIZE);

  // Return to spawn area (col 15, row 15) avoiding the player tile to prevent displacement
  let path = findGridPath(startCol, startRow, 15, 15, playerCol, playerRow);
  if (!path) {
    // Fallback: try finding a path without avoiding the player tile if they block all paths
    path = findGridPath(startCol, startRow, 15, 15);
  }

  if (path) {
    recruiterReturnPath = path.map(node => ({ x: node.col * TILE_SIZE, y: node.row * TILE_SIZE }));
    recruiterReturnNodeIdx = 0;
    isRecruiterReturning = true;
    recruiter.isWandering = false;
  } else {
    // Force snap
    recruiter.x = 15 * TILE_SIZE;
    recruiter.y = 15 * TILE_SIZE;
    recruiter.isWandering = true;
  }
}

function updateRecruiterReturn(dt) {
  const recruiter = MAPS.town.npcs.find(n => n.id === "recruiter-npc");
  if (!recruiter || !recruiterReturnPath) {
    isRecruiterReturning = false;
    return;
  }

  const target = recruiterReturnPath[recruiterReturnNodeIdx];
  if (target) {
    const dx = target.x - recruiter.x;
    const dy = target.y - recruiter.y;
    const dist = Math.hypot(dx, dy);
    const speed = 120;
    const step = speed * dt;

    if (dist <= step) {
      recruiter.x = target.x;
      recruiter.y = target.y;
      recruiterReturnNodeIdx++;
    } else {
      recruiter.x += (dx / dist) * step;
      recruiter.y += (dy / dist) * step;
      recruiter.dir = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up");
      recruiter.frameTimer = (recruiter.frameTimer || 0) + dt;
      if (recruiter.frameTimer > 0.12) {
        recruiter.frame = (recruiter.frame === 1) ? 2 : 1;
        recruiter.frameTimer = 0;
      }
    }
  } else {
    isRecruiterReturning = false;
    recruiter.frame = 0;
    recruiter.isWandering = true; // resume normal wandering
  }
}

// Leone / Azzurra Chase Event State Machine
function triggerLeoneChase() {
  if (chaseState !== "IDLE") return; // Don't interrupt active chases
  chaseState = "SPRINTING";
  chaseTimer = 3.0 + Math.random() * 2.0; // Random 3 to 5 seconds
  const azzurra = MAPS.town.npcs.find(n => n.id === "azzurra");
  const leone = MAPS.town.npcs.find(n => n.id === "leone");
  if (azzurra) delete azzurra.activeAxis;
  if (leone) delete leone.activeAxis;
}

function updateLeoneChase(dt) {
  const azzurra = MAPS.town.npcs.find(n => n.id === "azzurra");
  const leone = MAPS.town.npcs.find(n => n.id === "leone");
  if (!azzurra || !leone) return;

  if (Math.random() < 0.01) {
    console.log("chaseState:", chaseState, "azzurra:", Math.round(azzurra.x), Math.round(azzurra.y), "leone:", Math.round(leone.x), Math.round(leone.y));
  }

  const spawnAzzurraX = 13 * TILE_SIZE;
  const spawnAzzurraY = 18 * TILE_SIZE;
  const spawnLeoneX = 13 * TILE_SIZE;
  const spawnLeoneY = 19 * TILE_SIZE;

  if (chaseState === "IDLE") {
    // Both are stationary in their spawn plaza positions
    azzurra.x = spawnAzzurraX;
    azzurra.y = spawnAzzurraY;
    leone.x = spawnLeoneX;
    leone.y = spawnLeoneY;
    delete azzurra.activeAxis;
    delete leone.activeAxis;
    return;
  }

  if (chaseState === "SPRINTING") {
    // Leone sprints randomly at 200 pixels/sec but runs consistently in a direction for a bit
    if (!leone.isMoving) {
      if (leone.runStepsRemaining === undefined) {
        leone.runStepsRemaining = 0;
      }

      let chooseNewDir = (leone.runStepsRemaining <= 0 || !leone.dir);

      if (!chooseNewDir) {
        let testX = leone.x;
        let testY = leone.y;
        if (leone.dir === "up") testY -= TILE_SIZE;
        else if (leone.dir === "down") testY += TILE_SIZE;
        else if (leone.dir === "left") testX -= TILE_SIZE;
        else if (leone.dir === "right") testX += TILE_SIZE;

        if (!checkNpcCollision(leone, testX, testY)) {
          leone.targetX = testX;
          leone.targetY = testY;
          leone.isMoving = true;
          leone.runStepsRemaining--;
        } else {
          chooseNewDir = true; // hit obstacle, pick a new direction
        }
      }

      if (chooseNewDir) {
        const dirs = ["up", "down", "left", "right"];
        const shuffledDirs = dirs.sort(() => Math.random() - 0.5);
        let foundDir = false;
        for (let d of shuffledDirs) {
          let testX = leone.x;
          let testY = leone.y;
          if (d === "up") testY -= TILE_SIZE;
          else if (d === "down") testY += TILE_SIZE;
          else if (d === "left") testX -= TILE_SIZE;
          else if (d === "right") testX += TILE_SIZE;

          if (!checkNpcCollision(leone, testX, testY)) {
            leone.targetX = testX;
            leone.targetY = testY;
            leone.isMoving = true;
            leone.dir = d;
            leone.runStepsRemaining = 3 + Math.floor(Math.random() * 4); // run 3 to 6 tiles consistently
            foundDir = true;
            break;
          }
        }
        if (!foundDir) {
          leone.targetX = leone.x;
          leone.targetY = leone.y;
          leone.isMoving = false;
          leone.runStepsRemaining = 0;
        }
      }
    }

    // Process Leone's active sprinting step
    if (leone.isMoving) {
      const step = 200 * dt;
      let arrivedX = false;
      let arrivedY = false;
      if (leone.x < leone.targetX) {
        leone.x = Math.min(leone.targetX, leone.x + step);
        if (leone.x === leone.targetX) arrivedX = true;
      } else if (leone.x > leone.targetX) {
        leone.x = Math.max(leone.targetX, leone.x - step);
        if (leone.x === leone.targetX) arrivedX = true;
      } else {
        arrivedX = true;
      }

      if (leone.y < leone.targetY) {
        leone.y = Math.min(leone.targetY, leone.y + step);
        if (leone.y === leone.targetY) arrivedY = true;
      } else if (leone.y > leone.targetY) {
        leone.y = Math.max(leone.targetY, leone.y - step);
        if (leone.y === leone.targetY) arrivedY = true;
      } else {
        arrivedY = true;
      }

      if (arrivedX && arrivedY) {
        leone.isMoving = false;
      }
    }

    // Azzurra immediately chases Leone at a slower speed (130 pixels/sec) while calculating the fastest trajectory
    moveAzzurraTowards(leone.x, leone.y, 130, dt);

    // Count down sprint timer
    chaseTimer -= dt;
    if (chaseTimer <= 0) {
      chaseState = "TIRED";
      leone.isMoving = false;
      // Snap Leone to the nearest tile center to prevent boundary overlap/getting stuck
      leone.x = Math.round(leone.x / TILE_SIZE) * TILE_SIZE;
      leone.y = Math.round(leone.y / TILE_SIZE) * TILE_SIZE;
      delete azzurra.activeAxis;
      delete leone.activeAxis;
    }
  } else if (chaseState === "TIRED") {
    // Leone is tired and stopped. Azzurra walks to him at a slower speed (70 pixels/sec)
    const reached = moveAzzurraTowards(leone.x, leone.y, 70, dt);
    if (reached) {
      chaseState = "RESETTING";
      delete azzurra.activeAxis;
      delete leone.activeAxis;
    }
  } else if (chaseState === "RESETTING") {
    // Both walk back to spawn coordinates smoothly.
    // Azzurra resets at 55px/s and Leone at 35px/s to split coordinates immediately and prevent overlapping sprites.
    const azzArrived = moveAzzurraTowards(spawnAzzurraX, spawnAzzurraY, 55, dt);
    const leoneArrived = moveLeoneTowards(spawnLeoneX, spawnLeoneY, 35, dt);

    if (azzArrived && leoneArrived) {
      chaseState = "IDLE";
      azzurra.dir = "right";
      leone.dir = "right";
      delete azzurra.activeAxis;
      delete leone.activeAxis;
    }
  }
}

function moveAzzurraTowards(targetX, targetY, speed, dt) {
  const azzurra = MAPS.town.npcs.find(n => n.id === "azzurra");
  if (!azzurra) return false;

  const dx = targetX - azzurra.x;
  const dy = targetY - azzurra.y;
  const dist = Math.hypot(dx, dy);

  if (dist < 2) {
    azzurra.x = targetX;
    azzurra.y = targetY;
    azzurra.isMoving = false;
    delete azzurra.activeAxis;
    return true;
  }

  const step = speed * dt;

  // Initialize activeAxis sticky movement if not defined
  if (!azzurra.activeAxis) {
    azzurra.activeAxis = Math.abs(dx) > Math.abs(dy) ? "X" : "Y";
  }

  // Swap axis if the current active axis delta is already resolved
  if (azzurra.activeAxis === "X" && Math.abs(dx) < 1.0) {
    azzurra.activeAxis = "Y";
  } else if (azzurra.activeAxis === "Y" && Math.abs(dy) < 1.0) {
    azzurra.activeAxis = "X";
  }

  const tryMove = (axis) => {
    if (axis === "X" && Math.abs(dx) > 0.1) {
      const nextX = azzurra.x + Math.sign(dx) * Math.min(step, Math.abs(dx));
      if (!checkNpcCollision(azzurra, nextX, azzurra.y)) {
        azzurra.x = nextX;
        azzurra.dir = dx > 0 ? "right" : "left";
        azzurra.isMoving = true;
        return true;
      }
    } else if (axis === "Y" && Math.abs(dy) > 0.1) {
      const nextY = azzurra.y + Math.sign(dy) * Math.min(step, Math.abs(dy));
      if (!checkNpcCollision(azzurra, azzurra.x, nextY)) {
        azzurra.y = nextY;
        azzurra.dir = dy > 0 ? "down" : "up";
        azzurra.isMoving = true;
        return true;
      }
    }
    return false;
  };

  let moved = false;
  const currentActive = azzurra.activeAxis;
  const alternateAxis = currentActive === "X" ? "Y" : "X";

  // Sticky Axis Routing
  if (tryMove(currentActive)) {
    moved = true;
  } else if (tryMove(alternateAxis)) {
    // Alternate axis succeeded: stick to it in subsequent ticks to prevent zig-zag jitter
    azzurra.activeAxis = alternateAxis;
    moved = true;
  }

  if (!moved) {
    // Try other directions if target path is completely blocked
    const dirs = ["up", "down", "left", "right"];
    for (let d of dirs) {
      let testX = azzurra.x;
      let testY = azzurra.y;
      if (d === "up") testY -= step;
      else if (d === "down") testY += step;
      else if (d === "left") testX -= step;
      else if (d === "right") testX += step;

      if (!checkNpcCollision(azzurra, testX, testY)) {
        azzurra.x = testX;
        azzurra.y = testY;
        azzurra.dir = d;
        azzurra.isMoving = true;
        moved = true;
        // Update the active axis to match the cardinal detour direction
        azzurra.activeAxis = (d === "left" || d === "right") ? "X" : "Y";
        break;
      }
    }
  }

  if (!moved) {
    // Direct step fallback to break any possible deadlock near structures - PURELY CARDINAL & STICKY
    if (azzurra.activeAxis === "X") {
      azzurra.x += Math.sign(dx) * Math.min(step, Math.abs(dx));
      azzurra.dir = dx > 0 ? "right" : "left";
    } else {
      azzurra.y += Math.sign(dy) * Math.min(step, Math.abs(dy));
      azzurra.dir = dy > 0 ? "down" : "up";
    }
    azzurra.isMoving = true;
  }

  return false;
}

function moveLeoneTowards(targetX, targetY, speed, dt) {
  const leone = MAPS.town.npcs.find(n => n.id === "leone");
  if (!leone) return false;

  const dx = targetX - leone.x;
  const dy = targetY - leone.y;
  const dist = Math.hypot(dx, dy);

  if (dist < 2) {
    leone.x = targetX;
    leone.y = targetY;
    leone.isMoving = false;
    delete leone.activeAxis;
    return true;
  }

  const step = speed * dt;

  // Initialize activeAxis sticky movement if not defined
  if (!leone.activeAxis) {
    leone.activeAxis = Math.abs(dx) > Math.abs(dy) ? "X" : "Y";
  }

  // Swap axis if the current active axis delta is already resolved
  if (leone.activeAxis === "X" && Math.abs(dx) < 1.0) {
    leone.activeAxis = "Y";
  } else if (leone.activeAxis === "Y" && Math.abs(dy) < 1.0) {
    leone.activeAxis = "X";
  }

  const tryMove = (axis) => {
    if (axis === "X" && Math.abs(dx) > 0.1) {
      const nextX = leone.x + Math.sign(dx) * Math.min(step, Math.abs(dx));
      if (!checkNpcCollision(leone, nextX, leone.y)) {
        leone.x = nextX;
        leone.dir = dx > 0 ? "right" : "left";
        leone.isMoving = true;
        return true;
      }
    } else if (axis === "Y" && Math.abs(dy) > 0.1) {
      const nextY = leone.y + Math.sign(dy) * Math.min(step, Math.abs(dy));
      if (!checkNpcCollision(leone, leone.x, nextY)) {
        leone.y = nextY;
        leone.dir = dy > 0 ? "down" : "up";
        leone.isMoving = true;
        return true;
      }
    }
    return false;
  };

  let moved = false;
  const currentActive = leone.activeAxis;
  const alternateAxis = currentActive === "X" ? "Y" : "X";

  // Sticky Axis Routing
  if (tryMove(currentActive)) {
    moved = true;
  } else if (tryMove(alternateAxis)) {
    // Alternate axis succeeded: stick to it in subsequent ticks to prevent zig-zag jitter
    leone.activeAxis = alternateAxis;
    moved = true;
  }

  if (!moved) {
    // Try other directions if target path is completely blocked
    const dirs = ["up", "down", "left", "right"];
    for (let d of dirs) {
      let testX = leone.x;
      let testY = leone.y;
      if (d === "up") testY -= step;
      else if (d === "down") testY += step;
      else if (d === "left") testX -= step;
      else if (d === "right") testX += step;

      if (!checkNpcCollision(leone, testX, testY)) {
        leone.x = testX;
        leone.y = testY;
        leone.dir = d;
        leone.isMoving = true;
        moved = true;
        // Update the active axis to match the cardinal detour direction
        leone.activeAxis = (d === "left" || d === "right") ? "X" : "Y";
        break;
      }
    }
  }

  if (!moved) {
    // Direct step fallback to break any possible deadlock near structures - PURELY CARDINAL & STICKY
    if (leone.activeAxis === "X") {
      leone.x += Math.sign(dx) * Math.min(step, Math.abs(dx));
      leone.dir = dx > 0 ? "right" : "left";
    } else {
      leone.y += Math.sign(dy) * Math.min(step, Math.abs(dy));
      leone.dir = dy > 0 ? "down" : "up";
    }
    leone.isMoving = true;
  }

  return false;
}

// Core tick update function
function update(dt) {
  // Smoothly interpolate currentZoom towards targetZoom
  const zoomSpeed = 4.0; // Smooth transition speed
  currentZoom += (targetZoom - currentZoom) * zoomSpeed * dt;

  if (isRecruiterEscortActive) {
    updateRecruiterEscort(dt);
    return;
  }

  if (isWarping || isDialogueOpen || isProjectSelectorOpen || isPrivacyModalOpen || uiElements.projectPanel.style.display === "block") {
    // Game is paused while reading text/viewing technical specs/warping/using terminal/viewing privacy notice
    player.frame = 0;
    return;
  }

  // Update Leone / Azzurra chase state machine
  if (currentMapName === "town") {
    updateLeoneChase(dt);
    if (isRecruiterReturning) {
      updateRecruiterReturn(dt);
    }
  }

  // Update wandering NPCs
  const activeMap = getCurrentMap();

  activeMap.npcs.forEach((npc) => {
    if (!npc.isWandering) return;
    if (npc.targetX === undefined) {
      npc.targetX = npc.x;
      npc.targetY = npc.y;
      npc.isMoving = false;
      npc.wanderTimer = Math.random() * 2 + 1;
      npc.speed = 25;
    }

    if (npc.isMoving) {
      let arrivedX = false;
      let arrivedY = false;
      const step = npc.speed * dt;

      if (npc.x < npc.targetX) {
        npc.x = Math.min(npc.targetX, npc.x + step);
        if (npc.x === npc.targetX) arrivedX = true;
      } else if (npc.x > npc.targetX) {
        npc.x = Math.max(npc.targetX, npc.x - step);
        if (npc.x === npc.targetX) arrivedX = true;
      } else {
        arrivedX = true;
      }

      if (npc.y < npc.targetY) {
        npc.y = Math.min(npc.targetY, npc.y + step);
        if (npc.y === npc.targetY) arrivedY = true;
      } else if (npc.y > npc.targetY) {
        npc.y = Math.max(npc.targetY, npc.y - step);
        if (npc.y === npc.targetY) arrivedY = true;
      } else {
        arrivedY = true;
      }

      if (arrivedX && arrivedY) {
        npc.isMoving = false;
        npc.wanderTimer = Math.random() * 2 + 1;
      }
    } else {
      npc.wanderTimer -= dt;
      if (npc.wanderTimer <= 0) {
        const dirs = ["up", "down", "left", "right"];
        const randomDir = dirs[Math.floor(Math.random() * dirs.length)];
        npc.dir = randomDir;

        let nextX = npc.x;
        let nextY = npc.y;
        if (randomDir === "up") nextY -= TILE_SIZE;
        else if (randomDir === "down") nextY += TILE_SIZE;
        else if (randomDir === "left") nextX -= TILE_SIZE;
        else if (randomDir === "right") nextX += TILE_SIZE;

        if (!checkNpcCollision(npc, nextX, nextY)) {
          npc.targetX = nextX;
          npc.targetY = nextY;
          npc.isMoving = true;
        } else {
          npc.wanderTimer = Math.random() * 1 + 0.5;
        }
      }
    }
  });

  let dx = 0;
  let dy = 0;

  if (keysPressed["KeyW"] || keysPressed["ArrowUp"]) {
    dy = -1;
    player.dir = "up";
  }
  if (keysPressed["KeyS"] || keysPressed["ArrowDown"]) {
    dy = 1;
    player.dir = "down";
  }
  if (keysPressed["KeyA"] || keysPressed["ArrowLeft"]) {
    dx = -1;
    player.dir = "left";
  }
  if (keysPressed["KeyD"] || keysPressed["ArrowRight"]) {
    dx = 1;
    player.dir = "right";
  }

  const isMoving = dx !== 0 || dy !== 0;
  player.isMoving = isMoving;

  if (isMoving) {
    // DIAGONAL SPEED NORMALIZATION (dx/dy scaled by 1 / sqrt(2) = 0.7071)
    if (dx !== 0 && dy !== 0) {
      dx *= 0.7071;
      dy *= 0.7071;
    }

    const nextX = player.x + dx * player.speed * dt;
    const nextY = player.y + dy * player.speed * dt;

    // AXIS INDEPENDENT SLIDING COLLISIONS (Player can slide alongside walls smoothly)
    // Test X update
    if (!checkCollision(nextX, player.y)) {
      player.x = nextX;
    }

    // Test Y update
    if (!checkCollision(player.x, nextY)) {
      player.y = nextY;
    }

    // Trigger door checking
    checkWarp();

    // Sprite Walking Animation Ticker
    player.animTimer += dt;
    if (player.animTimer > 0.12) { // 120ms frame steps
      player.frame = player.frame === 0 ? 1 : player.frame === 1 ? 2 : 0;
      player.animTimer = 0;
    }
  } else {
    // Idle frame
    player.frame = 0;
  }

  // Resolve any player-NPC overlaps to prevent the player from getting stuck
  resolvePlayerNpcOverlaps();
}


// --------------------------------------------------
// 6. RENDER VIEWPORT & CAMERA
// --------------------------------------------------
function render() {
  ctx.clearRect(0, 0, VIEW_WIDTH, VIEW_HEIGHT);

  const activeMap = getCurrentMap();
  const mapWidth = activeMap.cols * TILE_SIZE;
  const mapHeight = activeMap.rows * TILE_SIZE;

  // Compute effective viewport dimensions inside zoomed coordinates
  const effViewWidth = VIEW_WIDTH / currentZoom;
  const effViewHeight = VIEW_HEIGHT / currentZoom;

  // Dynamic Camera tracking centered on player
  let camX = player.x + 8 - effViewWidth / 2;
  let camY = player.y + 8 - effViewHeight / 2;

  // Clamp camera position within map boundaries, or center if map is smaller than viewport
  if (mapWidth < effViewWidth) {
    camX = - (effViewWidth - mapWidth) / 2;
  } else {
    camX = Math.max(0, Math.min(camX, mapWidth - effViewWidth));
  }

  if (mapHeight < effViewHeight) {
    camY = - (effViewHeight - mapHeight) / 2;
  } else {
    camY = Math.max(0, Math.min(camY, mapHeight - effViewHeight));
  }

  // Round camera positions to guarantee crisp integer snap rendering
  const snapCamX = Math.floor(camX);
  const snapCamY = Math.floor(camY);

  // Set up scaled drawing context for GPU-accelerated retro zoom
  ctx.save();
  ctx.scale(currentZoom, currentZoom);

  // 1. Draw Background Map Tiles (Pass A)
  const waterFrame = Math.floor(Date.now() / 400) % 3;
  for (let r = 0; r < activeMap.rows; r++) {
    for (let c = 0; c < activeMap.cols; c++) {
      const tileIndex = activeMap.grid[r][c];
      if (isForegroundTile(tileIndex)) {
        if (currentMapName === "town") {
          const grassCanvas = ASSETS.tiles["grass"];
          if (grassCanvas) {
            ctx.drawImage(
              grassCanvas,
              c * TILE_SIZE - snapCamX,
              r * TILE_SIZE - snapCamY
            );
          }
        }
        continue; // Handled in Pass B
      }

      const tileName = TILE_TYPES[tileIndex];
      let tileCanvas = ASSETS.tiles[tileName];

      // Dynamic water ripple animation frame selection
      if (tileName === "water") {
        tileCanvas = ASSETS.tiles["water_" + waterFrame];
      }

      if (tileCanvas) {
        // If we are on the town map, handle layered transparency for underlays
        if (currentMapName === "town") {
          let backgroundUnderlay = null;

          if (tileIndex === 11) {
            // Find which building this sign belongs to and draw its theme's wall_center
            const house = MAPS.town.placedHouses.find(h => c === h.col + 4 && r === h.row + 4);
            const wallName = (house && house.id === "projects") ? "cyber_wall_center" :
                             (house && house.id === "skills") ? "school_wall_center" :
                             (house && house.id === "contact") ? "cozy_wall_center" : "grass";
            backgroundUnderlay = ASSETS.tiles[wallName];
          } else {
            // Standard ground-level transparent assets (tree trunks, wall borders, doors) get grass underlay
            const needsGrassBack = [
              10,                     // Tree trunk
              16, 18, 26, 28, 36, 38, // Left/right building wall edges
              20, 21, 30, 31, 40, 41  // Building doors
            ];
            if (needsGrassBack.includes(tileIndex)) {
              backgroundUnderlay = ASSETS.tiles["grass"];
            }
          }

          if (backgroundUnderlay) {
            ctx.drawImage(
              backgroundUnderlay,
              c * TILE_SIZE - snapCamX,
              r * TILE_SIZE - snapCamY
            );
          }
        }

        ctx.drawImage(
          tileCanvas,
          c * TILE_SIZE - snapCamX,
          r * TILE_SIZE - snapCamY
        );
      }
    }
  }

  if (currentMapName === "town") {
    // Draw Door Indicators / Building Portals
    // Draw glowing path markings under house doorways matching their themed colors
    MAPS.town.placedHouses.forEach((house) => {
      const color = house.id === "projects" ? "rgba(6, 182, 212, 0.4)" :
                    house.id === "skills" ? "rgba(239, 68, 68, 0.4)" :
                    "rgba(245, 158, 11, 0.4)";
      ctx.fillStyle = color;
      ctx.fillRect(
        (house.col + 2) * TILE_SIZE - snapCamX,
        (house.row + 4) * TILE_SIZE - snapCamY,
        32,
        4
      );
    });
  }

  // 2. Draw NPCs
  activeMap.npcs.forEach((npc) => {
    const npcSpriteMap = ASSETS.sprites[npc.sprite];
    if (npcSpriteMap) {
      const npcFrame = npcSpriteMap[npc.dir][0]; // static frame for dialog NPCs
      if (npcFrame) {
        let drawY = npc.y - 12 - snapCamY;
        if (npc.sprite && npc.sprite.startsWith("logo_")) {
          drawY += Math.sin(Date.now() / 200) * 3;
        }
        ctx.drawImage(
          npcFrame,
          Math.floor(npc.x - 8 - snapCamX), // Adjusted center offsets due to 32x32 canvases
          Math.floor(drawY)
        );
      }
    }
  });

  // 3. Draw Player Sprite (AWS Tech Lead)
  const playerSpriteMap = ASSETS.sprites["player"];
  if (playerSpriteMap) {
    const playerFrame = playerSpriteMap[player.dir][player.frame];
    if (playerFrame) {
      let drawW = 32;
      let drawH = 32;
      let drawX = player.x - 8 - snapCamX;
      let drawY = player.y - 12 - snapCamY;

      if (player.isMoving) {
        // Discrete walking bob: shift up by 1 pixel on stepping frames (frame 1 and 2)
        // This is perfectly integer-aligned and avoids sub-pixel rendering shimmer.
        if (player.frame !== 0) {
          drawY -= 1;
        }
      }

      ctx.drawImage(
        playerFrame,
        Math.floor(drawX),
        Math.floor(drawY),
        drawW,
        drawH
      );
    }
  }

  // 3b. Draw Foreground Map Tiles (Pass B - drawn on top of characters)
  for (let r = 0; r < activeMap.rows; r++) {
    for (let c = 0; c < activeMap.cols; c++) {
      const tileIndex = activeMap.grid[r][c];
      if (!isForegroundTile(tileIndex)) continue; // Handled in Pass A

      const tileName = TILE_TYPES[tileIndex];
      let tileCanvas = ASSETS.tiles[tileName];

      if (tileCanvas) {
        // If we are on the town map, handle layered transparency for underlays
        if (currentMapName === "town") {
          let backgroundUnderlay = null;

          if (tileIndex === 15) {
            // Cyber roof top gets cyber roof center underneath to make shingles continuous
            backgroundUnderlay = ASSETS.tiles["cyber_roof_center"];
          } else if (tileIndex === 25) {
            // School roof top gets school roof center underneath
            backgroundUnderlay = ASSETS.tiles["school_roof_center"];
          } else if (tileIndex === 35) {
            // Cozy roof top gets cozy roof center underneath
            backgroundUnderlay = ASSETS.tiles["cozy_roof_center"];
          }

          if (backgroundUnderlay) {
            ctx.drawImage(
              backgroundUnderlay,
              c * TILE_SIZE - snapCamX,
              r * TILE_SIZE - snapCamY
            );
          }
        }

        ctx.drawImage(
          tileCanvas,
          c * TILE_SIZE - snapCamX,
          r * TILE_SIZE - snapCamY
        );
      }
    }
  }

  // Restore standard context before positioning DOM elements
  ctx.restore();

  // 4. Position and Display Floating Building HTML Labels with Crisp Sub-pixel Rendering
  const labelProjects = document.getElementById("label-projects");
  const labelSkills = document.getElementById("label-skills");
  const labelContact = document.getElementById("label-contact");
  const timelineContainer = document.getElementById("timelineLabelsContainer");

  if (currentMapName === "town") {
    if (timelineContainer) timelineContainer.style.display = "none";
    MAPS.town.placedHouses.forEach((house) => {
      const labelEl = house.id === "projects" ? labelProjects :
                      house.id === "skills" ? labelSkills : labelContact;
      if (labelEl) {
        labelEl.style.display = "block";

        // Horizontal center of columns 2 & 3 of the 6-tile-wide building
        const houseCenterX = (house.col * TILE_SIZE) + (3 * TILE_SIZE);

        // Vertically snapped directly into Row 0 of the building (where the roof_top tiles lie)
        // Center of Row 0 (Y axis) is exactly +8 pixels from top edge
        const houseTopY = house.row * TILE_SIZE;

        const targetX = houseCenterX - snapCamX;
        const targetY = houseTopY + 8 - snapCamY;

        // Compute percentage of the 320x240 retro viewport, accounting for the dynamic camera zoom
        const pctX = ((targetX * currentZoom) / VIEW_WIDTH) * 100;
        const pctY = ((targetY * currentZoom) / VIEW_HEIGHT) * 100;

        labelEl.style.left = `${pctX}%`;
        labelEl.style.top = `${pctY}%`;
      }
    });
  } else {
    // Hide building labels when player is in building interiors
    if (labelProjects) labelProjects.style.display = "none";
    if (labelSkills) labelSkills.style.display = "none";
    if (labelContact) labelContact.style.display = "none";

    if (currentMapName === "skills_interior") {
      if (timelineContainer) timelineContainer.style.display = "block";
      const timelineLabels = {
        "high-school": document.getElementById("label-high-school"),
        "thesis-helios": document.getElementById("label-thesis-helios"),
        "lab-assistant": document.getElementById("label-lab-assistant"),
        "thesis-webshell": document.getElementById("label-thesis-webshell"),
        "storm-reply": document.getElementById("label-storm-reply"),
        "zero12": document.getElementById("label-zero12")
      };

      MAPS.skills_interior.npcs.forEach((npc) => {
        const labelEl = timelineLabels[npc.id];
        if (labelEl) {
          labelEl.style.display = "block";

          // Horizontal center of the NPC (npc.x is its absolute pixel coordinate on the map)
          // Center of the 16x16 tile is npc.x + 8
          const npcCenterX = npc.x + 8;

          // Floating label should sit above the NPC's head
          const npcTopY = npc.y - 18;

          const targetX = npcCenterX - snapCamX;
          const targetY = npcTopY - snapCamY;

          // Compute percentage of the 320x240 retro viewport, accounting for dynamic camera zoom
          const pctX = ((targetX * currentZoom) / VIEW_WIDTH) * 100;
          const pctY = ((targetY * currentZoom) / VIEW_HEIGHT) * 100;

          labelEl.style.left = `${pctX}%`;
          labelEl.style.top = `${pctY}%`;
        }
      });
    } else {
      if (timelineContainer) timelineContainer.style.display = "none";
    }
  }
}


// --------------------------------------------------
// 7. TIME ACCUMULATOR MAIN ENGINE LOOP
// --------------------------------------------------
let lastTime = 0;
let accumulator = 0;
const FIXED_DT = 1 / 60; // 60 FPS physics updates

function gameLoop(timestamp) {
  if (!lastTime) lastTime = timestamp;
  let dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  // Limit maximum accumulator step to avoid teleporting during frame drops/inactive tabs
  if (dt > 0.1) dt = 0.1;

  accumulator += dt;
  while (accumulator >= FIXED_DT) {
    update(FIXED_DT);
    accumulator -= FIXED_DT;
  }

  render();
  requestAnimationFrame(gameLoop);
}

// Launch engine!
setupTouchControls();
requestAnimationFrame(gameLoop);


// --------------------------------------------------
// 8. VIRTUAL TOUCH CONTROLS FOR KEYBOARD-LESS DEVICES
// --------------------------------------------------
function setupTouchControls() {
  console.log("[TouchEngine] Initializing Virtual Touch controls...");
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  const touchHud = document.getElementById("touchControls");

  if (!touchHud) {
    console.error("[TouchEngine] Error: touchControls element not found in DOM.");
    return;
  }

  // Show touch controls on touch-enabled devices
  if (isTouchDevice) {
    touchHud.style.display = "flex";
    console.log("[TouchEngine] Touch-capable device detected. Virtual Joystick HUD activated.");
  } else {
    touchHud.style.display = "none";
    console.log("[TouchEngine] Desktop/Mouse device detected. Virtual Joystick HUD disabled.");
    return;
  }

  // Helper to dispatch KeyboardEvents synthetically
  function dispatchKey(type, code) {
    try {
      const event = new KeyboardEvent(type, {
        code: code,
        key: code === "Enter" ? "Enter" : code.replace("Arrow", ""),
        bubbles: true,
        cancelable: true
      });
      window.dispatchEvent(event);
    } catch (err) {
      console.error("[TouchEngine] Error dispatching key event:", err);
    }
  }

  // 1. HIGH-FIDELITY 8-WAY VIRTUAL JOYSTICK
  try {
    const joystickBase = document.getElementById("joystickBase");
    const joystickHandle = document.getElementById("joystickHandle");

    if (joystickBase && joystickHandle) {
      const maxRadius = 40; // Max radius handle can travel in pixels
      const deadzone = 8;   // Minimum drift before registering movement
      let activePointerId = null;
      let isDraggingMouse = false;
      let centerX = 0;
      let centerY = 0;

      let prevJoystickKeys = {
        ArrowUp: false,
        ArrowDown: false,
        ArrowLeft: false,
        ArrowRight: false
      };

      function updateJoystick(clientX, clientY) {
        try {
          let dx = clientX - centerX;
          let dy = clientY - centerY;

          // Correct coordinate system rotation when simulated portrait landscape toggle (.forced-landscape) is active
          if (document.body.classList.contains("forced-landscape")) {
            const tempX = dx;
            dx = dy;
            dy = -tempX;
          }

          const dist = Math.sqrt(dx * dx + dy * dy);

          // Clamp visual position of the handle
          let handleX = dx;
          let handleY = dy;
          if (dist > maxRadius) {
            handleX = (dx / dist) * maxRadius;
            handleY = (dy / dist) * maxRadius;
          }

          // Smooth slide transform relative to parent absolute center
          joystickHandle.style.transform = `translate(calc(-50% + ${handleX}px), calc(-50% + ${handleY}px))`;

          // Map deflection vectors to simulated keyboard keys
          let activeKeys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
          };

          if (dist >= deadzone) {
            const nx = dx / dist;
            const ny = dy / dist;

            // 8-way directional mapping using a uniform 0.3826 threshold (sin of 22.5 deg)
            if (ny < -0.3826) activeKeys.ArrowUp = true;
            if (ny > 0.3826) activeKeys.ArrowDown = true;
            if (nx < -0.3826) activeKeys.ArrowLeft = true;
            if (nx > 0.3826) activeKeys.ArrowRight = true;
          }

          // Dispatch simulated events if keyboard states shifted
          for (const key in activeKeys) {
            if (activeKeys[key] && !prevJoystickKeys[key]) {
              dispatchKey("keydown", key);
            } else if (!activeKeys[key] && prevJoystickKeys[key]) {
              dispatchKey("keyup", key);
            }
          }
          prevJoystickKeys = { ...activeKeys };
        } catch (err) {
          console.error("[TouchEngine] Error in updateJoystick:", err);
        }
      }

      function resetJoystick() {
        try {
          joystickHandle.style.transform = "translate(-50%, -50%)";
          for (const key in prevJoystickKeys) {
            if (prevJoystickKeys[key]) {
              dispatchKey("keyup", key);
            }
          }
          prevJoystickKeys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
          };
        } catch (err) {
          console.error("[TouchEngine] Error in resetJoystick:", err);
        }
      }

      // Touch Event Handlers
      const handleTouchStart = (e) => {
        if (activePointerId !== null) return;
        e.preventDefault();
        const touch = e.changedTouches[0];
        activePointerId = touch.identifier;
        const rect = joystickBase.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
        updateJoystick(touch.clientX, touch.clientY);
      };

      const handleTouchMove = (e) => {
        if (activePointerId === null) return;
        for (let i = 0; i < e.touches.length; i++) {
          const touch = e.touches[i];
          if (touch.identifier === activePointerId) {
            updateJoystick(touch.clientX, touch.clientY);
            break;
          }
        }
      };

      const handleTouchEnd = (e) => {
        if (activePointerId === null) return;
        for (let i = 0; i < e.changedTouches.length; i++) {
          const touch = e.changedTouches[i];
          if (touch.identifier === activePointerId) {
            resetJoystick();
            activePointerId = null;
            break;
          }
        }
      };

      joystickBase.addEventListener("touchstart", handleTouchStart, { passive: false });
      window.addEventListener("touchmove", handleTouchMove, { passive: false });
      window.addEventListener("touchend", handleTouchEnd, { passive: false });
      window.addEventListener("touchcancel", handleTouchEnd, { passive: false });

      // Desktop Mouse Drag Fallback Handlers
      const handleMouseDown = (e) => {
        e.preventDefault();
        isDraggingMouse = true;
        const rect = joystickBase.getBoundingClientRect();
        centerX = rect.left + rect.width / 2;
        centerY = rect.top + rect.height / 2;
        updateJoystick(e.clientX, e.clientY);
      };

      const handleMouseMove = (e) => {
        if (!isDraggingMouse) return;
        updateJoystick(e.clientX, e.clientY);
      };

      const handleMouseUp = (e) => {
        if (!isDraggingMouse) return;
        resetJoystick();
        isDraggingMouse = false;
      };

      joystickBase.addEventListener("mousedown", handleMouseDown);
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      console.log("[TouchEngine] Virtual Joystick initialized and bound successfully.");
    } else {
      console.warn("[TouchEngine] Warn: joystickBase or joystickHandle element not found in DOM.");
    }
  } catch (err) {
    console.error("[TouchEngine] Exception occurred during Joystick setup:", err);
  }

  // 2. RETRO ARCADE ACTION BUTTON (A / INTERACT)
  try {
    const actionBtn = document.getElementById("action-a");
    if (actionBtn) {
      const handleActionStart = (e) => {
        e.preventDefault();
        actionBtn.classList.add("active");
        dispatchKey("keydown", "Enter");
      };

      const handleActionEnd = (e) => {
        e.preventDefault();
        actionBtn.classList.remove("active");
        dispatchKey("keyup", "Enter");
      };

      actionBtn.addEventListener("touchstart", handleActionStart, { passive: false });
      actionBtn.addEventListener("touchend", handleActionEnd, { passive: false });
      actionBtn.addEventListener("touchcancel", handleActionEnd, { passive: false });

      actionBtn.addEventListener("mousedown", (e) => {
        e.preventDefault();
        actionBtn.classList.add("active");
        dispatchKey("keydown", "Enter");
      });

      actionBtn.addEventListener("mouseup", (e) => {
        e.preventDefault();
        actionBtn.classList.remove("active");
        dispatchKey("keyup", "Enter");
      });

      actionBtn.addEventListener("mouseleave", (e) => {
        e.preventDefault();
        actionBtn.classList.remove("active");
        dispatchKey("keyup", "Enter");
      });
      console.log("[TouchEngine] Action A Button initialized and bound successfully.");
    } else {
      console.warn("[TouchEngine] Warn: action-a button element not found in DOM.");
    }
  } catch (err) {
    console.error("[TouchEngine] Exception occurred during Action Button setup:", err);
  }

  // 3. MANUAL SCREEN ROTATION TOGGLE
  try {
    const rotateBtn = document.getElementById("rotateToggleBtn");
    if (rotateBtn) {
      const handleRotationToggle = (e) => {
        e.preventDefault();
        console.log("[TouchEngine] Screen rotation button triggered. Toggling forced-landscape mode.");
        document.body.classList.toggle("forced-landscape");
      };
      rotateBtn.addEventListener("touchstart", handleRotationToggle, { passive: false });
      rotateBtn.addEventListener("click", handleRotationToggle);
      console.log("[TouchEngine] Manual rotation toggle initialized and bound successfully.");
    } else {
      console.warn("[TouchEngine] Warn: rotateToggleBtn element not found in DOM.");
    }
  } catch (err) {
    console.error("[TouchEngine] Exception occurred during Rotation Button setup:", err);
  }
}

// Support URL hash routing for direct access to the Privacy & Legal Notice
function handlePrivacyHash() {
  if (window.location.hash === "#privacy" || window.location.hash === "#privacyModal") {
    openPrivacyModal();
  }
}
window.addEventListener("hashchange", handlePrivacyHash);
handlePrivacyHash();