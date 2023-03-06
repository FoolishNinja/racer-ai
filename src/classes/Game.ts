import { Drawable } from './Drawable';
import { Player } from './Player';
import { Rect } from './Rect';
import { ScreenText } from './ScreenText';

export class Game {
  // Screen
  screenWidth: number;
  screenHeight: number;

  // Rendering
  scrollCanvas: HTMLCanvasElement;
  fixedCanvas: HTMLCanvasElement;
  displayCanvas: HTMLCanvasElement;
  scrollCtx: CanvasRenderingContext2D;
  fixedCtx: CanvasRenderingContext2D;
  displayCtx: CanvasRenderingContext2D;
  backgroundDrawables: Drawable[];
  scrollDrawables: Drawable[];
  fixedDrawables: Drawable[];

  /**
   * Game
   */

  // Variables
  fps = 0;
  tps = 0;
  dy = 0;
  dyPerTick = 3;
  paused = false;

  // Custom drawables
  player: Player;
  infoText: ScreenText;
  steerText: ScreenText;

  constructor(
    scrollCanvas: HTMLCanvasElement,
    fixedCanvas: HTMLCanvasElement,
    displayCanvas: HTMLCanvasElement,
    scrollCtx: CanvasRenderingContext2D,
    fixedCtx: CanvasRenderingContext2D,
    displayCtx: CanvasRenderingContext2D,
    screenWidth: number,
    screenHeight: number
  ) {
    this.scrollCanvas = scrollCanvas;
    this.fixedCanvas = fixedCanvas;
    this.displayCanvas = displayCanvas;
    this.scrollCtx = scrollCtx;
    this.fixedCtx = fixedCtx;
    this.displayCtx = displayCtx;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.player = new Player(this.screenWidth, this.screenHeight);

    this.infoText = new ScreenText(
      10,
      20,
      `FPS: ${this.fps} TPS: ${this.tps} STEER: ${this.player.steer.toFixed(2)}`,
      '15px Arial',
      '#fff'
    );

    this.steerText = new ScreenText(
      this.screenWidth - 180,
      20,
      `STEER: ${this.player.steer.toFixed(2)}`,
      '15px Arial',
      '#fff'
    );

    this.backgroundDrawables = [new Rect(0, 0, this.screenWidth, this.screenHeight, '#567d46')];
    this.scrollDrawables = [new Rect(0, this.screenHeight - 200, this.screenWidth, 200, '#5d5d5d')];
    this.fixedDrawables = [this.infoText, this.steerText, this.player];

    window.addEventListener('keypress', (e) => this.handleKeyPress(e));
  }

  start() {
    this.tick();
    this.startGameTick();
    this.startFpsTick();
  }

  startGameTick() {
    setInterval(() => {
      if (this.paused) return;
      this.physicsTick();
      this.tps++;
      this.dy += this.dyPerTick;
    }, 1000 / 64);
  }

  startFpsTick() {
    setInterval(() => {
      this.infoText.text = `FPS: ${this.fps} TPS: ${this.tps}`;
      this.fps = 0;
      this.tps = 0;
    }, 1000);
  }

  tick() {
    window.requestAnimationFrame(() => {
      if (this.displayCtx && !this.paused) {
        this.renderTick();
      }
      this.fps++;
      this.tick();
    });
  }

  handleKeyPress(e: KeyboardEvent) {
    switch (e.key) {
      case 'a':
        this.player.steer = -0.6;
        break;
      case 'd':
        this.player.steer = 0.6;
        break;
      case 'q':
        this.paused = !this.paused;
        break;
      default:
        break;
    }
  }

  stopPlayBack() {
    this.paused = true;
    setTimeout(() => {
      this.player.reset();
      this.paused = false;
    }, 1000);
  }

  physicsTick() {
    this.player.physicsTick();
  }

  renderTick() {
    this.fixedCtx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    this.scrollCtx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    this.displayCtx.clearRect(0, 0, this.screenWidth, this.screenHeight);

    this.backgroundDrawables.forEach((drawable) => drawable.draw(this.displayCtx));

    this.fixedDrawables.forEach((drawable) => drawable.draw(this.fixedCtx));

    this.scrollCtx.setTransform(1, 0, 0, 1, 0, this.dy);
    this.scrollDrawables.forEach((drawable) => drawable.draw(this.scrollCtx));

    this.displayCtx.drawImage(this.scrollCanvas, 0, 0);
    this.displayCtx.drawImage(this.fixedCanvas, 0, 0);
    this.steerText.text = `VX: ${this.player.vx.toFixed(2)} STEER: ${this.player.steer.toFixed(2)}`;
  }
}
