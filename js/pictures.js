import {getData} from './api.js';
import {openBigPicture} from './full-pictures.js';

const pictures = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const showDataErrorMessage = () => {
  const template = document.querySelector('#data-error').content.querySelector('.data-error');
  const errorElement = template.cloneNode(true);
  document.body.appendChild(errorElement);

  setTimeout(() => {
    errorElement.remove();
  }, 5000);
};

const renderPhotos = (arrayOfPictures) => {
  const pictureFragment = document.createDocumentFragment();

  arrayOfPictures.forEach((photo) => {
    const pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture__img').src = photo.url;
    pictureElement.querySelector('.picture__img').alt = photo.description;
    pictureElement.querySelector('.picture__likes').textContent = photo.likes;
    pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;

    pictureElement.addEventListener('click', (evt) => {
      evt.preventDefault();
      openBigPicture(photo);
    });

    pictureFragment.appendChild(pictureElement);
  });

  pictures.appendChild(pictureFragment);
};

getData()
  .then(renderPhotos)
  .catch(showDataErrorMessage);
