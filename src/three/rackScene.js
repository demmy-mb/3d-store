import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import {
  createFabricTexture,
  createTShirtGeometry,
  create8BoneSkeleton,
  createHangerMesh,
} from './clothRig.js';
import { GarmentPhysics } from './clothPhysics.js';

/**
 * Curated Collection Data with realistic garment specs and colorways
 */
export const GARMENT_DATA = [
  {
    id: 'tee-chalk',
    num: '01',
    name: 'Chalk White',
    color: 0xf6f5f0,
    fabric: '280 GSM Heavyweight Organic Combed Cotton',
    fit: 'Boxy Oversized Drop-Shoulder',
    finish: 'Enzyme Washed Matte Finish',
    price: '$85',
  },
  {
    id: 'tee-noir',
    num: '02',
    name: 'Washed Noir',
    color: 0x1f2024,
    fabric: '300 GSM French Terry Loopback Cotton',
    fit: 'Relaxed Vintage Cut with Ribbed Collar',
    finish: 'Garment Pigment Dyed with Micro Folds',
    price: '$95',
  },
  {
    id: 'tee-sand',
    num: '03',
    name: 'Raw Desert Sand',
    color: 0xdbcfbe,
    fabric: '260 GSM Raw Textured Linen-Cotton Blend',
    fit: 'Classic Tailored Drape',
    finish: 'Unbleached Organic Fiber Weave',
    price: '$90',
  },
  {
    id: 'tee-sage',
    num: '04',
    name: 'Muted Sage',
    color: 0x596354,
    fabric: '280 GSM High-Twist Compact Yarn',
    fit: 'Sculptural Modern Silhouette',
    finish: 'Silicone Softened Tactile Feel',
    price: '$88',
  },
  {
    id: 'tee-slate',
    num: '05',
    name: 'Heather Slate',
    color: 0x6e7885,
    fabric: '290 GSM Two-Ply Melange Jersey',
    fit: 'Relaxed Drop Hem',
    finish: 'Pre-Shrunk Carbon-Brushed Feel',
    price: '$85',
  },
  {
    id: 'tee-rust',
    num: '06',
    name: 'Terracotta Clay',
    color: 0xa45946,
    fabric: '280 GSM Ring-Spun Pima Cotton',
    fit: 'Contemporary Streetwear Cut',
    finish: 'Sun-Bleached Warm Earth Wash',
    price: '$92',
  },
];

export class VirtualRackExperience {
  constructor(containerElement, onSelectGarment, onStateChange) {
    this.container = containerElement;
    this.onSelectGarment = onSelectGarment;
    this.onStateChange = onStateChange;

    this.selectedIndex = 0;
    this.garments = [];
    this.isDragging = false;
    this.lastTime = performance.now();

    // Camera animation tween object: { startTime, duration, startPos, endPos, startTarget, endTarget }
    this.isFabricInspectMode = false;
    this.cameraAnim = null;
    this.defaultCameraPos = new THREE.Vector3(0, 1.45, 3.8);
    this.defaultLookTarget = new THREE.Vector3(0, 1.25, 0);

    this.initScene();
    this.initStudioRoom();
    this.initClothingRack();
    this.initGarments();
    this.initInteractions();

    this.animate = this.animate.bind(this);
    this.animationFrameId = requestAnimationFrame(this.animate);
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);

    // Initial focus on center shirt
    this.selectGarment(0, false);
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xfcfbfa);

    // Camera setup - 36mm fashion editorial focal length
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 50);
    this.camera.position.set(0, 1.45, 3.8);

    // Target look-at point
    this.lookTarget = new THREE.Vector3(0, 1.25, 0);
    this.camera.lookAt(this.lookTarget);

    // WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.08;

    this.container.appendChild(this.renderer.domElement);

    // Orbit Controls
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.copy(this.defaultLookTarget);
    this.controls.maxPolarAngle = Math.PI / 2 + 0.02; // prevent dipping below floor
    this.controls.minDistance = 0.55; // Allows zooming very close to inspect micro-knit fabric texture!
    this.controls.maxDistance = 8.5;  // Allows zooming all the way out to see the full room & rack!
    this.controls.enableZoom = true;
    this.controls.zoomSpeed = 1.2;
    this.controls.enableRotate = true;
    this.controls.rotateSpeed = 0.9;
    this.controls.enablePan = true;
    this.controls.panSpeed = 0.8;

    // Any user interaction (drag, scroll, touch) immediately cancels programmed camera animation
    // so the user has 100% immediate, responsive control!
    const cancelAnim = () => {
      this.cameraAnim = null;
    };
    this.controls.addEventListener('start', cancelAnim);
    this.renderer.domElement.addEventListener('wheel', cancelAnim, { passive: true });
  }

  initStudioRoom() {
    // 1. Studio Lighting Setup
    // Key Light (Main soft directional sunlight)
    const keyLight = new THREE.DirectionalLight(0xfffaed, 2.8);
    keyLight.position.set(3.5, 6.0, 4.5);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.width = 2048;
    keyLight.shadow.mapSize.height = 2048;
    keyLight.shadow.camera.near = 0.5;
    keyLight.shadow.camera.far = 15;
    keyLight.shadow.camera.left = -2.5;
    keyLight.shadow.camera.right = 2.5;
    keyLight.shadow.camera.top = 3.0;
    keyLight.shadow.camera.bottom = -1.0;
    keyLight.shadow.bias = -0.0004;
    keyLight.shadow.radius = 3.5;
    this.scene.add(keyLight);

    // Fill Light (Soft cool bounce from right)
    const fillLight = new THREE.DirectionalLight(0xe8f0ff, 1.2);
    fillLight.position.set(-4.5, 3.5, 2.5);
    this.scene.add(fillLight);

    // Rim / Backlight (highlights fabric edges and chrome top rail)
    const rimLight = new THREE.DirectionalLight(0xfff5e6, 1.6);
    rimLight.position.set(0, 5.0, -3.5);
    this.scene.add(rimLight);

    // Ambient studio base
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
    this.scene.add(ambientLight);

    // 2. Studio Cyclorama Floor & Wall
    // Floor plane
    const floorGeo = new THREE.PlaneGeometry(24, 24);
    const floorMat = new THREE.MeshStandardMaterial({
      color: 0xf7f6f2,
      roughness: 0.85,
      metalness: 0.02,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Subtle horizon architectural crease line
    const horizonGeo = new THREE.PlaneGeometry(16, 0.004);
    const horizonMat = new THREE.MeshBasicMaterial({
      color: 0xd6d3cc,
      transparent: true,
      opacity: 0.45,
    });
    const horizonLine = new THREE.Mesh(horizonGeo, horizonMat);
    horizonLine.position.set(0, 0.001, -2.8);
    horizonLine.rotation.x = -Math.PI / 2;
    this.scene.add(horizonLine);

    // Back Wall
    const wallGeo = new THREE.PlaneGeometry(24, 12);
    const wallMat = new THREE.MeshStandardMaterial({
      color: 0xfcfbfa,
      roughness: 0.95,
      metalness: 0.0,
    });
    const wall = new THREE.Mesh(wallGeo, wallMat);
    wall.position.set(0, 6, -2.8);
    wall.receiveShadow = true;
    this.scene.add(wall);

    // 3. Wall Branding (Chic 3D architectural signage & logos)
    this.createWallBranding();
  }

  createWallBranding() {
    const brandGroup = new THREE.Group();
    brandGroup.position.set(0, 2.75, -2.78);

    // Architectural brand plate / relief logo
    const plateGeo = new THREE.BoxGeometry(0.8, 0.8, 0.015);
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0xf3f2ee,
      roughness: 0.5,
      metalness: 0.1,
    });
    const plate = new THREE.Mesh(plateGeo, plateMat);
    plate.castShadow = true;
    plate.receiveShadow = true;
    brandGroup.add(plate);

    // Geometric Modern Logo Emblem (Intersecting minimalist rings)
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.25,
      metalness: 0.85,
    });
    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.015, 16, 48), ringMat);
    ring1.position.z = 0.012;
    brandGroup.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(0.14, 0.012, 16, 48), ringMat);
    ring2.position.set(0.08, -0.05, 0.014);
    brandGroup.add(ring2);

    this.scene.add(brandGroup);
  }

  initClothingRack() {
    this.rackGroup = new THREE.Group();

    // Materials
    const chromeMat = new THREE.MeshStandardMaterial({
      color: 0xd8d8d8,
      metalness: 0.95,
      roughness: 0.16,
    });

    const blackSteelMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a1c,
      metalness: 0.7,
      roughness: 0.35,
    });

    const railY = 1.78;
    const rackWidth = 4.4; // Generous width so garments have ample breathing room
    const halfW = rackWidth / 2;

    // Top horizontal clothes rail
    const topRailGeo = new THREE.CylinderGeometry(0.014, 0.014, rackWidth, 32);
    const topRail = new THREE.Mesh(topRailGeo, chromeMat);
    topRail.rotation.z = Math.PI / 2;
    topRail.position.set(0, railY, 0);
    topRail.castShadow = true;
    this.rackGroup.add(topRail);

    // End stopper caps on the rail
    const capGeo = new THREE.CylinderGeometry(0.024, 0.024, 0.04, 32);
    const leftCap = new THREE.Mesh(capGeo, chromeMat);
    leftCap.rotation.z = Math.PI / 2;
    leftCap.position.set(-halfW - 0.02, railY, 0);
    this.rackGroup.add(leftCap);

    const rightCap = new THREE.Mesh(capGeo, chromeMat);
    rightCap.rotation.z = Math.PI / 2;
    rightCap.position.set(halfW + 0.02, railY, 0);
    this.rackGroup.add(rightCap);

    // Vertical Uprights (Matte Black steel pillars)
    const uprightGeo = new THREE.CylinderGeometry(0.018, 0.018, railY - 0.08, 32);
    const leftUpright = new THREE.Mesh(uprightGeo, blackSteelMat);
    leftUpright.position.set(-halfW, (railY - 0.08) / 2 + 0.08, 0);
    leftUpright.castShadow = true;
    this.rackGroup.add(leftUpright);

    const rightUpright = new THREE.Mesh(uprightGeo, blackSteelMat);
    rightUpright.position.set(halfW, (railY - 0.08) / 2 + 0.08, 0);
    rightUpright.castShadow = true;
    this.rackGroup.add(rightUpright);

    // Base horizontal feet
    const baseFootGeo = new THREE.BoxGeometry(0.04, 0.04, 0.75);
    const leftFoot = new THREE.Mesh(baseFootGeo, blackSteelMat);
    leftFoot.position.set(-halfW, 0.04, 0);
    leftFoot.castShadow = true;
    leftFoot.receiveShadow = true;
    this.rackGroup.add(leftFoot);

    const rightFoot = new THREE.Mesh(baseFootGeo, blackSteelMat);
    rightFoot.position.set(halfW, 0.04, 0);
    rightFoot.castShadow = true;
    rightFoot.receiveShadow = true;
    this.rackGroup.add(rightFoot);

    // Lower storage tray / rack shelf where dropped clothes fall
    const shelfGeo = new THREE.BoxGeometry(rackWidth - 0.08, 0.02, 0.44);
    const shelfMat = new THREE.MeshStandardMaterial({
      color: 0x222326,
      metalness: 0.6,
      roughness: 0.4,
    });
    const shelf = new THREE.Mesh(shelfGeo, shelfMat);
    shelf.position.set(0, 0.26, 0);
    shelf.castShadow = true;
    shelf.receiveShadow = true;
    this.rackGroup.add(shelf);

    // Shelf lip borders
    const lipGeo = new THREE.BoxGeometry(rackWidth - 0.08, 0.02, 0.01);
    const frontLip = new THREE.Mesh(lipGeo, blackSteelMat);
    frontLip.position.set(0, 0.28, 0.215);
    this.rackGroup.add(frontLip);

    const backLip = new THREE.Mesh(lipGeo, blackSteelMat);
    backLip.position.set(0, 0.28, -0.215);
    this.rackGroup.add(backLip);

    this.scene.add(this.rackGroup);
  }

  initGarments() {
    this.fabricTexture = createFabricTexture();
    const tShirtGeometry = createTShirtGeometry();

    const count = GARMENT_DATA.length;
    // Generous spacing between each hanging piece (0.62m instead of 0.42m)
    const spacing = 0.62;
    const startX = -((count - 1) * spacing) / 2;

    this.garments = GARMENT_DATA.map((data, index) => {
      const railX = startX + index * spacing;

      // Container group for position and rotation
      const garmentGroup = new THREE.Group();
      garmentGroup.name = `garment_${index}`;

      // Hanger
      const hanger = createHangerMesh();
      hanger.position.set(0, 0, 0);
      garmentGroup.add(hanger);

      // Fabric Material
      const fabricMat = new THREE.MeshStandardMaterial({
        color: data.color,
        roughness: 0.88,
        metalness: 0.02,
        normalMap: this.fabricTexture,
        normalScale: new THREE.Vector2(0.5, 0.5),
        side: THREE.DoubleSide,
      });

      // 8-Bone Skeleton and Skinned Mesh
      const { skeleton, bones, rootBone } = create8BoneSkeleton();
      garmentGroup.add(rootBone);
      // Bone world matrices must be current before bind(), otherwise every
      // bone's inverse is identity and vertices get dragged down by its offset
      garmentGroup.updateMatrixWorld(true);

      const skinnedMesh = new THREE.SkinnedMesh(tShirtGeometry.clone(), fabricMat);
      skinnedMesh.castShadow = true;
      skinnedMesh.receiveShadow = true;
      skinnedMesh.bind(skeleton);
      garmentGroup.add(skinnedMesh);

      this.scene.add(garmentGroup);

      // Physics instance
      const physics = new GarmentPhysics(index, railX, 1.78);

      return {
        index,
        data,
        group: garmentGroup,
        hanger,
        bones,
        skeleton,
        skinnedMesh,
        physics,
        baseRailX: railX,
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

      // Only treat as a click if the mouse didn't drag to orbit/pan (< 7px movement)
      if (dist > 7 || elapsed > 450) {
        return; // It was a camera drag, ignore raycast click
      }

      const rect = this.renderer.domElement.getBoundingClientRect();
      this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      // Check intersections against all garments
      const interactableMeshes = [];
      this.garments.forEach((g) => {
        g.group.traverse((child) => {
          if (child.isMesh) {
            child.userData = { garmentIndex: g.index };
            interactableMeshes.push(child);
          }
        });
      });

      const intersects = this.raycaster.intersectObjects(interactableMeshes);
      if (intersects.length > 0) {
        const clickedIndex = intersects[0].object.userData.garmentIndex;
        if (clickedIndex !== undefined) {
          // If clicked near hanger hook, drop/hang back
          if (intersects[0].point.y > 1.62) {
            this.toggleDropGarment(clickedIndex);
          } else {
            this.selectGarment(clickedIndex);
          }
        }
      }
    };

    this.renderer.domElement.addEventListener('pointerdown', onPointerDown);
    this.renderer.domElement.addEventListener('pointerup', onPointerUp);
  }

  /**
   * Select a garment: Slides it to the center (x = 0), rotates to front,
   * and bunches neighbor garments closer together to create a large focus gap.
   */
  selectGarment(index, triggerCallback = true) {
    this.selectedIndex = index;
    this.updateRackLayout();

    if (triggerCallback && this.onSelectGarment) {
      const selected = this.garments[index];
      this.onSelectGarment(selected.data, selected.physics.state);
    }
  }

  /**
   * Rearranges all garments on the rail.
   * Tight bunching on the non-display pieces so the piece in focus has ample gap.
   */
  updateRackLayout() {
    const index = this.selectedIndex;
    // When fabric inspect is active, move side clothes even further out!
    const spreadOffset = this.isFabricInspectMode ? 1.45 : 0.98;
    // Tightly bunch the non-displayed clothes together (0.13m step like real packed hangers)
    const tightSpacing = 0.13;

    this.garments.forEach((g, i) => {
      if (i === index) {
        // Selected garment moves to center of rack and faces front
        g.physics.targetRailX = 0;
        g.physics.targetRotationY = 0; // 0 radians = facing camera front
      } else {
        // Turn sideways on the rack
        g.physics.targetRotationY = Math.PI / 2;

        // Tightly bunch clothes that are not in display on left and right
        if (i < index) {
          const leftRank = index - 1 - i;
          g.physics.targetRailX = -spreadOffset - leftRank * tightSpacing;
        } else {
          const rightRank = i - (index + 1);
          g.physics.targetRailX = spreadOffset + rightRank * tightSpacing;
        }
      }
    });
  }

  /**
   * Smoothly animates the camera to a given position and look target
   */
  animateCameraTo(targetPos, targetLookAt, duration = 550) {
    this.cameraAnim = {
      startTime: performance.now(),
      duration,
      startPos: this.camera.position.clone(),
      endPos: targetPos.clone(),
      startTarget: this.controls.target.clone(),
      endTarget: targetLookAt.clone(),
    };
  }

  /**
   * Toggles macro fabric inspection zoom mode
   */
  setFabricInspect(enabled) {
    this.isFabricInspectMode = enabled;

    if (enabled) {
      // Zoom in to chest & sleeve fabric texture (framed slightly to the left)
      const zoomTargetPos = new THREE.Vector3(-0.18, 1.35, 1.35);
      const zoomLookTarget = new THREE.Vector3(0.04, 1.34, 0);
      this.animateCameraTo(zoomTargetPos, zoomLookTarget, 550);
    } else {
      this.animateCameraTo(this.defaultCameraPos, this.defaultLookTarget, 550);
    }
    this.updateRackLayout();
  }

  /**
   * Resets camera smoothly to default overview
   */
  resetCamera() {
    this.isFabricInspectMode = false;
    this.animateCameraTo(this.defaultCameraPos, this.defaultLookTarget, 550);
    this.updateRackLayout();
  }

  /**
   * Smooth one-click Zoom In (convenient for trackpad, touch, or mouse)
   */
  zoomIn(step = 0.6) {
    const dir = new THREE.Vector3().subVectors(this.controls.target, this.camera.position).normalize();
    const currentDist = this.camera.position.distanceTo(this.controls.target);
    const newDist = Math.max(this.controls.minDistance, currentDist - step);
    const newPos = new THREE.Vector3().copy(this.controls.target).addScaledVector(dir, -newDist);
    this.animateCameraTo(newPos, this.controls.target, 320);
  }

  /**
   * Smooth one-click Zoom Out
   */
  zoomOut(step = 0.8) {
    const dir = new THREE.Vector3().subVectors(this.camera.position, this.controls.target).normalize();
    const currentDist = this.camera.position.distanceTo(this.controls.target);
    const newDist = Math.min(this.controls.maxDistance, currentDist + step);
    const newPos = new THREE.Vector3().copy(this.controls.target).addScaledVector(dir, newDist);
    this.animateCameraTo(newPos, this.controls.target, 320);
  }

  /**
   * Drops or hangs back the currently selected garment
   */
  toggleDropGarment(index = this.selectedIndex) {
    const garment = this.garments[index];
    if (!garment) return;

    if (garment.physics.state === 'HANGING') {
      garment.physics.drop();
    } else {
      garment.physics.hangBack();
    }

    if (this.onStateChange) {
      this.onStateChange(garment.physics.state);
    }
  }

  /**
   * Applies an interactive gust/nudge to the cloth bones
   */
  nudgeSelected() {
    const garment = this.garments[this.selectedIndex];
    if (garment) {
      garment.physics.applyImpulse((Math.random() - 0.5) * 5.0, (Math.random() - 0.5) * 5.0);
    }
  }

  /**
   * Rotates the inspected garment 180 degrees (Front / Back flip)
   */
  flipGarment() {
    const garment = this.garments[this.selectedIndex];
    if (garment) {
      garment.physics.targetRotationY =
        Math.abs(garment.physics.targetRotationY) < 0.1 ? Math.PI : 0;
    }
  }

  handleResize() {
    if (!this.container) return;
    const width = this.container.clientWidth;
    const height = this.container.clientHeight;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }

  animate(currentTime) {
    this.animationFrameId = requestAnimationFrame(this.animate);

    const dt = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    // Update physics for all garments
    this.garments.forEach((g) => {
      g.physics.update(dt, g.bones, g.group);
    });

    // Handle smooth programmed camera animation (Fabric zoom, reset, or zoom buttons)
    // Runs with smooth cubic easing and CLEARS ITSELF so user OrbitControls has 100% freedom!
    if (this.cameraAnim) {
      const elapsed = currentTime - this.cameraAnim.startTime;
      const progress = Math.min(elapsed / this.cameraAnim.duration, 1.0);
      // Cubic ease-out
      const ease = 1 - Math.pow(1 - progress, 3);

      this.camera.position.lerpVectors(this.cameraAnim.startPos, this.cameraAnim.endPos, ease);
      this.controls.target.lerpVectors(this.cameraAnim.startTarget, this.cameraAnim.endTarget, ease);

      if (progress >= 1.0) {
        this.camera.position.copy(this.cameraAnim.endPos);
        this.controls.target.copy(this.cameraAnim.endTarget);
        this.cameraAnim = null; // Animation complete! User now has total, unrestricted orbit & zoom!
      }
    }

    // Update Orbit Controls with damping
    this.controls.update();

    // Render frame
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
