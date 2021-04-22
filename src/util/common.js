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

const getRandomValue = (values) => values[getRandomInteger(0, values.length - 1)];

const getRandomValues = (values, valuesEnumeration) => {
  const randomValuesCount = getRandomInteger(valuesEnumeration.MIN, valuesEnumeration.MAX);

  return getShuffleArray(values).slice(0, randomValuesCount);
};

const getAllArrayValuesList = (array) => array.length === 1 ? array[0] : array.join(', ');

const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};


export {isNumberInRange, getRandomInteger, getRandomFloat, getShuffleArray,
  getRandomBoolean, getRandomValue, getRandomValues, getAllArrayValuesList, updateItem};
