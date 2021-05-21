import {SortType} from '../constant.js';
import AbstractView from './abstract.js';


const creteSortItemTemplate = (type, currentSortType) => {
  return `<li>
    <a href="#"
      class="sort__button ${type === currentSortType ? 'sort__button--active' : ''}"
      data-sort-type="${type}">
      ${type}
    </a>
  </li>`;
};

const createSortMenuTemplate = (currentSortType) => {
  const sortItemsTemplate = Object.values(SortType)
    .map((type) => creteSortItemTemplate(type, currentSortType))
    .join('');

  return `<ul class="sort">
    ${sortItemsTemplate}
  </ul>`;
};


export default class SortMenu extends AbstractView {
  constructor(currentItem) {
    super();

    this._currentItem = currentItem;
    this._itemChangeHandler = this._itemChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortMenuTemplate(this._currentItem);
  }

  setItemChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._itemChangeHandler);
  }

  _itemChangeHandler(evt) {
    if (evt.target.tagName !== 'A' || this._currentItem === evt.target.dataset.sortType) {
      return;
    }

    evt.preventDefault();

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }
}
