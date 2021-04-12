import {getRandomInteger, getRandomFloat, getRandomBoolean, getRandomValue, getRandomValues} from '../util.js';
import {FILM_TITLES, POSTER_NAMES, DESCRIPTION_SENTENCES, AGE_RATING_COUNTS, PERSONS, GENRES, COUNTRIES, ID_LENGTH, TOTAL_RATING_PRECISION,
  TotalRatingCount, DescriptionSentencesCount, WritersCount, ActorsCount, RunTimeCount, GenresCount, DateInMillisecondsCount} from './constant.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';


export const generateFilm = (commentsIds) => {
  const title = getRandomValue(Object.keys(FILM_TITLES));
  const randomDate = getRandomInteger(DateInMillisecondsCount.MIN, DateInMillisecondsCount.MAX);

  return {
    id: nanoid(ID_LENGTH),
    comments: commentsIds,
    filmInfo: {
      title,
      alternativeTitle: FILM_TITLES[title],
      totalRating: getRandomFloat(TotalRatingCount.MIN, TotalRatingCount.MAX, TOTAL_RATING_PRECISION),
      poster: getRandomValue(POSTER_NAMES),
      ageRating: getRandomValue(AGE_RATING_COUNTS) ,
      director: getRandomValue(PERSONS.directors),
      writers: getRandomValues(PERSONS.writers, WritersCount),
      actors: getRandomValues(PERSONS.actors, ActorsCount),
      release: {
        date: dayjs(randomDate).toISOString(),
        releaseCountry: getRandomValue(COUNTRIES),
      },
      runtime: getRandomInteger(RunTimeCount.MIN, RunTimeCount.MAX),
      genre: getRandomValues(GENRES, GenresCount),
      description: getRandomValues(DESCRIPTION_SENTENCES, DescriptionSentencesCount).join(''),
    },
    userDetails: {
      watchlist: getRandomBoolean(),
      alreadyWatched: getRandomBoolean(),
      watchingDate: dayjs().toISOString(),
      favorite: getRandomBoolean(),
    },
  };
};
