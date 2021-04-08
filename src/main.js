import {createUserRankTemplate} from './view/user-rank.js';
import {createFilterMenuTemplate} from './view/filter-menu.js';
import {createSortMenuTemplate} from './view/sort-menu.js';
import {createContentContainerTemplate} from './view/content-container.js';
import {createAllFilmsListTemplate} from './view/all-films-list.js';
import {createTopRatedFilmsListTemplate} from './view/top-rated-films-list.js';
import {createMostCommentedFilmsListTemplate} from './view/most-commented-films-list.js';
import {createFilmCardTemplate} from './view/film-card.js';
import {createShowMoreButtonTemplate} from './view/show-more-button.js';
import {createFilmsCounterTemplate} from './view/films-counter.js';
import {createPopupTemplate} from './view/popup.js';
import {createPopupCommentsTemplate} from './view/popup-comments-list.js';
import {generateFilm} from './mock/film-data.js';
import {generateFilter} from './mock/filter-data.js';
import {generateComment} from './mock/comment.js';


const FILMS_COUNT = 20;
const FILMS_RENDER_STEP = 5;
const COMMENTS_COUNT = 5;
const EXTRA_LIST_FILMS_COUNT = 2;

const films = new Array(FILMS_COUNT)
  .fill()
  .map(generateFilm);

const comments = new Array(COMMENTS_COUNT)
  .fill()
  .map(generateComment);

const filters = generateFilter(films);


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
render(contentContainer, createAllFilmsListTemplate());


const allFilmsList = contentContainer.querySelector('.films-list');
if (films.length > FILMS_RENDER_STEP) {
  let renderedFilmsCount = FILMS_RENDER_STEP;
  render(allFilmsList, createShowMoreButtonTemplate());

  const showMoreButton = allFilmsList.querySelector('.films-list__show-more');
  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();

    films
      .slice(renderedFilmsCount, renderedFilmsCount + FILMS_RENDER_STEP)
      .forEach((film) => render(allFilmsContainer, createFilmCardTemplate(film)));

    renderedFilmsCount += FILMS_RENDER_STEP;

    if (renderedFilmsCount >= films.length) {
      showMoreButton.remove();
    }
  });
}


const allFilmsContainer = contentContainer.querySelector('#all-films-container');
for (let i = 0; i < Math.min(films.length, FILMS_RENDER_STEP); i++) {
  render(allFilmsContainer, createFilmCardTemplate(films[i]));
}


const compareFilmsRaiting = (previosFilm, nextFilm) => nextFilm.film_info.total_rating - previosFilm.film_info.total_rating;
const topRatedFilms = films.slice().sort(compareFilmsRaiting);
if (topRatedFilms[0].film_info.total_rating !== 0) {
  render(contentContainer, createTopRatedFilmsListTemplate());
  const topRatedFilmsContainer = contentContainer.querySelector('#top-rated-films-container');
  for (let i = 0; i < Math.min(topRatedFilms.length, EXTRA_LIST_FILMS_COUNT); i++) {
    render(topRatedFilmsContainer, createFilmCardTemplate(topRatedFilms[i]));
  }
}

const compareFilmsCommentsLength = (previosFilm, nextFilm) => nextFilm.comments.length - previosFilm.comments.length;
const mostCommentedFilms = films.slice().sort(compareFilmsCommentsLength);
if (mostCommentedFilms[0].comments.length !== 0) {
  render(contentContainer, createMostCommentedFilmsListTemplate());
  const mostCommentedFilmsContainer = contentContainer.querySelector('#most-commented-films-container');
  for (let i = 0; i < Math.min(mostCommentedFilms.length, EXTRA_LIST_FILMS_COUNT); i++) {
    render(mostCommentedFilmsContainer, createFilmCardTemplate(mostCommentedFilms[i]));
  }
}

const siteFooterStatisticsElement = document.querySelector('.footer__statistics');
render(siteFooterStatisticsElement, createFilmsCounterTemplate(films));

const pageBody = document.querySelector('body');
render(pageBody, createPopupTemplate(films[0]));

const popup = document.querySelector('.film-details');
const popupCommentsContainer = popup.querySelector('.film-details__comments-list');
const filteredComments = comments.filter(({id}) => films[0].comments.includes(id));
render(popupCommentsContainer, createPopupCommentsTemplate(filteredComments));

const popupCloseBotton = popup.querySelector('.film-details__close-btn');
popupCloseBotton.addEventListener('click', () => {
  popup.classList.toggle('visually-hidden');
});
const firstFilmPoster = document.querySelector('.film-card__poster');
firstFilmPoster.addEventListener('click', () => {
  popup.classList.toggle('visually-hidden');
});
