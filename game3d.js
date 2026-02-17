import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const container = document.getElementById('game3d');
if (!container) throw new Error('Missing #game3d container');

const scoreEl = document.getElementById('hudScore');
const timerEl = document.getElementById('hudTimer');
const comboEl = document.getElementById('hudCombo');
const stateEl = document.getElementById('hudState');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xeef4ee);
scene.fog = new THREE.Fog(0xeef4ee, 18, 120);

const camera = new THREE.PerspectiveCamera(62, container.clientWidth / container.clientHeight, 0.1, 240);
camera.position.set(0, 6, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xffffff, 0x8cb396, 1.1);
scene.add(hemi);

const sun = new THREE.DirectionalLight(0xffffff, 1);
sun.position.set(14, 24, 10);
sun.castShadow = true;
sun.shadow.mapSize.set(1024, 1024);
scene.add(sun);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(180, 180),
  new THREE.MeshStandardMaterial({ color: 0xcfe9ce, roughness: 0.95 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const arena = new THREE.Mesh(
  new THREE.RingGeometry(42, 43, 100),
  new THREE.MeshBasicMaterial({ color: 0x6ead74, side: THREE.DoubleSide })
);
arena.rotation.x = -Math.PI / 2;
scene.add(arena);

function createCharacter() {
  const g = new THREE.Group();

  const body = new THREE.Mesh(
    new THREE.CapsuleGeometry(0.48, 0.95, 8, 16),
    new THREE.MeshStandardMaterial({ color: 0x3e8f56, roughness: 0.45 })
  );
  body.position.y = 1.5;
  body.castShadow = true;

  const head = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0xf2d4b7, roughness: 0.8 })
  );
  head.position.set(0, 2.35, 0);
  head.castShadow = true;

  const backpack = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.6, 0.2),
    new THREE.MeshStandardMaterial({ color: 0x2e7a4a, roughness: 0.6 })
  );
  backpack.position.set(0, 1.55, -0.35);
  backpack.castShadow = true;

  const legGeo = new THREE.CapsuleGeometry(0.13, 0.65, 6, 10);
  const legMat = new THREE.MeshStandardMaterial({ color: 0x29413a });
  const legL = new THREE.Mesh(legGeo, legMat);
  const legR = new THREE.Mesh(legGeo, legMat);
  legL.position.set(-0.2, 0.75, 0);
  legR.position.set(0.2, 0.75, 0);
  legL.castShadow = legR.castShadow = true;

  const armGeo = new THREE.CapsuleGeometry(0.1, 0.55, 6, 10);
  const armMat = new THREE.MeshStandardMaterial({ color: 0xf2d4b7 });
  const armL = new THREE.Mesh(armGeo, armMat);
  const armR = new THREE.Mesh(armGeo, armMat);
  armL.position.set(-0.55, 1.55, 0);
  armR.position.set(0.55, 1.55, 0);
  armL.rotation.z = 0.25;
  armR.rotation.z = -0.25;

  g.add(body, head, backpack, legL, legR, armL, armR);
  g.userData = { legL, legR, armL, armR };
  return g;
}

const player = createCharacter();
player.position.set(0, 0, 0);
scene.add(player);

const obstacles = [];
for (let i = 0; i < 18; i += 1) {
  const trunk = new THREE.Mesh(
    new THREE.CylinderGeometry(0.2, 0.25, 1.6, 12),
    new THREE.MeshStandardMaterial({ color: 0x6f4a2f, roughness: 0.9 })
  );
  const leaves = new THREE.Mesh(
    new THREE.SphereGeometry(0.65, 12, 12),
    new THREE.MeshStandardMaterial({ color: 0x4ea55b, roughness: 0.85 })
  );
  const tree = new THREE.Group();
  tree.add(trunk, leaves);
  leaves.position.y = 1;
  tree.position.set((Math.random() - 0.5) * 76, 0.8, (Math.random() - 0.5) * 76);
  tree.traverse((o) => { o.castShadow = true; o.receiveShadow = true; });
  scene.add(tree);
  obstacles.push(tree);
}

const goals = [];
for (let i = 0; i < 12; i += 1) {
  const orb = new THREE.Mesh(
    new THREE.IcosahedronGeometry(0.36, 0),
    new THREE.MeshStandardMaterial({ color: 0x70dd7d, emissive: 0x1e7d33, emissiveIntensity: 0.65 })
  );
  orb.position.set((Math.random() - 0.5) * 64, 0.45, (Math.random() - 0.5) * 64);
  orb.castShadow = true;
  scene.add(orb);
  goals.push(orb);
}

const keys = new Set();
let score = 0;
let timer = 150;
let combo = 1;
let comboTimeout = 0;
let ended = false;
let timerAcc = 0;
let last = performance.now();
let walkCycle = 0;

const move = new THREE.Vector3();

window.addEventListener('keydown', (e) => keys.add(e.code));
window.addEventListener('keyup', (e) => keys.delete(e.code));
window.addEventListener('resize', () => {
  const w = container.clientWidth;
  const h = container.clientHeight;
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  renderer.setSize(w, h);
});

function tLocal(ru, kz) {
  return (window.getLang && window.getLang() === 'kz') ? kz : ru;
}

function intersectsObstacle(nextPos) {
  const box = new THREE.Box3().setFromCenterAndSize(
    new THREE.Vector3(nextPos.x, 1.2, nextPos.z),
    new THREE.Vector3(0.9, 2, 0.9)
  );
  return obstacles.some((o) => box.intersectsBox(new THREE.Box3().setFromObject(o)));
}

function animateCharacter(speed, delta) {
  const limbs = player.userData;
  if (!limbs) return;
  if (speed > 0.01) {
    walkCycle += delta * 9;
    limbs.legL.rotation.x = Math.sin(walkCycle) * 0.55;
    limbs.legR.rotation.x = -Math.sin(walkCycle) * 0.55;
    limbs.armL.rotation.x = -Math.sin(walkCycle) * 0.45;
    limbs.armR.rotation.x = Math.sin(walkCycle) * 0.45;
  } else {
    limbs.legL.rotation.x *= 0.85;
    limbs.legR.rotation.x *= 0.85;
    limbs.armL.rotation.x *= 0.85;
    limbs.armR.rotation.x *= 0.85;
  }
}

function update(delta) {
  if (ended) return;

  comboTimeout += delta;
  if (comboTimeout > 4 && combo > 1) {
    combo = 1;
    comboEl.textContent = `x${combo}`;
  }

  const speed = keys.has('ShiftLeft') ? 10.5 : 8;
  move.set(0, 0, 0);
  if (keys.has('KeyW')) move.z -= 1;
  if (keys.has('KeyS')) move.z += 1;
  if (keys.has('KeyA')) move.x -= 1;
  if (keys.has('KeyD')) move.x += 1;

  let currentSpeed = 0;
  if (move.lengthSq() > 0) {
    move.normalize().multiplyScalar(speed * delta);
    const next = player.position.clone().add(move);
    if (!intersectsObstacle(next)) {
      player.position.copy(next);
      currentSpeed = move.length();
      player.rotation.y = Math.atan2(move.x, move.z);
    }
  }

  animateCharacter(currentSpeed, delta);

  goals.forEach((g) => {
    g.rotation.y += delta * 2;
    g.position.y = 0.45 + Math.sin(performance.now() * 0.002 + g.position.x) * 0.03;
    if (g.visible && g.position.distanceTo(player.position) < 1.05) {
      g.visible = false;
      combo = Math.min(6, combo + 1);
      comboTimeout = 0;
      score += 10 * combo;
      scoreEl.textContent = String(score);
      comboEl.textContent = `x${combo}`;
    }
  });

  const remaining = goals.filter((g) => g.visible).length;
  if (remaining === 0) {
    ended = true;
    stateEl.textContent = tLocal('🏆 Победа! Персонаж очистил всю эко-зону!', '🏆 Жеңіс! Кейіпкер барлық эко-сфераны жинады!');
  }

  timerAcc += delta;
  if (timerAcc >= 1) {
    timerAcc = 0;
    timer -= 1;
    timerEl.textContent = String(timer);
    if (timer <= 0) {
      ended = true;
      stateEl.textContent = tLocal('❌ Время вышло. Попробуй еще раз!', '❌ Уақыт бітті. Қайта байқап көр!');
    }
  }

  const camTarget = new THREE.Vector3(player.position.x, player.position.y + 5.2, player.position.z + 10);
  camera.position.lerp(camTarget, 0.09);
  camera.lookAt(player.position.x, player.position.y + 1.5, player.position.z);
}

function loop(now) {
  const delta = Math.min(0.03, (now - last) / 1000);
  last = now;
  update(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
