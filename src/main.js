import {createUserRankTemplate} from './view/user-rank.js';
import {createFilterMenuTemplate} from './view/filter-menu.js';
import {createSortMenuTemplate} from './view/sort-menu.js';
import {createContentContainerTemplate} from './view/content-container.js';
import {createAllMoviesListTemplate} from './view/all-movies-list.js';
// import {createTopRatedMoviesListTemplate} from './view/top-rated-movies-list.js';
// import {createMostCommentedMoviesListTemplate} from './view/most-commented-movies-list.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createMoviesCountTemplate} from './view/movies-counter.js';
import {createPopupTemplate} from './view/popup.js';
import {generateFilm} from './mock/film-data.js';
import {generateFilter} from './mock/filter-data.js';


const FILMS_RENDER_STEP = 5;
const FILMS_COUNT = 20;

const films = new Array(FILMS_COUNT)
  .fill()
  .map(generateFilm);

const filters = generateFilter(films);
/*eslint-disable*/
console.log(films);

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, createUserRankTemplate(films));


const siteMainElement = document.querySelector('.main');
render(siteMainElement, createFilterMenuTemplate(filters));
render(siteMainElement, createSortMenuTemplate());
render(siteMainElement, createContentContainerTemplate());

const contentContainer = siteMainElement.querySelector('.films');
render(contentContainer, createAllMoviesListTemplate());
// render(contentContainer, createTopRatedMoviesListTemplate());
// render(contentContainer, createMostCommentedMoviesListTemplate());


const allMoviesContainer = contentContainer.querySelector('.films-list__container');
for (let i = 0; i < Math.min(films.length, FILMS_RENDER_STEP); i++) {
  render(allMoviesContainer, createFilmCardTemplate(films[i]));
}

const allMoviesList = contentContainer.querySelector('.films-list');
if (films.length > FILMS_RENDER_STEP) {
  let renderedFilmsCount = FILMS_RENDER_STEP;
  render(allMoviesList, createShowMoreButtonTemplate());

  const showMoreButton = allMoviesList.querySelector('.films-list__show-more');
  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_RENDER_STEP)
      .forEach((film) => render(allMoviesContainer, createFilmCardTemplate(film)));

    renderedFilmsCount += FILMS_RENDER_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}


const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, createMoviesCountTemplate(films));

const pageBody = document.querySelector('body');
pageBody.classList.add('.hide-overflow')
render(pageBody, createPopupTemplate(films[0]));

const popup = document.querySelector('.film-details');
const popupCloseBotton = popup.querySelector('.film-details__close-btn');
popupCloseBotton.addEventListener('click', () => {
  popup.classList.toggle('visually-hidden')
});
const firstFilmPoster = document.querySelector('.film-card__poster');
firstFilmPoster.addEventListener('click', () => {
  popup.classList.toggle('visually-hidden')
});
