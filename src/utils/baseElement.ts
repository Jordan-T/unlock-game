export class BaseElement<T extends HTMLElement = HTMLElement> {
  protected element: T;
  static TAG_NAME: string = "div";
  static BASE_CLASS: string = "c-cadena__result";

  constructor(wrapper: HTMLElement) {
    const constructor = this.constructor as unknown as typeof BaseElement;
    this.element = document.createElement(constructor.TAG_NAME) as T;
    this.element.classList.add(constructor.BASE_CLASS);
    wrapper.append(this.element);
  }

  destroy() {
    this.element.remove();
  }
}
