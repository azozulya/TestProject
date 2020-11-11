import SortableList from '../../components/sortable-list';

import fetchJson from '../../utils/fetch-json.js';

export default class Page {
  element;
  subElements = {};
  components = {};
  name = 'categories';
  categoriesContainer;

  async render () {
    const div = document.createElement('div');
    div.innerHTML =  this.template();

    this.element = div.firstElementChild;
    this.categoriesContainer = this.element.querySelector('[data-element=categoriesContainer]');

    await this.initComponents();
    this.renderComponents();

    return this.element;
  }

  initComponents = async () => {
    const categories = await fetchJson(`${process.env.BACKEND_URL}api/rest/categories?_sort=weight&_refs=subcategory`);

    this.categoriesContainer.innerHTML = this.getCategories(categories);
    this.subElements = this.getSubElements(this.categoriesContainer);

    this.categoriesContainer.addEventListener('pointerdown', this.onPointerDownHandler);
  };

  getSubElements ($element) {
    const elements = $element.querySelectorAll('[data-id]');

    return [...elements].reduce((accum, subElement) => {
      accum[subElement.dataset.id] = subElement;

      return accum;
    }, {});
  }

  getCategories = (categories) => {
    return categories.map(category => {
      const { id, title, subcategories } = category;

      this.components[id] = this.getSubcategories(subcategories);

      return `
        <div class="category category_open" data-id="${ id }">
          <header class="category__header">
            ${ title }
          </header>
          <div class="category__body">
            <div class="subcategory-list">

            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  getSubcategories = items => {
    return new SortableList({
      items: items.map( ({ id, title, count }) => {
        const element = document.createElement('li');
        element.classList.add('categories__sortable-list-item');
        element.setAttribute('data-grab-handle', '');
        element.dataset.id = id;
        element.innerHTML = `
          <strong>${title}</strong>
          <span><b>${count}</b> products</span>
        `;
        return element;
      }),
    });
  };

  renderComponents () {
    for (const [id, element] of Object.entries(this.subElements)) {
      element.querySelector('.subcategory-list').append(this.components[id].element);
    }
  }
  onPointerDownHandler = (event) => {
    const element = event.target.closest('.category__header');

    if(element) {
      const parent = element.closest('.category');
      parent.classList.toggle('category_open');
    }
  }

  template () {
    return `
    <div class="categories">
      <div class="content__top-panel">
        <h1 class="page-title">Categories</h1>
      </div>
      <div data-element="categoriesContainer"></div>
    </div>
    `;
  }

  destroy () {
    for (const component of Object.values(this.components)) {
      component.destroy();
    }
    this.categoriesContainer.removeEventListener('pointerdown', this.onPointerDownHandler);
    this.subElements = {};
    this.categoriesContainer = null;
  }
}
