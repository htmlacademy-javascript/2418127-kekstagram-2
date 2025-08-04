import {resetAll} from './image-effects';

const MAX_HASHTAG_COUNT = 5;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const MAX_COMMENT_LENGTH = 140;

const overlay = document.querySelector('.img-upload__overlay');
const uploadFileInput = document.querySelector('#upload-file');
const form = document.querySelector('.img-upload__form');
const cancelButton = document.querySelector('#upload-cancel');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__field-wrapper--error'
});

const openModal = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  resetAll();
};

const closeModal = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  form.reset();
  pristine.reset();
  uploadFileInput.value = '';
};

uploadFileInput.addEventListener('change', openModal);

cancelButton.addEventListener('click', closeModal);

function handleKeyDown(evt) {
  if (evt.key === 'Escape') {
    if (
      document.activeElement === hashtagInput ||
      document.activeElement === commentInput
    ) {
      return;
    }
    if (overlay.classList.contains('hidden')) {
      return;
    }
    closeModal();
  }
}

document.addEventListener('keydown', handleKeyDown);

const validateHashtags = (value) => {
  if (!value) {
    return true;
  }
  const tags = value
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter((tag) => tag.length > 0);

  if (tags.length > MAX_HASHTAG_COUNT) {
    return false;
  }

  const uniqueTags = new Set(tags);
  if (uniqueTags.size !== tags.length) {
    return false;
  }

  for (const tag of tags) {
    if (!HASHTAG_REGEX.test(tag)) {
      return false;
    }
  }
  return true;
};

pristine.addValidator(
  hashtagInput,
  validateHashtags,
  `Не более ${MAX_HASHTAG_COUNT} хэштегов, без повторов, начинаются с # и содержат только буквы и цифры`
);


const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

pristine.addValidator(
  commentInput,
  validateComment,
  `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`
);

form.addEventListener('input', pristine.validate);
