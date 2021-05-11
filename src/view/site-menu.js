import AbstractView from './abstract.js';


const createFilterItemTemplate = ({type, count}, currentFilterType) =>
  `<a href="#${type.toLowerCase()}"
    class="main-navigation__item ${type === currentFilterType ? 'main-navigation__item--active' : ''}"
    data-filter-type="${type}">
    ${type === 'All'
    ? `${type} movies`
    : `${type} <span class="main-navigation__item-count">${count}</span>`}
  </a>`;

const createSiteMenuTemplate = (filters, currentFilterType) => {
  const filterItemsTemplate = filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      ${filterItemsTemplate}
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};


export default class SiteMenu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilterType = currentFilterType;

    this._filterClickHandler = this._filterClickHandler.bind(this);
    this._statsLinkClickHandler = this._statsLinkClickHandler.bind(this);
  }

  getTemplate() {
    return createSiteMenuTemplate(this._filters, this._currentFilterType);
  }

  _filterClickHandler(evt) {
    if (evt.target.tagName !== 'A' || this._currentFilterType === evt.target.dataset.filterType) {
      return;
    }

    evt.preventDefault();

    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  _statsLinkClickHandler(evt) {
    if (this._statsLinkElement.classList.contains('main-navigation__item--active')) {
      return;
    }

    evt.preventDefault();

    this._currentFilterType = null;

    this.getElement()
      .querySelector('.main-navigation__item--active')
      .classList.remove('main-navigation__item--active');

    this._statsLinkElement.classList.add('main-navigation__item--active');
    this._callback.statsLinkClick();
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement()
      .querySelectorAll('.main-navigation__item')
      .forEach((filter) => filter.addEventListener('click', this._filterClickHandler));
  }

  setStatsLinkClickHandler(callback) {
    this._callback.statsLinkClick = callback;
    this._statsLinkElement = this.getElement().querySelector('.main-navigation__additional');
    this._statsLinkElement.addEventListener('click', this._statsLinkClickHandler);
  }
}
