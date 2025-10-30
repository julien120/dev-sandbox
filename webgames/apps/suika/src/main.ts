import {
  Game,
  Scene,
  type SceneContext,
  clamp,
  lerp,
  vec2,
  type Vector2,
} from '@webgames/engine';
import './style.css';

type FruitDefinition = {
  name: string;
  color: string;
  radius: number;
  score: number;
};

type Fruit = {
  id: number;
  type: number;
  radius: number;
  position: Vector2;
  velocity: Vector2;
  isControlled: boolean;
  age: number;
};

const FRUITS: readonly FruitDefinition[] = [
  { name: 'さくらんぼ', color: '#f9739a', radius: 16, score: 2 },
  { name: 'いちご', color: '#f87171', radius: 22, score: 4 },
  { name: 'かき', color: '#fb923c', radius: 28, score: 8 },
  { name: 'みかん', color: '#f97316', radius: 36, score: 12 },
  { name: 'りんご', color: '#ef4444', radius: 44, score: 20 },
  { name: 'なし', color: '#facc15', radius: 52, score: 36 },
  { name: 'もも', color: '#f472b6', radius: 62, score: 60 },
  { name: 'メロン', color: '#34d399', radius: 74, score: 100 },
  { name: 'パイナップル', color: '#fbbf24', radius: 88, score: 150 },
  { name: 'スイカ', color: '#22c55e', radius: 110, score: 250 },
] as const;

const PLAYFIELD_LEFT = 80;
const PLAYFIELD_TOP = 120;
const PLAYFIELD_WIDTH = 320;
const PLAYFIELD_HEIGHT = 520;
const PLAYFIELD_RIGHT = PLAYFIELD_LEFT + PLAYFIELD_WIDTH;
const PLAYFIELD_BOTTOM = PLAYFIELD_TOP + PLAYFIELD_HEIGHT;
const SPAWN_Y = PLAYFIELD_TOP + 40;
const WALL_THICKNESS = 12;
const GRAVITY = 1200;
const MOVE_SPEED = 320;
const AIR_DRAG = 0.995;
const FLOOR_FRICTION = 0.92;
const BOUNCE = 0.45;
const MERGE_THRESHOLD = 0.9;
const MERGE_MIN_AGE = 0.08;
const GAME_OVER_BUFFER = 36;
const DROP_COOLDOWN = 0.28;

const SPAWN_BAG = [0, 0, 0, 1, 1, 1, 2, 2];

class SuikaScene extends Scene {
  private fruits: Fruit[] = [];
  private nextFruitId = 1;
  private activeFruitId: number | null = null;
  private currentType = 0;
  private previewType = 0;
  private spawnBag: number[] = [];
  private dropCooldown = 0;
  private pointerX: number | null = null;
  private pendingMerges: Array<[number, number]> = [];
  private score = 0;
  private bestScore = 0;
  private gameOver = false;
  private canvasRect: DOMRect | null = null;
  private removeInputListener: (() => void) | null = null;

  onEnter(context: SceneContext): void {
    this.canvasRect = context.renderer.canvas.getBoundingClientRect();
    this.bestScore = this.getStoredBestScore();
    this.removeInputListener = context.input.onInput((event) => this.handleInput(event));
    window.addEventListener('resize', this.handleResize);
    this.reset();
  }

  onExit(): void {
    this.removeInputListener?.();
    this.removeInputListener = null;
    window.removeEventListener('resize', this.handleResize);
  }

  update(dt: number, context: SceneContext): void {
    if (this.dropCooldown > 0) {
      this.dropCooldown = Math.max(0, this.dropCooldown - dt);
    }

    const activeFruit = this.getActiveFruit();
    if (!this.gameOver && !activeFruit && this.dropCooldown <= 0) {
      this.spawnControlledFruit(this.currentType);
    }

    if (activeFruit) {
      activeFruit.age += dt;
      let move = 0;
      if (context.input.isKeyPressed('arrowleft') || context.input.isKeyPressed('a')) {
        move -= 1;
      }
      if (context.input.isKeyPressed('arrowright') || context.input.isKeyPressed('d')) {
        move += 1;
      }

      if (move !== 0) {
        activeFruit.position.x += move * MOVE_SPEED * dt;
      }

      if (this.pointerX !== null) {
        const target = clamp(
          this.pointerX,
          PLAYFIELD_LEFT + activeFruit.radius,
          PLAYFIELD_RIGHT - activeFruit.radius,
        );
        activeFruit.position.x = clamp(
          lerp(activeFruit.position.x, target, 0.35),
          PLAYFIELD_LEFT + activeFruit.radius,
          PLAYFIELD_RIGHT - activeFruit.radius,
        );
      }

      activeFruit.position.x = clamp(
        activeFruit.position.x,
        PLAYFIELD_LEFT + activeFruit.radius,
        PLAYFIELD_RIGHT - activeFruit.radius,
      );
      activeFruit.position.y = SPAWN_Y;
    }

    this.simulatePhysics(dt);

    if (!this.gameOver) {
      this.checkGameOver();
    }
  }

  render(context: SceneContext): void {
    const renderer = context.renderer;
    const ctx = renderer.context;

    ctx.save();
    ctx.fillStyle = '#fcd34d';
    ctx.fillRect(
      PLAYFIELD_LEFT - WALL_THICKNESS,
      PLAYFIELD_TOP - WALL_THICKNESS,
      PLAYFIELD_WIDTH + WALL_THICKNESS * 2,
      PLAYFIELD_HEIGHT + WALL_THICKNESS * 2,
    );
    ctx.fillStyle = '#fefce8';
    ctx.fillRect(PLAYFIELD_LEFT, PLAYFIELD_TOP, PLAYFIELD_WIDTH, PLAYFIELD_HEIGHT);
    ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
    ctx.setLineDash([8, 8]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(PLAYFIELD_LEFT, PLAYFIELD_TOP + 2);
    ctx.lineTo(PLAYFIELD_RIGHT, PLAYFIELD_TOP + 2);
    ctx.stroke();
    ctx.restore();

    this.fruits.forEach((fruit) => {
      const definition = FRUITS[fruit.type];
      ctx.save();
      ctx.translate(fruit.position.x, fruit.position.y);
      const gradient = ctx.createRadialGradient(
        -fruit.radius * 0.3,
        -fruit.radius * 0.3,
        fruit.radius * 0.4,
        0,
        0,
        fruit.radius,
      );
      gradient.addColorStop(0, lighten(definition.color, 0.25));
      gradient.addColorStop(1, definition.color);
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, fruit.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.24)';
      ctx.beginPath();
      ctx.ellipse(0, fruit.radius * 0.4, fruit.radius * 0.85, fruit.radius * 0.45, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fefce8';
      ctx.font = `bold ${Math.max(12, fruit.radius * 0.6)}px/1 "Noto Sans JP", sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(String(fruit.type + 1), 0, fruit.radius * 0.05);
      ctx.restore();
    });

    ctx.save();
    ctx.fillStyle = '#1f2937';
    ctx.font = '24px/1.2 "Noto Sans JP", system-ui, sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(`スコア: ${this.score}`, 24, 24);
    ctx.font = '18px/1.2 "Noto Sans JP", system-ui, sans-serif';
    ctx.fillText(`ベスト: ${this.bestScore}`, 24, 58);
    ctx.fillText('操作: ← → / A D 移動, Space / Enter / タップでドロップ', 24, 92);
    ctx.restore();

    const nextDefinition = FRUITS[this.previewType];
    ctx.save();
    ctx.translate(PLAYFIELD_RIGHT + 48, PLAYFIELD_TOP + 96);
    ctx.fillStyle = '#1f2937';
    ctx.font = '18px/1 "Noto Sans JP", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('つぎのフルーツ', 0, -nextDefinition.radius * 0.9);
    ctx.beginPath();
    ctx.fillStyle = nextDefinition.color;
    ctx.arc(0, 0, nextDefinition.radius * 0.6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 16px/1 sans-serif';
    ctx.fillText(String(this.previewType + 1), 0, 0);
    ctx.font = '14px/1.2 "Noto Sans JP", sans-serif';
    ctx.fillText(nextDefinition.name, 0, nextDefinition.radius * 0.8);
    ctx.restore();

    if (this.gameOver) {
      ctx.save();
      ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
      ctx.fillRect(PLAYFIELD_LEFT + 16, PLAYFIELD_TOP + 140, PLAYFIELD_WIDTH - 32, 160);
      ctx.fillStyle = '#f8fafc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = 'bold 32px/1.2 "Noto Sans JP", sans-serif';
      ctx.fillText('ゲームオーバー', PLAYFIELD_LEFT + PLAYFIELD_WIDTH / 2, PLAYFIELD_TOP + 200);
      ctx.font = '18px/1.3 "Noto Sans JP", sans-serif';
      ctx.fillText('R キー または タップでリスタート', PLAYFIELD_LEFT + PLAYFIELD_WIDTH / 2, PLAYFIELD_TOP + 240);
      ctx.restore();
    }
  }

  private handleResize = (): void => {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;
    if (!canvas) {
      return;
    }
    this.canvasRect = canvas.getBoundingClientRect();
  };

  private handleInput(event: KeyboardEvent | PointerEvent): void {
    if (event instanceof PointerEvent) {
      this.updatePointerPosition(event);
      if (event.type === 'pointerdown') {
        if (this.gameOver) {
          this.reset();
        } else {
          this.tryDropActiveFruit();
        }
      }
      return;
    }

    if (event.type !== 'keydown') {
      return;
    }

    const key = event.key.toLowerCase();

    if (this.gameOver) {
      if (key === 'r') {
        this.reset();
      }
      return;
    }

    if (key === ' ' || key === 'space' || key === 'enter') {
      this.tryDropActiveFruit();
    }
  }

  private updatePointerPosition(event: PointerEvent): void {
    const canvas = (event.currentTarget as HTMLCanvasElement | null) ?? (document.getElementById('game-canvas') as HTMLCanvasElement | null);
    if (!canvas) {
      return;
    }
    this.canvasRect = canvas.getBoundingClientRect();
    const rect = this.canvasRect;
    const scaleX = canvas.width / rect.width;
    this.pointerX = (event.clientX - rect.left) * scaleX;
  }

  private reset(): void {
    this.fruits = [];
    this.pendingMerges = [];
    this.spawnBag = [];
    this.pointerX = null;
    this.nextFruitId = 1;
    this.score = 0;
    this.gameOver = false;
    this.dropCooldown = 0;
    this.currentType = this.drawNextType();
    this.previewType = this.drawNextType();
    this.spawnControlledFruit(this.currentType);
  }

  private getActiveFruit(): Fruit | null {
    if (this.activeFruitId === null) {
      return null;
    }
    return this.fruits.find((fruit) => fruit.id === this.activeFruitId) ?? null;
  }

  private spawnControlledFruit(type: number): void {
    const radius = FRUITS[type].radius;
    const startX = clamp(
      this.pointerX ?? PLAYFIELD_LEFT + PLAYFIELD_WIDTH / 2,
      PLAYFIELD_LEFT + radius,
      PLAYFIELD_RIGHT - radius,
    );
    const fruit: Fruit = {
      id: this.nextFruitId++,
      type,
      radius,
      position: vec2(startX, SPAWN_Y),
      velocity: vec2(0, 0),
      isControlled: true,
      age: 0,
    };
    this.fruits.push(fruit);
    this.activeFruitId = fruit.id;
  }

  private tryDropActiveFruit(): void {
    if (this.gameOver || this.dropCooldown > 0) {
      return;
    }
    const active = this.getActiveFruit();
    if (!active) {
      return;
    }
    active.isControlled = false;
    active.age = 0;
    active.position.y = Math.max(active.position.y, PLAYFIELD_TOP + active.radius + 2);
    this.activeFruitId = null;
    this.dropCooldown = DROP_COOLDOWN;
    this.currentType = this.previewType;
    this.previewType = this.drawNextType();
  }

  private simulatePhysics(dt: number): void {
    for (const fruit of this.fruits) {
      if (fruit.isControlled) {
        continue;
      }

      fruit.age += dt;
      fruit.velocity.y += GRAVITY * dt;
      fruit.velocity.x *= AIR_DRAG;
      fruit.position.x += fruit.velocity.x * dt;
      fruit.position.y += fruit.velocity.y * dt;

      if (fruit.position.x - fruit.radius < PLAYFIELD_LEFT) {
        fruit.position.x = PLAYFIELD_LEFT + fruit.radius;
        fruit.velocity.x = Math.abs(fruit.velocity.x) * BOUNCE;
      }
      if (fruit.position.x + fruit.radius > PLAYFIELD_RIGHT) {
        fruit.position.x = PLAYFIELD_RIGHT - fruit.radius;
        fruit.velocity.x = -Math.abs(fruit.velocity.x) * BOUNCE;
      }

      if (fruit.position.y + fruit.radius > PLAYFIELD_BOTTOM) {
        fruit.position.y = PLAYFIELD_BOTTOM - fruit.radius;
        if (Math.abs(fruit.velocity.y) < 60) {
          fruit.velocity.y = 0;
        } else {
          fruit.velocity.y = -fruit.velocity.y * BOUNCE;
        }
        fruit.velocity.x *= FLOOR_FRICTION;
      }
    }

    this.resolveFruitCollisions();
    this.processPendingMerges();
  }

  private resolveFruitCollisions(): void {
    for (let i = 0; i < this.fruits.length; i += 1) {
      const a = this.fruits[i];
      if (a.isControlled) {
        continue;
      }
      for (let j = i + 1; j < this.fruits.length; j += 1) {
        const b = this.fruits[j];
        if (b.isControlled) {
          continue;
        }
        const dx = b.position.x - a.position.x;
        const dy = b.position.y - a.position.y;
        const distance = Math.hypot(dx, dy);
        const minDistance = a.radius + b.radius;
        if (distance === 0 || distance >= minDistance) {
          continue;
        }

        const overlap = minDistance - distance;
        const nx = distance === 0 ? 0 : dx / distance;
        const ny = distance === 0 ? 0 : dy / distance;

        a.position.x -= (nx * overlap) / 2;
        a.position.y -= (ny * overlap) / 2;
        b.position.x += (nx * overlap) / 2;
        b.position.y += (ny * overlap) / 2;

        const relativeVelocity = (b.velocity.x - a.velocity.x) * nx + (b.velocity.y - a.velocity.y) * ny;
        if (relativeVelocity < 0) {
          const impulse = -(1 + BOUNCE) * relativeVelocity * 0.5;
          a.velocity.x -= impulse * nx;
          a.velocity.y -= impulse * ny;
          b.velocity.x += impulse * nx;
          b.velocity.y += impulse * ny;
        }

        this.maybeQueueMerge(a, b, distance, minDistance);
      }
    }
  }

  private maybeQueueMerge(a: Fruit, b: Fruit, distance: number, minDistance: number): void {
    if (
      this.gameOver ||
      a.type !== b.type ||
      a.type >= FRUITS.length - 1 ||
      a.isControlled ||
      b.isControlled ||
      a.age < MERGE_MIN_AGE ||
      b.age < MERGE_MIN_AGE
    ) {
      return;
    }

    if (distance <= minDistance * MERGE_THRESHOLD) {
      this.pendingMerges.push([a.id, b.id]);
    }
  }

  private processPendingMerges(): void {
    if (this.pendingMerges.length === 0) {
      return;
    }

    const removedIds = new Set<number>();
    const additions: Fruit[] = [];
    for (const [aId, bId] of this.pendingMerges) {
      if (removedIds.has(aId) || removedIds.has(bId)) {
        continue;
      }
      const a = this.fruits.find((fruit) => fruit.id === aId);
      const b = this.fruits.find((fruit) => fruit.id === bId);
      if (!a || !b || a.type !== b.type) {
        continue;
      }
      const nextType = Math.min(a.type + 1, FRUITS.length - 1);
      const definition = FRUITS[nextType];
      const merged: Fruit = {
        id: this.nextFruitId++,
        type: nextType,
        radius: definition.radius,
        position: vec2((a.position.x + b.position.x) / 2, (a.position.y + b.position.y) / 2),
        velocity: vec2((a.velocity.x + b.velocity.x) / 2, (a.velocity.y + b.velocity.y) / 2 - 80),
        isControlled: false,
        age: 0,
      };
      additions.push(merged);
      removedIds.add(aId);
      removedIds.add(bId);
      this.score += definition.score;
    }

    this.fruits = this.fruits.filter((fruit) => !removedIds.has(fruit.id));
    this.fruits.push(...additions);
    this.pendingMerges = [];

    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      this.setStoredBestScore(this.bestScore);
    }
  }

  private checkGameOver(): void {
    const limit = PLAYFIELD_TOP + GAME_OVER_BUFFER;
    const overflow = this.fruits.some(
      (fruit) =>
        !fruit.isControlled &&
        fruit.age > 1 &&
        fruit.position.y - fruit.radius <= limit &&
        Math.abs(fruit.velocity.y) < 20,
    );

    if (overflow) {
      this.gameOver = true;
      this.activeFruitId = null;
    }
  }

  private drawNextType(): number {
    if (this.spawnBag.length === 0) {
      this.spawnBag = [...SPAWN_BAG];
      this.shuffle(this.spawnBag);
    }
    return this.spawnBag.shift() ?? 0;
  }

  private shuffle(values: number[]): void {
    for (let i = values.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const tmp = values[i];
      values[i] = values[j];
      values[j] = tmp;
    }
  }

  private getStoredBestScore(): number {
    try {
      const item = localStorage.getItem('suika-best-score');
      if (!item) {
        return 0;
      }
      return Number.parseInt(item, 10) || 0;
    } catch {
      return 0;
    }
  }

  private setStoredBestScore(value: number): void {
    try {
      localStorage.setItem('suika-best-score', String(value));
    } catch {
      // ストレージが利用できない環境では無視する
    }
  }
}

const lighten = (hex: string, factor: number): string => {
  const normalized = hex.replace('#', '');
  const bigint = Number.parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const mix = (component: number) => Math.round(component + (255 - component) * factor);
  return `rgb(${mix(r)}, ${mix(g)}, ${mix(b)})`;
};

const canvas = document.getElementById('game-canvas') as HTMLCanvasElement | null;

if (!canvas) {
  throw new Error('ゲームキャンバスが見つかりません');
}

const game = new Game(canvas, { background: '#fde68a' });
game.renderer.resize(vec2(canvas.width, canvas.height));
game.setScene(new SuikaScene());
game.start();
