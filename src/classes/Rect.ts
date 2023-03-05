import { Drawable } from './Drawable';

export class Rect implements Drawable {
  color: string;
  x: number;
  y: number;
  width: number;
  height: number;
  stationary: boolean;
  type = 'rect';

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    stationary = true,
    color = '#fff'
  ) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.color = color;
    this.stationary = stationary;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}
