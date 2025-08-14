import { debounce, getRandomSubset, getDiscussed } from './util.js';


const FILTER = {
  DEFAULT: 'filter-default',
  RANDOM: 'filter-random',
  DISCUSSED: 'filter-discussed',
};


const RANDOM_COUNT = 10;
const DEBOUNCE_DELAY = 500;


const initFilters = (photos, onUpdate) => {
  const imgFilters = document.querySelector('.img-filters');
  if (!imgFilters) {
    return;
  }

  const filterButtons = imgFilters.querySelectorAll('.img-filters__button');

  imgFilters.classList.remove('img-filters--inactive');


  const setActiveButton = (button) => {
    filterButtons.forEach((btn) => btn.classList.remove('img-filters__button--active'));
    button.classList.add('img-filters__button--active');
  };


  const debouncedUpdate = debounce(onUpdate, DEBOUNCE_DELAY);


  const onFilterClick = (evt) => {
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


  imgFilters.addEventListener('click', onFilterClick);
};


export { initFilters };
