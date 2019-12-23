import { Intro } from "./intro";
import { Game } from "./game";
import { End } from "./end";
import "./index.scss";

export class Cadena {
  constructor(element) {
    this.element = element;
    this.element.classList.add("c-cadena");
    this.createIntro();
  }

  createIntro = () => {
    if (this.end !== undefined) {
      this.end.destroy();
    }
    this.intro = new Intro(this.element, this.createGame);
  };

  createGame = ({ difficulty }) => {
    this.intro.destroy();
    this.game = new Game(this.element, { difficulty, onEnd: this.showEnd });
  };

  showEnd = ({ win }) => {
    this.game.destroy();
    this.end = new End(this.element, { win, onRetry: this.createIntro });
  };

  destroy() {
    if (this.intro !== undefined) {
      this.intro.destroy();
    }
    if (this.game !== undefined) {
      this.game.destroy();
    }
    if (this.end !== undefined) {
      this.end.destroy();
    }
    this.element.classList.remove("c-cadena");
  }
}
