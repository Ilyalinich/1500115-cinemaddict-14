import Observer from '../util/observer.js';


export default class Comments extends Observer {
  constructor(addCommentToFilm, removeCommentFromFilm) {
    super();
    this._comments = [];
    this._addCommentToFilm = addCommentToFilm;
    this._removeCommentFromFilm = removeCommentFromFilm;
  }

  set(comments) {
    this._comments = comments.slice();
  }

  get(comments) {
    return this._comments.filter(({id}) => comments.includes(id));
  }

  add(updateType, newComment) {
    this._comments = [
      newComment,
      ...this._comments,
    ];

    this._addCommentToFilm(updateType, newComment);

    // this._notify(updateType);
  }

  delete(updateType, deletedComment) {
    const index = this._comments.findIndex((comment) => comment.id === deletedComment.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];

    this._removeCommentFromFilm(updateType, deletedComment);

    // this._notify(updateType);
  }
}
