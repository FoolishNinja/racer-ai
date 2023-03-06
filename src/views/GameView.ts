import { Game } from '@/classes/Game';
import { reactive } from 'vue';
import { Options, Vue } from 'vue-class-component';

@Options({
  components: {},
})
export default class GameView extends Vue {
  width = 550;

  height = 800;

  scrollCanvas: HTMLCanvasElement = reactive({} as HTMLCanvasElement);
  fixedCanvas: HTMLCanvasElement = reactive({} as HTMLCanvasElement);
  displayCanvas: HTMLCanvasElement = reactive({} as HTMLCanvasElement);

  game: Game | null = null;

  mounted() {
    const scrollCtx = this.scrollCanvas.getContext('2d');
    const fixedCtx = this.fixedCanvas.getContext('2d');
    const displayCtx = this.displayCanvas.getContext('2d');

    if (scrollCtx && fixedCtx && displayCtx) {
      this.game = new Game(
        this.scrollCanvas,
        this.fixedCanvas,
        this.displayCanvas,
        scrollCtx,
        fixedCtx,
        displayCtx,
        this.width,
        this.height
      );
      this.game.start();
    }
  }
}
