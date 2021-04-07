import {isNumberInRange} from '../util.js';

const NoRankRange = {
  MIN: 0,
  MAX: 0,
};

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
  'no rank': NoRankRange,
  'novice': NoviceRange,
  'fan': FanRange,
  'movie buff': MovieBuffRange ,
};

export const createUserRankTemplate = (films) => {
  const watchedFilmsCount = films.reduce(
    (accumulator, {user_details}) => {
      return accumulator + Number(user_details.already_watched);
    }, 0);

  const userRank = Object.entries(userRankMap)
    .find(([ ,{MIN, MAX}]) => isNumberInRange(watchedFilmsCount, MIN, MAX))[0];

  return userRank !== 'no rank' ?
    `<section class="header__profile profile">
      <p class="profile__rating">${userRank}</p>
      <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>` :
    '';
};
