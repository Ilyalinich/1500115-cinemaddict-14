const createfilmToFilterMap = (films) => {
  let watchlistCounter = 0;
  let alreadyWatchedCounter = 0;
  let favoriteCounter = 0;

  films.forEach(({user_details}) => {
    user_details.watchlist ? watchlistCounter++ : false;
    user_details.already_watched ? alreadyWatchedCounter++ : false;
    user_details.favorite ? favoriteCounter++ : false;
  });

  return {
    'All': '',
    'Watchlist': watchlistCounter,
    'History': alreadyWatchedCounter,
    'Favorites': favoriteCounter,
  };
};


export const generateFilter = (films) => {
  const filterMap = createfilmToFilterMap(films);
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
