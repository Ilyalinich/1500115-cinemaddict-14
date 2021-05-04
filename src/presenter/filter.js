import FilterView from '../view/filter-menu.js';
import {render, replace, remove} from '../util/render.js';
import {getFilters} from '../util/filter.js';
import {UpdateType} from '../constant.js';

export default class Filter {
  constructor(filterMenuContainer, filterModel, filmsModel) {
    this._filterMenuContainer = filterMenuContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;

    this._filterMenuComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterMenuComponent = this._filterMenuComponent;

    this._filterMenuComponent = new FilterView(filters, this._filterModel.getActiveFilter());
    this._filterMenuComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterMenuComponent === null) {
      render(this._filterMenuContainer, this._filterMenuComponent);
      return;
    }

    replace(this._filterMenuComponent, prevFilterMenuComponent);
    remove(prevFilterMenuComponent);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    const films = this._filmsModel.getFilms();

    return getFilters(films);
  }
}
