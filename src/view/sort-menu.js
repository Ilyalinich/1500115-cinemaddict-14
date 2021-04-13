import {createElement} from '../util.js';
import {creteSortItemTemplate} from './sort-item.js';

const SORT_ITEM_NAMES = ['Sort by default', 'Sort by date', 'Sort by rating'];

const createSortMenuTemplate = () => {
  const sortItemsTemplate = SORT_ITEM_NAMES
    .map((name, index) => creteSortItemTemplate(name, index === 0))
    .join('');

  return `<ul class="sort">
    ${sortItemsTemplate}
  </ul>`;
};


export default class SortMenu {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createSortMenuTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this.element = null;
  }
}
