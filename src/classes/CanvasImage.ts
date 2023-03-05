import { Drawable } from './Drawable';
import { Rect } from './Rect';

export class CanvasImage extends Rect implements Drawable {
  domId: string;
  image: HTMLImageElement | null;
  type = 'canvas-image';

  constructor(
    x: number,
    y: number,
    width: number,
    height: number,
    domId: string,
    stationary = true
  ) {
    super(x, y, width, height, stationary);
    this.domId = domId;
    this.image = document.getElementById(domId) as HTMLImageElement;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    if (this.image) ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}
