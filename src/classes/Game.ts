import { Drawable } from './Drawable';
import { Player } from './Player';
import { Rect } from './Rect';
import { ScreenText } from './ScreenText';
import { StreetPiece } from './StreetPiece';

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
  dyPerTick = 5;
  paused = false;
  nextRoadPieceRed = false;
  curvesPerSecond = 1;
  minNextCurveXDifference = 60;
  nextCurveX = 0;
  currentRoadPieceX = 0;
  transitionRoadPieceXPerTick = 0;
  roadWidth = 180;

  playerIsAboveStreetRect = new Rect(250, 10, 15, 15, '#f00');

  get randomCurveX(): number {
    let newCurveX = 0;
    while (Math.abs(newCurveX - this.nextCurveX) < this.minNextCurveXDifference) {
      newCurveX = Math.floor(Math.random() * (this.screenWidth - this.roadWidth));
    }
    return newCurveX;
  }

  get xRoadTransitionPerTick(): number {
    return Math.abs(this.currentRoadPieceX - this.nextCurveX) / 64;
  }

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

    this.nextCurveX = this.screenWidth / 2 - 100;
    this.currentRoadPieceX = this.nextCurveX;
    this.transitionRoadPieceXPerTick = this.xRoadTransitionPerTick;

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
    this.fixedDrawables = [
      this.infoText,
      this.steerText,
      this.player,
      this.playerIsAboveStreetRect,
    ];

    for (let y = 0; y < this.screenHeight - 200; y += 5) {
      this.scrollDrawables.push(
        new StreetPiece(this.currentRoadPieceX, y, this.roadWidth, this.nextRoadPieceRed)
      );
      this.nextRoadPieceRed = !this.nextRoadPieceRed;
    }

    window.addEventListener('keypress', (e) => this.handleKeyPress(e));
  }

  start() {
    this.tick();
    this.startGameTick();
    this.startFpsTick();
    this.startCurveTick();
  }

  startGameTick() {
    setInterval(() => {
      if (this.paused) return;
      this.physicsTick();
    }, 1000 / 64);
  }

  startFpsTick() {
    setInterval(() => {
      this.infoText.text = `FPS: ${this.fps} TPS: ${this.tps}`;
      this.fps = 0;
      this.tps = 0;
    }, 1000);
  }

  startCurveTick() {
    setInterval(() => {
      this.nextCurveX = this.randomCurveX;
      this.transitionRoadPieceXPerTick = this.xRoadTransitionPerTick;
    }, 1000 / this.curvesPerSecond);
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
        this.player.steer = -0.3;
        break;
      case 'd':
        this.player.steer = 0.3;
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

    this.tps++;
    this.dy += this.dyPerTick;
    this.scrollDrawables.push(
      new StreetPiece(this.currentRoadPieceX, -this.dy, this.roadWidth, this.nextRoadPieceRed)
    );

    if (this.currentRoadPieceX > this.nextCurveX) {
      this.currentRoadPieceX -= this.transitionRoadPieceXPerTick;
    } else {
      this.currentRoadPieceX += this.transitionRoadPieceXPerTick;
    }

    this.nextRoadPieceRed = !this.nextRoadPieceRed;

    this.scrollDrawables = this.scrollDrawables.filter((d) => d.y < -this.dy + this.screenHeight);

    const p = this.displayCtx.getImageData(
      this.player.x + this.player.width / 2,
      this.player.y - 3,
      1,
      1
    ).data;

    // If transparency on the image
    if (!(p[0] === 0 && p[1] === 0 && p[2] === 0 && p[3] === 0)) {
      const hex = `#${`000000${this.rgbToHex(p[0], p[1], p[2])}`.slice(-6)}`;
      this.playerIsAboveStreetRect.color = hex === '#5d5d5d' ? '#0f0' : '#f00';
    }
  }

  renderTick() {
    this.fixedCtx.clearRect(0, 0, this.screenWidth, this.screenHeight);
    this.scrollCtx.clearRect(0, -this.dy, this.screenWidth, this.screenHeight);
    this.displayCtx.clearRect(0, 0, this.screenWidth, this.screenHeight);

    this.backgroundDrawables.forEach((drawable) => drawable.draw(this.displayCtx));

    this.fixedDrawables.forEach((drawable) => drawable.draw(this.fixedCtx));

    this.scrollCtx.setTransform(1, 0, 0, 1, 0, this.dy);
    this.scrollDrawables.forEach((drawable) => drawable.draw(this.scrollCtx));

    this.displayCtx.drawImage(this.scrollCanvas, 0, 0);
    this.displayCtx.drawImage(this.fixedCanvas, 0, 0);
    this.steerText.text = `VX: ${this.player.vx.toFixed(2)} STEER: ${this.player.steer.toFixed(2)}`;
  }

  rgbToHex(r: number, g: number, b: number) {
    return ((r << 16) | (g << 8) | b).toString(16);
  }
}
