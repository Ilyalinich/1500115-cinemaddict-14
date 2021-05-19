import {getDate} from '../util/day.js';
import {render, remove, replace, RenderPosition} from '../util/render.js';
import {shake} from '../util/animation.js';
import {UserAction, UpdateType, UpdatedFieldType} from '../constant.js';
import PopupView from '../view/popup/popup.js';
import LoadingView from '../view/loading.js';
import LoadingErrorView from '../view/loading-error.js';
import CommentsCounterView from '../view/popup/comments-counter.js';
import CommentsListView from '../view/popup/comments-list.js';
import ControlsView from '../view/popup/popup-controls.js';
import CommentCreationFielView from '../view/popup/comment-creation-field.js';


export default class Popup {
  constructor(popupContainer, filmsModel, commentsModel, changeData) {
    this._popupContainer = popupContainer;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._changeData = changeData;

    this._popupComponent = null;
    this._commentsCounterComponent = null;
    this._commentsListComponent = null;
    this._loadingErrorMessageComponent = null;


    this._popupHandleModelEvent = this._popupHandleModelEvent.bind(this);

    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);

    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleDocumentKeydown = this._handleDocumentKeydown.bind(this);

    this._commentsModel.addObserver(this._popupHandleModelEvent);
  }

  init(film) {
    this._film = film;

    const prevPopupComponent = this._popupComponent;

    this._popupComponent = new PopupView(this._film.filmInfo);
    this._popupComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);

    this._loadingComponent = new LoadingView();


    this._controlsContainer = this._popupComponent
      .getElement()
      .querySelector('.film-details__top-container');

    this._commentsBoardContainer = this._popupComponent
      .getElement()
      .querySelector('.film-details__comments-wrap');


    if (prevPopupComponent === null) {
      this._renderPopup();
      this._renderControls(this._film.userDetails);
      this._renderLoading();

      return;
    }

    if (this._popupContainer.contains(prevPopupComponent.getElement())) {
      replace(this._popupComponent, prevPopupComponent);
      this._renderControls(this._film.userDetails);
      this._renderLoading();
    }

    remove(prevPopupComponent);
  }

  generateDeletCommentErrorAction(deletingCommentId) {
    this._commentsListComponent.enable(deletingCommentId);
    shake(this._commentsListComponent.getComment(deletingCommentId));
  }

  generateAddCommentErrorAction() {
    this._commentsCreationFieldComponent.enable();
    shake(this._commentsCreationFieldComponent);
  }

  _renderPopup() {
    render(this._popupContainer, this._popupComponent);

    document.addEventListener('keydown', this._handleDocumentKeydown);
    this._popupContainer.classList.add('hide-overflow');

    this._filmsModel.addObserver(this._popupHandleModelEvent);
  }

  _removePopup() {
    remove(this._popupComponent);
    this._popupComponent = null;

    document.removeEventListener('keydown', this._handleDocumentKeydown);
    this._popupContainer.classList.remove('hide-overflow');

    this._filmsModel.removeObserver(this._popupHandleModelEvent);
  }

  _renderControls(userDetails) {
    if (this._controlsComponent !== null) {
      this._controlsComponent = null;
    }

    this._controlsComponent = new ControlsView(userDetails);

    this._controlsComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._controlsComponent.setWatchedClickHandler(this._handleWatchedClick);
    this._controlsComponent.setFavoritesClickHandler(this._handleFavoritesClick);

    render(this._controlsContainer, this._controlsComponent);
  }

  _renderLoading() {
    render(this._commentsBoardContainer, this._loadingComponent);
  }

  _renderLoadingErrorMessage() {
    remove(this._loadingComponent);

    this._loadingErrorMessageComponent = new LoadingErrorView();
    render(this._commentsBoardContainer, this._loadingErrorMessageComponent);
  }

  _renderCommentsCounter(comments) {
    if (this._commentsCounterComponent !== null) {
      this._commentsCounterComponent = null;
    }

    this._commentsCounterComponent = new CommentsCounterView(comments);

    render(this._commentsBoardContainer, this._commentsCounterComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCommentsList(comments) {
    if (this._commentsListComponent !== null) {
      this._commentsListComponent = null;
    }

    this._commentsListComponent = new CommentsListView(comments);
    this._commentsListComponent.setDeleteButtonClickHandler(this._handleDeleteCommentClick);

    render(this._commentsCounterComponent, this._commentsListComponent, RenderPosition.AFTER);
  }

  _renderCommentCreationField() {
    this._commentsCreationFieldComponent = new CommentCreationFielView();

    render(this._commentsBoardContainer, this._commentsCreationFieldComponent);
  }

  _getUpdatedFilm(updatedField) {
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

  _sendUpdatedFilm(updatedFilm) {
    this._changeData(
      UserAction.UPDATE_FILM,
      UpdateType.MINOR,
      updatedFilm,
    );
  }

  _sendComment() {
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.COMMENT_PATCH,
      {
        filmId: this._film.id,
        newComment: this._commentsCreationFieldComponent.getNewComment(),
      },
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
    const updatedFilm = Object.assign(
      {},
      this._film,
      {
        comments: this._film.comments.filter((Id) => Id !== commentId),
      },
    );

    this._changeData(
      UserAction.DELETE_COMMENT,
      UpdateType.COMMENT_PATCH,
      {commentId, updatedFilm},
    );
  }

  _handleCloseButtonClick() {
    this._removePopup();
  }

  _handleDocumentKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removePopup();

      return;
    }

    if (evt.ctrlKey && evt.key === 'Enter') {
      evt.preventDefault();

      if (this._commentsCreationFieldComponent.isNewCommentValid()) {
        this._sendComment();

        return;
      }

      shake(this._commentsCreationFieldComponent);
    }
  }

  _popupHandleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.MINOR:
        if (this._film.id !== data.id) {
          return;
        }

        remove(this._controlsComponent);
        this._renderControls(data.userDetails);

        this._film.userDetails = Object.assign(
          {},
          data.userDetails,
        );
        break;

      case UpdateType.COMMENT_PATCH:
        if (this._commentsModel.get().length > this._film.comments.length) {
          this._commentsCreationFieldComponent.resetState();
        }

        remove(this._loadingErrorMessageComponent);
        remove(this._commentsCounterComponent);
        remove(this._commentsListComponent);

        this._renderCommentsCounter(this._commentsModel.get());
        this._renderCommentsList(this._commentsModel.get());
        this._film.comments = data.comments.slice();
        break;

      case UpdateType.INIT:
        remove(this._loadingComponent);

        this._renderCommentsCounter(this._commentsModel.get());
        this._renderCommentsList(this._commentsModel.get());
        this._renderCommentCreationField();
        break;

      case UpdateType.LOADING_ERROR:
        this._renderLoadingErrorMessage();
        this._renderCommentCreationField();
        break;
    }
  }
}
