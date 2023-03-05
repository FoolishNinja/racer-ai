import { reactive } from 'vue';
import { Options, Vue } from 'vue-class-component';
import { Drawable } from '../classes/Drawable';
import { Player } from '../classes/Player';
import { Rect } from '../classes/Rect';
import { ScreenText } from '../classes/ScreenText';

@Options({
  components: {},
})
export default class GameView extends Vue {
  width = 550;

  height = 800;

  fps = 0;
  tps = 0;

  maxVx = 10;

  bounceConservationCoefficient = 0.6;

  steer = 0;

  paused = false;

  recording = false;

  playingBack = false;

  recordedInputs: number[] = [];

  player: Player = new Player(this.width, this.height);
  infoText = new ScreenText(
    10,
    20,
    `FPS: ${this.fps} TPS: ${this.tps} STEER: ${this.player.steer.toFixed(2)}`
  );
  steerText = new ScreenText(this.width - 180, 20, `STEER: ${this.player.steer.toFixed(2)}`);

  drawables: Array<Drawable> = [
    new Rect(0, 0, this.width, this.height),
    this.infoText,
    this.steerText,
  ];

  renderCanvas: HTMLCanvasElement = reactive({} as HTMLCanvasElement);
  displayCanvas: HTMLCanvasElement = reactive({} as HTMLCanvasElement);

  renderCtx: CanvasRenderingContext2D | null = null;
  displayCtx: CanvasRenderingContext2D | null = null;

  mounted() {
    this.renderCtx = this.renderCanvas.getContext('2d');
    this.displayCtx = this.displayCanvas.getContext('2d');
    this.player = new Player(this.width, this.height);
    this.drawables.push(this.player);
    window.addEventListener('keypress', this.handleKeyPress);
    this.start();
  }

  start() {
    this.tick();
    setInterval(() => {
      if (this.paused) return;
      this.physicsTick();
      this.tps++;
    }, 1000 / 64);
    setInterval(() => {
      this.infoText.text = `FPS: ${this.fps} TPS: ${this.tps}`;
      this.fps = 0;
      this.tps = 0;
    }, 1000);
  }

  tick() {
    window.requestAnimationFrame(() => {
      if (this.renderCtx && this.displayCtx && !this.paused) {
        this.renderTick(this.renderCtx, this.displayCtx);
      }
      this.fps++;
      this.tick();
    });
  }

  handleKeyPress(e: KeyboardEvent) {
    if (this.playingBack) return;
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
      case 'r':
        if (!this.recording) {
          this.player.reset();
          this.recordedInputs = [];
        }
        this.recording = !this.recording;
        break;
      case 'p':
        this.playBackRecording();
        break;
      default:
        break;
    }
  }

  playBackRecording() {
    this.paused = true;
    this.recording = false;
    this.player.reset();
    this.playingBack = true;
    this.paused = false;
  }

  stopPlayBack() {
    this.paused = true;
    this.playingBack = false;
    setTimeout(() => {
      this.player.reset();
      this.paused = false;
    }, 1000);
  }

  physicsTick() {
    if (this.recording) {
      this.recordedInputs.push(this.player.steer);
    }

    if (this.playingBack) {
      const steer = this.recordedInputs.shift();
      if (steer !== undefined) this.player.steer = steer;
      else this.stopPlayBack();
    }

    if (
      this.player.vx + this.player.steer < this.maxVx &&
      this.player.vx + this.player.steer > -this.maxVx
    ) {
      this.player.vx += this.player.steer;
    } else {
      this.player.vx = this.player.vx < 0 ? -this.maxVx : this.maxVx;
    }

    if (this.player.vx < 0 && this.player.x + this.player.vx <= 10) {
      this.player.vx = -this.player.vx;
      this.player.x = 10 * this.bounceConservationCoefficient;
      this.player.steer = Math.abs(this.player.steer * 0.2);
    } else if (
      this.player.vx > 0 &&
      this.player.x + this.player.vx >= this.width - this.player.width - 10
    ) {
      this.player.vx = -this.player.vx * this.bounceConservationCoefficient;
      this.player.x = this.width - this.player.width - 10;
      this.player.steer = -Math.abs(this.player.steer * 0.2);
    } else {
      this.player.x += this.player.vx;
    }
  }

  renderTick(renderCtx: CanvasRenderingContext2D, displayCtx: CanvasRenderingContext2D) {
    displayCtx.drawImage(this.renderCanvas, 0, 0);
    this.steerText.text = `VX: ${this.player.vx.toFixed(2)} STEER: ${this.player.steer.toFixed(2)}`;
    this.drawables.forEach((drawable) => drawable.draw(renderCtx));
  }
}
