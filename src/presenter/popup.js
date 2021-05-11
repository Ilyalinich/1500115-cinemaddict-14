import PopupView from '../view/popup/popup.js';
import {render, remove, replace} from '../util/render.js';
import {UserAction, UpdateType, UpdatedFieldType} from '../constant.js';


export default class Popup {
  constructor(popupContainer, commentsModel, changeData) {
    this._popupContainer = popupContainer;
    this._commentsModel = commentsModel;
    this._changeData = changeData;

    this._popupComponent = null;

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);

    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._onDocumentKeydown = this._onDocumentKeydown.bind(this);
  }

  init(film) {
    this._film = film;
    this._filmComments = this._commentsModel.get(film.comments);

    const prevPopupComponent = this._popupComponent;
    this._popupComponent = new PopupView(film, this._filmComments);

    this._popupComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._popupComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._popupComponent.setFavoritesClickHandler(this._handleFavoritesClick);
    this._popupComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);
    this._popupComponent.setDeleteButtonClickHandler(this._handleDeleteCommentClick);

    if (prevPopupComponent === null) {
      return this._renderPopup();
    }

    if (this._popupContainer.contains(prevPopupComponent.getElement())) {
      this._replacePopup(prevPopupComponent);
    }

    remove(prevPopupComponent);
  }

  updatePopup(updateType, data) {
    if (this._popupComponent === null || data.id !== this._film.id) {
      return;
    }

    if (updateType === UpdateType.COMMENT_PATCH) {
      const newComments = this._commentsModel.get(data.comments);
      this._popupComponent.updateComments(newComments);


      if (newComments.length > this._filmComments.length) {
        this._popupComponent.resetState(this._film);
      }
      this._filmComments = newComments;
    }

    this._film = data;
    this._popupComponent.updateState(data);
  }

  destroy() {
    remove(this._popupComponent);
  }

  _renderPopup() {
    render(this._popupContainer, this._popupComponent);

    document.addEventListener('keydown', this._onDocumentKeydown);
    this._popupContainer.classList.add('hide-overflow');
  }

  _replacePopup(prevPopupComponent) {
    const prevPopupScrollPosition = prevPopupComponent.getScrollPosition();
    replace(this._popupComponent, prevPopupComponent);
    this._popupComponent.setScrollPosition(prevPopupScrollPosition);
  }

  _removePopup() {
    remove(this._popupComponent);
    this._popupComponent = null;

    document.removeEventListener('keydown', this._onDocumentKeydown);
    this._popupContainer.classList.remove('hide-overflow');
  }

  _getUpdatedFilm(updatedField) {
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

  _sendUpdatedFilm(updatedFilm) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      updatedFilm,
    );
  }

  _sendComment() {
    const newComment = this._popupComponent.getNewComment();

    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.COMMENT_PATCH,
      newComment,
    );
  }

  _handleWatchlistClick() {
    const updatedFilm = this._getUpdatedFilm(UpdatedFieldType.WATCHLIST);
    this._sendUpdatedFilm(updatedFilm);
  }

  _handleWatchedClick() {
    const updatedFilm = this._getUpdatedFilm(UpdatedFieldType.ALREADY_WATCHED);
    this._sendUpdatedFilm(updatedFilm);
  }

  _handleFavoritesClick() {
    const updatedFilm = this._getUpdatedFilm(UpdatedFieldType.FAVORITE);
    this._sendUpdatedFilm(updatedFilm);
  }

  _handleDeleteCommentClick(commentId) {
    const deletedComment =
      {
        filmId: this._film.id,
        id: commentId,
      };

    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.COMMENT_PATCH,
      deletedComment,
    );
  }

  _handleCloseButtonClick() {
    this._removePopup();
  }

  _onDocumentKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removePopup();
    }

    if (evt.ctrlKey && evt.key === 'Enter') {
      evt.preventDefault();

      if (this._popupComponent.isNewCommentValid()) {
        return this._sendComment();
      }

      this._popupComponent.shakeCommentField();
    }
  }
}
