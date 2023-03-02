import { Rect } from './Rect';

export class Player extends Rect {
  readonly wheelWidth = 10;
  readonly wheelHeight = 20;
  readonly wheelOffset = 3;

  topLeft: Rect;
  topRight: Rect;
  bottomLeft: Rect;
  bottomRight: Rect;

  color = '#f00';

  vx = 0;
  steer = 0;

  canvasWidth: number;
  canvasHeight: number;

  wheels: Rect[] = [];

  constructor(canvasWidth: number, canvasHeight: number) {
    super(canvasWidth / 2 - 25, canvasHeight - 120, 50, 80);
    this.canvasWidth = canvasWidth;
    this.canvasHeight = canvasHeight;

    this.topLeft = new Rect(
      this.x - this.wheelOffset,
      this.y - this.wheelOffset,
      this.wheelWidth,
      this.wheelHeight,
      '#000'
    );
    this.topRight = new Rect(
      this.x + this.width - this.wheelWidth + this.wheelOffset,
      this.y - this.wheelOffset,
      this.wheelWidth,
      this.wheelHeight,
      '#000'
    );
    this.bottomLeft = new Rect(
      this.x - this.wheelOffset,
      this.y + this.height - this.wheelHeight + this.wheelOffset,
      this.wheelWidth,
      this.wheelHeight,
      '#000'
    );
    this.bottomRight = new Rect(
      this.x + this.width - this.wheelWidth + this.wheelOffset,
      this.y + this.height - this.wheelHeight + this.wheelOffset,
      this.wheelWidth,
      this.wheelHeight,
      '#000'
    );
    this.wheels.push(this.topLeft, this.topRight, this.bottomLeft, this.bottomRight);
  }

  reset() {
    this.vx = 0;
    this.x = this.canvasWidth / 2 - 25;
    this.steer = 0;
  }

  draw(ctx: CanvasRenderingContext2D): void {
    super.draw(ctx);
    this.drawWheels(ctx);
  }

  drawWheels(ctx: CanvasRenderingContext2D): void {
    this.topLeft.x = this.x - this.wheelOffset;
    this.topRight.x = this.x + this.width - this.wheelWidth + this.wheelOffset;
    this.bottomLeft.x = this.x - this.wheelOffset;
    this.bottomRight.x = this.x + this.width - this.wheelWidth + this.wheelOffset;
    this.wheels.forEach((wheel) => wheel.draw(ctx));
  }
}
