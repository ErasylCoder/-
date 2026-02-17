import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const container = document.getElementById('game3d');
if (!container) throw new Error('Missing #game3d container');

const scoreEl = document.getElementById('hudScore');
const timerEl = document.getElementById('hudTimer');
const comboEl = document.getElementById('hudCombo');
const stateEl = document.getElementById('hudState');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdff7e6);
scene.fog = new THREE.Fog(0xdff7e6, 18, 90);

const camera = new THREE.PerspectiveCamera(62, container.clientWidth / container.clientHeight, 0.1, 220);
camera.position.set(0, 6, 11);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0xffffff, 0x7bb98f, 1.1);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 1.1);
dir.position.set(10, 18, 7);
dir.castShadow = true;
scene.add(dir);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(150, 150),
  new THREE.MeshStandardMaterial({ color: 0x6dbd7c, roughness: 0.85 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const player = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.55, 1.4, 8, 16),
  new THREE.MeshStandardMaterial({ color: 0x3ba7ff, metalness: 0.25, roughness: 0.35 })
);
player.position.set(0, 1.2, 0);
player.castShadow = true;
scene.add(player);

const obstacles = [];
for (let i = 0; i < 14; i += 1) {
  const rock = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 1.6, 1.6),
    new THREE.MeshStandardMaterial({ color: 0x2d6140 })
  );
  rock.position.set((Math.random() - 0.5) * 50, 0.8, (Math.random() - 0.5) * 50);
  rock.castShadow = true;
  scene.add(rock);
  obstacles.push(rock);
}

const goals = [];
for (let i = 0; i < 10; i += 1) {
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.36, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0x9affae, emissive: 0x1b7d37, emissiveIntensity: 0.8 })
  );
  orb.position.set((Math.random() - 0.5) * 44, 0.45, (Math.random() - 0.5) * 44);
  orb.castShadow = true;
  scene.add(orb);
  goals.push(orb);
}

const keys = new Set();
let score = 0;
let timer = 140;
let ended = false;
let combo = 1;
let comboTimeout = 0;
let last = performance.now();
let timerAcc = 0;

const velocity = new THREE.Vector3();

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
  const pBox = new THREE.Box3().setFromCenterAndSize(nextPos, new THREE.Vector3(1.05, 2.2, 1.05));
  return obstacles.some((o) => pBox.intersectsBox(new THREE.Box3().setFromObject(o)));
}

function update(delta) {
  if (ended) return;

  comboTimeout += delta;
  if (comboTimeout > 4 && combo > 1) {
    combo = 1;
    comboEl.textContent = `x${combo}`;
  }

  const speed = 8.2;
  velocity.set(0, 0, 0);
  if (keys.has('KeyW')) velocity.z -= 1;
  if (keys.has('KeyS')) velocity.z += 1;
  if (keys.has('KeyA')) velocity.x -= 1;
  if (keys.has('KeyD')) velocity.x += 1;
  if (velocity.lengthSq() > 0) velocity.normalize().multiplyScalar(speed * delta);

  const nextPos = player.position.clone().add(new THREE.Vector3(velocity.x, 0, velocity.z));
  if (!intersectsObstacle(nextPos)) player.position.copy(nextPos);

  goals.forEach((g) => {
    g.rotation.y += delta * 2;
    if (g.visible && g.position.distanceTo(player.position) < 1.2) {
      g.visible = false;
      combo = Math.min(5, combo + 1);
      comboTimeout = 0;
      score += 10 * combo;
      scoreEl.textContent = String(score);
      comboEl.textContent = `x${combo}`;
    }
  });

  const remaining = goals.filter((g) => g.visible).length;
  if (remaining === 0) {
    ended = true;
    stateEl.textContent = tLocal('🏆 Победа! Ты собрал все эко-сферы!', '🏆 Жеңіс! Барлық эко-сфера жиналды!');
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

  const camTarget = new THREE.Vector3(player.position.x, player.position.y + 4.3, player.position.z + 8.5);
  camera.position.lerp(camTarget, 0.085);
  camera.lookAt(player.position.x, player.position.y + 1, player.position.z);
}

function loop(now) {
  const delta = Math.min(0.03, (now - last) / 1000);
  last = now;
  update(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
