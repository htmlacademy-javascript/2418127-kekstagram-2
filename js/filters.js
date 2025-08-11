import { debounce, getRandomSubset, getDiscussed } from './util.js';

const FILTER = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};

const RANDOM_COUNT = 10;
const DEBOUNCE_DELAY = 500;

const imgFilters = document.querySelector('.img-filters');
const filterButtons = imgFilters.querySelectorAll('.img-filters__button');

const setActiveButton = (button) => {
  filterButtons.forEach((btn) => btn.classList.remove('img-filters__button--active'));
  button.classList.add('img-filters__button--active');
};

const initFilters = (photos, onUpdate) => {
  const debouncedUpdate = debounce(onUpdate, DEBOUNCE_DELAY);

  const handleFilterClick = (evt) => {
    const target = evt.target;
    if (!target.classList.contains('img-filters__button')) {
      return;
    }

    setActiveButton(target);

    switch (target.id) {
      case FILTER.DEFAULT:
        debouncedUpdate(photos);
        break;
      case FILTER.RANDOM:
        debouncedUpdate(getRandomSubset(photos, RANDOM_COUNT));
        break;
      case FILTER.DISCUSSED:
        debouncedUpdate(getDiscussed(photos));
        break;
    }
  };

  imgFilters.addEventListener('click', handleFilterClick);
};

export { initFilters };
