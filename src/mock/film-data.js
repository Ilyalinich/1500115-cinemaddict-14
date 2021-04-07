import {getRandomInteger, getRandomFloat, getRandomBoolean, getRandomValue, getRandomValues} from '../util.js';
import {FILM_TITLES, POSTER_NAMES, DESCRIPTION_SENTENCES, AGE_RAITING_COUNTS, PERSONS, GENRES, COUNTRIES, ID_LENGTH, TOTAL_REITING_PRECISION, ID_VALUES,
  CommentsCount, TotalReitingCount, DescriptionSentencesCount, WritersCount, ActorsCount, RunTimeCount, GenresCount, DateInMillisecondsCount} from './constant.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';


export const generateFilm = () => {
  const title = getRandomValue(Object.keys(FILM_TITLES));
  const randomDate = getRandomInteger(DateInMillisecondsCount.MIN, DateInMillisecondsCount.MAX);

  return {
    id: nanoid(ID_LENGTH),
    comments: getRandomValues(ID_VALUES, CommentsCount),
    film_info: {
      title,
      alternative_title: FILM_TITLES[title],
      total_rating: getRandomFloat(TotalReitingCount.MIN, TotalReitingCount.MAX, TOTAL_REITING_PRECISION),
      poster: getRandomValue(POSTER_NAMES),
      age_rating: getRandomValue(AGE_RAITING_COUNTS) ,
      director: getRandomValue(PERSONS.directors),
      writers: getRandomValues(PERSONS.writers, WritersCount),
      actors: getRandomValues(PERSONS.actors, ActorsCount),
      release: {
        date: dayjs(randomDate).toISOString(),
        release_country: getRandomValue(COUNTRIES),
      },
      runtime: getRandomInteger(RunTimeCount.MIN, RunTimeCount.MAX),
      genre: getRandomValues(GENRES, GenresCount),
      description: `${getRandomValues(DESCRIPTION_SENTENCES, DescriptionSentencesCount)
        .join('. ')}.`,
    },
    user_details: {
      watchlist: getRandomBoolean(),
      already_watched: getRandomBoolean(),
      watching_date: dayjs().toISOString(),
      favorite: getRandomBoolean(),
    },
  };
};
