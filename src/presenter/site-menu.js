import {FilterType} from '../constant.js';
import {render, replace, remove} from '../util/render.js';
import SiteMenuView from '../view/site-menu.js';


export default class SiteMenu {
  constructor(mainComponentContainer, filterModel, filmsModel, showContent, showStatistic) {
    this._mainComponentContainer = mainComponentContainer;
    this._filterModel = filterModel;
    this._filmsModel = filmsModel;
    this._showContent = showContent;
    this._showStatistic = showStatistic;

    this._mainComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
    this._handleStatsClick = this._handleStatsClick.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters(this._filmsModel.get());
    const prevMainComponent = this._mainComponent;

    this._mainComponent = new SiteMenuView(filters, this._filterModel.getActive());
    this._mainComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);
    this._mainComponent.setStatsLinkClickHandler(this._handleStatsClick);

    if (prevMainComponent === null) {
      render(this._mainComponentContainer, this._mainComponent);

      return;
    }

    replace(this._mainComponent, prevMainComponent);
    remove(prevMainComponent);
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

  _handleStatsClick() {
    this._showStatistic();
  }

  _handleFilterTypeChange(currentFilter) {
    this._showContent(currentFilter);
  }

  _handleModelEvent() {
    this.init();
  }
}
