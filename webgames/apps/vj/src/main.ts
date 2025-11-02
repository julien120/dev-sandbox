import './style.css';
import * as Tone from 'tone';
import {
  AmbientLight,
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Group,
  IcosahedronGeometry,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  Vector2,
  WebGLRenderer,
} from 'three';

const canvas = document.getElementById('vj-canvas') as HTMLCanvasElement | null;
const instructions = document.getElementById('instructions');
const startButton = document.getElementById('start-button');

if (!canvas || !instructions || !(startButton instanceof HTMLButtonElement)) {
  throw new Error('初期化エラー: 必要なDOM要素が見つかりませんでした');
}

const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const scene = new Scene();
scene.background = new Color('#030712');

const camera = new PerspectiveCamera(60, 1, 0.1, 100);
camera.position.set(0, 0, 8);

const ambient = new AmbientLight('#e0e7ff', 0.6);
scene.add(ambient);

const root = new Group();
scene.add(root);

const coreMaterial = new MeshStandardMaterial({
  color: '#8b5cf6',
  metalness: 0.9,
  roughness: 0.25,
  emissive: '#4c1d95',
  emissiveIntensity: 0.35,
});

const core = new Mesh(new IcosahedronGeometry(1.8, 2), coreMaterial);
root.add(core);

const shellMaterial = new MeshStandardMaterial({
  color: '#22d3ee',
  metalness: 0.4,
  roughness: 0.1,
  transparent: true,
  opacity: 0.22,
  emissive: '#0891b2',
  emissiveIntensity: 0.4,
});

const shell = new Mesh(new IcosahedronGeometry(2.4, 3), shellMaterial);
root.add(shell);

const particlesGeometry = new BufferGeometry();
const particleCount = 900;
const positions = new Float32Array(particleCount * 3);
const scales = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i += 1) {
  const radius = 2.8 + Math.random() * 1.8;
  const theta = Math.random() * Math.PI * 2;
  const phi = Math.acos(2 * Math.random() - 1);
  const x = radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.sin(phi) * Math.sin(theta);
  const z = radius * Math.cos(phi);
  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
  scales[i] = Math.random();
}

particlesGeometry.setAttribute('position', new Float32BufferAttribute(positions, 3));
particlesGeometry.setAttribute('scale', new Float32BufferAttribute(scales, 1));

const particlesMaterial = new PointsMaterial({
  color: '#f0abfc',
  size: 0.14,
  sizeAttenuation: true,
  transparent: true,
  opacity: 0.9,
});

const particles = new Points(particlesGeometry, particlesMaterial);
root.add(particles);

const targetPointer = new Vector2(0, 0);
const pointer = new Vector2(0, 0);

canvas.addEventListener('pointermove', (event) => {
  const rect = canvas.getBoundingClientRect();
  targetPointer.x = (event.clientX - rect.left) / rect.width - 0.5;
  targetPointer.y = (event.clientY - rect.top) / rect.height - 0.5;
});

let started = false;

const mapRange = (value: number, inMin: number, inMax: number, outMin: number, outMax: number): number => {
  const clamped = Math.min(Math.max(value, inMin), inMax);
  const ratio = (clamped - inMin) / (inMax - inMin || 1);
  return outMin + ratio * (outMax - outMin);
};

const synth = new Tone.PolySynth(Tone.Synth, {
  oscillator: { type: 'sawtooth' },
  envelope: { attack: 0.03, decay: 0.2, sustain: 0.4, release: 1.2 },
});

const bass = new Tone.MembraneSynth({
  pitchDecay: 0.008,
  octaves: 3,
  envelope: { attack: 0.001, decay: 0.4, sustain: 0, release: 0.4 },
});

const noise = new Tone.NoiseSynth({
  noise: { type: 'pink' },
  envelope: { attack: 0.001, decay: 0.18, sustain: 0 },
}).toDestination();

const filter = new Tone.Filter({ type: 'lowpass', frequency: 900, Q: 1 });
const chorus = new Tone.Chorus(6, 3.5, 0.4).start();
const reverb = new Tone.Reverb({ decay: 6, wet: 0.3 });
const delay = new Tone.FeedbackDelay('8n', 0.3);

synth.chain(filter, chorus, reverb, delay, Tone.Destination);
bass.chain(reverb, Tone.Destination);

const analyser = new Tone.Analyser('waveform', 256);
delay.connect(analyser);
filter.connect(analyser);

const chordSets: string[][] = [
  ['C4', 'E4', 'G4', 'B3'],
  ['A3', 'C4', 'E4', 'G4'],
  ['F3', 'A3', 'C4', 'E4'],
  ['G3', 'B3', 'D4', 'F4'],
];
let chordIndex = 0;

const melodyPattern = new Tone.Pattern<string>((time, note) => {
  synth.triggerAttackRelease(note, '8n', time, 0.6);
}, chordSets[chordIndex], 'upDown');

melodyPattern.interval = '8n';
melodyPattern.start(0);

const bassLoop = new Tone.Loop((time) => {
  const root = chordSets[chordIndex][0];
  bass.triggerAttackRelease(root.replace('4', '2'), '8n', time, 0.8);
}, '1n');
bassLoop.start(0);

const noiseLoop = new Tone.Loop((time) => {
  noise.triggerAttackRelease('16n', time);
}, '2n');
noiseLoop.start('4n');

Tone.Transport.bpm.value = 92;

const handleStart = async () => {
  if (started) {
    return;
  }
  await Tone.start();
  instructions.classList.add('hidden');
  Tone.Transport.start();
  started = true;
};

startButton.addEventListener('click', handleStart);
canvas.addEventListener('click', async () => {
  if (!started) {
    await handleStart();
    return;
  }
  synth.triggerAttackRelease(chordSets[chordIndex][Math.floor(Math.random() * 4)], '16n', undefined, 0.9);
});

window.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    chordIndex = (chordIndex + 1) % chordSets.length;
    melodyPattern.values = chordSets[chordIndex];
  }
});

canvas.addEventListener('pointermove', (event) => {
  if (!started) {
    return;
  }
  const rect = canvas.getBoundingClientRect();
  const normX = (event.clientX - rect.left) / rect.width;
  const normY = (event.clientY - rect.top) / rect.height;
  filter.frequency.value = mapRange(normX, 0, 1, 320, 4200);
  filter.Q.value = mapRange(normY, 0, 1, 0.6, 12);
  chorus.wet.value = mapRange(normY, 0, 1, 0.15, 0.4);
  reverb.wet.value = mapRange(normX, 0, 1, 0.2, 0.5);
});

const resize = () => {
  const { clientWidth, clientHeight } = canvas;
  if (!clientWidth || !clientHeight) {
    return;
  }
  camera.aspect = clientWidth / clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(clientWidth, clientHeight, false);
};

const resizeObserver = new ResizeObserver(resize);
resizeObserver.observe(canvas);
resize();

const pointerSmoothing = 0.08;

const animate = () => {
  pointer.lerp(targetPointer, pointerSmoothing);

  const waveform = analyser.getValue() as Float32Array;
  let energy = 0;
  for (let i = 0; i < waveform.length; i += 1) {
    energy += Math.abs(waveform[i]);
  }
  energy = Math.min(1, energy / waveform.length);

  core.rotation.x += 0.004 + energy * 0.02;
  core.rotation.y += 0.006 + pointer.x * 0.04;
  core.scale.setScalar(1 + energy * 0.6);

  shell.rotation.x -= 0.002 + pointer.y * 0.02;
  shell.rotation.y += 0.004;
  shell.scale.setScalar(1.08 + Math.sin(performance.now() * 0.001) * 0.05 + energy * 0.2);

  particles.rotation.y += 0.0015 + energy * 0.01;
  particles.rotation.x += pointer.y * 0.01;
  particles.material.opacity = 0.4 + energy * 0.45;

  camera.position.x = pointer.x * 3.2;
  camera.position.y = pointer.y * 2.4;
  camera.lookAt(0, 0, 0);

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
};

animate();
