/* App state, parameter schema, randomizer recipes, and wiring. */

/* ---------------- modes ---------------- */

var MODES = [
  { id: 0, key: "chrome",   name: "金属",     full: "液态金属",
    icon: '<svg viewBox="0 0 26 18"><path d="M1 12 C5 4 9 15 13 9 C17 3 21 13 25 7" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M1 15 C5 9 10 17 14 12 C18 8 22 15 25 11" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.45"/></svg>' },
  { id: 1, key: "silk",     name: "丝带",     full: "丝绸光带",
    icon: '<svg viewBox="0 0 26 18"><path d="M1 13 C8 11 12 3 25 4" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M1 15.5 C8 13.5 12 5.5 25 6.5" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.65"/><path d="M1 18 C8 16 12 8 25 9" fill="none" stroke="currentColor" stroke-width="1.5" opacity="0.35"/></svg>' },
  { id: 2, key: "bloom",    name: "柔光",     full: "柔和绽放",
    icon: '<svg viewBox="0 0 26 18"><circle cx="9" cy="8" r="5.5" fill="currentColor" opacity="0.35"/><circle cx="17" cy="11" r="4" fill="currentColor" opacity="0.6"/></svg>' },
  { id: 3, key: "aura",     name: "光环",     full: "光环波纹",
    icon: '<svg viewBox="0 0 26 18"><circle cx="13" cy="9" r="7" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.35"/><circle cx="13" cy="9" r="4.2" fill="none" stroke="currentColor" stroke-width="1.4" opacity="0.7"/><circle cx="13" cy="9" r="1.6" fill="currentColor"/></svg>' },
  { id: 4, key: "rays",     name: "光束",     full: "光束",
    icon: '<svg viewBox="0 0 26 18"><path d="M13 1 L7 17 M13 1 L13 17 M13 1 L19 17 M13 1 L2 13 M13 1 L24 13" fill="none" stroke="currentColor" stroke-width="1.3" opacity="0.8"/></svg>' },
  { id: 5, key: "halftone", name: "半调",     full: "半调网点",
    icon: '<svg viewBox="0 0 26 18"><circle cx="4" cy="5" r="2.4" fill="currentColor"/><circle cx="11" cy="5" r="1.8" fill="currentColor"/><circle cx="18" cy="5" r="1.2" fill="currentColor"/><circle cx="24" cy="5" r="0.7" fill="currentColor"/><circle cx="4" cy="12" r="1.6" fill="currentColor"/><circle cx="11" cy="12" r="2.2" fill="currentColor"/><circle cx="18" cy="12" r="1.5" fill="currentColor"/><circle cx="24" cy="12" r="0.9" fill="currentColor"/></svg>' },
  { id: 6, key: "glyphs",   name: "字符",     full: "数据字符",
    icon: '<svg viewBox="0 0 26 18"><g fill="currentColor"><rect x="2" y="2" width="2" height="3"/><rect x="7" y="2" width="2" height="3" opacity="0.5"/><rect x="12" y="2" width="2" height="3"/><rect x="17" y="2" width="2" height="3" opacity="0.3"/><rect x="22" y="2" width="2" height="3" opacity="0.7"/><rect x="2" y="8" width="2" height="3" opacity="0.4"/><rect x="7" y="8" width="2" height="3"/><rect x="12" y="8" width="2" height="3" opacity="0.6"/><rect x="17" y="8" width="2" height="3"/><rect x="22" y="8" width="2" height="3" opacity="0.4"/><rect x="2" y="14" width="2" height="3" opacity="0.7"/><rect x="7" y="14" width="2" height="3" opacity="0.3"/><rect x="12" y="14" width="2" height="3" opacity="0.8"/><rect x="17" y="14" width="2" height="3" opacity="0.5"/><rect x="22" y="14" width="2" height="3"/></g></svg>' },
  { id: 7, key: "reeded",   name: "竖纹",     full: "竖纹玻璃",
    icon: '<svg viewBox="0 0 26 18"><g stroke="currentColor" stroke-width="1.8" fill="none"><path d="M3 1 V17" opacity="0.9"/><path d="M8 1 V17" opacity="0.5"/><path d="M13 1 V17" opacity="0.9"/><path d="M18 1 V17" opacity="0.5"/><path d="M23 1 V17" opacity="0.9"/></g></svg>' },
  { id: 8, key: "mosaic",   name: "马赛克",   full: "像素绽放",
    icon: '<svg viewBox="0 0 26 18"><g fill="currentColor"><rect x="2" y="2" width="6" height="6" opacity="0.9"/><rect x="9" y="2" width="6" height="6" opacity="0.4"/><rect x="16" y="2" width="6" height="6" opacity="0.7"/><rect x="2" y="9" width="6" height="6" opacity="0.3"/><rect x="9" y="9" width="6" height="6" opacity="0.8"/><rect x="16" y="9" width="6" height="6" opacity="0.5"/></g></svg>' }
];

var ASPECTS = { "16:9": 16 / 9, "3:2": 1.5, "1:1": 1, "4:5": 0.8, "21:9": 21 / 9 };

/* ---------------- state ---------------- */

/* startup: fresh light design for the embedded uiux.wiki effect page */
var P = {
  mode: 2, seed: 4217,
  c1: "#67e8f9", c2: "#a7f3d0", c3: "#fbcfe8", c4: "#fde68a", bg: "#ffffff",
  hue: 0, sat: 0.94, exposure: 1.04, contrast: 0.98,
  scale: 1.12, complex: 4.2, warp: 0.82, flow: 0.38, stretch: 0.05,
  light: 0.34, gloss: 28, lightAngle: 210, irid: 0.08, glow: 0.18,
  grain: 0.012, cell: 96, lines: 58, ca: 0.04, vig: 0.02, soft: 1.22,
  travel: 0.68, loop: 6.5,
  synthOn: false, modeB: 2, mixOp: 0, blend: 0.6,
  genomeOn: false, genes: [0,0,0.5,3, 0,0,0,0.5, 0.5,0.5,0.5,0],
  lockStyle: false,
  imgRes: "2160", vidRes: "1080", vidFps: "30", vidLen: "l2",
  gifW: "640", gifFps: 25, gifDither: true, gifLoop: true,
  aspect: "16:9"
};

/* randomizer ranges; missing keys fall back to DEF_RANGE */
var DEF_RANGE = {
  scale: [0.8, 1.8], complex: [3, 6], warp: [0.3, 1.5], flow: [0, 1], stretch: [-0.3, 0.5],
  light: [0.6, 1.6], gloss: [16, 80], lightAngle: [0, 360], irid: [0, 0.8], glow: [0, 0.5],
  contrast: [0.95, 1.2], grain: [0, 0.12], cell: [40, 140], lines: [20, 100], ca: [0, 0.4],
  vig: [0, 0.4], soft: [0.6, 1.4], sat: [0.95, 1.35], exposure: [0.95, 1.1], hue: [0, 0],
  travel: [0.3, 1.0], loop: [4, 8]
};

var RECIPES = {
  chrome: { tone: ["dark"], scale: [1.2, 2.4], complex: [2.8, 5], warp: [0.7, 1.9], flow: [0.2, 1.0],
    stretch: [0.25, 0.7], light: [1.2, 2.0], gloss: [36, 100], irid: [0.2, 0.85], glow: [0.15, 0.55],
    contrast: [1.0, 1.3], grain: [0.02, 0.1], ca: [0, 0.45], vig: [0.15, 0.5], sat: [1.0, 1.4],
    travel: [0.4, 1.0], loop: [4, 8] },
  silk: { tone: ["dark"], scale: [1.2, 2.2], warp: [0.3, 1.0], lines: [40, 90], gloss: [24, 80],
    light: [1.0, 1.9], stretch: [0, 0.4], irid: [0.2, 0.7], glow: [0.2, 0.6], grain: [0.02, 0.08],
    vig: [0.1, 0.4], sat: [1.0, 1.45], contrast: [1.0, 1.25], travel: [0.3, 0.8], loop: [4, 9] },
  bloom: { tone: ["light", "light", "dark"], scale: [0.8, 1.6], warp: [0.3, 1.4], soft: [0.8, 1.5],
    light: [0, 0.6], glow: [0, 0.3], grain: [0, 0.07], ca: [0, 0.25], vig: [0, 0.25],
    contrast: [0.9, 1.05], sat: [0.9, 1.3], travel: [0.5, 1.2], loop: [5, 10] },
  aura: { tone: ["light", "light", "dark"], scale: [0.9, 1.6], warp: [0.2, 1.0], soft: [0.9, 1.6],
    grain: [0, 0.06], contrast: [0.9, 1.05], sat: [0.85, 1.15], vig: [0, 0.2], glow: [0, 0.35],
    ca: [0, 0.08], travel: [0.3, 0.9], loop: [5, 10] },
  rays: { tone: ["light", "light", "dark"], warp: [0.3, 1.2], lines: [20, 90], grain: [0, 0.1],
    glow: [0.1, 0.5], contrast: [0.95, 1.2], sat: [1.0, 1.4], vig: [0, 0.3], travel: [0.2, 0.7],
    loop: [5, 10], scale: [0.9, 1.5] },
  halftone: { tone: ["light", "light", "dark"], cell: [60, 150], scale: [0.9, 1.8], warp: [0.4, 1.4],
    grain: [0, 0.05], contrast: [0.95, 1.15], sat: [0.95, 1.3], ca: [0, 0.2], vig: [0, 0.2],
    travel: [0.4, 1.0], loop: [4, 9] },
  glyphs: { tone: ["dark"], cell: [70, 150], scale: [0.8, 1.6], warp: [0.5, 1.5], grain: [0.02, 0.12],
    glow: [0.3, 0.8], contrast: [1.0, 1.3], sat: [1.0, 1.5], ca: [0, 0.5], vig: [0.2, 0.6],
    travel: [0.4, 1.0], loop: [3, 7] },
  reeded: { tone: ["light", "dark"], lines: [36, 90], warp: [0.6, 1.6], scale: [0.8, 1.5],
    grain: [0, 0.07], light: [0.4, 1.2], contrast: [0.95, 1.2], sat: [1.0, 1.35], vig: [0, 0.18],
    travel: [0.5, 1.1], loop: [5, 10] },
  mosaic: { tone: ["light", "dark"], cell: [40, 120], warp: [0.3, 1.2], scale: [0.8, 1.5],
    grain: [0, 0.04], contrast: [0.95, 1.15], sat: [0.95, 1.3], vig: [0, 0.15],
    travel: [0.5, 1.2], loop: [5, 10], soft: [0.8, 1.4] },
  genome: { tone: ["dark", "light", "dark"], scale: [0.9, 1.7], complex: [2.5, 5.5], warp: [0.35, 1.3],
    flow: [0.1, 0.8], stretch: [-0.2, 0.45], lines: [30, 100], cell: [50, 130],
    grain: [0, 0.08], ca: [0, 0.15], vig: [0.05, 0.25], soft: [0.75, 1.35],
    travel: [0.35, 0.95], loop: [4, 9] }
};

var FIELD_NAMES = ["FLUX", "RIDGE", "WAVE", "RING", "CELL", "FLOW", "BAND", "GRID", "HEX", "ARC", "HATCH", "ORB"];
var FIELD_TYPES = FIELD_NAMES.length;
var DOMAIN_TYPES = 7;
var COLOR_MAPS = 6;
var SHADE_TYPES = 5;
var OVERLAY_TYPES = 5;

var FORM_KEYS = ["scale", "complex", "warp", "flow", "stretch"];
var LIGHT_KEYS = ["light", "gloss", "lightAngle", "irid", "glow", "contrast"];
var TEXTURE_KEYS = ["grain", "cell", "lines", "ca", "vig", "soft"];
var MOTION_KEYS = ["loop", "travel"];
var GRADE_KEYS = ["sat", "exposure"];

/* ---------------- randomizer ---------------- */

function rnd() { return Math.random(); }
function randIn(range) { return range[0] + rnd() * (range[1] - range[0]); }
function recipeKey() {
  if (P.genomeOn) return "genome";
  return MODES[P.mode].key;
}

function rangeFor(key) {
  var rec = RECIPES[recipeKey()] || {};
  return rec[key] || DEF_RANGE[key];
}

function pickTone() {
  var rec = RECIPES[recipeKey()] || { tone: ["dark", "light"] };
  return rec.tone[Math.floor(rnd() * rec.tone.length)];
}

var activePreset = -1;
var setPresetActive = function () {};

function applyPalette(pal, presetIdx) {
  P.c1 = pal.colors[0]; P.c2 = pal.colors[1];
  P.c3 = pal.colors[2]; P.c4 = pal.colors[3];
  P.bg = pal.tone === "dark" ? "#ffffff" : pal.bg;
  activePreset = presetIdx;
  setPresetActive(presetIdx);
}

function randomizePalette(tone) {
  tone = tone || pickTone();
  if (rnd() < 0.78) {
    var pool = [];
    PALETTES.forEach(function (p, i) { if (p.tone === tone) pool.push(i); });
    if (!pool.length) pool = PALETTES.map(function (_, i) { return i; });
    var idx = pool[Math.floor(rnd() * pool.length)];
    applyPalette(PALETTES[idx], idx);
  } else {
    applyPalette(generateRandomPalette(rnd, tone), -1);
  }
  P.hue = 0;
}

/* tuned grading + lighting so random hits stay pleasant, not harsh */
function smartTune(tone) {
  var key = recipeKey();
  var isLight = tone === "light";
  var isGlass = key === "chrome" || key === "reeded" || key === "silk" ||
    (P.genomeOn && Math.round(P.genes[5]) === 4);
  var isSoft = key === "bloom" || key === "aura" || key === "mosaic" ||
    key === "rays" || key === "halftone";

  P.exposure = isLight ? randIn([0.94, 1.06]) : randIn([0.90, 1.04]);
  P.contrast = isLight ? randIn([0.94, 1.10]) : randIn([0.92, 1.12]);
  P.sat = isLight ? randIn([0.82, 1.06]) : randIn([0.86, 1.16]);
  P.hue = randIn([-14, 14]);

  if (isGlass) {
    P.light = randIn([0.62, 1.32]);
    P.gloss = Math.round(randIn([26, 92]));
    P.lightAngle = Math.round(randIn([0, 360]));
    P.irid = randIn([0, 0.38]);
    P.glow = randIn([0, 0.2]);
    P.soft = randIn([0.82, 1.28]);
  } else if (isSoft) {
    P.light = randIn([0.12, 0.72]);
    P.gloss = Math.round(randIn([10, 44]));
    P.lightAngle = Math.round(randIn([0, 360]));
    P.irid = randIn([0, 0.22]);
    P.glow = randIn([0, 0.18]);
  } else {
    P.light = randIn([0.48, 1.28]);
    P.gloss = Math.round(randIn([14, 76]));
    P.lightAngle = Math.round(randIn([0, 360]));
    P.irid = randIn([0, 0.32]);
    P.glow = randIn([0, 0.28]);
  }

  P.ca = randIn([0, 0.16]);
  P.vig = randIn([0.05, 0.26]);
  P.grain = randIn([0, isLight ? 0.055 : 0.085]);
}

function randomizeKeys(keys) {
  keys.forEach(function (k) {
    var v = randIn(rangeFor(k));
    if (k === "gloss" || k === "cell" || k === "lines" || k === "lightAngle") v = Math.round(v);
    if (k === "loop") v = Math.round(v * 2) / 2;
    P[k] = v;
  });
}

function newSeed() { P.seed = Math.floor(rnd() * 10000); }

/* genome: 12 genes define a complete standalone style that does not
   exist in the base set. fields x domains x colors x shading x overlays
   gives thousands of distinct archetypes. */
function pickFieldType() {
  /* mix organic noise fields with clean geometric patterns */
  if (rnd() < 0.48) return 6 + Math.floor(rnd() * (FIELD_TYPES - 6));
  return Math.floor(rnd() * 6);
}

function generateGenomeStyle() {
  P.genes = [
    pickFieldType(),                // 0 field type
    Math.floor(rnd() * DOMAIN_TYPES), // 1 domain op
    0.15 + rnd() * 1.0,             // 2 extra warp
    2 + Math.floor(rnd() * 6),      // 3 fold count
    Math.floor(rnd() * COLOR_MAPS), // 4 color map
    Math.floor(rnd() * SHADE_TYPES),// 5 shading
    Math.floor(rnd() * OVERLAY_TYPES), // 6 overlay
    0.25 + rnd() * 1.0,             // 7 overlay scale
    rnd(),                          // 8 ridge sharpness
    rnd(),                          // 9 poster steps
    0.25 + rnd() * 0.85,            // 10 field scale
    rnd()                           // 11 rotation
  ];
  P.genomeOn = true;
  P.synthOn = false;
}

function genomeName() {
  var g = P.genes;
  var n = (g[0] * 7 + g[1] * 13 + g[4] * 29 + g[5] * 47 + g[6] * 71 +
    Math.round(g[11] * 99)) % 1000;
  var ft = Math.min(Math.max(Math.round(g[0]) || 0, 0), FIELD_TYPES - 1);
  return FIELD_NAMES[ft] + " " + String(Math.round(n)).padStart(3, "0");
}

function styleName() {
  if (P.genomeOn) return genomeName();
  if (P.synthOn) return "合成 " + MODES[P.mode].name + "+" + MODES[P.modeB].name;
  return MODES[P.mode].full;
}

function randomizeAll() {
  if (!P.lockStyle) {
    if (rnd() < 0.42 && Engine.hasGenome()) {
      generateGenomeStyle();
    } else {
      P.synthOn = false;
      P.genomeOn = false;
      P.mode = Math.floor(rnd() * MODES.length);
    }
  }
  var tone = pickTone();
  randomizePalette(tone);
  randomizeKeys(FORM_KEYS.concat(TEXTURE_KEYS, MOTION_KEYS));
  smartTune(tone);
  newSeed();
  refreshAll();
}

/* ---------------- saved styles (localStorage) ---------------- */

var STYLES_KEY = "lumen-styles-v1";

function loadSavedStyles() {
  try { return JSON.parse(localStorage.getItem(STYLES_KEY)) || []; }
  catch (e) { return []; }
}
function persistSavedStyles(list) {
  try { localStorage.setItem(STYLES_KEY, JSON.stringify(list)); } catch (e) {}
}
function saveCurrentStyle() {
  var list = loadSavedStyles();
  var name = styleName() + " " + String(Math.round(P.seed)).padStart(4, "0");
  list.unshift({ name: name, code: encodeDesign(), ts: Date.now() });
  if (list.length > 24) list.length = 24;
  persistSavedStyles(list);
  renderSavedStyles();
  UI.toast("已保存样式：" + name);
}
var renderSavedStyles = function () {};

/* ---------------- design codes (share) ---------------- */

var SHARE_NUMS = [
  "hue", "sat", "exposure", "contrast",
  "scale", "complex", "warp", "flow", "stretch",
  "light", "gloss", "lightAngle", "irid", "glow",
  "grain", "cell", "lines", "ca", "vig", "soft",
  "travel", "loop"
];

function encodeDesign() {
  var arr = [3, P.mode, Math.round(P.seed),
    P.c1.slice(1), P.c2.slice(1), P.c3.slice(1), P.c4.slice(1), P.bg.slice(1),
    P.aspect];
  SHARE_NUMS.forEach(function (k) { arr.push(Math.round(P[k] * 1000) / 1000); });
  arr.push(P.synthOn ? 1 : 0, P.modeB | 0, P.mixOp | 0, Math.round(P.blend * 1000) / 1000);
  arr.push(P.genomeOn ? 1 : 0);
  P.genes.forEach(function (g) { arr.push(Math.round(g * 1000) / 1000); });
  var b64 = btoa(JSON.stringify(arr))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
  return "LMN1." + b64;
}

function decodeDesign(code) {
  try {
    code = String(code).trim().replace(/^#/, "");
    if (code.indexOf("LMN1.") !== 0) return false;
    var b64 = code.slice(5).replace(/-/g, "+").replace(/_/g, "/");
    while (b64.length % 4) b64 += "=";
    var arr = JSON.parse(atob(b64));
    var baseLen = 9 + SHARE_NUMS.length;
    var isV1 = Array.isArray(arr) && arr[0] === 1 && arr.length === baseLen;
    var isV2 = Array.isArray(arr) && arr[0] === 2 && arr.length === baseLen + 4;
    var isV3 = Array.isArray(arr) && arr[0] === 3 && arr.length === baseLen + 17;
    if (!isV1 && !isV2 && !isV3) return false;

    var hexOk = function (h) { return /^[0-9a-fA-F]{6}$/.test(h); };
    if (![arr[3], arr[4], arr[5], arr[6], arr[7]].every(hexOk)) return false;

    P.mode = Math.min(Math.max(Math.round(arr[1]) || 0, 0), MODES.length - 1);
    P.seed = Math.min(Math.max(Math.round(arr[2]) || 0, 0), 9999);
    P.c1 = "#" + arr[3]; P.c2 = "#" + arr[4]; P.c3 = "#" + arr[5];
    P.c4 = "#" + arr[6]; P.bg = "#" + arr[7];
    if (ASPECTS[arr[8]]) P.aspect = arr[8];
    SHARE_NUMS.forEach(function (k, i) {
      var v = Number(arr[9 + i]);
      if (isFinite(v)) P[k] = v;
    });
    if (isV2 || isV3) {
      P.synthOn = !!arr[baseLen];
      P.modeB = Math.min(Math.max(Math.round(arr[baseLen + 1]) || 0, 0), MODES.length - 1);
      P.mixOp = Math.min(Math.max(Math.round(arr[baseLen + 2]) || 0, 0), 4);
      var bl = Number(arr[baseLen + 3]);
      P.blend = isFinite(bl) ? Math.min(Math.max(bl, 0), 1) : 0.6;
    } else {
      P.synthOn = false;
    }
    if (isV3) {
      P.genomeOn = !!arr[baseLen + 4];
      P.genes = [];
      for (var gi = 0; gi < 12; gi++) {
        var gv = Number(arr[baseLen + 5 + gi]);
        P.genes.push(isFinite(gv) ? gv : 0);
      }
    } else {
      P.genomeOn = false;
    }
    activePreset = -1;
    setPresetActive(-1);
    refreshAll();
    if (typeof fitCanvas === "function") fitCanvas();
    return true;
  } catch (e) {
    return false;
  }
}

function copyText(text, okMsg) {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(
      function () { UI.toast(okMsg); },
      function () { UI.toast("无法访问剪贴板"); });
  } else {
    UI.toast("当前浏览器不支持剪贴板");
  }
}

/* ---------------- UI wiring ---------------- */

var refreshers = [];
function reg(fn) { refreshers.push(fn); return fn; }
function refreshAll() {
  refreshers.forEach(function (f) { f(); });
  updateMeta();
}

function get(k) { return function () { return P[k]; }; }
function set(k) { return function (v) { P[k] = v; updateMeta(); }; }

function fmt2(v) { return (+v).toFixed(2); }
function fmt1(v) { return (+v).toFixed(1); }
function fmtInt(v) { return String(Math.round(v)); }
function fmtDeg(v) { return Math.round(v) + "\u00b0"; }
function fmtSec(v) { return (+v).toFixed(1) + " 秒"; }

function buildRail() {
  var rail = document.getElementById("rail");

  /* STYLE */
  var sStyle = UI.section(rail, "样式", function () {
    P.synthOn = false;
    P.mode = Math.floor(rnd() * MODES.length);
    refreshAll();
  });
  reg(UI.modeGrid(sStyle, MODES, function () { return (P.synthOn || P.genomeOn) ? -1 : P.mode; },
    function (v) { P.mode = v; P.synthOn = false; P.genomeOn = false; refreshAll(); }));

  /* genome: brand-new generated styles */
  var synthRow = UI.el("div", "share-row synth-row", sStyle);
  var btnSynth = UI.el("button", "mini-btn", synthRow);
  btnSynth.innerHTML = '<svg viewBox="0 0 16 16"><path d="M8 1.5 L9.8 6.2 L14.5 8 L9.8 9.8 L8 14.5 L6.2 9.8 L1.5 8 L6.2 6.2 Z" fill="none" stroke="currentColor" stroke-width="1.3"/></svg>新样式';
  btnSynth.addEventListener("click", function () {
    if (!Engine.hasGenome()) {
      UI.toast("样式合成器还在预热，稍后再试");
      return;
    }
    generateGenomeStyle();
    newSeed();
    refreshAll();
    UI.toast("发现新样式：" + genomeName());
  });
  var btnSave = UI.el("button", "mini-btn", synthRow);
  btnSave.innerHTML = '<svg viewBox="0 0 16 16"><path d="M3 2 H11 L14 5 V14 H3 Z" fill="none" stroke="currentColor" stroke-width="1.5"/><rect x="5.5" y="9" width="5" height="4" fill="currentColor"/></svg>保存样式';
  btnSave.addEventListener("click", saveCurrentStyle);

  var synthCtl = UI.el("div", "synth-ctl", sStyle);
  reg(UI.slider(synthCtl, { label: "合成混合", min: 0, max: 1, step: 0.01, fmt: fmt2,
    get: get("blend"), set: function (v) { P.blend = v; updateMeta(); } }));
  reg(function () { synthCtl.style.display = P.synthOn ? "" : "none"; });

  var savedWrap = UI.el("div", "saved-styles", sStyle);
  renderSavedStyles = function () {
    savedWrap.innerHTML = "";
    var list = loadSavedStyles();
    list.forEach(function (st, i) {
      var chip = UI.el("button", "saved-chip", savedWrap);
      var label = UI.el("span", null, chip);
      label.textContent = st.name;
      var del = UI.el("span", "saved-del", chip);
      del.innerHTML = "&times;";
      del.addEventListener("click", function (ev) {
        ev.stopPropagation();
        var l = loadSavedStyles();
        l.splice(i, 1);
        persistSavedStyles(l);
        renderSavedStyles();
      });
      chip.addEventListener("click", function () {
        if (decodeDesign(st.code)) UI.toast("已载入 " + st.name);
      });
    });
  };
  renderSavedStyles();

  reg(UI.lockRow(sStyle, { label: "随机时保留当前样式", get: get("lockStyle"), set: set("lockStyle") }));

  /* COLOR */
  var sColor = UI.section(rail, "颜色", function () { randomizePalette(); refreshAll(); });
  setPresetActive = UI.presetChips(sColor, PALETTES, function (i) {
    applyPalette(PALETTES[i], i);
    refreshAll();
  });
  setPresetActive(activePreset);
  reg(UI.colorSwatches(sColor,
    [{ key: "c1", label: "A" }, { key: "c2", label: "B" }, { key: "c3", label: "C" }, { key: "c4", label: "D" },
     { gap: true }, { key: "bg", label: "背景" }],
    function (k) { return P[k]; },
    function (k, v) { P[k] = v; activePreset = -1; setPresetActive(-1); }));
  reg(UI.slider(sColor, { label: "色相偏移", min: -180, max: 180, step: 1, fmt: fmtDeg, get: get("hue"), set: set("hue") }));
  reg(UI.slider(sColor, { label: "饱和度", min: 0, max: 2, step: 0.01, fmt: fmt2, get: get("sat"), set: set("sat") }));
  reg(UI.slider(sColor, { label: "曝光", min: 0.5, max: 1.6, step: 0.01, fmt: fmt2, get: get("exposure"), set: set("exposure") }));

  /* FORM */
  var sForm = UI.section(rail, "形态", function () { randomizeKeys(FORM_KEYS); newSeed(); refreshAll(); });
  reg(UI.seedRow(sForm, { get: get("seed"), set: function (v) { P.seed = v; updateMeta(); refreshAll(); }, onDice: function () { newSeed(); refreshAll(); } }));
  reg(UI.slider(sForm, { label: "缩放", min: 0.5, max: 3, step: 0.01, fmt: fmt2, get: get("scale"), set: set("scale") }));
  reg(UI.slider(sForm, { label: "细节", min: 1, max: 8, step: 0.1, fmt: fmt1, get: get("complex"), set: set("complex") }));
  reg(UI.slider(sForm, { label: "扭曲", min: 0, max: 2.5, step: 0.01, fmt: fmt2, get: get("warp"), set: set("warp") }));
  reg(UI.slider(sForm, { label: "湍流", min: 0, max: 2, step: 0.01, fmt: fmt2, get: get("flow"), set: set("flow") }));
  reg(UI.slider(sForm, { label: "拉伸", min: -1, max: 1, step: 0.01, fmt: fmt2, get: get("stretch"), set: set("stretch") }));

  /* LIGHTING */
  var sLight = UI.section(rail, "光照", function () { randomizeKeys(LIGHT_KEYS); refreshAll(); });
  reg(UI.slider(sLight, { label: "强度", min: 0, max: 2.2, step: 0.01, fmt: fmt2, get: get("light"), set: set("light") }));
  reg(UI.slider(sLight, { label: "光泽", min: 4, max: 120, step: 1, fmt: fmtInt, get: get("gloss"), set: set("gloss") }));
  reg(UI.slider(sLight, { label: "角度", min: 0, max: 360, step: 1, fmt: fmtDeg, get: get("lightAngle"), set: set("lightAngle") }));
  reg(UI.slider(sLight, { label: "虹彩", min: 0, max: 1, step: 0.01, fmt: fmt2, get: get("irid"), set: set("irid") }));
  reg(UI.slider(sLight, { label: "辉光", min: 0, max: 1, step: 0.01, fmt: fmt2, get: get("glow"), set: set("glow") }));
  reg(UI.slider(sLight, { label: "对比", min: 0.6, max: 1.6, step: 0.01, fmt: fmt2, get: get("contrast"), set: set("contrast") }));

  /* TEXTURE */
  var sTex = UI.section(rail, "质感", function () { randomizeKeys(TEXTURE_KEYS); refreshAll(); });
  reg(UI.slider(sTex, { label: "颗粒", min: 0, max: 0.4, step: 0.005, fmt: fmt2, get: get("grain"), set: set("grain") }));
  reg(UI.slider(sTex, { label: "密度", min: 14, max: 180, step: 1, fmt: fmtInt, get: get("cell"), set: set("cell") }));
  reg(UI.slider(sTex, { label: "脊线", min: 8, max: 160, step: 1, fmt: fmtInt, get: get("lines"), set: set("lines") }));
  reg(UI.slider(sTex, { label: "色差", min: 0, max: 1, step: 0.01, fmt: fmt2, get: get("ca"), set: set("ca") }));
  reg(UI.slider(sTex, { label: "暗角", min: 0, max: 1, step: 0.01, fmt: fmt2, get: get("vig"), set: set("vig") }));
  reg(UI.slider(sTex, { label: "柔和度", min: 0.3, max: 1.6, step: 0.01, fmt: fmt2, get: get("soft"), set: set("soft") }));

  /* MOTION */
  var sMotion = UI.section(rail, "动态", function () { randomizeKeys(MOTION_KEYS); refreshAll(); });
  reg(UI.slider(sMotion, { label: "循环时长", min: 2, max: 12, step: 0.5, fmt: fmtSec, get: get("loop"), set: set("loop") }));
  reg(UI.slider(sMotion, { label: "位移", min: 0, max: 1.5, step: 0.01, fmt: fmt2, get: get("travel"), set: set("travel") }));

  /* SHARE */
  var sShare = UI.section(rail, "分享", null);
  var shareRow = UI.el("div", "share-row", sShare);
  var btnCopyCode = UI.el("button", "mini-btn", shareRow);
  btnCopyCode.textContent = "复制设计码";
  btnCopyCode.addEventListener("click", function () {
    copyText(encodeDesign(), "设计码已复制，可粘贴到任意位置");
  });
  var btnCopyLink = UI.el("button", "mini-btn", shareRow);
  btnCopyLink.textContent = "复制链接";
  btnCopyLink.addEventListener("click", function () {
    var url = location.origin + location.pathname + "#" + encodeDesign();
    copyText(url, "分享链接已复制");
  });
  var pasteInput = UI.el("input", "num-input mono share-input", sShare);
  pasteInput.type = "text";
  pasteInput.placeholder = "粘贴设计码…";
  pasteInput.spellcheck = false;
  function tryApplyPaste() {
    var v = pasteInput.value.trim();
    if (!v) return;
    if (decodeDesign(v)) {
      UI.toast("设计已载入");
      pasteInput.value = "";
      pasteInput.blur();
    } else {
      UI.toast("设计码无效");
    }
  }
  pasteInput.addEventListener("paste", function () { setTimeout(tryApplyPaste, 0); });
  pasteInput.addEventListener("keydown", function (e) {
    if (e.key === "Enter") tryApplyPaste();
    e.stopPropagation();
  });

  /* EXPORT: buttons open a dialog with preview and settings */
  var sExp = UI.section(rail, "导出", null);
  var grid = UI.el("div", "export-grid", sExp);
  UI.exportButton(grid, "图片", "PNG",
    '<svg viewBox="0 0 16 16"><rect x="1.5" y="1.5" width="13" height="13" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><circle cx="5.5" cy="5.5" r="1.5" fill="currentColor"/><path d="M2 12 L6 8 L9 11 L11.5 8.5 L14 11" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    function () { Modals.openExport("png"); });
  UI.exportButton(grid, "视频", "WEBM",
    '<svg viewBox="0 0 16 16"><rect x="1.5" y="3.5" width="9" height="9" rx="2" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M10.5 7 L14.5 4.5 V11.5 L10.5 9" fill="currentColor"/></svg>',
    function () { Modals.openExport("video"); });
  UI.exportButton(grid, "循环 GIF", "GIF",
    '<svg viewBox="0 0 16 16"><path d="M13.5 8 a5.5 5.5 0 1 1 -1.6 -3.9" fill="none" stroke="currentColor" stroke-width="1.5"/><path d="M13.8 1.6 V4.4 H11" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>',
    function () { Modals.openExport("gif"); });
  UI.exportButton(grid, "渐变套图", "ZIP",
    '<svg viewBox="0 0 16 16"><rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="9" y="1.5" width="5.5" height="5.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="1.5" y="9" width="5.5" height="5.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/><rect x="9" y="9" width="5.5" height="5.5" rx="1.5" fill="none" stroke="currentColor" stroke-width="1.4"/></svg>',
    function () { Modals.openSetGenerator(); });
}

/* ---------------- stage / meta ---------------- */

function updateMeta() {
  document.getElementById("meta-mode").textContent = styleName();
  document.getElementById("meta-seed").textContent = "种子 " + String(Math.round(P.seed)).padStart(4, "0");
  document.getElementById("meta-loop").textContent = P.loop.toFixed(1) + " 秒循环";
  if (Engine.isReady()) {
    var s = Engine.size();
    document.getElementById("meta-res").textContent = s[0] + "\u00d7" + s[1];
  }
}

var stage = { failed: false, resizeObs: null, resizeTimer: null, bufW: 0, bufH: 0 };

function fitCanvas(preview) {
  if (stage.failed) return;
  var frame = document.getElementById("canvas-frame");
  if (!frame) return;
  var availW = frame.clientWidth - 80;
  var availH = frame.clientHeight - 52;
  if (availW <= 0 || availH <= 0) return;
  var ar = ASPECTS[P.aspect];
  var w = availW, h = w / ar;
  if (h > availH) { h = availH; w = h * ar; }
  w = Math.round(w);
  h = Math.round(h);
  var canvasEl = document.getElementById("view");
  if (!canvasEl || !canvasEl.isConnected) return;
  canvasEl.style.width = w + "px";
  canvasEl.style.height = h + "px";
  var boot = document.getElementById("canvas-boot");
  if (boot) {
    boot.style.width = w + "px";
    boot.style.height = h + "px";
  }
  if (!Engine.isReady() || Engine.isLost()) return;
  var lowMem = (navigator.deviceMemory || 8) <= 4;
  var dprCap = preview ? 0.65 : (lowMem ? 0.75 : 0.85);
  var dpr = Math.min(window.devicePixelRatio || 1, dprCap);
  var bufW = 2 * Math.round(w * dpr / 2);
  var bufH = 2 * Math.round(h * dpr / 2);
  if (stage.bufW === bufW && stage.bufH === bufH) {
    updateMeta();
    return;
  }
  stage.bufW = bufW;
  stage.bufH = bufH;
  Engine.setSize(bufW, bufH);
  updateMeta();
}

function onStageResize() {
  clearTimeout(stage.resizeTimer);
  stage.resizeTimer = setTimeout(function () {
    fitCanvas(false);
  }, 250);
}

function detachStageResize() {
  if (stage.resizeObs) {
    stage.resizeObs.disconnect();
    stage.resizeObs = null;
  }
  clearTimeout(stage.resizeTimer);
}

function setPlayingUI(v) {
  Engine.setPlaying(v);
  document.getElementById("icon-pause").style.display = v ? "" : "none";
  document.getElementById("icon-play").style.display = v ? "none" : "";
}

/* ---------------- boot ---------------- */

function wireControls() {
  var segRefresh = UI.segmented(
    document.getElementById("aspect-seg"),
    Object.keys(ASPECTS).map(function (k) { return [k, k]; }),
    get("aspect"),
    function (v) { P.aspect = v; fitCanvas(); }
  );
  reg(segRefresh);

  Engine.onFps(function (fps) {
    document.getElementById("meta-fps").textContent = fps + " fps";
  });

  document.getElementById("btn-random").addEventListener("click", randomizeAll);
  document.getElementById("btn-play").addEventListener("click", function () {
    setPlayingUI(!Engine.isPlaying());
  });
  document.getElementById("btn-export-png").addEventListener("click", function () { Modals.openExport("png"); });
  document.getElementById("btn-export-video").addEventListener("click", function () { Modals.openExport("video"); });
  document.getElementById("btn-export-gif").addEventListener("click", function () { Modals.openExport("gif"); });
  document.getElementById("btn-set").addEventListener("click", function () { Modals.openSetGenerator(); });

  document.addEventListener("keydown", function (e) {
    var tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "select" || tag === "textarea") return;
    if (e.code === "Space") { e.preventDefault(); setPlayingUI(!Engine.isPlaying()); }
    else if (e.key === "r" || e.key === "R") { randomizeAll(); }
    else if (e.key === "s" || e.key === "S") { Exporter.exportPNG(P, ASPECTS[P.aspect]); }
  });
}

function showStageError(msg) {
  var el = document.getElementById("stage-error");
  if (!el) return;
  el.innerHTML =
    "需要 WebGL2。请使用较新的 Chrome、Edge 或 Firefox。<br>" +
    '<span style="color:#5e5e68;font-size:11px">' + String(msg).split("\n")[0] + "</span>";
  el.hidden = false;
}

function showBootError(msg) {
  stage.failed = true;
  detachStageResize();
  Engine.suspend();
  document.body.classList.remove("booting");
  document.body.classList.remove("ready");
  showStageError(msg);
}

function onContextLost() {
  stage.failed = true;
  detachStageResize();
  Engine.suspend();
  document.body.classList.remove("ready");
  showStageError("WebGL 上下文已丢失，请重新加载页面。");
  UI.toast("WebGL 上下文已丢失，请重新加载页面。");
}

document.addEventListener("DOMContentLoaded", function () {
  var canvas = document.getElementById("view");
  if (!canvas) return;

  var lowPower = (navigator.hardwareConcurrency || 8) <= 4 ||
    ((navigator.deviceMemory || 8) <= 4);

  document.addEventListener("visibilitychange", function () {
    if (stage.failed) return;
    if (document.hidden) Engine.suspend();
    else if (Engine.isReady() && !Engine.isLost()) Engine.resume();
  });

  /* show UI shell immediately; the shader compiles on a driver
     thread (KHR_parallel_shader_compile) and onReady fires when done,
     so the page never freezes during boot. */
  fitCanvas(true);
  buildRail();
  wireControls();

  requestAnimationFrame(function () {
    Engine.init(canvas, function () { return P; }, {
      autostart: false,
      onContextLost: onContextLost,
      onError: showBootError,
      onReady: function () {
        Engine.setMaxFps(lowPower ? 30 : 45);

        var hash = decodeURIComponent(location.hash.slice(1) || "");
        if (hash.indexOf("LMN1.") === 0 && decodeDesign(hash)) {
          UI.toast("分享设计已载入");
        }

        fitCanvas(false);
        stage.resizeObs = new ResizeObserver(onStageResize);
        stage.resizeObs.observe(document.getElementById("canvas-frame"));

        document.body.classList.remove("booting");
        document.body.classList.add("ready");
        Engine.start();
        updateMeta();
      }
    });
  });
});
