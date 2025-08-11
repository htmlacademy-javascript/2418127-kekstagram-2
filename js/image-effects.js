const SCALE_STEP = 25;
const SCALE_MIN = 25;
const SCALE_MAX = 100;
const SCALE_DEFAULT = 100;

const SLIDER_DEFAULT_MIN = 0;
const SLIDER_DEFAULT_MAX = 100;
const SLIDER_DEFAULT_START = 100;
const SLIDER_DEFAULT_STEP = 1;

const imgUploadPreview = document.querySelector('.img-upload__preview img');
const scaleControlSmaller = document.querySelector('.scale__control--smaller');
const scaleControlBigger = document.querySelector('.scale__control--bigger');
const scaleControlValue = document.querySelector('.scale__control--value');

const effectLevel = document.querySelector('.img-upload__effect-level');
const effectLevelSlider = effectLevel.querySelector('.effect-level__slider');
const effectLevelValue = effectLevel.querySelector('.effect-level__value');

const effectsList = document.querySelector('.effects__list');

function createEffect({name, filter, min, max, step, unit = '', start, sliderVisible}) {
  return {
    name,
    filter,
    min,
    max,
    step,
    unit,
    start,
    sliderVisible,
    apply: (value) => {
      if (name === 'none') {
        imgUploadPreview.style.filter = '';
      } else {
        imgUploadPreview.style.filter = `${filter}(${value}${unit})`;
      }
    }
  };
}

const EFFECTS = {
  none: createEffect({
    name: 'none',
    filter: '',
    min: 0,
    max: 100,
    step: 1,
    start: 100,
    sliderVisible: false,
  }),
  chrome: createEffect({
    name: 'chrome',
    filter: 'grayscale',
    min: 0,
    max: 1,
    step: 0.1,
    start: 1,
    sliderVisible: true,
  }),
  sepia: createEffect({
    name: 'sepia',
    filter: 'sepia',
    min: 0,
    max: 1,
    step: 0.1,
    start: 1,
    sliderVisible: true,
  }),
  marvin: createEffect({
    name: 'marvin',
    filter: 'invert',
    min: 0,
    max: 100,
    step: 1,
    unit: '%',
    start: 100,
    sliderVisible: true,
  }),
  phobos: createEffect({
    name: 'phobos',
    filter: 'blur',
    min: 0,
    max: 3,
    step: 0.1,
    unit: 'px',
    start: 3,
    sliderVisible: true,
  }),
  heat: createEffect({
    name: 'heat',
    filter: 'brightness',
    min: 1,
    max: 3,
    step: 0.1,
    start: 3,
    sliderVisible: true,
  }),
};

let currentEffect = EFFECTS.none;

function setScale(value) {
  scaleControlValue.value = `${value}%`;
  imgUploadPreview.style.transform = `scale(${value / 100})`;
}
setScale(SCALE_DEFAULT);

scaleControlSmaller.addEventListener('click', () => {
  const currentValue = parseInt(scaleControlValue.value, 10);
  if (currentValue > SCALE_MIN) {
    setScale(currentValue - SCALE_STEP);
  }
});

scaleControlBigger.addEventListener('click', () => {
  const currentValue = parseInt(scaleControlValue.value, 10);
  if (currentValue < SCALE_MAX) {
    setScale(currentValue + SCALE_STEP);
  }
});

noUiSlider.create(effectLevelSlider, {
  range: { min: SLIDER_DEFAULT_MIN, max: SLIDER_DEFAULT_MAX },
  start: SLIDER_DEFAULT_START,
  step: SLIDER_DEFAULT_STEP,
  connect: 'lower',
  format: {
    to: (value) => Number.isInteger(value) ? value.toString() : value.toFixed(1),
    from: (value) => parseFloat(value),
  }
});

effectLevelSlider.noUiSlider.on('update', (values, handle) => {
  const value = values[handle];
  effectLevelValue.value = value;
  currentEffect.apply(value);
});

function resetEffectLevel() {
  effectLevelValue.value = currentEffect.start;
  effectLevelSlider.noUiSlider.updateOptions({
    range: { min: currentEffect.min, max: currentEffect.max },
    start: [currentEffect.start],
    step: currentEffect.step,
  });
  effectLevel.style.display = currentEffect.sliderVisible ? 'block' : 'none';
  currentEffect.apply(currentEffect.start);
}

effectsList.addEventListener('change', (evt) => {
  if (!evt.target.classList.contains('effects__radio')) {
    return;
  }
  const effectName = evt.target.value;
  currentEffect = EFFECTS[effectName] || EFFECTS.none;
  resetEffectLevel();
});

function resetAll() {
  setScale(SCALE_DEFAULT);
  currentEffect = EFFECTS.none;
  resetEffectLevel();

  const checkedRadio = effectsList.querySelector('.effects__radio:checked');
  if (checkedRadio) {
    checkedRadio.checked = false;
  }
  const originalRadio = effectsList.querySelector('.effects__radio[value="none"]');
  if (originalRadio) {
    originalRadio.checked = true;
  }
}

export {resetAll};
