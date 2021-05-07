import FilmCardView from '../view/film-card.js';
import {render, remove, replace} from '../util/render.js';
import {UserAction, UpdateType, UpdatedFieldType} from '../constant.js';


export default class Film {
  constructor(filmsContainer, changeData, createPopup) {
    this._filmsContainer = filmsContainer;
    this._changeData = changeData;
    this._createPopup = createPopup;

    this._filmComponent = null;

    this._handleTriggerClick = this._handleTriggerClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    this._filmComponent = new FilmCardView(film);

    this._filmComponent.setPopupRenderTriggerClickHandler(this._handleTriggerClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoritesClickHandler(this._handleFavoritesClick);


    if (prevFilmComponent === null) {
      return render(this._filmsContainer, this._filmComponent);
    }

    if (this._filmsContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    remove(prevFilmComponent);
  }

  destroy() {
    remove(this._filmComponent);
  }

  _createUpdate(updatedField) {
    const updatedPart = Object.assign(
      {},
      this._film.userDetails,
      {[updatedField]: !this._film.userDetails[updatedField]},
    );

    return Object.assign(
      {},
      this._film,
      {
        userDetails: updatedPart,
      },
    );
  }

  _sendFilmUpdate(update) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      update);
  }

  _handleWatchlistClick() {
    const update = this._createUpdate(UpdatedFieldType.WATCHLIST);
    this._sendFilmUpdate(update);
  }

  _handleWatchedClick() {
    const update = this._createUpdate(UpdatedFieldType.ALREADY_WATCHED);
    this._sendFilmUpdate(update);
  }

  _handleFavoritesClick() {
    const update = this._createUpdate(UpdatedFieldType.FAVORITE);
    this._sendFilmUpdate(update);
  }

  _handleTriggerClick() {
    this._createPopup(this._film);
  }
}
