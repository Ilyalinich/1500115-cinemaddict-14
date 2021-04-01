import {createFilmCardTemplate} from './film-card.js';
const MOVIES_COUNT = 2;

export const createTopRatedMoviesListTemplate = () => {
  let topRatedMovies = '';
  for (let i = 0; i < MOVIES_COUNT; i++) {
    topRatedMovies += createFilmCardTemplate();
  }
  return `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Top rated</h2>

    <div class="films-list__container">
      ${topRatedMovies}
    </div>

  </section>`;
};
