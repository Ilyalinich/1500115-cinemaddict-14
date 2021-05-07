import {nanoid} from 'nanoid';
import he from 'he';
import {ID_LENGTH} from '../../constant.js';
import {getAllArrayValuesList} from '../../util/common.js';
import {formatDate} from '../../util/day.js';
import {getFilmDuration} from '../../util/film.js';
import {createPopupGenresTemplate} from './popup-genres-list.js';
import {createPopupEmojiListTemplate} from './popup-emoji-list.js';
import {createPopupCommentsTemplate} from './popup-comments-list.js';
import SmartView from '../smart.js';


const FORMAT_TEMPLATE = 'DD MMMM YYYY';


const createControlStatus = (isActive) => isActive ? 'checked' : '';

const createPopupTemplate = (state, filmComments) => {
  const {comments, emotion, comment, filmInfo, userDetails} = state;
  const {title,  alternativeTitle, totalRating, poster, ageRating,
    director, writers, actors, release, runtime, genre, description} = filmInfo;
  const {watchlist, alreadyWatched, favorite} = userDetails;

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="./images/posters/${poster}" alt="">

            <p class="film-details__age">${ageRating}+</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${getAllArrayValuesList(writers)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${getAllArrayValuesList(actors)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${formatDate(release.date, FORMAT_TEMPLATE)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${getFilmDuration(runtime)}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${release.releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                ${createPopupGenresTemplate(genre)}
              </tr>
            </table>

            <p class="film-details__film-description">${description}</p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${createControlStatus(watchlist)}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${createControlStatus(alreadyWatched)}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${createControlStatus(favorite)}>
          <label for="favorite" class="film-details__control-label film-details__control-label--favorite">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${comments.length}</span></h3>

          <ul class="film-details__comments-list">
            ${createPopupCommentsTemplate(filmComments)}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">
              ${!emotion ? '' : `<img src="images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">`}
            </div>

            <label class="film-details__comment-label">
              <textarea
                class="film-details__comment-input"
                placeholder="Select reaction below and write comment here"
                name="comment"
              >${!comment ? '' : he.encode(comment)}</textarea>
            </label>

            <div class="film-details__emoji-list">
              ${createPopupEmojiListTemplate(emotion)}
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};


export default class Popup extends SmartView {
  constructor(film, filmComments) {
    super();

    this._state = this._parseFilmToState(film);
    this._filmComments = filmComments;

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoritesClickHandler = this._favoritesClickHandler.bind(this);
    this._emotionChangeHandler = this._emotionChangeHandler.bind(this);
    this._newCommentTextInputHandler = this._newCommentTextInputHandler.bind(this);
    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);

    this._setInnerHandlers();
  }


  getTemplate() {
    return createPopupTemplate(this._state, this._filmComments);
  }

  updateComments(newComments) {
    this._filmComments = newComments;
  }

  resetState(film) {
    this.updateState(
      this._parseFilmToState(film),
      true,
    );
  }

  isNewCommentValid() {
    const {emotion, comment} = this._state;

    return emotion && comment;
  }

  getNewComment() {
    const {id, emotion, comment} = this._state;

    return {
      filmId: id,
      id: nanoid(ID_LENGTH),
      emotion,
      comment,
    };
  }

  shakeCommentField() {
  // метод, накладывающий эффект 'покачивание головой"
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoritesClickHandler(this._callback.favoritesClick);
    this.setDeleteButtonClickHandler(this._callback.deleteButtonClick);
  }

  _parseFilmToState(film) {
    return Object.assign(
      {},
      film,
      {
        emotion: null,
        comment: null,
      },
    );
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll('input[name = comment-emoji]')
      .forEach((input) => input.addEventListener('click', this._emotionChangeHandler));
    this.getElement()
      .querySelector('textarea[name = comment]')
      .addEventListener('input', this._newCommentTextInputHandler);
  }

  _emotionChangeHandler(evt) {
    this.updateState({
      emotion: evt.target.value,
    });
  }

  _newCommentTextInputHandler(evt) {
    evt.preventDefault();
    this.updateState({
      comment: evt.target.value,
    }, true);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }

  _watchlistClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchlistClick();
  }

  _watchedClickHandler(evt) {
    evt.preventDefault();
    this._callback.watchedClick();
  }

  _favoritesClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoritesClick();
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteButtonClick(evt.target.dataset.commentId);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closeButtonClickHandler);
  }

  setWatchlistClickHandler(callback) {
    this._callback.watchlistClick = callback;
    this.getElement()
      .querySelector('#watchlist')
      .addEventListener('click', this._watchlistClickHandler);
  }

  setWatchedClickHandler(callback) {
    this._callback.watchedClick = callback;
    this.getElement()
      .querySelector('#watched')
      .addEventListener('click', this._watchedClickHandler);
  }

  setFavoritesClickHandler(callback) {
    this._callback.favoritesClick = callback;
    this.getElement()
      .querySelector('#favorite')
      .addEventListener('click', this._favoritesClickHandler);
  }

  setDeleteButtonClickHandler(callback) {
    this._callback.deleteButtonClick = callback;
    this.getElement()
      .querySelectorAll('.film-details__comment-delete')
      .forEach((button) => button.addEventListener('click', this._deleteButtonClickHandler));
  }
}
