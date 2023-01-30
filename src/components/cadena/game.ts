import shuffle from "lodash.shuffle";
import { Timer } from "./timer";
import { Btn } from "./btn";
import { Result } from "./result";
import { Sound } from "../sound";
import beepSound from "../../sounds/beep.mp3";
import errorSound from "../../sounds/error.mp3";
import winSound from "../../sounds/victory.mp3";

export class Game {
  private btns: Btn[] = [];
  private results: Result[] = [];
  private timer!: Timer;
  #code: string[] = [];

  private readonly WIN_CLASS = "c-cadena__game--win";
  private readonly WIN_DELAY = 4000; // 4s before score in
  private readonly LOOSE_CLASS = "c-cadena__game--loose";
  private readonly LOOSE_DELAY = 1200; // 1.2s before score in

  private element: HTMLElement;
  private onEnd: (data: { win: boolean }) => void;
  private globalSettings: { muted?: boolean };
  private codeValues: string[];
  private nextValueToFind: string;
  private correctAnswer: number;

  constructor(
    element: HTMLElement,
    {
      difficulty = "medium",
      onEnd
    }: { difficulty?: string; onEnd: (data: { win: boolean }) => void },
    globalSettings = {}
  ) {
    this.element = element;
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
    this.element.classList.add(this.WIN_CLASS);
    if (this.globalSettings.muted !== true) {
      new Sound(winSound);
    }
    setTimeout(() => {
      this.onEnd({ win: true });
    }, this.WIN_DELAY);
  }

  end() {
    this.timer.stop();
    this.element.classList.add(this.LOOSE_CLASS);
    if (this.globalSettings.muted !== true) {
      new Sound(errorSound, { repeat: 3 });
    }
    setTimeout(() => {
      this.onEnd({ win: false });
    }, this.LOOSE_DELAY);
  }

  setCode() {
    this.#code = shuffle(this.codeValues);
  }

  false() {
    this.btns.forEach((btn) => btn.unsetActive());
    this.results.forEach((result) => result.unsetActive());
    this.nextValueToFind = "";
    this.correctAnswer = 0;

    if (this.globalSettings.muted !== true) {
      new Sound(errorSound);
    }
  }

  onClick(index: number) {
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

  valid(index: number) {
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

  createDom({ duration }: { duration: number }) {
    this.element.innerHTML = `
      <div class="c-cadena__top">
        <div class="c-cadena__timer"></div>
        <div class="c-cadena__results"></div>
      </div>
      <div class="c-cadena__bottom">
        <div class="c-cadena__btns"></div>
      </div>
    `;

    if (this.timer != null) {
      this.timer.destroy();
    }
    this.timer = new Timer(this.element.querySelector(".c-cadena__timer")!, {
      duration,
      onEnd: () => this.end()
    });
    this.results.forEach((result) => result.destroy());
    const resultElement =
      this.element.querySelector<HTMLElement>(".c-cadena__results")!;
    this.results = this.#code.map(() => new Result(resultElement));

    if (Array.isArray(this.btns)) {
      this.btns.forEach((btn) => btn.destroy());
    }
    const btnElement =
      this.element.querySelector<HTMLElement>(".c-cadena__btns")!;
    this.btns = this.codeValues.map(
      (value, index) =>
        new Btn(btnElement, value, (active) => {
          if (active === true) {
            return;
          }
          this.onClick(index);
        })
    );
  }

  destroy() {
    this.timer.destroy();
    this.results.forEach((result) => result.destroy());
    this.btns.forEach((btn) => btn.destroy());

    this.element.classList.remove(this.WIN_CLASS);
    this.element.classList.remove(this.LOOSE_CLASS);

    this.element.innerHTML = "";
  }
}
