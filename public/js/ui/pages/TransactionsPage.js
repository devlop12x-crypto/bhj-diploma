/**
 * Класс TransactionsPage управляет
 * страницей отображения доходов и
 * расходов конкретного счёта
 * */
class TransactionsPage {
  static SELECTORS = {
    CONTENT: '.content',
    CONTENT_TITLE: '.content-title',
    REMOVE_ACCOUNT: '.remove-account',
    REMOVE_TRANSACTION: '.transaction__remove',
  };

  static MESSAGES = {
    CONFIRM_DELETE_ACCOUNT: 'Вы действительно хотите удалить счёт?',
    CONFIRM_DELETE_TRANSACTION: 'Вы действительно хотите удалить эту транзакцию?',
    DEFAULT_TITLE: 'Название счёта',
  };

  /**
   * Если переданный элемент не существует,
   * выбрасывает ошибку.
   * Сохраняет переданный элемент и регистрирует события
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент не передан в конструктор TransactionsPage');
    }

    this.element = element;
    this.lastOptions = null;
    this.registerEvents();
  }

  /**
   * Вызывает метод render для отрисовки страницы
   * Если render был вызван ранее, передает сохраненные опции
   * */
  update() {
    if (this.lastOptions) {
      this.render(this.lastOptions);
    }
  }

  /**
   * Отслеживает нажатие на кнопку удаления транзакции
   * и удаления самого счёта. Внутри вызывает
   * removeTransaction и removeAccount соответственно
   * */
  registerEvents() {
    this.element.addEventListener('click', (e) => {
      const removeAccountBtn = e.target.closest(TransactionsPage.SELECTORS.REMOVE_ACCOUNT);
      if (removeAccountBtn) {
        this.removeAccount();
        return;
      }

      const removeTransactionBtn = e.target.closest(TransactionsPage.SELECTORS.REMOVE_TRANSACTION);
      if (removeTransactionBtn) {
        const id = removeTransactionBtn.dataset.id;
        if (id) {
          this.removeTransaction(id);
        }
      }
    });
  }

  /**
   * Универсальный метод удаления с подтверждением
   * */
  #confirmAndRemove(message, removeCallback, onSuccess) {
    if (!confirm(message)) return;

    removeCallback((err, response) => {
      if (err || !response?.success) return;
      onSuccess?.();
      App.update();
    });
  }

  /**
   * Удаляет счёт. Необходимо показать
   * диалоговое окно (с помощью confirm).
   * Если пользователь согласен, удаляет счет через Account.remove, 
   * а затем вызывает App.update().
   * */
  removeAccount() {
    if (!this.lastOptions) return;

    const id = this.lastOptions.account_id;

    this.#confirmAndRemove(
      TransactionsPage.MESSAGES.CONFIRM_DELETE_ACCOUNT,
      (callback) => Account.remove({ id }, callback),
      () => this.clear()
    );
  }

  /**
   * Удаляет транзакцию (доход или расход).
   * Требует подтверждения действия (confirm).
   * По успешному удалению вызывает App.update().
   * */
  removeTransaction(id) {
    this.#confirmAndRemove(
      TransactionsPage.MESSAGES.CONFIRM_DELETE_TRANSACTION,
      (callback) => Transaction.remove({ id }, callback)
    );
  }

  /**
   * С помощью Account.get() получает название счёта и отображает
   * его через renderTitle().
   * Получает список Transaction.list и полученные данные передает
   * в renderTransactions().
   * */
  render(options) {
    if (!options) return;
    this.lastOptions = options;

    const { account_id } = options;

    Account.get(account_id, (err, response) => {
      if (response?.success && response.data) {
        const accountData = Array.isArray(response.data)
          ? response.data.find(a => a.id === account_id)
          : response.data;
        if (accountData) {
          this.renderTitle(accountData.name);
        }
      }
    });

    Transaction.list({ account_id }, (err, response) => {
      if (response?.success && response.data) {
        this.renderTransactions(response.data);
      }
    });
  }

  /**
   * Очищает страницу: вызывает renderTransactions() с пустым массивом
   * и устанавливает стандартный заголовок.
   * */
  clear() {
    this.renderTransactions([]);
    this.renderTitle(TransactionsPage.MESSAGES.DEFAULT_TITLE);
    this.lastOptions = null;
  }

  /**
   * Устанавливает заголовок в элемент .content-title
   * */
  renderTitle(name) {
    const titleEl = this.element.querySelector(TransactionsPage.SELECTORS.CONTENT_TITLE);
    if (titleEl) {
      titleEl.textContent = name;
    }
  }

  /**
   * Форматирует дату в формат «10 марта 2019 г. в 03:20»
   * */
  formatDate(dateStr) {
    const date = new Date(dateStr.replace(' ', 'T'));

    const optionsDate = { day: 'numeric', month: 'long', year: 'numeric' };
    const optionsTime = { hour: '2-digit', minute: '2-digit' };

    const formattedDate = date.toLocaleDateString('ru-RU', optionsDate);
    const formattedTime = date.toLocaleTimeString('ru-RU', optionsTime);

    return `${formattedDate} в ${formattedTime}`;
  }

  /**
   * Безопасно экранирует HTML-сущности
   * */
  #escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  /**
   * Формирует HTML-код транзакции (дохода или расхода).
   * */
  getTransactionHTML(item) {
    const typeClass = item.type.toLowerCase() === 'expense'
      ? 'transaction_expense'
      : 'transaction_income';

    const safeName = this.#escapeHtml(item.name);
    const safeSum = this.#escapeHtml(String(item.sum));
    const safeId = this.#escapeHtml(String(item.id));

    return `
      <div class="transaction ${typeClass} row">
          <div class="col-md-7 transaction__details">
            <div class="transaction__icon">
                <span class="fa fa-money fa-2x"></span>
            </div>
            <div class="transaction__info">
                <h4 class="transaction__title">${safeName}</h4>
                <div class="transaction__date">${this.formatDate(item.created_at)}</div>
            </div>
          </div>
          <div class="col-md-3">
            <div class="transaction__summ">
                ${safeSum} <span class="currency">₽</span>
            </div>
          </div>
          <div class="col-md-2 transaction__controls">
              <button class="btn btn-danger transaction__remove" data-id="${safeId}">
                  <i class="fa fa-trash"></i>  
              </button>
          </div>
      </div>
    `;
  }

  /**
   * Отрисовывает список транзакций на странице
   * используя getTransactionHTML
   * */
  renderTransactions(data) {
    const contentEl = this.element.querySelector(TransactionsPage.SELECTORS.CONTENT);
    if (!contentEl) return;

    if (!Array.isArray(data) || data.length === 0) {
      contentEl.innerHTML = '';
      return;
    }

    contentEl.innerHTML = data
      .map(item => this.getTransactionHTML(item))
      .join('');
  }
}