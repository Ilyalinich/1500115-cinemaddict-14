import {getRandomInteger} from './util/common.js';
import {render} from './util/render.js';
import {CommentsCount} from './constant.js';
import {generateFilm} from './mock/film-data.js';
import {generateFilter} from './mock/filter-data.js';
import {generateComment} from './mock/comment.js';
import FilterMenuView from './view/filter-menu.js';
import UserRankView from './view/user-rank.js';
import FilmsCounterView from './view/films-counter.js';
import ContentBoardPresenter from './presenter/content-board.js';


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

const filters = generateFilter(films);


const pageBodyElement = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');


const renderUserRank = (userRankContainer, films) => {
  if (films.length !== 0 && films.some(({userDetails}) => userDetails.alreadyWatched)) {
    render(userRankContainer, new UserRankView(films));
  }
};

const renderFilterMenu = (filterMenuContainer, filters) => render(filterMenuContainer, new FilterMenuView(filters));

const renderFilmsCounter = (filmsCounterContainer, filmsCount) => render(filmsCounterContainer, new FilmsCounterView(filmsCount));

const contentBoardPresenter = new ContentBoardPresenter(siteMainElement, pageBodyElement);


renderUserRank(siteHeaderElement, films);
renderFilterMenu(siteMainElement, filters);
contentBoardPresenter.init(films, commentsList);
renderFilmsCounter(siteFooterStatisticsElement, filmsCount);
