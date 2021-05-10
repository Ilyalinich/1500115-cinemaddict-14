import {FilterType} from '../constant.js';


const filterFilms = (films, currentFilterType) => {
  switch (currentFilterType) {
    case FilterType.WATCHLIST:
      return films.filter(({userDetails}) => userDetails.watchlist);
    case FilterType.HISTORY:
      return films.filter(({userDetails}) => userDetails.alreadyWatched);
    case FilterType.FAVORITES:
      return films.filter(({userDetails}) => userDetails.favorite);
    default:
      return films;
  }
};

export {filterFilms};
