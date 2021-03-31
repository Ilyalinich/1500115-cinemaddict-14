import {createFilmCardTemplate} from './film-card.js';
const MOVIES_COUNT = 2;

export const createMostCommentedMoviesListTemplate = () => {
  let mostCommentedMovies = '';
  for (let i = 0; i < MOVIES_COUNT; i++) {
    mostCommentedMovies += createFilmCardTemplate();
  }
  return `<section class="films-list films-list--extra">
    <h2 class="films-list__title">Most commented</h2>

    <div class="films-list__container">
      ${mostCommentedMovies}
    </div>

  </section>`;
};
