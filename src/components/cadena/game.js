import shuffle from "lodash.shuffle";
import { Timer } from "./timer";
import { Btn } from "./btn";
import { Result } from "./result";
import { Sound } from "../sound";
import beepSound from "../../sounds/beep.mp3";
import errorSound from "../../sounds/error.mp3";

export class Game {
  btns = [];
  results = [];
  timer = null;
  #code = [];

  constructor(element, { difficulty = "medium", onEnd } = {}, globalSettings = {}) {
    this.element = element;
    this.difficulty = difficulty;
    this.onEnd = onEnd;
    this.globalSettings = globalSettings;

    let duration = 120;
    if (difficulty === "very-easy") {
      duration = 300;
      this.codeValues = [..."1234"];
    } else if (difficulty === "easy") {
      duration = 180;
      this.codeValues = [..."123456"];
    } else if (difficulty === "hard") {
      duration = 60;
      this.codeValues = [..."ABCDEFGHIJ"];
    } else if (difficulty === "very-hard") {
      duration = 40;
      this.codeValues = [..."ABCDEFGHIJKL"];
    } else {
      this.codeValues = [..."12345678"];
    }
    this.nextValueToFind = "";
    this.correctAnswer = 0;
    this.setCode();
    this.createDom({ duration });
  }

  win() {
    this.timer.stop();
    this.onEnd({ win: true });
  }

  end() {
    this.timer.stop();
    this.onEnd({ win: false });
  }

  setCode() {
    this.#code = shuffle(this.codeValues);
  }

  false() {
    this.btns.forEach(btn => btn.unsetActive());
    this.results.forEach(result => result.unsetActive());
    this.nextValueToFind = "";
    this.correctAnswer = 0;

    if (this.globalSettings.muted !== true) {
      new Sound(errorSound);
    }
  }

  onClick(index) {
    if (
      this.nextValueToFind !== "" &&
      this.nextValueToFind !== this.codeValues[index]
    ) {
      this.false();
      return;
    }

    this.valid(index);

    if (this.correctAnswer === this.#code.length) {
      this.win();
    }
  }

  valid(index) {
    const resultIndex = this.#code.indexOf(this.codeValues[index]);
    this.btns[index].setActive();
    this.results[resultIndex].setActive();

    let nextIndex = resultIndex + 1;
    if (nextIndex === this.#code.length) {
      nextIndex = 0;
    }

    this.nextValueToFind = this.#code[nextIndex];
    this.correctAnswer += 1;

    if (this.globalSettings.muted !== true) {
      new Sound(beepSound);
    }
  }

  createDom({ duration }) {
    this.element.innerHTML = `
      <div class="c-cadena__top">
        <div class="c-cadena__timer"></div>
        <div class="c-cadena__results"></div>
      </div>
      <div class="c-cadena__bottom">
        <div class="c-cadena__btns"></div>
      </div>
    `;

    if (this.timer !== null) {
      this.timer.destroy();
    }
    this.timer = new Timer(this.element.querySelector(".c-cadena__timer"), {
      duration,
      onEnd: () => this.end()
    });

    if (Array.isArray(this.results)) {
      this.results.forEach(result => result.destroy());
    }
    const resultElement = this.element.querySelector(".c-cadena__results");
    this.results = this.#code.map(() => new Result(resultElement));

    if (Array.isArray(this.btns)) {
      this.btns.forEach(btn => btn.destroy());
    }
    const btnElement = this.element.querySelector(".c-cadena__btns");
    this.btns = this.codeValues.map(
      (value, index) =>
        new Btn(btnElement, value, active => {
          if (active === true) {
            return;
          }
          this.onClick(index);
        })
    );
  }

  destroy() {
    this.timer.destroy();
    this.results.forEach(result => result.destroy());
    this.btns.forEach(btn => btn.destroy());

    this.element.innerHTML = "";
  }
}
