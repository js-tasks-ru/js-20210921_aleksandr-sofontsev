import RangePicker from './components/range-picker/src/index.js';
import SortableTable from './components/sortable-table/src/index.js';
import ColumnChart from './components/column-chart/src/index.js';
import header from './bestsellers-header.js';

import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru/';

export default class Page {

  element;
  subElements = {};
  components = {};

  get init() {
    const dateTo = new Date();
    const dateFrom = new Date();
    dateFrom.setMonth(dateTo.getMonth() - 1);

    const rangePicker = new RangePicker({
      from: dateFrom,
      to: dateTo
    });

    const ordersChart = new ColumnChart({
      label: 'Orders',
      url: 'api/dashboard/orders',
      range: {
        from: dateFrom,
        to: dateTo
      }
    });

    const salesChart = new ColumnChart({
      label: 'Sales',
      url: 'api/dashboard/sales',
      formatHeading: data => `$${data}`,
      range: {
        from: dateFrom,
        to: dateTo
      }
    });

    const customersChart = new ColumnChart({
      label: 'Sales',
      url: 'api/dashboard/customers',
      range: {
        from: dateFrom,
        to: dateTo
      }
    });

    const sortableTable = new SortableTable(header, {
      url: `api/dashboard/bestsellers?from=${dateFrom.toISOString()}&to=${dateTo.toISOString()}`,
      isSortLocally: true
    });

    this.components.rangePicker = rangePicker;
    this.components.ordersChart = ordersChart;
    this.components.salesChart = salesChart;
    this.components.customersChart = customersChart;
    this.components.sortableTable = sortableTable;
  }

  get template() {
    return `
        <div class="dashboard">
            <div class="content__top-panel">
                <h2 class="page-title">Dashboard</h2>
                <div data-element="rangePicker"></div>
            </div>
            <div data-element="chartsRoot" class="dashboard__charts">
            <div data-element="ordersChart" class="dashboard__chart_orders"></div>
            <div data-element="salesChart" class="dashboard__chart_sales"></div>
            <div data-element="customersChart" class="dashboard__chart_customers"></div>
            </div>
            <h3 class="block-title">Best sellers</h3>
            <div data-element="sortableTable"></div>
        </div>`;
  }

  async render() {
    this.init;

    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
    Object.keys(this.components).forEach(key => {
      if (this.subElements[key]) {
        this.subElements[key].append(this.components[key].element);
      }
    });

    this.addEventListeners ();
    return this.element;
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

  async updPageData(from, to) {
    const url = new URL('api/dashboard/bestsellers', BACKEND_URL);
    url.searchParams.set('from', from.toISOString());
    url.searchParams.set('to', to.toISOString());
    url.searchParams.set('_sort', 'title');
    url.searchParams.set('_order', 'asc');

    const dataPromise = fetchJson(url);
    const ordersPromise = this.components.ordersChart.update(from, to);
    const salesPromise = this.components.salesChart.update(from, to);
    const customersPromise = this.components.customersChart.update(from, to);

    const [data] = await Promise.all([dataPromise, ordersPromise, salesPromise, customersPromise]);
    this.components.sortableTable.addRows(data);
  }

  addEventListeners() {
    this.subElements.rangePicker.addEventListener('date-select', async event => {
      await this.updPageData(event.detail.from, event.detail.to);
    });
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
    Object.values(this.components).forEach(val => {
      val.destroy();
    });
  }
}
