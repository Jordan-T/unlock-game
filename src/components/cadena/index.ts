import { Intro } from "./intro";
import { Game } from "./game";
import { End } from "./end";
import { Toggle } from "./actions/toggle";
import { Sound } from "../sound";
import ambianceSound from "../../sounds/ambiance.mp3";
import "./index.scss";

export class Cadena {
  private element: HTMLElement;
  private gameElement: HTMLElement;
  private actionsElement: HTMLElement;
  private muteAction: Toggle;
  private game?: Game;
  private end?: End;
  private intro?: Intro;
  private ambiance: Sound;

  private settings = {
    muted: false
  };

  constructor(element: HTMLElement) {
    this.element = element;
    this.element.classList.add("c-cadena");
    this.gameElement = document.createElement("div");
    this.gameElement.classList.add("c-cadena__game");
    this.element.append(this.gameElement);
    this.actionsElement = document.createElement("div");
    this.actionsElement.classList.add("c-cadena__actions");
    this.element.append(this.actionsElement);
    this.muteAction = new Toggle(this.actionsElement, {
      onActive: this.mute,
      onUnactive: this.unmute,
      html: `mute`,
      className: "c-cadena__action--mute"
    });

    this.createIntro();

    this.ambiance = new Sound(ambianceSound, { volume: 0.5, repeat: true });
  }

  mute = () => {
    this.settings.muted = true;
    this.ambiance.pause();
  };
  unmute = () => {
    this.settings.muted = false;
    this.ambiance.play();
  };

  createIntro = () => {
    if (this.end !== undefined) {
      this.end.destroy();
      this.end = undefined;
    }
    this.intro = new Intro(this.gameElement, this.createGame);
  };

  createGame = ({ difficulty }: { difficulty: string }) => {
    this.intro?.destroy();
    this.game = new Game(
      this.gameElement,
      { difficulty, onEnd: this.showEnd },
      this.settings
    );
  };

  showEnd = ({ win }: { win: boolean }) => {
    this.game?.destroy();
    this.end = new End(this.gameElement, { win, onRetry: this.createIntro });
  };

  destroy() {
    if (this.intro !== undefined) {
      this.intro.destroy();
      this.intro = undefined;
    }
    if (this.game !== undefined) {
      this.game.destroy();
      this.game = undefined;
    }
    if (this.end !== undefined) {
      this.end.destroy();
      this.end = undefined;
    }
    this.muteAction.destroy();
    this.element.classList.remove("c-cadena");
  }
}
