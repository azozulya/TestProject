import ProductForm from '../../../components/product-form/index';

export default class Page {
  element;
  subElements = {};
  components = {};

  async render() {
    const productForm = new ProductForm();

    await productForm.render();

    productForm.element.addEventListener('product-saved', event => {
      console.error('product-saved', event.detail);
    });

    productForm.element.addEventListener('product-updated', event => {
      console.error('product-updated', event.detail);
    });

    this.components.productForm = productForm;

    const element = document.createElement('div');
    element.innerHTML = this.template;

    this.element = element.firstElementChild;

    return this.element;
  }

  get template () {

    return `
      <div class="products-edit">
        <div class="content__top-panel">
          <h1 class="page-title">
            <a href="/products" class="link">Products</a> / Add
          </h1>
        </div>
        <div class="content-box">
          ${this.components.productForm.element.innerHTML}
        </div>
      </div>
    `;
  }
}
