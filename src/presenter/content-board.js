import {render, remove, RenderPosition} from '../util/render.js';
import {filterFilms} from '../util/filter.js';
import {sortFilmsByDate, sortFilmsByRating, sortFilmsByCommentsCount} from '../util/film.js';
import {SortType, UpdateType, UserAction} from '../constant.js';
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
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._filmsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._contentBoardContainer, this._contentContainerComponent);

    this._renderContent();
  }

  _getFilms() {
    const activeFilterType = this._filterModel.getActiveFilter();
    const films = this._filmsModel.getFilms();
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
    const filmComments = this._commentsModel
      .getComments()
      .filter(({id}) => film.comments.includes(id));

    const filmPresenter = new FilmPresenter(filmsContainer, filmComments, this._popupContainer, this._handleViewAction, this._handleModeChange);
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
        // создать перечисление с названиями контейнеров для этого свича
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
      this._allFilmsContainer = this._allFilmsListComponent.getElement().querySelector('#all-films-container');
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
      .getFilms()
      .slice()
      .sort(sortFilmsByRating);
    // подумать можно ли тут использовать метод _getFilms
    const topRatedFilmsCount = topRatedFilms.length;
    const filmsToRender = topRatedFilms.slice(0, Math.min(topRatedFilmsCount, EXTRA_LIST_FILMS_COUNT));

    if (filmsToRender[0].filmInfo.totalRating !== 0) {
      render(this._contentContainerComponent, this._topRatedFilmsComponent);
      this._topRatedFilmsContainer = this._topRatedFilmsComponent.getElement().querySelector('#top-rated-films-container');

      this._renderFilms(this._topRatedFilmsContainer, filmsToRender);
    }
  }

  _renderMostCommentedFilmsList() {
    const mostCommentedFilms = this._filmsModel
      .getFilms()
      .slice()
      .sort(sortFilmsByCommentsCount);
    // подумать можно ли тут использовать метод _getFilms
    const mostCommentedFilmsCount = mostCommentedFilms.length;
    const filmsToRender = mostCommentedFilms.slice(0, Math.min(mostCommentedFilmsCount, EXTRA_LIST_FILMS_COUNT));

    if (filmsToRender[0].comments.length !== 0) {
      render(this._contentContainerComponent, this._mostCommentedFilmsComponent);
      this._mostCommentedFilmsContainer = this._mostCommentedFilmsComponent.getElement().querySelector('#most-commented-films-container');

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
    // почему в параметрах объект?
    Object
      .values(this._filmPresenterStorage.allfilmPresenterStorage)
      .forEach((presenter) => presenter.destroy());
    this._filmPresenterStorage.allfilmPresenterStorage = {};

    remove(this._sortMenuComponent);
    remove(this._showMoreButtonComponent);
    // remove(this._noFilmsListComponent); зачем тут это?

    if (resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILMS_RENDER_STEP;
    } else {
      const filmsCount = this._getFilms().length;
      this._renderedFilmsCount = Math.min(filmsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  // _clearTopRatedFilmsList() {
  //   Object
  //     .values(this._filmPresenterStorage.topRatedfilmPresenterStorage)
  //     .forEach((presenter) => presenter.destroy());
  //   this._filmPresenterStorage.topRatedfilmPresenterStorage = {};
  // }

  // _clearMostCommentedFilmsList() {
  //   Object
  //     .values(this._filmPresenterStorage.mostCommentedfilmPresenterStorage)
  //     .forEach((presenter) => presenter.destroy());
  //   this._filmPresenterStorage.mostCommentedfilmPresenterStorage = {};
  // }

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
        this._filmsModel.updateFilm(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._commentsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._commentsModel.deleteComment(updateType, update);
        break;
    // подумать о разделении этого метода на два (работа с данными фмильма и работа с комментариями)
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        Object
          .values(this._filmPresenterStorage)
          .forEach((storage) => {
            if (data.id in storage) {
              storage[data.id].init(data);
            }
          });
        break;
      case UpdateType.MINOR:
        // зачем при взаимодействии с фильмом мы каждый раз перерисовываем компонент сортировки
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
        // - обновить всю доску (например, при переключении фильтра)
        break;
    }
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
    this._currentSortType = sortType;
    this._clearAllFilmsBoard({resetRenderedFilmsCount: true});
    this._renderAllFilmsBoard();
  }
}
