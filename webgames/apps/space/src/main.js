import { Game, Scene, clamp, vec2 } from '@webgames/engine';
import './style.css';
class SpaceScene extends Scene {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "playerSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: vec2(48, 48)
        });
        Object.defineProperty(this, "playerPosition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: vec2(456, 560)
        });
        Object.defineProperty(this, "bullets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "stars", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: Array.from({ length: 64 }, (_, index) => ({
                position: vec2(Math.random() * 960, Math.random() * 640),
                speed: 40 + Math.random() * 60 + index * 0.1,
            }))
        });
        Object.defineProperty(this, "shootCooldown", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "score", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
    }
    update(dt, context) {
        const input = context.input;
        const canvas = context.renderer.canvas;
        const moveSpeed = 320;
        if (input.isKeyPressed('arrowleft') || input.isKeyPressed('a')) {
            this.playerPosition.x -= moveSpeed * dt;
        }
        if (input.isKeyPressed('arrowright') || input.isKeyPressed('d')) {
            this.playerPosition.x += moveSpeed * dt;
        }
        if (input.isKeyPressed('arrowup') || input.isKeyPressed('w')) {
            this.playerPosition.y -= moveSpeed * dt;
        }
        if (input.isKeyPressed('arrowdown') || input.isKeyPressed('s')) {
            this.playerPosition.y += moveSpeed * dt;
        }
        this.playerPosition.x = clamp(this.playerPosition.x, 0, canvas.width - this.playerSize.x);
        this.playerPosition.y = clamp(this.playerPosition.y, 0, canvas.height - this.playerSize.y);
        this.shootCooldown -= dt;
        if (this.shootCooldown <= 0 && (input.isKeyPressed(' ') || input.isKeyPressed('space'))) {
            this.spawnBullet();
            this.shootCooldown = 0.2;
        }
        this.updateBullets(dt);
        this.updateStars(dt, canvas.height);
        this.score += dt * 10;
    }
    render(context) {
        const renderer = context.renderer;
        this.stars.forEach((star) => {
            renderer.drawRect(star.position, vec2(2, 2), '#e0f7ff');
        });
        this.bullets.forEach((bullet) => {
            renderer.drawRect(bullet.position, vec2(6, 14), '#ff6f91');
        });
        renderer.drawRect(this.playerPosition, this.playerSize, '#4dd0e1');
        renderer.drawText('左右/WASD: 移動  Space: ショット', vec2(24, 24), {
            color: '#f0f4ff',
            font: '20px/1.4 sans-serif',
        });
        renderer.drawText(`SCORE: ${Math.floor(this.score).toString().padStart(5, '0')}`, vec2(24, 56), {
            color: '#ffe082',
            font: '20px/1.4 monospace',
        });
    }
    spawnBullet() {
        this.bullets.push({
            position: vec2(this.playerPosition.x + this.playerSize.x / 2 - 3, this.playerPosition.y - 16),
            speed: 480,
        });
    }
    updateBullets(dt) {
        this.bullets.forEach((bullet) => {
            bullet.position.y -= bullet.speed * dt;
        });
        this.bullets = this.bullets.filter((bullet) => bullet.position.y > -20);
    }
    updateStars(dt, height) {
        this.stars.forEach((star) => {
            star.position.y += star.speed * dt;
            if (star.position.y > height) {
                star.position.y = -2;
                star.position.x = Math.random() * 960;
            }
        });
    }
}
const canvas = document.getElementById('game-canvas');
if (!canvas) {
    throw new Error('キャンバス要素が見つかりません');
}
const game = new Game(canvas, { background: '#05040b' });
game.renderer.resize(vec2(canvas.width, canvas.height));
game.setScene(new SpaceScene());
game.start();
