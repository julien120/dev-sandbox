import { Game, vec2 } from '@engine';
import { DvdDodgeScene } from './game-scene';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;
const video = document.getElementById('camera-stream') as HTMLVideoElement | null;

if (!canvas || !video) {
  throw new Error('必要な要素が見つかりません。');
}

const game = new Game(canvas, { background: 'rgba(0, 0, 0, 0)' });

const resizeCanvas = (): void => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
  game.renderer.resize(vec2(width, height));
};

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const scene = new DvdDodgeScene(video);
game.setScene(scene);
game.start();
