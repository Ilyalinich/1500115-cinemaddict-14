import dayjs from 'dayjs';


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
  PATCH: 'PATCH',
  COMMENT_PATCH: 'COMMENT_PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
};

const StatisticFilterType = {
  ALL_TIME: 'all-time',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const FILM_TITLES = {
  'Побег из Шоушенка': 'The Shawshank Redemption',
  'Зеленая миля': 'The Green Mile',
  'Форест Гамп': 'Forrest Gump',
  'Список Шиндлера': 'Schindler\'s List',
  '1+1': 'Intouchables',
  'Крестный Отец': 'The Godfather',
  'Леон': 'The Professional',
  'Начало': 'Inception',
};

const POSTER_NAMES = [
  'made-for-each-other.png',
  'popeye-meets-sinbad.png',
  'sagebrush-trail.jpg',
  'santa-claus-conquers-the-martians.jpg',
  'the-dance-of-life.jpg',
  'the-great-flamarion.jpg',
  'the-man-with-the-golden-arm.jpg',
];

const DESCRIPTION_SENTENCES = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const AGE_RATING_COUNTS = [0, 6, 12, 16, 18];

const PERSONS = {
  directors: [
    'Квентин Тарантино',
    'Кэтрин Бигелоу',
    'Вуди Аллен',
    'Фрэнсис Форд Коппола',
    'Мартин Скорсезе',
    'Альфред Хичкок',
    'Кристофер Нолан',
    'Клинт Иствуд',
    'Джеймс Кэмерон',
  ],
  writers: [
    'Билли Уайлдер',
    'Итан и Джоэл Коэны',
    'Роберт Таун',
    'Квентин Тарантино',
    'Фрэнсис Форд Коппола',
    'Уильям Голдман',
    'Чарли Кауфман',
  ],
  actors: [
    'Джонни Депп',
    'Леонардо ди Каприо',
    'Брэд Питт',
    'Том Круз',
    'Николас Кейдж',
    'Роберт де Ниро',
    'Джек Николсон',
    'Кевин Костнер',
    'Том Хэнкс',
  ],
};

const GENRES = [
  'Триллер',
  'Спорт',
  'Драма',
  'Комедия',
  'Биография',
  'Боевик',
  'Мюзикл',
];

const COUNTRIES = [
  'Индия',
  'США',
  'Россия',
  'Финляндия',
  'Германия',
];

const ID_LENGTH = 3;
const TOTAL_RATING_PRECISION = 1;

const CommentsCount = {
  MIN: 0,
  MAX: 5,
};

const TotalRatingCount = {
  MIN: 0,
  MAX: 9,
};

const DescriptionSentencesCount = {
  MIN: 1,
  MAX: 5,
};

const WritersCount = {
  MIN: 1,
  MAX: 3,
};

const ActorsCount = {
  MIN: 1,
  MAX: 5,
};

const RunTimeCount = {
  MIN: 30,
  MAX: 160,
};

const GenresCount = {
  MIN: 1,
  MAX: 3,
};

const DateInMillisecondsCount = {
  MIN: dayjs('2021-04-01').valueOf(),
  MAX: dayjs().valueOf(),
};


export {FILM_TITLES, POSTER_NAMES, DESCRIPTION_SENTENCES, AGE_RATING_COUNTS, PERSONS, GENRES, COUNTRIES, ID_LENGTH, TOTAL_RATING_PRECISION,
  CommentsCount, TotalRatingCount, DescriptionSentencesCount, WritersCount, ActorsCount, RunTimeCount, GenresCount, DateInMillisecondsCount,
  UserAction, UpdateType, SortType, FilterType, FilmContainerType, UserRankType, UpdatedFieldType, StatisticFilterType};
