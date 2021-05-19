import {getRelativeDate} from '../../util/day.js';
import AbstractView from '../abstract.js';
import he from 'he';


const createCommentTemplate = ({id, author, comment, date, emotion}) => {
  return `<li class="film-details__comment" id="${id}">
    <span class="film-details__comment-emoji">
      <img src="./images/emoji/${emotion}.png" width="55" height="55" alt="emoji-${emotion}">
    </span>
    <div>
      <p class="film-details__comment-text">${he.encode(comment)}</p>
      <p class="film-details__comment-info">
        <span class="film-details__comment-author">${author}</span>
        <span class="film-details__comment-day">${getRelativeDate(date)}</span>
        <button class="film-details__comment-delete" data-comment-id="${id}">Delete</button>
      </p>
    </div>
  </li>`;
};


const createCommentsTemplate = (comments) => {
  const commentsListTemplate = comments
    .map((comment) => createCommentTemplate(comment))
    .join('');

  return `<ul class="film-details__comments-list">
      ${commentsListTemplate}
    </ul>`;
};


export default class CommentsList extends AbstractView {
  constructor(comments) {
    super();

    this._comments = comments;

    this._deleteButtonClickHandler = this._deleteButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createCommentsTemplate(this._comments);
  }

  getComment(commentId) {
    return this.getElement().querySelector(`[id = "${commentId}"`);
  }

  enable(deletingCommentId) {
    const button = this.getElement().querySelector(`button[data-comment-id = "${deletingCommentId}"]`);

    button.textContent = 'Delete';
    button.disabled = false;
  }

  setDeleteButtonClickHandler(callback) {
    this._callback.deleteButtonClick = callback;
    this.getElement()
      .querySelectorAll('.film-details__comment-delete')
      .forEach((button) => button.addEventListener('click', this._deleteButtonClickHandler));
  }

  _deleteButtonClickHandler(evt) {
    evt.preventDefault();
    evt.target.textContent = 'Deleting...';
    evt.target.disabled = true;
    this._callback.deleteButtonClick(evt.target.dataset.commentId);
  }
}
