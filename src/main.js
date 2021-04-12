import {getRandomInteger, render} from './util.js';
import {CommentsCount} from './mock/constant.js';
import {generateFilm} from './mock/film-data.js';
import {generateFilter} from './mock/filter-data.js';
import {generateComment} from './mock/comment.js';
import ContentContainerView from './view/content-container.js';
import NoFilmsListView from './view/no-films-list.js';
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


const pageBody = document.querySelector('body');

const renderFilm = (filmListElement, film) => {
  const filmComments = commentsList.filter(({id}) => film.comments.includes(id));
  const filmComponent = new FilmCardView(film);
  const popupComponent = new PopupView(film, filmComments);

  const renderPopup = () => {
    pageBody.classList.add('hide-overflow');
    pageBody.appendChild(popupComponent.getElement());
  };

  const removePopup = () => {
    pageBody.classList.remove('hide-overflow');
    pageBody.removeChild(popupComponent.getElement());
    // popupComponent.removeElement();
  };

  const onDocumentEscKeydown = (evt) => {
    if (evt.key === ('Escape' || 'Esc')) {
      evt.preventDefault();
      removePopup();
      document.removeEventListener('keydown', onDocumentEscKeydown);
    }
  };

  filmComponent.getElement().querySelector('.film-card__poster').addEventListener('click', () => {
    renderPopup();
    document.addEventListener('keydown', onDocumentEscKeydown);
  });
  filmComponent.getElement().querySelector('.film-card__title').addEventListener('click', () => {
    renderPopup();
    document.addEventListener('keydown', onDocumentEscKeydown);
  });
  filmComponent.getElement().querySelector('.film-card__comments').addEventListener('click', () => {
    renderPopup();
    document.addEventListener('keydown', onDocumentEscKeydown);
  });

  popupComponent.getElement().querySelector('.film-details__close-btn').addEventListener('click', () => {
    removePopup();
    document.removeEventListener('keydown', onDocumentEscKeydown);
  });

  render(filmListElement, filmComponent.getElement());
};

const siteHeaderElement = document.querySelector('.header');
if (films.length !== 0 && films.some(({userDetails}) => userDetails.alreadyWatched)) {
  render(siteHeaderElement, new UserRankView(films).getElement());
}


const siteMainElement = document.querySelector('.main');

const filters = generateFilter(films);
render(siteMainElement, new FilterMenuView(filters).getElement());

if (films.length !== 0) {
  render(siteMainElement, new SortMenuView().getElement());
}

const contentContainerComponent = new ContentContainerView();
render(siteMainElement, contentContainerComponent.getElement());

const allFilmsListComponent = new AllFilmsListView();
if (films.length === 0) {
  render(contentContainerComponent.getElement(), new NoFilmsListView().getElement());
} else {
  render(contentContainerComponent.getElement(), allFilmsListComponent.getElement());
}

const showMoreButtonComponent = new ShowMoreButtonView();
const allFilmsContainer = allFilmsListComponent.getElement().querySelector('#all-films-container');
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
      // showMoreButtonComponent.removeElement();
    }
  });
}


for (let i = 0; i < Math.min(films.length, FILMS_RENDER_STEP); i++) {
  renderFilm(allFilmsContainer, films[i]);
}

if (films.length !== 0) {
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
}

const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, new FilmsCounterView(films).getElement());
