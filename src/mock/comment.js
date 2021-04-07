import dayjs from 'dayjs';
import {DESCRIPTION_SENTENCES, PERSONS, DateInMillisecondsCount, ID_VALUES} from './constant.js';
import {getRandomInteger, getRandomValue} from '../util.js';


const EMOTIONS = ['smile', 'sleeping', 'puke', 'angry'];
const usedIdValues = [];

const generateId = (idValues) => {
  const idValue = getRandomValue(idValues);
  if (usedIdValues.includes(idValue)) {
    return generateId(idValues);
  } else {
    usedIdValues.push(idValue);
    return idValue;
  }
};

export const generateComment = () => {
  const randomDate = getRandomInteger(DateInMillisecondsCount.MIN, DateInMillisecondsCount.MAX);

  return {
    id: generateId(ID_VALUES),
    author: `${getRandomValue(PERSONS.writers)}`,
    comment: `${getRandomValue(DESCRIPTION_SENTENCES)}.`,
    date: `${dayjs(randomDate).toISOString()}`,
    emotion: `${getRandomValue(EMOTIONS)}`,
  };
};
