/**
 * Класс CreateAccountForm управляет формой
 * создания нового счёта
 * */
class CreateAccountForm extends AsyncForm {
  static MODAL_NAME = 'newAccount';
  static ERRORS = {
    CREATE_FAILED: 'Ошибка при создании счёта.',
    INVALID_NAME: 'Название счёта обязательно.',
  };

  /**
   * Создаёт счёт с помощью Account.create и обновляет
   * данные в приложении, вызывая App.update()
   * */
  onSubmit(data) {
    if (!this.#validate(data)) return;

    this.setLoading(true);

    try {
      Account.create(data, (err, response) => {
        this.setLoading(false);

        if (err || !response?.success) {
          this.showError(response?.error ?? CreateAccountForm.ERRORS.CREATE_FAILED);
          return;
        }

        this.#onSuccess();
      });
    } catch (error) {
      // Защита от синхронных исключений в логике отправки
      console.error('Синхронная ошибка при создании счета:', error);
      this.setLoading(false);
      this.showError(CreateAccountForm.ERRORS.CREATE_FAILED);
    }
  }

  /**
   * Приватный метод для базовой валидации данных
   */
  #validate(data) {
    if (!data?.name?.trim()) {
      this.showError(CreateAccountForm.ERRORS.INVALID_NAME);
      return false;
    }
    return true;
  }

  /**
   * Приватный метод, выполняемый при успешном ответе сервера
   */
  #onSuccess() {
    this.element.reset();
    App.getModal(CreateAccountForm.MODAL_NAME)?.close();
    App.update();
  }
}