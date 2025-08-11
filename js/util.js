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


export { debounce, getRandomSubset, getDiscussed };
