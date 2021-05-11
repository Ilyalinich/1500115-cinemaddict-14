import {render, remove, RenderPosition} from '../util/render.js';
import {filterFilms} from '../util/filter.js';
import {sortFilmsByDate, sortFilmsByRating, sortFilmsByCommentsCount} from '../util/sort.js';
import {SortType, UpdateType, UserAction, FilmContainerType} from '../constant.js';
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
  constructor(contentBoardContainer, popupContainer, filmsModel, commentsModel, filterModel) {
    this._contentBoardContainer = contentBoardContainer;
    this._popupContainer = popupContainer;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._filterModel = filterModel;

    this._renderedFilmsCount = FILMS_RENDER_STEP;
    this._currentSortType = SortType.DEFAULT;

    this._sortMenuComponent = null;
    this._showMoreButtonComponent = null;
    this._allFilmsListComponent = null;

    this._contentContainerComponent = new ContentContainerView();
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
    this._filterModel.addObserver(this._handleModelEvent);

    this._popupPresenter = new PopupPresenter(this._popupContainer, this._commentsModel, this._handleViewAction);
  }

  init() {
    render(this._contentBoardContainer, this._contentContainerComponent);

    this._renderContent();
  }

  _createPopup(film) {
    this._popupPresenter.init(film);
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

  _renderNoFilmsList() {
    render(this._contentContainerComponent, this._noFilmsListComponent);
  }

  _renderSortMenu() {
    if (this._sortMenuComponent !== null) {
      this._sortMenuComponent = null;
    }

    this._sortMenuComponent = new SortMenuView(this._currentSortType);
    this._sortMenuComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._contentContainerComponent, this._sortMenuComponent, RenderPosition.BEFORE);
  }

  _renderAllFilmsList() {
    if (this._allFilmsListComponent === null) {
      this._allFilmsListComponent = new AllFilmsListView();

      render(this._contentContainerComponent, this._allFilmsListComponent, RenderPosition.AFTERBEGIN);
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

  _renderAllFilmsBoard() {
    this._renderSortMenu();
    this._renderAllFilmsList();
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setButtonClickHandler(this._handleShowMoreButtonClick);

    render(this._allFilmsListComponent, this._showMoreButtonComponent);
  }

  _renderTopRatedFilmsList() {
    const topRatedFilms = this._filmsModel
      .get()
      .slice()
      .sort(sortFilmsByRating);

    const topRatedFilmsCount = topRatedFilms.length;
    const filmsToRender = topRatedFilms.slice(0, Math.min(topRatedFilmsCount, EXTRA_LIST_FILMS_COUNT));

    if (filmsToRender[0].filmInfo.totalRating !== 0) {
      render(this._contentContainerComponent, this._topRatedFilmsComponent);
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
      render(this._contentContainerComponent, this._mostCommentedFilmsComponent);
      this._mostCommentedFilmsContainer = this._mostCommentedFilmsComponent.getElement().querySelector(`#${FilmContainerType.MOST_COMMENTED}`);

      this._renderFilms(this._mostCommentedFilmsContainer, filmsToRender);
    }
  }

  _renderContent() {
    if (this._getFilms().length === 0) {
      return this._renderNoFilmsList();
    }

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

  _clearMostCommentedFilmsList() {
    Object
      .values(this._filmPresenterStorage.mostCommentedfilmPresenterStorage)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenterStorage.mostCommentedfilmPresenterStorage = {};
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
        this._filmsModel.update(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.add(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.delete(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH: /*этот тип обновления в данный момент не используется, удалить, если не понадобится*/
        this._updateAllFilmsList(data);
        this._updateTopRatedFilmsList(data);
        this._updateMostCommentedFilmsList(data);
        break;

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
    }

    this._popupPresenter.updatePopup(updateType, data);
  }

  _handleSortTypeChange(sortType) {
    this._currentSortType = sortType;
    this._clearAllFilmsBoard({resetRenderedFilmsCount: true});
    this._renderAllFilmsBoard();
  }
}
