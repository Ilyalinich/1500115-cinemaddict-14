import {StatisticFilterType} from '../constant.js';
import {getUserRank} from '../util/user-rank.js';
import dayjs from 'dayjs';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getDuration} from '../util/day.js';
import SmartView from './smart.js';


const BAR_HEIGHT = 50;


const renderChart = (statisticCtx, state) => {
  const {genres, counters} = state;

  statisticCtx.height = BAR_HEIGHT * genres.length;

  return new Chart(
    statisticCtx,
    {
      plugins: [ChartDataLabels],
      type: 'horizontalBar',
      data: {
        labels: genres,
        datasets: [{
          data: counters,
          backgroundColor: '#ffe800',
          hoverBackgroundColor: '#ffe800',
          anchor: 'start',
          barThickness: 24,
        }],
      },
      options: {
        plugins: {
          datalabels: {
            font: {
              size: 20,
            },
            color: '#ffffff',
            anchor: 'start',
            align: 'start',
            offset: 40,
          },
        },
        scales: {
          yAxes: [{
            ticks: {
              fontColor: '#ffffff',
              padding: 100,
              fontSize: 20,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
          xAxes: [{
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          }],
        },
        legend: {
          display: false,
        },
        tooltips: {
          enabled: true,
        },
      },
    },
  );
};


const createStatisticsTemplate = (state) => {
  const {userRank, currentStatisticFilter, watchedFilms, genres} = state;

  const watchedFilmsRuntime = watchedFilms.reduce((accumulator, {filmInfo}) => {
    return accumulator + Number(filmInfo.runtime);
  }, 0);

  const totalDuration = getDuration(watchedFilmsRuntime);

  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${StatisticFilterType.ALL_TIME}" ${currentStatisticFilter === StatisticFilterType.ALL_TIME ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${StatisticFilterType.TODAY}" ${currentStatisticFilter === StatisticFilterType.TODAY ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${StatisticFilterType.WEEK}" ${currentStatisticFilter === StatisticFilterType.WEEK ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${StatisticFilterType.MONTH}" ${currentStatisticFilter === StatisticFilterType.MONTH ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${StatisticFilterType.YEAR}" ${currentStatisticFilter === StatisticFilterType.YEAR ? 'checked' : ''}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilms.length} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalDuration.hours()} <span class="statistic__item-description">h</span> ${totalDuration.minutes()} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${genres[0] ? genres[0] : ''}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};


export default class Statistic extends SmartView {
  constructor(films) {
    super();
    this._state = this._parseFilmsToState(films);


    this._chart = null;

    this._statisticFilterChangeHandler = this._statisticFilterChangeHandler.bind(this);

    this._setChart();
    this.restoreHandlers();
  }

  getTemplate() {
    return createStatisticsTemplate(this._state);
  }

  restoreHandlers() {
    this.getElement()
      .querySelector('.statistic__filters')
      .addEventListener('change', this._statisticFilterChangeHandler);
    this._setChart();
    //странно вызывать перерисовку графиков тут
  }

  _statisticFilterChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT' || this._state.currentStatisticFilter === evt.target.value) {
      return;
    }

    const watchedFilms = this._getWatchedFilms(this._state.films, evt.target.value);
    const genresCounters = this._getGenresCounters(watchedFilms);

    this.updateState(
      {
        currentStatisticFilter: evt.target.value,
        watchedFilms,
        genres: genresCounters.map((genresConter) => genresConter[0]),
        counters: genresCounters.map((genresConter) => genresConter[1]),
      },
    );
  }

  _setChart() {
    if (this._chart !== null) {
      this._chart === null;
    }

    const statisticCtx = this.getElement().querySelector('.statistic__chart');

    this._chart = renderChart(statisticCtx, this._state);
  }

  _getWatchedFilms(films, currentStatisticFilter) {
    switch (currentStatisticFilter) {
      case StatisticFilterType.TODAY:
        return films.filter(({userDetails}) => userDetails.alreadyWatched && dayjs().diff(dayjs(userDetails.watchingDate), 'day') === 0);
      case StatisticFilterType.WEEK:
        return films.filter(({userDetails}) => userDetails.alreadyWatched && dayjs().diff(dayjs(userDetails.watchingDate), 'week') === 0);
      case StatisticFilterType.MONTH:
        return films.filter(({userDetails}) => userDetails.alreadyWatched && dayjs().diff(dayjs(userDetails.watchingDate), 'month') === 0);
      case StatisticFilterType.YEAR:
        return films.filter(({userDetails}) => userDetails.alreadyWatched && dayjs().diff(dayjs(userDetails.watchingDate), 'year') === 0);
      default:
        return films.filter(({userDetails}) => userDetails.alreadyWatched);
    }
  }

  _getGenresCounters(watchedFilms) {
    const genresConter = {};

    watchedFilms.forEach(({filmInfo}) =>
      filmInfo.genre.forEach((genre) => genre in genresConter ? genresConter[genre]++ : genresConter[genre] = 1));

    return Object
      .entries(genresConter)
      .sort((genreCounterA, genreCounterB) => genreCounterB[1] - genreCounterA[1]);
  }


  _parseFilmsToState(films) {
    const watchedFilms = this._getWatchedFilms(films);
    const genresCounters = this._getGenresCounters(watchedFilms);

    return {
      films,
      userRank: getUserRank(films),
      // два раза считаю количество просмотренных фильмов.
      // вызов update state снаружи и передача измененных фильмов через стэйт, а не через пересоздание компонента
      // не приведет к изменениям
      currentStatisticFilter: StatisticFilterType.ALL_TIME,
      watchedFilms,
      genres: genresCounters.map((genresConter) => genresConter[0]),
      counters: genresCounters.map((genresConter) => genresConter[1]),
    };
  }
}
