import SortableTable from '../../components/sortable-table';
import RangePicker from '../../components/range-picker';

import header from '../sales/sales-header';

export default class Page {
  element;
  subElements = {};
  components = {};

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    await this.initComponents();

    this.renderComponents();

    return this.element;

    // const url = new URL(`${process.env['BACKEND_URL ']}`);
    // createdAt_gte: 2020-09-01T19:22:57.164Z
    // createdAt_lte: 2020-10-31T20:22:57.164Z
    // _sort: createdAt
    // _order: desc
    // _start: 0
    // _end: 30


  }
  get template () {
    return `
      <div class="sales full-height flex-column">
        <div class="content__top-panel">
          <h1 class="page-title">Продажи</h1>
          <div data-element="rangePicker">
          <!-- range-picker component -->
          </div>
        </div>
        <div data-element="ordersContainer" class="full-height flex-column">
        <!-- sortable-table component -->
        </div>
      </div>
    `;
  }

  initComponents () {
    const to = new Date();
    const from = new Date(to.getTime() - (30 * 24 * 60 * 60 * 1000));

    const sortableTable = new SortableTable(header, {
      url: `/api/rest/orders`,
      isSortLocally: false,
      start:0,
      step: 10,
    });

    const rangePicker = new RangePicker({
      from,
      to
    });

    this.components.ordersContainer = sortableTable;
    this.components.rangePicker = rangePicker;
  }

  renderComponents () {
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component];
      const { element } = this.components[component];

      root.append(element);
    });
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  destroy () {

  }

}
