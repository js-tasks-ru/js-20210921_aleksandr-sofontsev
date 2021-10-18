import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class SortableTable {

  subElements = {};
  start = 0;
  stepRows = 30;
  end = this.start + this.stepRows;
  loading = false;

  onSort = async (event) => {
    const column = event.target.closest('[data-sortable = "true"]');
    if (column) {
      column.dataset.order = column.dataset.order === 'asc' ? 'desc' : 'asc';
      this.sorted.id = column.dataset.id;
      this.sorted.order = column.dataset.order;

      if (this.isSortLocally) {
        this.addClickData(this.sortOnClient(column.dataset.id, column.dataset.order));
      }
      else {
        this.addClickData(await this.sortOnServer(column.dataset.id, column.dataset.order));
      }

      if (!column.querySelector('.sortable-table__sort-arrow')) {
        column.append(this.subElements.arrow);
      }
    }
  }

  onScroll = async () => {
    const { bottom } = this.element.getBoundingClientRect();
    if ((bottom < document.documentElement.clientHeight) && (!this.isSortLocally) && (!this.loading)) {
      this.start = this.end;
      this.end = this.start + this.stepRows;

      this.loading = true;
      const data = await this.loadData(this.sorted.id, this.sorted.order, this.start, this.end);
      this.addScrollData(data);
      this.loading = false;
    }
  }

  constructor(headersConfig, {
    data = [],
    sorted = {},
    url = '',
    isSortLocally = false,
  } = {}) {
    this.headerConfig = headersConfig;
    this.data = data;
    this.sorted = sorted;
    this.url = new URL(url, BACKEND_URL);
    this.isSortLocally = isSortLocally;

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

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate(this.sortData(this.sorted.id, this.sorted.order));
    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    this.loading = true;
    const data = await this.loadData(this.sorted.id, this.sorted.order, this.start, this.end);
    this.addClickData(data);
    this.loading = false;

    this.addEventListeners();
  }

  async loadData(field, order, start, end) {
    this.url.searchParams.set('_sort', field);
    this.url.searchParams.set('_order', order);
    this.url.searchParams.set('_start', start);
    this.url.searchParams.set('_end', end);

    this.element.classList.add('sortable-table_loading');
    const data = await fetchJson(this.url);
    this.element.classList.remove('sortable-table_loading');

    return data;
  }

  sortData(field, order) {
    const ord = {"asc": 1, "desc": -1};
    const sortColumn = this.headerConfig.find(elem => elem.id === field);
    const data = [...this.data];

    return data.sort((a, b) => {
      if (sortColumn.sortType === 'number') {
        return ord[order] * (a[field] - b[field]);
      }

      if (sortColumn.sortType === 'string') {
        return ord[order] * (a[field].localeCompare(b[field], ['ru', 'en'], {caseFirst: 'upper'}));
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

  addScrollData(newData) {
    this.data = [...this.data, ...newData];

    const element = document.createElement('div');
    element.innerHTML = this.getColumns(newData);
    this.subElements.body.append(...element.childNodes);
  }

  addClickData(data) {
    if (data.length) {
      this.data = data;
      this.subElements.body.innerHTML = this.getColumns(this.data);
      this.element.classList.remove('sortable-table_empty');
    }
    else {
      this.element.classList.add('sortable-table_empty');
    }
  }

  sortOnClient(id, order) {
    this.subElements.body.innerHTML = this.getColumns(this.sortData(id, order));
  }

  async sortOnServer(id, order) {
    return await this.loadData(id, order, 1, this.end);
  }

  addEventListeners() {
    this.subElements.header.addEventListener('pointerdown', this.onSort);
    document.addEventListener('scroll', this.onScroll);
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    document.removeEventListener('scroll', this.onScroll);
    this.subElements = {};
  }
}
