export class Toggle {
  active = false;
  CLASS = "c-cadena__action";
  ACTIVE_CLASS = "c-cadena__action--active";

  constructor(wrapper, { onActive, onUnactive, html, className }) {
    this.element = document.createElement("button");
    this.element.className = className;
    this.element.innerHTML = html;
    this.element.classList.add(this.CLASS);

    this.onActive = onActive;
    this.onUnactive = onUnactive;

    this.element.addEventListener("click", this.onClick, true);

    wrapper.append(this.element);
  }

  onClick = e => {
    e.preventDefault();
    const needActive = this.active === false;
    if (needActive === true) {
      this.onActive();
    } else {
      this.onUnactive();
    }
    this.element.classList.toggle(this.ACTIVE_CLASS);
    this.active = needActive;
  };

  destroy() {
    this.element.removeEventListener("click", this.onClick, true);
    this.element.remove();
  }
}
