import { CanvasImage } from './CanvasImage';
import { Rect } from './Rect';

const carWidth = 44;
const carHeight = 80;

export class Player extends CanvasImage {
  readonly wheelWidth = 10;
  readonly wheelHeight = 20;
  readonly wheelOffset = 3;

  vx = 0;
  steer = 0;

  canvasWidth: number;
  canvasHeight: number;

  wheels: Rect[] = [];

  constructor(canvasWidth: number, canvasHeight: number) {
    super(
      canvasWidth / 2 - carWidth / 2,
      canvasHeight - carHeight - 40,
      carWidth,
      carHeight,
      'car-image'
    );
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;
  }

  reset() {
    this.vx = 0;
    this.x = this.canvasWidth / 2 - 25;
    this.steer = 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
  }
}
