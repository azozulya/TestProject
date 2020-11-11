import Router from './router/index.js';
import tooltip from './components/tooltip/index.js';

tooltip.initialize();

const router = Router.instance();

router
  .addRoute(/^$/, 'dashboard')
  .addRoute(/^products$/, 'products/list')
  .addRoute(/^products\/add$/, 'products/edit')
  .addRoute(/^products\/([\w()-]+)$/, 'products/edit')
  .addRoute(/^sales$/, 'sales')
  .addRoute(/^categories$/, 'categories')
  .addRoute(/^404\/?$/, 'error404')
  .setNotFoundPagePath('error404')
  .listen();

const sidebarBtn = document.querySelector('button.sidebar__toggler');

if (sidebarBtn) {
  sidebarBtn.addEventListener('click', () => document.body.classList.toggle('is-collapsed-sidebar'));
}

let currentPageName;

document.addEventListener('route', (event) => {
  if (currentPageName)
    changeActive(currentPageName, false);

  currentPageName = event.detail.page.name;

  if (currentPageName)
    changeActive(currentPageName, true);
});

const sidebarNav = document.querySelector('.sidebar__nav');

const changeActive = (item, isActive) => {
  const currentItem = sidebarNav.querySelector(`[data-page=${item}]`);
  const parent = currentItem.closest('li');
  return (isActive ? parent.classList.add('active') : parent.classList.remove('active'));
};
