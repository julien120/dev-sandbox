import './style.css';
import {
  AmbientLight,
  Color,
  CylinderGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshPhysicalMaterial,
  PerspectiveCamera,
  Scene,
  TorusGeometry,
  WebGLRenderer,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const canvas = document.getElementById('ramen-canvas') as HTMLCanvasElement | null;

if (!canvas) {
  throw new Error('3D キャンバスが見つかりません');
}

const scene = new Scene();
scene.background = new Color('#0f172a');

const camera = new PerspectiveCamera(40, 1, 0.1, 50);
camera.position.set(2.8, 2.2, 2.8);

const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 6;
controls.maxPolarAngle = Math.PI * 0.48;

const ambientLight = new AmbientLight('#fef3c7', 0.8);
scene.add(ambientLight);

const keyLight = new DirectionalLight('#fde68a', 1.5);
keyLight.position.set(3, 5, 2);
keyLight.castShadow = true;
scene.add(keyLight);

const rimLight = new DirectionalLight('#fbbf24', 0.6);
rimLight.position.set(-2, 3, -4);
scene.add(rimLight);

const ramenGroup = new Group();
scene.add(ramenGroup);

const bowlOuterMaterial = new MeshPhysicalMaterial({
  color: '#1f2937',
  roughness: 0.3,
  metalness: 0.1,
  clearcoat: 0.6,
  clearcoatRoughness: 0.2,
});

const bowlInnerMaterial = new MeshPhysicalMaterial({
  color: '#374151',
  roughness: 0.15,
  metalness: 0.05,
});

const bowlOuter = new Mesh(new CylinderGeometry(1.6, 1.2, 0.8, 64, 1, true), bowlOuterMaterial);
bowlOuter.castShadow = true;
bowlOuter.receiveShadow = true;
ramenGroup.add(bowlOuter);

const bowlInner = new Mesh(new CylinderGeometry(1.45, 1.05, 0.7, 64, 1, true), bowlInnerMaterial);
bowlInner.position.y = 0.02;
ramenGroup.add(bowlInner);

const soupMaterial = new MeshPhysicalMaterial({
  color: '#fbbf24',
  roughness: 0.25,
  metalness: 0,
  transmission: 0.1,
  thickness: 0.3,
});

const soupSurface = new Mesh(new CylinderGeometry(1.42, 1.42, 0.02, 64), soupMaterial);
soupSurface.position.y = 0.23;
soupSurface.receiveShadow = true;
ramenGroup.add(soupSurface);

const noodleMaterial = new MeshPhysicalMaterial({
  color: '#fde68a',
  roughness: 0.35,
});

for (let i = 0; i < 6; i += 1) {
  const torus = new Mesh(new TorusGeometry(0.9 - i * 0.08, 0.05, 16, 100), noodleMaterial);
  torus.rotation.x = Math.PI / 2;
  torus.position.y = 0.26 + Math.sin(i * 0.6) * 0.02;
  torus.castShadow = true;
  ramenGroup.add(torus);
}

const toppingMaterial = new MeshPhysicalMaterial({
  color: '#fcd34d',
  roughness: 0.4,
});

const topping = new Mesh(new CylinderGeometry(0.35, 0.32, 0.16, 32), toppingMaterial);
topping.position.set(0.2, 0.38, 0.15);
topping.rotation.x = Math.PI / 12;
topping.castShadow = true;
ramenGroup.add(topping);

const topping2Material = new MeshPhysicalMaterial({
  color: '#f97316',
  roughness: 0.5,
});

const topping2 = new Mesh(new CylinderGeometry(0.28, 0.24, 0.08, 32), topping2Material);
topping2.position.set(-0.5, 0.34, -0.15);
topping2.rotation.z = Math.PI / 9;
topping2.castShadow = true;
ramenGroup.add(topping2);

const topping3Material = new MeshPhysicalMaterial({
  color: '#10b981',
  roughness: 0.55,
});

for (let i = 0; i < 3; i += 1) {
  const leaf = new Mesh(new CylinderGeometry(0.16, 0.05, 0.06, 20), topping3Material);
  leaf.position.set(-0.1 + i * 0.15, 0.35 + i * 0.01, 0.45 - i * 0.12);
  leaf.rotation.z = Math.PI / 6;
  leaf.castShadow = true;
  ramenGroup.add(leaf);
}

ramenGroup.position.y = -0.2;

const resize = () => {
  const { clientWidth, clientHeight } = canvas;
  if (clientWidth === 0 || clientHeight === 0) {
    return;
  }
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(clientWidth, clientHeight, false);
};

const resizeObserver = new ResizeObserver(() => resize());
resizeObserver.observe(canvas);
resize();

const clockStart = performance.now();

const animate = () => {
  const elapsed = (performance.now() - clockStart) / 1000;
  soupSurface.rotation.z = Math.sin(elapsed * 0.6) * 0.02;

  controls.update();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    controls.reset();
  }
});
