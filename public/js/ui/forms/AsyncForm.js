/**
 * Класс AsyncForm управляет всеми формами
 * приложения, которые не должны быть отправлены с
 * перезагрузкой страницы.
 * */
class AsyncForm {
  static SELECTORS = {
    SUBMIT_BTN: '[type="submit"]',
    ERROR_MESSAGE: '.error-message',
  };

  /**
   * Если переданный элемент не существует,
   * выбрасывает ошибку.
   * Сохраняет переданный элемент и регистрирует события.
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент формы не передан в конструктор AsyncForm');
    }
    
    this.element = element;
    this.submitBtn = element.querySelector(AsyncForm.SELECTORS.SUBMIT_BTN);
    this.errorEl = element.querySelector(AsyncForm.SELECTORS.ERROR_MESSAGE);
    
    // Биндим обработчик для возможности удаления
    this.handleSubmit = this.handleSubmit.bind(this);
    this.registerEvents();
  }

  /**
   * Запрещает отправку формы по умолчанию и
   * предотвращает перезагрузку страницы.
   * После попытки отправки вызывает метод submit().
   * */
  registerEvents() {
    this.element.addEventListener('submit', this.handleSubmit);
  }

  /**
   * Обработчик события submit
   * */
  handleSubmit(event) {
    event.preventDefault();
    this.submit();
  }

  /**
   * Преобразует данные формы в объект вида
   * { 'название поля': 'значение поля' }
   * */
  getData() {
    const formData = new FormData(this.element);
    return Object.fromEntries(formData.entries());
  }

  /**
   * Вызывает метод onSubmit и передаёт туда
   * данные, полученные из метода getData().
   * */
  submit() {
    // Проверяем HTML5 валидацию
    if (!this.element.checkValidity()) {
      this.element.reportValidity();
      return;
    }

    this.clearError();
    const data = this.getData();
    this.onSubmit(data);
  }

  /**
   * Управляет состоянием кнопки отправки (защита от двойного клика)
   * */
  setLoading(isLoading) {
    if (this.submitBtn) {
      this.submitBtn.disabled = isLoading;
    }
  }

  /**
   * Выводит сообщение об ошибке пользователю
   * */
  showError(message) {
    if (this.errorEl) {
      this.errorEl.textContent = message;
    } else {
      alert(message);
    }
  }

  /**
   * Очищает сообщение об ошибке
   * */
  clearError() {
    if (this.errorEl) {
      this.errorEl.textContent = '';
    }
  }

  /**
   * Удаляет обработчики событий
   * */
  destroy() {
    this.element.removeEventListener('submit', this.handleSubmit);
  }

  /**
   * Метод должен быть переопределен в дочерних классах.
   * */
  onSubmit(data) {
    throw new Error('Метод onSubmit должен быть переопределён в дочернем классе');
  }
}