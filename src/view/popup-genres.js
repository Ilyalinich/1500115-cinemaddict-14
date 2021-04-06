export const createPopupGenresTemplate = (genres) => {
  const genresList = genres.map((genre) => `<span class="film-details__genre">${genre}</span>`)
    .join('');
  return  `<td class="film-details__term">${genres.length === 1 ? 'Genre' : 'Genres'}</td>
           <td class="film-details__cell">${genresList}</td>`;
};
