const UserRankType = {
  NO_RANK: 'no rank',
  NOVICE: 'novice',
  FAN: 'fan',
  MOVIE_BUFF: 'movie buff',
};

const UpdatedFieldType = {
  WATCHLIST: 'watchlist',
  ALREADY_WATCHED: 'alreadyWatched',
  FAVORITE: 'favorite',
};

const FilmContainerType = {
  ALL: 'all-films-container',
  TOP_RATED: 'top-rated-films-container',
  MOST_COMMENTED: 'most-commented-films-container',
};

const SortType = {
  DEFAULT: 'Sort by default',
  BY_DATE: 'Sort by date',
  BY_RATING: 'Sort by rating',
};

const FilterType = {
  ALL: 'All',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const UserAction = {
  UPDATE_FILM: 'UPDATE_FILM',
  ADD_COMMENT: 'ADD_COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

const UpdateType = {
  COMMENT_PATCH: 'COMMENT_PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  LOADING_ERROR: 'LOADING_ERROR',
};

const TimeRange = {
  ALL_TIME: 'all-time',
  TODAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};


export {UserAction, UpdateType, SortType, FilterType, FilmContainerType, UserRankType, UpdatedFieldType, TimeRange};
