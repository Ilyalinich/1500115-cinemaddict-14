import AbstractView from './abstract.js';
import {SortType} from '../constant.js';


const creteSortItemTemplate = (type, currentSortType) =>
  `<li>
    <a href="#"
      class="sort__button ${type === currentSortType ? 'sort__button--active' : ''}"
      data-sort-type="${type}">
      ${type}
    </a>
  </li>`;

const createSortMenuTemplate = (currentSortType) => {
  const sortItemsTemplate = Object.values(SortType)
    .map((type) => creteSortItemTemplate(type, currentSortType))
    .join('');

  return `<ul class="sort">
    ${sortItemsTemplate}
  </ul>`;
};


export default class SortMenu extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortMenuTemplate(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A' || this._currentSortType === evt.target.dataset.sortType) {
      return;
    }

    evt.preventDefault();

    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
