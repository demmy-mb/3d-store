import * as THREE from 'three';

/**
 * Creates a seamless procedural cotton fabric normal map.
 * This gives the blank t-shirt micro-detail (knit weave) without needing external image downloads.
 */
export function createFabricTexture() {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  // Fill with neutral normal color (RGB: 128, 128, 255 -> pointing straight out)
  const imgData = ctx.createImageData(size, size);
  const data = imgData.data;

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const idx = (y * size + x) * 4;
      
      // Knit weave pattern: interlocking diagonal threads
      const freq = 0.35;
      const wave1 = Math.sin(x * freq + y * freq * 0.5);
      const wave2 = Math.cos(x * freq * 0.5 - y * freq);
      const noise = (Math.random() - 0.5) * 0.15;
      
      const nx = (wave1 * 0.35 + noise) * 127 + 128;
      const ny = (wave2 * 0.35 + noise) * 127 + 128;
      const nz = 230;

      data[idx] = Math.max(0, Math.min(255, nx));
      data[idx + 1] = Math.max(0, Math.min(255, ny));
      data[idx + 2] = nz;
      data[idx + 3] = 255;
    }
  }

  ctx.putImageData(imgData, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 24);
  texture.needsUpdate = true;
  return texture;
}

/**
 * Procedurally generates a draped, tailored oversized T-shirt geometry
 * with 8-bone skinning indices and weights.
 */
export function createTShirtGeometry() {
  // Grid resolution across torso and sleeves
  const xRes = 36;
  const yRes = 44;

  const positions = [];
  const normals = [];
  const uvs = [];
  const skinIndices = [];
  const skinWeights = [];
  const indices = [];

  // Bone reference positions (local coordinate system, root at hanger hook)
  // Bone 0: Hook / Neck Root (0, 0, 0)
  // Bone 1: Chest (0, -0.22, 0)
  // Bone 2: Mid Torso (0, -0.48, 0)
  // Bone 3: Hem Center (0, -0.76, 0)
  // Bone 4: Left Shoulder & Sleeve (-0.28, -0.22, 0)
  // Bone 5: Right Shoulder & Sleeve (0.28, -0.22, 0)
  // Bone 6: Left Hem (-0.22, -0.76, 0)
  // Bone 7: Right Hem (0.22, -0.76, 0)
  const bonePositions = [
    new THREE.Vector3(0, 0, 0),         // 0: Root/Hook
    new THREE.Vector3(0, -0.22, 0),      // 1: Chest
    new THREE.Vector3(0, -0.48, 0),      // 2: Mid Torso
    new THREE.Vector3(0, -0.76, 0),      // 3: Hem Center
    new THREE.Vector3(-0.28, -0.22, 0),  // 4: Sleeve Left
    new THREE.Vector3(0.28, -0.22, 0),   // 5: Sleeve Right
    new THREE.Vector3(-0.22, -0.76, 0),  // 6: Hem Left
    new THREE.Vector3(0.22, -0.76, 0),   // 7: Hem Right
  ];

  // Helper to compute vertex profile
  // v parameter goes from 0 (collar) to 1 (hem)
  // u parameter goes around the body (0 to 1)
  for (let j = 0; j <= yRes; j++) {
    const v = j / yRes;
    const y = -0.14 - v * 0.64; // y from -0.14 to -0.78

    // Width flare at sleeves and drape
    let halfWidth;
    let halfDepth;

    if (v < 0.25) {
      // Shoulder & Sleeve zone: wide
      const sProgress = v / 0.25;
      halfWidth = 0.20 + (1 - sProgress) * 0.08 + sProgress * 0.18; // 0.28 at shoulders
      halfDepth = 0.045 + Math.sin(v * Math.PI) * 0.03;
    } else if (v < 0.45) {
      // Transition from sleeve armpit to chest
      const t = (v - 0.25) / 0.20;
      halfWidth = THREE.MathUtils.lerp(0.38, 0.25, t);
      halfDepth = 0.065 - t * 0.01;
    } else {
      // Main torso down to hem: clean relaxed drop with slight flare at bottom
      const t = (v - 0.45) / 0.55;
      halfWidth = 0.25 + t * 0.025;
      halfDepth = 0.055 + Math.sin(t * Math.PI) * 0.015;
    }

    for (let i = 0; i <= xRes; i++) {
      const u = i / xRes;
      const angle = u * Math.PI * 2;

      // Elliptical cross section with subtle fabric folds & drapery ripple
      const cosA = Math.cos(angle);
      const sinA = Math.sin(angle);

      // Micro folds: subtle organic ripples along the sides and front
      const foldNoise = Math.sin(u * Math.PI * 8 + v * 6) * 0.006 * (v > 0.3 ? 1 : 0.4);
      const x = cosA * halfWidth + foldNoise;
      const z = sinA * halfDepth + Math.sin(v * 8 + u * 4) * 0.004;

      positions.push(x, y, z);
      uvs.push(u, v);

      // Smooth normal vector
      const norm = new THREE.Vector3(cosA / halfWidth, 0, sinA / halfDepth).normalize();
      normals.push(norm.x, norm.y, norm.z);

      // Skinning calculation: Calculate distance to each of the 8 bones
      const vPos = new THREE.Vector3(x, y, z);
      const distances = bonePositions.map((bPos, idx) => {
        // Give lateral bones higher affinity for their respective sides
        let dist = vPos.distanceTo(bPos);
        if (idx === 4 && x > -0.05) dist += 0.4; // Sleeve L
        if (idx === 5 && x < 0.05) dist += 0.4;  // Sleeve R
        if (idx === 6 && x > 0) dist += 0.3;     // Hem L
        if (idx === 7 && x < 0) dist += 0.3;     // Hem R
        return { index: idx, dist };
      });

      // Sort by proximity
      distances.sort((a, b) => a.dist - b.dist);

      // Take top 4 closest bones and compute inverse-distance weights
      const w0 = 1 / (Math.pow(distances[0].dist, 2) + 0.001);
      const w1 = 1 / (Math.pow(distances[1].dist, 2) + 0.001);
      const w2 = 1 / (Math.pow(distances[2].dist, 2) + 0.001);
      const w3 = 1 / (Math.pow(distances[3].dist, 2) + 0.001);
      const wSum = w0 + w1 + w2 + w3;

      skinIndices.push(
        distances[0].index,
        distances[1].index,
        distances[2].index,
        distances[3].index
      );

      skinWeights.push(
        w0 / wSum,
        w1 / wSum,
        w2 / wSum,
        w3 / wSum
      );
    }
  }

  // Create face indices
  for (let j = 0; j < yRes; j++) {
    for (let i = 0; i < xRes; i++) {
      const a = j * (xRes + 1) + i;
      const b = (j + 1) * (xRes + 1) + i;
      const c = (j + 1) * (xRes + 1) + (i + 1);
      const d = j * (xRes + 1) + (i + 1);

      indices.push(a, b, d);
      indices.push(b, c, d);
    }
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setIndex(indices);
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setAttribute('skinIndex', new THREE.Uint16BufferAttribute(skinIndices, 4));
  geometry.setAttribute('skinWeight', new THREE.Float32BufferAttribute(skinWeights, 4));
  geometry.computeVertexNormals();

  return geometry;
}

/**
 * Creates the 8-Bone Skeleton structure
 */
export function create8BoneSkeleton() {
  // Root / Hook
  const boneRoot = new THREE.Bone();
  boneRoot.name = 'bone0_root';
  boneRoot.position.set(0, 0, 0);

  // Chest
  const boneChest = new THREE.Bone();
  boneChest.name = 'bone1_chest';
  boneChest.position.set(0, -0.22, 0);
  boneRoot.add(boneChest);

  // Mid Torso
  const boneTorso = new THREE.Bone();
  boneTorso.name = 'bone2_torso';
  boneTorso.position.set(0, -0.26, 0); // relative to chest (-0.48 in world)
  boneChest.add(boneTorso);

  // Hem Center
  const boneHemCenter = new THREE.Bone();
  boneHemCenter.name = 'bone3_hemCenter';
  boneHemCenter.position.set(0, -0.28, 0); // relative to torso (-0.76 in world)
  boneTorso.add(boneHemCenter);

  // Left Shoulder / Sleeve
  const boneSleeveL = new THREE.Bone();
  boneSleeveL.name = 'bone4_sleeveL';
  boneSleeveL.position.set(-0.28, 0.0, 0); // relative to chest
  boneChest.add(boneSleeveL);

  // Right Shoulder / Sleeve
  const boneSleeveR = new THREE.Bone();
  boneSleeveR.name = 'bone5_sleeveR';
  boneSleeveR.position.set(0.28, 0.0, 0); // relative to chest
  boneChest.add(boneSleeveR);

  // Left Hem Flap
  const boneHemL = new THREE.Bone();
  boneHemL.name = 'bone6_hemL';
  boneHemL.position.set(-0.22, -0.28, 0); // relative to torso
  boneTorso.add(boneHemL);

  // Right Hem Flap
  const boneHemR = new THREE.Bone();
  boneHemR.name = 'bone7_hemR';
  boneHemR.position.set(0.22, -0.28, 0); // relative to torso
  boneTorso.add(boneHemR);

  const bones = [
    boneRoot,
    boneChest,
    boneTorso,
    boneHemCenter,
    boneSleeveL,
    boneSleeveR,
    boneHemL,
    boneHemR,
  ];

  const skeleton = new THREE.Skeleton(bones);
  return { skeleton, bones, rootBone: boneRoot };
}

/**
 * Creates the wooden & chrome hanger geometry
 */
export function createHangerMesh() {
  const hangerGroup = new THREE.Group();
  hangerGroup.name = 'hanger';

  // Wooden curved shoulder bar
  const woodMaterial = new THREE.MeshStandardMaterial({
    color: 0x4a3424,
    roughness: 0.35,
    metalness: 0.05,
  });

  const chromeMaterial = new THREE.MeshStandardMaterial({
    color: 0xe0e0e0,
    metalness: 0.95,
    roughness: 0.15,
  });

  // Hanger shoulder bar (tapered wedge)
  const barShape = new THREE.Shape();
  barShape.moveTo(-0.24, -0.17);
  barShape.lineTo(-0.24, -0.15);
  barShape.lineTo(0, -0.11);
  barShape.lineTo(0.24, -0.15);
  barShape.lineTo(0.24, -0.17);
  barShape.lineTo(0, -0.13);
  barShape.closePath();

  const extrudeSettings = {
    steps: 1,
    depth: 0.016,
    bevelEnabled: true,
    bevelThickness: 0.003,
    bevelSize: 0.003,
    bevelSegments: 3,
  };
  const barGeom = new THREE.ExtrudeGeometry(barShape, extrudeSettings);
  barGeom.center();
  const barMesh = new THREE.Mesh(barGeom, woodMaterial);
  barMesh.position.set(0, -0.14, 0);
  barMesh.castShadow = true;
  hangerGroup.add(barMesh);

  // Swivel hook (curved metal hook over top rail)
  const hookCurve = new THREE.CurvePath();
  const p1 = new THREE.Vector3(0, -0.11, 0);
  const p2 = new THREE.Vector3(0, -0.01, 0);
  hookCurve.add(new THREE.LineCurve3(p1, p2));

  // Loop around rail
  const hookLoop = new THREE.QuadraticBezierCurve3(
    new THREE.Vector3(0, -0.01, 0),
    new THREE.Vector3(0, 0.045, 0),
    new THREE.Vector3(-0.025, 0.03, 0)
  );
  hookCurve.add(hookLoop);

  const hookGeom = new THREE.TubeGeometry(hookCurve, 20, 0.0035, 8, false);
  const hookMesh = new THREE.Mesh(hookGeom, chromeMaterial);
  hookMesh.castShadow = true;
  hangerGroup.add(hookMesh);

  return hangerGroup;
}
