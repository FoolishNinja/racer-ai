export interface Drawable {
  x: number;
  y: number;
  stationary: boolean;
  draw(ctx: CanvasRenderingContext2D): void;
  color?: string;
}
