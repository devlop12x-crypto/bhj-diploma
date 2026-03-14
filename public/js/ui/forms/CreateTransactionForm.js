/**
 * Класс CreateTransactionForm управляет формой
 * создания новой транзакции
 * */
class CreateTransactionForm extends AsyncForm {
  static ERRORS = {
    CREATE_FAILED: 'Ошибка при создании транзакции.',
    LOAD_ACCOUNTS_FAILED: 'Не удалось загрузить список счетов.',
  };

  /**
   * Вызывает родительский конструктор и
   * метод renderAccountsList
   * */
  constructor(element) {
    super(element);
    this.select = this.element.querySelector('.accounts-select');
    this.renderAccountsList();
  }

  /**
   * Получает список счетов с помощью Account.list
   * Обновляет в форме всплывающего окна выпадающий список
   * */
  renderAccountsList() {
    if (!this.select) return;

    // Делаем запрос только если пользователь авторизован
    const user = User.current();
    if (!user) return;

    Account.list({}, (err, response) => {
      if (err || !response?.success) {
        this.showError(CreateTransactionForm.ERRORS.LOAD_ACCOUNTS_FAILED);
        return;
      }

      this.#populateSelect(response.data);
    });
  }

  /**
   * Безопасно заполняет select элементами option
   * */
  #populateSelect(accounts) {
    this.select.innerHTML = '';
    accounts.forEach(({ id, name }) => {
      const option = document.createElement('option');
      option.value = id;
      option.textContent = name;
      this.select.append(option);
    });
  }

  /**
   * Создаёт новую транзакцию (доход или расход)
   * с помощью Transaction.create. По успешному результату
   * вызывает App.update(), сбрасывает форму и закрывает окно
   * */
  onSubmit(data) {
    this.setLoading(true);

    try {
      Transaction.create(data, (err, response) => {
        this.setLoading(false);

        if (err || !response?.success) {
          this.showError(response?.error ?? CreateTransactionForm.ERRORS.CREATE_FAILED);
          return;
        }

        this.#onSuccess();
      });
    } catch {
      this.setLoading(false);
      this.showError(CreateTransactionForm.ERRORS.CREATE_FAILED);
    }
  }

  /**
   * Обрабатывает успешное создание транзакции
   * */
  #onSuccess() {
    this.element.reset();
    this.#closeParentModal();
    App.update();
  }

  /**
   * Находит и закрывает родительское модальное окно
   * */
  #closeParentModal() {
    const modalId = this.element.closest('.modal')?.dataset?.modalId;
    App.getModal(modalId)?.close();
  }
}