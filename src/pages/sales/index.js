import SortableTable from '../../components/sortable-table';
import RangePicker from '../../components/range-picker';

import header from '../sales/sales-header';
import fetchJson from '../../utils/fetch-json';

export default class Page {
  element;
  subElements = {};
  components = {};
  rowCount = 10;

  async render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;
    this.subElements = this.getSubElements(this.element);

    await this.initComponents();

    this.renderComponents();
    this.initEventListeners();

    return this.element;
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
      url: `/api/rest/orders?createdAt_gte=${from.toISOString()}&createdAt_lte=${to.toISOString()}`,
      isSortLocally: false,
      start:0,
      step: this.rowCount,
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

  initEventListeners () {
    this.components.rangePicker.element.addEventListener('date-select', this.updateTableComponent);
  }

  updateTableComponent = async (event) => { console.log(event.target);
    const { from, to } = event.detail;
    const { url } = this.components.ordersContainer;

    url.searchParams.set('createdAt_gte', from.toISOString());
    url.searchParams.set('createdAt_lte', to.toISOString());

    this.components.ordersContainer.start = 1;
    this.components.ordersContainer.end = this.rowCount;

    await this.components.ordersContainer.getData();
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
