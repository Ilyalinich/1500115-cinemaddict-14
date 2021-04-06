import {isNumberInRange} from '../util.js';

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
  [NoviceRange]: 'novice',
  [FanRange]: 'fan',
  [MovieBuffRange]: 'movie buff',
};

export const createUserRankTemplate = (films) => {
  const watchedFilmsCount = films.reduce(
    (accumulator, {user_details}) => {
      return accumulator + Number(user_details.already_watched);
    }, 0);

  const userRank = Object.entries(userRankMap).forEach(([{MIN, MAX}, rankName]) =>

    isNumberInRange(watchedFilmsCount, MIN, MAX) ? rankName : false);
    /*eslint-disable*/
    console.log(watchedFilmsCount);
    console.log(userRank);
  return `<section class="header__profile profile">
    <p class="profile__rating">Movie Buff</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};
