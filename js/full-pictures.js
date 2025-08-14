import {isEscapeKey} from './util.js';

const COMMENTS_SIZE = 5;
const COMMENT_AVATAR_SIZE = 35;

const bigPicture = document.querySelector('.big-picture');
const bigPictureImg = bigPicture.querySelector('.big-picture__img img');
const likesCount = bigPicture.querySelector('.likes-count');
const commentShownCount = bigPicture.querySelector('.social__comment-shown-count');
const commentTotalCount = bigPicture.querySelector('.social__comment-total-count');
const commentsContainer = bigPicture.querySelector('.social__comments');
const socialCaption = bigPicture.querySelector('.social__caption');
const commentsLoader = bigPicture.querySelector('.comments-loader');
const commentCountBlock = bigPicture.querySelector('.social__comment-count');
const closeButton = bigPicture.querySelector('.big-picture__cancel');

let currentComments = [];
let commentsShownNow = 0;

const onDocumentKeydown = (evt) => {
  if (isEscapeKey(evt) && !bigPicture.classList.contains('hidden')) {
    closeBigPicture();
  }
};

function renderComments() {
  const nextComments = currentComments.slice(commentsShownNow, commentsShownNow + COMMENTS_SIZE);

  const fragment = document.createDocumentFragment();

  nextComments.forEach((comment) => {
    const li = document.createElement('li');
    li.classList.add('social__comment');

    const img = document.createElement('img');
    img.classList.add('social__picture');
    img.src = comment.avatar;
    img.alt = comment.name;
    img.width = COMMENT_AVATAR_SIZE;
    img.height = COMMENT_AVATAR_SIZE;

    const p = document.createElement('p');
    p.classList.add('social__text');
    p.textContent = comment.message;

    li.appendChild(img);
    li.appendChild(p);
    fragment.appendChild(li);
  });

  commentsContainer.appendChild(fragment);

  commentsShownNow += nextComments.length;
  commentShownCount.textContent = commentsShownNow;

  if (commentsShownNow >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
}

function openBigPicture(photoData) {
  bigPicture.classList.remove('hidden');
  bigPictureImg.src = photoData.url;
  bigPictureImg.alt = photoData.description;
  likesCount.textContent = photoData.likes;
  commentTotalCount.textContent = photoData.comments.length;
  socialCaption.textContent = photoData.description;

  commentCountBlock.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  commentsContainer.innerHTML = '';

  currentComments = photoData.comments;
  commentsShownNow = 0;

  renderComments();

  document.body.classList.add('modal-open');
  document.addEventListener('keydown', onDocumentKeydown);
}

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
  document.removeEventListener('keydown', onDocumentKeydown);
}

closeButton.addEventListener('click', closeBigPicture);

commentsLoader.addEventListener('click', renderComments);

export { openBigPicture, closeBigPicture };
