const GET_URL = 'https://31.javascript.htmlacademy.pro/kekstagram/data';
const POST_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';

const getData = async () => {
  const response = await fetch(GET_URL);
  if (!response.ok) {
    throw new Error(`Ошибка загрузки данных: ${response.status}`);
  }
  return await response.json();
};

const sendData = async (formData) => {
  const response = await fetch(POST_URL, {
    method: 'POST',
    body: formData,
  });
  if (!response.ok) {
    throw new Error(`Ошибка отправки данных: ${response.status}`);
  }
  return await response.json();
};

export {getData, sendData};
