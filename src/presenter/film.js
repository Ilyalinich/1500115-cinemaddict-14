import {UserAction, UpdateType, UpdatedFieldType} from '../constant.js';
import {render, remove, replace} from '../util/render.js';
import {getDate} from '../util/day.js';
import FilmCardView from '../view/film-card.js';


export default class Film {
  constructor(mainComponentContainer, changeData, createPopup) {
    this._mainComponentContainer = mainComponentContainer;
    this._changeData = changeData;
    this._createPopup = createPopup;

    this._mainComponent = null;

    this._handleTriggerClick = this._handleTriggerClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);
  }

  init(film) {
    this._film = film;

    const prevMainComponent = this._mainComponent;
    this._mainComponent = new FilmCardView(film);

    this._mainComponent.setPopupRenderTriggerClickHandler(this._handleTriggerClick);
    this._mainComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._mainComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._mainComponent.setFavoritesClickHandler(this._handleFavoritesClick);


    if (prevMainComponent === null) {
      return render(this._mainComponentContainer, this._mainComponent);
    }

    if (this._mainComponentContainer.contains(prevMainComponent.getElement())) {
      replace(this._mainComponent, prevMainComponent);
    }

    remove(prevMainComponent);
  }

  destroy() {
    remove(this._mainComponent);
  }

  _getUpdate(updatedField) {
    const updatedPart = Object.assign(
      {},
      this._film.userDetails,
      {[updatedField]: !this._film.userDetails[updatedField]},
    );

    if (updatedField === UpdatedFieldType.ALREADY_WATCHED) {

      updatedPart.watchingDate = updatedPart.alreadyWatched ? getDate() : null;
    }

    return Object.assign(
      {},
      this._film,
      {
        userDetails: updatedPart,
      },
    );
  }

  _sendUpdate(update) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      update,
    );
  }

  _handleWatchlistClick() {
    const update = this._getUpdate(UpdatedFieldType.WATCHLIST);
    this._sendUpdate(update);
  }

  _handleWatchedClick() {
    const update = this._getUpdate(UpdatedFieldType.ALREADY_WATCHED);
    this._sendUpdate(update);
  }

  _handleFavoritesClick() {
    const update = this._getUpdate(UpdatedFieldType.FAVORITE);
    this._sendUpdate(update);
  }

  _handleTriggerClick() {
    this._createPopup(this._film);
  }
}
