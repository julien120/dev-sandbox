import { Game, Scene, vec2 } from '@webgames/engine';
import './style.css';
import { randomInt } from './random';
const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const TILE_SIZE = 28;
const BOARD_ORIGIN = vec2(72, 40);
const PREVIEW_BOX_SIZE = 88;
const PREVIEW_CELL_SIZE = 18;
const TETROMINOES = [
    {
        name: 'I',
        color: '#38bdf8',
        rotations: [
            [
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 3, y: 1 },
            ],
            [
                { x: 2, y: 0 },
                { x: 2, y: 1 },
                { x: 2, y: 2 },
                { x: 2, y: 3 },
            ],
            [
                { x: 0, y: 2 },
                { x: 1, y: 2 },
                { x: 2, y: 2 },
                { x: 3, y: 2 },
            ],
            [
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 1, y: 2 },
                { x: 1, y: 3 },
            ],
        ],
    },
    {
        name: 'J',
        color: '#60a5fa',
        rotations: [
            [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
            ],
            [
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 1, y: 1 },
                { x: 1, y: 2 },
            ],
            [
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 2, y: 2 },
            ],
            [
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 0, y: 2 },
                { x: 1, y: 2 },
            ],
        ],
    },
    {
        name: 'L',
        color: '#f97316',
        rotations: [
            [
                { x: 2, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
            ],
            [
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 1, y: 2 },
                { x: 2, y: 2 },
            ],
            [
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 0, y: 2 },
            ],
            [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 1, y: 2 },
            ],
        ],
    },
    {
        name: 'O',
        color: '#facc15',
        rotations: [
            [
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
            ],
            [
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
            ],
            [
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
            ],
            [
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
            ],
        ],
    },
    {
        name: 'S',
        color: '#4ade80',
        rotations: [
            [
                { x: 1, y: 0 },
                { x: 2, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
            ],
            [
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 2, y: 2 },
            ],
            [
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 0, y: 2 },
                { x: 1, y: 2 },
            ],
            [
                { x: 0, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 1, y: 2 },
            ],
        ],
    },
    {
        name: 'T',
        color: '#c084fc',
        rotations: [
            [
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
            ],
            [
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 1, y: 2 },
            ],
            [
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 1, y: 2 },
            ],
            [
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 1, y: 2 },
            ],
        ],
    },
    {
        name: 'Z',
        color: '#f472b6',
        rotations: [
            [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
            ],
            [
                { x: 2, y: 0 },
                { x: 1, y: 1 },
                { x: 2, y: 1 },
                { x: 1, y: 2 },
            ],
            [
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 1, y: 2 },
                { x: 2, y: 2 },
            ],
            [
                { x: 1, y: 0 },
                { x: 0, y: 1 },
                { x: 1, y: 1 },
                { x: 0, y: 2 },
            ],
        ],
    },
];
class TetrisScene extends Scene {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "board", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: this.createEmptyBoard()
        });
        Object.defineProperty(this, "activePiece", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
        Object.defineProperty(this, "nextQueue", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "bag", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: []
        });
        Object.defineProperty(this, "dropTimer", {
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
        Object.defineProperty(this, "level", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 1
        });
        Object.defineProperty(this, "totalClearedLines", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "gameOver", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: false
        });
        Object.defineProperty(this, "inputDisposer", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: null
        });
    }
    onEnter(context) {
        this.inputDisposer = context.input.onInput((event) => this.handleInput(event));
        this.reset();
    }
    onExit() {
        this.inputDisposer?.();
    }
    update(dt, context) {
        if (this.gameOver) {
            return;
        }
        if (!this.activePiece) {
            this.spawnNextPiece();
            if (!this.activePiece) {
                return;
            }
        }
        this.dropTimer += dt;
        const softDropHeld = context.input.isKeyPressed('arrowdown') || context.input.isKeyPressed('s');
        const dropInterval = softDropHeld ? Math.max(0.05, this.getDropInterval() * 0.2) : this.getDropInterval();
        while (this.dropTimer >= dropInterval) {
            this.dropTimer -= dropInterval;
            const moved = this.movePiece(0, 1);
            if (!moved) {
                this.lockPiece();
                break;
            }
            else if (softDropHeld) {
                this.score += 1;
            }
        }
    }
    render(context) {
        const renderer = context.renderer;
        this.drawBoardBackground(renderer);
        this.drawBoardGrid(renderer);
        this.drawSettledBlocks(renderer);
        if (this.activePiece && !this.gameOver) {
            this.drawGhost(renderer, this.activePiece);
        }
        if (this.activePiece) {
            this.drawActivePiece(renderer, this.activePiece);
        }
        this.drawSidePanel(renderer);
        this.drawInstructions(renderer);
        if (this.gameOver) {
            this.drawGameOver(renderer);
        }
    }
    reset() {
        this.board = this.createEmptyBoard();
        this.nextQueue = [];
        this.bag = [];
        this.activePiece = null;
        this.dropTimer = 0;
        this.score = 0;
        this.level = 1;
        this.totalClearedLines = 0;
        this.gameOver = false;
        this.spawnNextPiece();
    }
    handleInput(event) {
        if (!(event instanceof KeyboardEvent) || event.type !== 'keydown') {
            return;
        }
        const key = event.key.toLowerCase();
        const handledKeys = [
            'arrowleft',
            'arrowright',
            'arrowup',
            'arrowdown',
            ' ',
            'z',
            'x',
            'w',
            'a',
            's',
            'd',
            'enter',
            'r',
        ];
        if (handledKeys.includes(key)) {
            event.preventDefault();
        }
        if (this.gameOver) {
            if ((key === 'enter' || key === ' ') && !event.repeat) {
                this.reset();
            }
            if (key === 'r' && !event.repeat) {
                this.reset();
            }
            return;
        }
        switch (key) {
            case 'arrowleft':
            case 'a':
                this.movePiece(-1, 0);
                break;
            case 'arrowright':
            case 'd':
                this.movePiece(1, 0);
                break;
            case 'arrowdown':
            case 's': {
                const moved = this.movePiece(0, 1);
                if (moved) {
                    this.score += 1;
                }
                break;
            }
            case 'arrowup':
            case 'w':
            case 'x':
                if (!event.repeat) {
                    this.rotatePiece(1);
                }
                break;
            case 'z':
                if (!event.repeat) {
                    this.rotatePiece(-1);
                }
                break;
            case ' ':
                if (!event.repeat) {
                    this.hardDrop();
                }
                break;
            case 'r':
                if (!event.repeat) {
                    this.reset();
                }
                break;
            default:
                break;
        }
    }
    spawnNextPiece() {
        this.ensureQueue();
        const shape = this.nextQueue.shift();
        if (!shape) {
            return;
        }
        const spawnPosition = {
            x: Math.floor(BOARD_WIDTH / 2) - 2,
            y: -2,
        };
        this.activePiece = {
            shape,
            rotation: 0,
            position: spawnPosition,
        };
        this.dropTimer = 0;
        if (!this.canPlace(shape, 0, spawnPosition)) {
            this.gameOver = true;
            this.activePiece = null;
        }
    }
    ensureQueue() {
        while (this.nextQueue.length < 5) {
            if (this.bag.length === 0) {
                this.refillBag();
            }
            const next = this.bag.pop();
            if (next) {
                this.nextQueue.push(next);
            }
        }
    }
    refillBag() {
        this.bag = [...TETROMINOES];
        for (let i = this.bag.length - 1; i > 0; i -= 1) {
            const j = randomInt(i + 1);
            [this.bag[i], this.bag[j]] = [this.bag[j], this.bag[i]];
        }
    }
    movePiece(dx, dy) {
        if (!this.activePiece) {
            return false;
        }
        const nextPosition = {
            x: this.activePiece.position.x + dx,
            y: this.activePiece.position.y + dy,
        };
        if (!this.canPlace(this.activePiece.shape, this.activePiece.rotation, nextPosition)) {
            return false;
        }
        this.activePiece.position = nextPosition;
        if (dy !== 0) {
            this.dropTimer = 0;
        }
        return true;
    }
    rotatePiece(direction) {
        if (!this.activePiece) {
            return;
        }
        const shape = this.activePiece.shape;
        const rotationCount = shape.rotations.length;
        const nextRotation = (this.activePiece.rotation + direction + rotationCount) % rotationCount;
        const kicks = shape.name === 'I'
            ? [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: -1, y: 0 },
                { x: 2, y: 0 },
                { x: -2, y: 0 },
                { x: 0, y: -1 },
                { x: 1, y: -1 },
                { x: -1, y: -1 },
            ]
            : [
                { x: 0, y: 0 },
                { x: 1, y: 0 },
                { x: -1, y: 0 },
                { x: 0, y: -1 },
                { x: 1, y: -1 },
                { x: -1, y: -1 },
            ];
        for (const kick of kicks) {
            const candidate = {
                x: this.activePiece.position.x + kick.x,
                y: this.activePiece.position.y + kick.y,
            };
            if (this.canPlace(shape, nextRotation, candidate)) {
                this.activePiece.rotation = nextRotation;
                this.activePiece.position = candidate;
                this.dropTimer = 0;
                return;
            }
        }
    }
    hardDrop() {
        if (!this.activePiece) {
            return;
        }
        let distance = 0;
        while (this.activePiece && this.movePiece(0, 1)) {
            distance += 1;
        }
        if (distance > 0) {
            this.score += distance * 2;
        }
        this.lockPiece();
    }
    lockPiece() {
        if (!this.activePiece) {
            return;
        }
        const cells = this.getCells(this.activePiece.shape, this.activePiece.rotation, this.activePiece.position);
        let outOfBounds = false;
        for (const cell of cells) {
            if (cell.y < 0) {
                outOfBounds = true;
                continue;
            }
            if (cell.y >= BOARD_HEIGHT || cell.x < 0 || cell.x >= BOARD_WIDTH) {
                outOfBounds = true;
                continue;
            }
            this.board[cell.y][cell.x] = this.activePiece.shape.color;
        }
        const cleared = this.clearLines();
        if (cleared > 0) {
            const scoreTable = [0, 100, 300, 500, 800];
            this.score += scoreTable[cleared] * this.level;
            this.totalClearedLines += cleared;
            this.level = 1 + Math.floor(this.totalClearedLines / 10);
        }
        this.activePiece = null;
        if (outOfBounds) {
            this.gameOver = true;
            return;
        }
        this.spawnNextPiece();
    }
    clearLines() {
        let cleared = 0;
        for (let y = BOARD_HEIGHT - 1; y >= 0;) {
            if (this.board[y].every((cell) => cell !== null)) {
                this.board.splice(y, 1);
                this.board.unshift(Array.from({ length: BOARD_WIDTH }, () => null));
                cleared += 1;
            }
            else {
                y -= 1;
            }
        }
        return cleared;
    }
    canPlace(shape, rotation, position) {
        const cells = this.getCells(shape, rotation, position);
        return cells.every((cell) => {
            if (cell.x < 0 || cell.x >= BOARD_WIDTH || cell.y >= BOARD_HEIGHT) {
                return false;
            }
            if (cell.y < 0) {
                return true;
            }
            return this.board[cell.y][cell.x] === null;
        });
    }
    getCells(shape, rotation, position) {
        const pattern = shape.rotations[rotation % shape.rotations.length];
        return pattern.map((cell) => ({
            x: cell.x + position.x,
            y: cell.y + position.y,
        }));
    }
    getDropInterval() {
        return Math.max(0.1, 0.8 - (this.level - 1) * 0.06);
    }
    createEmptyBoard() {
        return Array.from({ length: BOARD_HEIGHT }, () => Array(BOARD_WIDTH).fill(null));
    }
    drawBoardBackground(renderer) {
        const backgroundPosition = vec2(BOARD_ORIGIN.x - 12, BOARD_ORIGIN.y - 12);
        const backgroundSize = vec2(BOARD_WIDTH * TILE_SIZE + 24, BOARD_HEIGHT * TILE_SIZE + 24);
        renderer.drawRect(backgroundPosition, backgroundSize, 'rgba(15, 23, 42, 0.7)');
    }
    drawBoardGrid(renderer) {
        for (let y = 0; y < BOARD_HEIGHT; y += 1) {
            for (let x = 0; x < BOARD_WIDTH; x += 1) {
                const blockPosition = vec2(BOARD_ORIGIN.x + x * TILE_SIZE, BOARD_ORIGIN.y + y * TILE_SIZE);
                renderer.drawRect(blockPosition, vec2(TILE_SIZE, TILE_SIZE), 'rgba(30, 41, 59, 0.35)');
            }
        }
    }
    drawSettledBlocks(renderer) {
        for (let y = 0; y < BOARD_HEIGHT; y += 1) {
            for (let x = 0; x < BOARD_WIDTH; x += 1) {
                const cell = this.board[y][x];
                if (!cell) {
                    continue;
                }
                const position = vec2(BOARD_ORIGIN.x + x * TILE_SIZE, BOARD_ORIGIN.y + y * TILE_SIZE);
                this.drawBlock(renderer, position, TILE_SIZE, cell);
            }
        }
    }
    drawActivePiece(renderer, piece) {
        const cells = this.getCells(piece.shape, piece.rotation, piece.position);
        for (const cell of cells) {
            if (cell.y < 0) {
                continue;
            }
            const position = vec2(BOARD_ORIGIN.x + cell.x * TILE_SIZE, BOARD_ORIGIN.y + cell.y * TILE_SIZE);
            this.drawBlock(renderer, position, TILE_SIZE, piece.shape.color);
        }
    }
    drawGhost(renderer, piece) {
        const ghostPosition = { ...piece.position };
        while (this.canPlace(piece.shape, piece.rotation, { x: ghostPosition.x, y: ghostPosition.y + 1 })) {
            ghostPosition.y += 1;
        }
        const cells = this.getCells(piece.shape, piece.rotation, ghostPosition);
        for (const cell of cells) {
            if (cell.y < 0) {
                continue;
            }
            const position = vec2(BOARD_ORIGIN.x + cell.x * TILE_SIZE, BOARD_ORIGIN.y + cell.y * TILE_SIZE);
            renderer.drawRect(position, vec2(TILE_SIZE, TILE_SIZE), 'rgba(148, 163, 184, 0.24)');
        }
    }
    drawSidePanel(renderer) {
        const panelX = BOARD_ORIGIN.x + BOARD_WIDTH * TILE_SIZE + 16;
        const panelTop = BOARD_ORIGIN.y;
        renderer.drawText('SCORE', vec2(panelX, panelTop), {
            font: '16px/1.2 "Noto Sans JP", sans-serif',
            color: '#94a3b8',
        });
        renderer.drawText(this.score.toString().padStart(6, '0'), vec2(panelX, panelTop + 20), {
            font: '24px/1.2 "Noto Sans JP", sans-serif',
            color: '#e2e8f0',
        });
        renderer.drawText('LEVEL', vec2(panelX, panelTop + 60), {
            font: '16px/1.2 "Noto Sans JP", sans-serif',
            color: '#94a3b8',
        });
        renderer.drawText(this.level.toString(), vec2(panelX, panelTop + 80), {
            font: '22px/1.2 "Noto Sans JP", sans-serif',
            color: '#e2e8f0',
        });
        renderer.drawText('LINES', vec2(panelX, panelTop + 112), {
            font: '16px/1.2 "Noto Sans JP", sans-serif',
            color: '#94a3b8',
        });
        renderer.drawText(this.totalClearedLines.toString(), vec2(panelX, panelTop + 132), {
            font: '22px/1.2 "Noto Sans JP", sans-serif',
            color: '#e2e8f0',
        });
        renderer.drawText('NEXT', vec2(panelX, panelTop + 172), {
            font: '16px/1.2 "Noto Sans JP", sans-serif',
            color: '#94a3b8',
        });
        this.drawNextQueue(renderer, vec2(panelX, panelTop + 192));
    }
    drawNextQueue(renderer, origin) {
        const previewCount = Math.min(3, this.nextQueue.length);
        for (let index = 0; index < previewCount; index += 1) {
            const shape = this.nextQueue[index];
            const offsetY = origin.y + index * (PREVIEW_BOX_SIZE + 12);
            const backgroundPosition = vec2(origin.x - 4, offsetY - 4);
            renderer.drawRect(backgroundPosition, vec2(PREVIEW_BOX_SIZE + 8, PREVIEW_BOX_SIZE + 8), 'rgba(30, 41, 59, 0.55)');
            this.drawPreview(renderer, shape, vec2(origin.x, offsetY));
        }
    }
    drawPreview(renderer, shape, origin) {
        const state = shape.rotations[0];
        const minX = Math.min(...state.map((cell) => cell.x));
        const maxX = Math.max(...state.map((cell) => cell.x));
        const minY = Math.min(...state.map((cell) => cell.y));
        const maxY = Math.max(...state.map((cell) => cell.y));
        const pieceWidth = maxX - minX + 1;
        const pieceHeight = maxY - minY + 1;
        const offsetX = origin.x + (PREVIEW_BOX_SIZE - pieceWidth * PREVIEW_CELL_SIZE) / 2;
        const offsetY = origin.y + (PREVIEW_BOX_SIZE - pieceHeight * PREVIEW_CELL_SIZE) / 2;
        for (const cell of state) {
            const x = offsetX + (cell.x - minX) * PREVIEW_CELL_SIZE;
            const y = offsetY + (cell.y - minY) * PREVIEW_CELL_SIZE;
            this.drawBlock(renderer, vec2(x, y), PREVIEW_CELL_SIZE, shape.color);
        }
    }
    drawInstructions(renderer) {
        const infoY = BOARD_ORIGIN.y + BOARD_HEIGHT * TILE_SIZE + 12;
        renderer.drawText('← →: 移動   ↓: ソフトドロップ   Space: ハードドロップ', vec2(BOARD_ORIGIN.x, infoY), {
            font: '16px/1.3 "Noto Sans JP", sans-serif',
            color: '#cbd5f5',
        });
        renderer.drawText('Z: 左回転   ↑ / X: 右回転   Enter / R: リスタート', vec2(BOARD_ORIGIN.x, infoY + 20), {
            font: '16px/1.3 "Noto Sans JP", sans-serif',
            color: '#cbd5f5',
        });
    }
    drawGameOver(renderer) {
        const overlayPosition = vec2(BOARD_ORIGIN.x + 12, BOARD_ORIGIN.y + 180);
        const overlaySize = vec2(BOARD_WIDTH * TILE_SIZE - 24, 160);
        renderer.drawRect(overlayPosition, overlaySize, 'rgba(2, 6, 23, 0.88)');
        renderer.drawText('GAME OVER', vec2(overlayPosition.x + 16, overlayPosition.y + 24), {
            font: '32px/1.3 "Noto Sans JP", sans-serif',
            color: '#f97316',
        });
        renderer.drawText('Enter / Space / R で再スタート', vec2(overlayPosition.x + 16, overlayPosition.y + 72), {
            font: '18px/1.5 "Noto Sans JP", sans-serif',
            color: '#f8fafc',
        });
        renderer.drawText(`スコア: ${this.score.toString()}`, vec2(overlayPosition.x + 16, overlayPosition.y + 104), {
            font: '18px/1.5 "Noto Sans JP", sans-serif',
            color: '#e2e8f0',
        });
    }
    drawBlock(renderer, position, size, color) {
        renderer.drawRect(position, vec2(size, size), color);
        const innerColor = shadeColor(color, 45);
        const innerSize = Math.max(4, size - 6);
        renderer.drawRect(vec2(position.x + 3, position.y + 3), vec2(innerSize, innerSize), innerColor);
        const shadowColor = shadeColor(color, -40);
        renderer.drawRect(vec2(position.x + 3, position.y + size - 5), vec2(innerSize, 2), shadowColor);
    }
}
function shadeColor(color, amount) {
    const hex = color.startsWith('#') ? color.slice(1) : color;
    if (hex.length !== 6) {
        return color;
    }
    const num = Number.parseInt(hex, 16);
    const clamp = (value) => Math.max(0, Math.min(255, value));
    const r = clamp((num >> 16) + amount);
    const g = clamp(((num >> 8) & 0xff) + amount);
    const b = clamp((num & 0xff) + amount);
    const result = (r << 16) | (g << 8) | b;
    return `#${result.toString(16).padStart(6, '0')}`;
}
const canvas = document.getElementById('game-canvas');
if (!canvas) {
    throw new Error('ゲームキャンバスが見つかりません');
}
const game = new Game(canvas, { background: '#020617' });
game.renderer.resize(vec2(canvas.width, canvas.height));
game.setScene(new TetrisScene());
game.start();
