import { Color, MathUtils } from 'three';
import {
  Scene,
  type SceneContext,
  type Vector2,
  vec2,
  clamp,
  rectCircleIntersect,
  circlesIntersect,
  lerp,
} from '@engine';
import { PlayerTracker, type TrackedPlayer } from './tracker';
import { formatInteger } from './utils';
import { SfxSynth } from './sfx';
import './style.css';

const STORAGE_KEY = 'dvd-dodge-best-score';
const DVD_BASE_SPEED = 300;
const DVD_SIZE = vec2(140, 70);
const COIN_RADIUS = 26;
const COIN_LIFETIME = 3.5;
const COIN_SPAWN_MIN = 1.2;
const COIN_SPAWN_MAX = 2.0;
const DVD_SPEED_COIN_MULTIPLIER = 1.05;
const DVD_SPEED_TIME_MULTIPLIER = 1.03;
const DVD_SPEED_MAX_MULTIPLIER = 3;
const TIME_ACCELERATION_INTERVAL = 30;
const SLOW_MOTION_DURATION = 0.3;
const HIT_FLASH_DURATION = 0.4;
const COUNTDOWN_SEQUENCE = ['3', '2', '1', 'GO!'] as const;
const HUD_PADDING = 24;

type CountdownLabel = (typeof COUNTDOWN_SEQUENCE)[number];

enum Phase {
  Splash = 'splash',
  Calibrate = 'calibrate',
  Countdown = 'countdown',
  Play = 'play',
  GameOver = 'game-over',
}

type DvdLogo = {
  position: Vector2;
  direction: Vector2;
  speedMultiplier: number;
  hue: number;
  glow: number;
};

type Coin = {
  id: number;
  position: Vector2;
  ttl: number;
};

type Burst = {
  position: Vector2;
  life: number;
  elapsed: number;
};

const randomInRange = (min: number, max: number): number => Math.random() * (max - min) + min;

export class DvdDodgeScene extends Scene {
  private phase: Phase = Phase.Splash;
  private phaseTimer = 0;
  private countdownIndex = 0;
  private countdownTimer = 0;
  private readonly countdownDuration = 0.9;

  private readonly tracker: PlayerTracker;
  private readonly sfx = new SfxSynth();

  private readonly dvd: DvdLogo = {
    position: vec2(410, 220),
    direction: vec2(MathUtils.randFloatSpread(1), MathUtils.randFloatSpread(1)),
    speedMultiplier: 1,
    hue: 210 / 360,
    glow: 0,
  };

  private coins: Coin[] = [];
  private nextCoinId = 1;
  private coinTimer = randomInRange(COIN_SPAWN_MIN, COIN_SPAWN_MAX);
  private bursts: Burst[] = [];

  private score = 0;
  private bestScore = 0;
  private elapsedPlayTime = 0;
  private timeSinceAcceleration = 0;
  private slowMotionTimer = 0;
  private timeScale = 1;
  private hitFlash = 0;

  private players: TrackedPlayer[] = [];
  private playerCount = 0;

  private calibrating = false;
  private calibrationError: string | null = null;

  private restartReady = false;
  private removeInputListener: (() => void) | null = null;
  private readonly backgroundColor = new Color('#08152C');

  constructor(private readonly video: HTMLVideoElement) {
    super();
    this.tracker = new PlayerTracker(video);
    const directionLength = Math.hypot(this.dvd.direction.x, this.dvd.direction.y) || 1;
    this.dvd.direction.x /= directionLength;
    this.dvd.direction.y /= directionLength;
  }

  onEnter(context: SceneContext): void {
    this.bestScore = Number.parseInt(localStorage.getItem(STORAGE_KEY) ?? '0', 10) || 0;
    this.phase = Phase.Splash;
    this.phaseTimer = 0;
    this.score = 0;
    this.restartReady = false;
    this.registerInput(context);
    context.renderer.canvas.focus();
  }

  onExit(): void {
    this.removeInputListener?.();
    this.removeInputListener = null;
    this.tracker.dispose();
  }

  update(dt: number, context: SceneContext): void {
    const renderer = context.renderer;
    const canvas = renderer.canvas;
    this.phaseTimer += dt;

    switch (this.phase) {
      case Phase.Splash:
        this.timeScale = 0;
        break;
      case Phase.Calibrate:
        this.updateCalibration(dt, canvas.width, canvas.height);
        break;
      case Phase.Countdown:
        this.updateCalibration(dt, canvas.width, canvas.height);
        this.updateCountdown(dt);
        break;
      case Phase.Play:
        this.updateCalibration(dt, canvas.width, canvas.height);
        this.updatePlay(dt, canvas.width, canvas.height);
        break;
      case Phase.GameOver:
        this.updateCalibration(dt, canvas.width, canvas.height);
        this.updateGameOver(dt, canvas.width, canvas.height);
        break;
    }
  }

  render(context: SceneContext): void {
    const renderer = context.renderer;
    const ctx = renderer.context;
    const canvas = renderer.canvas;

    this.renderBackground(ctx, canvas.width, canvas.height);
    this.renderCoins(ctx);
    this.renderBursts(ctx);
    this.renderDvd(ctx);
    this.renderPlayers(ctx);
    this.renderHud(ctx, canvas.width);
    this.renderPhaseOverlay(ctx, canvas.width, canvas.height);
    this.renderFlash(ctx, canvas.width, canvas.height);
  }

  private registerInput(context: SceneContext): void {
    const input = context.input;
    this.removeInputListener?.();
    this.removeInputListener = input.onInput((event) => {
      if (event.type === 'keydown') {
        const keyEvent = event as KeyboardEvent;
        this.handleKey(keyEvent.key.toLowerCase());
      } else if (event.type === 'pointerdown') {
        this.handlePointer();
      }
    });
  }

  private handleKey(key: string): void {
    if (key === 'm') {
      this.sfx.toggle();
      return;
    }
    if (key !== ' ' && key !== 'enter') {
      return;
    }

    this.handlePrimaryAction();
  }

  private handlePointer(): void {
    this.handlePrimaryAction();
  }

  private handlePrimaryAction(): void {
    if (this.phase === Phase.Splash) {
      void this.beginCalibration();
      return;
    }

    if (this.phase === Phase.GameOver && this.restartReady) {
      this.startCountdown();
      return;
    }
  }

  private async beginCalibration(): Promise<void> {
    if (this.calibrating) {
      return;
    }
    this.calibrating = true;
    this.calibrationError = null;
    this.phase = Phase.Calibrate;
    this.phaseTimer = 0;
    try {
      await this.tracker.initialize();
      this.sfx.setMuted(false);
    } catch (error) {
      console.error('[DVD] Failed to initialize tracker', error);
      this.calibrationError =
        'カメラの利用に失敗しました。ブラウザ設定を確認してリロードしてください。';
      this.phase = Phase.Splash;
    } finally {
      this.calibrating = false;
    }
  }

  private updateCalibration(dt: number, width: number, height: number): void {
    this.tracker.update(dt, width, height);
    this.players = this.tracker.getPlayers();
    this.playerCount = this.tracker.getPlayerCount();
    if (
      this.phase === Phase.Calibrate &&
      this.tracker.isInitialized() &&
      this.tracker.isStable(1)
    ) {
      this.startCountdown();
    }
  }

  private startCountdown(): void {
    this.phase = Phase.Countdown;
    this.countdownIndex = 0;
    this.countdownTimer = 0;
    this.phaseTimer = 0;
    this.timeScale = 0;
    this.players = this.tracker.getPlayers();
    void this.sfx.play('countdown', { volume: 0.3 });
  }

  private updateCountdown(dt: number): void {
    this.countdownTimer += dt;
    if (this.countdownTimer >= this.countdownDuration) {
      this.countdownTimer = 0;
      this.countdownIndex += 1;
      if (this.countdownIndex < COUNTDOWN_SEQUENCE.length) {
        void this.sfx.play('countdown', { volume: 0.32 });
      }
      if (this.countdownIndex >= COUNTDOWN_SEQUENCE.length) {
        this.startPlay();
      }
    }
  }

  private startPlay(): void {
    this.phase = Phase.Play;
    this.phaseTimer = 0;
    this.score = 0;
    this.elapsedPlayTime = 0;
    this.timeSinceAcceleration = 0;
    this.coinTimer = randomInRange(COIN_SPAWN_MIN, COIN_SPAWN_MAX);
    this.coins = [];
    this.bursts = [];
    this.restartReady = false;
    this.timeScale = 1;
    this.slowMotionTimer = 0;
    this.hitFlash = 0;
    this.players = this.tracker.getPlayers();
    this.playerCount = this.tracker.getPlayerCount();

    this.dvd.position.x = randomInRange(220, 720);
    this.dvd.position.y = randomInRange(160, 360);
    this.dvd.direction = vec2(MathUtils.randFloatSpread(1), MathUtils.randFloatSpread(1));
    const length = Math.hypot(this.dvd.direction.x, this.dvd.direction.y) || 1;
    this.dvd.direction.x /= length;
    this.dvd.direction.y /= length;
    this.dvd.speedMultiplier = 1;
  }

  private updatePlay(dt: number, width: number, height: number): void {
    this.elapsedPlayTime += dt;
    this.timeSinceAcceleration += dt;
    this.players = this.tracker.getPlayers();
    this.playerCount = this.tracker.getPlayerCount();

    if (this.timeSinceAcceleration >= TIME_ACCELERATION_INTERVAL) {
      this.timeSinceAcceleration = 0;
      this.increaseDvdSpeed(DVD_SPEED_TIME_MULTIPLIER);
    }

    const simDt = dt * this.timeScale;
    this.updateDvd(simDt, width, height);
    this.updateCoins(simDt, width, height);
    this.updateBursts(dt);
    this.detectCoinCollection();

    if (this.checkCollisionWithPlayers()) {
      this.triggerGameOver();
    }

    if (this.slowMotionTimer > 0) {
      this.slowMotionTimer = Math.max(0, this.slowMotionTimer - dt);
      const t = clamp(1 - this.slowMotionTimer / SLOW_MOTION_DURATION, 0, 1);
      this.timeScale = lerp(0.2, 1, t * t);
    } else {
      this.timeScale = lerp(this.timeScale, 1, dt * 3);
    }

    this.dvd.glow = Math.max(0, this.dvd.glow - dt * 2);
    this.hitFlash = Math.max(0, this.hitFlash - dt / HIT_FLASH_DURATION);
  }

  private updateGameOver(dt: number, width: number, height: number): void {
    this.players = this.tracker.getPlayers();
    this.playerCount = this.tracker.getPlayerCount();
    this.updateBursts(dt);

    if (this.slowMotionTimer > 0) {
      this.slowMotionTimer = Math.max(0, this.slowMotionTimer - dt);
      const factor = clamp(this.slowMotionTimer / SLOW_MOTION_DURATION, 0, 1);
      this.timeScale = lerp(0.05, 0.35, factor);
      this.updateDvd(dt * this.timeScale, width, height);
    } else {
      this.timeScale = lerp(this.timeScale, 0, dt * 5);
    }

    this.dvd.glow = Math.max(0, this.dvd.glow - dt);
    this.hitFlash = Math.max(0, this.hitFlash - dt / HIT_FLASH_DURATION);

    if (!this.restartReady && this.phaseTimer >= 0.8) {
      this.restartReady = true;
    }
  }

  private updateDvd(dt: number, width: number, height: number): void {
    if (dt <= 0) {
      return;
    }
    const speed = DVD_BASE_SPEED * this.dvd.speedMultiplier;
    this.dvd.position.x += this.dvd.direction.x * speed * dt;
    this.dvd.position.y += this.dvd.direction.y * speed * dt;

    let bounced = false;

    if (this.dvd.position.x <= HUD_PADDING) {
      this.dvd.position.x = HUD_PADDING;
      this.dvd.direction.x = Math.abs(this.dvd.direction.x);
      bounced = true;
    } else if (this.dvd.position.x + DVD_SIZE.x >= width - HUD_PADDING) {
      this.dvd.position.x = width - HUD_PADDING - DVD_SIZE.x;
      this.dvd.direction.x = -Math.abs(this.dvd.direction.x);
      bounced = true;
    }

    if (this.dvd.position.y <= HUD_PADDING * 0.5) {
      this.dvd.position.y = HUD_PADDING * 0.5;
      this.dvd.direction.y = Math.abs(this.dvd.direction.y);
      bounced = true;
    } else if (this.dvd.position.y + DVD_SIZE.y >= height - HUD_PADDING * 0.5) {
      this.dvd.position.y = height - HUD_PADDING * 0.5 - DVD_SIZE.y;
      this.dvd.direction.y = -Math.abs(this.dvd.direction.y);
      bounced = true;
    }

    if (bounced) {
      const hueShift = randomInRange(0.03, 0.08);
      this.dvd.hue = (this.dvd.hue + hueShift) % 1;
      this.dvd.glow = 1;
      void this.sfx.play('bounce', { volume: 0.22, duration: 0.12 });
    }
  }

  private updateCoins(dt: number, width: number, height: number): void {
    this.coinTimer -= dt;
    if (this.coinTimer <= 0) {
      this.spawnCoin(width, height);
      this.coinTimer = randomInRange(COIN_SPAWN_MIN, COIN_SPAWN_MAX);
    }

    this.coins = this.coins.filter((coin) => {
      coin.ttl -= dt;
      return coin.ttl > 0;
    });
  }

  private updateBursts(dt: number): void {
    this.bursts = this.bursts.filter((burst) => {
      burst.elapsed += dt;
      return burst.elapsed < burst.life;
    });
  }

  private spawnCoin(width: number, height: number): void {
    const marginX = HUD_PADDING + COIN_RADIUS * 2;
    const marginY = HUD_PADDING + COIN_RADIUS * 2;
    const position = vec2(
      randomInRange(marginX, width - marginX),
      randomInRange(marginY, height - marginY),
    );

    this.coins.push({
      id: this.nextCoinId++,
      position,
      ttl: COIN_LIFETIME,
    });
  }

  private detectCoinCollection(): void {
    if (this.coins.length === 0 || this.players.length === 0) {
      return;
    }

    const collectedIds = new Set<number>();
    for (const player of this.players) {
      for (const coin of this.coins) {
        if (collectedIds.has(coin.id)) {
          continue;
        }
        const playerCircle = { position: player.position, radius: player.radius };
        const coinCircle = { position: coin.position, radius: COIN_RADIUS };
        if (circlesIntersect(playerCircle, coinCircle)) {
          collectedIds.add(coin.id);
          this.handleCoinCollection(coin);
        }
      }
    }

    if (collectedIds.size > 0) {
      this.coins = this.coins.filter((coin) => !collectedIds.has(coin.id));
    }
  }

  private handleCoinCollection(coin: Coin): void {
    this.score += 1;
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem(STORAGE_KEY, this.bestScore.toString());
    }
    this.increaseDvdSpeed(DVD_SPEED_COIN_MULTIPLIER);
    this.bursts.push({ position: coin.position, life: 0.5, elapsed: 0 });
    this.slowMotionTimer = Math.min(SLOW_MOTION_DURATION, this.slowMotionTimer + 0.08);
    void this.sfx.play('coin', { volume: 0.3, duration: 0.18 });
  }

  private increaseDvdSpeed(multiplier: number): void {
    this.dvd.speedMultiplier = Math.min(
      DVD_SPEED_MAX_MULTIPLIER,
      this.dvd.speedMultiplier * multiplier,
    );
  }

  private checkCollisionWithPlayers(): boolean {
    const dvdRect = { position: this.dvd.position, size: DVD_SIZE };
    return this.players.some((player) => {
      const circle = { position: player.position, radius: player.radius };
      return rectCircleIntersect(dvdRect, circle);
    });
  }

  private triggerGameOver(): void {
    this.phase = Phase.GameOver;
    this.phaseTimer = 0;
    this.restartReady = false;
    this.slowMotionTimer = SLOW_MOTION_DURATION;
    this.timeScale = 0.2;
    this.hitFlash = 1;
    void this.sfx.play('hit', { volume: 0.32, duration: 0.24 });
  }

  private renderBackground(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    const hueBase = (this.dvd.hue + this.score * 0.01) % 1;
    const topColor = new Color().setHSL(hueBase, 0.55, 0.18);
    const bottomColor = new Color().setHSL((hueBase + 0.1) % 1, 0.75, 0.08);
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, topColor.getStyle());
    gradient.addColorStop(1, bottomColor.getStyle());
    ctx.save();
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }

  private renderDvd(ctx: CanvasRenderingContext2D): void {
    const { position } = this.dvd;
    const glowStrength = this.dvd.glow;
    const hue = this.dvd.hue;

    ctx.save();
    ctx.translate(position.x + DVD_SIZE.x / 2, position.y + DVD_SIZE.y / 2);

    const baseColor = new Color().setHSL(hue, 0.7, 0.55);
    const borderColor = baseColor.clone().offsetHSL(0, -0.2, -0.2);
    const shineColor = baseColor.clone().offsetHSL(-0.02, 0.1, 0.15);

    ctx.fillStyle = baseColor.getStyle();
    ctx.strokeStyle = borderColor.getStyle();
    ctx.lineWidth = 4;
    const drawRoundedRect = () => {
      const radius = 18;
      if (typeof ctx.roundRect === 'function') {
        ctx.roundRect(-DVD_SIZE.x / 2, -DVD_SIZE.y / 2, DVD_SIZE.x, DVD_SIZE.y, radius);
      } else {
        const w = DVD_SIZE.x;
        const h = DVD_SIZE.y;
        const r = Math.min(radius, Math.abs(w / 2), Math.abs(h / 2));
        ctx.moveTo(-w / 2 + r, -h / 2);
        ctx.arcTo(w / 2, -h / 2, w / 2, h / 2, r);
        ctx.arcTo(w / 2, h / 2, -w / 2, h / 2, r);
        ctx.arcTo(-w / 2, h / 2, -w / 2, -h / 2, r);
        ctx.arcTo(-w / 2, -h / 2, w / 2, -h / 2, r);
        ctx.closePath();
      }
    };

    ctx.beginPath();
    drawRoundedRect();
    ctx.fill();
    ctx.stroke();

    const sheenGradient = ctx.createLinearGradient(-DVD_SIZE.x / 2, -DVD_SIZE.y / 2, DVD_SIZE.x / 2, DVD_SIZE.y / 2);
    sheenGradient.addColorStop(0, `${shineColor.getStyle()}`);
    sheenGradient.addColorStop(1, 'transparent');
    ctx.globalAlpha = clamp(glowStrength * 0.6 + 0.35, 0.35, 0.9);
    ctx.fillStyle = sheenGradient;
    ctx.beginPath();
    drawRoundedRect();
    ctx.fill();

    ctx.globalAlpha = 1;
    ctx.fillStyle = '#0c1020';
    ctx.font = 'bold 38px "Futura PT", "Noto Sans JP", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DVD', 0, 4);

    ctx.restore();
  }

  private renderCoins(ctx: CanvasRenderingContext2D): void {
    this.coins.forEach((coin) => {
      const progress = clamp(coin.ttl / COIN_LIFETIME, 0, 1);
      const scale = lerp(0.9, 1.2, 1 - progress);
      ctx.save();
      ctx.translate(coin.position.x, coin.position.y);
      ctx.scale(scale, scale);
      const gradient = ctx.createRadialGradient(0, -6, 6, 0, 0, COIN_RADIUS);
      gradient.addColorStop(0, '#fff9c4');
      gradient.addColorStop(0.7, '#ffd54f');
      gradient.addColorStop(1, '#fbc02d');
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(0, 0, COIN_RADIUS, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.65)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, COIN_RADIUS - 5, 0, Math.PI * 2);
      ctx.stroke();

      ctx.fillStyle = '#6d4c41';
      ctx.font = 'bold 20px "Noto Sans JP", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('¥', 0, 0);
      ctx.restore();
    });
  }

  private renderBursts(ctx: CanvasRenderingContext2D): void {
    this.bursts.forEach((burst) => {
      const t = clamp(burst.elapsed / burst.life, 0, 1);
      const alpha = 1 - t;
      const radius = lerp(8, 48, t);
      ctx.save();
      ctx.globalAlpha = alpha * 0.6;
      ctx.fillStyle = 'rgba(255, 244, 168, 0.8)';
      ctx.beginPath();
      ctx.arc(burst.position.x, burst.position.y, radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  private renderPlayers(ctx: CanvasRenderingContext2D): void {
    this.players.forEach((player, index) => {
      const pulse = 1 + Math.sin(performance.now() / 300 + index) * 0.04;
      const radius = player.radius * pulse;
      const gradient = ctx.createRadialGradient(
        player.position.x,
        player.position.y,
        radius * 0.25,
        player.position.x,
        player.position.y,
        radius,
      );
      gradient.addColorStop(0, 'rgba(129,212,250,0.9)');
      gradient.addColorStop(1, 'rgba(2,119,189,0.4)');

      ctx.save();
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(player.position.x, player.position.y, radius, 0, Math.PI * 2);
      ctx.fill();

      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.65)';
      ctx.stroke();

      ctx.font = '16px "Noto Sans JP", sans-serif';
      ctx.fillStyle = '#e1f5fe';
      ctx.textAlign = 'center';
      ctx.fillText(`P${index + 1}`, player.position.x, player.position.y - radius - 12);
      ctx.restore();
    });
  }

  private renderHud(ctx: CanvasRenderingContext2D, width: number): void {
    ctx.save();
    ctx.fillStyle = 'rgba(4, 8, 24, 0.55)';
    ctx.fillRect(HUD_PADDING / 2, HUD_PADDING / 2, 200, 64);
    ctx.fillRect(width / 2 - 100, HUD_PADDING / 2, 200, 48);
    ctx.fillRect(width - HUD_PADDING / 2 - 200, HUD_PADDING / 2, 200, 72);

    ctx.fillStyle = '#8bd5ff';
    ctx.font = '14px "Noto Sans JP", sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText('スコア', HUD_PADDING / 2 + 16, HUD_PADDING / 2 + 10);

    ctx.font = 'bold 32px "Noto Sans JP", sans-serif';
    ctx.fillStyle = '#e1f5fe';
    ctx.fillText(formatInteger(this.score, 3), HUD_PADDING / 2 + 16, HUD_PADDING / 2 + 24);

    ctx.textAlign = 'center';
    ctx.font = 'bold 20px "Noto Sans JP", sans-serif';
    ctx.fillStyle = '#ffe082';
    ctx.fillText(`ベスト ${formatInteger(this.bestScore, 3)}`, width / 2, HUD_PADDING / 2 + 12);

    ctx.textAlign = 'right';
    ctx.fillStyle = '#b3e5fc';
    ctx.font = '14px "Noto Sans JP", sans-serif';
    ctx.fillText(`Players: ${this.playerCount}`, width - HUD_PADDING / 2 - 16, HUD_PADDING / 2 + 10);
    ctx.fillText(
      `スピード x${this.dvd.speedMultiplier.toFixed(2)}`,
      width - HUD_PADDING / 2 - 16,
      HUD_PADDING / 2 + 30,
    );
    ctx.fillText(
      `加速 ${Math.floor(this.elapsedPlayTime)}s`,
      width - HUD_PADDING / 2 - 16,
      HUD_PADDING / 2 + 50,
    );

    ctx.restore();
  }

  private renderPhaseOverlay(
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ): void {
    ctx.save();
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (this.phase === Phase.Splash) {
      ctx.fillStyle = 'rgba(4, 8, 20, 0.65)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#d1f4ff';
      ctx.font = 'bold 64px "Noto Sans JP", sans-serif';
      ctx.fillText('DVD Dodge', width / 2, height / 2 - 32);
      ctx.font = '24px "Noto Sans JP", sans-serif';
      ctx.fillText('スペース / クリックでスタート', width / 2, height / 2 + 32);
    } else if (this.phase === Phase.Calibrate) {
      ctx.fillStyle = 'rgba(2, 6, 18, 0.5)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#b3e5fc';
      ctx.font = 'bold 40px "Noto Sans JP", sans-serif';
      ctx.fillText('カメラを調整中...', width / 2, height / 2 - 32);
      ctx.font = '20px "Noto Sans JP", sans-serif';
      const subtitle = this.calibrationError
        ? this.calibrationError
        : '画面全体に身体または手を入れてください';
      ctx.fillText(subtitle, width / 2, height / 2 + 24);
    } else if (this.phase === Phase.Countdown) {
      const label: CountdownLabel =
        COUNTDOWN_SEQUENCE[Math.min(this.countdownIndex, COUNTDOWN_SEQUENCE.length - 1)];
      ctx.fillStyle = 'rgba(2, 6, 18, 0.35)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#fff59d';
      ctx.shadowColor = 'rgba(255, 245, 157, 0.8)';
      ctx.shadowBlur = 24;
      ctx.font = 'bold 96px "Noto Sans JP", sans-serif';
      ctx.fillText(label, width / 2, height / 2);
    } else if (this.phase === Phase.GameOver) {
      ctx.fillStyle = 'rgba(8, 0, 12, 0.55)';
      ctx.fillRect(0, 0, width, height);
      ctx.fillStyle = '#ff8a80';
      ctx.font = 'bold 56px "Noto Sans JP", sans-serif';
      ctx.fillText('HIT!', width / 2, height / 2 - 48);
      ctx.fillStyle = '#fce4ec';
      ctx.font = '24px "Noto Sans JP", sans-serif';
      ctx.fillText(`スコア: ${this.score} / ベスト: ${this.bestScore}`, width / 2, height / 2 + 8);
      if (this.restartReady) {
        ctx.fillStyle = '#b3e5fc';
        ctx.fillText('スペース / クリックで再スタート', width / 2, height / 2 + 48);
      } else {
        ctx.fillStyle = '#90caf9';
        ctx.fillText('リトライ準備中...', width / 2, height / 2 + 48);
      }
    }
    ctx.restore();
  }

  private renderFlash(ctx: CanvasRenderingContext2D, width: number, height: number): void {
    if (this.hitFlash <= 0) {
      return;
    }
    ctx.save();
    ctx.globalAlpha = this.hitFlash * 0.6;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.restore();
  }
}
