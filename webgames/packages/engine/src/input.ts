type InputCallback = (event: KeyboardEvent | PointerEvent) => void;

export class InputManager {
  private readonly pressedKeys = new Set<string>();
  private pointerPosition = { x: 0, y: 0 };
  private listeners: InputCallback[] = [];
  private readonly keyDownListener = (event: KeyboardEvent) => this.handleKeyDown(event);
  private readonly keyUpListener = (event: KeyboardEvent) => this.handleKeyUp(event);
  private readonly pointerListener = (event: PointerEvent) => this.handlePointer(event);

  constructor(private readonly target: HTMLElement | Window = window) {}

  attach(): void {
    this.addTargetListeners(this.target);
  }

  detach(): void {
    this.removeTargetListeners(this.target);

    this.pressedKeys.clear();
    this.listeners = [];
  }

  private addTargetListeners(target: HTMLElement | Window): void {
    if (target instanceof Window) {
      target.addEventListener('keydown', this.keyDownListener, { passive: true });
      target.addEventListener('keyup', this.keyUpListener, { passive: true });
      target.addEventListener('pointerdown', this.pointerListener, { passive: true });
      target.addEventListener('pointerup', this.pointerListener, { passive: true });
      target.addEventListener('pointermove', this.pointerListener, { passive: true });
      return;
    }

    target.addEventListener('keydown', this.keyDownListener, { passive: true });
    target.addEventListener('keyup', this.keyUpListener, { passive: true });
    target.addEventListener('pointerdown', this.pointerListener, { passive: true });
    target.addEventListener('pointerup', this.pointerListener, { passive: true });
    target.addEventListener('pointermove', this.pointerListener, { passive: true });
  }

  private removeTargetListeners(target: HTMLElement | Window): void {
    if (target instanceof Window) {
      target.removeEventListener('keydown', this.keyDownListener);
      target.removeEventListener('keyup', this.keyUpListener);
      target.removeEventListener('pointerdown', this.pointerListener);
      target.removeEventListener('pointerup', this.pointerListener);
      target.removeEventListener('pointermove', this.pointerListener);
      return;
    }

    target.removeEventListener('keydown', this.keyDownListener);
    target.removeEventListener('keyup', this.keyUpListener);
    target.removeEventListener('pointerdown', this.pointerListener);
    target.removeEventListener('pointerup', this.pointerListener);
    target.removeEventListener('pointermove', this.pointerListener);
  }

  isKeyPressed(key: string): boolean {
    return this.pressedKeys.has(key.toLowerCase());
  }

  getPointerPosition(): { x: number; y: number } {
    return { ...this.pointerPosition };
  }

  onInput(callback: InputCallback): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((listener) => listener !== callback);
    };
  }

  private handleKeyDown = (event: KeyboardEvent): void => {
    this.pressedKeys.add(event.key.toLowerCase());
    this.listeners.forEach((listener) => listener(event));
  };

  private handleKeyUp = (event: KeyboardEvent): void => {
    this.pressedKeys.delete(event.key.toLowerCase());
    this.listeners.forEach((listener) => listener(event));
  };

  private handlePointer = (event: PointerEvent): void => {
    this.pointerPosition = { x: event.clientX, y: event.clientY };
    this.listeners.forEach((listener) => listener(event));
  };
}
