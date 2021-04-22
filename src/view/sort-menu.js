import AbstractView from './abstract.js';
import {creteSortItemTemplate} from './sort-item.js';
import {SortType} from '../constant.js';


const createSortMenuTemplate = () => {
  const sortItemsTemplate = Object.values(SortType)
    .map((type, index) => creteSortItemTemplate(type, index === 0))
    .join('');

  return `<ul class="sort">
    ${sortItemsTemplate}
  </ul>`;
};


export default class SortMenu extends AbstractView {
  constructor() {
    super();

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortMenuTemplate();
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    // evt.target.classList.t('sort__button--active');
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
