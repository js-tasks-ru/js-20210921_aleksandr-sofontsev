export default class SortableTable {

  onSort = (event) => {
    const column = event.target.closest('[data-sortable = "true"]');
    if (column) {
      column.dataset.order = column.dataset.order === 'asc' ? 'desc' : 'asc';
      const dataSort = this.sort(column.dataset.id, column.dataset.order);

      if (!column.querySelector('.sortable-table__sort-arrow')) {
        column.append(this.subElements.arrow);
      }
      this.subElements.body.innerHTML = this.getColumns(dataSort);
    }
  }

  constructor(headersConfig, {data = [], sorted = {}} = {}) {
    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;

    this.render();
  }

  getTemplate(data) {
    return `
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.header}
            </div>
            <div data-element="body" class="sortable-table__body">
                ${this.getColumns(data)}
            </div>

            <div data-element="loading" class="loading-line sortable-table__loading-line"></div>
            <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
                <div>
                    <p>No products satisfies your filter criteria</p>
                    <button type="button" class="button-primary-outline">Reset all filters</button>
                </div>
            </div>
        </div>`;
  }

  get header() {
    return this.headerConfig.map(item => {
      const ord = this.sorted.id === item.id ? this.sorted.order : 'asc';
      return `
        <div className = "sortable-table__cell" data-id = ${item.id} data-sortable = "${item.sortable}" data-order ="${ord}">
            <span>${item.title}</span>
            ${item.sortable ? '<span data-element="arrow" class="sortable-table__sort-arrow">' +
        '   <span class="sort-arrow"></span> ' +
        '</span>' : ''}
        </div>`;
    }).join('');
  }

  getColumns(data) {
    return data.map(item => {
      return `
        <a href="/products/${item.id}" class="sortable-table__row">
            ${this.getColVal(item)}
        </a>`;
    }).join('');
  }

  getColVal(item) {
    return this.headerConfig.map(hItem => {
      return hItem.template
        ? hItem.template(item[hItem.id])
        : `<div class="sortable-table__cell">${item[hItem.id]}</div>`;
    }).join('');
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate(this.sort(this.sorted.id, this.sorted.order));
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    this.addEventListeners();
  }

  sort (fieldValue, orderValue) {
    const ord = {"asc": 1, "desc": -1};
    const sortColumn = this.headerConfig.find(elem => elem.id === fieldValue);
    const data = [...this.data];

    return data.sort((a, b) => {
      if (sortColumn.sortType === 'number') {
        return ord[orderValue] * (a[fieldValue] - b[fieldValue]);
      }

      if (sortColumn.sortType === 'string') {
        return ord[orderValue] * (a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en'], {caseFirst: 'upper'}));
      }
    });
  }

  getSubElements (elem) {
    const res = {};
    const elements = elem.querySelectorAll('[data-element]');

    for (const subElem of elements) {
      const name = subElem.dataset.element;
      res[name] = subElem;
    }

    return res;
  }

  addEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSort);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    this.subElements.header.removeEventListener('pointerdown', this.onSort);
  }
}
