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

  add(comments) {
    this._comments = comments.slice();
  }

  delete(commentId) {
    const index = this._comments.findIndex((comment) => comment.id === commentId);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];
  }
}
