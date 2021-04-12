import {getRandomInteger, render} from './util.js';
import {CommentsCount} from './mock/constant.js';
import {generateFilm} from './mock/film-data.js';
import {generateFilter} from './mock/filter-data.js';
import {generateComment} from './mock/comment.js';
import ContentContainerView from './view/content-container.js';
import AllFilmsListView from './view/all-films-list.js';
import MostCommentedFilmsListView from './view/most-commented-films-list.js';
import TopRatedFilmsListView from './view/top-rated-films-list.js';
import ShowMoreButtonView from './view/show-more-button.js';
import FilterMenuView from './view/filter-menu.js';
import UserRankView from './view/user-rank.js';
import SortMenuView from './view/sort-menu.js';
import FilmsCounterView from './view/films-counter.js';
import FilmCardView from './view/film-card.js';
import PopupView from './view/popup/popup.js';
import PopupCommentsView from './view/popup/popup-comments-list.js';


const FILMS_COUNT = 20;
const FILMS_RENDER_STEP = 5;
const EXTRA_LIST_FILMS_COUNT = 2;

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

const renderFilm = (filmListElement, film) => {
  const filmComponent = new FilmCardView(film);
  // const popupComponent = new PopupView(film);

  render(filmListElement, filmComponent.getElement());
};

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, new UserRankView(films).getElement());


const siteMainElement = document.querySelector('.main');

const filters = generateFilter(films);
const contentContainerComponent = new ContentContainerView();
render(siteMainElement, new FilterMenuView(filters).getElement());
render(siteMainElement, new SortMenuView().getElement());
render(siteMainElement, contentContainerComponent.getElement());


const allFilmsListComponent = new AllFilmsListView();
render(contentContainerComponent.getElement(), allFilmsListComponent.getElement());


const showMoreButtonComponent = new ShowMoreButtonView();
const allFilmsContainer = contentContainerComponent.getElement().querySelector('#all-films-container');
if (films.length > FILMS_RENDER_STEP) {
  let renderedFilmsCount = FILMS_RENDER_STEP;
  render(allFilmsListComponent.getElement(), showMoreButtonComponent.getElement());

  showMoreButtonComponent.getElement().addEventListener('click', (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_RENDER_STEP)
      .forEach((film) => renderFilm(allFilmsContainer, film));

    renderedFilmsCount += FILMS_RENDER_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButtonComponent.getElement().remove();
      showMoreButtonComponent.remove();
    }
  });
}


for (let i = 0; i < Math.min(films.length, FILMS_RENDER_STEP); i++) {
  renderFilm(allFilmsContainer, films[i]);
}


const compareFilmsRating = (previousFilm, nextFilm) => nextFilm.filmInfo.totalRating - previousFilm.filmInfo.totalRating;
const topRatedFilms = films.slice().sort(compareFilmsRating);
if (topRatedFilms[0].filmInfo.totalRating !== 0) {
  const topRatedFilmsComponent = new TopRatedFilmsListView();
  render(contentContainerComponent.getElement(), topRatedFilmsComponent.getElement());
  const topRatedFilmsContainer = topRatedFilmsComponent.getElement().querySelector('#top-rated-films-container');
  for (let i = 0; i < Math.min(topRatedFilms.length, EXTRA_LIST_FILMS_COUNT); i++) {
    renderFilm(topRatedFilmsContainer, topRatedFilms[i]);
  }
}

const compareFilmsCommentsLength = (previousFilm, nextFilm) => nextFilm.comments.length - previousFilm.comments.length;
const mostCommentedFilms = films.slice().sort(compareFilmsCommentsLength);
if (mostCommentedFilms[0].comments.length !== 0) {
  const mostCommentedFilmsComponent = new MostCommentedFilmsListView();
  render(contentContainerComponent.getElement(), mostCommentedFilmsComponent.getElement());
  const mostCommentedFilmsContainer = mostCommentedFilmsComponent.getElement().querySelector('#most-commented-films-container');
  for (let i = 0; i < Math.min(mostCommentedFilms.length, EXTRA_LIST_FILMS_COUNT); i++) {
    renderFilm(mostCommentedFilmsContainer, mostCommentedFilms[i]);
  }
}

const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, new FilmsCounterView(films).getElement());

const pageBody = document.querySelector('body');
render(pageBody, new PopupView(films[0]).getElement());

const popup = document.querySelector('.film-details');
const popupCommentsContainer = popup.querySelector('.film-details__comments-list');
const filteredComments = commentsList.filter(({id}) => films[0].comments.includes(id));
render(popupCommentsContainer, new PopupCommentsView(filteredComments).getElement());

const popupCloseButton = popup.querySelector('.film-details__close-btn');
popupCloseButton.addEventListener('click', () => {
  popup.classList.toggle('visually-hidden');
});
const firstFilmPoster = document.querySelector('.film-card__poster');
firstFilmPoster.addEventListener('click', () => {
  popup.classList.toggle('visually-hidden');
});
