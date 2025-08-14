import { getData } from './api.js';
import { renderPhotos, clearPhotos } from './pictures.js';
import { initFilters } from './filters.js';
import './form.js';
import './image-effects.js';

const DATA_ERROR_TIMEOUT = 5000;

const showDataErrorMessage = () => {
  const template = document.querySelector('#data-error').content.querySelector('.data-error');
  const errorElement = template.cloneNode(true);
  document.body.appendChild(errorElement);

  setTimeout(() => {
    errorElement.remove();
  }, DATA_ERROR_TIMEOUT);
};

getData()
  .then((photos) => {
    renderPhotos(photos);
    initFilters(photos, (updatedPhotos) => {
      clearPhotos();
      renderPhotos(updatedPhotos);
    });
  })
  .catch(showDataErrorMessage);
