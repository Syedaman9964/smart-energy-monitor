import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * ============================================================================
 * WATTVISION — PREMIUM CUTE 3D ORANGE CAT COMPANION
 * ============================================================================
 * A Pixar-quality stylized 3D domestic ginger cat created with Three.js.
 *
 * Features:
 * - Warm natural ginger/orange fur with creamy chest, muzzle, and paw socks
 * - Expressive large eyes with dual specular catchlights and animated eyelids
 * - Soft rounded ears with inner fluff and pink ear-canals (no robot cones!)
 * - Soft pink nose and adorable cheeks
 * - Paws with rosy pink toe beans (visible during shy paw-cover and tap reactions)
 * - Fluffy segmented tail with organic S-curve swishing
 * - Smooth damped cursor tracking on desktop
 * - Full touch/tap interaction on mobile/desktop (purr mode, curious tilt)
 * - Contextual reactions: looking at username, covering eyes on password,
 *   concerned on error, cheerful celebratory bounce on login success
 * - Natural soft contact shadow and warm champagne-gold rim lighting
 */
export default function InteractiveCat({
  isCoveringEyes = false,
  isUsernameFocused = false,
  authStatus = 'idle', // 'idle' | 'loading' | 'success' | 'error'
  onCatInteraction, // callback for speech bubble updates
  className = '',
  size = 320
}) {
  const mountRef = useRef(null);
  const stateRef = useRef({
    isCoveringEyes,
    isUsernameFocused,
    authStatus,
    mouseX: 0,
    mouseY: 0,
    targetMouseX: 0,
    targetMouseY: 0,
    tapReactionTimer: 0,
    tapCount: 0,
    isPurring: false,
    isCuriousNear: false,
    isReducedMotion: false
  });

  // Keep stateRef up to date across renders without rebuilding Three.js scene
  useEffect(() => {
    stateRef.current.isCoveringEyes = isCoveringEyes;
    stateRef.current.isUsernameFocused = isUsernameFocused;
    stateRef.current.authStatus = authStatus;
  }, [isCoveringEyes, isUsernameFocused, authStatus]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Check prefers-reduced-motion
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    stateRef.current.isReducedMotion = mediaQuery.matches;
    const handleMotionChange = (e) => {
      stateRef.current.isReducedMotion = e.matches;
    };
    mediaQuery.addEventListener('change', handleMotionChange);

    const width = container.clientWidth || size;
    const height = container.clientHeight || size;

    // 1. SCENE & CAMERA
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.45, 4.3);

    // 2. RENDERER
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.18;
    container.appendChild(renderer.domElement);

    // 3. LIGHTING (Warm Natural Domestic Ambience + Champagne Gold Edge)
    const ambientLight = new THREE.AmbientLight(0x282320, 1.8);
    scene.add(ambientLight);

    // Warm Key Sunlight
    const keyLight = new THREE.DirectionalLight(0xffeedd, 2.4);
    keyLight.position.set(2.8, 3.5, 3.2);
    scene.add(keyLight);

    // Soft Peach / Rose Fill Light
    const fillLight = new THREE.DirectionalLight(0xffcaa7, 1.3);
    fillLight.position.set(-3.0, 1.2, 2.5);
    scene.add(fillLight);

    // Signature WattVision Champagne-Gold Rim Light (Gives fur a warm glowing halo)
    const rimLight = new THREE.DirectionalLight(0xd4af37, 1.6);
    rimLight.position.set(0, 3.2, -2.8);
    scene.add(rimLight);

    // Ground Bounce Light
    const groundBounce = new THREE.DirectionalLight(0x2d1f14, 0.5);
    groundBounce.position.set(0, -2, 1);
    scene.add(groundBounce);

    // 4. SOFT RADIAL CONTACT SHADOW (Grounding into dark graphite floor)
    const createShadowTexture = () => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      const grad = ctx.createRadialGradient(128, 128, 0, 128, 128, 120);
      grad.addColorStop(0, 'rgba(6, 8, 12, 0.78)');
      grad.addColorStop(0.35, 'rgba(6, 8, 12, 0.45)');
      grad.addColorStop(0.7, 'rgba(6, 8, 12, 0.15)');
      grad.addColorStop(1, 'rgba(6, 8, 12, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);
      return new THREE.CanvasTexture(canvas);
    };

    const shadowGeo = new THREE.PlaneGeometry(2.4, 2.4);
    const shadowMat = new THREE.MeshBasicMaterial({
      map: createShadowTexture(),
      transparent: true,
      opacity: 0.85,
      depthWrite: false
    });
    const shadowMesh = new THREE.Mesh(shadowGeo, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.set(0, -0.68, 0.05);
    scene.add(shadowMesh);

    // 5. CUTE MATERIALS (Zero robot, zero metallic, 100% soft warm domestic feline)
    const orangeFurMat = new THREE.MeshStandardMaterial({
      color: 0xee7c26, // Warm ginger orange
      roughness: 0.82,
      metalness: 0.0,
      flatShading: false
    });

    const creamFurMat = new THREE.MeshStandardMaterial({
      color: 0xfff4e6, // Soft creamy ivory
      roughness: 0.88,
      metalness: 0.0
    });

    const stripeFurMat = new THREE.MeshStandardMaterial({
      color: 0xc45617, // Warm cinnamon tabby accent
      roughness: 0.84,
      metalness: 0.0
    });

    const innerEarMat = new THREE.MeshStandardMaterial({
      color: 0xffa896, // Soft peachy pink
      roughness: 0.72,
      metalness: 0.0
    });

    const earFluffMat = new THREE.MeshStandardMaterial({
      color: 0xfffaed, // Fluffy cream inner ear tuft
      roughness: 0.92,
      metalness: 0.0
    });

    const noseMat = new THREE.MeshStandardMaterial({
      color: 0xff8fa3, // Cute baby pink nose
      roughness: 0.35,
      metalness: 0.0
    });

    const pawPadMat = new THREE.MeshStandardMaterial({
      color: 0xff7e96, // Rosy jelly bean pink
      roughness: 0.42,
      metalness: 0.0
    });

    const collarMat = new THREE.MeshStandardMaterial({
      color: 0x5a1827, // Sophisticated deep burgundy woven collar
      roughness: 0.55,
      metalness: 0.0
    });

    const bellMat = new THREE.MeshStandardMaterial({
      color: 0xd4af37, // Tiny polished gold bell
      roughness: 0.22,
      metalness: 0.75
    });

    // PROCEDURAL PIXAR CAT EYE MATERIALS (Crisp, vibrant, guaranteed visible from every angle)
    const eyeScleraMat = new THREE.MeshStandardMaterial({
      color: 0xfcfaf4,
      roughness: 0.25,
      metalness: 0.0
    });

    const eyeIrisMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b, // Warm golden amber
      roughness: 0.18,
      metalness: 0.05,
      emissive: 0x78350f,
      emissiveIntensity: 0.35
    });

    const eyeLimbalMat = new THREE.MeshBasicMaterial({
      color: 0x3d1b04 // Dark chocolate amber ring
    });

    const eyePupilMat = new THREE.MeshBasicMaterial({
      color: 0x090708 // Deep velvety obsidian pupil
    });

    const eyeCatchlightMat = new THREE.MeshBasicMaterial({
      color: 0xffffff // Pure sparkling Pixar glint
    });

    // 6. PROCEDURAL 3D CAT COMPANION HIERARCHY
    const rootGroup = new THREE.Group();
    rootGroup.position.set(0, -0.4, 0);
    scene.add(rootGroup);

    // Seated Body Group
    const bodyGroup = new THREE.Group();
    rootGroup.add(bodyGroup);

    // Torso (Plump, pear-shaped cozy cat body)
    const torsoGeo = new THREE.SphereGeometry(0.72, 32, 24);
    torsoGeo.scale(0.92, 1.24, 0.95);
    const torsoMesh = new THREE.Mesh(torsoGeo, orangeFurMat);
    torsoMesh.position.set(0, 0.12, -0.05);
    bodyGroup.add(torsoMesh);

    // Soft Cream Belly / Chest Bib
    const bellyGeo = new THREE.SphereGeometry(0.54, 28, 20);
    bellyGeo.scale(0.82, 1.12, 0.46);
    const bellyMesh = new THREE.Mesh(bellyGeo, creamFurMat);
    bellyMesh.position.set(0, 0.16, 0.44);
    bodyGroup.add(bellyMesh);

    // Subtle Tabby Back Stripes
    for (let s = 0; s < 3; s++) {
      const stripeGeo = new THREE.TorusGeometry(0.68 - s * 0.04, 0.032, 8, 24, Math.PI * 0.7);
      const stripeMesh = new THREE.Mesh(stripeGeo, stripeFurMat);
      stripeMesh.rotation.x = Math.PI / 2 + 0.15;
      stripeMesh.rotation.z = Math.PI * 0.15;
      stripeMesh.position.set(0, 0.42 - s * 0.22, -0.1);
      bodyGroup.add(stripeMesh);
    }

    // Seated Hind Haunches (Left and Right)
    const createHaunch = (isLeft) => {
      const haunchGeo = new THREE.SphereGeometry(0.38, 24, 18);
      haunchGeo.scale(0.85, 1.15, 1.18);
      const haunch = new THREE.Mesh(haunchGeo, orangeFurMat);
      haunch.position.set(isLeft ? -0.48 : 0.48, -0.22, -0.04);
      haunch.rotation.z = isLeft ? 0.18 : -0.18;
      haunch.rotation.y = isLeft ? -0.2 : 0.2;
      return haunch;
    };
    bodyGroup.add(createHaunch(true));
    bodyGroup.add(createHaunch(false));

    // Seated Back Paws
    const createBackPaw = (isLeft) => {
      const bPaw = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 14), creamFurMat);
      bPaw.scale.set(0.9, 0.6, 1.3);
      bPaw.position.set(isLeft ? -0.46 : 0.46, -0.44, 0.26);
      return bPaw;
    };
    bodyGroup.add(createBackPaw(true));
    bodyGroup.add(createBackPaw(false));

    // Burgundy Collar & Polished Gold Bell
    const collarGeo = new THREE.TorusGeometry(0.54, 0.038, 16, 32);
    collarGeo.scale(1.0, 0.88, 1.0);
    const collarMesh = new THREE.Mesh(collarGeo, collarMat);
    collarMesh.rotation.x = Math.PI / 2 + 0.14;
    collarMesh.position.set(0, 0.64, 0.06);
    bodyGroup.add(collarMesh);

    const bellMesh = new THREE.Mesh(new THREE.SphereGeometry(0.08, 20, 16), bellMat);
    bellMesh.position.set(0, 0.54, 0.58);
    bodyGroup.add(bellMesh);

    // Fluffy Articulated Tail
    const tailGroup = new THREE.Group();
    tailGroup.position.set(0.42, -0.36, -0.42);
    bodyGroup.add(tailGroup);

    const tailSegments = [];
    let currentTailAnchor = tailGroup;
    for (let t = 0; t < 6; t++) {
      const segGroup = new THREE.Group();
      const radius = Math.max(0.06, 0.095 - t * 0.007);
      const isTip = t >= 4;
      const segGeo = new THREE.CylinderGeometry(radius * 0.95, radius, 0.18, 16);
      const segMesh = new THREE.Mesh(segGeo, isTip ? creamFurMat : (t % 2 === 1 ? stripeFurMat : orangeFurMat));
      segMesh.position.y = 0.09;
      segGroup.add(segMesh);

      // Fluffy rounded tip on final segment
      if (t === 5) {
        const tipGeo = new THREE.SphereGeometry(radius * 1.25, 16, 16);
        const tipMesh = new THREE.Mesh(tipGeo, creamFurMat);
        tipMesh.position.y = 0.18;
        segGroup.add(tipMesh);
      }

      segGroup.position.y = t === 0 ? 0 : 0.15;
      currentTailAnchor.add(segGroup);
      tailSegments.push(segGroup);
      currentTailAnchor = segGroup;
    }

    // 7. HEAD GROUP (Pivot at neck base)
    const headGroup = new THREE.Group();
    headGroup.position.set(0, 0.84, 0.08);
    rootGroup.add(headGroup);

    // Cranium (Cute, rounded, chubby cheeks)
    const craniumGeo = new THREE.SphereGeometry(0.68, 32, 26);
    craniumGeo.scale(1.14, 0.96, 1.06);
    const craniumMesh = new THREE.Mesh(craniumGeo, orangeFurMat);
    headGroup.add(craniumMesh);

    // Chubby Fluffy Cheeks
    const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.30, 20, 18), orangeFurMat);
    cheekL.scale.set(1.12, 0.85, 0.9);
    cheekL.position.set(-0.35, -0.16, 0.32);
    headGroup.add(cheekL);

    const cheekR = cheekL.clone();
    cheekR.position.x = 0.35;
    headGroup.add(cheekR);

    // Soft Cream Muzzle & Whisker Pads
    const muzzlePadL = new THREE.Mesh(new THREE.SphereGeometry(0.20, 20, 16), creamFurMat);
    muzzlePadL.scale.set(1.05, 0.85, 0.9);
    muzzlePadL.position.set(-0.10, -0.13, 0.54);
    headGroup.add(muzzlePadL);

    const muzzlePadR = muzzlePadL.clone();
    muzzlePadR.position.x = 0.10;
    headGroup.add(muzzlePadR);

    // Cute Chin Patch
    const chinMesh = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 14), creamFurMat);
    chinMesh.scale.set(1.0, 0.7, 0.8);
    chinMesh.position.set(0, -0.24, 0.45);
    headGroup.add(chinMesh);

    // Baby Pink Soft Nose
    const noseGeo = new THREE.SphereGeometry(0.065, 16, 14);
    noseGeo.scale(1.15, 0.75, 0.75);
    const noseMesh = new THREE.Mesh(noseGeo, noseMat);
    noseMesh.position.set(0, -0.05, 0.70);
    headGroup.add(noseMesh);

    // Forehead Tabby Markings (Gentle stylized ginger accents)
    for (let m = -1; m <= 1; m++) {
      const browStripe = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.16, 8), stripeFurMat);
      browStripe.rotation.z = m * 0.25;
      browStripe.rotation.x = -0.3;
      browStripe.position.set(m * 0.12, 0.28, 0.62 - Math.abs(m) * 0.04);
      headGroup.add(browStripe);
    }

    // SOFT ROUNDED ORGANIC EARS (With fluffy inner ear tufts)
    const createEar = (isLeft) => {
      const earGroup = new THREE.Group();
      earGroup.position.set(isLeft ? -0.36 : 0.36, 0.46, 0.04);

      // Outer curved ear shell
      const earOuterGeo = new THREE.CylinderGeometry(0.05, 0.25, 0.44, 18, 4);
      earOuterGeo.scale(1.0, 1.0, 0.42);
      const earOuter = new THREE.Mesh(earOuterGeo, orangeFurMat);
      earOuter.position.y = 0.2;
      earOuter.rotation.y = isLeft ? 0.22 : -0.22;
      earOuter.rotation.z = isLeft ? 0.28 : -0.28;
      earOuter.rotation.x = -0.08;
      earGroup.add(earOuter);

      // Inner peachy pink ear cavity
      const earInnerGeo = new THREE.CylinderGeometry(0.03, 0.17, 0.34, 16, 4);
      earInnerGeo.scale(0.9, 0.9, 0.22);
      const earInner = new THREE.Mesh(earInnerGeo, innerEarMat);
      earInner.position.set(0, 0.16, 0.07);
      earInner.rotation.y = isLeft ? 0.22 : -0.22;
      earInner.rotation.z = isLeft ? 0.28 : -0.28;
      earInner.rotation.x = -0.08;
      earGroup.add(earInner);

      // Fluffy White Inner-Ear Fur Tufts
      for (let f = 0; f < 3; f++) {
        const fluff = new THREE.Mesh(new THREE.SphereGeometry(0.05, 12, 10), earFluffMat);
        fluff.scale.set(0.8, 1.3, 0.6);
        fluff.position.set(isLeft ? (0.02 + f * 0.03) : (-0.02 - f * 0.03), 0.06 + f * 0.05, 0.1);
        fluff.rotation.z = isLeft ? 0.4 : -0.4;
        earGroup.add(fluff);
      }

      return earGroup;
    };

    const leftEar = createEar(true);
    const rightEar = createEar(false);
    headGroup.add(leftEar);
    headGroup.add(rightEar);

    // EXPRESSIVE PIXAR-STYLE EYES (Crisp layered 3D geometry + Animated Eyelids)
    const createEye = (isLeft) => {
      const eyeAssembly = new THREE.Group();
      eyeAssembly.position.set(isLeft ? -0.24 : 0.24, 0.08, 0.52);

      // Rotating Eyeball Pivot
      const eyeballPivot = new THREE.Group();
      eyeAssembly.add(eyeballPivot);

      // 1. Sclera: Smooth white eyeball sphere
      const sclera = new THREE.Mesh(new THREE.SphereGeometry(0.16, 24, 20), eyeScleraMat);
      eyeballPivot.add(sclera);

      // 2. Iris: Warm luminous golden amber disc facing forward (+Z)
      const iris = new THREE.Mesh(new THREE.CircleGeometry(0.122, 32), eyeIrisMat);
      iris.position.set(0, 0, 0.158);
      eyeballPivot.add(iris);

      // 3. Dark Chocolate Limbal Ring
      const limbalRing = new THREE.Mesh(new THREE.RingGeometry(0.116, 0.126, 32), eyeLimbalMat);
      limbalRing.position.set(0, 0, 0.159);
      eyeballPivot.add(limbalRing);

      // 4. Velvety Obsidian Pupil (Large & cute)
      const pupil = new THREE.Mesh(new THREE.CircleGeometry(0.068, 28), eyePupilMat);
      pupil.position.set(0, 0, 0.160);
      eyeballPivot.add(pupil);

      // 5. Dual Pixar Specular Catchlights (Sparkling reflections)
      const glint1 = new THREE.Mesh(new THREE.CircleGeometry(0.025, 16), eyeCatchlightMat);
      glint1.position.set(isLeft ? 0.034 : 0.026, 0.038, 0.162);
      eyeballPivot.add(glint1);

      const glint2 = new THREE.Mesh(new THREE.CircleGeometry(0.012, 12), eyeCatchlightMat);
      glint2.position.set(isLeft ? -0.024 : -0.018, -0.028, 0.162);
      eyeballPivot.add(glint2);

      // Articulated Upper Eyelid Shell
      const upperLidGeo = new THREE.SphereGeometry(0.176, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.52);
      const upperLid = new THREE.Mesh(upperLidGeo, orangeFurMat);
      upperLid.rotation.x = -Math.PI * 0.52; // Tucked back when open
      eyeAssembly.add(upperLid);

      return { assembly: eyeAssembly, eyeballPivot, upperLid, pupil };
    };

    const eyeLeft = createEye(true);
    const eyeRight = createEye(false);
    headGroup.add(eyeLeft.assembly);
    headGroup.add(eyeRight.assembly);

    // 8. ARTICULATED FRONT PAWS (With Cute Rosy Pink Toe Beans)
    const createFrontPaw = (isLeft) => {
      const pawRoot = new THREE.Group();
      // Resting position on desk
      pawRoot.position.set(isLeft ? -0.24 : 0.24, -0.38, 0.48);

      // Forearm connecting to paw
      const legGeo = new THREE.CylinderGeometry(0.10, 0.12, 0.36, 16);
      const legMesh = new THREE.Mesh(legGeo, orangeFurMat);
      legMesh.position.set(0, -0.12, -0.06);
      legMesh.rotation.x = -0.35;
      pawRoot.add(legMesh);

      // Chubby White Paw Sock
      const pawMesh = new THREE.Mesh(new THREE.SphereGeometry(0.155, 20, 16), creamFurMat);
      pawMesh.scale.set(1.0, 0.7, 1.25);
      pawRoot.add(pawMesh);

      // Top Toe Creases
      for (let t = -1; t <= 1; t++) {
        const toe = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 10), creamFurMat);
        toe.scale.set(0.85, 0.55, 1.1);
        toe.position.set(t * 0.058, 0.02, 0.13);
        pawRoot.add(toe);
      }

      // UNDERSIDE: Rosy Pink Paw Pads (Toe Beans!)
      // Visible when covering eyes or waving
      const beanPadGeo = new THREE.SphereGeometry(0.065, 14, 12);
      beanPadGeo.scale(1.2, 0.4, 0.9);
      const beanPad = new THREE.Mesh(beanPadGeo, pawPadMat);
      beanPad.position.set(0, -0.07, 0.02);
      pawRoot.add(beanPad);

      for (let b = -1; b <= 1; b++) {
        const miniBean = new THREE.Mesh(new THREE.SphereGeometry(0.03, 10, 8), pawPadMat);
        miniBean.scale.set(0.9, 0.4, 0.9);
        miniBean.position.set(b * 0.055, -0.06, 0.09);
        pawRoot.add(miniBean);
      }

      return pawRoot;
    };

    const leftPaw = createFrontPaw(true);
    const rightPaw = createFrontPaw(false);
    rootGroup.add(leftPaw);
    rootGroup.add(rightPaw);

    // 9. CURSOR TRACKING & INTERACTIVE EVENT LISTENERS
    const updateTargetCoords = (clientX, clientY) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      // Distance from cat center for curiosity detection
      const distFromCat = Math.hypot(clientX - centerX, clientY - centerY);
      stateRef.current.isCuriousNear = distFromCat < 260;

      // Normalized coordinates relative to window
      const nx = ((clientX - centerX) / (window.innerWidth / 2));
      const ny = ((clientY - centerY) / (window.innerHeight / 2));

      stateRef.current.targetMouseX = Math.max(-1, Math.min(1, nx));
      stateRef.current.targetMouseY = Math.max(-1, Math.min(1, ny));
    };

    const handleMouseMove = (e) => {
      updateTargetCoords(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (!e.touches || e.touches.length === 0) return;
      const touch = e.touches[0];
      updateTargetCoords(touch.clientX, touch.clientY);
    };

    // TAP / CLICK INTERACTION (Happy purr & curious reaction)
    const handleCatTap = (e) => {
      e.stopPropagation();
      const state = stateRef.current;
      state.tapCount += 1;
      state.tapReactionTimer = 1.4; // 1.4s animated reaction

      if (state.tapCount >= 2) {
        state.isPurring = true;
        if (onCatInteraction) {
          onCatInteraction('purr');
        }
      } else {
        if (onCatInteraction) {
          onCatInteraction('curious');
        }
      }

      // Reset purr/tap state after interval
      setTimeout(() => {
        if (stateRef.current) {
          stateRef.current.isPurring = false;
          stateRef.current.tapCount = 0;
        }
      }, 2800);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('click', handleCatTap);
    container.addEventListener('touchstart', handleCatTap, { passive: true });

    // 10. ANIMATION TICKER LOOP
    let animationFrameId;
    let clock = new THREE.Clock();
    let nextBlinkTime = 2.0;
    let blinkProgress = 0;
    let isBlinking = false;
    let nextEarTwitch = 3.5;
    let earTwitchProgress = 0;
    let earTwitchSide = 1;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);
      const time = clock.getElapsedTime();
      const state = stateRef.current;

      // Soft Damped Lerp toward target cursor coordinates
      const lerpFactor = state.isReducedMotion ? 0.02 : 0.065;
      state.mouseX += (state.targetMouseX - state.mouseX) * lerpFactor;
      state.mouseY += (state.targetMouseY - state.mouseY) * lerpFactor;

      if (state.tapReactionTimer > 0) {
        state.tapReactionTimer -= delta;
      }

      // IDLE BREATHING OSCILLATION
      const breathSpeed = state.isPurring ? 4.5 : 2.0;
      const breath = Math.sin(time * breathSpeed);
      torsoMesh.scale.set(0.92 + breath * 0.015, 1.24 + breath * 0.022, 0.95 + breath * 0.015);
      bellyMesh.scale.set(0.82 + breath * 0.02, 1.12 + breath * 0.028, 0.46 + breath * 0.02);
      headGroup.position.y = 0.84 + breath * 0.014;

      // PURR VIBRATION (When repeatedly tapped)
      if (state.isPurring) {
        const purrTremor = Math.sin(time * 36) * 0.015;
        bodyGroup.position.x = purrTremor;
      } else {
        bodyGroup.position.x = 0;
      }

      // ORGANIC S-CURVE TAIL SWISH
      const tailSpeed = state.authStatus === 'success' ? 7.0 : (state.isPurring ? 5.0 : 1.6);
      const tailAmp = state.authStatus === 'success' ? 0.38 : (state.isPurring ? 0.3 : 0.16);
      tailSegments.forEach((seg, idx) => {
        const phaseOffset = idx * 0.42;
        seg.rotation.z = Math.sin(time * tailSpeed - phaseOffset) * (tailAmp * (idx + 1) * 0.22);
      });

      // NATURAL BLINKING
      let targetLidRotX = -Math.PI * 0.52; // Tucked back into brow

      if (!isBlinking && time > nextBlinkTime) {
        isBlinking = true;
        blinkProgress = 0;
      }

      if (isBlinking) {
        blinkProgress += delta * 12; // Natural 160ms blink
        const blinkPhase = Math.sin(blinkProgress);
        if (blinkProgress >= Math.PI) {
          isBlinking = false;
          nextBlinkTime = time + 2.8 + Math.random() * 3.8;
          targetLidRotX = -Math.PI * 0.52;
        } else {
          targetLidRotX = -Math.PI * 0.52 + blinkPhase * (Math.PI * 0.52 + 0.05);
        }
      }

      // EAR TWITCH SYSTEM
      if (earTwitchProgress <= 0 && time > nextEarTwitch) {
        earTwitchProgress = 1.0;
        earTwitchSide = Math.random() > 0.5 ? 1 : -1;
        nextEarTwitch = time + 3.0 + Math.random() * 4.5;
      }

      if (earTwitchProgress > 0) {
        earTwitchProgress -= delta * 6.5;
        const twitchAngle = Math.sin(earTwitchProgress * Math.PI * 3) * 0.18;
        if (earTwitchSide > 0) {
          leftEar.rotation.x = Math.max(0, twitchAngle);
        } else {
          rightEar.rotation.x = Math.max(0, twitchAngle);
        }
      } else {
        leftEar.rotation.x = 0;
        rightEar.rotation.x = 0;
      }

      // TARGET HEAD ROTATIONS (Yaw, Pitch, Roll)
      let targetHeadRotY = state.mouseX * 0.52; // Max ~30 deg yaw
      let targetHeadRotX = -state.mouseY * 0.28; // Max ~16 deg pitch
      let targetHeadRotZ = state.mouseX * 0.14; // Natural cute head roll

      // CONTEXTUAL EMOTIONAL BEHAVIORS:
      // A. USERNAME FIELD FOCUSED -> Look toward the login input on the right!
      if (state.isUsernameFocused) {
        targetHeadRotY = -0.42; // Turns head right to inspect login card
        targetHeadRotX = 0.06;
        targetHeadRotZ = -0.08;
      }

      // B. CURSOR IS NEAR THE CAT -> Curious Head Tilt
      if (state.isCuriousNear && !state.isCoveringEyes) {
        targetHeadRotZ += 0.16;
      }

      // C. PASSWORD FIELD FOCUSED -> SHY "COVER EYES" REACTION
      const headOffsetY = headGroup.position.y - 0.84;
      // Rest positions
      const targetPawL = { x: -0.22, y: -0.36, z: 0.52, rotX: 0, rotY: 0, rotZ: 0 };
      const targetPawR = { x: 0.22, y: -0.36, z: 0.52, rotX: 0, rotY: 0, rotZ: 0 };

      if (state.isCoveringEyes) {
        // Face forward shyly so paws cover both eyes symmetrically!
        targetHeadRotY = 0;
        targetHeadRotX = 0.02;
        targetHeadRotZ = 0;

        // Raise paws directly over both eyes!
        targetPawL.x = -0.22;
        targetPawL.y = 0.95 + headOffsetY;
        targetPawL.z = 0.86; // Proudly in front of eyes
        targetPawL.rotX = 0.15;
        targetPawL.rotY = 0.25;
        targetPawL.rotZ = 0.15;

        targetPawR.x = 0.22;
        targetPawR.y = 0.95 + headOffsetY;
        targetPawR.z = 0.86; // Proudly in front of eyes
        targetPawR.rotX = 0.15;
        targetPawR.rotY = -0.25;
        targetPawR.rotZ = -0.15;

        // Shy half-hooded eyelids (peek)
        targetLidRotX = -Math.PI * 0.22;
      } else if (state.isPurring) {
        // Happy smiling eyelids (^ ^)
        targetLidRotX = -Math.PI * 0.16;
      }

      // Apply eyelid rotations
      eyeLeft.upperLid.rotation.x += (targetLidRotX - eyeLeft.upperLid.rotation.x) * 0.22;
      eyeRight.upperLid.rotation.x += (targetLidRotX - eyeRight.upperLid.rotation.x) * 0.22;

      // Smooth paw movement lerp
      leftPaw.position.x += (targetPawL.x - leftPaw.position.x) * 0.16;
      leftPaw.position.y += (targetPawL.y - leftPaw.position.y) * 0.16;
      leftPaw.position.z += (targetPawL.z - leftPaw.position.z) * 0.16;
      leftPaw.rotation.x += (targetPawL.rotX - leftPaw.rotation.x) * 0.16;
      leftPaw.rotation.y += (targetPawL.rotY - leftPaw.rotation.y) * 0.16;
      leftPaw.rotation.z += (targetPawL.rotZ - leftPaw.rotation.z) * 0.16;

      rightPaw.position.x += (targetPawR.x - rightPaw.position.x) * 0.16;
      rightPaw.position.y += (targetPawR.y - rightPaw.position.y) * 0.16;
      rightPaw.position.z += (targetPawR.z - rightPaw.position.z) * 0.16;
      rightPaw.rotation.x += (targetPawR.rotX - rightPaw.rotation.x) * 0.16;
      rightPaw.rotation.y += (targetPawR.rotY - rightPaw.rotation.y) * 0.16;
      rightPaw.rotation.z += (targetPawR.rotZ - rightPaw.rotation.z) * 0.16;

      // D. AUTHENTICATION ERROR -> CONCERNED EXPRESSION
      if (state.authStatus === 'error') {
        const errorTremor = Math.sin(time * 26) * 0.04;
        rootGroup.position.x = errorTremor;
        targetHeadRotZ = 0.24; // Concerned head tilt
        targetHeadRotX = -0.12;
        leftEar.rotation.z = 0.42; // Drooped/flattened ears
        rightEar.rotation.z = -0.42;
      } else {
        rootGroup.position.x += (0 - rootGroup.position.x) * 0.1;
        leftEar.rotation.z = 0;
        rightEar.rotation.z = 0;
      }

      // E. AUTHENTICATION SUCCESS -> CHEERFUL CELEBRATORY BOUNCE
      if (state.authStatus === 'success') {
        const happyBounce = Math.abs(Math.sin(time * 7.5)) * 0.16;
        rootGroup.position.y = -0.4 + happyBounce;
        targetHeadRotX = 0.18; // Proud happy head lift
      } else {
        rootGroup.position.y += (-0.4 - rootGroup.position.y) * 0.1;
      }

      // APPLY HEAD ROTATIONS
      headGroup.rotation.y += (targetHeadRotY - headGroup.rotation.y) * 0.085;
      headGroup.rotation.x += (targetHeadRotX - headGroup.rotation.x) * 0.085;
      headGroup.rotation.z += (targetHeadRotZ - headGroup.rotation.z) * 0.085;

      // BODY PARALLAX LAG
      bodyGroup.rotation.y += (targetHeadRotY * 0.25 - bodyGroup.rotation.y) * 0.06;

      // EYEBALLS ROTATE WITHIN SOCKETS TO TRACK CURSOR
      const eyeLookY = THREE.MathUtils.clamp(state.mouseX * 0.42, -0.38, 0.38);
      const eyeLookX = THREE.MathUtils.clamp(-state.mouseY * 0.32, -0.28, 0.28);
      eyeLeft.eyeballPivot.rotation.y = eyeLookY;
      eyeLeft.eyeballPivot.rotation.x = eyeLookX;
      eyeRight.eyeballPivot.rotation.y = eyeLookY;
      eyeRight.eyeballPivot.rotation.x = eyeLookX;

      renderer.render(scene, camera);
    };

    animate();

    // RESIZE OBSERVER
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        const newWidth = entry.contentRect.width;
        const newHeight = entry.contentRect.height;
        if (newWidth && newHeight) {
          camera.aspect = newWidth / newHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(newWidth, newHeight);
        }
      }
    });
    resizeObserver.observe(container);

    // CLEANUP ON UNMOUNT
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('click', handleCatTap);
      container.removeEventListener('touchstart', handleCatTap);
      mediaQuery.removeEventListener('change', handleMotionChange);
      resizeObserver.disconnect();

      // Dispose Geometries & Materials
      scene.traverse((child) => {
        if (child.isMesh) {
          child.geometry?.dispose();
          if (Array.isArray(child.material)) {
            child.material.forEach((m) => m.dispose());
          } else {
            child.material?.dispose();
          }
        }
      });

      shadowGeo.dispose();
      shadowMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [size]);

  return (
    <div
      className={`wattvision-interactive-cat-canvas-wrap ${className}`}
      ref={mountRef}
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'pointer',
        userSelect: 'none',
        touchAction: 'none'
      }}
      title="Click or tap to interact with your orange cat companion!"
      aria-label="Interactive 3D orange cat companion"
    />
  );
}

