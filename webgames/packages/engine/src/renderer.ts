import type { Vector2 } from './math';

export class Renderer {
  readonly context: CanvasRenderingContext2D;
  readonly canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    const context = canvas.getContext('2d');
    if (!context) {
      throw new Error('Renderer requires 2D canvas context');
    }
    this.canvas = canvas;
    this.context = context;
    this.context.imageSmoothingEnabled = true;
  }

  clear(color = '#000000'): void {
    const ctx = this.context;
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.restore();
  }

  drawSprite(image: CanvasImageSource, position: Vector2, size: Vector2): void {
    this.context.drawImage(image, position.x, position.y, size.x, size.y);
  }

  drawRect(position: Vector2, size: Vector2, color: string): void {
    const ctx = this.context;
    ctx.save();
    ctx.fillStyle = color;
    ctx.fillRect(position.x, position.y, size.x, size.y);
    ctx.restore();
  }

  drawText(text: string, position: Vector2, options: { font?: string; color?: string } = {}): void {
    const ctx = this.context;
    ctx.save();
    ctx.fillStyle = options.color ?? '#ffffff';
    ctx.font = options.font ?? '16px sans-serif';
    ctx.textBaseline = 'top';
    ctx.fillText(text, position.x, position.y);
    ctx.restore();
  }

  resize(size: Vector2): void {
    this.canvas.width = size.x;
    this.canvas.height = size.y;
  }
}
