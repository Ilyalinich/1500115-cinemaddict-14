import {UpdateType} from './constant.js';
import {render} from './util/render.js';
import FilmsCounterView from './view/films-counter.js';
import ContentBoardPresenter from './presenter/content-board.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import UserRankPresenter from './presenter/user-rank.js';
import StatisticPresenter from './presenter/statistic.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FiltersModel from './model/filter.js';
import Api from './api.js';


const AUTHORIZATION = 'Basic ls4kjn5lkhm5fl';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';


const pageBodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');


const api = new Api(END_POINT, AUTHORIZATION);


const filmsModel = new FilmsModel();
const commentsModel = new CommentsModel();
const filterModel = new FiltersModel();


const statisticPresenter = new StatisticPresenter(siteMainElement, filmsModel);
const contentBoardPresenter = new ContentBoardPresenter(siteMainElement, pageBodyElement, filmsModel, commentsModel, filterModel, api);


const showStatistic = () => {
  contentBoardPresenter.hide();
  statisticPresenter.init();
};

const showContent = (currentFilter) => {
  statisticPresenter.destroy();
  filterModel.set(UpdateType.MAJOR, currentFilter);
  contentBoardPresenter.show();
};


new SiteMenuPresenter(siteMainElement, filterModel, filmsModel, showContent, showStatistic).init();
contentBoardPresenter.init();

const filmsCounter = new FilmsCounterView(filmsModel.get().length);
render(siteFooterStatisticsElement, filmsCounter);

api.getFilms()
  .then((films) => filmsModel.set(UpdateType.INIT, films))
  .catch(() => filmsModel.set(UpdateType.LOADING_ERROR, []))
  .then(() => {
    new UserRankPresenter(siteHeaderElement, filmsModel).init();
    filmsCounter.updateCounter(filmsModel.get().length);
  });
