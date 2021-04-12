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
    All: '',
    Watchlist: watchlistCounter,
    History: alreadyWatchedCounter,
    Favorites: favoriteCounter,
  };
};


export const generateFilter = (films) => {
  const filterMap = createFilmsToFilterMap(films);
  return Object.entries(filterMap).map(([filterName, filmsCount]) => (
    {
      name: filterName,
      count: filmsCount,
    }
  ));
};
