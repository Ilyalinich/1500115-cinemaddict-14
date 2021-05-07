import {getRandomInteger} from './util/common.js';
import {render} from './util/render.js';
import {CommentsCount} from './constant.js';
import {generateFilm} from './mock/film-data.js';
import {generateComment} from './mock/comment.js';
import FilmsCounterView from './view/films-counter.js';
import ContentBoardPresenter from './presenter/content-board.js';
import FilterPresenter from './presenter/filter.js';
import UserRankPresenter from './presenter/user-rank.js';
import FilmsModel from './model/films.js';
import CommentsModel from './model/comments.js';
import FiltersModel from './model/filter.js';


const FILMS_COUNT = 20;


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
filmsModel.setFilms(films);

const addCommentToFilm = (updateType, newComment) => {
  filmsModel.addNewComment(updateType, newComment);
};

const removeCommentFromFilm = (updateType, removedComment) => {
  filmsModel.removeComment(updateType, removedComment);
};

const commentsModel = new CommentsModel(addCommentToFilm, removeCommentFromFilm);
commentsModel.setComments(commentsList);

const filterModel = new FiltersModel();


const userRankPresenter = new UserRankPresenter(siteHeaderElement, filmsModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, filmsModel);
const contentBoardPresenter = new ContentBoardPresenter(siteMainElement, pageBodyElement, filmsModel, commentsModel, filterModel);

userRankPresenter.init();
filterPresenter.init();
contentBoardPresenter.init();
render(siteFooterStatisticsElement, new FilmsCounterView(films.length));
