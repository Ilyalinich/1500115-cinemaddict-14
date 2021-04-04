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

export {getRandomInteger, getRandomFloat, getShuffleArray, getRandomBoolean};
