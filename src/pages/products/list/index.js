import DoubleSlider from '../../../components/double-slider';
import SortableTable from '../../../components/sortable-table';
import header from './products-header';

import fetchJson from '../../../utils/fetch-json.js';

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
    this.initEventListeners();

    return this.element;
  }

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-element]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.element] = subElement;

      return accum;
    }, {});
  }

  get template () {
    return `<div class="dashboard">
      <div class="content__top-panel">
        <h2 class="page-title">Products</h2>
        <a href="/products/add" class="button-primary">Add product</a>
      </div>
      <div class="content-box content-box_small">
        <form class="form-inline">
          <div class="form-group">
            <label class="form-label">Сортировать по:</label>
            <input type="text" data-elem="filterName" class="form-control" placeholder="Название товара">
          </div>
          <div class="form-group" data-elem="sliderContainer">
            <label class="form-label">Цена:</label>
            <div data-element="doubleSlider">
            <!-- range-slider components -->
            </div>
          </div>
        </form>
      </div>
      <div data-element="sortableTable">
        <!-- sortable-table component -->
      </div>
    </div>`;
  }

  async initComponents() {
    const minPrice = 0;
    const maxPrice = 4000;

    const doubleSlider = new DoubleSlider({
      min: minPrice,
      max: maxPrice,
    });

    const sortableTable = new SortableTable(header, {
      url: `/api/rest/products?price_gte=${minPrice}&price_lte=${maxPrice}`,
      isSortLocally: false,
      start:0,
      step: 10,
    });

    this.components.doubleSlider = doubleSlider;
    this.components.sortableTable = sortableTable;
  }

  renderComponents() {
    Object.keys(this.components).forEach(component => {
      const root = this.subElements[component];
      const { element } = this.components[component];

      root.append(element);
    });
  }

  initEventListeners () {
    this.components.doubleSlider.element.addEventListener('range-select', this.updateTableComponent);
  }

  updateTableComponent = async (event) => {
    const { from, to } = event.detail;
    const {url, sorted} = this.components.sortableTable;
    const { field, order } = sorted;
    url.searchParams.set('price_gte', from);
    url.searchParams.set('price_lte', to);

    const newUrl = new URL(`${process.env.BACKEND_URL}api/rest/products?_start=1&_end=20`);
    newUrl.searchParams.set('price_gte', from);
    newUrl.searchParams.set('price_lte', to);
    newUrl.searchParams.set('_sort', field);
    newUrl.searchParams.set('_order', order);

    const data = await fetchJson(url);
    this.components.sortableTable.addTable(data);
  }

  destroy() {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
  }
}
