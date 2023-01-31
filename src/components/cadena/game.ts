import shuffle from "lodash.shuffle";
import { Timer } from "./timer";
import { Btn } from "./btn";
import { Result } from "./result";
import { Sound } from "../sound";
import beepSound from "../../sounds/beep.mp3";
import errorSound from "../../sounds/error.mp3";
import winSound from "../../sounds/victory.mp3";
import { difficulties, Difficulty } from "./config";
import BackBtn from "./actions/backBtn";

type OnEnd = (data: { win: boolean | null }) => void;

export class Game {
  private btns: Btn[] = [];
  private results: Result[] = [];
  private timer!: Timer;
  private backBtn!: BackBtn;
  #code: string[] = [];

  private readonly WIN_CLASS = "c-cadena__game--win";
  private readonly WIN_DELAY = 4000; // 4s before score in
  private readonly LOOSE_CLASS = "c-cadena__game--loose";
  private readonly LOOSE_DELAY = 1200; // 1.2s before score in

  private element: HTMLElement;
  private onEnd: OnEnd;
  private globalSettings: { muted?: boolean };
  private codeValues: string[];
  private nextValueToFind: string;
  private correctAnswer: number;

  constructor(
    element: HTMLElement,
    { difficulty = "medium", onEnd }: { difficulty?: Difficulty; onEnd: OnEnd },
    globalSettings = {}
  ) {
    this.element = element;
    this.onEnd = onEnd;
    this.globalSettings = globalSettings;

    const difficultySettings = difficulties[difficulty];
    this.codeValues = [...difficultySettings.codeValues];
    this.nextValueToFind = "";
    this.correctAnswer = 0;
    this.setCode();
    this.createDom({ duration: difficultySettings.duration });
    this.element.querySelector("button")?.focus();
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

  stop() {
    this.timer.stop();
    this.onEnd({ win: null });
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
      <div class="c-cadena__back"></div>
    `;

    if (this.timer != null) {
      this.timer.destroy();
    }
    this.timer = new Timer(this.element.querySelector(".c-cadena__timer")!, {
      duration,
      onEnd: () => this.end()
    });

    const backElement =
      this.element.querySelector<HTMLElement>(".c-cadena__back")!;
    this.backBtn = new BackBtn(backElement, () => {
      if (confirm("Leave current game?")) {
        this.stop();
      }
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
    this.timer?.destroy();
    this.backBtn?.destroy();
    this.results.forEach((result) => result.destroy());
    this.btns.forEach((btn) => btn.destroy());

    this.element.classList.remove(this.WIN_CLASS);
    this.element.classList.remove(this.LOOSE_CLASS);

    this.element.innerHTML = "";
  }
}
