import { Drawable } from './Drawable';

export class ScreenText implements Drawable {
  x: number;
  y: number;
  text: string;
  color: string;
  font: string;
  stationary = true;
  type = 'screen-text';

  constructor(x: number, y: number, text: string, font = '15px Arial', color = '#000') {
    this.x = x;
    this.y = y;
    this.text = text;
    this.font = font;
    this.color = color;
  }
  draw(ctx: CanvasRenderingContext2D): void {
    ctx.fillStyle = this.color;
    ctx.font = this.font;
    ctx.textAlign = 'left';
    ctx.fillText(this.text, this.x, this.y);
  }
}
