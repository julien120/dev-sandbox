import { Game, Scene, vec2, rectCircleIntersect, clamp, } from '@webgames/engine';
import './style.css';
import { loadAssets } from './assets';
const CANVAS_SIZE = vec2(480, 640);
class FlappyScene extends Scene {
    constructor(assets) {
        super();
        Object.defineProperty(this, "assets", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: assets
        });
        Object.defineProperty(this, "state", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 'ready'
        });
        Object.defineProperty(this, "birdSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "pipeWidth", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: void 0
        });
        Object.defineProperty(this, "gapSize", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 180
        });
        Object.defineProperty(this, "gravity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1500
        });
        Object.defineProperty(this, "flapVelocity", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: -520
        });
        Object.defineProperty(this, "pipeSpeed", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 240
        });
        Object.defineProperty(this, "pipeInterval", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1.6
        });
        Object.defineProperty(this, "pipes", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "birdPosition", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: vec2(CANVAS_SIZE.x * 0.28, CANVAS_SIZE.y * 0.5)
        });
        Object.defineProperty(this, "birdVelocity", {
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
        Object.defineProperty(this, "bestScore", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "timeSincePipe", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "backgroundOffset", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "idleTimer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "removeInputListener", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        this.birdSize = vec2(assets.bird.width || 48, assets.bird.height || 36);
        this.pipeWidth = Math.max(assets.pipeBottom.width, assets.pipeTop.width, 96);
    }
    onEnter(context) {
        this.resetToReady();
        this.removeInputListener = context.input.onInput((event) => {
            if (event instanceof PointerEvent) {
                if (event.type === 'pointerdown') {
                    this.handleAction();
                }
                return;
            }
            if (event instanceof KeyboardEvent) {
                if (event.type !== 'keydown') {
                    return;
                }
                const key = event.key.toLowerCase();
                if (key === ' ' || key === 'space' || key === 'arrowup') {
                    this.handleAction();
                }
            }
        });
    }
    onExit() {
        this.removeInputListener?.();
        this.removeInputListener = null;
    }
    update(dt, context) {
        const canvas = context.renderer.canvas;
        this.backgroundOffset = (this.backgroundOffset + this.pipeSpeed * 0.35 * dt) % canvas.width;
        if (this.state === 'ready') {
            this.idleTimer += dt;
            this.birdPosition.x = CANVAS_SIZE.x * 0.28;
            this.birdPosition.y = CANVAS_SIZE.y * 0.5 + Math.sin(this.idleTimer * 4) * 12;
            return;
        }
        if (this.state === 'playing') {
            this.timeSincePipe += dt;
            if (this.timeSincePipe >= this.pipeInterval) {
                this.spawnPipe(canvas);
                this.timeSincePipe = 0;
            }
            this.birdVelocity += this.gravity * dt;
            this.birdPosition.y += this.birdVelocity * dt;
            this.updatePipes(dt);
            this.checkCollisions(canvas);
        }
        else if (this.state === 'gameover') {
            this.birdVelocity += this.gravity * dt;
            this.birdPosition.y += this.birdVelocity * dt;
            const groundY = canvas.height - this.birdSize.y;
            if (this.birdPosition.y > groundY) {
                this.birdPosition.y = groundY;
                this.birdVelocity = 0;
            }
        }
    }
    render(context) {
        const { renderer } = context;
        this.drawScrollingBackground(renderer);
        this.drawPipes(renderer);
        renderer.drawSprite(this.assets.bird, this.birdPosition, this.birdSize);
        this.drawScoreboard(renderer);
        if (this.state === 'ready') {
            this.drawOverlay(renderer, 'タップ / スペースでスタート', '連打しすぎず、リズム良く羽ばたこう');
        }
        else if (this.state === 'gameover') {
            this.drawOverlay(renderer, 'GAME OVER', 'スペースまたはタップでリスタート');
        }
    }
    handleAction() {
        if (this.state === 'ready') {
            this.startGame();
            return;
        }
        if (this.state === 'playing') {
            this.birdVelocity = this.flapVelocity;
            return;
        }
        this.startGame();
    }
    startGame() {
        this.state = 'playing';
        this.birdPosition = vec2(CANVAS_SIZE.x * 0.28, CANVAS_SIZE.y * 0.5);
        this.birdVelocity = this.flapVelocity;
        this.pipes = [];
        this.score = 0;
        this.timeSincePipe = 0;
        this.backgroundOffset = 0;
    }
    resetToReady() {
        this.state = 'ready';
        this.birdPosition = vec2(CANVAS_SIZE.x * 0.28, CANVAS_SIZE.y * 0.5);
        this.birdVelocity = 0;
        this.pipes = [];
        this.score = 0;
        this.timeSincePipe = 0;
        this.backgroundOffset = 0;
        this.idleTimer = 0;
    }
    updatePipes(dt) {
        this.pipes.forEach((pipe) => {
            pipe.x -= this.pipeSpeed * dt;
            if (!pipe.scored && pipe.x + this.pipeWidth < this.birdPosition.x) {
                pipe.scored = true;
                this.score += 1;
                this.bestScore = Math.max(this.bestScore, this.score);
            }
        });
        this.pipes = this.pipes.filter((pipe) => pipe.x + this.pipeWidth > -this.pipeWidth);
    }
    spawnPipe(canvas) {
        const margin = 120;
        const minGapY = margin + this.gapSize / 2;
        const maxGapY = canvas.height - margin - this.gapSize / 2;
        const gapY = clamp(minGapY + Math.random() * (maxGapY - minGapY), minGapY, maxGapY);
        this.pipes.push({
            x: canvas.width + this.pipeWidth,
            gapY,
            scored: false,
        });
    }
    checkCollisions(canvas) {
        if (this.birdPosition.y + this.birdSize.y >= canvas.height || this.birdPosition.y <= 0) {
            this.triggerGameOver();
            return;
        }
        const birdCollider = {
            position: vec2(this.birdPosition.x + this.birdSize.x / 2, this.birdPosition.y + this.birdSize.y / 2),
            radius: Math.max(this.birdSize.x, this.birdSize.y) * 0.35,
        };
        const gapHalf = this.gapSize / 2;
        for (const pipe of this.pipes) {
            const gapTop = pipe.gapY - gapHalf;
            const gapBottom = pipe.gapY + gapHalf;
            const topRect = {
                position: vec2(pipe.x, 0),
                size: vec2(this.pipeWidth, gapTop),
            };
            const bottomRect = {
                position: vec2(pipe.x, gapBottom),
                size: vec2(this.pipeWidth, canvas.height - gapBottom),
            };
            if (rectCircleIntersect(topRect, birdCollider) || rectCircleIntersect(bottomRect, birdCollider)) {
                this.triggerGameOver();
                break;
            }
        }
    }
    triggerGameOver() {
        if (this.state !== 'gameover') {
            this.state = 'gameover';
            this.bestScore = Math.max(this.bestScore, this.score);
            this.birdVelocity = 0;
        }
    }
    drawScrollingBackground(renderer) {
        const canvas = renderer.canvas;
        const bgWidth = this.assets.background.width || canvas.width;
        const bgHeight = this.assets.background.height || canvas.height;
        const scaleY = canvas.height / bgHeight;
        const scaledWidth = bgWidth * scaleY;
        const offset = this.backgroundOffset % scaledWidth;
        for (let x = -scaledWidth + offset; x < canvas.width + scaledWidth; x += scaledWidth) {
            renderer.drawSprite(this.assets.background, vec2(x, 0), vec2(scaledWidth, canvas.height));
        }
    }
    drawPipes(renderer) {
        const canvas = renderer.canvas;
        const gapHalf = this.gapSize / 2;
        for (const pipe of this.pipes) {
            const gapTop = pipe.gapY - gapHalf;
            const gapBottom = pipe.gapY + gapHalf;
            const topHeight = gapTop;
            const bottomHeight = canvas.height - gapBottom;
            renderer.drawSprite(this.assets.pipeTop, vec2(pipe.x, 0), vec2(this.pipeWidth, topHeight));
            renderer.drawSprite(this.assets.pipeBottom, vec2(pipe.x, gapBottom), vec2(this.pipeWidth, bottomHeight));
        }
    }
    drawScoreboard(renderer) {
        const ctx = renderer.context;
        ctx.save();
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 48px/1 "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'top';
        ctx.strokeStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.lineWidth = 4;
        ctx.strokeText(String(this.score), renderer.canvas.width / 2, 28);
        ctx.fillText(String(this.score), renderer.canvas.width / 2, 28);
        ctx.font = '18px/1.2 "Inter", sans-serif';
        ctx.textAlign = 'left';
        ctx.fillStyle = '#0f172a';
        ctx.fillText(`BEST: ${this.bestScore}`, 24, 24);
        ctx.restore();
    }
    drawOverlay(renderer, title, subtitle) {
        const ctx = renderer.context;
        const { width, height } = renderer.canvas;
        ctx.save();
        ctx.fillStyle = 'rgba(15, 23, 42, 0.45)';
        ctx.fillRect(0, height * 0.32, width, 140);
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 28px/1.2 "Inter", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(title, width / 2, height * 0.38);
        ctx.font = '20px/1.4 "Inter", sans-serif';
        ctx.fillText(subtitle, width / 2, height * 0.44);
        ctx.restore();
    }
}
const canvas = document.getElementById('game-canvas');
if (!canvas) {
    throw new Error('ゲームキャンバスが見つかりません');
}
const bootstrap = async () => {
    const assets = await loadAssets();
    const game = new Game(canvas, { background: '#38bdf8' });
    game.renderer.resize(CANVAS_SIZE);
    game.setScene(new FlappyScene(assets));
    game.start();
};
bootstrap().catch((error) => {
    console.error(error);
});
