import {getRandomInteger, getRandomFloat, getShuffleArray, getRandomBoolean} from './util.js';
import {FILM_TITLES, POSTER_NAMES, DESCRIPTION_SENTENCES, AGE_RAITING_COUNTS, PERSONS, GENRES, COUNTRIES, ID_LENGTH, TOTAL_REITING_PRECISION,
  CommentsCount, TotalReitingCount, DescriptionSentencesCount, WritersCount, ActorsCount, RunTimeCount, GenresCount, DateInMillisecondsCount} from './constant.js';
import dayjs from 'dayjs';
import {nanoid} from 'nanoid';


const getRandomValue = (values) => values[getRandomInteger(0, values.length - 1)];
const getRandomValues = (values, valuesEnumeration) => {
  const randomValuesCount = getRandomInteger(valuesEnumeration.MIN, valuesEnumeration.MAX);
  const randomValues = getShuffleArray(values)
    .slice(0, randomValuesCount);
  return randomValues;
};

const generateCommentsId = () => new Array(getRandomInteger(CommentsCount.MIN, CommentsCount.MAX))
  .fill()
  .map(() => nanoid(ID_LENGTH));

const generateTotalRating = () => getRandomFloat(TotalReitingCount.MIN, TotalReitingCount.MAX, TOTAL_REITING_PRECISION);
const generateRunTime = () => getRandomInteger(RunTimeCount.MIN, RunTimeCount.MAX);


const generateFilm = () => {
  const title = getRandomValue(Object.keys(FILM_TITLES));
  const randomDate = getRandomInteger(DateInMillisecondsCount.MIN, DateInMillisecondsCount.MAX);
  return {
    id: nanoid(ID_LENGTH),
    comments: generateCommentsId(),
    film_info: {
      title,
      alternative_title: FILM_TITLES[title],
      total_rating: generateTotalRating(),
      poster: getRandomValue(POSTER_NAMES),
      age_rating: getRandomValue(AGE_RAITING_COUNTS) ,
      director: getRandomValue(PERSONS.directors),
      writers: getRandomValues(PERSONS.writers, WritersCount),
      actors: getRandomValues(PERSONS.actors, ActorsCount),
      release: {
        date: dayjs(randomDate).toISOString(),
        release_country: getRandomValue(COUNTRIES),
      },
      runtime: generateRunTime(),
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

export {generateFilm};
