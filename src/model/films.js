import Observer from '../util/observer.js';


export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  set(films) {
    this._films = films.slice();
  }

  get() {
    return this._films;
  }

  update(updateType, update) {
    const index = this._films.findIndex((film) => film.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film');
    }

    this._films = [
      ...this._films.slice(0, index),
      update,
      ...this._films.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addNewComment(updateType, newComment) {
    const updatedFilm = this._films.find((film) => film.id === newComment.filmId);

    updatedFilm.comments = [
      newComment.id,
      ...updatedFilm.comments,
    ];

    this._notify(updateType, updatedFilm);
  }

  removeComment(updateType, removedComment) {
    const updatedFilm = this._films.find((film) => film.id === removedComment.filmId);
    const indexOfRemovedComment = updatedFilm.comments.findIndex((id) => id === removedComment.id);

    updatedFilm.comments.splice(indexOfRemovedComment, 1);

    this._notify(updateType, updatedFilm);
  }
}
