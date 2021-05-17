import {remove, render} from '../util/render.js';
import {TimeRange} from '../constant.js';
import {getUserRank} from '../util/user-rank.js';
import {isDateInRange} from '../util/day.js';
import StatisticView from '../view/statistic.js';


export default class Statistic {
  constructor(statisticContainer, filmsModel) {
    this._statisticContainer = statisticContainer;
    this._filmsModel = filmsModel;

    this._statisticComponent = null;

    this._handleStatisticFilterChange = this._handleStatisticFilterChange.bind(this);
  }

  init() {
    this._statisticComponent = new StatisticView(getUserRank(this._filmsModel.get()), this._getStateUpdate(TimeRange.ALL_TIME));

    this._statisticComponent.setStatisticFilterChangeHandler(this._handleStatisticFilterChange);

    render(this._statisticContainer, this._statisticComponent);
  }

  destroy() {
    remove(this._statisticComponent);
    this._statisticComponent = null;
  }

  _getWatchedFilmsByTimeRange(films, currentTimeRange) {
    if (currentTimeRange === TimeRange.ALL_TIME) {
      return films.filter(({userDetails}) => userDetails.alreadyWatched);
    }

    return films.filter(({userDetails}) => userDetails.alreadyWatched && isDateInRange(userDetails.watchingDate, currentTimeRange));
  }

  _getGenresCounters(watchedFilms) {
    const genresCounter = watchedFilms.reduce((accumulator, {filmInfo}) => {
      filmInfo.genre.forEach((genre) => {
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

  _handleStatisticFilterChange(currentTimeRange) {
    this._statisticComponent.updateState(this._getStateUpdate(currentTimeRange));
  }
}
