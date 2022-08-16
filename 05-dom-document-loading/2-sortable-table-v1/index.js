export default class SortableTable {
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.headerConfig = [...headerConfig];
    this.data = [...data];

    this.getTableRow = this.getTableRow.bind(this);

    this.render();
  }

  sort(fieldValue, orderValue) {
    const ORDER = {
      'asc': 1,
      'desc': -1
    };

    const CASE = {
      'asc': 'upper',
      'desc': 'lower'
    };

    const strCompareFn = (obj1, obj2) => {
      return ORDER[orderValue] * obj1[fieldValue].localeCompare(obj2[fieldValue], ['ru', 'en'],
        {caseFirst: CASE[orderValue]}
      );
    };

    const numCompareFn = (obj1, obj2) => ORDER[orderValue] * (obj1[fieldValue] - obj2[fieldValue]);

    const getCompareFn = (obj1, obj2) => {
      switch (typeof obj1[fieldValue]) {
      case 'string':
        return strCompareFn(obj1, obj2);
      case 'number':
        return numCompareFn(obj1, obj2);
      }
    };

    this.data.sort(getCompareFn);
    this.updateBody();
  }

  updateBody() {
    this.subElements.body.innerHTML = this.body;
  }

  getSubElements() {
    const result = {};
    const elements = this.element.querySelectorAll("[data-element]");

    for (const element of elements) {
      const name = element.dataset.element;
      result[name] = element;
    }

    return result;
  }

  get header() {
    return this.headerConfig.map(item => {
      return `
        <div class="sortable-table__cell" data-id="${item.id}" data-sortable="${item.sortable}">
          <span>${item.title}</span>
        </div>
      `;
    }).join('');
  }

  getTableRow(product) {
    const rowData = this.headerConfig.map(config => {
      switch (config.id) {
      case 'images':
        return config.template(product?.images);
      default:
        return `<div class="sortable-table__cell">${product[config.id]}</div>`;
      }
    }).join('');

    return `
      <a href="/products/${product.id}" class="sortable-table__row">
        ${rowData}
      </a>
    `;
  }

  get body() {
    return this.data.map(this.getTableRow).join('');
  }

  get template() {
    return `
      <div class="sortable-table">
        <div data-element="header" class="sortable-table__header sortable-table__row">
          ${this.header}
        </div>
        <div data-element="body" class="sortable-table__body">
          ${this.body}
        </div>
        <div data-element="loading" class="loading-line sortable-table__loading-line"></div>

        <div data-element="emptyPlaceholder" class="sortable-table__empty-placeholder">
          <div>
            <p>No products satisfies your filter criteria</p>
            <button type="button" class="button-primary-outline">Reset all filters</button>
          </div>
        </div>
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
    this.subElements = {};
  }
}

