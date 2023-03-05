import { CanvasImage } from './CanvasImage';
import { Rect } from './Rect';

const carWidth = 44;
const carHeight = 80;

export class Player extends CanvasImage {
  readonly wheelWidth = 10;
  readonly wheelHeight = 20;
  readonly wheelOffset = 3;
  readonly skidsWidth = 10;

  vx = 0;
  maxVx = 10;
  bounceConservationCoefficient = 0.6;

  steer = 0;

  canvasWidth: number;
  canvasHeight: number;
  skids: Array<{ x: number; y: number }> = [];

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

  physicsTick() {
    if (this.vx + this.steer < this.maxVx && this.vx + this.steer > -this.maxVx) {
      this.vx += this.steer;
    } else {
      this.vx = this.vx < 0 ? -this.maxVx : this.maxVx;
    }

    if (this.vx < 0 && this.x + this.vx <= 10) {
      this.vx = -this.vx;
      this.x = 10 * this.bounceConservationCoefficient;
      this.steer = Math.abs(this.steer * 0.2);
    } else if (this.vx > 0 && this.x + this.vx >= this.canvasWidth - this.width - 10) {
      this.vx = -this.vx * this.bounceConservationCoefficient;
      this.x = this.canvasWidth - this.width - 10;
      this.steer = -Math.abs(this.steer * 0.2);
    } else {
      this.x += this.vx;
    }

    this.skids = this.skids.slice(0, 300).map((skid) => ({ x: skid.x, y: skid.y + 2 }));
    this.skids.unshift({ x: this.x + 3, y: this.y + carHeight });
    this.skids.unshift({ x: this.x + carWidth - this.skidsWidth - 3, y: this.y + carHeight });
  }

  draw(ctx: CanvasRenderingContext2D): void {
    this.skids.forEach((skid) => {
      ctx.fillStyle = '#3d3d3d';
      ctx.fillRect(skid.x, skid.y, this.skidsWidth, 5);
    });
    super.draw(ctx);
  }
}
