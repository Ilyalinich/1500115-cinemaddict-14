export const createMoviesCountTemplate = (films) => {
  return `<p>${films.length.toLocaleString()} movies inside</p>`;
};
