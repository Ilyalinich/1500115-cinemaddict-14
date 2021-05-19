import Observer from '../util/observer.js';


export default class Films extends Observer {
  constructor() {
    super();
    this._films = [];
  }

  set(updateType, films) {
    this._films = films.slice();

    this._notify(updateType);
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

  static adaptToClient(film) {
    const {film_info, user_details} = film;

    const updatedRelease = Object.assign(
      {},
      film_info.release,
      {
        releaseCountry: film_info.release.release_country,
      },
    );

    const adaptedFilmInfo = Object.assign(
      {},
      film_info,
      {
        ageRating: film_info.age_rating,
        alternativeTitle: film_info.alternative_title,
        release: updatedRelease,
        totalRating: film_info.total_rating,
      },
    );

    const adaptaedUserDetails = Object.assign(
      {},
      user_details,
      {
        alreadyWatched: user_details.already_watched,
        watchingDate: user_details.watching_date,
      },
    );

    const adaptedFilm = Object.assign(
      {},
      film,
      {
        filmInfo: adaptedFilmInfo,
      },
      {
        userDetails: adaptaedUserDetails,
      },
    );

    delete adaptedFilm.film_info;
    delete adaptedFilm.filmInfo.age_rating;
    delete adaptedFilm.filmInfo.alternative_title;
    delete adaptedFilm.filmInfo.total_rating;
    delete adaptedFilm.filmInfo.release.release_country;

    delete adaptedFilm.user_details;
    delete adaptedFilm.userDetails.already_watched;
    delete adaptedFilm.userDetails.watching_date;

    return adaptedFilm;
  }

  static adaptToServer(film) {
    const {filmInfo, userDetails} = film;

    const updatedRelease = Object.assign(
      {},
      filmInfo.release,
      {
        'release_country': filmInfo.release.releaseCountry,
      },
    );

    const adaptedFilmInfo = Object.assign(
      {},
      filmInfo,
      {
        'age_rating': filmInfo.ageRating,
        'alternative_title': filmInfo.alternativeTitle,
        release: updatedRelease,
        'total_rating': filmInfo.totalRating,
      },
    );

    const adaptaedUserDetails = Object.assign(
      {},
      userDetails,
      {
        'already_watched': userDetails.alreadyWatched,
        'watching_date': userDetails.watchingDate,
      },
    );

    const adaptedFilm = Object.assign(
      {},
      film,
      {
        'film_info': adaptedFilmInfo,
      },
      {
        'user_details': adaptaedUserDetails,
      },
    );

    delete adaptedFilm.filmInfo;
    delete adaptedFilm.film_info.ageRating;
    delete adaptedFilm.film_info.alternativeTitle;
    delete adaptedFilm.film_info.totalRating;
    delete adaptedFilm.film_info.release.releaseCountry;

    delete adaptedFilm.userDetails;
    delete adaptedFilm.user_details.alreadyWatched;
    delete adaptedFilm.user_details.watchingDate;

    return adaptedFilm;
  }
}
