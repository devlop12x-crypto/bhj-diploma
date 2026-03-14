/**
 * Основная функция для совершения запросов
 * на сервер.
 * */
const createRequest = (options = {}) => {
  const {
    url,
    data,
    method = 'GET',
    callback,
    headers = {},
    timeout = 30000,
    withCredentials = false,
  } = options;

  if (!url) {
    callback?.(new Error('URL обязателен'), null);
    return null;
  }

  const xhr = new XMLHttpRequest();

  let requestUrl = url;
  let body = null;

  if (data) {
    if (method === 'GET') {
      // Современный способ формирования query-строки
      requestUrl += `?${new URLSearchParams(data).toString()}`;
    } else {
      body = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        body.append(key, value);
      });
    }
  }

  // Обработка ответа с проверкой статуса и наличия callback
  xhr.onload = () => {
    const isSuccess = xhr.status >= 200 && xhr.status < 300;

    if (isSuccess) {
      callback?.(null, xhr.response);
    } else {
      // Передаем xhr.response даже при ошибке, т.к. бэкенд может вернуть описание ошибки в JSON
      callback?.(new Error(`Ошибка сервера: ${xhr.status}`), xhr.response);
    }
  };

  // Обработка сетевой ошибки (отсутствие интернета, CORS и т.д.)
  xhr.onerror = () => callback?.(new Error('Сетевая ошибка'), null);

  // Обработка таймаута
  xhr.ontimeout = () => callback?.(new Error('Превышено время ожидания'), null);

  try {
    // Сначала open(), затем настройка свойств — порядок важен для XHR!
    xhr.open(method, requestUrl);

    xhr.responseType = 'json';
    xhr.timeout = timeout;
    xhr.withCredentials = withCredentials;

    // Устанавливаем заголовки после open()
    Object.entries(headers).forEach(([key, value]) => {
      xhr.setRequestHeader(key, value);
    });

    xhr.send(body);
  } catch (error) {
    // Перехват критической ошибки
    callback?.(error, null);
    return null;
  }

  return xhr;
};