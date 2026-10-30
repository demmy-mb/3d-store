import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Curated Metal-Pop / High-Fashion Street Artworks for the RUDE BOYS Rotunda
 */
export const RUDE_BOYS_ARTWORKS = [
  {
    id: 'art-01',
    title: 'CHROME REVOLT',
    subtitle: 'RUDE BOYS № 01',
    year: '2026',
    medium: 'Liquid chrome aerosol, industrial lacquer, and oil stick on primed Belgian linen',
    dimensions: '200 × 160 cm',
    artist: 'Atelier Rude Boys / Archive',
    edition: '1 of 1 · Original Masterpiece',
    price: '$24,000 USD',
    description:
      'A ferocious collision of heavy-metal typography and liquid mirror spray. The central jagged chrome insignia pierces through deep carbon blacks, interrogating commercial rebellion in high luxury.',
    accentColor: '#e0e0e0',
  },
  {
    id: 'art-02',
    title: 'ANARCHY IN GOLD',
    subtitle: 'RUDE BOYS № 02',
    year: '2026',
    medium: '24K gold foil leaf, matte spray enamel, and tar drips on circular aluminum board',
    dimensions: '180 × 180 cm',
    artist: 'Atelier Rude Boys / Archive',
    edition: '1 of 1 · Original Masterpiece',
    price: '$28,500 USD',
    description:
      'Hand-gilded street emblems fractured by thick matte asphalt strokes. An aggressive yet royal aesthetic inspired by deconstructed coronation regalia and underground subcultures.',
    accentColor: '#d4af37',
  },
  {
    id: 'art-03',
    title: 'HEAVY METAL SAINTS',
    subtitle: 'RUDE BOYS № 03',
    year: '2026',
    medium: 'Aerosol pigment, screenprint emulsion, and wax crayon on raw canvas',
    dimensions: '210 × 150 cm',
    artist: 'Atelier Rude Boys / Archive',
    edition: '1 of 1 · Original Masterpiece',
    price: '$21,000 USD',
    description:
      'Gothic blackletter forms spray-painted over stark architectural silhouettes. Drips of crimson pigment trace downward like stained glass in a subterranean sanctuary.',
    accentColor: '#b82a24',
  },
  {
    id: 'art-04',
    title: 'TITANIUM RIOT',
    subtitle: 'RUDE BOYS № 04',
    year: '2026',
    medium: 'Brushed titanium dust, acrylic transfer, and charcoal on steel panel',
    dimensions: '190 × 130 cm',
    artist: 'Atelier Rude Boys / Archive',
    edition: '1 of 1 · Original Masterpiece',
    price: '$19,500 USD',
    description:
      'A metallic composition exploring post-industrial tension. Razor-sharp geometric incisions cross hand-scrawled manifestos of sonic youth culture.',
    accentColor: '#4a90e2',
  },
  {
    id: 'art-05',
    title: 'SUBWAY GHOSTS: 03:00 AM',
    subtitle: 'RUDE BOYS № 05',
    year: '2026',
    medium: 'Distressed vinyl wheatpaste, soot pigment, and neon acrylic on heavy canvas',
    dimensions: '200 × 160 cm',
    artist: 'Atelier Rude Boys / Archive',
    edition: '1 of 1 · Original Masterpiece',
    price: '$22,000 USD',
    description:
      'Layered train-yard stencils peeling back to reveal electric cyan and shocking vermilion underpaintings. Captures the ephemeral rush of nighttime tagging.',
    accentColor: '#00d2be',
  },
  {
    id: 'art-06',
    title: 'BARBED VELVET',
    subtitle: 'RUDE BOYS № 06',
    year: '2026',
    medium: 'Textured velvet flocking, chrome marker, and oil bar on distressed linen',
    dimensions: '180 × 140 cm',
    artist: 'Atelier Rude Boys / Archive',
    edition: '1 of 1 · Original Masterpiece',
    price: '$18,500 USD',
    description:
      'Tactile contrast between soft couture velvet and violent barbed-wire geometry. The surface shifts dynamically as gallery spotlights sweep across its nap.',
    accentColor: '#8c2496',
  },
  {
    id: 'art-07',
    title: 'RAW DISPATCH // NO MASTERS',
    subtitle: 'RUDE BOYS № 07',
    year: '2026',
    medium: 'Aerosol stencil, torn billboard paper, and gloss resin on concrete composite',
    dimensions: '220 × 160 cm',
    artist: 'Atelier Rude Boys / Archive',
    edition: '1 of 1 · Original Masterpiece',
    price: '$26,000 USD',
    description:
      'Monumental manifesto typography encased in crystal-clear resin blocks. A tactile archive of the voice of the streets preserved like ancient Roman inscriptions.',
    accentColor: '#f39c12',
  },
  {
    id: 'art-08',
    title: 'CONCRETE HALO: REBEL CUT',
    subtitle: 'RUDE BOYS № 08',
    year: '2026',
    medium: 'Graphite dust, industrial sealant, and gold leaf on primed cotton duck',
    dimensions: '190 × 150 cm',
    artist: 'Atelier Rude Boys / Archive',
    edition: '1 of 1 · Original Masterpiece',
    price: '$20,500 USD',
    description:
      'Garment pattern cut-lines and tailoring measurement grids tagged with golden graffiti crowns. The bridge between bespoke atelier tailoring and raw street culture.',
    accentColor: '#e74c3c',
  },
];

/**
 * Procedurally generates high-impact Dark Metal-Pop / Graffiti Canvas Artworks
 */
export function createMetalPopArtworkTexture(index) {
  const size = 1024;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  const art = RUDE_BOYS_ARTWORKS[index];

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
    ctx.font = '900 82px "Syne", sans-serif';
    ctx.fillText('CHROME', 220, 520);
    ctx.fillStyle = art.accentColor;
    ctx.fillText('REVOLT', 220, 600);

    ctx.font = '700 24px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.fillText('HEAVY METAL ATELIER // ARCHIVE 01', 225, 660);
  } else if (index === 1) {
    // "ANARCHY IN GOLD"
    drawGildedCrownGraphic(ctx, 512, 360, 280, art.accentColor);

    ctx.fillStyle = '#ffffff';
    ctx.font = '900 76px "Syne", sans-serif';
    ctx.fillText('ROYAL ANARCHY', 180, 560);
    ctx.font = '700 24px monospace';
    ctx.fillStyle = art.accentColor;
    ctx.fillText('24K DECONSTRUCTED REGALIA', 185, 620);
  } else if (index === 2) {
    // "HEAVY METAL SAINTS"
    drawBrutalistCrossGraphic(ctx, 512, 400, 320, art.accentColor);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 84px "Syne", sans-serif';
    ctx.fillText('SAINTS', 320, 680);
  } else if (index === 3) {
    // "TITANIUM RIOT"
    drawIndustrialBars(ctx, 200, 260, 624, 280, art.accentColor);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 78px "Syne", sans-serif';
    ctx.fillText('TITANIUM RIOT', 180, 580);
  } else if (index === 4) {
    // "SUBWAY GHOSTS"
    drawCyberSprayCircle(ctx, 512, 420, 220, art.accentColor);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 72px "Syne", sans-serif';
    ctx.fillText('SUBWAY GHOSTS', 200, 540);
    ctx.font = '700 26px monospace';
    ctx.fillStyle = art.accentColor;
    ctx.fillText('03:00 AM // NIGHT YARDS', 205, 600);
  } else if (index === 5) {
    // "BARBED VELVET"
    drawBarbedWireGraphic(ctx, 160, 420, 704, art.accentColor);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 76px "Syne", sans-serif';
    ctx.fillText('BARBED VELVET', 180, 580);
  } else if (index === 6) {
    // "RAW DISPATCH"
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 84px "Syne", sans-serif';
    ctx.fillText('NO MASTERS', 180, 440);
    ctx.fillStyle = art.accentColor;
    ctx.fillText('RAW DISPATCH', 180, 530);
    ctx.fillRect(180, 570, 520, 8);
  } else {
    // "CONCRETE HALO"
    drawGildedCrownGraphic(ctx, 512, 380, 240, art.accentColor);
    ctx.fillStyle = '#ffffff';
    ctx.font = '900 74px "Syne", sans-serif';
    ctx.fillText('CONCRETE HALO', 190, 560);
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

// Artwork canvas size in meters (used for both building and framing)
const ART_WIDTH = 2.3;
const ART_HEIGHT = 1.75;
// Screen layout (px) - must match RudeBoysMuseum.css:
// panel left 44px + width 350px + 40px breathing room
const PANEL_RIGHT_EDGE_PX = 44 + 350 + 40;
// Space kept clear on the right for the zoom buttons
const RIGHT_UI_MARGIN_PX = 90;

/**
 * CIRCULAR ROTUNDA 3D MUSEUM & ART GALLERY EXPERIENCE
 * - True circular architectural museum (Rotunda)
 * - Skylights (skyholes) allowing natural sunlight into the rotunda
 * - Bright museum white walls and polished terrazzo floor
 * - Artworks positioned radially along the circular wall
 * - When clicking artwork: frames it centered to the RIGHT; details at the LEFT
 */
export class RudeBoysMuseumExperience {
  constructor(containerElement, onSelectArtwork) {
    this.container = containerElement;
    this.onSelectArtwork = onSelectArtwork;

    this.selectedArtworkIndex = null;
    this.artworks = [];
    this.lastTime = performance.now();
    this.cameraAnim = null;
    this.viewShift = 0; // current sideways image shift (px)
    this.targetViewShift = 0; // where the shift is easing toward (px)

    // Default overview looking across the circular rotunda
    this.defaultCameraPos = new THREE.Vector3(0, 1.8, 4.8);
    this.defaultLookTarget = new THREE.Vector3(0, 1.8, 0);

    this.initScene();
    this.initCircularRotunda();
    this.initRadialArtworks();
    this.initInteractions();

    this.animate = this.animate.bind(this);
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  initScene() {
    this.scene = new THREE.Scene();
    // Bright modern museum white ambience
    this.scene.background = new THREE.Color(0xfcfbfa);
    this.scene.fog = new THREE.Fog(0xfcfbfa, 16, 32);

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 60);
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
    this.renderer.toneMappingExposure = 1.15;

    this.container.appendChild(this.renderer.domElement);

    // Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.copy(this.defaultLookTarget);
    this.controls.maxPolarAngle = Math.PI / 2 + 0.02; // prevent dipping below floor
    this.controls.minDistance = 1.2;
    this.controls.maxDistance = 9.5; // bounded so users can zoom out cleanly without getting lost
    this.controls.zoomSpeed = 1.2;

    const cancelAnim = () => {
      this.cameraAnim = null;
    };
    this.controls.addEventListener('start', cancelAnim);
    this.renderer.domElement.addEventListener('wheel', cancelAnim, { passive: true });
  }

  initCircularRotunda() {
    const radius = 8.6;
    const height = 5.8;

    // 1. Natural Skyholes & Museum Daylight Lighting
    // Ambient natural gallery bounce
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.25);
    this.scene.add(ambientLight);

    // Central Sun Shaft shining directly down through the Oculus (Center Skylight)
    const oculusSun = new THREE.DirectionalLight(0xfffaee, 2.6);
    oculusSun.position.set(0, 10, 0);
    oculusSun.castShadow = true;
    oculusSun.shadow.mapSize.width = 2048;
    oculusSun.shadow.mapSize.height = 2048;
    oculusSun.shadow.bias = -0.0003;
    this.scene.add(oculusSun);

    // Soft angled sun for dynamic wall highlights
    const angleSun = new THREE.DirectionalLight(0xf4f7ff, 1.4);
    angleSun.position.set(4, 9, 3);
    this.scene.add(angleSun);

    // 2. Continuous Circular Wall (128 smooth segments - zero polygonal facet)
    // Pure museum architectural white
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      metalness: 0.0,
      side: THREE.BackSide, // Visible from inside the circular room
    });

    const cylinderGeo = new THREE.CylinderGeometry(radius, radius, height, 128, 1, true);
    const wallMesh = new THREE.Mesh(cylinderGeo, wallMat);
    wallMesh.position.set(0, height / 2, 0);
    wallMesh.receiveShadow = true;
    this.scene.add(wallMesh);

    // 3. Polished Museum Terrazzo Circular Floor
    const floorGeo = new THREE.CircleGeometry(radius, 128);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf5f4f0, // bright white polished stone
      roughness: 0.28,
      metalness: 0.06,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // 4. Ceiling with Architectural Skylights (Oculus & Radial Skyholes)
    // Central circular skylight ring (Oculus)
    const oculusRadius = 2.4;
    const ceilingShape = new THREE.Shape();
    // Outer boundary
    ceilingShape.absarc(0, 0, radius, 0, Math.PI * 2, false);
    // Cut out central skyhole (Oculus)
    const oculusHole = new THREE.Path();
    oculusHole.absarc(0, 0, oculusRadius, 0, Math.PI * 2, true);
    ceilingShape.holes.push(oculusHole);

    // Cut out 4 smaller satellite skyholes around the perimeter
    for (let s = 0; s < 4; s++) {
      const angle = (s * Math.PI) / 2 + Math.PI / 4;
      const sx = Math.cos(angle) * 5.4;
      const sy = Math.sin(angle) * 5.4;
      const satHole = new THREE.Path();
      satHole.absarc(sx, sy, 0.75, 0, Math.PI * 2, true);
      ceilingShape.holes.push(satHole);
    }

    const ceilingGeo = new THREE.ShapeGeometry(ceilingShape, 64);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      side: THREE.DoubleSide,
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.set(0, height, 0);
    this.scene.add(ceiling);

    // Architectural Oculus Skylight Bevel Frame
    const oculusRimGeo = new THREE.TorusGeometry(oculusRadius, 0.08, 16, 64);
    const rimMat = new THREE.MeshStandardMaterial({ color: 0x18191c, metalness: 0.8, roughness: 0.2 });
    const oculusRim = new THREE.Mesh(oculusRimGeo, rimMat);
    oculusRim.rotation.x = Math.PI / 2;
    oculusRim.position.set(0, height - 0.02, 0);
    this.scene.add(oculusRim);

    // Natural Sky Dome Visible above the skyholes
    const skyGeo = new THREE.SphereGeometry(18, 32, 16);
    const skyMat = new THREE.MeshBasicMaterial({
      color: 0xe8f0fe,
      side: THREE.BackSide,
    });
    const skyDome = new THREE.Mesh(skyGeo, skyMat);
    skyDome.position.set(0, height + 4, 0);
    this.scene.add(skyDome);

    // Sun Pool on Floor (A glowing soft disc where sunlight lands under the skylight)
    const sunPoolGeo = new THREE.CircleGeometry(oculusRadius * 1.05, 48);
    const sunPoolMat = new THREE.MeshBasicMaterial({
      color: 0xfffaea,
      transparent: true,
      opacity: 0.35,
    });
    const sunPool = new THREE.Mesh(sunPoolGeo, sunPoolMat);
    sunPool.rotation.x = -Math.PI / 2;
    sunPool.position.set(0, 0.002, 0);
    this.scene.add(sunPool);

    // Circular Black Lighting Track hanging below ceiling
    const trackRingGeo = new THREE.TorusGeometry(6.4, 0.035, 16, 128);
    const trackRing = new THREE.Mesh(trackRingGeo, rimMat);
    trackRing.rotation.x = Math.PI / 2;
    trackRing.position.set(0, height - 0.45, 0);
    this.scene.add(trackRing);
  }

  initRadialArtworks() {
    const wallRadius = 8.52; // slightly inside cylinder radius
    const count = RUDE_BOYS_ARTWORKS.length; // 8 artworks

    this.artworks = RUDE_BOYS_ARTWORKS.map((data, idx) => {
      // Position evenly in a circle around the gallery
      const angle = (idx / count) * Math.PI * 2;
      const x = Math.sin(angle) * wallRadius;
      const z = Math.cos(angle) * wallRadius;
      const y = 2.3; // eye-level museum hanging height

      const artGroup = new THREE.Group();
      artGroup.position.set(x, y, z);
      // Face inward toward center of the room
      artGroup.rotation.y = angle + Math.PI;

      // 1. Procedural Metal-Pop Canvas Texture
      const texture = createMetalPopArtworkTexture(idx);
      const canvasMat = new THREE.MeshStandardMaterial({
        map: texture,
        roughness: 0.65,
        metalness: 0.15,
      });

      // 2. Heavy Gallery Stretched Canvas Box
      const canvasWidth = ART_WIDTH;
      const canvasHeight = ART_HEIGHT;
      const canvasGeo = new THREE.BoxGeometry(canvasWidth, canvasHeight, 0.09);
      const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
      canvasMesh.castShadow = true;
      canvasMesh.receiveShadow = true;
      canvasMesh.userData = { artworkIndex: idx };
      artGroup.add(canvasMesh);

      // 3. Subtle Museum Wall Plaque beneath canvas
      const plaqueGeo = new THREE.PlaneGeometry(0.36, 0.14);
      const plaqueMat = new THREE.MeshStandardMaterial({
        color: 0x141518,
        roughness: 0.3,
        metalness: 0.8,
      });
      const plaque = new THREE.Mesh(plaqueGeo, plaqueMat);
      plaque.position.set(0, -canvasHeight / 2 - 0.2, 0.05);
      artGroup.add(plaque);

      // 4. Dedicated Spotlights from the circular ceiling track
      const spotLight = new THREE.SpotLight(0xfff5e4, 2.8);
      // Positioned on the track ring at radius 6.4
      spotLight.position.set(Math.sin(angle) * 6.2, 5.3, Math.cos(angle) * 6.2);
      spotLight.target = canvasMesh;
      spotLight.angle = 0.42;
      spotLight.penumbra = 0.4;
      spotLight.castShadow = true;
      this.scene.add(spotLight);

      this.scene.add(artGroup);

      return {
        index: idx,
        data,
        group: artGroup,
        mesh: canvasMesh,
        angle,
        pos: new THREE.Vector3(x, y, z),
      };
    });
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

    const angle = art.angle;
    // Inward normal (from the wall toward the room center)
    const normal = new THREE.Vector3(-Math.sin(angle), 0, -Math.cos(angle));

    // Work out where the free space on the RIGHT of the screen is (in pixels)
    const layout = this.getFocusLayout();

    // Pick a camera distance so the whole canvas fits inside that free space
    const t = Math.tan(THREE.MathUtils.degToRad(this.camera.fov / 2));
    const H = this.container.clientHeight;
    const distForHeight = (ART_HEIGHT * 1.0) / (2 * t * 0.62); // art uses ~62% of screen height
    const distForWidth = (ART_WIDTH * H) / (2 * t * 0.86 * layout.availWidth); // ~86% of free width
    const viewDist = THREE.MathUtils.clamp(Math.max(distForHeight, distForWidth), 2.2, 7.0);

    // Camera sits straight in front of the artwork and looks at its center.
    // The "push to the right" is done by the view offset (see updateViewOffset),
    // so the art is never skewed or cropped.
    const lookTarget = art.pos.clone();
    const cameraPos = art.pos.clone().addScaledVector(normal, viewDist);

    this.targetViewShift = layout.shiftPx;
    this.animateCameraTo(cameraPos, lookTarget, 700);

    if (this.onSelectArtwork) {
      this.onSelectArtwork(art.data);
    }
  }

  /**
   * Measures the empty area to the right of the details panel.
   * Returns how many pixels the image must slide right so the artwork's
   * center lands in the middle of that area.
   */
  getFocusLayout() {
    const W = this.container.clientWidth;
    // Narrow screens: panel covers most of the view, so just center the art
    if (W < 820) {
      return { shiftPx: 0, availWidth: W * 0.9 };
    }
    const leftEdge = PANEL_RIGHT_EDGE_PX; // right edge of the glass panel + breathing room
    const rightEdge = W - RIGHT_UI_MARGIN_PX; // leave space for the zoom buttons
    const regionCenter = (leftEdge + rightEdge) / 2;
    return {
      shiftPx: regionCenter - W / 2,
      availWidth: rightEdge - leftEdge,
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
    if (Math.abs(this.viewShift) < 0.5) {
      if (this.camera.view && this.camera.view.enabled) {
        this.camera.clearViewOffset();
      }
      return;
    }
    this.camera.setViewOffset(W, H, -this.viewShift, 0, W, H);
  }

  exitFocus() {
    this.selectedArtworkIndex = null;
    this.targetViewShift = 0;
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
      this.targetViewShift = this.getFocusLayout().shiftPx;
      this.viewShift = this.targetViewShift;
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
    if (Math.abs(this.targetViewShift - this.viewShift) > 0.5) {
      this.viewShift += (this.targetViewShift - this.viewShift) * 0.12;
      this.updateViewOffset();
    } else if (this.viewShift !== this.targetViewShift) {
      this.viewShift = this.targetViewShift;
      this.updateViewOffset();
    }

    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

  destroy() {
    cancelAnimationFrame(this.animationFrameId);
    window.removeEventListener('resize', this.handleResize);
    if (this.renderer && this.renderer.domElement) {
      this.renderer.domElement.remove();
    }
  }
}
