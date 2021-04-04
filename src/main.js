import {createUserRankTemplate} from './view/user-rank.js';
import {createMainMenuTemplate} from './view/main-menu.js';
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

const MOVIES_COUNT = 5;

const films = new Array(MOVIES_COUNT)
  .fill()
  .map(generateFilm);
/*eslint-disable*/
console.log(films);

const render = (container, template, place = 'beforeend') => {
  container.insertAdjacentHTML(place, template);
};

const siteHeaderElement = document.querySelector('.header');
render(siteHeaderElement, createUserRankTemplate());


const siteMainElement = document.querySelector('.main');
render(siteMainElement, createMainMenuTemplate());
render(siteMainElement, createSortMenuTemplate());
render(siteMainElement, createContentContainerTemplate());

const contentContainer = siteMainElement.querySelector('.films');
render(contentContainer, createAllMoviesListTemplate());
// render(contentContainer, createTopRatedMoviesListTemplate());
// render(contentContainer, createMostCommentedMoviesListTemplate());


const allMoviesContainer = contentContainer.querySelector('.films-list__container');
for (let i = 0; i < MOVIES_COUNT; i++) {
  render(allMoviesContainer, createFilmCardTemplate(films[i]));
}

const allMoviesList = contentContainer.querySelector('.films-list');
render(allMoviesList, createShowMoreButtonTemplate());


const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, createMoviesCountTemplate());

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
