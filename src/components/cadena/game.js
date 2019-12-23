import shuffle from "lodash.shuffle";
import { Timer } from "./timer";
import { Btn } from "./btn";
import { Result } from "./result";

export class Game {
  btns = [];
  results = [];
  timer = null;

  constructor(element) {
    this.element = element;
    this.codeLength = 8;
    this.indexNextValueToFind = "";
    this.correctAnswer = 0;
    this.setCode();
    this.createDom();
    //@TODO sam : add sound ambiance
  }

  win() {
    this.timer.stop();
    alert("win");

    //@TODO sam : animation
  }

  end() {
    this.timer.stop();
    console.log("loose");
  }

  setCode() {
    const a = [];
    for (let i = 0; i < this.codeLength; i += 1) a.push(i);
    this.code = shuffle(a);
    console.log("code : ", this.code);
  }

  false() {
    this.btns.forEach(btn => btn.unsetActive());
    this.results.forEach(result => result.unsetActive());
    this.indexNextValueToFind = "";
    this.correctAnswer = 0;

    //@TODO sam : add sound effect turn off the light
  }

  onClick(index) {
    if (
      this.indexNextValueToFind !== "" &&
      this.indexNextValueToFind !== index
    ) {
      this.false();
    } else {
      this.valid(index);
    }

    if (this.correctAnswer === this.code.length) {
      this.win();
    }
  }

  valid(index) {
    this.btns[index].setActive();
    this.results[this.code[index]].setActive();

    let nextValueToFind = this.code[index] + 1;
    if (nextValueToFind === this.code.length) {
      nextValueToFind = 0;
    }

    this.indexNextValueToFind = this.code.indexOf(nextValueToFind);

    if (this.indexNextValueToFind === -1) {
      this.indexNextValueToFind = 0;
    }
    this.correctAnswer += 1;

    //@ TODO sam : add sound effect turn on the light
  }

  createDom() {
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
      duration: 120,
      onEnd: () => this.end()
    });

    if (Array.isArray(this.results)) {
      this.results.forEach(result => result.destroy());
    }
    const resultElement = this.element.querySelector(".c-cadena__results");
    this.results = this.code.map(() => new Result(resultElement));

    if (Array.isArray(this.btns)) {
      this.btns.forEach(btn => btn.destroy());
    }
    const btnElement = this.element.querySelector(".c-cadena__btns");
    this.btns = this.code.map(
      (_, i) =>
        new Btn(btnElement, i, active => {
          if (active === true) {
            return;
          }
          this.onClick(i);
        })
    );
  }
}
