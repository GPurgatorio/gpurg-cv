// Procedural Pixel-Art Graphics Generator

export const ASSETS = {
  tiles: {},
  sprites: {}
};

function createOffscreenCanvas(width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingEnabled = false;
  return { canvas, ctx };
}

// --------------------------------------------------
// 1. TILEMAP TILES (16x16 pixels)
// --------------------------------------------------
function drawTileMatrix(name, matrix, colorMap) {
  const { canvas, ctx } = createOffscreenCanvas(16, 16);
  matrix.forEach((rowStr, r) => {
    for (let c = 0; c < rowStr.length; c++) {
      const char = rowStr[c];
      const color = colorMap[char];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(c, r, 1, 1);
      }
    }
  });
  ASSETS.tiles[name] = canvas;
}

// 1. Grass Tile (Lush, organic tiling grass clumps)
const grassColorMap = {
  ".": "#2e7d32", // Lush green base
  "d": "#1b5e20", // Deep forest shadow
  "l": "#4caf50", // Light grass blades
  "h": "#81c784"  // Pale grass tips
};

const grassMatrix = [
  "....l.l.........",
  "...lhlh.d.......",
  "...ldld..d......",
  "d........l.l....",
  ".d......lhlh.d..",
  "........ldld..d.",
  "....d...........",
  ".....d..........",
  ".........l.l....",
  "d.......lhlh.d..",
  ".d......ldld..d.",
  "................",
  "...l.l..........",
  "..lhlh.d........",
  "..ldld..d.......",
  "................"
];
drawTileMatrix("grass", grassMatrix, grassColorMap);

// 1b. Flowery Meadow Grass Tile
const grassFlowersColorMap = {
  ".": "#2e7d32", // Lush green base
  "d": "#1b5e20", // Deep forest shadow
  "l": "#4caf50", // Light grass blades
  "h": "#81c784", // Pale grass tips
  "r": "#ef4444", // Red flower petals
  "y": "#f59e0b", // Yellow flower center
  "w": "#ffffff", // White daisy petals
  "p": "#ec4899"  // Pink petals
};

const grassFlowersMatrix = [
  "....l.l.........",
  "...lhlh.d...p...",
  "...ldld..d.pyp..",
  "d...........p...",
  ".d......lhlh.d..",
  "........ldld..d.",
  "...r............",
  "..ryr..d........",
  "...r.....l.l....",
  "d.......lhlh.d..",
  ".d......ldld..d.",
  "................",
  "...l.l......w...",
  "..lhlh.d...wyw..",
  "..ldld..d...w...",
  "................"
];
drawTileMatrix("grass_flowers", grassFlowersMatrix, grassFlowersColorMap);

// 2. Cobblestone Path Tile
const pathColorMap = {
  ".": "#8d6e63", // Sand/dirt base
  "d": "#4e342e", // Dark mud gap / mortar shadow
  "l": "#bcaaa4", // Sandstone base
  "h": "#d7ccc8", // Highlights
  "w": "#efebe9"  // Specular rim
};

const pathMatrix = [
  "dddddddddddddddd",
  "dlllllhwdlhllhwd",
  "dlllllhwdlhllhwd",
  "dhhhhhhwddhhhhhw",
  "dddddddddddddddd",
  "dlhwdlhllhwdlhll",
  "dlhwdlhllhwdlhll",
  "dhhwddhhhhhwddhh",
  "dddddddddddddddd",
  "dlllllhwdlhllhwd",
  "dlllllhwdlhllhwd",
  "dhhhhhhwddhhhhhw",
  "dddddddddddddddd",
  "dlhwdlhllhwdlhll",
  "dlhwdlhllhwdlhll",
  "dhhwddhhhhhwddhh"
];
drawTileMatrix("path", pathMatrix, pathColorMap);

// 3. Animated Water Frames (Glistening ripples and Specular glints)
const waterColorMap = {
  ".": "#1565c0", // Rich dark blue body
  "d": "#0d47a1", // Deep blue shadow depth
  "l": "#1e88e5", // Lighter blue waves
  "h": "#90caf9", // Pale cyan water glints
  "w": "#ffffff"  // Crisp specular sparkle
};

const waterMatrix0 = [
  "d..........d....",
  ".h.w......l.h...",
  "..........l.....",
  "......l.........",
  ".....l.h........",
  "................",
  "...........d....",
  "....l...........",
  "...l.h.w........",
  "................",
  "..........l.....",
  ".........l.h....",
  "d............d..",
  ".h.w............",
  "................",
  "......l........."
];
const waterMatrix1 = [
  "..........d.....",
  "....l.h.w....l..",
  "...l............",
  "d...............",
  ".h.w......l.h...",
  "..........l.....",
  "......l.........",
  ".....l.h........",
  "................",
  "...........d....",
  "....l...........",
  "...l.h.w........",
  "................",
  "..........l.....",
  ".........l.h....",
  "d............d.."
];
const waterMatrix2 = [
  "......l.........",
  ".....l.h........",
  "................",
  "...........d....",
  "....l...........",
  "...l.h.w........",
  "................",
  "..........l.....",
  ".........l.h....",
  "d............d..",
  ".h.w............",
  "................",
  "......l.........",
  "d..........d....",
  ".h.w......l.h...",
  "..........l....."
];
drawTileMatrix("water_0", waterMatrix0, waterColorMap);
drawTileMatrix("water_1", waterMatrix1, waterColorMap);
drawTileMatrix("water_2", waterMatrix2, waterColorMap);
ASSETS.tiles["water"] = ASSETS.tiles["water_0"]; // Backward compatible default

// 4. Slate Brick Wall Tile
const wallBrickColorMap = {
  ".": "#374151", // Slate brick base
  "d": "#111827", // Deep mortar black shadow
  "l": "#4b5563", // Brick body highlight
  "h": "#9ca3af", // Top bevel light sheen
  "s": "#1f2937"  // Lower brick shadow
};

const wallBrickMatrix = [
  "dddddddddddddddd",
  "dhhhhhhhdhhhhhhh",
  "dlllllllshllllll",
  "d.......sd......",
  "dddddddddddddddd",
  "hhdhhhhhhhhdhhhh",
  "llshlllllllshlll",
  "..sd.......sd...",
  "dddddddddddddddd",
  "dhhhhhhhdhhhhhhh",
  "dlllllllshllllll",
  "d.......sd......",
  "dddddddddddddddd",
  "hhdhhhhhhhhdhhhh",
  "llshlllllllshlll",
  "..sd.......sd..."
];
drawTileMatrix("wall_brick", wallBrickMatrix, wallBrickColorMap);

// 5. Glowing Cyber Wall Tile
const wallTechColorMap = {
  ".": "#111827", // Carbon black steel
  "d": "#030712", // Void shadows
  "b": "#0369a1", // Deep blue panel lining
  "c": "#0ea5e9", // Glowing cyan conduit
  "w": "#38bdf8", // Bright cyan nodes
  "g": "#1f2937"  // Metal plates
};

const wallTechMatrix = [
  "dddddddddddddddd",
  "dccccccccccccccd",
  "dcwwwwwwwwwwwwcd",
  "dcwgggggggggwwcd",
  "dcwgdddddddggwcd",
  "dcwgdgggggdggwcd",
  "dcwgdgcccgdggwcd",
  "dcwgdgcwcgdggwcd",
  "dcwgdgcccgdggwcd",
  "dcwgdgggggdggwcd",
  "dcwgdddddddggwcd",
  "dcwgggggggggwwcd",
  "dcwwwwwwwwwwwwcd",
  "dccccccccccccccd",
  "dddddddddddddddd",
  "................"
];
drawTileMatrix("wall_tech", wallTechMatrix, wallTechColorMap);

// 6. Terracotta Shingle Roof Tile
const roofColorMap = {
  ".": "#991b1b", // Vibrant red base
  "d": "#4c0519", // Deep crimson shadow gap
  "s": "#7f1d1d", // Shingle curve shadow
  "l": "#ef4444", // Highlight curve
  "h": "#f87171"  // Bright edge sheen
};

const roofMatrix = [
  "dddddddddddddddd",
  "hhdhhhhhhhhdhhhh",
  "llshlllllllshlll",
  "..sd.......sd...",
  "sssssssdsssssssd",
  "dddddddddddddddd",
  "dhhhhhhhdhhhhhhh",
  "dlllllllshllllll",
  "d.......sd......",
  "dsssssssdsssssss",
  "dddddddddddddddd",
  "hhdhhhhhhhhdhhhh",
  "llshlllllllshlll",
  "..sd.......sd...",
  "sssssssdsssssssd",
  "dddddddddddddddd"
];
drawTileMatrix("roof", roofMatrix, roofColorMap);

// 7. Beveled Lab Floor Tile
const floorColorMap = {
  ".": "#f8fafc", // Pure white sheen
  "d": "#cbd5e1", // Grey grout line
  "l": "#f1f5f9", // Soft light grey base
  "s": "#e2e8f0"  // Shading / bevel
};

const floorMatrix = [
  "dddddddddddddddd",
  "d...............d",
  "d.llllllllllll.s",
  "d.llllllllllll.s",
  "d.llllllllllll.s",
  "d.llllllllllll.s",
  "d.llllllllllll.s",
  "d.llllllllllll.s",
  "d.llllllllllll.s",
  "d.llllllllllll.s",
  "d.llllllllllll.s",
  "d.llllllllllll.s",
  "d.llllllllllll.s",
  "d.ssssssssssss.s",
  "dsssssssssssssds",
  "dddddddddddddddd"
];
drawTileMatrix("floor", floorMatrix, floorColorMap);

// 8. Cyber Console Server Rack Tile
const consoleColorMap = {
  ".": "#475569", // Dark steel frame
  "d": "#0f172a", // Deep shadows
  "g": "#064e3b", // Deep glowing green screen base
  "t": "#10b981", // Bright green terminal text
  "r": "#ef4444", // Alert red led
  "a": "#3b82f6", // Processing blue led
  "y": "#eab308", // Yellow activity led
  "w": "#ffffff"  // Glarings
};

const consoleMatrix = [
  "................",
  ".dddddddddddddd.",
  ".dggggddggggggd.",
  ".dgtgtdgtwtttgd.",
  ".dggggddggggggd.",
  ".dddddddddddddd.",
  "................",
  ".d..............",
  ".d.r.a.y.r.a.yd.",
  ".d..............",
  ".dddddddddddddd.",
  ".dwwwwwwwwwwwwd.",
  ".dddddddddddddd.",
  "................",
  "................",
  "................"
];
drawTileMatrix("console", consoleMatrix, consoleColorMap);

// 9. Tree Top (16x16 upper pine tree needles with bright tips)
const treeColorMap = {
  ".": null,      // Transparent outline background
  "X": "#064e3b", // Deep forest dark outline
  "g": "#0f766e", // Rich pine needle teal-green
  "l": "#14b8a6", // Bright outer leaf highlight
  "h": "#99f6e4", // Pale morning dew leaf tips
  "d": "#115e59"  // Deep shadow foliage
};

const treeTopMatrix = [
  "......XXXX......",
  ".....XlhgXX.....",
  "....XlhgggXX....",
  "....XlhhhhgX....",
  "....XlddddggX...",
  "...XllhhhgggX...",
  "...XlhgggddgX...",
  "..XlhhhhgdddX...",
  "..XlddddgggggX..",
  ".XllhhhhgggggX..",
  ".XlhgggggddggX..",
  "XlhhhhhggggddgX.",
  "XlddddddggggdgX.",
  "XllhhhhgggggggX.",
  "XlhgggggggggggX.",
  "XXXXXXXXXXXXXXXX"
];
drawTileMatrix("tree_top", treeTopMatrix, treeColorMap);

// 10. Tree Trunk (16x16 pine tree wooden base with moss highlights)
const trunkColorMap = {
  ".": null,
  "X": "#064e3b", // Outer needle boundary
  "t": "#78350f", // Rich trunk brown
  "s": "#451a03", // Deep bark shadow
  "l": "#b45309", // Warm wood highlight
  "g": "#0f766e", // Pine foliage overlap at top
  "d": "#115e59", // Overlapping dark green shadow
  "G": "#2e7d32", // Forest floor grass boundary
  "D": "#1b5e20"  // Dark forest floor grass
};

const treeTrunkMatrix = [
  "XggddddddddddggX",
  "XldddddddddddgXX",
  "XXXXXXssttXXXXXX",
  ".....XssttX.....",
  ".....XslltX.....",
  ".....XslltX.....",
  ".....XssttX.....",
  ".....XssttX.....",
  ".....XslltX.....",
  ".....XslltX.....",
  ".....XssttX.....",
  "....XXssttXX....",
  "...XGGssttDdX...",
  "..XGGGsssttDdXX.",
  ".XGGGGssssttDdXX",
  "XXXXXXXXXXXXXXXX"
];
drawTileMatrix("tree_trunk", treeTrunkMatrix, trunkColorMap);

// 11. Signpost (Wooden bulletin sign)
const signColorMap = {
  ".": null,
  "X": "#1e293b", // Deep charcoal border
  "w": "#d97706", // Light oak sign face
  "s": "#b45309", // Oak face shadow
  "h": "#f59e0b", // Wood highlight / grain
  "p": "#78350f", // Dark support post
  "d": "#451a03", // Post shadow
  "G": "#2e7d32", // Grass blades on bottom
  "t": "#0f172a"  // Text scribble lines
};

const signpostMatrix = [
  "................",
  "...XXXXXXXXXX...",
  "..XhhhhhhhwwsX..",
  ".XhwwtwwtwtswwsX",
  ".XhwttwwtwtwwssX",
  ".XhwwtwwtwtswwsX",
  ".XhwwtwwtwtwwssX",
  "..XssssssssssX.."
];
// Pad rest with post support and grass base
const fullSignpostMatrix = [
  "................",
  "...XXXXXXXXXX...",
  "..XhhhhhhhwwsX..",
  ".XhwwtwwtwtswwsX",
  ".XhwttwwtwtwwssX",
  ".XhwwtwwtwtswwsX",
  ".XhwwtwwtwtwwssX",
  "..XssssssssssX..",
  "......ppd.......", // wall mount bracket support
  "......ppd.......",
  "................",
  "................",
  "................",
  "................",
  "................",
  "................"
];
drawTileMatrix("signpost", fullSignpostMatrix, signColorMap);

// 42. Wood Panel Wall (For cozy cafe/contact interior)
const wallWoodColorMap = {
  ".": "#78350f", // Dark bark brown grain lines
  "d": "#451a03", // Shading lines
  "l": "#d97706", // Light oak panel
  "h": "#f59e0b"  // Golden pine wood highlighted panel
};

const wallWoodMatrix = [
  "................",
  "lhlllllllllllllh",
  "lhlllllllllllllh",
  "dddddddddddddddd",
  "................",
  "lhlllllllllllllh",
  "lhlllllllllllllh",
  "dddddddddddddddd",
  "................",
  "lhlllllllllllllh",
  "lhlllllllllllllh",
  "dddddddddddddddd",
  "................",
  "lhlllllllllllllh",
  "lhlllllllllllllh",
  "dddddddddddddddd"
];
drawTileMatrix("wall_wood", wallWoodMatrix, wallWoodColorMap);

// --------------------------------------------------
// HOUSE FACADE THEMED PIECES (Modular Building)
// --------------------------------------------------

// Theme A: Cyber Center (Projects Tech Lab)
const cyberColorMap = {
  ".": null,
  "X": "#030712", // Outer structure borders
  "r": "#0f172a", // Dark carbon roof shingle
  "s": "#1e293b", // Shaded shingle
  "l": "#38bdf8", // Glowing cyan wires / light
  "w": "#ffffff", // Bright white specular
  "g": "#111827", // Carbon black steel wall
  "b": "#1f2937", // Lighter steel frame
  "h": "#0ea5e9", // Blue accent panel
  "o": "#f97316"  // Blinking orange warning light
};

drawTileMatrix("cyber_roof_top", [
  "XXXXXXXXXXXXXXXX",
  "XwllwwllwwllwwlX",
  "XbbbbbbbbbbbbbbX",
  "XgssssssssssssgX",
  "XgssssssssssssgX",
  "XgssssssssssssgX",
  "XbbbbbbbbbbbbbbX",
  "XXXXXXXXXXXXXXXX"
], cyberColorMap);

drawTileMatrix("cyber_roof_left", [
  "XllllllllllllllX",
  "XwXssssrssssrssX",
  "XlXsssrssssrsssX",
  "XlXssrssssrssssX",
  "XlXXXXXXXXXXXXXX",
  "XwXssssrssssrssX",
  "XlXsssrssssrsssX",
  "XlXssrssssrssssX",
  "XlXXXXXXXXXXXXXX",
  "XwXssssrssssrssX",
  "XlXsssrssssrsssX",
  "XlXssrssssrssssX",
  "XlXXXXXXXXXXXXXX",
  "XllllllllllllllX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], cyberColorMap);

drawTileMatrix("cyber_roof_center", [
  "XssssrssssrssssX",
  "Xsssrssssrsssssr",
  "XssrssssrsssssrX",
  "XsrssssrsssssrXX",
  "XXXXXXXXXXXXXXXX",
  "XssssrssssrssssX",
  "Xsssrssssrsssssr",
  "XssrssssrsssssrX",
  "XsrssssrsssssrXX",
  "XXXXXXXXXXXXXXXX",
  "XssssrssssrssssX",
  "Xsssrssssrsssssr",
  "XssrssssrsssssrX",
  "XsrssssrsssssrXX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], cyberColorMap);

drawTileMatrix("cyber_roof_right", [
  "XllllllllllllllX",
  "XssssrssssrssXlX",
  "XsssrssssrsssXlX",
  "XssrssssrssssXlX",
  "XXXXXXXXXXXXXXlX",
  "XssssrssssrssXlX",
  "XsssrssssrsssXlX",
  "XssrssssrssssXlX",
  "XXXXXXXXXXXXXXlX",
  "XssssrssssrssXlX",
  "XsssrssssrsssXlX",
  "XssrssssrssssXlX",
  "XXXXXXXXXXXXXXlX",
  "XllllllllllllllX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], cyberColorMap);

drawTileMatrix("cyber_wall_left", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbbbX",
  "XwXggggggggggggX",
  "XlXggggggggggggX",
  "XlXggXXXXXXXXggX",
  "XlXggXbbbbbbXggX",
  "XlXggXbggggbXggX",
  "XlXggXbggggbXggX",
  "XlXggXbggggbXggX",
  "XlXggXbbbbbbXggX",
  "XlXggXXXXXXXXggX",
  "XlXggggggggggggX",
  "XlXggggggggggggX",
  "XbbbbbbbbbbbbbbX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], cyberColorMap);

drawTileMatrix("cyber_wall_center", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XggggggggggggggX",
  "XggXXXXXXXXXXggX",
  "XggXbbbbbbbbXggX",
  "XggXbggggggbXggX",
  "XggXbghhhhgbXggX",
  "XggXbghhhhgbXggX",
  "XggXbggggggbXggX",
  "XggXbbbbbbbbXggX",
  "XggXXXXXXXXXXggX",
  "XggggggggggggggX",
  "XggggggggggggggX",
  "XbbbbbbbbbbbbbbX",
  "XXXXXXXXXXXXXXXX"
], cyberColorMap);

drawTileMatrix("cyber_wall_right", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggXwX",
  "XggggggggggggXlX",
  "XggXXXXXXXXggXlX",
  "XggXbbbbbbXggXlX",
  "XggXbggggbXggXlX",
  "XggXbggggbXggXlX",
  "XggXbggggbXggXlX",
  "XggXbbbbbbXggXlX",
  "XggXXXXXXXXggXlX",
  "XggggggggggggXlX",
  "XggggggggggggXlX",
  "XbbbbbbbbbbbbbbX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], cyberColorMap);

drawTileMatrix("cyber_window", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XggXXXXXXXXXXggX",
  "XgXllllllllllXgX",
  "XgXlwwllwwllwXgX",
  "XgXlXooooooXXgX",
  "XgXlXooooooXXgX",
  "XgXlXooooooXXgX",
  "XgXlXooooooXXgX",
  "XgXlXooooooXXgX",
  "XgXllllllllllXgX",
  "XggXXXXXXXXXXggX",
  "XggggggggggggggX",
  "XbbbbbbbbbbbbbbX",
  "XXXXXXXXXXXXXXXX"
], cyberColorMap);

drawTileMatrix("cyber_door_left", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XggXXXXXXXXXXggX",
  "XgXllllllllllXgX",
  "XgXlXXXXXXXXXXgX",
  "XgXlXbbbbbbbbXgX",
  "XgXlXbllllggbXgX",
  "XgXlXblllgggbXgX",
  "XgXlXbllggggbXgX",
  "XgXlXbllggggbXgX",
  "XgXlXbllggggbXgX",
  "XgXlXbbbbbbbbXgX",
  "XgXlXXXXXXXXXXgX",
  "XgXllllllllllXgX",
  "XXXXXXXXXXXXXXXX"
], cyberColorMap);

drawTileMatrix("cyber_door_right", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XggXXXXXXXXXXggX",
  "XgXllllllllllXgX",
  "XgXXXXXXXXXXXgX",
  "XgXbbbbbbbbXXgX",
  "XgXbggllllbXXgX",
  "XgXbggglllbXXgX",
  "XgXbggggllbXXgX",
  "XgXbggggllbXXgX",
  "XgXbggggllbXXgX",
  "XgXbbbbbbbbXXgX",
  "XgXXXXXXXXXXXgX",
  "XgXllllllllllXgX",
  "XXXXXXXXXXXXXXXX"
], cyberColorMap);


// Theme B: Skills Academy (Traditional Red Brick Library)
const schoolColorMap = {
  ".": null,
  "X": "#1e293b", // Deep outline charcoal
  "r": "#991b1b", // Deep brick red shingle base
  "s": "#7f1d1d", // Shaded terracotta red
  "l": "#ef4444", // Bright shingle red highlight
  "w": "#f87171", // Terracotta crest white/pink glare
  "g": "#b91c1c", // Warm red brick wall base
  "b": "#7f1d1d", // Dark mortar gap / wall shadow
  "h": "#fca5a5", // Brick highlights
  "y": "#facc15", // Warm candle/lantern yellow glow
  "o": "#b45309"  // Dark wood door panel / trims
};

drawTileMatrix("school_roof_top", [
  "XXXXXXXXXXXXXXXX",
  "XwwwwwwwwwwwwwwX",
  "XssssssssssssssX",
  "XllllllllllllllX",
  "XrrrrrrrrrrrrrrX",
  "XssssssssssssssX",
  "XXXXXXXXXXXXXXXX",
  "................"
], schoolColorMap);

drawTileMatrix("school_roof_left", [
  "XwwwwwwwwwwwwwXX",
  "XlXrrrrrrrrrrrXX",
  "XlXrrrrrrrrrrrXX",
  "XlXsssssssssssXX",
  "XlXXXXXXXXXXXXXX",
  "XlXrrrrrrrrrrrXX",
  "XlXrrrrrrrrrrrXX",
  "XlXsssssssssssXX",
  "XlXXXXXXXXXXXXXX",
  "XlXrrrrrrrrrrrXX",
  "XlXrrrrrrrrrrrXX",
  "XlXsssssssssssXX",
  "XlXXXXXXXXXXXXXX",
  "XwwwwwwwwwwwwwXX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], schoolColorMap);

drawTileMatrix("school_roof_center", [
  "XrrrrrrrrrrrrrrX",
  "XssssssssssssssX",
  "XllllllllllllllX",
  "XrrrrrrrrrrrrrrX",
  "XXXXXXXXXXXXXXXX",
  "XrrrrrrrrrrrrrrX",
  "XssssssssssssssX",
  "XllllllllllllllX",
  "XrrrrrrrrrrrrrrX",
  "XXXXXXXXXXXXXXXX",
  "XrrrrrrrrrrrrrrX",
  "XssssssssssssssX",
  "XllllllllllllllX",
  "XrrrrrrrrrrrrrrX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], schoolColorMap);

drawTileMatrix("school_roof_right", [
  "XXwwwwwwwwwwwwwX",
  "XXrrrrrrrrrrrXlX",
  "XXrrrrrrrrrrrXlX",
  "XXsssssssssssXlX",
  "XXXXXXXXXXXXXXlX",
  "XXrrrrrrrrrrrXlX",
  "XXrrrrrrrrrrrXlX",
  "XXsssssssssssXlX",
  "XXXXXXXXXXXXXXlX",
  "XXrrrrrrrrrrrXlX",
  "XXrrrrrrrrrrrXlX",
  "XXsssssssssssXlX",
  "XXXXXXXXXXXXXXlX",
  "XXwwwwwwwwwwwwwX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], schoolColorMap);

drawTileMatrix("school_wall_left", [
  "XXXXXXXXXXXXXXXX",
  "XgXbbbbbbbbbbbbX",
  "XgXggggggggggggX",
  "XgXgXXggXXggXXgX",
  "XgXhXXbbXXbbXXgX",
  "XgXgXXggXXggXXgX",
  "XgXbbbbbbbbbbbbX",
  "XgXggggggggggggX",
  "XgXgXXggXXggXXgX",
  "XgXhXXbbXXbbXXgX",
  "XgXgXXggXXggXXgX",
  "XgXbbbbbbbbbbbbX",
  "XgXggggggggggggX",
  "XgXbbbbbbbbbbbbX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], schoolColorMap);

drawTileMatrix("school_wall_center", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XggXXggXXggXXggX",
  "XhhXXbbXXbbXXhhX",
  "XggXXggXXggXXggX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XggXXggXXggXXggX",
  "XhhXXbbXXbbXXhhX",
  "XggXXggXXggXXggX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XbbbbbbbbbbbbbbX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], schoolColorMap);

drawTileMatrix("school_wall_right", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbXgX",
  "XggggggggggggXgX",
  "XggXXggXXggXXXgX",
  "XhhXXbbXXbbXXXgX",
  "XggXXggXXggXXXgX",
  "XbbbbbbbbbbbbXgX",
  "XggggggggggggXgX",
  "XggXXggXXggXXXgX",
  "XhhXXbbXXbbXXXgX",
  "XggXXggXXggXXXgX",
  "XbbbbbbbbbbbbXgX",
  "XggggggggggggXgX",
  "XbbbbbbbbbbbbXgX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], schoolColorMap);

drawTileMatrix("school_window", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XggXXXXXXXXXXggX",
  "XgXyyyyyyyyyyXgX",
  "XgXyXyyyyyyXyXgX",
  "XgXyXyXyyXyXyXgX",
  "XgXyXyXyyXyXyXgX",
  "XgXyXyXyyXyXyXgX",
  "XgXyXyyyyyyXyXgX",
  "XgXyyyyyyyyyyXgX",
  "XggXXXXXXXXXXggX",
  "XggggggggggggggX",
  "XbbbbbbbbbbbbbbX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], schoolColorMap);

drawTileMatrix("school_door_left", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XggXXXXXXXXXXggX",
  "XgXooooooooooXgX",
  "XgXoXXXXXXXXXXgX",
  "XgXoXoooooooXXgX",
  "XgXoXoyyXyyyXXgX",
  "XgXoXoyyXyyyXXgX",
  "XgXoXoyyXyyyXXgX",
  "XgXoXoyyXyyyXXgX",
  "XgXoXoyyXyyyXXgX",
  "XgXoXoooooooXXgX",
  "XgXoXXXXXXXXXXgX",
  "XgXooooooooooXgX",
  "XXXXXXXXXXXXXXXX"
], schoolColorMap);

drawTileMatrix("school_door_right", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XggXXXXXXXXXXggX",
  "XgXooooooooooXgX",
  "XgXXXXXXXXXXXgX",
  "XgXXoooooooXoXgX",
  "XgXXyyyXyyoXoXgX",
  "XgXXyyyXyyoXoXgX",
  "XgXXyyyXyyoXoXgX",
  "XgXXyyyXyyoXoXgX",
  "XgXXyyyXyyoXoXgX",
  "XgXXoooooooXoXgX",
  "XgXXXXXXXXXXXgX",
  "XgXooooooooooXgX",
  "XXXXXXXXXXXXXXXX"
], schoolColorMap);


// Theme C: Cozy Lounge (Contacts Timber/Thatch Cafe)
const cozyColorMap = {
  ".": null,
  "X": "#1a0f05", // Soft brown outline
  "r": "#d97706", // Light thatch straw golden brown
  "s": "#b45309", // Warm amber shingle shadow
  "l": "#f59e0b", // Bright golden thatch highlight
  "w": "#fef3c7", // Specular sun glint
  "g": "#fafaf9", // Soft creamy plaster wall base
  "b": "#e7e5e4", // Plaster shadow grey
  "h": "#854d0e", // Timber-frame dark brown logs
  "y": "#fca5a5", // Rose-pink cafe window curtains
  "o": "#78350f"  // Mahogany door panels
};

drawTileMatrix("cozy_roof_top", [
  "XXXXXXXXXXXXXXXX",
  "XwwwwwwwwwwwwwwX",
  "XrrrrrrrrrrrrrrX",
  "XllllllllllllllX",
  "XssssssssssssssX",
  "XrrrrrrrrrrrrrrX",
  "XXXXXXXXXXXXXXXX",
  "................"
], cozyColorMap);

drawTileMatrix("cozy_roof_left", [
  "XwwwwwwwwwwwwwXX",
  "XlXrrrrrrrrrrrXX",
  "XlXlllllllllllXX",
  "XlXsssssssssssXX",
  "XlXXXXXXXXXXXXXX",
  "XlXrrrrrrrrrrrXX",
  "XlXlllllllllllXX",
  "XlXsssssssssssXX",
  "XlXXXXXXXXXXXXXX",
  "XlXrrrrrrrrrrrXX",
  "XlXlllllllllllXX",
  "XlXsssssssssssXX",
  "XlXXXXXXXXXXXXXX",
  "XwwwwwwwwwwwwwXX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], cozyColorMap);

drawTileMatrix("cozy_roof_center", [
  "XrrrrrrrrrrrrrrX",
  "XllllllllllllllX",
  "XssssssssssssssX",
  "XrrrrrrrrrrrrrrX",
  "XXXXXXXXXXXXXXXX",
  "XrrrrrrrrrrrrrrX",
  "XllllllllllllllX",
  "XssssssssssssssX",
  "XrrrrrrrrrrrrrrX",
  "XXXXXXXXXXXXXXXX",
  "XrrrrrrrrrrrrrrX",
  "XllllllllllllllX",
  "XssssssssssssssX",
  "XrrrrrrrrrrrrrrX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], cozyColorMap);

drawTileMatrix("cozy_roof_right", [
  "XXwwwwwwwwwwwwwX",
  "XXrrrrrrrrrrrXlX",
  "XXlllllllllllXlX",
  "XXsssssssssssXlX",
  "XXXXXXXXXXXXXXlX",
  "XXrrrrrrrrrrrXlX",
  "XXlllllllllllXlX",
  "XXsssssssssssXlX",
  "XXXXXXXXXXXXXXlX",
  "XXrrrrrrrrrrrXlX",
  "XXlllllllllllXlX",
  "XXsssssssssssXlX",
  "XXXXXXXXXXXXXXlX",
  "XXwwwwwwwwwwwwwX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], cozyColorMap);

drawTileMatrix("cozy_wall_left", [
  "XXXXXXXXXXXXXXXX",
  "XhXbbbbbbbbbbbbX",
  "XhXggggggggggggX",
  "XhXgXXggXXggXXgX",
  "XhXhXXhhXXhhXXgX",
  "XhXgXXggXXggXXgX",
  "XhXbbbbbbbbbbbbX",
  "XhXggggggggggggX",
  "XhXgXXggXXggXXgX",
  "XhXhXXhhXXhhXXgX",
  "XhXgXXggXXggXXgX",
  "XhXbbbbbbbbbbbbX",
  "XhXggggggggggggX",
  "XhXbbbbbbbbbbbbX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], cozyColorMap);

drawTileMatrix("cozy_wall_center", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XggXXggXXggXXggX",
  "XhhXXhhXXhhXXhhX",
  "XggXXggXXggXXggX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XggXXggXXggXXggX",
  "XhhXXhhXXhhXXhhX",
  "XggXXggXXggXXggX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XbbbbbbbbbbbbbbX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], cozyColorMap);

drawTileMatrix("cozy_wall_right", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbXhX",
  "XggggggggggggXhX",
  "XggXXggXXggXXXhX",
  "XhhXXhhXXhhXXXhX",
  "XggXXggXXggXXXhX",
  "XbbbbbbbbbbbbXhX",
  "XggggggggggggXhX",
  "XggXXggXXggXXXhX",
  "XhhXXhhXXhhXXXhX",
  "XggXXggXXggXXXhX",
  "XbbbbbbbbbbbbXhX",
  "XggggggggggggXhX",
  "XbbbbbbbbbbbbXhX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], cozyColorMap);

drawTileMatrix("cozy_window", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XggXXXXXXXXXXggX",
  "XgXyyyyyyyyyyXgX",
  "XgXyXyyyyyyXyXgX",
  "XgXyXyXyyXyXyXgX",
  "XgXyXyXyyXyXyXgX",
  "XgXyXyXyyXyXyXgX",
  "XgXyXyyyyyyXyXgX",
  "XgXyyyyyyyyyyXgX",
  "XggXXXXXXXXXXggX",
  "XggggggggggggggX",
  "XbbbbbbbbbbbbbbX",
  "XXXXXXXXXXXXXXXX",
  "XXXXXXXXXXXXXXXX"
], cozyColorMap);

drawTileMatrix("cozy_door_left", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XggXXXXXXXXXXggX",
  "XgXooooooooooXgX",
  "XgXoXXXXXXXXXXgX",
  "XgXoXoooooooXXgX",
  "XgXoXoyyXyyyXXgX",
  "XgXoXoyyXyyyXXgX",
  "XgXoXoyyXyyyXXgX",
  "XgXoXoyyXyyyXXgX",
  "XgXoXoyyXyyyXXgX",
  "XgXoXoooooooXXgX",
  "XgXoXXXXXXXXXXgX",
  "XgXooooooooooXgX",
  "XXXXXXXXXXXXXXXX"
], cozyColorMap);

drawTileMatrix("cozy_door_right", [
  "XXXXXXXXXXXXXXXX",
  "XbbbbbbbbbbbbbbX",
  "XggggggggggggggX",
  "XggXXXXXXXXXXggX",
  "XgXooooooooooXgX",
  "XgXXXXXXXXXXXgX",
  "XgXXoooooooXoXgX",
  "XgXXyyyXyyoXoXgX",
  "XgXXyyyXyyoXoXgX",
  "XgXXyyyXyyoXoXgX",
  "XgXXyyyXyyoXoXgX",
  "XgXXyyyXyyoXoXgX",
  "XgXXoooooooXoXgX",
  "XgXXXXXXXXXXXgX",
  "XgXooooooooooXgX",
  "XXXXXXXXXXXXXXXX"
], cozyColorMap);


// --------------------------------------------------
// 2. RETRO MATRIX SPRITE ENGINE (32x32 canvases)
// --------------------------------------------------
function drawSprite(name, dir, frame, drawFn) {
  if (!ASSETS.sprites[name]) {
    ASSETS.sprites[name] = {};
  }
  if (!ASSETS.sprites[name][dir]) {
    ASSETS.sprites[name][dir] = [];
  }

  const { canvas, ctx } = createOffscreenCanvas(32, 32);
  drawFn(ctx, dir, frame);
  ASSETS.sprites[name][dir][frame] = canvas;
}

// Grid painter to draw string templates.
// Automatically centers the matrix (up to 16x24) inside the 32x32 canvas buffer.
function paintMatrix(ctx, matrix, colorMap, bounceY = 0) {
  const height = matrix.length;
  const width = matrix[0] ? matrix[0].length : 0;

  const startX = Math.floor((32 - width) / 2);
  const startY = Math.floor((32 - height) / 2) + bounceY;

  matrix.forEach((rowStr, r) => {
    for (let c = 0; c < rowStr.length; c++) {
      const char = rowStr[c];
      const color = colorMap[char];
      if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(startX + c, startY + r, 1, 1);
      }
    }
  });
}

// --------------------------------------------------
// PLAYER CHARACTER: AWS Tech Lead / Cloud Engineer
// Features: Backward Orange Developer Cap, Purple Backpack, AWS Blue Hoodie, Glowing Cyan Laptop.
// Humanoid Proportions (16x24 Matrix)
// --------------------------------------------------
const playerColorMap = {
  ".": null,          // Transparent
  "X": "#0f172a",     // Shadow outline / Dark borders
  "S": "#ffd1dc",     // Skin pink peach tone
  "s": "#ffd1dc",     // Clean skin tone (making shadow identical to base to eliminate acne-like cheek spots)
  "H": "#111827",     // Hair black
  "h": "#030712",     // Hair ebony black shadow
  "C": "#111827",     // Cap/Top-Hair colored matching Black Hair mid-tone
  "c": "#030712",     // Cap/Top-Hair shadow matching Black Hair shadow
  "J": "#64748b",     // Cozy heather-gray sweatshirt body
  "j": "#475569",     // Sweatshirt shadow
  "P": "#334155",     // Lounge slate sweatpants
  "p": "#1e293b",     // Sweatpants shadow
  "B": "#8b5cf6",     // Purple Tech Backpack
  "b": "#6d28d9",     // Backpack shadow
  "W": "#ffffff",     // White collar / details
  "w": "#cbd5e1",     // White shadow
  "L": "#94a3b8",     // Silver Laptop body
  "l": "#475569",     // Laptop shadow
  "G": "#06b6d4",     // Glowing screen cyan
  "E": "#02b2e6"      // Vibrant Blue Eyes
};

const playerTemplates = {
  down: [
    // Frame 0: Standing Idle (Forward View)
    [
      "................",
      ".....XXXXXX.....",
      "....XCCCCCCXX...",
      "...XCCCCCCCCCX..",
      "...XCCssSSssCX..",
      "..XHSSsSSsSssHX.",
      "..XHSEESSEESSHX.",
      "..XHSwwSSwwSSHX.",
      "..XHSSSSSSSSSHX.",
      "...XSsSSssSSsX..",
      "....XXJJJJXX....",
      "....XJJWWJJX....",
      "...XJbJWWJbJX...",
      "..XJbJLWWLJJbX..",
      "..XJJLLLLLLJJX..",
      "..XJJGGGGGGJJX..",
      "..XJJJJJJJJJJX..",
      "...XPPPPPPPPX...",
      "...XPPPPPPPPX...",
      "...XPPXX..PPX...",
      "...XPPX...PPX...",
      "...XPPX...PPX...",
      "...XXX....XXX...",
      "................"
    ],
    // Frame 1: Left Foot Forward Walk
    [
      "................",
      ".....XXXXXX.....",
      "....XCCCCCCXX...",
      "...XCCCCCCCCCX..",
      "...XCCssSSssCX..",
      "..XHSSsSSsSssHX.",
      "..XHSEESSEESSHX.",
      "..XHSwwSSwwSSHX.",
      "..XHSSSSSSSSSHX.",
      "...XSsSSssSSsX..",
      "....XXJJJJXX....",
      "....XJJWWJJX....",
      "...XJbJWWJbJX...",
      "..XJbJLWWLJJbX..",
      "..XJJLLLLLLJJX..",
      "..XJJGGGGGGJJX..",
      "..XJJJJJJJJJJX..",
      "...XPPPPPPPPX...",
      "...XPPPPPPPPX...",
      "...XPPP...PPX...",
      "...XPPP...PPX...",
      "...XPPP..XXX...",
      "...XXXX.........",
      "................"
    ],
    // Frame 2: Right Foot Forward Walk
    [
      "................",
      ".....XXXXXX.....",
      "....XCCCCCCXX...",
      "...XCCCCCCCCCX..",
      "...XCCssSSssCX..",
      "..XHSSsSSsSssHX.",
      "..XHSEESSEESSHX.",
      "..XHSwwSSwwSSHX.",
      "..XHSSSSSSSSSHX.",
      "...XSsSSssSSsX..",
      "....XXJJJJXX....",
      "....XJJWWJJX....",
      "...XJbJWWJbJX...",
      "..XJbJLWWLJJbX..",
      "..XJJLLLLLLJJX..",
      "..XJJGGGGGGJJX..",
      "..XJJJJJJJJJJX..",
      "...XPPPPPPPPX...",
      "...XPPPPPPPPX...",
      "...XPP...PPPX...",
      "...XPP...PPPX...",
      "...XXX..PPPX...",
      "........XXXX....",
      "................"
    ]
  ],
  up: [
    // Frame 0: Back View Idle
    [
      "................",
      ".....XXXXXX.....",
      "....XCCCCCCXX...",
      "...XCCCCCCCCCX..",
      "...XCCCCCCCCCX..",
      "..XCCCCCCCCCCX..",
      "..XHHHHHHHHHHX..",
      "..XHHHHHHHHHHX..",
      "..XhhhhhhhhhhX..",
      "...XhhhhhhhX....",
      "....XJJJJXX.....",
      "....XJJJJXX.....",
      "...XJbbbbbbJX...",
      "..XJJbbbbbbJJX..",
      "..XJJBBBBBBJJX..",
      "..XJJBBBBBBJJX..",
      "..XJJJJJJJJJJX..",
      "...XPPPPPPPPX...",
      "...XPPPPPPPPX...",
      "...XPPXX..PPX...",
      "...XPPX...PPX...",
      "...XPPX...PPX...",
      "...XXX....XXX...",
      "................"
    ],
    // Frame 1: Back Walk Left leg
    [
      "................",
      ".....XXXXXX.....",
      "....XCCCCCCXX...",
      "...XCCCCCCCCCX..",
      "...XCCCCCCCCCX..",
      "..XCCCCCCCCCCX..",
      "..XHHHHHHHHHHX..",
      "..XHHHHHHHHHHX..",
      "..XhhhhhhhhhhX..",
      "...XhhhhhhhX....",
      "....XJJJJXX.....",
      "....XJJJJXX.....",
      "...XJbbbbbbJX...",
      "..XJJbbbbbbJJX..",
      "..XJJBBBBBBJJX..",
      "..XJJBBBBBBJJX..",
      "..XJJJJJJJJJJX..",
      "...XPPPPPPPPX...",
      "...XPPPPPPPPX...",
      "...XPPP...PPX...",
      "...XPPP...PPX...",
      "...XPPP..XXX...",
      "...XXXX.........",
      "................"
    ],
    // Frame 2: Back Walk Right leg
    [
      "................",
      ".....XXXXXX.....",
      "....XCCCCCCXX...",
      "...XCCCCCCCCCX..",
      "...XCCCCCCCCCX..",
      "..XCCCCCCCCCCX..",
      "..XHHHHHHHHHHX..",
      "..XHHHHHHHHHHX..",
      "..XhhhhhhhhhhX..",
      "...XhhhhhhhX....",
      "....XJJJJXX.....",
      "....XJJJJXX.....",
      "...XJbbbbbbJX...",
      "..XJJbbbbbbJJX..",
      "..XJJBBBBBBJJX..",
      "..XJJBBBBBBJJX..",
      "..XJJJJJJJJJJX..",
      "...XPPPPPPPPX...",
      "...XPPPPPPPPX...",
      "...XPP...PPPX...",
      "...XPP...PPPX...",
      "...XXX..PPPX...",
      "........XXXX....",
      "................"
    ]
  ],
  left: [
    // Frame 0: Side View Facing Left Idle
    [
      "................",
      ".....XXXXXX.....",
      "....XCCCCCCX....",
      "...XCCCCCCXX....",
      "...XCCCCSSX.....",
      "...XSSSSSSXX....",
      "...XSESSShX.....",
      "...XSSSSShhX....",
      "....XSSShX......",
      "....XJJJJbX.....",
      "....XJJJBBX.....",
      "....XJJJBBX.....",
      "...XGLJJJbX.....",
      "...XLLJJJbX.....",
      "....XJJJJjX.....",
      "....XPPPPpX.....",
      "....XPPPPpX.....",
      "....XPPPPpX.....",
      "....XPPXXpX.....",
      "....XPP..XpX....",
      "....XPP..XpX....",
      "....XXX..XX.....",
      "....XX...XX.....",
      "................"
    ],
    // Frame 1: Side Walk Left foot extended
    [
      "................",
      ".....XXXXXX.....",
      "....XCCCCCCX....",
      "...XCCCCCCXX....",
      "...XCCCCSSX.....",
      "...XSSSSSSXX....",
      "...XSESSShX.....",
      "...XSSSSShhX....",
      "....XSSShX......",
      "....XJJJJbX.....",
      "....XJJJBBX.....",
      "....XJJJBBX.....",
      "...XGLJJJbX.....",
      "...XLLJJJbX.....",
      "....XJJJJjX.....",
      "....XPPPPpX.....",
      "....XPPPPpX.....",
      "....XPPPPpX.....",
      "...XPPX..XpX....",
      "..XPPX....XpX...",
      "..XPPX....XpX...",
      "..XXX......XX...",
      "..XX.......XX...",
      "................"
    ],
    // Frame 2: Side Walk Right foot extended
    [
      "................",
      ".....XXXXXX.....",
      "....XCCCCCCX....",
      "...XCCCCCCXX....",
      "...XCCCCSSX.....",
      "...XSSSSSSXX....",
      "...XSESSShX.....",
      "...XSSSSShhX....",
      "....XSSShX......",
      "....XJJJJbX.....",
      "....XJJJBBX.....",
      "....XJJJBBX.....",
      "...XGLJJJbX.....",
      "...XLLJJJbX.....",
      "....XJJJJjX.....",
      "....XPPPPpX.....",
      "....XPPPPpX.....",
      "....XPPPPpX.....",
      "....XpXXPPX.....",
      "....XpX..XPPX...",
      "....XpX..XPPX...",
      "....XX...XXX....",
      "....XX....XX....",
      "................"
    ]
  ],
  right: [
    // Frame 0: Side View Facing Right Idle
    [
      "................",
      ".....XXXXXX.....",
      "....XCCCCCCX....",
      "....XXCCCCCCX...",
      ".....XSSCCCCX...",
      "....XXSSSSSSX...",
      ".....XhSSSESX...",
      "....XhhSSSSSX...",
      "......XhSSSX....",
      ".....XbJJJJX....",
      ".....XBBJJJX....",
      ".....XBBJJJX....",
      ".....XbJJJLGX...",
      ".....XbJJJLLX...",
      ".....XjJJJJX....",
      ".....XpPPPPX....",
      ".....XpPPPPX....",
      ".....XpPPPPX....",
      ".....XpXXPPX....",
      "....XpX..PPX....",
      "....XpX..PPX....",
      ".....XX..XXX....",
      ".....XX...XX....",
      "................"
    ],
    // Frame 1: Side Walk Facing Right
    [
      "................",
      ".....XXXXXX.....",
      "....XCCCCCCX....",
      "....XXCCCCCCX...",
      ".....XSSCCCCX...",
      "....XXSSSSSSX...",
      ".....XhSSSESX...",
      "....XhhSSSSSX...",
      "......XhSSSX....",
      ".....XbJJJJX....",
      ".....XBBJJJX....",
      ".....XBBJJJX....",
      ".....XbJJJLGX...",
      ".....XbJJJLLX...",
      ".....XjJJJJX....",
      ".....XpPPPPX....",
      ".....XpPPPPX....",
      ".....XpPPPPX....",
      "....XpX..XPPX...",
      "...XpX....XPPX..",
      "...XpX....XPPX..",
      "...XX......XXX..",
      "...XX.......XX..",
      "................"
    ],
    // Frame 2: Side Walk Facing Right
    [
      "................",
      ".....XXXXXX.....",
      "....XCCCCCCX....",
      "....XXCCCCCCX...",
      ".....XSSCCCCX...",
      "....XXSSSSSSX...",
      ".....XhSSSESX...",
      "....XhhSSSSSX...",
      "......XhSSSX....",
      ".....XbJJJJX....",
      ".....XBBJJJX....",
      ".....XBBJJJX....",
      ".....XbJJJLGX...",
      ".....XbJJJLLX...",
      ".....XjJJJJX....",
      ".....XpPPPPX....",
      ".....XpPPPPX....",
      ".....XpPPPPX....",
      ".....XPPXXpX....",
      "...XPPX..XpX....",
      "...XPPX..XpX....",
      "....XXX...XX....",
      "....XX....XX....",
      "................"
    ]
  ]
};

// Render Player sprites
for (let frame = 0; frame <= 2; frame++) {
  ["down", "up", "left", "right"].forEach((dir) => {
    drawSprite("player", dir, frame, (ctx) => {
      paintMatrix(ctx, playerTemplates[dir][frame], playerColorMap);
    });
  });
}


// --------------------------------------------------
// NPC 1: Senior Cloud Architect
// Features: Gray Neat Hair, Spectacles (Glasses), Professional Charcoal Suit, Sky Blue Necktie.
// Humanoid Proportions (16x24 Matrix, all 4 directions)
// --------------------------------------------------
const architectColorMap = {
  ".": null,
  "X": "#0f172a", // Outline
  "S": "#ffe4e6", // Skin pale peach
  "s": "#ffe4e6", // Shaded skin (unified with S to remove acne)
  "H": "#cbd5e1", // Professional Gray hair
  "h": "#94a3b8", // Shaded hair
  "J": "#334155", // Charcoal suit jacket
  "j": "#1e293b", // Suit shadow
  "P": "#334155", // Charcoal pants
  "T": "#0284c7", // Sky blue tie
  "W": "#ffffff"  // White shirt collar
};

const architectTemplates = {
  down: [
    [
      "................",
      ".....XXXXXX.....",
      "....XHHHHHHX....",
      "...XHHHHHHHHX...",
      "..XSSssssssSSX..",
      "..XSHHSSXXSSHX..",
      "..XSXXSSwwSSXS..",
      "..XSSssssssSSX..",
      "...XSSsSSSsX....",
      "....XXJJJJXX....",
      "....XJJWWJJX....",
      "...XJJWWTWJJX...",
      "..XJJJWWTWJJJX..",
      "..XJJJJWTWJJJX..",
      "..XJJJJJJJJJJX..",
      "..XJJJJJJJJJJX..",
      "..XJJJJJJJJJJX..",
      "...XPPPPPPPPX...",
      "...XPPPPPPPPX...",
      "...XPPXX..PPX...",
      "...XPPX...PPX...",
      "...XPPX...PPX...",
      "...XXX....XXX...",
      "................"
    ]
  ],
  up: [
    [
      "................",
      ".....XXXXXX.....",
      "....XHHHHHHX....",
      "...XHHHHHHHHX...",
      "..XHHHHHHHHHHX..",
      "..XHHHHHHHHHHX..",
      "..XhhhhhhhhhhX..",
      "..XhhhhhhhhhhX..",
      "...XhhhhhhhX....",
      "....XJJJJXX.....",
      "....XJJJJXX.....",
      "...XJJJJJJJJX...",
      "..XJJJJJJJJJJX..",
      "..XJJJJJJJJJJX..",
      "..XJJJJJJJJJJX..",
      "..XJJJJJJJJJJX..",
      "..XJJJJJJJJJJX..",
      "...XPPPPPPPPX...",
      "...XPPPPPPPPX...",
      "...XPPXX..PPX...",
      "...XPPX...PPX...",
      "...XPPX...PPX...",
      "...XXX....XXX...",
      "................"
    ]
  ],
  left: [
    [
      "................",
      ".....XXXXXX.....",
      "....XHHHHHHX....",
      "...XHHHHHHXX....",
      "...XHHHHSSX.....",
      "...XSSSSSSXX....",
      "...XSSXXSShX....",
      "...XSSSSShhX....",
      "....XSSShX......",
      "....XJJJJX......",
      "....XJJJJX......",
      "....XJWJJX......",
      "...XJWTJJX......",
      "...XJJJJJX......",
      "....XJJJJX......",
      "....XPPPPX......",
      "....XPPPPX......",
      "....XPPPPX......",
      "....XPPXXP......",
      "....XPP..XjX....",
      "....XPP..XjX....",
      "....XXX..XX.....",
      "....XX...XX.....",
      "................"
    ]
  ],
  right: [
    [
      "................",
      ".....XXXXXX.....",
      "....XHHHHHHX....",
      "....XXHHHHHHX...",
      ".....XSSHHHHX...",
      "....XXSSSSSSX...",
      "....XhSSXXSSX...",
      "....XhhSSSSSX...",
      "......XhSSSX....",
      "......XJJJJX....",
      "......XJJJJX....",
      "......XJJWJX....",
      "......XJJTWJX...",
      "......XJJJJJX...",
      "......XJJJJX....",
      "......XPPPPX....",
      "......XPPPPX....",
      "......XPPPPX....",
      "......PXXPPX....",
      "....XjX..PPX....",
      "....XjX..PPX....",
      ".....XX..XXX....",
      ".....XX...XX....",
      "................"
    ]
  ]
};

// Render Architect NPC across all 4 directions
["down", "up", "left", "right"].forEach((dir) => {
  drawSprite("architect", dir, 0, (ctx) => {
    paintMatrix(ctx, architectTemplates[dir][0], architectColorMap);
  });
});


// --------------------------------------------------
// NPC 2: Senior Data Engineer
// Features: Bright Yellow Construction Hard Hat, Blue Plaid Flannel Pattern, Dense Shaded Beard, Worker Jeans.
// Humanoid Proportions (16x24 Matrix, all 4 directions)
// --------------------------------------------------
const engineerColorMap = {
  ".": null,
  "X": "#0f172a", // Outline
  "S": "#fed7aa", // Skin sunkissed peach
  "s": "#fed7aa", // Shaded skin (unified with S to remove acne)
  "H": "#facc15", // Construction Yellow Hard Hat
  "h": "#ca8a04", // Shaded helmet
  "B": "#451a03", // Dense brown beard
  "J": "#0284c7", // Blue flannel pattern tile A
  "K": "#ffffff", // White flannel pattern tile B
  "P": "#1e3a8a", // Denim jeans
  "p": "#172554", // Denim shadow
  "V": "#f97316"  // High-vis Orange vest highlights
};

const engineerTemplates = {
  down: [
    [
      "................",
      ".....XXXXXX.....",
      "....XHHHHHHX....",
      "...XHHHHHHHHX...",
      "..XHHHHHHHHHHX..",
      "..XHHHHHhhhhhX..",
      "..XSSsSssSssSX..",
      "..XSSBXXSSBXSX..",
      "..XSsBBBBBBsSX..",
      "...XBBBBBBBBX...",
      "....XVVVVVVX....",
      "...XVJJJKJJVX...",
      "..XVJJJJKJJJVX..",
      "..XVVVVVVVVVVX..",
      "..XJJJKKJJJKJX..",
      "..XJJJKKJJJKJX..",
      "..XJJJJJJJJJJX..",
      "...XPPPPPPPPX...",
      "...XPPPPPPPPX...",
      "...XPPXX..PPX...",
      "...XPPX...PPX...",
      "...XPPX...PPX...",
      "...XXX....XXX...",
      "................"
    ]
  ],
  up: [
    [
      "................",
      ".....XXXXXX.....",
      "....XHHHHHHX....",
      "...XHHHHHHHHX...",
      "..XHHHHHHHHHHX..",
      "..XHHHHHhhhhhX..",
      "..XhhhhhhhhhhX..",
      "..XhhhhhhBBhhX..",
      "...XhhhhBBhX....",
      "....XVVVVVVX....",
      "....XVVVVVVX....",
      "...XVJJJKJJVX...",
      "..XVJJJJKJJJVX..",
      "..XVVVVVVVVVVX..",
      "..XJJJKKJJJKJX..",
      "..XJJJKKJJJKJX..",
      "..XJJJJJJJJJJX..",
      "...XPPPPPPPPX...",
      "...XPPPPPPPPX...",
      "...XPPXX..PPX...",
      "...XPPX...PPX...",
      "...XPPX...PPX...",
      "...XXX....XXX...",
      "................"
    ]
  ],
  left: [
    [
      "................",
      ".....XXXXXX.....",
      "....XHHHHHHX....",
      "...XHHHHHHXX....",
      "...XHHHHHHhX....",
      "...XHHHHHhhX....",
      "...XSSBXXSShX....",
      "...XSSBBBBhX....",
      "....XSSSBX......",
      "....XVVVVX......",
      "....XVJJVX......",
      "....XVJKVX......",
      "...XVJJJVX......",
      "...XVVVVVX......",
      "....XJJJKX......",
      "....XPPPPpX.....",
      "....XPPPPpX.....",
      "....XPPPPpX.....",
      "....XPPXXpX.....",
      "....XPP..XpX....",
      "....XPP..XpX....",
      "....XXX..XX.....",
      "....XX...XX.....",
      "................"
    ]
  ],
  right: [
    [
      "................",
      ".....XXXXXX.....",
      "....XHHHHHHX....",
      "....XXHHHHHHX...",
      "....XhHHHHHHHX..",
      "....XhhHHHHHX...",
      "....XhSSXXBSSX..",
      "....XhBBBBSSX...",
      "......XBSSSX....",
      "......XVVVVX....",
      "......XVJJVX....",
      "......XVKJVX....",
      "......XVJJJVX...",
      "......XVVVVVX...",
      "......XKJJJX....",
      ".....XpPPPPX....",
      ".....XpPPPPX....",
      ".....XpPPPPX....",
      ".....XpXXPPX....",
      "....XpX..PPX....",
      "....XpX..PPX....",
      ".....XX..XXX....",
      ".....XX...XX....",
      "................"
    ]
  ]
};

// Render Engineer NPC across all 4 directions
["down", "up", "left", "right"].forEach((dir) => {
  drawSprite("engineer", dir, 0, (ctx) => {
    paintMatrix(ctx, engineerTemplates[dir][0], engineerColorMap);
  });
});


// --------------------------------------------------
// NPC 3: Senior Full-Stack Developer
// Features: Trendy Purple Tech Hoodie with the hood up, Neon Cyan Over-Ear Headphones, Spiky Spikes.
// Humanoid Proportions (16x24 Matrix, all 4 directions)
// --------------------------------------------------
const developerColorMap = {
  ".": null,
  "X": "#0f172a", // Outline
  "S": "#ffebd3", // Skin tone
  "s": "#ffebd3", // Shaded skin (unified with S to remove acne)
  "H": "#18181b", // Spiky midnight-black hair
  "C": "#0ea5e9", // Glowing cyan headphones
  "c": "#0284c7", // Headphones shadow
  "J": "#7c3aed", // Stylish Purple tech hoodie
  "j": "#5b21b6", // Hoodie shadows
  "P": "#64748b", // Gray jogger pants
  "p": "#475569"  // Gray jogger shadow (matching player backpack/sweatshirt shade structure)
};

const developerTemplates = {
  down: [
    [
      "................",
      ".....XXXXXX.....",
      "....XJJJJJJX....",
      "...XJJJJJJJJX...",
      "..XJCHHHHHCJJX..",
      "..XCHHHHHCsJSX..",
      "..XCHXXSSXXCSX..",
      "..XCsssssssCsX..",
      "...XSSsSSSsX....",
      "....XJJJJJJX....",
      "....XJJJJJJX....",
      "...XJJJJJJJJX...",
      "..XJJJJJJJJJJX..",
      "..XJjjjjjjjjJX..",
      "..XJJJJJJJJJJX..",
      "..XJJJJJJJJJJX..",
      "..XJJJJJJJJJJX..",
      "...XPPPPPPPPX...",
      "...XPPPPPPPPX...",
      "...XPPXX..PPX...",
      "...XPPX...PPX...",
      "...XPPX...PPX...",
      "...XXX....XXX...",
      "................"
    ]
  ],
  up: [
    [
      "................",
      ".....XXXXXX.....",
      "....XJJJJJJX....",
      "...XJJJJJJJJX...",
      "..XJJJJJJJJJJX..",
      "..XJJJJJJJJJJX..",
      "..XJCHHHHHHCJX..",
      "..XCHHHHHHHHCX..",
      "...XCHHHHHHCX...",
      "....XJJJJJJX....",
      "....XJJJJJJX....",
      "...XJJJJJJJJX...",
      "..XJJJJJJJJJJX..",
      "..XJJJJJJJJJJX..",
      "..XJJJJJJJJJJX..",
      "..XJJJJJJJJJJX..",
      "..XJJJJJJJJJJX..",
      "...XPPPPPPPPX...",
      "...XPPPPPPPPX...",
      "...XPPXX..PPX...",
      "...XPPX...PPX...",
      "...XPPX...PPX...",
      "...XXX....XXX...",
      "................"
    ]
  ],
  left: [
    [
      "................",
      ".....XXXXXX.....",
      "....XJJJJJJX....",
      "...XJJJJJJXX....",
      "...XJCHHHHhJX...",
      "...XCHHHHhhJX...",
      "...XCHXXSShhX...",
      "...XCSSSSShhX...",
      "....XSSShX......",
      "....XJJJJX......",
      "....XJJJJX......",
      "....XJJJJX......",
      "...XJJJJJX......",
      "...XJjjjjX......",
      "....XJJJJX......",
      "....XPPPPpX.....",
      "....XPPPPpX.....",
      "....XPPPPpX.....",
      "....XPPXXpX.....",
      "....XPP..XpX....",
      "....XPP..XpX....",
      "....XXX..XX.....",
      "....XX...XX.....",
      "................"
    ]
  ],
  right: [
    [
      "................",
      ".....XXXXXX.....",
      "....XJJJJJJX....",
      "....XXJJJJJJX...",
      "...XJhhHHHHHCX..",
      "...XJhhHHHHHCX..",
      "...XhhSSXXHCX...",
      "...XhhSSSSSCX...",
      "......XhSSSX....",
      "......XJJJJX....",
      "......XJJJJX....",
      "......XJJJJX....",
      "......XJJJJJX...",
      "......XjjjjJX...",
      "......XJJJJX....",
      ".....XpPPPPX....",
      ".....XpPPPPX....",
      ".....XpPPPPX....",
      ".....XpXXPPX....",
      "....XpX..PPX....",
      "....XpX..PPX....",
      ".....XX..XXX....",
      ".....XX...XX....",
      "................"
    ]
  ]
};

// Render Developer NPC across all 4 directions
["down", "up", "left", "right"].forEach((dir) => {
  drawSprite("developer", dir, 0, (ctx) => {
    paintMatrix(ctx, developerTemplates[dir][0], developerColorMap);
  });
});


// --------------------------------------------------
// FIANCE AZZURRA
// Features: Long brown hair, beautiful pink dress, clean skin tone.
// Humanoid Proportions (16x24 Matrix, all 4 directions)
// --------------------------------------------------
const azzurraColorMap = {
  ".": null,
  "X": "#0f172a", // Outline
  "S": "#ffd1dc", // Skin peach tone
  "s": "#ffd1dc", // Clean skin tone
  "H": "#e7cd05", // Long blonde hair
  "h": "#3d2314", // Hair shadow
  "D": "#ec4899", // Pink dress
  "d": "#be185d", // Dress shadow
  "W": "#ffffff", // Highlights
  "w": "#cbd5e1"  // Highlights shadow
};

const azzurraTemplates = {
  down: [
    [
      "................",
      ".....XXXXXX.....",
      "....XHHHHHHX....",
      "...XHHHHHHHHX...",
      "...XHHssSSssHX..",
      "..XHSSsSSsSssHX.",
      "..XHSSssSSssSSHX.",
      "..XHSwwSSwwSSHX.",
      "..XHSSSSSSSSSHX.",
      "...XSsSSssSSsX..",
      "....XXDDDDXX....",
      "....XDDWWDDX....",
      "...XDDDWWDDDX...",
      "..XDDDDWWDWDDX..",
      "..XDDDDDDDDDDX..",
      "..XDDDDDDDDDDX..",
      "..XDDDDDDDDDDX..",
      "...XDDDDDDDDX...",
      "...XDDDDDDDDX...",
      "...XSSXX..SSX...",
      "...XSSX...SSX...",
      "...XSSX...SSX...",
      "...XXX....XXX...",
      "................"
    ]
  ],
  up: [
    [
      "................",
      ".....XXXXXX.....",
      "....XHHHHHHX....",
      "...XHHHHHHHHX...",
      "...XHHHHHHHHX...",
      "..XHHHHHHHHHHX..",
      "..XHHHHHHHHHHX..",
      "..XHHHHHHHHHHX..",
      "..XHHHHHHHHHHX..",
      "...XHHHHHHHHX...",
      "....XHDDDDHX....",
      "....XHDDDDHX....",
      "...XHDDDDDDHX...",
      "..XHDDDDDDDDHX..",
      "..XDDDDDDDDDDX..",
      "..XDDDDDDDDDDX..",
      "..XDDDDDDDDDDX..",
      "...XDDDDDDDDX...",
      "...XDDDDDDDDX...",
      "...XSSXX..SSX...",
      "...XSSX...SSX...",
      "...XSSX...SSX...",
      "...XXX....XXX...",
      "................"
    ]
  ],
  left: [
    [
      "................",
      ".....XXXXXX.....",
      "....XHHHHHHX....",
      "...XHHHHHHXX....",
      "...XHHHHHHhX....",
      "...XHHHHHhhX....",
      "...XSSBXXSShX....",
      "...XSSDDDDhX....",
      "....XSSSDX......",
      "....XDDDDX......",
      "....XDDDDX......",
      "....XDDDDX......",
      "...XDDDDDX......",
      "...XDDDDDX......",
      "....XDDDDX......",
      "....XDDDDX......",
      "....XDDDDX......",
      "....XDDDDX......",
      "....XSSXXSX.....",
      "....XSS..XSX....",
      "....XSS..XSX....",
      "....XXX..XX.....",
      "....XX...XX.....",
      "................"
    ]
  ],
  right: [
    [
      "................",
      ".....XXXXXX.....",
      "....XHHHHHHX....",
      "....XXHHHHHHX...",
      "....XhHHHHHHHX..",
      "....XhhHHHHHX...",
      "....XhSSXXBSSX..",
      "....XhDDDDSSX...",
      "......XDSSSX....",
      "......XDDDDX....",
      "......XDDDDX....",
      "......XDDDDX....",
      "......XDDDDDX...",
      "......XDDDDDX...",
      "......XDDDDX....",
      ".....XSDDDDX....",
      ".....XSDDDDX....",
      ".....XSDDDDX....",
      ".....XSXXSSX....",
      "....XSX..SSX....",
      "....XSX..SSX....",
      ".....XX..XXX....",
      ".....XX...XX....",
      "................"
    ]
  ]
};

// Render Azzurra NPC across all 4 directions
["down", "up", "left", "right"].forEach((dir) => {
  drawSprite("azzurra", dir, 0, (ctx) => {
    paintMatrix(ctx, azzurraTemplates[dir][0], azzurraColorMap);
  });
});


// --------------------------------------------------
// POMERANIAN DOG LEONE
// Features: Extremely fluffy golden-orange fur, curly tail, white chest, small dog scale.
// Toy Breed Proportions (16x24 Matrix, all 4 directions)
// --------------------------------------------------
const leoneColorMap = {
  ".": null,
  "X": "#451a03", // Dark outline
  "o": "#d97706", // Fluffy orange body
  "y": "#f59e0b", // Highlighted golden fur
  "w": "#ffffff", // Fluffy white chest/muzzle
  "d": "#b45309", // Shaded orange
  "b": "#030712"  // Black eyes & nose
};

const leoneTemplates = {
  down: [
    [
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "......XX..XX....",
      ".....XooXXooX...",
      "....XoobooobooX.",
      "....XoowbbwoooX.",
      "....XooowwdoooX.",
      ".....XoddddodX..",
      ".....XoddddodX..",
      ".....XoX..XoX...",
      "......X....X....",
      "................"
    ]
  ],
  up: [
    [
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "......XX..XX....",
      ".....XooXXooX...",
      "....XoooooooooX.",
      "....XooodddoooX.",
      "....XooyyyyoooX.",
      "....XoyyyyyydX..",
      "....XodddddddX..",
      "....XodddddddX..",
      ".....XoX..XoX...",
      "......X....X....",
      "................"
    ]
  ],
  left: [
    [
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      ".....XX.........",
      "....XooX.XX.....",
      "....XoobXooyX...",
      "....XoowXooyX...",
      "....XooowddX....",
      ".....XodddX.....",
      ".....XodddX.....",
      ".....XoXoX......",
      "......X.X.......",
      "................"
    ]
  ],
  right: [
    [
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      "................",
      ".........XX.....",
      ".....XX.XooX....",
      "....XyoXboooX...",
      "....XyoXwoooX...",
      ".....XddwoooX...",
      "......XdddoX....",
      "......XdddoX....",
      ".......XoXoX....",
      ".......X.X......",
      "................"
    ]
  ]
};

// Render Leone across all 4 directions
["down", "up", "left", "right"].forEach((dir) => {
  drawSprite("leone", dir, 0, (ctx) => {
    paintMatrix(ctx, leoneTemplates[dir][0], leoneColorMap);
  });
});

// --------------------------------------------------
// SOCIAL LOUNGE FLOATING LOGO SPRITES
// --------------------------------------------------
const linkedinColorMap = {
  ".": null,
  "X": "#011e3c", // Deep dark navy outline
  "b": "#0a66c2", // Official LinkedIn Blue
  "w": "#ffffff", // Pure white letters/details
  "s": "#004182", // Shadow LinkedIn blue
  "h": "#3b82f6"  // Highlight light blue
};

const linkedinMatrix = [
  "................",
  "..XXXXXXXXXXXX..",
  ".XhhhhhhhhhhhsX.",
  "XhhhhhhhhhhhhhsX",
  "XhhwwbbbbbbbbbsX",
  "XhhbbbbbbbbbbbsX",
  "XhhwwbwwwwwsbbbX",
  "XhhwwbwwbbwwsbbX",
  "XhhwwbwwbbwwsbbX",
  "XhhwwbwwbbwwsbbX",
  "XhhwwbwwbbwwsbbX",
  "XhhbbbbbbbbbbbsX",
  ".XsssssssssssssX.",
  "..XXXXXXXXXXXX..",
  "................",
  "................"
];

const githubColorMap = {
  ".": null,
  "X": "#020617", // Ultra-dark borders
  "w": "#ffffff", // Pure white base circle
  "c": "#1e293b", // Dark slate Octocat body
  "l": "#475569", // Light slate highlighting/ears details
  "s": "#e2e8f0"  // Circle shading (grey)
};

const githubMatrix = [
  "................",
  ".....XXXXXX.....",
  "...XXwwwwwwXX...",
  "..XwwwwwwwwwwX..",
  ".XwwwcwwwwcwwwX.",
  "XwwwclccccclwwwX",
  "XwwccccccccccwwX",
  "XwccccccccccccwX",
  "XwccccccccccccwX",
  "XwwccccccccccwwX",
  "XwwwccccccccwwwX",
  ".XwwwccccccwwwX.",
  "..XsssccccsssX..",
  "...XXssccssXX...",
  ".....XXXXXX.....",
  "................"
];

const emailColorMap = {
  ".": null,
  "X": "#0f172a", // Dark border outline
  "w": "#ffffff", // White envelope body
  "g": "#94a3b8", // Gray shadow/flap line
  "d": "#cbd5e1", // Light shading
  "r": "#ef4444", // Bright notification red
  "h": "#fee2e2"  // Notification highlight
};

const emailMatrix = [
  "................",
  "..........rrr...",
  "..XXXXXXXXXrrrr.",
  ".XwggwwwwrrrrhX.",
  ".XwwggwwwwrrrhX.",
  ".XwwwggwwwggwwwX.",
  ".XwwwwggwggwwwwX.",
  ".XwwwwwgggwwwwwX.",
  ".XwwwwwwwwwwwwX.",
  ".XwwwwwwwwwwwwX.",
  ".XddddddddddddX.",
  "..XXXXXXXXXXXX..",
  "................",
  "................",
  "................",
  "................"
];

// Register logo sprites across all directions for full static compatibility
["logo_linkedin", "logo_email", "logo_github"].forEach((name) => {
  let matrix, colorMap;
  if (name === "logo_linkedin") {
    matrix = linkedinMatrix;
    colorMap = linkedinColorMap;
  } else if (name === "logo_github") {
    matrix = githubMatrix;
    colorMap = githubColorMap;
  } else if (name === "logo_email") {
    matrix = emailMatrix;
    colorMap = emailColorMap;
  }
  ["down", "up", "left", "right"].forEach((dir) => {
    drawSprite(name, dir, 0, (ctx) => {
      paintMatrix(ctx, matrix, colorMap);
    });
  });
});

console.log("Premium 16x24 overworld character matrix pre-rendered successfully in texture buffers.");

