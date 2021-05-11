import {render} from '../util/render.js';
import {isNumberInRange} from '../util/common.js';
import {UserRankType} from '../constant.js';
import UserRankView from '../view/user-rank.js';


const NoRankRange = {
  MIN: 0,
  MAX: 0,
};

const NoviceRange = {
  MIN: 1,
  MAX: 10,
};

const FanRange = {
  MIN: 11,
  MAX: 20,
};

const MovieBuffRange = {
  MIN: 20,
  MAX: Infinity,
};

const userRankMap = {
  [UserRankType.NO_RANK] : NoRankRange,
  [UserRankType.NOVICE]: NoviceRange,
  [UserRankType.FAN]: FanRange,
  [UserRankType.MOVIE_BUFF]: MovieBuffRange ,
};


export default class UserRank {
  constructor(userRankContainer, filmsModel) {
    this._userRankContainer = userRankContainer;
    this._filmsModel = filmsModel;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
  }

  init() {
    const films = this._filmsModel.get();
    const userRank = this._getUserRank(this._filmsModel.get());

    if (films.length === 0 || userRank === UserRankType.NO_RANK) {
      return;
    }

    this._userRankComponent = new UserRankView(userRank);
    render(this._userRankContainer, this._userRankComponent);
  }

  _handleModelEvent() {
    const films = this._filmsModel.get();
    this._userRankComponent.updateRank(this._getUserRank(films));
  }

  _getUserRank(films) {
    const watchedFilmsCount = films.reduce((accumulator, {userDetails}) => {
      return accumulator + Number(userDetails.alreadyWatched);
    }, 0);

    return Object.entries(userRankMap)
      .find(([ ,{MIN, MAX}]) => isNumberInRange(watchedFilmsCount, MIN, MAX))[0];
  }
}
