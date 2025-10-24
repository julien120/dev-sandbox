import type { InputManager } from './input';
import type { Renderer } from './renderer';

export interface SceneContext {
  renderer: Renderer;
  input: InputManager;
  elapsedTime: number;
}

export abstract class Scene {
  abstract update(dt: number, context: SceneContext): void;
  abstract render(context: SceneContext): void;

  onEnter?(context: SceneContext): void;
  onExit?(context: SceneContext): void;
}
