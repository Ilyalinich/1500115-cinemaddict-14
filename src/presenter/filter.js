import {UpdateType, FilterType} from '../constant.js';
import FilterView from '../view/filter-menu.js';
import {render, replace, remove} from '../util/render.js';

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
    const filters = this._getFilters(this._filmsModel.get());
    const prevFilterMenuComponent = this._filterMenuComponent;

    this._filterMenuComponent = new FilterView(filters, this._filterModel.getActive());
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
    this._filterModel.set(UpdateType.MAJOR, filterType);
  }

  _getFilters(films) {
    const filterMap = {
      [FilterType.ALL]: '',
      [FilterType.WATCHLIST]: 0,
      [FilterType.HISTORY]: 0,
      [FilterType.FAVORITES]: 0,
    };

    films.forEach(({userDetails}) => {
      if (userDetails.watchlist) {
        filterMap[FilterType.WATCHLIST]++;
      }

      if (userDetails.alreadyWatched) {
        filterMap[FilterType.HISTORY]++;
      }

      if (userDetails.favorite) {
        filterMap[FilterType.FAVORITES]++;
      }
    });

    return Object
      .entries(filterMap)
      .map(([filterType, filmsCount]) => (
        {
          type: filterType,
          count: filmsCount,
        }
      ));
  }
}
