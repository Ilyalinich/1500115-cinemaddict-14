import {UserRankType, UpdateType} from '../constant.js';
import {render} from '../util/render.js';
import {getUserRank} from '../util/user-rank.js';
import UserRankView from '../view/user-rank.js';


export default class UserRank {
  constructor(mainComponentContainer, filmsModel) {
    this._mainComponentContainer = mainComponentContainer;
    this._filmsModel = filmsModel;

    this._mainComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const films = this._filmsModel.get();
    const userRank = getUserRank(films);

    if (films.length === 0 || userRank === UserRankType.NO_RANK) {
      return;
    }

    this._mainComponent = new UserRankView(userRank);
    render(this._mainComponentContainer, this._mainComponent);
  }

  _handleModelEvent(updateType) {
    if (updateType !== UpdateType.MINOR) {
      return;
    }

    const userRank = getUserRank(this._filmsModel.get());

    if (this._mainComponent === null && userRank === UserRankType.NO_RANK) {

      return;

    } else if (this._mainComponent === null && userRank !== UserRankType.NO_RANK) {

      this._mainComponent = new UserRankView(userRank);
      render(this._mainComponentContainer, this._mainComponent);

    } else if (this._mainComponent !== null && userRank === UserRankType.NO_RANK) {

      this._mainComponent.hide();

    } else {

      this._mainComponent.update(userRank);
      this._mainComponent.show();
    }
  }
}
