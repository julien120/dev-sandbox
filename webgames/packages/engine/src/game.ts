import { AudioManager } from './audio';
import type { Scene } from './scene';
import { Ticker } from './ticker';
import { InputManager } from './input';
import { Renderer } from './renderer';

export interface GameOptions {
  debug?: boolean;
  background?: string;
}

export class Game {
  readonly audio = new AudioManager();
  readonly input: InputManager;
  readonly renderer: Renderer;
  readonly ticker = new Ticker();

  private currentScene: Scene | null = null;
  private elapsedTime = 0;
  private readonly options: GameOptions;

  constructor(canvas: HTMLCanvasElement, options: GameOptions = {}) {
    this.options = options;
    this.renderer = new Renderer(canvas);
    this.input = new InputManager(window);
    this.input.attach();
    this.ticker.subscribe(this.update);
  }

  setScene(scene: Scene): void {
    if (this.currentScene?.onExit) {
      this.currentScene.onExit(this.createContext());
    }
    this.currentScene = scene;
    if (this.currentScene?.onEnter) {
      this.currentScene.onEnter(this.createContext());
    }
  }

  start(): void {
    this.elapsedTime = 0;
    this.ticker.start();
  }

  stop(): void {
    this.ticker.stop();
  }

  dispose(): void {
    this.stop();
    this.input.detach();
  }

  private update = (dt: number): void => {
    const context = this.createContext(dt);
    if (this.options.background) {
      this.renderer.clear(this.options.background);
    } else {
      this.renderer.clear();
    }
    this.currentScene?.update(dt, context);
    this.currentScene?.render(context);
    this.elapsedTime += dt;
  };

  private createContext(dt = 0): Parameters<Scene['update']>[1] {
    return {
      renderer: this.renderer,
      input: this.input,
      elapsedTime: this.elapsedTime + dt,
    };
  }
}
