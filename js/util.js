const debounce = (callback, timeoutDelay = 500) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => callback(...args), timeoutDelay);
  };
};

const getRandomSubset = (arr, count) => {
  const copy = arr.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  if (typeof count === 'number') {
    return copy.slice(0, Math.min(count, copy.length));
  }
  return copy;
};

const getDiscussed = (arr) => arr.slice().sort((a, b) => b.comments.length - a.comments.length);

const FILE_TYPES = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

const isAllowedFileType = (fileName, allowed = FILE_TYPES) => {
  const lower = String(fileName || '').toLowerCase();
  return allowed.some((ext) => lower.endsWith(ext));
};

const makeObjectUrlManager = () => {
  let current = '';
  return {
    get: () => current,
    setFromFile: (file) => {
      if (!file) {
        return '';
      }
      if (current) {
        URL.revokeObjectURL(current);
      }
      current = URL.createObjectURL(file);
      return current;
    },
    revoke: () => {
      if (current) {
        URL.revokeObjectURL(current);
        current = '';
      }
    }
  };
};

const showMessage = (templateId) => {
  const blockName = String(templateId || '').replace(/^#/, '');
  if (!blockName) {
    return;
  }


  const template = document.querySelector(templateId);
  if (!template || !template.content) {
    return;
  }


  const rootFromTemplate = template.content.querySelector(`.${ blockName}`);
  if (!rootFromTemplate) {
    return;
  }


  const messageElement = rootFromTemplate.cloneNode(true);
  messageElement.style.display = 'block';
  messageElement.classList.remove('hidden');
  document.body.appendChild(messageElement);


  const closeButton = messageElement.querySelector(`.${ blockName }__button`);
  const inner = messageElement.querySelector(`.${ blockName }__inner`);


  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape') {
      if (evt.stopImmediatePropagation) {
        evt.stopImmediatePropagation();
      }
      if (evt.stopPropagation) {
        evt.stopPropagation();
      }
      evt.preventDefault();
      closeMessage();
    }
  };


  const onClickOutside = (evt) => {
    const clickedInsideInner = inner && evt.target.closest(`.${ blockName }__inner`);
    if (!clickedInsideInner) {
      if (evt.stopImmediatePropagation) {
        evt.stopImmediatePropagation();
      }
      if (evt.stopPropagation) {
        evt.stopPropagation();
      }
      closeMessage();
    }
  };


  function closeMessage() {
    messageElement.remove();
    document.removeEventListener('keydown', onEscKeyDown);
    document.removeEventListener('click', onClickOutside);
    if (closeButton) {
      closeButton.removeEventListener('click', closeMessage);
    }
  }


  if (closeButton) {
    closeButton.addEventListener('click', closeMessage);
  }
  document.addEventListener('keydown', onEscKeyDown);
  document.addEventListener('click', onClickOutside);
};


export {
  debounce,
  getRandomSubset,
  getDiscussed,
  FILE_TYPES,
  isAllowedFileType,
  makeObjectUrlManager,
  showMessage
};
