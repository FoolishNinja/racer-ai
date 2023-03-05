import store from '@/store';
import { CanvasImage } from './CanvasImage';
import { Drawable } from './Drawable';
import { Rect } from './Rect';
import { Skid } from './Skid';

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

    store.state.drawables = [
      ...this.drawables.filter((d) => d.type !== 'skid-mark'),
      ...this.drawables.filter((d) => d.type === 'skid-mark').slice(0, 300),
    ];

    this.drawables.unshift(new Skid(this.x + 3, this.y + carHeight));
    this.drawables.unshift(new Skid(this.x + carWidth - Skid.skidsWidth - 3, this.y + carHeight));
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
  }

  get drawables(): Drawable[] {
    return store.state.drawables;
  }
}
