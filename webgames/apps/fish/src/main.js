import { Game, Scene, clamp, vec2 } from '@webgames/engine';
import './style.css';
class SwimScene extends Scene {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "speed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 200
        });
        Object.defineProperty(this, "position", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: vec2(400, 300)
        });
    }
    update(dt, context) {
        const input = context.input;
        const velocity = vec2(0, 0);
        if (input.isKeyPressed('arrowup') || input.isKeyPressed('w')) {
            velocity.y -= 1;
        }
        if (input.isKeyPressed('arrowdown') || input.isKeyPressed('s')) {
            velocity.y += 1;
        }
        if (input.isKeyPressed('arrowleft') || input.isKeyPressed('a')) {
            velocity.x -= 1;
        }
        if (input.isKeyPressed('arrowright') || input.isKeyPressed('d')) {
            velocity.x += 1;
        }
        const length = Math.hypot(velocity.x, velocity.y) || 1;
        this.position.x += (velocity.x / length) * this.speed * dt;
        this.position.y += (velocity.y / length) * this.speed * dt;
        const canvas = context.renderer.canvas;
        this.position.x = clamp(this.position.x, 20, canvas.width - 60);
        this.position.y = clamp(this.position.y, 20, canvas.height - 40);
    }
    render(context) {
        const renderer = context.renderer;
        renderer.drawRect(this.position, vec2(40, 24), '#ffcc33');
        renderer.drawText('WASD/矢印キーで操作', vec2(16, 16), {
            color: '#ffffff',
            font: '18px/1 sans-serif',
        });
    }
}
const canvas = document.getElementById('game-canvas');
if (!canvas) {
    throw new Error('ゲームキャンバスが見つかりません');
}
const game = new Game(canvas, { background: '#02263c' });
game.renderer.resize(vec2(canvas.width, canvas.height));
game.setScene(new SwimScene());
game.start();
