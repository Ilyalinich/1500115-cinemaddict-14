import {compareDate} from './day.js';


const getFilmDuration = (minutes) => {
  const hoursDuration = Math.floor(minutes / 60);
  const minutesDuration = Math.floor(minutes % 60);

  return hoursDuration > 0 ? `${hoursDuration}h ${minutesDuration}m` : `${minutesDuration}m`;
};

const sortFilmsByDate = (previousFilm, nextFilm) => compareDate(nextFilm.filmInfo.release.date, previousFilm.filmInfo.release.date);

const sortFilmsByRating = (previousFilm, nextFilm) => nextFilm.filmInfo.totalRating - previousFilm.filmInfo.totalRating;

const sortFilmsByCommentsCount = (previousFilm, nextFilm) => nextFilm.comments.length - previousFilm.comments.length;


export {getFilmDuration, sortFilmsByDate, sortFilmsByRating, sortFilmsByCommentsCount};
