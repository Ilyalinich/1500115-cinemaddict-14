import dayjs from 'dayjs';

const getRandomValue = (values) => values[getRandomInteger(0, values.length - 1)];
const getRandomValues = (values, valuesEnumeration) => {
  const randomValuesCount = getRandomInteger(valuesEnumeration.MIN, valuesEnumeration.MAX);
  const randomValues = getShuffleArray(values)
    .slice(0, randomValuesCount);
  return randomValues;
};

const getDateYearValue = (date) => dayjs(date).year();
const humanizeDate = (date) => dayjs(date).format('DD MMMM YYYY');

const getFilmDuration = (minutes) => {
  const hoursDuration = Math.floor(minutes / 60);
  const minutesDuration = Math.floor(minutes % 60);

  return hoursDuration > 0 ? `${hoursDuration}h ${minutesDuration}m` : `${minutesDuration}m`;
};

const getAllArrayValuesList = (array) => array.length === 1 ? array[0] : array.join(', ');

const isNumberInRange = (number, rangeMin, rangeMax) =>  number >= rangeMin && number <= rangeMax;

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const getRandomFloat = (a = 0, b = 1, precision) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return parseFloat((Math.random() * (upper - lower) + lower)).toFixed(precision);
};

const getShuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getRandomBoolean = () => Boolean(getRandomInteger(0, 1));

export {getRandomInteger, getRandomFloat, getShuffleArray, getRandomBoolean, getDateYearValue, humanizeDate,
  getFilmDuration, getAllArrayValuesList, isNumberInRange, getRandomValue, getRandomValues};
