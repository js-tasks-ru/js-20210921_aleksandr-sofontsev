import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {

  subElements = {};
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    link = '',
    value = 0,
    formatHeading = data => data,
    url = '',
    range = {from: new Date(), to: new Date()}
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading;
    this.url = new URL(url, BACKEND_URL);
    this.range = range;

    this.render();
  }

  getColumns () {
    const maxValue = Math.max(...this.data);
    const scale = this.chartHeight / maxValue;

    return this.data.map(item => {
      const percent = (item / maxValue * 100).toFixed(0);

      return `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}%"></div>`;
    }).join('');
  }

  getTemplate () {
    return `
        <div class="column-chart" style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__title">
                Total ${this.label}
                ${this.link ? `<a href="/${this.link}" class="column-chart__link">View all</a>` : ''}
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${this.value}</div>
                <div data-element="body" class="column-chart__chart">
                    ${this.getColumns()}
                </div>
            </div>
        </div>
    `;
  }

  async render () {
    const element = document.createElement('div');
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
    await this.update(this.range.from, this.range.to);
  }

  getSubElements(elem) {
    const res = {};
    const elements = elem.querySelectorAll('[data-element]');

    for (const subElem of elements) {
      const name = subElem.dataset.element;
      res[name] = subElem;
    }

    return res;
  }

  async load(from, to) {
    this.url.searchParams.set('from', from.toISOString());
    this.url.searchParams.set('to', to.toISOString());
    return await fetchJson(this.url);
  }

  async update(from, to) {
    this.element.classList.add('column-chart_loading');
    const data = await this.load(from, to);
    this.data = Object.values(data);
    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
      this.subElements.body.innerHTML = this.getColumns();
      this.subElements.header.textContent = this.formatHeading(this.data.reduce((sum, curr) => sum + curr));
    }

    return data;
  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.subElements = {};
  }
}
