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
    const size = 25;
    this.element.style.left = `${event.clientX + size}px`;
    this.element.style.top = `${event.clientY + size}px`;
  }

  onPointerOver = event => {
    const dataTooltip = event.target.closest('[data-tooltip]');
    if (dataTooltip) {
      this.render(dataTooltip.dataset.tooltip);
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
    document.removeEventListener('pointermove', this.onPointerMove);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.removeEventListeners();
  }
}

export default Tooltip;
