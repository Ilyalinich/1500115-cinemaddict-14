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
  const {comments, isEmojiCurrent, newCommentEmoji, isNewCommentText, newCommentText} = state;
  const {title,  alternativeTitle, totalRating, poster, ageRating,
    director, writers, actors, release, runtime, genre, description} = state.filmInfo;
  const {watchlist, alreadyWatched, favorite} = state.userDetails;

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
              ${isEmojiCurrent ? `<img src="images/emoji/${newCommentEmoji}.png" width="55" height="55" alt="emoji-${newCommentEmoji}">` : ''}
            </div>

            <label class="film-details__comment-label">
              <textarea
                class="film-details__comment-input"
                placeholder="Select reaction below and write comment here"
                name="comment"
              >${isNewCommentText ? newCommentText : ''}</textarea>
            </label>

            <div class="film-details__emoji-list">
              ${createPopupEmojiListTemplate(isEmojiCurrent, newCommentEmoji)}
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

    this._state = Popup.parseFilmToState(film);
    this._filmComments = filmComments;

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
    this._watchlistClickHandler = this._watchlistClickHandler.bind(this);
    this._watchedClickHandler = this._watchedClickHandler.bind(this);
    this._favoritesClickHandler = this._favoritesClickHandler.bind(this);
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._emojiChangeHandler = this._emojiChangeHandler.bind(this);
    this._newCommentTextInputHandler = this._newCommentTextInputHandler.bind(this);

    this._setInnerHandlers();
  }

  reset(film) {
    this.updateState(
      Popup.parseFilmToState(film),
    );
  }

  getTemplate() {
    return createPopupTemplate(this._state, this._filmComments);
  }

  restoreHandlers() {
    this._setInnerHandlers();

    this.setCloseButtonClickHandler(this._callback.closeButtonClick);
    this.setWatchlistClickHandler(this._callback.watchlistClick);
    this.setWatchedClickHandler(this._callback.watchedClick);
    this.setFavoritesClickHandler(this._callback.favoritesClick);
    this.setFormSubmitHandler(this._callback.formSubmit);
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelectorAll('input[name = comment-emoji]')
      .forEach((input) => input.addEventListener('click', this._emojiChangeHandler));
    this.getElement()
      .querySelector('textarea[name = comment]')
      .addEventListener('change', this._newCommentTextInputHandler);
  }

  _emojiChangeHandler(evt) {
    this.updateState({
      isEmojiCurrent: true,
      newCommentEmoji: evt.target.value,
    });
  }

  _newCommentTextInputHandler(evt) {
    evt.preventDefault();
    this.updateState({
      isNewCommentText: true,
      newCommentText: evt.target.value,
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

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(Popup.parseStateToNewComment(this._state));
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

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }


  static parseFilmToState(film) {
    return Object.assign(
      {},
      film,
      {
        isEmojiCurrent: false,
        newCommentEmoji: null,
        isNewCommentText: false,
        newCommentText: null,
      },
    );
  }

  static parseStateToFilm(state) {
    state = Object.assign({}, state);

    return state;
  }

  static parseStateToNewComment(state) {
    return  Object.assign(
      {},
      {
        id: state.id,
      },
      {
        comment: state.newCommentText,
        emotion: state.newCommentEmoji,
      },

      delete state.isEmojiCurrent,
      delete state.newCommentEmoji,
      delete state.isNewCommentText,
      delete state.newCommentText,
    );
  }
}
