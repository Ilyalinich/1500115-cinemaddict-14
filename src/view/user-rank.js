import {isNumberInRange} from '../util/common.js';
import AbstractView from './abstract.js';


const NoviceRange = {
  MIN: 1,
  MAX: 10,
};

const FanRange = {
  MIN: 11,
  MAX: 20,
};

const MovieBuffRange = {
  MIN: 20,
  MAX: Infinity,
};

const userRankMap = {
  'novice': NoviceRange,
  'fan': FanRange,
  'movie buff': MovieBuffRange ,
};


const createUserRankTemplate = (films) => {
  const watchedFilmsCount = films.reduce((accumulator, {userDetails}) => {
    return accumulator + Number(userDetails.alreadyWatched);
  }, 0);

  const userRank = Object.entries(userRankMap)
    .find(([ ,{MIN, MAX}]) => isNumberInRange(watchedFilmsCount, MIN, MAX))[0];

  return `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};


export default class UserRank extends AbstractView {
  constructor(films) {
    super();
    this._films = films;
  }

  getTemplate() {
    return createUserRankTemplate(this._films);
  }
}
