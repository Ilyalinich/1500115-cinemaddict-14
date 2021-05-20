import AbstractView from '../abstract.js';


export default class CommentsCounter extends AbstractView {
  constructor(count) {
    super();

    this._count = count;
  }


  getTemplate() {
    return `<h3 class="film-details__comments-title">
      Comments
        <span class="film-details__comments-count">
          ${this._count}
        </span>
      </h3>`;
  }
}
