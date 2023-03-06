import { Drawable } from './Drawable';

export class Skid implements Drawable {
  static readonly skidsWidth = 10;

  x: number;
  y: number;
  color = '#3d3d3d';
  type = 'skid-mark';

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, Skid.skidsWidth, 5);
  }
}
