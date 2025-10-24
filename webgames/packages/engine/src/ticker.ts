type UpdateCallback = (delta: number) => void;

const STEP = 1000 / 60;
const MAX_STEPS = 5;

export class Ticker {
  private lastTick = performance.now();
  private accumulated = 0;
  private running = false;
  private readonly subscribers: UpdateCallback[] = [];
  private rafId = 0;

  start(): void {
    if (this.running) {
      return;
    }
    this.running = true;
    this.lastTick = performance.now();
    this.loop();
  }

  stop(): void {
    this.running = false;
    cancelAnimationFrame(this.rafId);
  }

  subscribe(callback: UpdateCallback): () => void {
    this.subscribers.push(callback);
    return () => {
      const index = this.subscribers.indexOf(callback);
      if (index >= 0) {
        this.subscribers.splice(index, 1);
      }
    };
  }

  private loop = (): void => {
    if (!this.running) {
      return;
    }

    const now = performance.now();
    const delta = now - this.lastTick;
    this.lastTick = now;
    this.accumulated += delta;

    let steps = 0;
    while (this.accumulated >= STEP && steps < MAX_STEPS) {
      this.accumulated -= STEP;
      this.subscribers.forEach((callback) => callback(STEP / 1000));
      steps += 1;
    }

    this.rafId = requestAnimationFrame(this.loop);
  };
}
