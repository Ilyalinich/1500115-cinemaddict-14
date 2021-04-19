import {render, remove, RenderPosition} from '../util/render.js';
import {updateItem} from '../util/common.js';
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

    this._filmPresenter = {};

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
  }

  init(films, commentsList) {
    this._films = films.slice();
    this._commentsList = commentsList;

    render(this._contentBoardContainer, this._contentContainerComponent);

    this._renderContent();
  }

  _renderFilm(filmsContainer, film) {
    const filmComments = this._commentsList.filter(({id}) => film.comments.includes(id));/*!!!!*/

    const filmPresenter = new FilmPresenter(filmsContainer, filmComments, this._pageBodyContainer, this._handleFilmChange);
    filmPresenter.init(film);

    this._filmPresenter[film.id] = filmPresenter;
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

  _renderShowMoreButton() {
    if (this._films.length > FILMS_RENDER_STEP) {
      render(this._allFilmsListComponent, this._showMoreButtonComponent);

      this._showMoreButtonComponent.setButtonClickHandler(this._handleShowMoreButtonClick);
    }
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

  _renderContent() {
    if (this._films.length === 0) {
      return this._renderNoFilmsList();
    }

    this._renderSortMenu();
    this._renderAllFilmsList();
    this._renderShowMoreButton();
    this._renderTopRatedFilmsList();
    this._renderMostCommentedFilmsList();
    // console.log(this._filmPresenter);
  }

  _clearFilmsList() {
    Object
      .values(this._filmPresenter)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenter = {};
    this._renderedFilmsCount = FILMS_RENDER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _handleShowMoreButtonClick() {
    this._renderFilms(this._allFilmsContainer, this._films, this._renderedFilmsCount, this._renderedFilmsCount + FILMS_RENDER_STEP);
    this._renderedFilmsCount += FILMS_RENDER_STEP;

    if (this._renderedFilmsCount >= this._films.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleFilmChange(updatedFilm) {
    console.log(this._films.find((prevFilm) => prevFilm.id === updatedFilm.id));
    this._films = updateItem(this._films, updatedFilm);
    console.log(updatedFilm);
    this._filmPresenter[updatedFilm.id].init(updatedFilm);
  }
}
