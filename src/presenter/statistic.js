import {TimeRange} from '../constant.js';
import {remove, render} from '../util/render.js';
import {getUserRank} from '../util/user-rank.js';
import {isDateInRange} from '../util/day.js';
import StatisticView from '../view/statistic.js';


export default class Statistic {
  constructor(mainComponentContainer, filmsModel) {
    this._mainComponentContainer = mainComponentContainer;
    this._filmsModel = filmsModel;

    this._mainComponent = null;

    this._handleTimeRangeFilterChange = this._handleTimeRangeFilterChange.bind(this);
  }

  init() {
    this._mainComponent = new StatisticView(getUserRank(this._filmsModel.get()), this._getStateUpdate(TimeRange.ALL_TIME));

    this._mainComponent.setTimeRangeFilterChangeHandler(this._handleTimeRangeFilterChange);

    render(this._mainComponentContainer, this._mainComponent);
  }

  destroy() {
    remove(this._mainComponent);
    this._mainComponent = null;
  }

  _getWatchedFilmsByTimeRange(films, currentTimeRange) {
    if (currentTimeRange === TimeRange.ALL_TIME) {
      return films.filter(({userDetails}) => userDetails.alreadyWatched);
    }

    return films.filter(({userDetails}) => userDetails.alreadyWatched && isDateInRange(userDetails.watchingDate, currentTimeRange));
  }

  _getGenresCounters(watchedFilms) {
    const genresCounter = watchedFilms.reduce((accumulator, {filmInfo}) => {
      filmInfo.genres.forEach((genre) => {
        if (accumulator[genre]) {
          accumulator[genre]++;
        } else {
          accumulator[genre] = 1;
        }
      });

      return accumulator;
    }, {});

    return Object
      .entries(genresCounter)
      .sort((genreCounterA, genreCounterB) => genreCounterB[1] - genreCounterA[1]);
  }

  _getStateUpdate(currentTimeRange) {
    const watchedFilms = this._getWatchedFilmsByTimeRange(this._filmsModel.get(), currentTimeRange);
    const genresCounters = this._getGenresCounters(watchedFilms);

    return {
      watchedFilms,
      currentTimeRange,
      genres: genresCounters.map((genresCounter) => genresCounter[0]),
      counters: genresCounters.map((genresCounter) => genresCounter[1]),
    };
  }

  _handleTimeRangeFilterChange(currentTimeRange) {
    this._mainComponent.updateState(this._getStateUpdate(currentTimeRange));
  }
}
