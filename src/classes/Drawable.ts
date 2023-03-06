export interface Drawable {
  x: number;
  y: number;
  draw(ctx: CanvasRenderingContext2D): void;
  color?: string;
  type: string;
}
