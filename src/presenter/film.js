import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup/popup.js';
import {render, remove, replace} from '../util/render.js';

const Mode = {
  CARD: 'CARD',
  POPUP: 'POPUP',
};

export default class Film {
  constructor(filmsContainer, filmComments, popupContainer, changeData, changeMode) {
    this._filmsContainer = filmsContainer;
    this._filmComments = filmComments;
    this._popupContainer = popupContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._filmComponent = null;
    this._popupComponent = null;
    this._mode = Mode.CARD;

    this._handleTriggerClick = this._handleTriggerClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);

    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._onDocumentEscKeydown = this._onDocumentEscKeydown.bind(this);
  }

  init(film) {
    this._film = film;

    const prevFilmComponent = this._filmComponent;
    const prevPopupComponent = this._popupComponent;

    this._filmComponent = new FilmCardView(film);
    this._popupComponent = new PopupView(film, this._filmComments);

    this._filmComponent.setPopupRenderTriggerClickHandler(this._handleTriggerClick);
    this._filmComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._filmComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._filmComponent.setFavoritesClickHandler(this._handleFavoritesClick);

    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoritesClickHandler(this._handleFavoritesClick);


    if (prevFilmComponent === null || prevPopupComponent === null) {
      return render(this._filmsContainer, this._filmComponent);
    }

    if (this._filmsContainer.contains(prevFilmComponent.getElement())) {
      replace(this._filmComponent, prevFilmComponent);
    }

    if (this._popupContainer.contains(prevPopupComponent.getElement())) {
      this._popupComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);
      replace(this._popupComponent, prevPopupComponent);
    }

    remove(prevFilmComponent);
    remove(prevPopupComponent);
  }

  destroy() {
    remove(this._filmComponent);
    remove(this._popupComponent);
  }

  resetView() {
    if (this._mode !== Mode.CARD) {
      this._removePopup();
    }
  }

  _handleTriggerClick() {
    this._changeMode();
    this._renderPopup();

    if (!this._popupContainer.classList.contains('hide-overflow')) {
      this._popupContainer.classList.add('hide-overflow');
    }
  }

  _handleWatchlistClick() {
    const updatedFilm = JSON.parse(JSON.stringify(this._film));
    updatedFilm.userDetails.watchlist = !this._film.userDetails.watchlist;

    this._changeData(updatedFilm);
  }

  _handleWatchedClick() {
    const updatedFilm = JSON.parse(JSON.stringify(this._film));
    updatedFilm.userDetails.alreadyWatched = !this._film.userDetails.alreadyWatched;

    this._changeData(updatedFilm);
  }

  _handleFavoritesClick() {
    const updatedFilm = JSON.parse(JSON.stringify(this._film));
    updatedFilm.userDetails.favorite = !this._film.userDetails.favorite;

    this._changeData(updatedFilm);
  }

  _handleCloseButtonClick() {
    this._removePopup();
    this._popupContainer.classList.remove('hide-overflow');
  }

  _renderPopup() {
    this._popupComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);
    render(this._popupContainer, this._popupComponent);
    this._mode = Mode.POPUP;
    document.addEventListener('keydown', this._onDocumentEscKeydown);
  }

  _removePopup() {
    this._popupContainer.removeChild(this._popupComponent.getElement());
    // remove(this._popupComponent); вопрос!!!!!!!!!
    this._mode = Mode.CARD;
    document.removeEventListener('keydown', this._onDocumentEscKeydown);
  }

  _onDocumentEscKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removePopup();
      this._popupContainer.classList.remove('hide-overflow');
    }
  }
}
