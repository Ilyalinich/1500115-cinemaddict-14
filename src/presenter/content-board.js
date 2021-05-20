import {SortType, UpdateType, UserAction, FilmContainerType} from '../constant.js';
import {render, remove, RenderPosition} from '../util/render.js';
import {filterFilms} from '../util/filter.js';
import {sortFilmsByDate, sortFilmsByRating, sortFilmsByCommentsCount} from '../util/sort.js';
import LoadingView from '../view/loading.js';
import LoadingErrorView from '../view/loading-error.js';
import ContentContainerView from '../view/content-container.js';
import SortMenuView from '../view/sort-menu.js';
import NoFilmsListView from '../view/no-films-list.js';
import AllFilmsListView from '../view/all-films-list.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import TopRatedFilmsListView from '../view/top-rated-films-list.js';
import MostCommentedFilmsListView from '../view/most-commented-films-list.js';
import FilmPresenter from './film.js';
import PopupPresenter from './popup.js';


const FILMS_RENDER_STEP = 5;
const EXTRA_LIST_FILMS_COUNT = 2;


export default class ContentBoard {
  constructor(mainComponentContainer, popupContainer, filmsModel, commentsModel, filterModel, api) {
    this._mainComponentContainer = mainComponentContainer;

    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._renderedFilmsCount = FILMS_RENDER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._isLoading = true;
    this._api = api;

    this._sortMenuComponent = null;
    this._showMoreButtonComponent = null;
    this._allFilmsListComponent = null;

    this._mainComponent = new ContentContainerView();
    this._loadingComponent = new LoadingView();
    this._noFilmsListComponent = new NoFilmsListView();
    this._topRatedFilmsComponent = new TopRatedFilmsListView();
    this._mostCommentedFilmsComponent = new MostCommentedFilmsListView();


    this._filmPresenterStorage = {
      allfilmPresenterStorage: {},
      topRatedfilmPresenterStorage: {},
      mostCommentedfilmPresenterStorage: {},
    };


    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._createPopup = this._createPopup.bind(this);


    this._filmsModel.addObserver(this._handleModelEvent);

    this._popupPresenter = new PopupPresenter(popupContainer, this._filmsModel, this._commentsModel, this._handleViewAction);
  }

  init() {
    render(this._mainComponentContainer, this._mainComponent);

    this._renderContent();
  }

  show() {
    this._mainComponent.show();
  }

  hide() {
    if (this._sortMenuComponent && this._mainComponent) {
      this._sortMenuComponent.hide();
      this._mainComponent.hide();
    }
  }

  _renderLoading() {
    render(this._mainComponent, this._loadingComponent, RenderPosition.AFTERBEGIN);
  }

  _renderLoadingErrorMessage() {
    remove(this._loadingComponent);

    this._loadingErrorMessage = new LoadingErrorView();
    render(this._mainComponent, this._loadingErrorMessage);
  }

  _renderNoFilmsList() {
    render(this._mainComponent, this._noFilmsListComponent, RenderPosition.AFTERBEGIN);
  }

  _renderFilm(filmsContainer, film) {
    const filmPresenter = new FilmPresenter(filmsContainer, this._handleViewAction, this._createPopup);
    filmPresenter.init(film);

    switch (filmsContainer.id) {
      case FilmContainerType.ALL:
        this._filmPresenterStorage.allfilmPresenterStorage[film.id] = filmPresenter;
        break;

      case FilmContainerType.TOP_RATED:
        this._filmPresenterStorage.topRatedfilmPresenterStorage[film.id] = filmPresenter;
        break;

      case FilmContainerType.MOST_COMMENTED:
        this._filmPresenterStorage.mostCommentedfilmPresenterStorage[film.id] = filmPresenter;
        break;

      default:
        throw new Error('invalid value for the filmsContainer.id');
    }
  }

  _renderFilms(filmsContainer, films) {
    films.forEach((film) => this._renderFilm(filmsContainer, film));
  }

  _renderSortMenu() {
    if (this._sortMenuComponent !== null) {
      this._sortMenuComponent = null;
    }

    this._sortMenuComponent = new SortMenuView(this._currentSortType);
    this._sortMenuComponent.setItemChangeHandler(this._handleSortTypeChange);

    render(this._mainComponent, this._sortMenuComponent, RenderPosition.BEFORE);
  }

  _renderAllFilmsList() {
    if (this._allFilmsListComponent === null) {
      this._allFilmsListComponent = new AllFilmsListView();

      render(this._mainComponent, this._allFilmsListComponent, RenderPosition.AFTERBEGIN);
      this._allFilmsContainer = this._allFilmsListComponent.getElement().querySelector(`#${FilmContainerType.ALL}`);
    }

    const films = this._getFilms();
    const filmsCount = films.length;
    const filmsToRender = films.slice(0, Math.min(filmsCount, this._renderedFilmsCount));

    this._renderFilms(this._allFilmsContainer, filmsToRender);

    if (filmsCount > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setButtonClickHandler(this._handleShowMoreButtonClick);

    render(this._allFilmsListComponent, this._showMoreButtonComponent);
  }

  _renderAllFilmsBoard() {
    if (this._getFilms().length === 0) {
      remove(this._allFilmsListComponent);
      this._allFilmsListComponent = null;

      this._renderNoFilmsList();

      return;
    }

    this._renderSortMenu();
    this._renderAllFilmsList();
  }

  _renderTopRatedFilmsList() {
    const topRatedFilms = this._filmsModel
      .get()
      .slice()
      .sort(sortFilmsByRating);

    const topRatedFilmsCount = topRatedFilms.length;
    const filmsToRender = topRatedFilms.slice(0, Math.min(topRatedFilmsCount, EXTRA_LIST_FILMS_COUNT));

    if (filmsToRender[0].filmInfo.totalRating !== 0) {
      render(this._mainComponent, this._topRatedFilmsComponent);
      this._topRatedFilmsContainer = this._topRatedFilmsComponent.getElement().querySelector(`#${FilmContainerType.TOP_RATED}`);

      this._renderFilms(this._topRatedFilmsContainer, filmsToRender);
    }
  }

  _renderMostCommentedFilmsList() {
    const mostCommentedFilms = this._filmsModel
      .get()
      .slice()
      .sort(sortFilmsByCommentsCount);

    const mostCommentedFilmsCount = mostCommentedFilms.length;
    const filmsToRender = mostCommentedFilms.slice(0, Math.min(mostCommentedFilmsCount, EXTRA_LIST_FILMS_COUNT));

    if (filmsToRender[0].comments.length !== 0) {
      render(this._mainComponent, this._mostCommentedFilmsComponent);
      this._mostCommentedFilmsContainer = this._mostCommentedFilmsComponent.getElement().querySelector(`#${FilmContainerType.MOST_COMMENTED}`);

      this._renderFilms(this._mostCommentedFilmsContainer, filmsToRender);
    }
  }

  _renderContent() {
    if (this._isLoading) {
      this._renderLoading();

      return;
    }

    this._filterModel.addObserver(this._handleModelEvent);

    this._renderAllFilmsBoard();
    this._renderTopRatedFilmsList();
    this._renderMostCommentedFilmsList();
  }

  _clearAllFilmsBoard({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    Object
      .values(this._filmPresenterStorage.allfilmPresenterStorage)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenterStorage.allfilmPresenterStorage = {};

    remove(this._sortMenuComponent);
    remove(this._noFilmsListComponent);
    remove(this._showMoreButtonComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILMS_RENDER_STEP;

      return;
    }

    const filmsCount = this._getFilms().length;

    if (filmsCount > this._renderedFilmsCount &&
        filmsCount <= FILMS_RENDER_STEP*(Math.ceil(this._renderedFilmsCount/FILMS_RENDER_STEP)) ||
        this._renderedFilmsCount === 0) {
      this._renderedFilmsCount = filmsCount;
    } else {
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }
  }

  _clearMostCommentedFilmsList() {
    Object
      .values(this._filmPresenterStorage.mostCommentedfilmPresenterStorage)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenterStorage.mostCommentedfilmPresenterStorage = {};
  }

  _updateAllFilmsList(data) {
    if (data.id in this._filmPresenterStorage.allfilmPresenterStorage) {
      this._filmPresenterStorage.allfilmPresenterStorage[data.id].init(data);
    }
  }

  _updateTopRatedFilmsList(data) {
    if (data.id in this._filmPresenterStorage.topRatedfilmPresenterStorage) {
      this._filmPresenterStorage.topRatedfilmPresenterStorage[data.id].init(data);
    }
  }

  _updateMostCommentedFilmsList(data) {
    if (data.id in this._filmPresenterStorage.mostCommentedfilmPresenterStorage) {
      this._filmPresenterStorage.mostCommentedfilmPresenterStorage[data.id].init(data);
    }
  }

  _createPopup(film) {
    this._popupPresenter.init(film);
    this._api.getComments(film.id)
      .then((comments) => this._commentsModel.set(UpdateType.INIT, comments))
      .catch(() => this._commentsModel.set(UpdateType.LOADING_ERROR, []));
  }

  _getFilms() {
    const activeFilterType = this._filterModel.getActive();
    const films = this._filmsModel.get();
    const filtredFilms = filterFilms(films, activeFilterType);

    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return filtredFilms.slice().sort(sortFilmsByDate);

      case SortType.BY_RATING:
        return filtredFilms.slice().sort(sortFilmsByRating);

      default:
        return filtredFilms;
    }
  }

  _handleSortTypeChange(sortType) {
    this._currentSortType = sortType;
    this._clearAllFilmsBoard({resetRenderedFilmsCount: true});
    this._renderAllFilmsBoard();
  }

  _handleShowMoreButtonClick() {
    const films = this._getFilms();
    const filmsCount = films.length;

    const newRenderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount + FILMS_RENDER_STEP);
    const filmsToRender = films.slice(this._renderedFilmsCount, newRenderedFilmsCount);

    this._renderFilms(this._allFilmsContainer, filmsToRender);
    this._renderedFilmsCount = newRenderedFilmsCount;

    if (this._renderedFilmsCount >= filmsCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_FILM:
        this._api.updateFilm(update).then((response) => {
          this._filmsModel.update(updateType, response);
        });
        break;

      case UserAction.ADD_COMMENT:
        this._api.addComment(update)
          .then((response) => {
            this._commentsModel.add(response.comments);
            this._filmsModel.update(updateType, response.movie);
          })
          .catch(() => this._popupPresenter.generateAddCommentErrorAction());
        break;

      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(update.commentId)
          .then(() => {
            this._commentsModel.delete(update.commentId);
            this._filmsModel.update(updateType, update.updatedFilm);
          })
          .catch(() => this._popupPresenter.generateDeletCommentErrorAction(update.commentId));
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.COMMENT_PATCH:
        this._updateAllFilmsList(data);
        this._updateTopRatedFilmsList(data);
        this._clearMostCommentedFilmsList();
        this._renderMostCommentedFilmsList();
        break;

      case UpdateType.MINOR:
        this._clearAllFilmsBoard();
        this._renderAllFilmsBoard();
        this._updateTopRatedFilmsList(data);
        this._updateMostCommentedFilmsList(data);
        break;

      case UpdateType.MAJOR:
        this._clearAllFilmsBoard({resetRenderedFilmsCount: true, resetSortType: true});
        this._renderAllFilmsBoard();
        this._updateTopRatedFilmsList(data);
        this._updateMostCommentedFilmsList(data);
        break;

      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderContent();
        break;

      case UpdateType.LOADING_ERROR:
        this._isLoading = false;
        this._renderLoadingErrorMessage();
        break;
    }
  }
}
