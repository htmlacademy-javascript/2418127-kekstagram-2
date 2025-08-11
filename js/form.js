import {resetAll} from './image-effects.js';
import {sendData} from './api.js';
import { FILE_TYPES, isAllowedFileType, makeObjectUrlManager, showMessage } from './util.js';


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


const imgPreview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');


const DEFAULT_PREVIEW_SRC = imgPreview.src;
const objectUrlManager = makeObjectUrlManager();


const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextTag: 'div',
  errorTextClass: 'img-upload__field-wrapper--error'
});


const openModal = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  resetAll(); // чтобы убрать слайдер для эффекта Оригинал при первом открытии
};


const closeModal = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  form.reset();
  pristine.reset();
  resetAll();


  // Сброс предпросмотра и освобождение URL
  objectUrlManager.revoke();
  imgPreview.src = DEFAULT_PREVIEW_SRC;
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = '';
  });


  uploadFileInput.value = '';
};


// Валидация типа файла через Pristine
const validateFileType = () => {
  const file = uploadFileInput.files && uploadFileInput.files[0];
  if (!file) {
    return true;
  }
  return isAllowedFileType(file.name, FILE_TYPES);
};


pristine.addValidator(
  uploadFileInput,
  validateFileType,
  'Можно загрузить только изображение (jpg, jpeg, png, gif, webp).'
);


uploadFileInput.addEventListener('change', () => {
  const file = uploadFileInput.files && uploadFileInput.files[0];
  if (!file) {
    return;
  }


  if (!validateFileType()) {
    pristine.validate(uploadFileInput); // показать ошибку у поля
    uploadFileInput.value = '';
    return;
  }


  const objectUrl = objectUrlManager.setFromFile(file);


  imgPreview.src = objectUrl;
  effectsPreviews.forEach((preview) => {
    // Важно: формируем строку CSS, а не вызываем "url" как функцию
    preview.style.backgroundImage = `url("${ objectUrl }")`;
  });


  openModal();
});


cancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  closeModal();
});


document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    // Если фокус в полях ввода — не закрываем модалку
    if (document.activeElement === hashtagInput || document.activeElement === commentInput) {
      return;
    }
    // Если показано сообщение успеха/ошибки — Esc обрабатывается там
    if (document.querySelector('.success, .error')) {
      return;
    }
    // Закрываем модалку только если она открыта
    if (!overlay.classList.contains('hidden')) {
      evt.preventDefault();
      closeModal();
    }
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
