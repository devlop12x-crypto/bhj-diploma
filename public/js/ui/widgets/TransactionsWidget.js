/**
 * Класс TransactionsWidget отвечает за
 * открытие всплывающих окон для
 * создания нового дохода или расхода
 * */
class TransactionsWidget {
  static BUTTONS = {
    '.create-income-button': 'newIncome',
    '.create-expense-button': 'newExpense',
  };

  /**
   * Устанавливает полученный элемент
   * в свойство element.
   * Если переданный элемент не существует,
   * выбрасывает ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент не передан в конструктор TransactionsWidget');
    }

    this.element = element;
    this.registerEvents();
  }

  /**
   * Регистрирует обработчики нажатия на
   * кнопки «Новый доход» и «Новый расход».
   * При нажатии вызывает Modal.open() для
   * экземпляра окна.
   * */
  registerEvents() {
    Object.entries(TransactionsWidget.BUTTONS).forEach(([selector, modalName]) => {
      this.element.querySelector(selector)?.addEventListener('click', (e) => {
        e.preventDefault();
        App.getModal(modalName)?.open();
      });
    });
  }
}