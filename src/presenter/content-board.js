import ContentContainerView from '../view/content-container.js';
import SortMenuView from '../view/sort-menu.js';
import NoFilmsListView from '../view/no-films-list.js';
import AllFilmsListView from '../view/all-films-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import TopRatedFilmsListView from '../view/top-rated-films-list.js';
import MostCommentedFilmsListView from '../view/most-commented-films-list.js';
import FilmPresenter from './film.js';
// import FilmCardView from '../view/film-card.js';
// import PopupView from '../view/popup/popup.js';
import {render, remove, RenderPosition} from '../util/render.js';


const FILMS_RENDER_STEP = 5;
const EXTRA_LIST_FILMS_COUNT = 2;


export default class ContentBoard {
  constructor(contentBoardContainer, pageBodyContainer) {
    this._contentBoardContainer = contentBoardContainer;
    this._pageBodyContainer = pageBodyContainer;

    this._contentContainerComponent = new ContentContainerView();
    this._noFilmsListComponent = new NoFilmsListView();
    this._allFilmsListComponent = new AllFilmsListView();
    this._topRatedFilmsComponent = new TopRatedFilmsListView();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsListView();
    this._sortMenuComponent = new SortMenuView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._renderedFilmsCount = FILMS_RENDER_STEP;

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(films, commentsList) {
    this._films = films.slice();
    this._commentsList = commentsList;

    render(this._contentBoardContainer, this._contentContainerComponent);

    this._renderContent();
  }

  _renderFilm(filmsContainer, film) {
    const filmComments = this._commentsList.filter(({id}) => film.comments.includes(id));

    const filmPresenter = new FilmPresenter(filmsContainer, this._pageBodyContainer);
    filmPresenter.init(film, filmComments);
    // const filmComponent = new FilmCardView(film);
    // const popupComponent = new PopupView(film, filmComments);

    // const renderPopup = () => {
    //   this._pageBodyContainer.classList.add('hide-overflow');
    //   render(this._pageBodyContainer, popupComponent);
    // };

    // const removePopup = () => {
    //   this._pageBodyContainer.classList.remove('hide-overflow');
    //   remove(popupComponent);
    // };

    // const onDocumentEscKeydown = (evt) => {
    //   if (evt.key === 'Escape' || evt.key === 'Esc') {
    //     evt.preventDefault();
    //     removePopup();
    //     document.removeEventListener('keydown', onDocumentEscKeydown);
    //   }
    // };

    // filmComponent.setPopupRenderTriggerClickHandler(() => {
    //   renderPopup();
    //   document.addEventListener('keydown', onDocumentEscKeydown);

    //   popupComponent.setCloseButtonClickHandler(() => {
    //     removePopup();
    //     document.removeEventListener('keydown', onDocumentEscKeydown);
    //   });
    // });


    // render(filmListContainer, filmComponent);
  }

  _renderFilms(filmsContainer, films, from, to) {
    films
      .slice(from, to)
      .forEach((film) => this._renderFilm(filmsContainer, film));
  }

  _renderNoFilmsList() {
    render(this._contentContainerComponent, this._noFilmsListComponent);
  }

  _renderSortMenu() {
    render(this._contentContainerComponent, this._sortMenuComponent, RenderPosition.BEFORE);
  }

  _renderAllFilmsList() {
    render(this._contentContainerComponent, this._allFilmsListComponent);
    this._allFilmsContainer = this._allFilmsListComponent.getElement().querySelector('#all-films-container');

    this._renderFilms(this._allFilmsContainer, this._films, 0, Math.min(this._films.length, FILMS_RENDER_STEP));

    // if (this._films.length > FILMS_RENDER_STEP) {
    //   this._renderShowMoreButton();
    // }
  }

  _renderTopRatedFilmsList() {
    const compareFilmsRating = (previousFilm, nextFilm) => nextFilm.filmInfo.totalRating - previousFilm.filmInfo.totalRating;
    const topRatedFilms = this._films.slice().sort(compareFilmsRating);

    if (topRatedFilms[0].filmInfo.totalRating !== 0) {
      render(this._contentContainerComponent, this._topRatedFilmsComponent);
      this._topRatedFilmsContainer = this._topRatedFilmsComponent.getElement().querySelector('#top-rated-films-container');

      this._renderFilms(this._topRatedFilmsContainer, topRatedFilms, 0, Math.min(topRatedFilms.length, EXTRA_LIST_FILMS_COUNT));
    }
  }

  _renderMostCommentedFilmsList() {
    const compareFilmsCommentsLength = (previousFilm, nextFilm) => nextFilm.comments.length - previousFilm.comments.length;
    const mostCommentedFilms = this._films.slice().sort(compareFilmsCommentsLength);

    if (mostCommentedFilms[0].comments.length !== 0) {
      render(this._contentContainerComponent, this._mostCommentedFilmsComponent);
      this._mostCommentedFilmsContainer = this._mostCommentedFilmsComponent.getElement().querySelector('#most-commented-films-container');

      this._renderFilms(this._mostCommentedFilmsContainer, mostCommentedFilms, 0, Math.min(mostCommentedFilms.length, EXTRA_LIST_FILMS_COUNT));
    }
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._allFilmsContainer, this._films, this._renderedFilmsCount, this._renderedFilmsCount + FILMS_RENDER_STEP);
    this._renderedFilmsCount += FILMS_RENDER_STEP;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._films.length > FILMS_RENDER_STEP) {
      render(this._allFilmsListComponent, this._showMoreButtonComponent);

      this._showMoreButtonComponent.setButtonClickHandler(this._handleShowMoreButtonClick);
    }
  }

  _renderContent() {
    if (this._films.length === 0) {
      return this._renderNoFilmsList();
    }

    this._renderSortMenu();
    this._renderAllFilmsList();
    this._renderShowMoreButton();
    this._renderTopRatedFilmsList();
    this._renderMostCommentedFilmsList();
  }
}
