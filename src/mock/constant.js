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

const DESCRIPTION_TEMPLATE = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus';
const DESCRIPTION_SENTENCES = DESCRIPTION_TEMPLATE.split('. ');

const AGE_RAITING_COUNTS = [0, 6, 12, 16, 18];

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
const TOTAL_REITING_PRECISION = 1;

const CommentsCount = {
  MIN: 0,
  MAX: 5,
};

const TotalReitingCount = {
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
  MIN: -1000000000000,
  MAX: 1617461799418,
};


export {FILM_TITLES, POSTER_NAMES, DESCRIPTION_SENTENCES, AGE_RAITING_COUNTS, PERSONS, GENRES, COUNTRIES, ID_LENGTH, TOTAL_REITING_PRECISION,
  CommentsCount, TotalReitingCount, DescriptionSentencesCount, WritersCount, ActorsCount, RunTimeCount, GenresCount, DateInMillisecondsCount};
