/**
 * Класс User управляет авторизацией, выходом и
 * регистрацией пользователя
 * */
class User {
  static URL = '/user';
  static STORAGE_KEY = 'user';

  static ENDPOINTS = {
    CURRENT: 'current',
    LOGIN: 'login',
    REGISTER: 'register',
    LOGOUT: 'logout',
  };

  /**
   * Устанавливает текущего пользователя в
   * локальном хранилище.
   * */
  static setCurrent(user) {
    try {
      localStorage.setItem(User.STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      // localStorage недоступен (приватный режим, переполнение)
    }
  }

  /**
   * Удаляет информацию об авторизованном
   * пользователе из локального хранилища.
   * */
  static unsetCurrent() {
    try {
      localStorage.removeItem(User.STORAGE_KEY);
    } catch (e) {
      // localStorage недоступен
    }
  }

  /**
   * Возвращает текущего авторизованного пользователя
   * из локального хранилища
   * */
  static current() {
    try {
      const user = localStorage.getItem(User.STORAGE_KEY);
      // возвращаем undefined
      return user ? JSON.parse(user) : undefined;
    } catch (e) {
      return undefined;
    }
  }

  /**
   * Получает информацию о текущем
   * авторизованном пользователе.
   * */
  static fetch(callback) {
    return createRequest({
      url: `${this.URL}/${User.ENDPOINTS.CURRENT}`,
      method: 'GET',
      callback: (err, response) => {
        // При сетевой ошибке не трогаем localStorage
        if (err) {
          callback?.(err, response);
          return;
        }

        if (response?.user) {
          this.setCurrent(response.user);
        } else {
          this.unsetCurrent();
        }
        callback?.(null, response);
      }
    });
  }

  /**
   * Приватный метод для обработки авторизации и регистрации
   * Устраняет дублирование кода
   * */
  static #authRequest(endpoint, data, callback) {
    return createRequest({
      url: `${this.URL}/${endpoint}`,
      method: 'POST',
      data,
      callback: (err, response) => {
        if (response?.user) {
          this.setCurrent(response.user);
        }
        callback?.(err, response);
      }
    });
  }

  /**
   * Производит попытку авторизации.
   * */
  static login(data, callback) {
    return this.#authRequest(User.ENDPOINTS.LOGIN, data, callback);
  }

  /**
   * Производит попытку регистрации пользователя.
   * */
  static register(data, callback) {
    return this.#authRequest(User.ENDPOINTS.REGISTER, data, callback);
  }

  /**
   * Производит выход из приложения.
   * */
  static logout(callback) {
    return createRequest({
      url: `${this.URL}/${User.ENDPOINTS.LOGOUT}`,
      method: 'POST',
      callback: (err, response) => {
        if (response?.success) {
          this.unsetCurrent();
        }
        callback?.(err, response);
      }
    });
  }
}