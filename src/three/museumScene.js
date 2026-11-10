import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Procedurally generates high-impact Dark Metal-Pop / Graffiti Canvas Artworks
 */
export function createMetalPopArtworkTexture(art, canvas = document.createElement('canvas')) {
  const size = 1024;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const index = (art.pattern ?? 0) % 8;

  // 1. Pristine gallery canvas base with subtle texture
  ctx.fillStyle = '#101114';
  ctx.fillRect(0, 0, size, size);

  // Background subtle noise & crosshatch
  ctx.save();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let i = 0; i < size; i += 32) {
    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();
  }
  ctx.restore();

  // 2. High-impact Metallic & Spray Paint Accents
  ctx.save();
  const grad = ctx.createLinearGradient(100, 100, 900, 900);
  grad.addColorStop(0, art.accentColor);
  grad.addColorStop(0.5, '#ffffff');
  grad.addColorStop(1, '#1b1d22');

  // Bold geometric / brutalist backdrop block
  ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
  ctx.fillRect(120, 120, size - 240, size - 240);

  // Bold Graphic Metal Inscription per Artwork
  if (index === 0) {
    // "CHROME REVOLT"
    ctx.strokeStyle = grad;
    ctx.lineWidth = 14;
    drawBrutalistDiamond(ctx, 512, 420, 240);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 82px "Syne", sans-serif';
    fitText(ctx, 'CHROME', 520);
    ctx.fillStyle = art.accentColor;
    fitText(ctx, 'REVOLT', 600);

    ctx.font = '700 24px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    fitText(ctx, 'HEAVY METAL ATELIER // ARCHIVE 01', 660);
  } else if (index === 1) {
    // "ANARCHY IN GOLD"
    drawGildedCrownGraphic(ctx, 512, 360, 280, art.accentColor);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 76px "Syne", sans-serif';
    fitText(ctx, 'ROYAL ANARCHY', 560);
    ctx.font = '700 24px monospace';
    ctx.fillStyle = art.accentColor;
    fitText(ctx, '24K DECONSTRUCTED REGALIA', 620);
  } else if (index === 2) {
    // "HEAVY METAL SAINTS"
    drawBrutalistCrossGraphic(ctx, 512, 400, 320, art.accentColor);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 84px "Syne", sans-serif';
    fitText(ctx, 'SAINTS', 680);
  } else if (index === 3) {
    // "TITANIUM RIOT"
    drawIndustrialBars(ctx, 200, 260, 624, 280, art.accentColor);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 78px "Syne", sans-serif';
    fitText(ctx, 'TITANIUM RIOT', 580);
  } else if (index === 4) {
    // "SUBWAY GHOSTS"
    drawCyberSprayCircle(ctx, 512, 420, 220, art.accentColor);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 72px "Syne", sans-serif';
    fitText(ctx, 'SUBWAY GHOSTS', 540);
    ctx.font = '700 26px monospace';
    ctx.fillStyle = art.accentColor;
    fitText(ctx, '03:00 AM // NIGHT YARDS', 600);
  } else if (index === 5) {
    // "BARBED VELVET"
    drawBarbedWireGraphic(ctx, 160, 420, 704, art.accentColor);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 76px "Syne", sans-serif';
    fitText(ctx, 'BARBED VELVET', 580);
  } else if (index === 6) {
    // "RAW DISPATCH"
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 84px "Syne", sans-serif';
    fitText(ctx, 'NO MASTERS', 440);
    ctx.fillStyle = art.accentColor;
    fitText(ctx, 'RAW DISPATCH', 530);
    ctx.fillRect(252, 570, 520, 8);
  } else {
    // "CONCRETE HALO"
    drawGildedCrownGraphic(ctx, 512, 380, 240, art.accentColor);
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 74px "Syne", sans-serif';
    fitText(ctx, 'CONCRETE HALO', 560);
  }

  // Industrial spray drips & splatters
  drawFineSprayDrips(ctx, 220, 680, 10, art.accentColor);
  ctx.restore();

  // Razor-sharp gallery canvas bezel
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 8;
  ctx.strokeRect(12, 12, size - 24, size - 24);

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  return texture;
}

/**
 * Draws a line of text centred on the canvas, shrinking the current font
 * until it fits inside the inner frame so titles never run off the edge.
 */
function fitText(ctx, text, y, maxWidth = 720) {
  const match = ctx.font.match(/(\d+)px/);
  let size = match ? parseInt(match[1], 10) : 72;
  while (ctx.measureText(text).width > maxWidth && size > 12) {
    size -= 2;
    ctx.font = ctx.font.replace(/\d+px/, `${size}px`);
  }
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillText(text, 512, y);
  ctx.restore();
}

/**
 * Small museum wall label: title, artist line and edition on a card.
 */
export function createWallLabelTexture(art) {
  const w = 512;
  const h = 200;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f4f2ec';
  ctx.fillRect(0, 0, w, h);

  ctx.fillStyle = '#121316';
  ctx.font = '800 34px "Syne", sans-serif';
  let size = 34;
  while (ctx.measureText(art.title).width > w - 64 && size > 14) {
    size -= 2;
    ctx.font = `800 ${size}px "Syne", sans-serif`;
  }
  ctx.fillText(art.title, 32, 70);

  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#4a4d55';
  ctx.fillText(`${art.artist} · ${art.year}`, 32, 112);

  ctx.font = '700 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillStyle = '#c1322a';
  const status = { sold: 'SOLD', wip: 'WORK IN PROGRESS · PREVIEW' }[art.status];
  ctx.fillText(status ?? `${art.subtitle}  ·  ${art.price}`, 32, 156);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

// Graphic Helpers for Brutalist Metal-Pop Aesthetics
function drawBrutalistDiamond(ctx, cx, cy, radius) {
  ctx.beginPath();
  ctx.moveTo(cx, cy - radius);
  ctx.lineTo(cx + radius, cy);
  ctx.lineTo(cx, cy + radius);
  ctx.lineTo(cx - radius, cy);
  ctx.closePath();
  ctx.stroke();
}

function drawGildedCrownGraphic(ctx, cx, cy, width, color) {
  const h = width * 0.45;
  const x = cx - width / 2;
  const y = cy - h / 2;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 14;
  ctx.lineJoin = 'miter';
  ctx.miterLimit = 10;
  ctx.beginPath();
  ctx.moveTo(x, y + h);
  ctx.lineTo(x, y);
  ctx.lineTo(x + width * 0.25, y + h * 0.55);
  ctx.lineTo(cx, y);
  ctx.lineTo(x + width * 0.75, y + h * 0.55);
  ctx.lineTo(x + width, y);
  ctx.lineTo(x + width, y + h);
  ctx.closePath();
  ctx.stroke();

  // Solid bottom band
  ctx.fillStyle = color;
  ctx.fillRect(x, y + h - 14, width, 14);
  ctx.restore();
}

function drawBrutalistCrossGraphic(ctx, cx, cy, size, color) {
  ctx.save();
  ctx.fillStyle = color;
  const arm = size * 0.18;
  // Vertical
  ctx.fillRect(cx - arm / 2, cy - size / 2, arm, size);
  // Horizontal
  ctx.fillRect(cx - size / 2, cy - size * 0.25, size, arm);
  ctx.restore();
}

function drawIndustrialBars(ctx, x, y, w, h, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  for (let i = 0; i < 7; i++) {
    const lx = x + (w / 6) * i;
    ctx.beginPath();
    ctx.moveTo(lx, y);
    ctx.lineTo(lx, y + h);
    ctx.stroke();
  }
  ctx.restore();
}

function drawCyberSprayCircle(ctx, cx, cy, r, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 12;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.65, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawBarbedWireGraphic(ctx, x, y, length, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 8;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + length, y);
  ctx.stroke();
  // Barbs
  for (let i = 0; i < 6; i++) {
    const bx = x + (length / 5) * i;
    ctx.beginPath();
    ctx.moveTo(bx - 16, y - 24);
    ctx.lineTo(bx + 16, y + 24);
    ctx.moveTo(bx + 16, y - 24);
    ctx.lineTo(bx - 16, y + 24);
    ctx.stroke();
  }
  ctx.restore();
}

function drawFineSprayDrips(ctx, startX, startY, count, color) {
  ctx.save();
  for (let i = 0; i < count; i++) {
    const dx = startX + i * 55;
    const len = 40 + Math.random() * 110;
    ctx.fillStyle = color;
    ctx.fillRect(dx, startY, 4, len);
    ctx.beginPath();
    ctx.arc(dx + 2, startY + len, 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

// Artwork canvas size in meters at scale 1 (used for both building and framing)
const ART_WIDTH = 2.3;
const ART_HEIGHT = 1.75;
// Screen layout (px) - must match RudeBoysMuseum.css:
// panel left 32px + width 360px + 40px breathing room
const PANEL_RIGHT_EDGE_PX = 32 + 360 + 40;
// Below this width the details become a bottom sheet (46% of height + strip)
const NARROW_LAYOUT_PX = 820;
const SHEET_HEIGHT_RATIO = 0.46;
const SHEET_BOTTOM_PX = 72;
const HEADER_PX = 72;
// Space kept clear on the right for the zoom buttons
const RIGHT_UI_MARGIN_PX = 90;

/*
 * Floor plan (meters, seen from above, entrance at the front):
 *
 *            back wall z = -13  (most expensive work, centre piece biggest)
 *   x = -9  +------------------------------------------+  x = 9
 *           |                                          |
 *   left    |          main gallery: rug + bench       |  right
 *   wall    |   pricier pieces sit further back        |  wall
 *           |                                          |
 *    z = 2  |- - - - - - - -+            +- - - - - - -|
 *           |   DORM ROOM   |            |   STUDIO    |
 *           | bed, decks,   |  entrance  | easel, desk |
 *           | rug, posters  |            | WIP pieces  |
 *   z = 9   +------------------------------------------+
 */
const ROOM = { minX: -9, maxX: 9, minZ: -13, maxZ: 9, height: 4.6 };
const DORM = { minX: -9, maxX: -3, minZ: 2, maxZ: 9 };
const STUDIO = { minX: 3, maxX: 9, minZ: 2, maxZ: 9 };
// Gallery side walls run from the dorm/studio edge to the back wall
const SIDE_WALL_FRONT_Z = 1.2;
const SIDE_WALL_BACK_Z = -12.2;
const WALL_INSET = 0.07;

const LEFT_NORMAL = new THREE.Vector3(1, 0, 0);
const RIGHT_NORMAL = new THREE.Vector3(-1, 0, 0);
const BACK_NORMAL = new THREE.Vector3(0, 0, 1);

/**
 * Decides where every artwork hangs and returns them in tour order.
 * Walking the tour keeps the next piece on the visitor's right:
 * dorm -> left wall (front to back) -> back wall (left to right)
 * -> right wall (back to front) -> studio work in progress.
 * Cheapest work is near the entrance, the most expensive at the back.
 */
export function layoutGallery(artworks) {
  const wip = artworks.filter((a) => a.status === 'wip');
  const forSale = artworks
    .filter((a) => a.status !== 'wip')
    .sort((a, b) => a.priceValue - b.priceValue);

  const n = forSale.length;
  const dormCount = n >= 4 ? 1 : 0;
  const backCount = Math.min(n - dormCount, Math.max(1, Math.round(n * 0.375)));
  const sideCount = n - dormCount - backCount;

  const dorm = forSale.slice(0, dormCount);
  const side = forSale.slice(dormCount, dormCount + sideCount);
  const back = forSale.slice(dormCount + sideCount);
  // Alternate sides so both walls get pricier toward the back
  const left = side.filter((_, i) => i % 2 === 0);
  const right = side.filter((_, i) => i % 2 === 1);

  const entries = [];

  dorm.forEach((data) => {
    entries.push({
      data,
      slot: { kind: 'wall', pos: new THREE.Vector3(ROOM.minX + WALL_INSET, 2.45, 5.6), normal: LEFT_NORMAL, scale: 0.8 },
    });
  });

  const sideSpan = SIDE_WALL_FRONT_Z - SIDE_WALL_BACK_Z;
  const sideZ = (i, count) => SIDE_WALL_FRONT_Z - (sideSpan * (i + 0.5)) / count;
  const sideScale = (count) => Math.min(1, sideSpan / count / 3.1);

  left.forEach((data, i) => {
    entries.push({
      data,
      slot: {
        kind: 'wall',
        pos: new THREE.Vector3(ROOM.minX + WALL_INSET, 2.15, sideZ(i, left.length)),
        normal: LEFT_NORMAL,
        scale: sideScale(left.length),
      },
    });
  });

  // Back wall: the priciest piece takes the centre, the rest spread outward
  const k = back.length;
  const backSpan = 16.4;
  const baseScale = Math.min(1.1, backSpan / Math.max(k, 1) / 3.2);
  const xs = Array.from({ length: k }, (_, j) => -backSpan / 2 + (backSpan * (j + 0.5)) / k);
  const byCentre = xs.map((x, j) => j).sort((a, b) => Math.abs(xs[a]) - Math.abs(xs[b]));
  const backDesc = [...back].sort((a, b) => b.priceValue - a.priceValue);
  const backSlots = new Array(k);
  byCentre.forEach((j, rank) => {
    const isTop = rank === 0;
    backSlots[j] = {
      data: backDesc[rank],
      slot: {
        kind: 'wall',
        pos: new THREE.Vector3(xs[j], isTop ? 2.3 : 2.15, ROOM.minZ + WALL_INSET),
        normal: BACK_NORMAL,
        scale: isTop ? baseScale * 1.15 : baseScale,
        featured: isTop,
      },
    };
  });
  entries.push(...backSlots);

  for (let i = right.length - 1; i >= 0; i--) {
    entries.push({
      data: right[i],
      slot: {
        kind: 'wall',
        pos: new THREE.Vector3(ROOM.maxX - WALL_INSET, 2.15, sideZ(i, right.length)),
        normal: RIGHT_NORMAL,
        scale: sideScale(right.length),
      },
    });
  }

  // Studio: first work in progress sits on the easel, the rest are pinned above the desk
  wip.forEach((data, i) => {
    if (i === 0) {
      entries.push({
        data,
        slot: {
          kind: 'easel',
          pos: new THREE.Vector3(5.4, 1.62, 4.4),
          normal: new THREE.Vector3(-1, 0, -0.45).normalize(),
          scale: 0.62,
        },
      });
      return;
    }
    const count = wip.length - 1;
    entries.push({
      data,
      slot: {
        kind: 'wall',
        pos: new THREE.Vector3(ROOM.maxX - WALL_INSET, 2.45, 5.9 + (2.6 * (i - 0.5)) / count),
        normal: RIGHT_NORMAL,
        scale: Math.min(0.55, 2.6 / count / 2.6),
      },
    });
  });

  return entries;
}

// ---------- small drawing and mesh helpers ----------

function canvasTexture(w, h, draw) {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  draw(canvas.getContext('2d'), w, h);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function mat(color, roughness = 0.8, metalness = 0) {
  return new THREE.MeshStandardMaterial({ color, roughness, metalness });
}

function box(w, h, d, material, x, y, z) {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

function cylinder(rTop, rBottom, h, material, x, y, z, segments = 24) {
  const mesh = new THREE.Mesh(new THREE.CylinderGeometry(rTop, rBottom, h, segments), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  return mesh;
}

/** Flat decal (poster, tag, sign) hung just off a wall, facing along `normal`. */
function decal(texture, w, h, pos, normal, { transparent = false, glow = false } = {}) {
  const material = glow
    ? new THREE.MeshBasicMaterial({ map: texture, transparent: true, toneMapped: false })
    : new THREE.MeshStandardMaterial({ map: texture, transparent, roughness: 0.9 });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(w, h), material);
  mesh.position.copy(pos);
  mesh.lookAt(pos.clone().add(normal));
  return mesh;
}

/** Rough spray-paint lettering with drips, on a transparent background. */
function drawTag(ctx, text, x, y, size, color, rotation = -0.08) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.font = `400 ${size}px "Anton", Impact, sans-serif`;
  ctx.fillStyle = color;
  for (let i = 0; i < 4; i++) {
    ctx.globalAlpha = 0.35;
    ctx.fillText(text, (Math.random() - 0.5) * size * 0.06, (Math.random() - 0.5) * size * 0.06);
  }
  ctx.globalAlpha = 1;
  ctx.fillText(text, 0, 0);
  const width = ctx.measureText(text).width;
  for (let i = 0; i < 9; i++) {
    const dx = Math.random() * width;
    ctx.fillRect(dx, -size * 0.05, size * 0.025, size * (0.15 + Math.random() * 0.5));
  }
  ctx.restore();
}

function splatter(ctx, w, h, colors, count) {
  for (let i = 0; i < count; i++) {
    ctx.fillStyle = colors[i % colors.length];
    ctx.globalAlpha = 0.55 + Math.random() * 0.4;
    const r = 2 + Math.random() * 14;
    ctx.beginPath();
    ctx.arc(Math.random() * w, Math.random() * h, r, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;
}

/** Raw canvas with pencil grid and half-blocked colour: art that isn't finished yet. */
function createWipTexture(art) {
  return canvasTexture(1024, 1024, (ctx, w, h) => {
    ctx.fillStyle = '#e9e1d0';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = 'rgba(40, 40, 40, 0.35)';
    ctx.lineWidth = 2;
    for (let i = 64; i < w; i += 128) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, h);
      ctx.moveTo(0, i);
      ctx.lineTo(w, i);
      ctx.stroke();
    }
    // Blocked-in colour on the left half only
    ctx.fillStyle = art.accentColor;
    ctx.fillRect(90, 140, 420, 520);
    ctx.fillStyle = '#0a0a0a';
    ctx.fillRect(180, 260, 300, 120);
    // Pencil outline of what's still to come
    ctx.strokeStyle = 'rgba(20, 20, 20, 0.7)';
    ctx.lineWidth = 4;
    ctx.strokeRect(540, 140, 380, 520);
    ctx.beginPath();
    ctx.arc(730, 400, 140, 0, Math.PI * 2);
    ctx.stroke();
    drawTag(ctx, 'RRUDE', 120, 860, 150, '#0a0a0a', -0.04);
    splatter(ctx, w, h, [art.accentColor, '#0a0a0a'], 40);
  });
}

function createLeaningArtTexture(seed) {
  const palettes = [
    ['#0a0a0a', '#d90a0a', '#ffffff'],
    ['#ffffff', '#0a0a0a', '#d90a0a'],
    ['#d90a0a', '#ffffff', '#0a0a0a'],
  ];
  const [bg, a, b] = palettes[seed % palettes.length];
  return canvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = a;
    ctx.beginPath();
    ctx.arc(w * 0.5, h * 0.42, w * 0.26, 0, Math.PI * 2);
    ctx.fill();
    drawTag(ctx, ['RR', 'BOY', 'NO'][seed % 3], 70, h * 0.88, 150, b, -0.1);
    splatter(ctx, w, h, [a, b], 18);
  });
}

// ---------- the experience ----------

/**
 * RRUDE BOY gallery: a real floor plan instead of a rotunda.
 * - Main hall with pricier work further back and the top piece centred on the back wall
 * - Dorm room corner (bed, skate decks, rug, posters, art scattered around)
 * - Studio corner with an easel and work-in-progress pieces visitors can preview
 * - When clicking artwork: frames it centered to the RIGHT; details at the LEFT
 */
export class RudeBoysMuseumExperience {
  constructor(containerElement, entries, onSelectArtwork) {
    this.container = containerElement;
    this.entries = entries;
    this.onSelectArtwork = onSelectArtwork;

    this.selectedArtworkIndex = null;
    this.artworks = [];
    this.cameraAnim = null;
    this.viewShift = 0; // current sideways image shift (px)
    this.targetViewShift = 0; // where the shift is easing toward (px)
    this.viewShiftY = 0; // current vertical image shift (px, positive = up)
    this.targetViewShiftY = 0;
    this.disposed = false;

    // Default overview: standing in the entrance, looking down the hall
    this.defaultCameraPos = new THREE.Vector3(0, 1.8, 8.2);
    this.defaultLookTarget = new THREE.Vector3(0, 1.7, -3);

    this.initScene();
    this.initRoom();
    this.initGalleryDecor();
    this.initDormRoom();
    this.initStudio();
    this.initArtworks();
    this.initInteractions();

    this.animate = this.animate.bind(this);
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0a);

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 80);
    this.camera.position.copy(this.defaultCameraPos);

    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;

    this.container.appendChild(this.renderer.domElement);

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.target.copy(this.defaultLookTarget);
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
    this.controls.minDistance = 1;
    this.controls.maxDistance = 12;
    this.controls.zoomSpeed = 1.1;

    const cancelAnim = () => {
      this.cameraAnim = null;
    };
    this.controls.addEventListener('start', cancelAnim);
    this.renderer.domElement.addEventListener('wheel', cancelAnim, { passive: true });
  }

  initRoom() {
    const { minX, maxX, minZ, maxZ, height } = ROOM;
    const width = maxX - minX;
    const depth = maxZ - minZ;
    const centreZ = (minZ + maxZ) / 2;

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x3a3530, 1.1));
    this.scene.add(new THREE.AmbientLight(0xffffff, 0.35));

    const sun = new THREE.DirectionalLight(0xfff4e6, 1.6);
    sun.position.set(6, 12, 6);
    sun.target.position.set(0, 0, -2);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -14;
    sun.shadow.camera.right = 14;
    sun.shadow.camera.top = 14;
    sun.shadow.camera.bottom = -14;
    sun.shadow.bias = -0.0004;
    this.scene.add(sun, sun.target);

    // Polished concrete floor
    const floorTex = canvasTexture(1024, 1024, (ctx, w, h) => {
      ctx.fillStyle = '#cfccc6';
      ctx.fillRect(0, 0, w, h);
      for (let i = 0; i < 9000; i++) {
        const v = 180 + Math.random() * 40;
        ctx.fillStyle = `rgba(${v}, ${v - 3}, ${v - 8}, 0.25)`;
        ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
      }
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.12)';
      ctx.lineWidth = 2;
      for (let i = 0; i <= w; i += 256) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, h);
        ctx.moveTo(0, i);
        ctx.lineTo(w, i);
        ctx.stroke();
      }
    });
    floorTex.wrapS = floorTex.wrapT = THREE.RepeatWrapping;
    floorTex.repeat.set(width / 6, depth / 6);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(width, depth),
      new THREE.MeshStandardMaterial({ map: floorTex, roughness: 0.42, metalness: 0.05 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, 0, centreZ);
    floor.receiveShadow = true;
    this.scene.add(floor);

    const ceilingMat = mat(0xffffff, 0.95);
    ceilingMat.emissive.set(0x8a8a88); // ceilings get little direct light; keep it gallery white
    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(width, depth), ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, height, centreZ);
    this.scene.add(ceiling);

    // Four walls, white gallery paint
    const wallMat = mat(0xf7f6f3, 0.95);
    const addWall = (w, x, z, rotY) => {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(w, height), wallMat);
      wall.position.set(x, height / 2, z);
      wall.rotation.y = rotY;
      wall.receiveShadow = true;
      this.scene.add(wall);
    };
    addWall(depth, minX, centreZ, Math.PI / 2);
    addWall(depth, maxX, centreZ, -Math.PI / 2);
    addWall(width, 0, minZ, 0);
    addWall(width, 0, maxZ, Math.PI);

    // Black skirting all round
    const skirt = mat(0x0a0a0a, 0.6);
    this.scene.add(
      box(0.04, 0.14, depth, skirt, minX + 0.02, 0.07, centreZ),
      box(0.04, 0.14, depth, skirt, maxX - 0.02, 0.07, centreZ),
      box(width, 0.14, 0.04, skirt, 0, 0.07, minZ + 0.02),
      box(width, 0.14, 0.04, skirt, 0, 0.07, maxZ - 0.02)
    );

    // Ceiling track lights
    const trackMat = mat(0x111111, 0.4, 0.6);
    [-10.5, -5.5, -0.5, 5].forEach((z) => {
      this.scene.add(box(width - 2, 0.05, 0.06, trackMat, 0, height - 0.12, z));
      for (let x = -7; x <= 7; x += 3.5) {
        const head = cylinder(0.07, 0.09, 0.22, trackMat, x, height - 0.26, z);
        head.rotation.x = 0.5;
        this.scene.add(head);
      }
    });
  }

  initGalleryDecor() {
    const { minX, maxX, minZ } = ROOM;

    // Big rug in the middle of the hall
    const rugTex = canvasTexture(1024, 680, (ctx, w, h) => {
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, w, h);
      ctx.strokeStyle = '#d90a0a';
      ctx.lineWidth = 28;
      ctx.strokeRect(40, 40, w - 80, h - 80);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 6;
      ctx.strokeRect(84, 84, w - 168, h - 168);
      ctx.strokeStyle = '#d90a0a';
      ctx.lineWidth = 10;
      ctx.beginPath();
      for (let x = 120; x <= w - 120; x += 60) {
        ctx.lineTo(x, x % 120 === 0 ? 150 : 200);
      }
      ctx.stroke();
      drawTag(ctx, 'RRUDE BOY', w * 0.2, h * 0.68, 200, '#ffffff', -0.05);
    });
    const rug = new THREE.Mesh(new THREE.PlaneGeometry(7.5, 5), new THREE.MeshStandardMaterial({ map: rugTex, roughness: 1 }));
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(0, 0.006, -5.5);
    rug.receiveShadow = true;
    this.scene.add(rug);

    // Long black bench on the rug
    const benchMat = mat(0x111111, 0.5, 0.2);
    this.scene.add(
      box(3, 0.12, 0.6, benchMat, 0, 0.46, -5.5),
      box(0.1, 0.4, 0.5, benchMat, -1.3, 0.2, -5.5),
      box(0.1, 0.4, 0.5, benchMat, 1.3, 0.2, -5.5)
    );

    // Red feature wall behind the centre piece + white neon
    this.scene.add(
      decal(
        canvasTexture(64, 64, (ctx) => {
          ctx.fillStyle = '#d90a0a';
          ctx.fillRect(0, 0, 64, 64);
        }),
        5.4,
        ROOM.height,
        new THREE.Vector3(0, ROOM.height / 2, minZ + 0.01),
        BACK_NORMAL
      )
    );
    const neon = canvasTexture(1024, 200, (ctx, w, h) => {
      ctx.font = '400 150px "Anton", Impact, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 30;
      ctx.fillStyle = '#ffffff';
      ctx.fillText('RRUDE BOY', w / 2, h / 2 + 6);
      ctx.fillText('RRUDE BOY', w / 2, h / 2 + 6);
    });
    this.neonTexture = neon;
    this.scene.add(decal(neon, 3.6, 0.7, new THREE.Vector3(0, 4.0, minZ + 0.03), BACK_NORMAL, { glow: true }));
    const neonGlow = new THREE.PointLight(0xffffff, 3, 6);
    neonGlow.position.set(0, 3.8, minZ + 0.8);
    this.scene.add(neonGlow);

    // Velvet rope in front of the centre piece
    const chrome = mat(0xdddddd, 0.15, 1);
    const ropeZ = minZ + 1.5;
    [-1.8, 1.8].forEach((x) => {
      this.scene.add(cylinder(0.035, 0.035, 0.95, chrome, x, 0.475, ropeZ), cylinder(0.18, 0.2, 0.04, chrome, x, 0.02, ropeZ));
    });
    const ropeCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-1.8, 0.88, ropeZ),
      new THREE.Vector3(0, 0.62, ropeZ),
      new THREE.Vector3(1.8, 0.88, ropeZ),
    ]);
    this.scene.add(new THREE.Mesh(new THREE.TubeGeometry(ropeCurve, 32, 0.03, 8), mat(0xb00808, 0.7)));

    // Plants in the back corners
    const potMat = mat(0x111111, 0.5);
    const leafMat = mat(0x2f5d34, 0.8);
    [
      [minX + 0.8, minZ + 0.8],
      [maxX - 0.8, minZ + 0.8],
    ].forEach(([x, z]) => {
      this.scene.add(cylinder(0.32, 0.26, 0.6, potMat, x, 0.3, z));
      for (let i = 0; i < 7; i++) {
        const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.32 + Math.random() * 0.12, 12, 10), leafMat);
        leaf.position.set(x + (Math.random() - 0.5) * 0.5, 0.95 + i * 0.22, z + (Math.random() - 0.5) * 0.5);
        leaf.scale.y = 1.3;
        leaf.castShadow = true;
        this.scene.add(leaf);
      }
    });

    // Red tape line running along both gallery walls, plus graffiti tags up high
    const tapeMat = new THREE.MeshStandardMaterial({ color: 0xd90a0a, roughness: 0.6 });
    const tapeLen = SIDE_WALL_FRONT_Z - minZ;
    const tapeZ = (SIDE_WALL_FRONT_Z + minZ) / 2;
    this.scene.add(
      box(0.01, 0.05, tapeLen, tapeMat, minX + 0.01, 0.95, tapeZ),
      box(0.01, 0.05, tapeLen, tapeMat, maxX - 0.01, 0.95, tapeZ)
    );
    const tag = (text, color) =>
      canvasTexture(1024, 300, (ctx) => drawTag(ctx, text, 40, 220, 190, color));
    this.scene.add(
      decal(tag('NO MASTERS', '#0a0a0a'), 3.2, 0.95, new THREE.Vector3(minX + 0.02, 3.95, -4.6), LEFT_NORMAL, { transparent: true }),
      decal(tag('RRUDE', '#d90a0a'), 2.6, 0.75, new THREE.Vector3(maxX - 0.02, 3.95, -8.5), RIGHT_NORMAL, { transparent: true }),
      decal(tag('LOUD ON PURPOSE', '#0a0a0a'), 3.6, 1.05, new THREE.Vector3(maxX - 0.02, 3.95, -1.6), RIGHT_NORMAL, { transparent: true })
    );
  }

  initDormRoom() {
    const { minX, maxX, minZ, maxZ } = DORM;
    const dormDepth = maxZ - minZ;
    const dormWidth = maxX - minX;

    // Charcoal walls so the corner reads as its own room
    const charcoal = canvasTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#1c1c1e';
      ctx.fillRect(0, 0, w, h);
      splatter(ctx, w, h, ['#2a2a2c', '#d90a0a'], 30);
    });
    this.scene.add(
      decal(charcoal, dormDepth, ROOM.height, new THREE.Vector3(minX + 0.01, ROOM.height / 2, (minZ + maxZ) / 2), LEFT_NORMAL),
      decal(charcoal, dormWidth, ROOM.height, new THREE.Vector3((minX + maxX) / 2, ROOM.height / 2, maxZ - 0.01), new THREE.Vector3(0, 0, -1))
    );

    // Wooden floor boards for the room
    const boards = canvasTexture(512, 512, (ctx, w) => {
      for (let i = 0; i < 8; i++) {
        const shade = 110 + Math.random() * 30;
        ctx.fillStyle = `rgb(${shade + 30}, ${shade}, ${shade - 30})`;
        ctx.fillRect(0, i * 64, w, 62);
      }
    });
    boards.wrapS = boards.wrapT = THREE.RepeatWrapping;
    boards.repeat.set(2, 2);
    const dormFloor = new THREE.Mesh(new THREE.PlaneGeometry(dormWidth, dormDepth), new THREE.MeshStandardMaterial({ map: boards, roughness: 0.7 }));
    dormFloor.rotation.x = -Math.PI / 2;
    dormFloor.position.set((minX + maxX) / 2, 0.003, (minZ + maxZ) / 2);
    dormFloor.receiveShadow = true;
    this.scene.add(dormFloor);

    // Round target rug
    const rugTex = canvasTexture(512, 512, (ctx, w) => {
      const colours = ['#d90a0a', '#ffffff', '#0a0a0a'];
      for (let r = 256, i = 0; r > 0; r -= 42, i++) {
        ctx.fillStyle = colours[i % 3];
        ctx.beginPath();
        ctx.arc(w / 2, w / 2, r, 0, Math.PI * 2);
        ctx.fill();
      }
    });
    const rug = new THREE.Mesh(new THREE.CircleGeometry(1.7, 48), new THREE.MeshStandardMaterial({ map: rugTex, roughness: 1 }));
    rug.rotation.x = -Math.PI / 2;
    rug.position.set(-5.6, 0.008, 5.6);
    rug.receiveShadow = true;
    this.scene.add(rug);

    // Bed against the wall, under the dorm piece
    this.scene.add(
      box(1.5, 0.32, 2.2, mat(0x3b2a1d, 0.7), -8.15, 0.16, 5.6),
      box(1.4, 0.22, 2.1, mat(0xf2f0ea, 0.9), -8.15, 0.43, 5.6),
      box(1.44, 0.07, 1.3, mat(0xb00808, 0.95), -8.15, 0.57, 6.05),
      box(0.9, 0.14, 0.4, mat(0xffffff, 0.9), -8.15, 0.6, 4.85)
    );

    // Skate decks mounted on the back wall of the room, one on the floor
    const deckShape = new THREE.Shape();
    deckShape.absarc(0, 0.29, 0.105, 0, Math.PI, false);
    deckShape.absarc(0, -0.29, 0.105, Math.PI, Math.PI * 2, false);
    const deckGeo = new THREE.ExtrudeGeometry(deckShape, { depth: 0.018, bevelEnabled: false });
    const deckColours = [0xd90a0a, 0xffffff, 0x0a0a0a, 0xd90a0a];
    deckColours.forEach((colour, i) => {
      const deck = new THREE.Mesh(deckGeo, [mat(colour, 0.5), mat(0x222222, 0.8)]);
      deck.position.set(-7.6 + i * 0.6, 2.0, maxZ - 0.05);
      deck.rotation.y = Math.PI;
      deck.rotation.z = (i - 1.5) * 0.06;
      deck.castShadow = true;
      this.scene.add(deck);
    });
    const floorDeck = new THREE.Group();
    const deck = new THREE.Mesh(deckGeo, [mat(0x0a0a0a, 0.8), mat(0x222222, 0.8)]);
    deck.rotation.x = -Math.PI / 2;
    deck.position.y = 0.1;
    floorDeck.add(deck);
    const wheelMat = mat(0xf5f5f5, 0.5);
    [-0.22, 0.22].forEach((z) => {
      floorDeck.add(box(0.2, 0.03, 0.05, mat(0x999999, 0.3, 0.9), 0, 0.075, z));
      [-0.09, 0.09].forEach((x) => {
        const wheel = cylinder(0.03, 0.03, 0.03, wheelMat, x, 0.03, z, 16);
        wheel.rotation.z = Math.PI / 2;
        floorDeck.add(wheel);
      });
    });
    floorDeck.position.set(-4.4, 0, 4.2);
    floorDeck.rotation.y = 0.9;
    this.scene.add(floorDeck);

    // Posters and a tag on the room walls
    const poster = (text, bg, fg) =>
      canvasTexture(400, 560, (ctx, w, h) => {
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, w, h);
        ctx.fillStyle = fg;
        ctx.font = '400 110px "Anton", Impact, sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text, w / 2, h * 0.55);
        ctx.font = '700 22px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('RRUDE BOY · DORM 4B', w / 2, h * 0.9);
      });
    const back = new THREE.Vector3(0, 0, -1);
    this.scene.add(
      decal(poster('SK8', '#ffffff', '#0a0a0a'), 0.7, 0.98, new THREE.Vector3(-4.3, 2.3, maxZ - 0.03), back),
      decal(poster('NO', '#d90a0a', '#ffffff'), 0.6, 0.84, new THREE.Vector3(-3.5, 1.7, maxZ - 0.03), back),
      decal(poster('RR', '#0a0a0a', '#d90a0a'), 0.6, 0.84, new THREE.Vector3(minX + 0.03, 2.2, 2.9), LEFT_NORMAL),
      decal(
        canvasTexture(1024, 300, (ctx) => drawTag(ctx, 'STAY RUDE', 40, 220, 180, '#ffffff')),
        3,
        0.9,
        new THREE.Vector3(minX + 0.03, 3.9, 5.6),
        LEFT_NORMAL,
        { transparent: true }
      )
    );

    // Art scattered around: canvases leaning on the walls and floor
    const leaning = [
      [-8.75, 3.3, LEFT_NORMAL, 0.7],
      [-8.7, 7.6, LEFT_NORMAL, 0.55],
      [-6.0, 8.75, back, 0.8],
      [-3.4, 8.75, back, 0.5],
    ];
    leaning.forEach(([x, z, normal, size], i) => {
      const canvas = new THREE.Mesh(
        new THREE.BoxGeometry(size, size, 0.04),
        [mat(0x222222), mat(0x222222), mat(0x222222), mat(0x222222), new THREE.MeshStandardMaterial({ map: createLeaningArtTexture(i) }), mat(0x222222)]
      );
      canvas.position.set(x, size / 2, z);
      canvas.lookAt(canvas.position.clone().add(normal));
      canvas.rotateX(-0.14);
      canvas.castShadow = true;
      this.scene.add(canvas);
    });

    // Mini fridge, bean bag and a crate of records
    this.scene.add(
      box(0.55, 0.85, 0.55, mat(0xeeeeee, 0.4), -3.5, 0.425, 8.55),
      box(0.45, 0.32, 0.4, mat(0x0a0a0a, 0.7), -8.6, 0.16, 7.6)
    );
    const beanBag = new THREE.Mesh(new THREE.SphereGeometry(0.55, 24, 16), mat(0xd90a0a, 0.95));
    beanBag.scale.set(1, 0.6, 1);
    beanBag.position.set(-5.2, 0.33, 6.7);
    beanBag.castShadow = true;
    this.scene.add(beanBag);

    // Warm string lights along the top of the room
    const bulbMat = new THREE.MeshBasicMaterial({ color: 0xffd28a });
    for (let z = minZ + 0.3; z < maxZ; z += 0.45) {
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), bulbMat);
      bulb.position.set(minX + 0.08, 4.15 - Math.sin((z - minZ) * 1.2) * 0.08, z);
      this.scene.add(bulb);
    }
    for (let x = minX + 0.3; x < maxX; x += 0.45) {
      const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.035, 8, 6), bulbMat);
      bulb.position.set(x, 4.15 - Math.sin((x - minX) * 1.2) * 0.08, maxZ - 0.08);
      this.scene.add(bulb);
    }
    const warm = new THREE.PointLight(0xffc27a, 6, 9);
    warm.position.set(-6, 3.4, 6);
    this.scene.add(warm);
  }

  initStudio() {
    const { maxX } = STUDIO;

    // Paint-splattered drop cloth
    const cloth = canvasTexture(512, 512, (ctx, w, h) => {
      ctx.fillStyle = '#d8cfbd';
      ctx.fillRect(0, 0, w, h);
      splatter(ctx, w, h, ['#d90a0a', '#0a0a0a', '#ffffff', '#3a6ea5'], 120);
    });
    const dropCloth = new THREE.Mesh(new THREE.PlaneGeometry(4.2, 4.6), new THREE.MeshStandardMaterial({ map: cloth, roughness: 1 }));
    dropCloth.rotation.x = -Math.PI / 2;
    dropCloth.rotation.z = 0.06;
    dropCloth.position.set(6.4, 0.007, 5.8);
    dropCloth.receiveShadow = true;
    this.scene.add(dropCloth);

    // Work desk against the right wall
    const wood = mat(0x8a6a4a, 0.7);
    const metal = mat(0x1a1a1a, 0.4, 0.7);
    const deskX = maxX - 0.45;
    this.scene.add(box(0.8, 0.06, 2.8, wood, deskX, 0.78, 7.1));
    [
      [-0.35, -1.3],
      [0.35, -1.3],
      [-0.35, 1.3],
      [0.35, 1.3],
    ].forEach(([dx, dz]) => this.scene.add(box(0.05, 0.75, 0.05, metal, deskX + dx, 0.375, 7.1 + dz)));

    // Paint cans, brush jar and a sketchbook on the desk
    [
      [0xd90a0a, 6.1],
      [0x0a0a0a, 6.35],
      [0xffffff, 6.6],
    ].forEach(([colour, z]) => this.scene.add(cylinder(0.09, 0.09, 0.16, mat(colour, 0.5, 0.3), deskX - 0.15, 0.89, z)));
    this.scene.add(cylinder(0.07, 0.06, 0.18, mat(0xaad4e6, 0.1), deskX + 0.1, 0.9, 7.0));
    for (let i = 0; i < 5; i++) {
      const brush = cylinder(0.008, 0.008, 0.36, mat(0x6b4a2a), deskX + 0.1 + (i - 2) * 0.012, 1.02, 7.0, 6);
      brush.rotation.z = (i - 2) * 0.1;
      this.scene.add(brush);
    }
    this.scene.add(box(0.32, 0.03, 0.44, mat(0x0a0a0a, 0.8), deskX - 0.1, 0.83, 7.8));

    // Clamp lamp
    const lampHead = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.2, 20, 1, true), mat(0x0a0a0a, 0.4, 0.5));
    lampHead.position.set(deskX - 0.1, 1.45, 8.2);
    lampHead.rotation.z = 0.5;
    this.scene.add(cylinder(0.012, 0.012, 0.65, metal, deskX + 0.1, 1.12, 8.2, 8), lampHead);
    const lamp = new THREE.PointLight(0xfff0d0, 3, 4);
    lamp.position.set(deskX - 0.2, 1.3, 8.0);
    this.scene.add(lamp);

    // Stool
    this.scene.add(cylinder(0.22, 0.22, 0.05, mat(0xd90a0a, 0.6), 7.6, 0.66, 6.6));
    [0, 1, 2].forEach((i) => {
      const a = (i / 3) * Math.PI * 2;
      this.scene.add(box(0.03, 0.64, 0.03, metal, 7.6 + Math.cos(a) * 0.14, 0.32, 6.6 + Math.sin(a) * 0.14));
    });

    // Sketches taped up on the wall above the desk
    const sketch = (seed) =>
      canvasTexture(256, 340, (ctx, w, h) => {
        ctx.fillStyle = '#fbfaf6';
        ctx.fillRect(0, 0, w, h);
        ctx.strokeStyle = 'rgba(30, 30, 30, 0.75)';
        ctx.lineWidth = 2;
        for (let i = 0; i < 14; i++) {
          ctx.beginPath();
          ctx.moveTo(Math.random() * w, Math.random() * h);
          ctx.quadraticCurveTo(Math.random() * w, Math.random() * h, Math.random() * w, Math.random() * h);
          ctx.stroke();
        }
        if (seed % 2) drawTag(ctx, 'RR', 30, 300, 90, '#d90a0a');
      });
    [
      [5.6, 3.3],
      [6.0, 1.5],
      [8.6, 3.4],
      [8.9, 1.55],
    ].forEach(([z, y], i) => {
      this.scene.add(decal(sketch(i), 0.4, 0.53, new THREE.Vector3(maxX - 0.02, y, z), RIGHT_NORMAL));
    });
    this.scene.add(
      decal(
        canvasTexture(1024, 200, (ctx) => {
          ctx.fillStyle = '#0a0a0a';
          ctx.font = '400 120px "Anton", Impact, sans-serif';
          ctx.fillText('WORK IN PROGRESS', 20, 140);
        }),
        2.2,
        0.43,
        new THREE.Vector3(maxX - 0.02, 3.95, 6.6),
        RIGHT_NORMAL,
        { transparent: true }
      )
    );
  }

  initArtworks() {
    this.artworks = this.entries.map(({ data, slot }, idx) => {
      const width = ART_WIDTH * slot.scale;
      const height = ART_HEIGHT * slot.scale;

      const group = new THREE.Group();
      group.position.copy(slot.pos);
      group.lookAt(slot.pos.clone().add(slot.normal));

      // Front face shows the art; the other faces are the stretched canvas edge
      const front =
        data.status === 'wip' && !data.imageUrl
          ? new THREE.MeshStandardMaterial({ map: createWipTexture(data), roughness: 0.9 })
          : new THREE.MeshStandardMaterial({ roughness: 0.65, metalness: 0.1 });
      if (data.status !== 'wip' || data.imageUrl) this.applyArtworkImage(data, front);
      const edge = mat(0x161616, 0.8);
      const canvasMesh = new THREE.Mesh(new THREE.BoxGeometry(width, height, 0.08), [edge, edge, edge, edge, front, edge]);
      canvasMesh.castShadow = true;
      canvasMesh.userData = { artworkIndex: idx };
      group.add(canvasMesh);

      // Frame: chrome for the featured back-wall piece, black otherwise
      const frameMat = slot.featured ? mat(0xd8d8d8, 0.2, 1) : mat(0x0a0a0a, 0.5);
      if (slot.kind === 'wall') {
        const frame = new THREE.Mesh(new THREE.BoxGeometry(width + 0.12, height + 0.12, 0.05), frameMat);
        frame.position.z = -0.03;
        group.add(frame);
      }

      if (data.status === 'sold') group.add(this.createSoldCross(width, height));

      // A real 3D scan replaces the flat canvas when the product has one
      if (data.modelUrl) this.loadArtworkModel(data.modelUrl, group, canvasMesh, width, height);

      if (slot.kind === 'easel') this.buildEasel(group, height);

      // Wall label beneath the piece
      const labelTexture = createWallLabelTexture(data);
      const plaqueMat = new THREE.MeshStandardMaterial({ map: labelTexture, roughness: 0.85 });
      const plaque = new THREE.Mesh(new THREE.PlaneGeometry(0.64, 0.25), plaqueMat);
      plaque.position.set(width / 2 - 0.32, -height / 2 - 0.26, 0.02);
      if (slot.kind === 'easel') plaque.position.set(width / 2 + 0.45, -height / 2 + 0.2, 0.05);
      group.add(plaque);

      // Web fonts may not be ready on first paint: redraw once they are
      if (document.fonts) {
        Promise.all([
          document.fonts.load('800 72px "Syne"'),
          document.fonts.load('400 72px "Anton"'),
          document.fonts.load('600 22px "Plus Jakarta Sans"'),
        ]).then(() => {
          if (this.disposed) return;
          if (front.map && front.map.image && !data.imageUrl && data.status !== 'wip') {
            createMetalPopArtworkTexture(data, front.map.image);
            front.map.needsUpdate = true;
          }
          plaqueMat.map = createWallLabelTexture(data);
          plaqueMat.needsUpdate = true;
          labelTexture.dispose();
        });
      }

      // Spotlight from the ceiling track, aimed at the piece
      const spot = new THREE.SpotLight(0xfff3e0, slot.featured ? 26 : 16, 9, 0.5, 0.45, 1.2);
      spot.position.copy(slot.pos).addScaledVector(slot.normal, 1.8);
      spot.position.y = ROOM.height - 0.25;
      spot.target = canvasMesh;
      this.scene.add(spot);

      this.scene.add(group);

      return {
        index: idx,
        data,
        group,
        mesh: canvasMesh,
        normal: slot.normal.clone(),
        width,
        height,
        pos: slot.pos.clone(),
      };
    });
  }

  /** Procedural art for the local catalogue, or the product photo from Shopify. */
  applyArtworkImage(data, material) {
    if (!data.imageUrl) {
      const texture = createMetalPopArtworkTexture(data);
      material.map = texture;
      material.needsUpdate = true;
      return;
    }
    material.color.set(0x222222);
    new THREE.TextureLoader().setCrossOrigin('anonymous').load(data.imageUrl, (texture) => {
      if (this.disposed) return;
      texture.colorSpace = THREE.SRGBColorSpace;
      material.map = texture;
      material.color.set(0xffffff);
      material.needsUpdate = true;
    });
  }

  async loadArtworkModel(url, group, canvasMesh, width, height) {
    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    new GLTFLoader().load(url, (gltf) => {
      if (this.disposed) return;
      const model = gltf.scene;
      // Fit the scan inside the canvas footprint, standing just off the wall
      const size = new THREE.Box3().setFromObject(model).getSize(new THREE.Vector3());
      const fit = Math.min(width / size.x, height / size.y);
      model.scale.setScalar(fit);
      const centre = new THREE.Box3().setFromObject(model).getCenter(new THREE.Vector3());
      model.position.sub(centre);
      model.position.z += (size.z * fit) / 2 + 0.05;
      model.traverse((child) => {
        if (child.isMesh) child.castShadow = true;
      });
      group.add(model);
      // Keep the canvas as an invisible click target
      canvasMesh.material = new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false });
    });
  }

  /** Red cross over a sold piece. */
  createSoldCross(width, height) {
    const cross = new THREE.Group();
    const length = Math.hypot(width, height) * 0.92;
    const angle = Math.atan2(height, width);
    const red = new THREE.MeshStandardMaterial({ color: 0xd90a0a, roughness: 0.5, emissive: 0x4a0000 });
    [angle, -angle].forEach((a) => {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(length, 0.09, 0.02), red);
      bar.rotation.z = a;
      bar.position.z = 0.06;
      cross.add(bar);
    });
    return cross;
  }

  buildEasel(group, canvasHeight) {
    const wood = mat(0x9a7650, 0.7);
    const bottom = -canvasHeight / 2;
    const legLength = 2.3;
    [-0.42, 0.42].forEach((x) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.05, legLength, 0.05), wood);
      leg.position.set(x, bottom - 1.62 + legLength / 2, -0.1);
      leg.rotation.z = -Math.sign(x) * 0.1;
      leg.castShadow = true;
      group.add(leg);
    });
    const backLeg = new THREE.Mesh(new THREE.BoxGeometry(0.05, legLength, 0.05), wood);
    backLeg.position.set(0, bottom - 1.62 + legLength / 2 - 0.05, -0.55);
    backLeg.rotation.x = -0.32;
    group.add(backLeg);
    const ledge = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.05, 0.14), wood);
    ledge.position.set(0, bottom - 0.03, 0.0);
    group.add(ledge);
  }

  initInteractions() {
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    let pointerStartX = 0;
    let pointerStartY = 0;
    let pointerStartTime = 0;

    const onPointerDown = (event) => {
      pointerStartX = event.clientX;
      pointerStartY = event.clientY;
      pointerStartTime = performance.now();
    };

    const onPointerUp = (event) => {
      const dx = event.clientX - pointerStartX;
      const dy = event.clientY - pointerStartY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const elapsed = performance.now() - pointerStartTime;

      if (dist > 7 || elapsed > 450) return; // ignore drags

      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      const interactable = this.artworks.map((a) => a.mesh);
      const intersects = this.raycaster.intersectObjects(interactable);

      if (intersects.length > 0) {
        const clickedIdx = intersects[0].object.userData.artworkIndex;
        if (clickedIdx !== undefined) {
          this.focusArtwork(clickedIdx);
        }
      }
    };

    this.renderer.domElement.addEventListener('pointerdown', onPointerDown);
    this.renderer.domElement.addEventListener('pointerup', onPointerUp);
  }

  /**
   * Focuses on an artwork:
   * Positions the camera so the artwork is framed and centered solidly
   * on the RIGHT half of the screen, leaving the left side open for the details card.
   */
  focusArtwork(index) {
    this.selectedArtworkIndex = index;
    const art = this.artworks[index];
    if (!art) return;

    // Work out where the free space on the RIGHT of the screen is (in pixels)
    const layout = this.getFocusLayout();

    // Pick a camera distance so the whole canvas fits inside that free space
    const t = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const H = this.container.clientHeight;
    // art uses ~62% of the free height (whole screen, or the area above the sheet)
    const distForHeight = (art.height * H) / (2 * t * 0.62 * layout.availHeight);
    const distForWidth = (art.width * H) / (2 * t * 0.86 * layout.availWidth); // ~86% of free width
    const viewDist = THREE.MathUtils.clamp(Math.max(distForHeight, distForWidth), 1.4, 7.0);

    // Camera sits straight in front of the artwork and looks at its center.
    // The "push to the right" is done by the view offset (see updateViewOffset),
    // so the art is never skewed or cropped.
    const lookTarget = art.pos.clone();
    const cameraPos = art.pos.clone().addScaledVector(art.normal, viewDist);

    this.targetViewShift = layout.shiftPx;
    this.targetViewShiftY = layout.shiftYPx;
    this.animateCameraTo(cameraPos, lookTarget, 800);

    if (this.onSelectArtwork) {
      this.onSelectArtwork(art.data);
    }
  }

  /**
   * Index of the artwork closest to the middle of the camera's view.
   */
  getFacingArtworkIndex() {
    const forward = this.camera.getWorldDirection(new THREE.Vector3());
    let bestIndex = 0;
    let bestDot = -Infinity;
    this.artworks.forEach((art, idx) => {
      const toArt = art.pos.clone().sub(this.camera.position).normalize();
      const dot = toArt.dot(forward);
      if (dot > bestDot) {
        bestDot = dot;
        bestIndex = idx;
      }
    });
    return bestIndex;
  }

  /**
   * Measures the empty area to the right of the details panel.
   * Returns how many pixels the image must slide right so the artwork's
   * center lands in the middle of that area.
   */
  getFocusLayout() {
    const W = this.container.clientWidth;
    const H = this.container.clientHeight;
    // Narrow screens: details sit in a bottom sheet, so frame the art above it
    if (W < NARROW_LAYOUT_PX) {
      const top = HEADER_PX;
      const bottom = H - SHEET_BOTTOM_PX - H * SHEET_HEIGHT_RATIO;
      return {
        shiftPx: 0,
        shiftYPx: H / 2 - (top + bottom) / 2,
        availWidth: W * 0.8,
        availHeight: Math.max(bottom - top, H * 0.25),
      };
    }
    const leftEdge = PANEL_RIGHT_EDGE_PX; // right edge of the glass panel + breathing room
    const rightEdge = W - RIGHT_UI_MARGIN_PX; // leave space for the zoom buttons
    const regionCenter = (leftEdge + rightEdge) / 2;
    return {
      shiftPx: regionCenter - W / 2,
      shiftYPx: 0,
      availWidth: rightEdge - leftEdge,
      availHeight: H,
    };
  }

  /**
   * Slides the rendered picture sideways without moving the camera.
   * setViewOffset renders a "window" of a larger virtual screen; moving that
   * window left by N pixels makes everything appear N pixels further right.
   */
  updateViewOffset() {
    const W = this.container.clientWidth;
    const H = this.container.clientHeight;
    if (Math.abs(this.viewShift) < 0.5 && Math.abs(this.viewShiftY) < 0.5) {
      if (this.camera.view && this.camera.view.enabled) {
        this.camera.clearViewOffset();
      }
      return;
    }
    this.camera.setViewOffset(W, H, -this.viewShift, this.viewShiftY, W, H);
  }

  exitFocus() {
    this.selectedArtworkIndex = null;
    this.targetViewShift = 0;
    this.targetViewShiftY = 0;
    this.animateCameraTo(this.defaultCameraPos, this.defaultLookTarget, 600);
    if (this.onSelectArtwork) {
      this.onSelectArtwork(null);
    }
  }

  animateCameraTo(targetPos, targetLookAt, duration = 600) {
    this.cameraAnim = {
      startTime: performance.now(),
      duration,
      startPos: this.camera.position.clone(),
      endPos: targetPos.clone(),
      startTarget: this.controls.target.clone(),
      endTarget: targetLookAt.clone(),
    };
  }

  zoomIn(step = 0.6) {
    const dir = new THREE.Vector3().subVectors(this.controls.target, this.camera.position).normalize();
    const currentDist = this.camera.position.distanceTo(this.controls.target);
    const newDist = Math.max(this.controls.minDistance, currentDist - step);
    const newPos = new THREE.Vector3().copy(this.controls.target).addScaledVector(dir, -newDist);
    this.animateCameraTo(newPos, this.controls.target, 320);
  }

  zoomOut(step = 0.8) {
    const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target).normalize();
    const currentDist = this.camera.position.distanceTo(this.controls.target);
    const newDist = Math.min(this.controls.maxDistance, currentDist + step);
    const newPos = new THREE.Vector3().copy(this.controls.target).addScaledVector(dir, newDist);
    this.animateCameraTo(newPos, this.controls.target, 320);
  }

  handleResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.renderer.setSize(width, height);
    // Re-measure the free space so the focused art stays on the right after resizing
    if (this.selectedArtworkIndex !== null) {
      const layout = this.getFocusLayout();
      this.targetViewShift = layout.shiftPx;
      this.viewShift = this.targetViewShift;
      this.targetViewShiftY = layout.shiftYPx;
      this.viewShiftY = this.targetViewShiftY;
    }
    this.updateViewOffset();
    this.camera.updateProjectionMatrix();
  }

  animate(currentTime) {
    this.animationFrameId = requestAnimationFrame(this.animate);

    if (this.cameraAnim) {
      const elapsed = currentTime - this.cameraAnim.startTime;
      const progress = Math.min(elapsed / this.cameraAnim.duration, 1.0);
      const ease = 1 - Math.pow(1 - progress, 3);

      this.camera.position.lerpVectors(this.cameraAnim.startPos, this.cameraAnim.endPos, ease);
      this.controls.target.lerpVectors(this.cameraAnim.startTarget, this.cameraAnim.endTarget, ease);

      if (progress >= 1.0) {
        this.camera.position.copy(this.cameraAnim.endPos);
        this.controls.target.copy(this.cameraAnim.endTarget);
        this.cameraAnim = null; // Yield full OrbitControls freedom!
      }
    }

    // Smoothly ease the sideways image shift toward its target
    const dx = this.targetViewShift - this.viewShift;
    const dy = this.targetViewShiftY - this.viewShiftY;
    if (Math.abs(dx) > 0.5 || Math.abs(dy) > 0.5) {
      this.viewShift += dx * 0.12;
      this.viewShiftY += dy * 0.12;
      this.updateViewOffset();
    } else if (dx !== 0 || dy !== 0) {
      this.viewShift = this.targetViewShift;
      this.viewShiftY = this.targetViewShiftY;
      this.updateViewOffset();
    }

    this.controls.update();
    // Keep the camera inside the building
    const p = this.camera.position;
    p.x = THREE.MathUtils.clamp(p.x, ROOM.minX + 0.4, ROOM.maxX - 0.4);
    p.z = THREE.MathUtils.clamp(p.z, ROOM.minZ + 0.4, ROOM.maxZ - 0.4);
    p.y = THREE.MathUtils.clamp(p.y, 0.4, ROOM.height - 0.3);
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    this.disposed = true;
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.handleResize);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
    this.renderer.dispose();
  }
}
