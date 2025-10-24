import { Game, Scene, clamp, vec2 } from '@webgames/engine';
import './style.css';
class ToiletScene extends Scene {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "cleanliness", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 20
        });
        Object.defineProperty(this, "timer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    update(dt, context) {
        this.timer += dt;
        if (context.input.isKeyPressed(' ') || context.input.isKeyPressed('space')) {
            this.cleanliness += 40 * dt;
        }
        else {
            this.cleanliness -= 8 * dt;
        }
        this.cleanliness = clamp(this.cleanliness, 0, 100);
    }
    render(context) {
        const renderer = context.renderer;
        const gaugeWidth = 400;
        const filledWidth = (gaugeWidth * this.cleanliness) / 100;
        renderer.drawText('スペースキーを連打してトイレをピカピカに！', vec2(180, 180), {
            color: '#333333',
            font: '24px/1.4 sans-serif',
        });
        renderer.drawRect(vec2(200, 260), vec2(gaugeWidth, 32), '#dddddd');
        renderer.drawRect(vec2(200, 260), vec2(filledWidth, 32), '#6ab7ff');
        renderer.drawText(`清潔度: ${this.cleanliness.toFixed(0)}%`, vec2(200, 310), {
            color: '#222222',
            font: '18px/1.4 sans-serif',
        });
        if (this.cleanliness >= 100) {
            renderer.drawText('コンプリート！', vec2(320, 360), {
                color: '#ff4081',
                font: '32px/1.4 sans-serif',
            });
        }
    }
}
const canvas = document.getElementById('game-canvas');
if (!canvas) {
    throw new Error('キャンバスが見つかりません');
}
const game = new Game(canvas, { background: '#f4f9ff' });
game.renderer.resize(vec2(canvas.width, canvas.height));
game.setScene(new ToiletScene());
game.start();
