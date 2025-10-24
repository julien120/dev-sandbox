type InputCallback = (event: KeyboardEvent | PointerEvent) => void;

export class InputManager {
  private readonly pressedKeys = new Set<string>();
  private pointerPosition = { x: 0, y: 0 };
  private listeners: InputCallback[] = [];

  constructor(private readonly target: HTMLElement | Window = window) {}

  attach(): void {
    this.target.addEventListener('keydown', this.handleKeyDown, { passive: true });
    this.target.addEventListener('keyup', this.handleKeyUp, { passive: true });
    this.target.addEventListener('pointerdown', this.handlePointer, { passive: true });
    this.target.addEventListener('pointerup', this.handlePointer, { passive: true });
    this.target.addEventListener('pointermove', this.handlePointer, { passive: true });
  }

  detach(): void {
    this.target.removeEventListener('keydown', this.handleKeyDown);
    this.target.removeEventListener('keyup', this.handleKeyUp);
    this.target.removeEventListener('pointerdown', this.handlePointer);
    this.target.removeEventListener('pointerup', this.handlePointer);
    this.target.removeEventListener('pointermove', this.handlePointer);
    this.pressedKeys.clear();
    this.listeners = [];
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
