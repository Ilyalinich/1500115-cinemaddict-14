import FilmsModel from '../model/films.js';
import {isOnline} from '../util/common.js';


const getSyncedFilms = (items) => {
  return items
    .filter(({success}) => success)
    .map(({payload}) => payload.film);
};

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign(
      {},
      acc,
      {
        [current.id]: current,
      },
    );
  }, {});
};


export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilms() {
    if (isOnline()) {
      return this._api.getFilms()
        .then((films) => {
          const items = createStoreStructure(films.map(FilmsModel.adaptToServer));
          this._store.setItems(items);

          return films;
        });
    }

    const storeFilms = Object.values(this._store.getItems());

    return Promise.resolve(storeFilms.map(FilmsModel.adaptToClient));
  }

  updateFilm(film) {
    if (isOnline()) {
      return this._api.updateFilm(film)
        .then((updatedFilm) => {
          this._store.setItem(updatedFilm.id, FilmsModel.adaptToServer(updatedFilm));

          return updatedFilm;
        });
    }

    this._store.setItem(film.id, FilmsModel.adaptToServer(Object.assign({}, film)));

    return Promise.resolve(film);
  }

  getComments(filmId) {
    return this._api.getComments(filmId);
  }

  // addFilm(film) {
  //   if (isOnline()) {
  //     return this._api.addFilm(film)
  //       .then((newTask) => {
  //         this._store.setItem(newTask.id, TasksModel.adaptToServer(newTask));
  //         return newTask;
  //       });
  //   }

  //   return Promise.reject(new Error('Add task failed'));
  // }

  // deleteTask(task) {
  //   if (isOnline()) {
  //     return this._api.deleteTask(task)
  //       .then(() => this._store.removeItem(task.id));
  //   }

  //   return Promise.reject(new Error('Delete task failed'));
  // }

  sync() {
    if (isOnline()) {
      const storeFilms = Object.values(this._store.getItems());

      return this._api.sync(storeFilms)
        .then((response) => {
          // Забираем из ответа синхронизированные задачи
          // const createdTasks = getSyncedTasks(response.created);
          const updatedFilms = getSyncedFilms(response.updated);

          // Добавляем синхронизированные задачи в хранилище.
          // Хранилище должно быть актуальным в любой момент.
          const items = createStoreStructure(updatedFilms);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
