import { Rect } from './Rect';

export class StreetPiece extends Rect {
  constructor(x: number, y: number, roadWidth: number, redCurbs: boolean) {
    super(x, y, roadWidth, 5, redCurbs ? '#f00' : '#fff');
    this.type = 'street-piece';
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, 10, this.height);
    ctx.fillStyle = '#5d5d5d';
    ctx.fillRect(this.x + 10, this.y, this.width - 20, this.height);
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x + this.width - 10, this.y, 10, this.height);
  }
}
