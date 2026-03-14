/**
 * Класс AccountsWidget управляет блоком
 * отображения счетов в боковой колонке
 * */
class AccountsWidget {
  static SELECTORS = {
    CREATE_ACCOUNT: '.create-account',
    ACCOUNT: '.account',
    ACTIVE_ACCOUNT: '.account.active',
  };

  static MODALS = {
    CREATE_ACCOUNT: 'createAccount',
  };

  static PAGES = {
    TRANSACTIONS: 'transactions',
  };

  /**
   * Устанавливает текущий элемент в свойство element.
   * Регистрирует обработчики событий с помощью
   * AccountsWidget.registerEvents().
   * Вызывает AccountsWidget.update() для получения
   * списка счетов и последующего отображения.
   * Если переданный элемент не существует, выбрасывает ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент не передан в конструктор AccountsWidget');
    }

    this.element = element;
    this.registerEvents();
    this.update();
  }

  /**
   * Безопасно экранирует HTML-сущности
   * */
  #escapeHtml(value) {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
  }

  /**
   * При нажатии на .create-account открывает окно #modal-new-account.
   * При нажатии на один из существующих счетов
   * вызывает AccountsWidget.onSelectAccount()
   * */
  registerEvents() {
    this.handleClick = this.handleClick.bind(this);
    this.element.addEventListener('click', this.handleClick);
  }

  /**
   * Обработчик клика по виджету
   * */
  handleClick(e) {
    const createBtn = e.target.closest(AccountsWidget.SELECTORS.CREATE_ACCOUNT);
    if (createBtn) {
      e.preventDefault();
      App.getModal(AccountsWidget.MODALS.CREATE_ACCOUNT)?.open();
      return;
    }

    const accountEl = e.target.closest(AccountsWidget.SELECTORS.ACCOUNT);
    if (accountEl) {
      e.preventDefault();
      this.onSelectAccount(accountEl);
    }
  }

  /**
   * Получает список счетов через Account.list().
   * При успешном ответе очищает список и отображает новые счета.
   * */
  update() {
    const user = User.current();
    if (!user) return;

    Account.list({}, (err, response) => {
      if (err || !response?.success) return;

      if (response.data) {
        this.clear();
        this.render(response.data);
      }
    });
  }

  /**
   * Очищает список ранее отображённых счетов.
   * Для этого удаляет все элементы .account в боковой колонке.
   * */
  clear() {
    const accounts = this.element.querySelectorAll(AccountsWidget.SELECTORS.ACCOUNT);
    accounts.forEach(acc => acc.remove());
  }

  /**
   * Срабатывает в момент выбора счёта.
   * Делает кликнутый элемент активным и показывает транзакции.
   * */
  onSelectAccount(element) {
    const activeAccount = this.element.querySelector(AccountsWidget.SELECTORS.ACTIVE_ACCOUNT);
    activeAccount?.classList.remove('active');

    element.classList.add('active');

    const accountId = element.dataset.id;
    App.showPage(AccountsWidget.PAGES.TRANSACTIONS, { account_id: accountId });
  }

  /**
   * Возвращает HTML-код счёта для последующего отображения.
   * */
  getAccountHTML(item) {
    const safeName = this.#escapeHtml(item.name);
    const safeSum = this.#escapeHtml(String(item.sum));
    const safeId = this.#escapeHtml(String(item.id));

    return `
      <li class="account" data-id="${safeId}">
          <a href="#">
              <span>${safeName}</span> /
              <span>${safeSum} ₽</span>
          </a>
      </li>
    `;
  }

  /**
   * Получает массив счетов и добавляет их в боковую колонку.
   * */
  render(accounts) {
    if (!Array.isArray(accounts)) return;

    const html = accounts
      .map(item => this.getAccountHTML(item))
      .join('');

    this.element.insertAdjacentHTML('beforeend', html);
  }

  /**
   * Удаляет обработчики событий
   * */
  destroy() {
    this.element.removeEventListener('click', this.handleClick);
  }
}