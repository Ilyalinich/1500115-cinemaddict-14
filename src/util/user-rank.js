import {isNumberInRange} from '../util/common.js';
import {UserRankType} from '../constant.js';


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
  [UserRankType.NO_RANK] : NoRankRange,
  [UserRankType.NOVICE]: NoviceRange,
  [UserRankType.FAN]: FanRange,
  [UserRankType.MOVIE_BUFF]: MovieBuffRange ,
};

const getUserRank = (films) => {
  const watchedFilmsCount = films.reduce((accumulator, {userDetails}) => {
    return accumulator + Number(userDetails.alreadyWatched);
  }, 0);

  return Object.entries(userRankMap)
    .find(([ ,{MIN, MAX}]) => isNumberInRange(watchedFilmsCount, MIN, MAX))[0];
};

export {getUserRank};
