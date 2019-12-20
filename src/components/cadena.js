import $ from "jquery";
import shuffle from "lodash.shuffle";
import { Timer } from "./timer";

import "./cadena.scss";

export class Cadenas {
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
      let index = $(e.currentTarget).data("index");

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
    $(".c-cadena__btn")
      .removeAttr("disabled")
      .removeClass("c-cadena__btn--active");
    $(".c-cadena__result").removeClass("c-cadena__result--active");
    this.indexNextValueToFind = "";
    this.correctAnswer = 0;

    //@TODO sam : add sound effect turn off the light
  }

  valid(e, index) {
    $(e.currentTarget)
      .attr("disabled", "disabled")
      .addClass("c-cadena__btn--active");

    $(".c-cadena__result")
      .eq(this.code[index])
      .addClass("c-cadena__result--active");

    let nextValueToFind = this.code[index] + 1;
    if (nextValueToFind === this.code.length) {
      nextValueToFind = 0;
    }

    this.indexNextValueToFind = this.code.indexOf(nextValueToFind);

    if (this.indexNextValueToFind === -1) {
      this.indexNextValueToFind = 0;
    }
    this.correctAnswer++;

    //@ TODO sam : add sound effect turn on the light
  }

  createDom() {
    this.code.forEach((value, index) => {
      $("#result").append(
        '<div class="c-cadena__result result-' + index + '"></div>'
      );
      $("#cadenas-btn").append(
        '<button class="btn c-cadena__btn" data-index="' + index + '"></button>'
      );
    });
  }
}
