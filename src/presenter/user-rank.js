import {render, replace, remove} from '../util/render.js';
import {getUserRank} from '../util/user-rank.js';
import {UserRankType} from '../constant.js';
import UserRankView from '../view/user-rank.js';


export default class UserRank {
  constructor(userRankContainer, filmsModel) {
    this._userRankContainer = userRankContainer;
    this._filmsModel = filmsModel;

    this._userRankComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const films = this._filmsModel.getFilms();
    const userRank = getUserRank(films);
    const prevUserRankComponent = this._userRankComponent;

    if (films.length === 0 || userRank === UserRankType.NO_RANK) {
      remove(prevUserRankComponent);
      this._userRankComponent = null;
      return;
    }

    this._userRankComponent = new UserRankView(userRank);

    if (prevUserRankComponent === null) {
      render(this._userRankContainer, this._userRankComponent);
      return;
    }

    replace(this._userRankComponent, prevUserRankComponent);
    remove(prevUserRankComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
