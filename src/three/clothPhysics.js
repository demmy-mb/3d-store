import * as THREE from 'three';

/**
 * 8-Bone Spring and Inertia Cloth Physics Simulator.
 * Handles:
 * 1. Rail sliding inertia & harmonic sway
 * 2. Unhook / Gravity Drop & shelf collision
 * 3. Aerodynamic drag on hem/sleeves during fall
 * 4. Ground landing fabric crumple
 */
export class GarmentPhysics {
  constructor(itemIndex, initialRailX, railY = 1.78) {
    this.itemIndex = itemIndex;
    this.railY = railY;
    this.shelfY = 0.28; // height of bottom rack shelf

    // World position of hanger hook
    this.position = new THREE.Vector3(initialRailX, railY, 0);
    this.targetRailX = initialRailX;
    this.currentRailX = initialRailX;
    this.railVelocityX = 0;
    this.prevRailX = initialRailX;

    // Rotation (facing camera vs sideways on rack)
    this.rotationY = Math.PI / 2; // Hanging sideways by default
    this.targetRotationY = Math.PI / 2;

    // State: 'HANGING' | 'DROPPING' | 'FALLEN' | 'LIFTING'
    this.state = 'HANGING';
    this.dropVelocityY = 0;

    // Bone dynamic states for bones 1 through 7
    // [1: Chest, 2: Torso, 3: HemCenter, 4: SleeveL, 5: SleeveR, 6: HemL, 7: HemR]
    this.bonesState = [
      null, // index 0 is root
      // Bone 1: Chest
      { angleZ: 0, velZ: 0, angleX: 0, velX: 0, stiffness: 42, damping: 6.5, mass: 1.0 },
      // Bone 2: Mid Torso
      { angleZ: 0, velZ: 0, angleX: 0, velX: 0, stiffness: 35, damping: 5.5, mass: 1.3 },
      // Bone 3: Hem Center
      { angleZ: 0, velZ: 0, angleX: 0, velX: 0, stiffness: 28, damping: 4.8, mass: 1.6 },
      // Bone 4: Sleeve L
      { angleZ: 0, velZ: 0, angleX: 0, velX: 0, stiffness: 38, damping: 5.0, mass: 0.9 },
      // Bone 5: Sleeve R
      { angleZ: 0, velZ: 0, angleX: 0, velX: 0, stiffness: 38, damping: 5.0, mass: 0.9 },
      // Bone 6: Hem L
      { angleZ: 0, velZ: 0, angleX: 0, velX: 0, stiffness: 25, damping: 4.5, mass: 1.4 },
      // Bone 7: Hem R
      { angleZ: 0, velZ: 0, angleX: 0, velX: 0, stiffness: 25, damping: 4.5, mass: 1.4 },
    ];
  }

  /**
   * Applies an impulse/nudge to simulate a gust of wind or finger touch
   */
  applyImpulse(fx, fz) {
    for (let i = 1; i <= 7; i++) {
      const state = this.bonesState[i];
      state.velZ += (fx / state.mass) * (1.2 + Math.random() * 0.4);
      state.velX += (fz / state.mass) * (1.2 + Math.random() * 0.4);
    }
  }

  /**
   * Triggers the drop action
   */
  drop() {
    if (this.state === 'HANGING') {
      this.state = 'DROPPING';
      this.dropVelocityY = 0;
      // Slight outward flutter on sleeves when released
      this.bonesState[4].velZ -= 1.5;
      this.bonesState[5].velZ += 1.5;
    }
  }

  /**
   * Triggers hanging back onto the rail
   */
  hangBack() {
    this.state = 'LIFTING';
  }

  /**
   * Physics update step
   * @param {number} dt Delta time in seconds
   * @param {Array<THREE.Bone>} bones Three.js bones
   * @param {THREE.Group} garmentRoot Container group
   */
  update(dt, bones, garmentRoot) {
    // Clamp delta time to avoid physics explosion on tab switch
    const clampedDt = Math.min(dt, 0.04);

    // 1. Position & Rail Movement logic
    if (this.state === 'HANGING') {
      // Smooth slide to target rail X
      const dx = this.targetRailX - this.currentRailX;
      this.currentRailX += dx * Math.min(clampedDt * 8.0, 1.0);
      this.position.x = this.currentRailX;
      this.position.y = this.railY;

      // Calculate rail acceleration for inertial sway
      const currentVel = (this.currentRailX - this.prevRailX) / clampedDt;
      this.railAcceleration = (currentVel - this.railVelocityX) / clampedDt;
      this.railVelocityX = currentVel;
      this.prevRailX = this.currentRailX;
    } else if (this.state === 'DROPPING') {
      const gravity = -14.0; // m/s^2
      this.dropVelocityY += gravity * clampedDt;
      this.position.y += this.dropVelocityY * clampedDt;

      // Air resistance drag lifting the hem bones slightly
      const airDrag = -this.dropVelocityY * 0.12;
      this.bonesState[3].velX -= airDrag * clampedDt * 2.0;
      this.bonesState[6].velX -= airDrag * clampedDt * 2.0;
      this.bonesState[7].velX -= airDrag * clampedDt * 2.0;

      // Bottom shelf collision check
      if (this.position.y <= this.shelfY) {
        this.position.y = this.shelfY;
        // Bounce restitution
        if (Math.abs(this.dropVelocityY) > 0.8) {
          this.dropVelocityY = -this.dropVelocityY * 0.22;
        } else {
          this.dropVelocityY = 0;
          this.state = 'FALLEN';
        }

        // Impact crumple: Hem bones spread outwards upon hitting tray
        this.bonesState[6].velZ -= 3.5;
        this.bonesState[7].velZ += 3.5;
        this.bonesState[3].velX += 4.0; // fold forward
        this.bonesState[1].velX += 1.8;
      }
    } else if (this.state === 'FALLEN') {
      this.position.y = this.shelfY;
      this.dropVelocityY = 0;
    } else if (this.state === 'LIFTING') {
      // Smoothly elevate back to the rail
      const dy = this.railY - this.position.y;
      this.position.y += dy * Math.min(clampedDt * 6.0, 1.0);

      // Restore sideways angle
      this.rotationY = THREE.MathUtils.lerp(this.rotationY, this.targetRotationY, clampedDt * 5.0);

      if (Math.abs(dy) < 0.01) {
        this.position.y = this.railY;
        this.state = 'HANGING';
        // Gentle settle bounce
        this.applyImpulse(0.5, 0.2);
      }
    }

    // 2. Smooth rotation towards target (e.g. facing front when inspected)
    this.rotationY = THREE.MathUtils.lerp(this.rotationY, this.targetRotationY, clampedDt * 7.0);

    // Apply root transform to garment container
    garmentRoot.position.copy(this.position);
    garmentRoot.rotation.y = this.rotationY;

    // 3. Bone Spring Simulation (Hooke's Law + Damping + Inertia)
    // Inertial sway pushes bones based on rack acceleration & orientation
    const cosR = Math.cos(this.rotationY);
    const sinR = Math.sin(this.rotationY);

    // Project rail acceleration into the garment's local frame
    const localInertiaZ = (this.railAcceleration || 0) * cosR * 0.08;
    const localInertiaX = (this.railAcceleration || 0) * sinR * 0.08;

    for (let i = 1; i <= 7; i++) {
      const state = this.bonesState[i];
      const bone = bones[i];
      if (!state || !bone) continue;

      // Ambient breathing breeze (micro sway so the fabric feels alive)
      const breeze = Math.sin(Date.now() * 0.002 + i * 0.8 + this.itemIndex) * 0.015;

      // Spring forces: F = -k * x - c * v + inertia
      const springForceZ = -state.stiffness * state.angleZ - state.damping * state.velZ - localInertiaZ + breeze;
      const springForceX = -state.stiffness * state.angleX - state.damping * state.velX - localInertiaX;

      // Integrate acceleration -> velocity -> position (Semi-implicit Euler)
      const accelZ = springForceZ / state.mass;
      const accelX = springForceX / state.mass;

      state.velZ += accelZ * clampedDt;
      state.velX += accelX * clampedDt;

      state.angleZ += state.velZ * clampedDt;
      state.angleX += state.velX * clampedDt;

      // Angle limits to maintain realistic fabric drape
      state.angleZ = THREE.MathUtils.clamp(state.angleZ, -0.65, 0.65);
      state.angleX = THREE.MathUtils.clamp(state.angleX, -0.65, 0.65);

      // Apply rotations to bone
      bone.rotation.z = state.angleZ;
      bone.rotation.x = state.angleX;
    }
  }
}
