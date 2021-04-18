import FilmCardView from '../view/film-card.js';
import PopupView from '../view/popup/popup.js';
import {render, remove} from '../util/render.js';

export default class Film {
  constructor(filmsContainer, popupContainer) {
    this._filmsContainer = filmsContainer;
    this._popupContainer = popupContainer;

    this._filmComponent = null;
    this._popupComponent = null;

    this._handleTriggerClick = this._handleTriggerClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._onDocumentEscKeydown = this._onDocumentEscKeydown.bind(this);
  }

  init(film, filmComments) {
    this._film = film;
    this._filmComments = filmComments;

    this._filmComponent = new FilmCardView(film);
    // this._popupComponent = new PopupView(film, filmComments);

    this._filmComponent.setPopupRenderTriggerClickHandler(this._handleTriggerClick);
    // this._popupComponent.setCloseButtonClickHandler(this._handleCloseButtonClick());
    render(this._filmsContainer, this._filmComponent);
  }

  _handleTriggerClick() {
    this._renderPopup();
    document.addEventListener('keydown', this._onDocumentEscKeydown);
  }

  _handleCloseButtonClick() {
    this._removePopup();
    document.removeEventListener('keydown', this._onDocumentEscKeydown);
  }

  _renderPopup() {
    this._popupComponent = new PopupView(this._film, this._filmComments);
    this._popupContainer.classList.add('hide-overflow');
    this._popupComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);
    render(this._popupContainer, this._popupComponent);
  }

  _removePopup() {
    this._popupContainer.classList.remove('hide-overflow');
    remove(this._popupComponent);
  }

  _onDocumentEscKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removePopup();
      document.removeEventListener('keydown', this._onDocumentEscKeydown);
    }
  }
}
