import AbstractView from '../abstract.js';


export default class CommentsCounter extends AbstractView {
  constructor(comments) {
    super();

    this._comments = comments;
  }


  getTemplate() {
    return `<h3 class="film-details__comments-title">
      Comments
        <span class="film-details__comments-count">
          ${this._comments.length}
        </span>
      </h3>`;
  }
}
