import {UserAction, UpdateType, UpdatedFieldType} from '../constant.js';
import {isOnline} from '../util/common.js';
import {toast} from '../util/toast.js';
import {render, remove, replace, RenderPosition} from '../util/render.js';
import {getDate} from '../util/day.js';
import {shake} from '../util/animation.js';
import PopupView from '../view/popup/popup.js';
import LoadingView from '../view/loading.js';
import LoadingErrorView from '../view/loading-error.js';
import CommentsCounterView from '../view/popup/comments-counter.js';
import CommentsListView from '../view/popup/comments-list.js';
import ControlsView from '../view/popup/popup-controls.js';
import CommentCreationFielView from '../view/popup/comment-creation-field.js';


export default class Popup {
  constructor(mainComponentContainer, filmsModel, commentsModel, changeData) {
    this._mainComponentContainer = mainComponentContainer;
    this._filmsModel = filmsModel;
    this._commentsModel = commentsModel;
    this._changeData = changeData;

    this._mainComponent = null;
    this._commentsCounterComponent = null;
    this._commentsListComponent = null;
    this._loadingErrorMessageComponent = null;


    this._mainComponentHandleModelEvent = this._mainComponentHandleModelEvent.bind(this);


    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleWatchedClick = this._handleWatchedClick.bind(this);
    this._handleFavoritesClick = this._handleFavoritesClick.bind(this);

    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleCloseButtonClick = this._handleCloseButtonClick.bind(this);
    this._handleDocumentKeydown = this._handleDocumentKeydown.bind(this);

    this._commentsModel.addObserver(this._mainComponentHandleModelEvent);
  }

  init(film) {
    this._film = film;

    const prevMainComponent = this._mainComponent;

    this._mainComponent = new PopupView(this._film.filmInfo);
    this._mainComponent.setCloseButtonClickHandler(this._handleCloseButtonClick);

    this._loadingComponent = new LoadingView();


    this._controlsContainer = this._mainComponent
      .getElement()
      .querySelector('.film-details__top-container');

    this._commentsBoardContainer = this._mainComponent
      .getElement()
      .querySelector('.film-details__comments-wrap');


    if (prevMainComponent === null) {
      this._renderMainComponent();
      this._renderControls(this._film.userDetails);
      this._renderLoading();

      return;
    }

    if (this._mainComponentContainer.contains(prevMainComponent.getElement())) {
      replace(this._mainComponent, prevMainComponent);
      this._renderControls(this._film.userDetails);
      this._renderLoading();
    }

    remove(prevMainComponent);
  }

  generateDeletCommentErrorAction(deletingCommentId) {
    this._commentsListComponent.enable(deletingCommentId);
    shake(this._commentsListComponent.get(deletingCommentId));
  }

  generateAddCommentErrorAction() {
    this._commentsCreationFieldComponent.enable();
    shake(this._commentsCreationFieldComponent);
  }

  _renderMainComponent() {
    render(this._mainComponentContainer, this._mainComponent);

    document.addEventListener('keydown', this._handleDocumentKeydown);
    this._mainComponentContainer.classList.add('hide-overflow');

    this._filmsModel.addObserver(this._mainComponentHandleModelEvent);
  }

  _removeMainComponent() {
    remove(this._mainComponent);
    this._mainComponent = null;

    document.removeEventListener('keydown', this._handleDocumentKeydown);
    this._mainComponentContainer.classList.remove('hide-overflow');

    this._filmsModel.removeObserver(this._mainComponentHandleModelEvent);
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

    this._commentsCounterComponent = new CommentsCounterView(comments.length);

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

  _sendComment() {
    this._changeData(
      UserAction.ADD_COMMENT,
      UpdateType.COMMENT_PATCH,
      {
        filmId: this._film.id,
        newComment: this._commentsCreationFieldComponent.get(),
      },
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

  _handleDeleteCommentClick(commentId) {
    if (!isOnline()) {
      toast('You can\'t delete comment offline');

      return;
    }

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
    this._removeMainComponent();
  }

  _handleDocumentKeydown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._removeMainComponent();

      return;
    }

    if (evt.ctrlKey && evt.key === 'Enter') {
      evt.preventDefault();

      if (!isOnline()) {
        toast('You can\'t add new comment offline');

        return;
      }

      if (this._commentsCreationFieldComponent.isValidState()) {
        this._sendComment();

        return;
      }

      shake(this._commentsCreationFieldComponent);
    }
  }

  _mainComponentHandleModelEvent(updateType, data) {
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
