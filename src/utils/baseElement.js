export class BaseElement {
  static TAG_NAME = "div";
  static BASE_CLASS = "c-cadena__result";

  constructor(wrapper) {
    this.element = document.createElement(this.constructor.TAG_NAME);
    this.element.classList.add(this.constructor.BASE_CLASS);
    wrapper.append(this.element);
  }

  destroy() {
    this.element.remove();
  }
}
