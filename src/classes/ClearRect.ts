import { Rect } from './Rect';

export class ClearRect extends Rect {
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.clearRect(this.x, this.y, this.width, this.height);
  }
}
