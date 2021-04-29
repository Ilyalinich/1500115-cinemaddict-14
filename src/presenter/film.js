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
    this._onDocumentKeydown = this._onDocumentKeydown.bind(this);
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

      const prevPopupCommentState = prevPopupComponent.getNewComment();

      const prevPopupScrollPosition = prevPopupComponent.getScrollPosition();
      replace(this._popupComponent, prevPopupComponent);
      this._popupComponent.setScrollPosition(prevPopupScrollPosition);

      this._popupComponent.updateState(prevPopupCommentState);
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

  _renderPopup() {
    this._popupComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);
    render(this._popupContainer, this._popupComponent);
    this._mode = Mode.POPUP;
    document.addEventListener('keydown', this._onDocumentKeydown);
  }

  _removePopup() {
    this._popupContainer.removeChild(this._popupComponent.getElement());
    this._mode = Mode.CARD;
    document.removeEventListener('keydown', this._onDocumentKeydown);
  }

  _handleTriggerClick() {
    this._changeMode();
    this._renderPopup();

    if (!this._popupContainer.classList.contains('hide-overflow')) {
      this._popupContainer.classList.add('hide-overflow');
    }
  }

  _handleWatchlistClick() {
    const update = Object.assign(
      {},
      this._film.userDetails,
      {watchlist: !this._film.userDetails.watchlist},
    );

    const updatedFilm = Object.assign(
      {},
      this._film,
      {
        userDetails: update,
      },
    );

    this._changeData(updatedFilm);
  }

  _handleWatchedClick() {
    const update = Object.assign(
      {},
      this._film.userDetails,
      {alreadyWatched: !this._film.userDetails.alreadyWatched},
    );

    const updatedFilm = Object.assign(
      {},
      this._film,
      {
        userDetails: update,
      },
    );

    this._changeData(updatedFilm);
  }

  _handleFavoritesClick() {
    const update = Object.assign(
      {},
      this._film.userDetails,
      {favorite: !this._film.userDetails.favorite},
    );

    const updatedFilm = Object.assign(
      {},
      this._film,
      {
        userDetails: update,
      },
    );

    this._changeData(updatedFilm);
  }

  _handleCloseButtonClick() {
    this._popupComponent.reset(this._film);
    this._removePopup();
    this._popupContainer.classList.remove('hide-overflow');
  }

  _onDocumentKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._popupComponent.reset(this._film);
      this._removePopup();
      this._popupContainer.classList.remove('hide-overflow');
    }

    if (evt.ctrlKey && evt.key === 'Enter') {
      evt.preventDefault();

      if (this._popupComponent.isNewCommentValid()) {
        this._popupComponent.getNewComment();
        // отправка коммента в модель
        return;
      }
      this._popupComponent.shakeCommentField();
    }
  }
}
