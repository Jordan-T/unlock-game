import { BaseElement } from "./baseElement";

export class BaseActiveElement extends BaseElement {
  static ACTIVE_CLASS = "c-cadena__result--active";

  setActive() {
    this.active = true;
    this.element.classList.add(this.constructor.ACTIVE_CLASS);
  }

  unsetActive() {
    this.active = false;
    this.element.classList.remove(this.constructor.ACTIVE_CLASS);
  }
}
