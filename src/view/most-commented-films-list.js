import AbstractView from './abstract.js';


export default class MostCommentedFilmsList extends AbstractView {
  getTemplate() {
    return `<section class="films-list films-list--extra">
      <h2 class="films-list__title">Most commented</h2>

      <div class="films-list__container" id="most-commented-films-container"></div>
    </section>`;
  }
}
