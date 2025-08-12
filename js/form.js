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
const submitButton = document.querySelector('.img-upload__submit');

const imgPreview = document.querySelector('.img-upload__preview img');
const effectsPreviews = document.querySelectorAll('.effects__preview');

const DEFAULT_PREVIEW_SRC = imgPreview.src;
const objectUrlManager = makeObjectUrlManager();

let pristineInstance = null;

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

const validateComment = (value) => value.length <= MAX_COMMENT_LENGTH;

const validateFileType = () => {
  const file = uploadFileInput.files && uploadFileInput.files[0];
  if (!file) {
    return true;
  }
  return isAllowedFileType(file.name, FILE_TYPES);
};

const initPristine = () => {
  if (pristineInstance && typeof pristineInstance.destroy === 'function') {
    pristineInstance.destroy();
  }

  pristineInstance = new Pristine(form, {
    classTo: 'img-upload__field-wrapper',
    errorTextParent: 'img-upload__field-wrapper',
    errorTextTag: 'div',
    errorTextClass: 'img-upload__field-wrapper--error'
  });


  pristineInstance.addValidator(
    uploadFileInput,
    () => validateFileType(),
    'Можно загрузить только изображение (jpg, jpeg, png, gif, webp).'
  );

  pristineInstance.addValidator(
    hashtagInput,
    validateHashtags,
    `Не более ${MAX_HASHTAG_COUNT} хэштегов, без повторов, начинаются с # и содержат только буквы и цифры`
  );

  pristineInstance.addValidator(
    commentInput,
    validateComment,
    `Длина комментария не должна превышать ${MAX_COMMENT_LENGTH} символов`
  );
};

const uploadModal = {};
uploadModal.onDocumentKeydown = (evt) => {
  if (evt.key === 'Escape') {
    if (document.activeElement === hashtagInput || document.activeElement === commentInput) {
      return;
    }
    if (document.querySelector('.success, .error')) {
      return;
    }
    if (!overlay.classList.contains('hidden')) {
      evt.preventDefault();
      uploadModal.close();
    }
  }
};

uploadModal.open = () => {
  overlay.classList.remove('hidden');
  document.body.classList.add('modal-open');
  resetAll();

  if (!pristineInstance) {
    initPristine();
  } else if (typeof pristineInstance.reset === 'function') {
    pristineInstance.reset();
  }
  document.addEventListener('keydown', uploadModal.onDocumentKeydown);
};

uploadModal.close = () => {
  overlay.classList.add('hidden');
  document.body.classList.remove('modal-open');
  form.reset();
  if (pristineInstance && typeof pristineInstance.destroy === 'function') {
    pristineInstance.destroy();
  }
  pristineInstance = null;
  resetAll();

  objectUrlManager.revoke();
  imgPreview.src = DEFAULT_PREVIEW_SRC;
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = '';
  });

  uploadFileInput.value = '';
  document.removeEventListener('keydown', uploadModal.onDocumentKeydown);
};

uploadFileInput.addEventListener('change', () => {
  const file = uploadFileInput.files && uploadFileInput.files[0];
  if (!file) {
    return;
  }

  if (!validateFileType()) {
    if (pristineInstance && typeof pristineInstance.validate === 'function') {
      pristineInstance.validate(uploadFileInput);
    }
    uploadFileInput.value = '';
    return;
  }

  if (!pristineInstance) {
    initPristine();
  }

  const objectUrl = objectUrlManager.setFromFile(file);

  imgPreview.src = objectUrl;
  effectsPreviews.forEach((preview) => {
    preview.style.backgroundImage = `url("${objectUrl}")`;
  });

  if (typeof pristineInstance.reset === 'function') {
    pristineInstance.reset();
  }
  if (typeof pristineInstance.validate === 'function') {
    pristineInstance.validate();
  }

  uploadModal.open();
});

cancelButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  uploadModal.close();
});

form.addEventListener('input', () => {
  if (pristineInstance && typeof pristineInstance.validate === 'function') {
    pristineInstance.validate();
  }
});

const showSuccessMessage = () => showMessage('#success');
const showErrorMessage = () => showMessage('#error');

form.addEventListener('submit', (evt) => {
  evt.preventDefault();

  const isValid = pristineInstance ? pristineInstance.validate() : false;
  if (!isValid) {
    return;
  }

  submitButton.disabled = true;

  const formData = new FormData(form);

  sendData(formData)
    .then(() => {
      uploadModal.close();
      showSuccessMessage();
    })
    .catch(() => {
      showErrorMessage();
    })
    .finally(() => {
      submitButton.disabled = false;
    });
});
