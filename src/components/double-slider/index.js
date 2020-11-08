export default class DoubleSlider {
  element;
  subElements;
  currentThumb;

  position = {
    shiftX: 0,
    left: 0,
    right: 0,
  };

  constructor ({min = 0, max = 100, formatValue = value => '$' + value, selected} = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = selected || { from: this.min, to: this.max} ;
    this.render();
  }

  render () {
    const div = document.createElement('div');
    div.innerHTML = this.template();

    this.element = div.firstElementChild;
    this.subElements = this.getSubElements(this.element);
    const {left: leftTumb, right: rightTumb} = this.subElements;
    [leftTumb, rightTumb].map((thumb) => thumb.addEventListener('pointerdown', this.onMouseDown));
    this.setDefaultPosition();
  }

  setDefaultPosition () {
    const {left: leftTumb, right: rightTumb, from: fromSpan, to: toSpan, progress} = this.subElements;
    const {from, to} = this.selected;
    const rangeTotal = this.max - this.min;
    const leftPos = Math.floor((from - this.min) / rangeTotal * 100);
    const rightPos = Math.floor((this.max - to) / rangeTotal * 100);

    leftTumb.style.left = `${leftPos}%`;
    rightTumb.style.right = `${rightPos}%`;
    progress.style = `left:${leftPos}%;right:${rightPos}%`;
    this.position.left = leftPos;
    this.position.right = rightPos;
    fromSpan.innerHTML = this.formatValue(from); fromSpan.dataset.value = from;
    toSpan.innerHTML = this.formatValue(to); toSpan.dataset.value = to;
  }

  getSubElements (element) {
    const elements = element.querySelectorAll('[data-element]');

    return [...elements].reduce((acc, item) => {
      acc[item.dataset.element] = item;
      return acc;
    }, {});
  }

  onMouseDown = event => {
    event.preventDefault();

    const { target, clientX } = event;
    const param = target.dataset.element;

    this.position.shiftX = clientX - target.getBoundingClientRect()[param];
    this.currentThumb = target;

    document.addEventListener('pointermove', this.onMouseMove);
    document.addEventListener('pointerup', this.onMouseUp);
  };

  onMouseMove = (event) => {
    const direction = {
      'left': 1,
      'right': -1,
    };
    const toggleParam = (arg) => {
      const object = {
        left: 'right',
        right: 'left',
      };
      return object[arg];
    };
    const {slider, progress, from, to} = this.subElements;
    const param = this.currentThumb.dataset.thumb;
    let newPos = Math.floor(direction[param] * (event.clientX - slider.getBoundingClientRect()[param]) - this.position.shiftX)/slider.getBoundingClientRect().width;

    const rightEdge = 100 - this.position[toggleParam(param)];
    newPos *= 100;

    if (newPos < 0) newPos = 0;

    if (newPos > rightEdge) newPos = rightEdge;

    this.position[param] = newPos;
    this.currentThumb.style[param] = `${newPos}%`;
    progress.style[param] = `${newPos}%`;

    const scale = (this.max - this.min) / 100;
    if (direction[param] > 0) {
      const val = Math.floor(newPos * scale + this.min);
      from.innerHTML = this.formatValue(val);
      from.dataset.value = val;
    } else {
      const val = Math.floor(this.max - newPos * scale);
      to.innerHTML = this.formatValue(val);
      to.dataset.value = val;
    }
  };

  onMouseUp = () => {
    const {from, to} = this.subElements;
    const customEvent = new CustomEvent('range-select', {
      bubbles: true,
      detail: {
        from: parseFloat(from.dataset.value),
        to: parseFloat(to.dataset.value),
      }
    });
    this.element.dispatchEvent(customEvent);

    this.removeListeners();
  };

  removeListeners () {
    document.removeEventListener('pointermove', this.onMouseMove);
    document.removeEventListener('pointerup', this.onMouseUp);
  }

  template = () => {
    const {from, to} = this.selected;
    return `
      <div class="range-slider">
        <span data-element="from">${this.formatValue(this.min)}</span>
        <div data-element="slider" class="range-slider__inner">
          <span data-element="progress" class="range-slider__progress" style="left:${from}px;right:${to}px"></span>
          <span data-element='left' data-thumb="left" class="range-slider__thumb-left" style="left:${from}px"></span>
          <span data-element='right' data-thumb="right" class="range-slider__thumb-right" style="right: ${to}px"></span>
        </div>
        <span data-element="to">${this.formatValue(this.max)}</span>
      </div>
    `;
  };

  destroy () {
    this.element.remove();
    this.removeListeners();
  }
}
