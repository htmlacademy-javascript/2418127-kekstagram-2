import {openBigPicture} from './full-pictures.js';

const pictures = document.querySelector('.pictures');
const pictureTemplate = document.querySelector('#picture')
  .content
  .querySelector('.picture');

const clearPhotos = () => {
  pictures.querySelectorAll('.picture').forEach((el) => el.remove());
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

export { renderPhotos, clearPhotos };
