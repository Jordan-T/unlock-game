import shuffle from "lodash.shuffle";
import { Timer } from "../timer";
import { Btn } from "./btn";
import { Result } from "./result";

export class Game {
  btns = [];
  results = [];

  constructor(element) {
    this.element = element;
    this.indexNextValueToFind = "";
    this.correctAnswer = 0;
    this.setCode();
    this.createDom();
    this.events();
    //@TODO sam : add sound ambiance

    this.timer = new Timer({
      element: document.getElementById("minutes"),
      endDate: new Date().getTime() + 10000,
      onEnd: () => this.end()
    });
  }

  events() {}

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
    for (let i = 0; i < 8; i += 1) a.push(i);
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
    if (Array.isArray(this.results)) {
      this.results.forEach(result => result.destroy());
    }
    const resultElement = document.getElementById("result");
    this.results = this.code.map(() => new Result(resultElement));

    if (Array.isArray(this.btns)) {
      this.btns.forEach(btn => btn.destroy());
    }
    const btnElement = document.getElementById("cadenas-btn");
    this.btns = this.code.map(
      (_, i) =>
        new Btn(btnElement, i, () => {
          this.onClick(i);
        })
    );
  }
}
