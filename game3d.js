import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';

const container = document.getElementById('game3d');
const scoreEl = document.getElementById('hudScore');
const timerEl = document.getElementById('hudTimer');
const stateEl = document.getElementById('hudState');
if (!container) throw new Error('Missing #game3d container');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b1220);
scene.fog = new THREE.Fog(0x0b1220, 12, 60);

const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 200);
camera.position.set(0, 5, 10);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.shadowMap.enabled = true;
container.appendChild(renderer.domElement);

const hemi = new THREE.HemisphereLight(0x8ec5ff, 0x2a4a3f, 0.8);
scene.add(hemi);
const dir = new THREE.DirectionalLight(0xffffff, 0.9);
dir.position.set(8, 14, 6);
dir.castShadow = true;
scene.add(dir);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(120, 120),
  new THREE.MeshStandardMaterial({ color: 0x174030, roughness: 0.9, metalness: 0.1 })
);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const player = new THREE.Mesh(
  new THREE.CapsuleGeometry(0.5, 1.3, 8, 16),
  new THREE.MeshStandardMaterial({ color: 0x4cc0ff, metalness: 0.2, roughness: 0.4 })
);
player.position.set(0, 1.2, 0);
player.castShadow = true;
scene.add(player);

const obstacles = [];
for (let i = 0; i < 12; i += 1) {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(1.5, 1.5, 1.5),
    new THREE.MeshStandardMaterial({ color: 0x2a5f42 })
  );
  box.position.set((Math.random() - 0.5) * 40, 0.75, (Math.random() - 0.5) * 40);
  box.castShadow = true;
  box.receiveShadow = true;
  scene.add(box);
  obstacles.push(box);
}

const goals = [];
for (let i = 0; i < 8; i += 1) {
  const orb = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 20, 20),
    new THREE.MeshStandardMaterial({ color: 0x7bff9d, emissive: 0x11662b })
  );
  orb.position.set((Math.random() - 0.5) * 36, 0.35, (Math.random() - 0.5) * 36);
  scene.add(orb);
  goals.push(orb);
}

const keys = new Set();
let score = 0;
let timer = 120;
let ended = false;
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

let last = performance.now();
let timerAcc = 0;

function intersectsObstacle(nextPos) {
  const playerBox = new THREE.Box3().setFromCenterAndSize(nextPos, new THREE.Vector3(1, 2, 1));
  return obstacles.some((o) => playerBox.intersectsBox(new THREE.Box3().setFromObject(o)));
}

function update(delta) {
  if (ended) return;

  const speed = 7;
  velocity.set(0, 0, 0);
  if (keys.has('KeyW')) velocity.z -= 1;
  if (keys.has('KeyS')) velocity.z += 1;
  if (keys.has('KeyA')) velocity.x -= 1;
  if (keys.has('KeyD')) velocity.x += 1;
  if (velocity.lengthSq() > 0) velocity.normalize().multiplyScalar(speed * delta);

  const candidate = player.position.clone().add(new THREE.Vector3(velocity.x, 0, velocity.z));
  if (!intersectsObstacle(candidate)) player.position.copy(candidate);

  goals.forEach((g) => {
    if (g.visible && g.position.distanceTo(player.position) < 1.1) {
      g.visible = false;
      score += 10;
      scoreEl.textContent = String(score);
    }
  });

  const remaining = goals.filter((g) => g.visible).length;
  if (remaining === 0) {
    ended = true;
    stateEl.textContent = '🏆 Победа! Ты очистил зону и собрал все эко-сферы.';
  }

  timerAcc += delta;
  if (timerAcc >= 1) {
    timerAcc = 0;
    timer -= 1;
    timerEl.textContent = String(timer);
    if (timer <= 0) {
      ended = true;
      stateEl.textContent = '❌ Время вышло. Попробуй еще раз и защити природу!';
    }
  }

  const targetCam = new THREE.Vector3(player.position.x, player.position.y + 4, player.position.z + 8);
  camera.position.lerp(targetCam, 0.08);
  camera.lookAt(player.position.x, player.position.y + 1.1, player.position.z);
}

function loop(now) {
  const delta = Math.min(0.03, (now - last) / 1000);
  last = now;
  update(delta);
  renderer.render(scene, camera);
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);
