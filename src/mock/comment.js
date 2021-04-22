import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {DESCRIPTION_SENTENCES, PERSONS, ID_LENGTH, DateInMillisecondsCount} from '../constant.js';
import {getRandomInteger, getRandomValue} from '../util/common.js';


const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];

export const generateComment = () => {
  const randomDate = getRandomInteger(DateInMillisecondsCount.MIN, DateInMillisecondsCount.MAX);

  return {
    id: nanoid(ID_LENGTH),
    author: getRandomValue(PERSONS.writers),
    comment: getRandomValue(DESCRIPTION_SENTENCES),
    date: dayjs(randomDate).toISOString(),
    emotion: getRandomValue(EMOTIONS),
  };
};
