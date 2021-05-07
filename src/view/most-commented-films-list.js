import AbstractView from './abstract.js';
import {FilmContainerType} from '../constant.js';

export default class MostCommentedFilmsList extends AbstractView {
  getTemplate() {
    return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container" id=${FilmContainerType.MOST_COMMENTED}></div>
    </section>`;
  }
}
