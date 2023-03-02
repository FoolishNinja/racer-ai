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

  player = new Player(this.width, this.height);
  fpsTps = new ScreenText(10, 20, `FPS: ${this.fps} TPS: ${this.tps}`);

  drawables: Array<Drawable> = [new Rect(0, 0, this.width, this.height), this.player, this.fpsTps];

  canvas: HTMLCanvasElement = reactive({} as HTMLCanvasElement);

  ctx: CanvasRenderingContext2D | null = null;

  mounted() {
    this.ctx = this.canvas.getContext('2d');

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
      this.fpsTps.text = `FPS: ${this.fps} TPS: ${this.tps}`;
      this.fps = 0;
      this.tps = 0;
    }, 1000);
  }

  tick() {
    window.requestAnimationFrame(() => {
      if (this.ctx && !this.paused) {
        this.renderTick(this.ctx);
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

  physicsTick() {
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
      this.player.steer *= -0.2;
    } else if (
      this.player.vx > 0 &&
      this.player.x + this.player.vx >= this.width - this.player.width - 10
    ) {
      this.player.vx = -this.player.vx * this.bounceConservationCoefficient;
      this.player.x = this.width - this.player.width - 10;
      this.player.steer *= -0.2;
    } else {
      this.player.x += this.player.vx;
    }
  }

  renderTick(ctx: CanvasRenderingContext2D) {
    this.drawables.forEach((drawable) => drawable.draw(ctx));
  }
}