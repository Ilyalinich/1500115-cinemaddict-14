import Observer from '../util/observer.js';


export default class Comments extends Observer {
  constructor() {
    super();
    this._comments = [];
  }

  set(updateType, comments) {
    this._comments = comments.slice();

    this._notify(updateType);
  }

  get() {
    return this._comments;
  }

  add(updateType, update) {
    this._comments = update.comments.slice();

    this._notify(updateType, update.movie);
  }

  delete(updateType, update) {
    const index = this._comments.findIndex((comment) => comment.id === update.commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this._notify(updateType, update.updatedFilm);
  }
}
