import { Game, vec2 } from '@engine';
import { DvdDodgeScene } from './game-scene';

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;
const video = document.getElementById('camera-stream') as HTMLVideoElement | null;

if (!canvas || !video) {
  throw new Error('必要な要素が見つかりません。');
}

const game = new Game(canvas, { background: '#040812' });
game.renderer.resize(vec2(canvas.width, canvas.height));

const scene = new DvdDodgeScene(video);
game.setScene(scene);
game.start();
