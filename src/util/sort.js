import {compareDate} from './day.js';

const sortFilmsByDate = (previousFilm, nextFilm) => compareDate(nextFilm.filmInfo.release.date, previousFilm.filmInfo.release.date);

const sortFilmsByRating = (previousFilm, nextFilm) => nextFilm.filmInfo.totalRating - previousFilm.filmInfo.totalRating;

const sortFilmsByCommentsCount = (previousFilm, nextFilm) => nextFilm.comments.length - previousFilm.comments.length;

export {sortFilmsByDate, sortFilmsByRating, sortFilmsByCommentsCount};
