export default class SortableList {

  draggingElem;
  x = 0;
  y = 0;
  placeHolder;
  isDraggingStarted = false;

  onPointerDown = event => {
    const element = event.target.closest('.sortable-list__item');
    if (element) {
      if (event.target.closest('[data-delete-handle]')) {
        //event.target.parentElement.remove(); // работает только в текущем задании
        element.remove(); // работает в продукт форме [почему?]
      }

      // [почему?] закомментированный код работает только в текущем задании и не работает в продукт форме
      //this.draggingElem = event.target.closest('[data-grab-handle]');
      //if (this.draggingElem) {
      //  this.draggingElem = this.draggingElem.parentElement;
      if (event.target.closest('[data-grab-handle]')) {
        this.draggingElem = element;

        //this.draggingElem.style.height = `${this.draggingElem.offsetHeight}px`;
        //this.draggingElem.style.width = `${this.draggingElem.parentElement.offsetWidth}px`;
        element.style.height = `${element.offsetHeight}px`;
        element.style.width = `${element.offsetWidth}px`;

        //this.draggingElem.classList.add('sortable-list__item_dragging');
        element.classList.add('sortable-list__item_dragging');

        const rect = this.draggingElem.getBoundingClientRect();
        this.x = event.pageX - rect.left;
        this.y = event.pageY - rect.top;

        this.addEventListeners();
      }
    }
  };

  onPointerMove = event => {
    if (!this.isDraggingStarted) {
      const draggingRect = this.draggingElem.getBoundingClientRect();
      this.isDraggingStarted = true;

      this.placeHolder = document.createElement('li');
      this.placeHolder.classList.add('sortable-list__placeholder');
      this.draggingElem.parentNode.insertBefore(this.placeHolder, this.draggingElem.nextSibling);
      this.placeHolder.style.height = `${draggingRect.height}px`;
    }

    const prevElem = this.draggingElem.previousElementSibling;
    const nextElem = this.placeHolder.nextElementSibling;

    // движение вверх
    if (prevElem && this.isAbove(this.draggingElem, prevElem)) {
      this.swap(this.placeHolder, this.draggingElem);
      this.swap(this.placeHolder, prevElem);
    }

    // движение вниз
    if (nextElem && this.isAbove(nextElem, this.draggingElem)) {
      this.swap(nextElem, this.placeHolder);
      this.swap(nextElem, this.draggingElem);
    }

    this.draggingElem.style.top = `${event.clientY - this.y}px`;
    this.draggingElem.style.left = `${event.clientX - this.x}px`;

    // без строчки ниже, если произошло не только нажатие мыши, но и выделение части текста,
    // то элемент странно двигается и остаётся "в воздухе" после pointerup [почему?]
    event.preventDefault();
  };

  onPointerUp = () => {
    if (this.draggingElem) {
      this.draggingElem.style.removeProperty('top');
      this.draggingElem.style.removeProperty('left');
      this.draggingElem.classList.remove('sortable-list__item_dragging');

      this.x = null;
      this.y = null;
      this.isDraggingStarted = false;

      this.placeHolder.replaceWith(this.draggingElem);
      this.draggingElem = null;
    }

    this.removeEventListeners();
  };

  constructor({items = []} = {}) {
    this.items = items;

    this.render();
  }

  render() {
    const element = document.createElement('ul');
    element.classList.add('sortable-list');
    this.items.forEach(item => {
      item.classList.add('sortable-list__item');
      element.append(item);
    });

    this.element = element;
    document.addEventListener('pointerdown', this.onPointerDown);
  }

  isAbove = (nodeA, nodeB) => {
    const rectA = nodeA.getBoundingClientRect();
    const rectB = nodeB.getBoundingClientRect();
    return rectA.top + rectA.height / 2 < rectB.top + rectB.height / 2;
  };

  swap = (nodeA, nodeB) => {
    const parentA = nodeA.parentNode;
    const siblingA = nodeA.nextSibling === nodeB ? nodeA : nodeA.nextSibling;
    nodeB.parentNode.insertBefore(nodeA, nodeB);
    parentA.insertBefore(nodeB, siblingA);
  };

  addEventListeners() {
    document.addEventListener('pointermove', this.onPointerMove);
    document.addEventListener('mouseup', this.onPointerUp);
  }

  removeEventListeners() {
    document.removeEventListener('pointermove', this.onPointerMove);
    document.removeEventListener('pointerup', this.onPointerUp);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.removeEventListeners();
    this.element = null;
  }
}
