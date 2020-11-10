import ProductForm from '../../../components/product-form/index';

export default class Page {
  element;
  subElements = {};
  components = {};

  async render() {
    const editPage = document.location.pathname.search(new RegExp(/^\/products\/add$/))
    const itemID = !editPage ? '' : document.location.pathname.replace('/products/', '');
    const productForm = new ProductForm(itemID);

    this.components.productForm = await productForm.render();

    const element = document.createElement('div');
    element.innerHTML =  `
      <div class="products-edit">
        <div class="content__top-panel">
          <h1 class="page-title">
            <a href="/products" class="link">Products</a> / ${!editPage ? 'Add' : 'Edit'}
          </h1>
        </div>
        <div data-element="productForm" class="content-box"></div>
      </div>
    `;

    this.element = element.firstElementChild;
    this.element.querySelector("[data-element='productForm']").append(this.components.productForm);

    productForm.element.addEventListener('product-saved', event => {
      console.error('product-saved', event.detail);
    });

    productForm.element.addEventListener('product-updated', event => {
      console.error('product-updated', event.detail);
    });

    return this.element;
  }
}
