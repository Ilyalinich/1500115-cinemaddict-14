import {getRandomInteger} from './util/common.js';
import {render, remove} from './util/render.js';
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

const filmsCount = films.length;

const filters = generateFilter(films);


const pageBody = document.querySelector('body');
const siteHeaderElement = document.querySelector('.header');
const siteMainElement = document.querySelector('.main');
const siteFooterStatisticsElement = document.querySelector('.footer__statistics');


const renderUserRank = (userRankContainer, films) => {
  if (films.length !== 0 && films.some(({userDetails}) => userDetails.alreadyWatched)) {
    render(userRankContainer, new UserRankView(films));
  }
};

const renderFilterMenu = (filterMenuContainer, filters) => render(filterMenuContainer, new FilterMenuView(filters));

const renderSortMenu = (sortMenuContainer, filmsCount) => {
  if (filmsCount !== 0) {
    render(sortMenuContainer, new SortMenuView());
  }
};

const renderFilm = (filmListContainer, film) => {
  const filmComments = commentsList.filter(({id}) => film.comments.includes(id));
  const filmComponent = new FilmCardView(film);
  const popupComponent = new PopupView(film, filmComments);

  const renderPopup = () => {
    pageBody.classList.add('hide-overflow');
    render(pageBody, popupComponent);
  };

  const removePopup = () => {
    pageBody.classList.remove('hide-overflow');
    remove(popupComponent);
  };

  const onDocumentEscKeydown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      removePopup();
      document.removeEventListener('keydown', onDocumentEscKeydown);
    }
  };

  filmComponent.setPopupRenderTriggerClickHandler(() => {
    renderPopup();
    document.addEventListener('keydown', onDocumentEscKeydown);

    popupComponent.setCloseButtonClickHandler(() => {
      removePopup();
      document.removeEventListener('keydown', onDocumentEscKeydown);
    });
  });


  render(filmListContainer, filmComponent);
};


const renderContentBoard = (contentBoardContainer, films) => {
  const contentContainerComponent = new ContentContainerView();
  render(contentBoardContainer, contentContainerComponent);


  if (films.length === 0) {
    return render(contentContainerComponent, new NoFilmsListView());
  }


  const allFilmsListComponent = new AllFilmsListView();
  const allFilmsContainer = allFilmsListComponent.getElement().querySelector('#all-films-container');

  render(contentContainerComponent, allFilmsListComponent);

  for (let i = 0; i < Math.min(films.length, FILMS_RENDER_STEP); i++) {
    renderFilm(allFilmsContainer, films[i]);
  }


  const showMoreButtonComponent = new ShowMoreButtonView();

  if (films.length > FILMS_RENDER_STEP) {
    let renderedFilmsCount = FILMS_RENDER_STEP;
    render(allFilmsListComponent, showMoreButtonComponent);

    showMoreButtonComponent.setButtonClickHandler(() => {
      films
        .slice(renderedFilmsCount, renderedFilmsCount + FILMS_RENDER_STEP)
        .forEach((film) => renderFilm(allFilmsContainer, film));

      renderedFilmsCount += FILMS_RENDER_STEP;

      if (renderedFilmsCount >= films.length) {
        remove(showMoreButtonComponent);
      }
    });
  }


  const compareFilmsRating = (previousFilm, nextFilm) => nextFilm.filmInfo.totalRating - previousFilm.filmInfo.totalRating;
  const topRatedFilms = films.slice().sort(compareFilmsRating);

  if (topRatedFilms[0].filmInfo.totalRating !== 0) {
    const topRatedFilmsComponent = new TopRatedFilmsListView();
    const topRatedFilmsContainer = topRatedFilmsComponent.getElement().querySelector('#top-rated-films-container');

    render(contentContainerComponent, topRatedFilmsComponent);

    for (let i = 0; i < Math.min(topRatedFilms.length, EXTRA_LIST_FILMS_COUNT); i++) {
      renderFilm(topRatedFilmsContainer, topRatedFilms[i]);
    }
  }

  const compareFilmsCommentsLength = (previousFilm, nextFilm) => nextFilm.comments.length - previousFilm.comments.length;
  const mostCommentedFilms = films.slice().sort(compareFilmsCommentsLength);

  if (mostCommentedFilms[0].comments.length !== 0) {
    const mostCommentedFilmsComponent = new MostCommentedFilmsListView();
    const mostCommentedFilmsContainer = mostCommentedFilmsComponent.getElement().querySelector('#most-commented-films-container');

    render(contentContainerComponent, mostCommentedFilmsComponent);

    for (let i = 0; i < Math.min(mostCommentedFilms.length, EXTRA_LIST_FILMS_COUNT); i++) {
      renderFilm(mostCommentedFilmsContainer, mostCommentedFilms[i]);
    }
  }
};

const renderFilmsCounter = (filmsCounterContainer, filmsCount) => render(filmsCounterContainer, new FilmsCounterView(filmsCount));


renderUserRank(siteHeaderElement, films);
renderFilterMenu(siteMainElement, filters);
renderSortMenu(siteMainElement, filmsCount);
renderContentBoard(siteMainElement, films);
renderFilmsCounter(siteFooterStatisticsElement, filmsCount);
