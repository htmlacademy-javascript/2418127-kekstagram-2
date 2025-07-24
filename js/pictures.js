import {createArrayOfPhotos} from './data.js';
import {openBigPicture} from './full_pictures.js';

const pictures = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const arrayOfPictures = createArrayOfPhotos();

const pictureFragment = document.createDocumentFragment();

arrayOfPictures.forEach(({url, description, likes, comments}) => {
  const pictureElement = pictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = url;
  pictureElement.querySelector('.picture__img').alt = description;
  pictureElement.querySelector('.picture__likes').textContent = likes;
  pictureElement.querySelector('.picture__comments').textContent = comments.length;

  pictureElement.addEventListener('click', () => {
    openBigPicture({url, description, likes, comments});
  });

  pictureFragment.appendChild(pictureElement);
});

pictures.appendChild(pictureFragment);
