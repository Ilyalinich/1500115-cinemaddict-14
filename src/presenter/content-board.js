import {render, remove, RenderPosition} from '../util/render.js';
import {updateItem} from '../util/common.js';
import {sortFilmsByDate, sortFilmsByRating, sortFilmsByCommentsCount} from '../util/film.js';
import {SortType} from '../constant.js';
import ContentContainerView from '../view/content-container.js';
import SortMenuView from '../view/sort-menu.js';
import NoFilmsListView from '../view/no-films-list.js';
import AllFilmsListView from '../view/all-films-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import TopRatedFilmsListView from '../view/top-rated-films-list.js';
import MostCommentedFilmsListView from '../view/most-commented-films-list.js';
import FilmPresenter from './film.js';


const FILMS_RENDER_STEP = 5;
const EXTRA_LIST_FILMS_COUNT = 2;


export default class ContentBoard {
  constructor(contentBoardContainer, pageBodyContainer) {
    this._contentBoardContainer = contentBoardContainer;
    this._pageBodyContainer = pageBodyContainer;

    this._renderedFilmsCount = FILMS_RENDER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._contentContainerComponent = new ContentContainerView();
    this._noFilmsListComponent = new NoFilmsListView();
    this._allFilmsListComponent = new AllFilmsListView();
    this._topRatedFilmsComponent = new TopRatedFilmsListView();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsListView();
    this._sortMenuComponent = new SortMenuView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    // this._sortMenuComponent = new SortMenuView(this._currentSortType); вопрос

    this._filmPresenterStorage = {
      allfilmPresenterStorage: {},
      topRatedfilmPresenterStorage: {},
      mostCommentedfilmPresenterStorage: {},
    };

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(films, commentsList) {
    this._films = films.slice();
    this._sourcedFilms = films.slice();
    this._commentsList = commentsList;

    render(this._contentBoardContainer, this._contentContainerComponent);

    this._renderContent();
  }

  _renderFilm(filmsContainer, film) {
    const filmComments = this._commentsList.filter(({id}) => film.comments.includes(id));/*вопрос!!!!*/

    const filmPresenter = new FilmPresenter(filmsContainer, filmComments, this._pageBodyContainer, this._handleFilmChange, this._handleModeChange);
    filmPresenter.init(film);

    switch (filmsContainer.id) {
      case 'all-films-container':
        this._filmPresenterStorage.allfilmPresenterStorage[film.id] = filmPresenter;
        break;
      case 'top-rated-films-container':
        this._filmPresenterStorage.topRatedfilmPresenterStorage[film.id] = filmPresenter;
        break;
      case 'most-commented-films-container':
        this._filmPresenterStorage.mostCommentedfilmPresenterStorage[film.id] = filmPresenter;
        break;
      default:
        throw new Error('invalid value for the filmsContainer.id');
    }
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
    this._sortMenuComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._contentContainerComponent, this._sortMenuComponent, RenderPosition.BEFORE);
  }

  _renderAllFilmsList() {
    render(this._contentContainerComponent, this._allFilmsListComponent, RenderPosition.AFTERBEGIN);
    this._allFilmsContainer = this._allFilmsListComponent.getElement().querySelector('#all-films-container');

    this._renderFilms(this._allFilmsContainer, this._films, 0, Math.min(this._films.length, FILMS_RENDER_STEP));

    if (this._films.length > FILMS_RENDER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderShowMoreButton() {
    this._showMoreButtonComponent.setButtonClickHandler(this._handleShowMoreButtonClick);
    render(this._allFilmsListComponent, this._showMoreButtonComponent);
  }

  _renderTopRatedFilmsList() {
    const topRatedFilms = this._films.slice().sort(sortFilmsByRating);

    if (topRatedFilms[0].filmInfo.totalRating !== 0) {
      render(this._contentContainerComponent, this._topRatedFilmsComponent);
      this._topRatedFilmsContainer = this._topRatedFilmsComponent.getElement().querySelector('#top-rated-films-container');

      this._renderFilms(this._topRatedFilmsContainer, topRatedFilms, 0, Math.min(topRatedFilms.length, EXTRA_LIST_FILMS_COUNT));
    }
  }

  _renderMostCommentedFilmsList() {
    const mostCommentedFilms = this._films.slice().sort(sortFilmsByCommentsCount);

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
    this._renderTopRatedFilmsList();
    this._renderMostCommentedFilmsList();
  }

  _clearAllFilmsList() {
    Object
      .values(this._filmPresenterStorage.allfilmPresenterStorage)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenterStorage.allfilmPresenterStorage = {};
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
    this._films = updateItem(this._films, updatedFilm);
    this._sourcedFilms = updateItem(this._sourcedFilms, updatedFilm);

    Object
      .values(this._filmPresenterStorage)
      .forEach((storage) => {
        if (updatedFilm.id in storage) {
          storage[updatedFilm.id].init(updatedFilm);
        }
      });
  }

  _handleModeChange() {
    Object
      .values(this._filmPresenterStorage)
      .forEach((storage) => {
        Object
          .values(storage)
          .forEach((presenter) => presenter.resetView());
      });
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;

    remove(this._sortMenuComponent);
    // this._sortMenuComponent = new SortMenuView(this._currentSortType); вопрос
    this._renderSortMenu();


    this._sortFilms(sortType);
    this._clearAllFilmsList();
    this._renderFilms(this._allFilmsContainer, this._films, 0, Math.min(this._films.length, FILMS_RENDER_STEP));

    if (this._films.length > FILMS_RENDER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _sortFilms(sortType)  {
    switch (sortType) {
      case SortType.BY_DATE:
        this._films.sort(sortFilmsByDate);
        break;
      case SortType.BY_RATING:
        this._films.sort(sortFilmsByRating);
        break;
      default:
        this._films = this._sourcedFilms.slice();
    }
  }
}
