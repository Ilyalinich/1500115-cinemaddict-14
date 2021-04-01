const MOVIES_COUNT = 130291;

export const createMoviesCountTemplate = () => {
  return `<p>${MOVIES_COUNT.toLocaleString()} movies inside</p>`;
};
