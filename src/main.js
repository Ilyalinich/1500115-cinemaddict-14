import {getRandomInteger} from './util/common.js';
import {render} from './util/render.js';
import {CommentsCount} from './constant.js';
import {generateFilm} from './mock/film-data.js';
import {generateComment} from './mock/comment.js';
import UserRankView from './view/user-rank.js';
import FilmsCounterView from './view/films-counter.js';
import ContentBoardPresenter from './presenter/content-board.js';
import FilterPresenter from './presenter/filter.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FiltersModel from './model/filter.js';


const FILMS_COUNT = 20;
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

const filmsCount = films.length;


const filmsModel = new FilmsModel();
filmsModel.setFilms(films);

const commentsModel = new CommentsModel();
commentsModel.setComments(commentsList);

const filterModel = new FiltersModel();


const pageBodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');


const renderUserRank = (userRankContainer, films) => {
  if (films.length !== 0 && films.some(({userDetails}) => userDetails.alreadyWatched)) {
    render(userRankContainer, new UserRankView(films));
  }
};

const renderFilmsCounter = (filmsCounterContainer, filmsCount) => render(filmsCounterContainer, new FilmsCounterView(filmsCount));


const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const contentBoardPresenter = new ContentBoardPresenter(siteMainElement, pageBodyElement, filmsModel, commentsModel, filterModel);


renderUserRank(siteHeaderElement, films);
filterPresenter.init();
contentBoardPresenter.init();
renderFilmsCounter(siteFooterStatisticsElement, filmsCount);
