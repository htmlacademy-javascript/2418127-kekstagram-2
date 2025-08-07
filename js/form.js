import {resetAll} from './image-effects.js';
import {sendData} from './api.js';

const MAX_HASHTAG_COUNT = 5;
const HASHTAG_REGEX = /^#[a-zа-яё0-9]{1,19}$/i;
const MAX_COMMENT_LENGTH = 140;

const overlay = document.querySelector('.img-upload__overlay');
const uploadFileInput = document.querySelector('#upload-file');
const form = document.querySelector('.img-upload__form');
const cancelButton = document.querySelector('#upload-cancel');
const hashtagInput = form.querySelector('.text__hashtags');
const commentInput = form.querySelector('.text__description');
const submitButton = form.querySelector('.img-upload__submit');

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__field-wrapper--error'
});

const openModal = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  resetAll();//чтобы убрать слайдер для эффекта Оригинал при первом открытии
};


const closeModal = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  form.reset();
  pristine.reset();
  resetAll();
  uploadFileInput.value = '';
};

uploadFileInput.addEventListener('change', openModal);
cancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeModal();
});

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    if (document.activeElement === hashtagInput || document.activeElement === commentInput) {
      return;
    }
    if (!overlay.classList.contains('hidden')) {
      return;
    }
    closeModal();
  }
});

const validateHashtags = (value) => {
  if (!value) {
    return true;
  }
  const tags = value.toLowerCase().trim().split(/\s+/).filter((tag) => tag.length > 0);
  if (tags.length > MAX_HASHTAG_COUNT) {
    return false;
  }
  const uniqueTags = new Set(tags);
  if (uniqueTags.size !== tags.length) {
    return false;
  }
  return tags.every((tag) => HASHTAG_REGEX.test(tag));
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

form.addEventListener('input', () => pristine.validate());

const showMessage = (templateId) => {
  const template = document.querySelector(templateId).content.querySelector(`.${templateId.slice(1)}`);
  const messageElement = template.cloneNode(true);
  document.body.appendChild(messageElement);

  const closeButton = messageElement.querySelector(`.${templateId.slice(1)}__button`);

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      closeMessage();
    }
  };

  const onClickOutside = (evt) => {
    if (!evt.target.closest(`.${templateId.slice(1)}__inner`)) {
      closeMessage();
    }
  };

  function closeMessage() {
    messageElement.remove();
    document.removeEventListener('keydown', onEscKeyDown);
    document.removeEventListener('click', onClickOutside);
    closeButton.removeEventListener('click', closeMessage);
  }

  closeButton.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onEscKeyDown);
  document.addEventListener('click', onClickOutside);
};

const showSuccessMessage = () => showMessage('#success');
const showErrorMessage = () => showMessage('#error');

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  if (!pristine.validate()) {
    return;
  }

  submitButton.disabled = true;

  const formData = new FormData(form);

  sendData(formData)
    .then(() => {
      closeModal();
      showSuccessMessage();
    })
    .catch(() => {
      showErrorMessage();
    })
    .finally(() => {
      submitButton.disabled = false;
    });
});
