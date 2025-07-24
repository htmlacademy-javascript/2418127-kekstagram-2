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

const COMMENTS_SIZE = 5;

let currentComments = [];
let commentsShownNow = 0;

function renderComments() {
  const nextComments = currentComments.slice(commentsShownNow, commentsShownNow + COMMENTS_SIZE);

  nextComments.forEach(({avatar, name, message}) => {
    const li = document.createElement('li');
    li.classList.add('social__comment');

    const img = document.createElement('img');
    img.classList.add('social__picture');
    img.src = avatar;
    img.alt = name;
    img.width = 35;
    img.height = 35;

    const p = document.createElement('p');
    p.classList.add('social__text');
    p.textContent = message;

    li.appendChild(img);
    li.appendChild(p);
    commentsContainer.appendChild(li);
  });

  commentsShownNow += nextComments.length;
  commentShownCount.textContent = commentsShownNow;

  if (commentsShownNow >= currentComments.length) {
    commentsLoader.classList.add('hidden');
  } else {
    commentsLoader.classList.remove('hidden');
  }
}

function openBigPicture({url, description, likes, comments}) {
  bigPicture.classList.remove('hidden');
  bigPictureImg.src = url;
  bigPictureImg.alt = description;
  likesCount.textContent = likes;
  commentTotalCount.textContent = comments.length;
  socialCaption.textContent = description;

  commentCountBlock.classList.remove('hidden');
  commentsLoader.classList.remove('hidden');

  commentsContainer.innerHTML = '';

  currentComments = comments;
  commentsShownNow = 0;

  renderComments();

  document.body.classList.add('modal-open');
}

function closeBigPicture() {
  bigPicture.classList.add('hidden');
  document.body.classList.remove('modal-open');
}

closeButton.addEventListener('click', closeBigPicture);

document.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape' && !bigPicture.classList.contains('hidden')) {
    closeBigPicture();
  }
});

commentsLoader.addEventListener('click', () => {
  renderComments();
});

export {openBigPicture, closeBigPicture};
