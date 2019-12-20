import $ from "jquery";
import shuffle from "lodash.shuffle";
import { Timer } from "./timer";

import "./cadena.scss";

export class Cadenas {
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

  events() {
    $(document).on("click", ".c-cadena__btn", e => {
      const index = $(e.currentTarget).index();

      if (
        this.indexNextValueToFind !== "" &&
        this.indexNextValueToFind !== index
      ) {
        this.false();
      } else {
        this.valid(e, index);
      }

      if (this.correctAnswer === this.code.length) {
        this.win();
      }
    });
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

  valid(e, index) {
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
    this.btns = this.code.map((_, i) => new Btn(btnElement));
  }
}

class Btn {
  ACTIVE_CLASS = "c-cadena__btn--active";

  constructor(wrapper) {
    this.element = document.createElement("button");
    this.element.classList.add("c-cadena__btn");
    wrapper.append(this.element);
  }

  setActive() {
    this.element.classList.add(this.ACTIVE_CLASS);
    this.element.disabled = true;
  }

  unsetActive() {
    this.element.classList.remove(this.ACTIVE_CLASS);
    this.element.disabled = false;
  }

  destroy() {
    this.element.remove();
  }
}

class Result {
  ACTIVE_CLASS = "c-cadena__result--active";

  constructor(wrapper) {
    this.element = document.createElement("div");
    this.element.classList.add("c-cadena__result");
    wrapper.append(this.element);
  }

  setActive() {
    this.element.classList.add(this.ACTIVE_CLASS);
  }

  unsetActive() {
    this.element.classList.remove(this.ACTIVE_CLASS);
  }

  destroy() {
    this.element.remove();
  }
}
