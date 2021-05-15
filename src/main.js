import {UpdateType} from './constant.js';
import {getRandomInteger} from './util/common.js';
import {render} from './util/render.js';
import {CommentsCount} from './constant.js';
import {generateFilm} from './mock/film-data.js';
import {generateComment} from './mock/comment.js';
import FilmsCounterView from './view/films-counter.js';
import ContentBoardPresenter from './presenter/content-board.js';
import SiteMenuPresenter from './presenter/site-menu.js';
import UserRankPresenter from './presenter/user-rank.js';
import StatisticPresenter from './presenter/statistic.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FiltersModel from './model/filter.js';


const FILMS_COUNT = 10;


const pageBodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');


const commentsList = [];

const films = new Array(FILMS_COUNT)
  .fill(null)
  .map(() => {
    const commentsCount = getRandomInteger(CommentsCount.MIN, CommentsCount.MAX);
    const comments = new Array(commentsCount)
      .fill(null)
      .map(generateComment);

    const commentsIds = [];

    comments.forEach((comment) => {
      commentsIds.push(comment.id);
      commentsList.push(comment);
    });

    return generateFilm(commentsIds);
  });


const filmsModel = new FilmsModel();
filmsModel.set(films);

const addCommentToFilm = (updateType, newComment) => {
  filmsModel.addNewComment(updateType, newComment);
};

const removeCommentFromFilm = (updateType, removedComment) => {
  filmsModel.removeComment(updateType, removedComment);
};

const commentsModel = new CommentsModel(addCommentToFilm, removeCommentFromFilm);
commentsModel.set(commentsList);

const filterModel = new FiltersModel();


const statisticPresenter = new StatisticPresenter(siteMainElement, filmsModel);
const contentBoardPresenter = new ContentBoardPresenter(siteMainElement, pageBodyElement, filmsModel, commentsModel, filterModel);


const showStatistic = () => {
  contentBoardPresenter.hide();
  statisticPresenter.init();
};

const showContent = (currentFilter) => {
  statisticPresenter.destroy();
  filterModel.set(UpdateType.MAJOR, currentFilter);
  contentBoardPresenter.show();
};


new UserRankPresenter(siteHeaderElement, filmsModel).init();
new SiteMenuPresenter(siteMainElement, filterModel, filmsModel, showContent, showStatistic).init();
contentBoardPresenter.init();
render(siteFooterStatisticsElement, new FilmsCounterView(films.length));
