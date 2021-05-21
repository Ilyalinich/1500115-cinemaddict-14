import {FilmContainerType} from '../constant.js';
import AbstractView from './abstract.js';


export default class TopRatedFilmsList extends AbstractView {
  getTemplate() {
    return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Top rated</h2>

      <div class="films-list__container" id=${FilmContainerType.TOP_RATED}></div>
    </section>`;
  }
}
