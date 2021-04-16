import {createElement} from '../util.js';


export default class AllFilmsList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return `<section class="films-list">
      <h2 class="films-list__title visually-hidden">All movies. Upcoming</h2>

      <div class="films-list__container" id="all-films-container">
      </div>

    </section>`;
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
