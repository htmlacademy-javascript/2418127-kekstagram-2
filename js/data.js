import {getRandomInteger, getRandomArrayElement} from './util.js';

const DESCRIPTIONS = [
  'Котики играют друг с другом',
  'Лес и горы',
  'Живописное озеро',
  'Развалины древнего замка',
  'Рок-концерт',
  'Пикник на обочине',
  'Рукодельница за работой',
  'Влюбленная пара',
  'Дети бегают по лужам',
  'Туристы около Колизея',
  'Девушка на набережной',
  'Книжные полки в интерьере',
  'Горит камин',
  'Цветущий сад',
  'Первые шаги',
  'Танцовщица в красном',
  'Абстракция',
  'Дикая природа',
  'Заброшенная деревня',
  'Спелая черешня',
  'Краски лета',
  'Четвертое измерение',
  'Лунный свет',
  'Красное на чёрном',
  'Меньшее зло'
];

const MESSAGES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Андрей',
  'Вольдемар',
  'Оксана',
  'Иннокентий',
  'Дарья',
  'Виктория',
  'Антон',
  'Татьяна',
  'Игорь',
  'Анна',
  'Коля',
  'Владислав',
  'Марго',
  'Артём',
  'Ольга',
  'Олег',
  'Юлия',
  'Анастасия',
  'Николай',
  'Александр',
  'Демьян',
  'Демид',
  'Яна'
];

const MIN_AVATAR_NUMBER = 1;
const MAX_AVATAR_NUMBER = 6;
const MIN_COMMENT_COUNT = 0;
const MAX_COMMENT_COUNT = 30;
const MIN_LIKES_COUNT = 15;
const MAX_LIKES_COUNT = 200;
const AMOUNT_OF_PHOTOS = 25;

const createIdGenerator = () => {
  let currentId = 0;
  return () => {
    currentId += 1;
    return currentId;
  };
};

const generateCommentId = createIdGenerator();

const createComment = () => ({
  id: generateCommentId(),
  avatar: `img/avatar-${getRandomInteger(MIN_AVATAR_NUMBER, MAX_AVATAR_NUMBER)}.svg`,
  message: getRandomArrayElement(MESSAGES),
  name: getRandomArrayElement(NAMES)
});

const generateComments = () => {
  const count = getRandomInteger(MIN_COMMENT_COUNT, MAX_COMMENT_COUNT);
  return Array.from({ length: count }, createComment);
};

const createPhotoDescription = (id) => ({
  id: id,
  url: `photos/${id}.jpg`,
  description: DESCRIPTIONS[id - 1],
  likes: getRandomInteger(MIN_LIKES_COUNT, MAX_LIKES_COUNT),
  comments: generateComments()
});

const createArrayOfPhotos = () => Array.from({length: AMOUNT_OF_PHOTOS}, (_, index) => createPhotoDescription(index + 1));

export {createArrayOfPhotos};


