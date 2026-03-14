/**
 * Класс UserWidget отвечает за отображение
 * информации о текущем пользователе
 */
class UserWidget {
  static SELECTORS = {
    USER_NAME: '.user-name',
  };

  /**
   * @param {HTMLElement} element - Корневой элемент виджета
   * @throws {Error} Если element не передан
   */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент не передан в конструктор UserWidget');
    }

    this.element = element;
    this.nameElement = element.querySelector(UserWidget.SELECTORS.USER_NAME);
  }

  /**
   * Обновляет отображение имени пользователя.
   * Очищает имя, если пользователь не авторизован.
   */
  update() {
    if (!this.nameElement) return;

    const user = User.current();
    this.nameElement.textContent = user?.name ?? '';
  }
}