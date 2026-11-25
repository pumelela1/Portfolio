// The 3D hero scene ONLY. Placeholder hero built from simple shapes:
// replace buildHero() with your own suit/model later (e.g. a .glb from Blender or VRoid).
import * as THREE from 'three';

// Read colours from theme.css so the hero follows the site theme.
function cssColor(name, fallback) {
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  return new THREE.Color(v || fallback);
}

function buildHero() {
  const C = {
    suit: cssColor('--hero-suit', '#9a9a9a'),
    panel: cssColor('--hero-panel', '#555555'),
    detail: cssColor('--hero-detail', '#222222'),
    glow: cssColor('--hero-glow', '#ffffff'),
  };
  const mat = (c) => new THREE.MeshStandardMaterial({ color: c, roughness: 0.5, metalness: 0.1 });
  const glowMat = new THREE.MeshStandardMaterial({ color: C.glow, emissive: C.glow, emissiveIntensity: 0.6 });

  const root = new THREE.Group();   // position + direction
  const pitch = new THREE.Group();  // forward tilt while flying
  const body = new THREE.Group();   // squash on landing
  root.add(pitch); pitch.add(body);
  pitch.position.y = 1.5; body.position.y = -1.5;

  const limb = (r, h, c) => { const g = new THREE.CylinderGeometry(r, r * 0.9, h, 16); g.translate(0, -h / 2, 0); return new THREE.Mesh(g, mat(c)); };

  for (const x of [-0.2, 0.2]) {
    const leg = limb(0.15, 1.15, C.suit); leg.position.set(x, 1.2, 0); body.add(leg);
    const boot = new THREE.Mesh(new THREE.CylinderGeometry(0.17, 0.19, 0.32, 16), mat(C.detail)); boot.position.set(x, 0.16, 0.02); body.add(boot);
  }
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.3, 1.1, 24), mat(C.suit)); torso.position.y = 1.75; body.add(torso);
  const side = new THREE.Mesh(new THREE.CylinderGeometry(0.425, 0.305, 1.1, 24, 1, true, Math.PI * 0.6, Math.PI * 0.8), mat(C.panel)); side.position.y = 1.75; body.add(side);
  const belt = new THREE.Mesh(new THREE.TorusGeometry(0.31, 0.04, 10, 40), mat(C.detail)); belt.rotation.x = Math.PI / 2; belt.position.y = 1.24; body.add(belt);
  const emblem = new THREE.Mesh(new THREE.OctahedronGeometry(0.13), glowMat); emblem.position.set(0, 1.95, 0.4); emblem.scale.set(1, 1.3, 0.5); body.add(emblem);
  for (const x of [-0.5, 0.5]) { const s = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 12), mat(C.panel)); s.position.set(x, 2.22, 0); body.add(s); }
  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.18, 12), mat(0x8a5a44)); neck.position.y = 2.38; body.add(neck);
  const head = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 18), mat(0x8a5a44)); head.position.y = 2.66; body.add(head);
  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.33, 24, 18, 0, Math.PI * 2, 0, Math.PI * 0.55), mat(0x3a2340)); hair.position.set(0, 2.68, -0.03); body.add(hair);
  const puff = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 16), mat(0x3a2340)); puff.position.set(0, 3.02, -0.12); body.add(puff);

  const arm = (x) => {
    const p = new THREE.Group(); p.position.set(x, 2.22, 0);
    p.add(limb(0.1, 0.95, C.suit));
    const glove = new THREE.Mesh(new THREE.SphereGeometry(0.12, 12, 10), mat(C.detail)); glove.position.y = -0.98; p.add(glove);
    body.add(p); return p;
  };
  const armR = arm(0.52), armL = arm(-0.52);

  const capeGeo = new THREE.PlaneGeometry(1.0, 1.9, 8, 14); capeGeo.translate(0, -0.95, 0);
  const capeBase = capeGeo.attributes.position.array.slice();
  const cape = new THREE.Mesh(capeGeo, new THREE.MeshStandardMaterial({ color: C.panel, side: THREE.DoubleSide, roughness: 0.7 }));
  cape.position.set(0, 2.25, -0.33); body.add(cape);

  return { root, pitch, body, armR, armL, emblem, capeGeo, capeBase };
}

export function startHeroScene(container, onLanded) {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 200);
  const camBase = new THREE.Vector3(0, 3, 12);
  const camTarget = new THREE.Vector3(0, 2.1, 0);

  function fit() {
    const w = container.clientWidth, h = container.clientHeight;
    camera.aspect = w / h;
    camBase.z = camera.aspect < 0.8 ? 17 : 12;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', fit); fit();

  scene.add(new THREE.HemisphereLight(0xffffff, 0xcccccc, 1.2));
  const key = new THREE.DirectionalLight(0xffffff, 1.2); key.position.set(4, 8, 6); scene.add(key);

  const platform = new THREE.Mesh(new THREE.CylinderGeometry(3, 3.3, 0.35, 64), new THREE.MeshStandardMaterial({ color: 0xe6e6e6, roughness: 0.7 }));
  platform.position.y = -0.18; scene.add(platform);
  const shock = new THREE.Mesh(new THREE.RingGeometry(0.9, 1.0, 64), new THREE.MeshBasicMaterial({ color: 0x777777, transparent: true, opacity: 0, side: THREE.DoubleSide }));
  shock.rotation.x = -Math.PI / 2; shock.position.y = 0.02; scene.add(shock);

  const hero = buildHero();
  scene.add(hero.root);

  // Timeline (seconds)
  const FLY_END = 3.2, LAND_END = 4.1, WAVE_START = 4.6, WAVE_END = 6.2, TEXT_AT = 5.2;
  const P0 = new THREE.Vector3(-17, 10, -9), P1 = new THREE.Vector3(-5, 7.5, 5), P2 = new THREE.Vector3(0, 0, 0);
  const bez = (t, o) => { const u = 1 - t; return o.set(0, 0, 0).addScaledVector(P0, u * u).addScaledVector(P1, 2 * u * t).addScaledVector(P2, t * t); };
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const ease = (t) => t * t * (3 - 2 * t);
  const tmp = new THREE.Vector3();

  let t0 = performance.now(), landedFired = false, shockT = -1;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) t0 -= 8000;

  let visible = true;
  new IntersectionObserver((e) => { visible = e[0].isIntersecting; }).observe(container);

  function animate(now) {
    requestAnimationFrame(animate);
    if (!visible) return;
    const t = (now - t0) / 1000;
    const { root, pitch, body, armR, armL, emblem, capeGeo, capeBase } = hero;

    if (t < FLY_END) {
      const s = clamp(t / FLY_END);
      bez(s, root.position); bez(Math.min(1, s + 0.01), tmp);
      root.rotation.y = Math.atan2(tmp.x - root.position.x, tmp.z - root.position.z);
      pitch.rotation.x = THREE.MathUtils.lerp(1.3, 0.25, clamp((s - 0.75) / 0.25));
      armR.rotation.set(-Math.PI * 0.95, 0, 0); armL.rotation.set(0.35, 0, 0.1);
      body.scale.y = 1; body.position.y = -1.5;
    } else {
      root.position.copy(P2);
      const l = clamp((t - FLY_END) / (LAND_END - FLY_END));
      root.rotation.y = THREE.MathUtils.lerp(root.rotation.y, 0, 0.15);
      pitch.rotation.x = THREE.MathUtils.lerp(0.25, 0, l);
      const sq = l < 0.35 ? 1 - 0.28 * ease(l / 0.35) : 0.72 + 0.28 * ease((l - 0.35) / 0.65);
      body.scale.y = sq; body.position.y = -1.5 * sq;
      if (t < LAND_END) { armR.rotation.set(-0.5, 0, -0.2); armL.rotation.set(0.6, 0, 0.25); }
      else if (t > WAVE_START && t < WAVE_END) {
        const up = Math.sin(Math.PI * (t - WAVE_START) / (WAVE_END - WAVE_START));
        armR.rotation.set(0, 0, -2.5 * up + Math.sin(t * 12) * 0.25 * up); armL.rotation.set(0.1, 0, 0.12);
      } else { armR.rotation.set(0.05, 0, -0.12); armL.rotation.set(0.05, 0, 0.12); }
      if (shockT < 0) shockT = t;
    }
    if (!landedFired && t > TEXT_AT) { landedFired = true; onLanded && onLanded(); }

    emblem.rotation.y = t * 1.5;
    const ca = capeGeo.attributes.position, fly = t < FLY_END ? 1 : 0.35;
    for (let i = 0; i < ca.count; i++) {
      const y = capeBase[i * 3 + 1], x = capeBase[i * 3], d = -y / 1.9;
      ca.array[i * 3 + 2] = capeBase[i * 3 + 2] - d * (0.35 * fly + 0.1) + Math.sin(t * 6 * fly + d * 5 + x * 2) * 0.12 * d * (fly + 0.3);
    }
    ca.needsUpdate = true;

    if (shockT >= 0) { const k = clamp((t - shockT) / 0.9); shock.scale.setScalar(1 + k * 5); shock.material.opacity = (1 - k) * 0.6; }
    else shock.material.opacity = 0;

    camera.position.copy(camBase);
    if (t < FLY_END) { camera.position.x += root.position.x * 0.12; camera.position.y += root.position.y * 0.08; }
    if (shockT >= 0) { const k = clamp((t - shockT) / 0.5), amp = (1 - k) * 0.15; camera.position.x += (Math.random() - 0.5) * amp; camera.position.y += (Math.random() - 0.5) * amp; }
    camera.lookAt(camTarget);
    renderer.render(scene, camera);
  }
  requestAnimationFrame(animate);

  return {
    replay() { t0 = performance.now(); landedFired = false; shockT = -1; },
  };
}
