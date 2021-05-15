import {TimeRange} from '../constant.js';
import {getDuration} from '../util/day.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
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
  const {userRank, currentTimeRange, watchedFilms, genres} = state;

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

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="${TimeRange.ALL_TIME}" ${currentTimeRange === TimeRange.ALL_TIME ? 'checked' : ''}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="${TimeRange.TODAY}" ${currentTimeRange === TimeRange.TODAY ? 'checked' : ''}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="${TimeRange.WEEK}" ${currentTimeRange === TimeRange.WEEK ? 'checked' : ''}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="${TimeRange.MONTH}" ${currentTimeRange === TimeRange.MONTH ? 'checked' : ''}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="${TimeRange.YEAR}" ${currentTimeRange === TimeRange.YEAR ? 'checked' : ''}>
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
  constructor(userRank, {watchedFilms, currentTimeRange, genres, counters}) {
    super();

    this._state = {
      userRank,
      watchedFilms,
      currentTimeRange,
      genres,
      counters,
    };

    this._statisticFilterChangeHandler = this._statisticFilterChangeHandler.bind(this);

    this._createChart();
  }

  restoreHandlers() {
    this.setStatisticFilterChangeHandler(this._callback.statisticFilterChange);
  }

  restoreAdditionalViewParts() {
    this._createChart();
  }

  getTemplate() {
    return createStatisticsTemplate(this._state);
  }

  setStatisticFilterChangeHandler(callback) {
    this._callback.statisticFilterChange = callback;
    this.getElement()
      .querySelector('.statistic__filters')
      .addEventListener('change', this._statisticFilterChangeHandler);
  }

  _createChart() {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');

    renderChart(statisticCtx, this._state);
  }

  _statisticFilterChangeHandler(evt) {
    if (evt.target.tagName !== 'INPUT' || this._state.currentStatisticFilter === evt.target.value) {
      return;
    }

    this._callback.statisticFilterChange(evt.target.value);
  }
}
