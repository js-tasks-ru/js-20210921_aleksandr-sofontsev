export default class SortableTable {

  constructor(headerConfig = [], {data = []} = {}) {
    this.headerConfig = headerConfig;
    this.data = data;

    this.render();
  }

  get template() {
    return `
        <div class="sortable-table">
            <div data-element="header" class="sortable-table__header sortable-table__row">
                ${this.header}
            </div>
            <div data-element="body" class="sortable-table__body">
                ${this.columns}
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
      return `
        <div className="sortable-table__cell" data-id = ${item.id} data-sortable = "${item.sortable}" data-order ="">
            <span>${item.title}</span>
            ${item.sortable ? '<span data-element="arrow" class="sortable-table__sort-arrow">' +
                              '   <span class="sort-arrow"></span> ' +
                              '</span>' : ''}
        </div>`;
    }).join('');
  }

  get columns() {
    return this.data.map(item => {
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
    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  sort (fieldValue, orderValue) {
    const ord = {"asc": 1, "desc": -1};
    const sortColumn = this.headerConfig.find(elem => elem.id === fieldValue);

    if (sortColumn.sortable) {
      this.data.sort((a, b) => {
        if (sortColumn.sortType === 'number') {
          return ord[orderValue] * (a[fieldValue] - b[fieldValue]);
        }

        if (sortColumn.sortType === 'string') {
          return ord[orderValue] * (a[fieldValue].localeCompare(b[fieldValue], ['ru', 'en'], {caseFirst: 'upper'}));
        }
      });
    }

    const subElements = this.getSubElements(this.element);
    subElements.body.innerHTML = this.columns;
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

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}
