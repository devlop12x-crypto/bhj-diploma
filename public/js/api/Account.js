/**
 * Класс Account наследуется от Entity.
 * Управляет счетами пользователя.
 * Имеет свойство URL со значением '/account'
 * */
class Account extends Entity {
  /**
   * Указываем базовый URL для всех запросов со счетами
   * */
  static URL = '/account';

  /**
   * Получает информацию о счёте
   * Обращается к /account/:id с GET-запросом
   * */
  static get(id, callback) {
    if (!id) {
      callback?.(new Error('ID счёта обязателен'), null);
      return null;
    }

    return createRequest({
      url: `${this.URL}/${encodeURIComponent(id)}`,
      method: 'GET',
      callback,
    });
  }
}