import {render} from '../util/render.js';
import {getUserRank} from '../util/user-rank.js';
import {UserRankType} from '../constant.js';
import UserRankView from '../view/user-rank.js';


export default class UserRank {
  constructor(userRankContainer, filmsModel) {
    this._userRankContainer = userRankContainer;
    this._filmsModel = filmsModel;

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

  _handleModelEvent() {
    const films = this._filmsModel.get();
    this._userRankComponent.updateRank(getUserRank(films));
  }
}
