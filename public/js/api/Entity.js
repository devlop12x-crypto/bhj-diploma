/**
 * Класс Entity - базовый для взаимодействия с сервером.
 * Имеет свойство URL, равно пустой строке.
 * */
class Entity {
  static URL = '';

  static METHODS = {
    LIST: 'GET',
    CREATE: 'PUT',
    REMOVE: 'DELETE',
  };

  static ERRORS = {
    NO_URL: 'URL не задан (вызов абстрактного класса)',
  };

  /**
   * Внутренний метод для выполнения запросов.
   * Начинается с подчеркивания (protected-соглашение).
   * */
  static _request(method, data, callback) {
    if (!this.URL) {
      callback?.(new Error(Entity.ERRORS.NO_URL), null);
      return null;
    }

    return createRequest({ 
      url: this.URL, 
      method, 
      data, 
      callback,
    });
  }

  /**
   * Запрашивает с сервера список данных.
   * */
  static list(data, callback) {
    // Меняем #request на _request
    return this._request(Entity.METHODS.LIST, data, callback);
  }

  /**
   * Создаёт счёт или доход/расход.
   * */
  static create(data, callback) {
    // Меняем #request на _request
    return this._request(Entity.METHODS.CREATE, data, callback);
  }

  /**
   * Удаляет информацию о счёте или доходе/расходе.
   * */
  static remove(data, callback) {
    // Меняем #request на _request
    return this._request(Entity.METHODS.REMOVE, data, callback);
  }
}