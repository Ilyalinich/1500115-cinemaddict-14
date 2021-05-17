import {render} from '../util/render.js';
import {getUserRank} from '../util/user-rank.js';
import {UserRankType} from '../constant.js';
import UserRankView from '../view/user-rank.js';
import {UpdateType} from '../constant.js';


export default class UserRank {
  constructor(userRankContainer, filmsModel) {
    this._userRankContainer = userRankContainer;
    this._filmsModel = filmsModel;

    this._userRankComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const films = this._filmsModel.get();
    const userRank = getUserRank(films);

    if (films.length === 0 || userRank === UserRankType.NO_RANK) {
      return;
    }

    this._userRankComponent = new UserRankView(userRank);
    render(this._userRankContainer, this._userRankComponent);
  }

  _handleModelEvent(updateType) {
    if (updateType !== UpdateType.MINOR) {
      return;
    }

    const userRank = getUserRank(this._filmsModel.get());

    if (userRank === UserRankType.NO_RANK) {
      return this._userRankComponent.hide();
    }

    if (this._userRankComponent === null) {
      // перебрать этот модуль
      this._userRankComponent = new UserRankView(userRank);
      render(this._userRankContainer, this._userRankComponent);

      return;
    }

    this._userRankComponent.updateRank(userRank);
    this._userRankComponent.show();
  }
}
