export default class DoubleSlider {
  subElements = {};
  coords = {};

  constructor({min = 0, max = 0, formatValue = null, selected} = {}) {
    this.min = min;
    this.max = max;
    this.formatValue = formatValue;
    this.selected = {...selected};

    this.render();
    this.initEventListeners();
  }

  initEventListeners() {
    // this.subElements.sliderLeft.addEventListener('pointerdown', this.onPointerDownHandler);
    // document.addEventListener('pointerup', this.onPointerUpHandler);


    // this.subElements.sliderRight.addEventListener('pointerdown', this.onPointerDownHandler);
    // this.subElements.sliderRight.addEventListener('pointerup', this.onPointerUpHandler);
    // this.element.addEventListener('pointermove', this.onPointerMoveHandler);

    document.addEventListener('DOMContentLoaded', (event) => {
      const innerElem = document.querySelector('.range-slider__inner');
      this.coords = innerElem.getBoundingClientRect();

      this.onPointerDownHandler()

    })
  }

  onPointerDownHandler = () => {
    const slider = this.subElements.sliderLeft;
    const rangeSliderInner = document.querySelector('.range-slider__inner');
    const borders = rangeSliderInner.getBoundingClientRect();
    console.log(borders)

    const progress = document.querySelector('.range-slider__progress');


    const left = this.coords.left;

    slider.onmousedown = function (event) {
      const slider = event.target;
      console.log('==slider', slider)

      let shiftX = event.clientX - slider.getBoundingClientRect().left - slider.offsetWidth;
      let shiftY = event.clientY - slider.getBoundingClientRect().top;

      slider.style.position = 'absolute';
      slider.style.zIndex = 1000;
      document.body.append(slider);

      moveAt(event.pageX, event.pageY);

      function moveAt(pageX, pageY) {
        const coordX = pageX - shiftX;

        if (coordX > left) {
          slider.style.left = coordX + 'px';
          slider.style.top = shiftY + 'px';

          // set progress coords
          const calc = (coordX - borders.left) * 100 / (borders.right - borders.left);
          console.log('==calc', calc)

          progress.style.left = calc + '%';
          // progress.style.right = ;
        }
      }

      function onMouseMove(event) {
        moveAt(event.pageX, event.pageY);
      }

      document.addEventListener('mousemove', onMouseMove);

      document.onmouseup = function () {
        console.log('onpointerup');
        document.removeEventListener('mousemove', onMouseMove);
        slider.onmouseup = null;
      };
    };

    slider.ondragstart = function() {
      return false;
    };

  };

  onPointerUpHandler = (event) => {
    const slider = event.target
    document.removeEventListener('pointermove', this.onPointerMoveHandler);
    // }
  };

  onPointerMoveHandler = (event) => {
    console.log('==onPointerMoveHandler', event.clientX);

    const slider = event.target.dataset.element;

    const getPercents = (slider) => {
      // const value = this.selected[fieldValue];
      const calc = (event.clientX - this.coords.left) * 100 / (this.coords.right - this.coords.left);
      console.log('==calc', calc);

      switch (slider) {
      case 'sliderLeft':
        return `${calc}%`;
      case 'sliderRight':
        return `${calc}%`;
      }
    };


    if (slider === 'sliderLeft' || slider === 'sliderRight') {
      event.target.style.position = 'absolute';
      event.target.style.left = getPercents(slider);
    }
  };

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  getFormattedValue(value) {
    return this.formatValue ? this.formatValue(value) : value;
  }

  getSelectedPercents(fieldValue) {
    const value = this.selected[fieldValue];
    const calc = (value - this.min) * 100 / (this.max - this.min);

    switch (fieldValue) {
    case 'from':
      return `${calc}%`;
    case 'to':
      return `${100 - calc}%`;
    default:
      return `${calc}%`;
    }
  }

  getSelectionBoundary(fieldValue) {
    const FIELDS = {
      'from': 'min',
      'to': 'max'
    };

    const value = this.selected[fieldValue] || this[FIELDS[fieldValue]];
    return this.getFormattedValue(value);
  }

  get template() {
    return `
      <div class="range-slider">
        <span data-element="from">${this.getSelectionBoundary('from')}</span>
        <div class="range-slider__inner">
          <span class="range-slider__progress" style="left: ${this.getSelectedPercents('from')}; right: ${this.getSelectedPercents('to')}"></span>
          <span data-element="sliderLeft" class="range-slider__thumb-left" style="left: ${this.getSelectedPercents('from')}"></span>
          <span data-element="sliderRight" class="range-slider__thumb-right" style="right: ${this.getSelectedPercents('to')}"></span>
        </div>
        <span data-element="to">${this.getSelectionBoundary('to')}</span>
      </div>
    `;
  }

  render() {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = this.template;
    this.element = wrapper.firstElementChild;
    this.subElements = this.getSubElements();

  }

  remove() {
    if (this.element) {
      this.element.remove();
    }
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = null;
  }
}
