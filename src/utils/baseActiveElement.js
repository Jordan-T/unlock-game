export class BaseActiveElement {
  static TAG_NAME = "div";
  static BASE_CLASS = "c-cadena__result";
  static ACTIVE_CLASS = "c-cadena__result--active";

  constructor(wrapper) {
    this.element = document.createElement(this.constructor.TAG_NAME);
    this.element.classList.add(this.constructor.BASE_CLASS);
    wrapper.append(this.element);
  }

  setActive() {
    this.element.classList.add(this.constructor.ACTIVE_CLASS);
  }

  unsetActive() {
    this.element.classList.remove(this.constructor.ACTIVE_CLASS);
  }

  destroy() {
    this.element.remove();
  }
}
