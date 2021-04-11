import {getAllArrayValuesList, getDateYearValue, getFilmDuration, createElement} from '../util.js';

const DESCRIPTION_SYMBOL_LIMIT = 140;

const createControlClassName = (isActive) => isActive ? 'film-card__controls-item--active' : '';

const createFilmCardTemplate = (film) => {
  const {comments} = film;
  const {title, totalRating, release, runtime, genre, poster, description} = film.filmInfo;
  const {watchlist, alreadyWatched, favorite} = film.userDetails;

  const filmDescription = description.length > DESCRIPTION_SYMBOL_LIMIT
    ? description.slice(0, DESCRIPTION_SYMBOL_LIMIT - 1)  + '…'
    : description;

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${getDateYearValue(release.date)}</span>
      <span class="film-card__duration">${getFilmDuration(runtime)}</span>
      <span class="film-card__genre">${getAllArrayValuesList(genre)}</span>
    </p>
    <img src="./images/posters/${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">${filmDescription}</p>
    <a class="film-card__comments">${comments.length} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${createControlClassName(watchlist)}" type="button">Add to watchlist</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${createControlClassName(alreadyWatched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${createControlClassName(favorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard {
  constructor(film) {
    this._film = film;
    this._element = null;
  }

  getTemplate() {
    return createFilmCardTemplate(this._film);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this.element = null;
  }
}
