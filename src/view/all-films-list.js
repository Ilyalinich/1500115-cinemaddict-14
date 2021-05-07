import AbstractView from './abstract.js';
import {FilmContainerType} from '../constant.js';


export default class AllFilmsList extends AbstractView {
  getTemplate() {
    return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container" id=${FilmContainerType.ALL}>
      </div>

    </section>`;
  }
}
