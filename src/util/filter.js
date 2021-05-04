import {FilterType} from '../constant.js';

const createFilmsToFilterMap = (films) => {
  let watchlistCounter = 0;
  let alreadyWatchedCounter = 0;
  let favoriteCounter = 0;

  films.forEach(({userDetails}) => {
    if (userDetails.watchlist) {
      watchlistCounter++;
    }

    if (userDetails.alreadyWatched) {
      alreadyWatchedCounter++;
    }

    if (userDetails.favorite) {
      favoriteCounter++;
    }
  });

  return {
    [FilterType.ALL]: '',
    [FilterType.WATCHLIST]: watchlistCounter,
    [FilterType.HISTORY]: alreadyWatchedCounter,
    [FilterType.FAVORITES]: favoriteCounter,
  };
};

const getFilters = (films) => {
  const filterMap = createFilmsToFilterMap(films);

  return Object.entries(filterMap).map(([filterType, filmsCount]) => (
    {
      type: filterType,
      count: filmsCount,
    }
  ));
};

const filterFilms = (films, currentFilterType) => {
  switch (currentFilterType) {
    case FilterType.WATCHLIST:
      return films.filter(({userDetails}) => userDetails.watchlist === true);
    case FilterType.HISTORY:
      return films.filter(({userDetails}) => userDetails.alreadyWatched === true);
    case FilterType.FAVORITES:
      return films.filter(({userDetails}) => userDetails.favorite === true);
    default:
      return films;
  }
};

export {getFilters, filterFilms};
