import {getAllArrayValuesList} from '../../util/common.js';
import {formatDate, getDuration} from '../../util/day.js';
import AbstractView from '../abstract.js';


const FORMAT_TEMPLATE = 'DD MMMM YYYY';


const createPopupGenresTemplate = (genres) => {
  const genresList = genres
    .map((genre) => `<span class="film-details__genre">${genre}</span>`)
    .join('');

  return  `<td class="film-details__term">${genres.length === 1 ? 'Genre' : 'Genres'}</td>
           <td class="film-details__cell">${genresList}</td>`;
};

const createPopupTemplate = (filmInfo) => {
  const {title,  alternativeTitle, totalRating, poster, ageRating,
    director, writers, actors, release, runtime, genre, description} = filmInfo;

  const filmDuration = getDuration(runtime);


  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

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
                <td class="film-details__cell">${filmDuration.format(filmDuration.hours() > 0 ? 'H[h] mm[m]' : 'mm[m]')}</td>
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

      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">

        </section>
      </div>
    </form>
  </section>`;
};


export default class Popup extends AbstractView {
  constructor(filmInfo) {
    super();

    this._filmInfo = filmInfo;

    this._closeButtonClickHandler = this._closeButtonClickHandler.bind(this);
  }


  getTemplate() {
    return createPopupTemplate(this._filmInfo);
  }

  setCloseButtonClickHandler(callback) {
    this._callback.closeButtonClick = callback;
    this.getElement()
      .querySelector('.film-details__close-btn')
      .addEventListener('click', this._closeButtonClickHandler);
  }

  _closeButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback.closeButtonClick();
  }
}
