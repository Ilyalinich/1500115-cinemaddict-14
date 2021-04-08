import {getAllArrayValuesList, getDateYearValue, getFilmDuration} from '../util.js';

const DESCRIPTION_SYMBOL_LIMIT = 140;

const createControlClassName = (isActive) => isActive ? 'film-card__controls-item--active' : '';


export const createFilmCardTemplate = (film) => {
  const {comments} = film;
  const {title, total_rating, release, runtime, genre, poster, description} = film.film_info;
  const {watchlist, already_watched, favorite} = film.user_details;

  const filmDescription = description.length > DESCRIPTION_SYMBOL_LIMIT ?
    description.slice(0, DESCRIPTION_SYMBOL_LIMIT - 1)  + '…' : description;

  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${total_rating}</p>
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
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${createControlClassName(already_watched)}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${createControlClassName(favorite)}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};
