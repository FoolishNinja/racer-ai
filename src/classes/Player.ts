import { CanvasImage } from './CanvasImage';
import { Rect } from './Rect';

const carWidth = 44;
const carHeight = 80;

export class Player extends CanvasImage {
  readonly wheelWidth = 10;
  readonly wheelHeight = 20;
  readonly wheelOffset = 3;

  vx = 0;
  maxVx = 10;
  bounceConservationCoefficient = 0.6;

  steer = 0;

  canvasWidth: number;
  canvasHeight: number;

  wheels: Rect[] = [];

  constructor(canvasWidth: number, canvasHeight: number) {
    super(
      canvasWidth / 2 - carWidth / 2,
      canvasHeight - carHeight - 100,
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

  physicsTick() {
    if (this.vx + this.steer < this.maxVx && this.vx + this.steer > -this.maxVx) {
      this.vx += this.steer;
    } else {
      this.vx = this.vx < 0 ? -this.maxVx : this.maxVx;
    }

    if (this.vx < 0 && this.x + this.vx <= 0) {
      this.vx = -this.vx;
      this.x = 0;
      this.steer = Math.abs(this.steer * 0.2);
    } else if (this.vx > 0 && this.x + this.vx >= this.canvasWidth - this.width) {
      this.vx = -this.vx * this.bounceConservationCoefficient;
      this.x = this.canvasWidth - this.width;
      this.steer = -Math.abs(this.steer * 0.2);
    } else {
      this.x += this.vx;
    }
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
  }
}
