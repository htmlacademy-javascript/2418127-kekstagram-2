const BASE_URL = 'https://31.javascript.htmlacademy.pro/kekstagram';
const Route = {
  GET_DATA: '/data',
  SEND_DATA: '/',
};

const Method = {
  GET: 'GET',
  POST: 'POST',
};

const load = async (route, method = Method.GET, body = null) => {
  const options = { method };
  if (method === Method.POST && body !== null) {
    options.body = body;
  }

  const response = await fetch(`${BASE_URL}${route}`, options);

  if (!response.ok) {
    throw new Error(`Произошла ошибка ${response.status}: ${response.statusText}`);
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('json')) {
    return await response.json();
  }


};

const getData = () => load(Route.GET_DATA);
const sendData = (body) => load(Route.SEND_DATA, Method.POST, body);

export { getData, sendData };
