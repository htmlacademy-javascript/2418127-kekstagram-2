import {createArrayOfPhotos} from './data.js';
import {openBigPicture} from './full-pictures.js';

const pictures = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const arrayOfPictures = createArrayOfPhotos();

const pictureFragment = document.createDocumentFragment();

arrayOfPictures.forEach((photo) => {
  const pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = photo.url;
  pictureElement.querySelector('.picture__img').alt = photo.description;
  pictureElement.querySelector('.picture__likes').textContent = photo.likes;
  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

  pictureElement.addEventListener('click', () => {
    openBigPicture(photo);
  });

  pictureFragment.appendChild(pictureElement);
});

pictures.appendChild(pictureFragment);
