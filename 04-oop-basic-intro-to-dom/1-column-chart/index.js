export default class ColumnChart {
  data = [];
  label = '';
  value = 0;
  link = '';
  formatHeading = data => data;
  chartHeight = 0;

  constructor(obj) {
    this.chartHeight = 50;
    if (typeof obj !== 'undefined') {
      Object.entries(obj).forEach(([key, value]) => {
        if (key === 'data') {this.data = value;}
        if (key === 'label') {this.label = value;}
        if (key === 'value') {this.value = value;}
        if (key === 'link') {this.link = value;}
        if (key === 'formatHeading') {this.formatHeading = value;}
        if (key === 'chartHeight') {this.chartHeight = 50;}
      });
    }

    this.render();
  }

  getColumns () {
    let resData = '';

    if (this.data.length === 0) {
      return;
    }

    for (let val of this.data) {
      let rate = Math.round((val / Math.max(...this.data)) * 100);
      let size = Math.floor(val * (50 / Math.max(...this.data)));
      resData = resData.concat(`<div style="--value: ${size}" data-tooltip="${rate}%"></div>`);
    }

    return resData;
  }

  getTemplate () {
    return `
        <div class class="column-chart" style="--chart-height: ${this.chartHeight}">
            <div class="column-chart__title">
                Total ${this.label}
                <a href="/${this.link}" class="column-chart__link">View all</a>
            </div>
            <div class="column-chart__container">
                <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
                <div data-element="body" class="column-chart__chart">
                    ${this.getColumns()}
                </div>
            </div>
        </div>>
    `;

    //провальная попытка сделать компонент только инструментами js, избегая голый html
    /*const gl = document.createElement('div');
    const columnChart = document.createElement('div');
    columnChart.className = 'column-chart';
    gl.append(columnChart);

    const columnChartTitle = document.createElement('div');
    columnChartTitle.className = `column-chart__${this.label}`;
    columnChartTitle.innerHTML = `${this.label}`;
    columnChart.append(columnChartTitle);
    return `here-${columnChart}`;*/
  }

  render () {
    const element = document.createElement('div'); // (*)
    //this.element = this.getTemplate(); //получил, к сожалению, [object HTMLDivElement]
    element.innerHTML = this.getTemplate();
    this.element = element.firstElementChild;

    // NOTE: в этой строке мы избавляемся от обертки-пустышки в виде `div`
    // который мы создали на строке (*)
    if (this.data.length === 0) {
      this.element.classList.add('column-chart_loading');
    }
  }

  update (data) {
    this.data = data;
  }

  //initEventListeners () {
  // NOTE: в данном методе добавляем обработчики событий, если они есть
  //}

  remove () {
    this.element.remove();
  }

  destroy() {
    this.remove();
    // NOTE: удаляем обработчики событий, если они есть
  }
}
