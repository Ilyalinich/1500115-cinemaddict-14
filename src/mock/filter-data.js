const createFilmsToFilterMap = (films) => {
  let watchlistCounter = 0;
  let alreadyWatchedCounter = 0;
  let favoriteCounter = 0;

  films.forEach(({userDetails}) => {
    userDetails.watchlist && watchlistCounter++;
    userDetails.alreadyWatched && alreadyWatchedCounter++;
    userDetails.favorite && favoriteCounter++;
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
  return Object.entries(filterMap).map(([filterName, filmsCount]) => {
    return {
      name: filterName,
      count: filmsCount,
    };
  });
};

// const filmToFilterMap = {
//   'All movies': (films) => films.length,
//   'Watchlist': (films) => films.filter(({user_details}) => user_details.watchlist).length,
//   'History': (films) => films.filter(({user_details}) => user_details.already_watched).length,
//   'Favorites': (films) => films.filter(({user_details}) => user_details.favorite).length,
// };


// export const generateFilter = (films) => {
//   return Object.entries(filmToFilterMap).map(([filterName, filmsCount]) => {
//     return {
//       name: filterName,
//       count: filmsCount(films),
//     };
//   });
// };
