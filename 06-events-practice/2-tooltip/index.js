class Tooltip {

  static existsClass;
  element;

  constructor() {
    if (Tooltip.existsClass) {
      return Tooltip.existsClass;
    }
    else {
      Tooltip.existsClass = this;
    }
  }

  onPointerMove = event => {
    this.element.style.left = `${event.clientX + 25}px`;
    this.element.style.top = `${event.clientY + 25}px`;
  }

  onPointerOver = event => {
    if (event.target.closest('[data-tooltip]')) {
      this.render(event.target.closest('[data-tooltip]').dataset.tooltip);
      document.addEventListener('pointermove', this.onPointerMove);
    }
  }

  onPointerOut = () => {
    document.removeEventListener('pointermove', this.onPointerMove);
    this.remove();
  }

  render(val) {
    this.element = document.createElement('div');
    this.element.classList.add('tooltip');
    this.element.innerHTML = val;

    document.body.append(this.element);
  }

  initialize() {
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener('pointerover', this.onPointerOver);
    document.addEventListener('pointerout', this.onPointerOut);
  }

  removeEventListeners() {
    document.removeEventListener('pointerover', this.onPointerOver);
    document.removeEventListener('pointerout', this.onPointerOut);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.removeEventListeners();
  }
}

export default Tooltip;
