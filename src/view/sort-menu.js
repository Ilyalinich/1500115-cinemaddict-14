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

    this._currentSortType = SortType.DEFAULT;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
    this._updateView = this._updateView.bind(this);
  }

  getTemplate() {
    return createSortMenuTemplate();
  }

  _updateView(evt) {
    this
      .getElement()
      .querySelector('.sort__button--active')
      .classList.remove('sort__button--active');

    evt.target.classList.add('sort__button--active');
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A' || this._currentSortType === evt.target.dataset.sortType) {
      return;
    }

    evt.preventDefault();

    this._updateView(evt);
    this._currentSortType = evt.target.dataset.sortType;
    this._callback.sortTypeChange(evt.target.dataset.sortType);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
