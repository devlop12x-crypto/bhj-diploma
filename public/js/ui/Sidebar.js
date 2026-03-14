/**
 * Класс Sidebar отвечает за работу боковой колонки:
 * кнопки скрытия/показа колонки в мобильной версии сайта
 * и за кнопки меню
 * */
class Sidebar {
  static SELECTORS = {
    TOGGLE_BUTTON: '.sidebar-toggle',
    REGISTER: '.menu-item_register',
    LOGIN: '.menu-item_login',
    LOGOUT: '.menu-item_logout',
  };

  static MODALS = {
    REGISTER: 'register',
    LOGIN: 'login',
  };

  static BODY_CLASSES = {
    OPEN: 'sidebar-open',
    COLLAPSE: 'sidebar-collapse',
  };

  /**
   * Запускает initAuthLinks и initToggleButton
   * */
  static init() {
    this.initToggleButton();
    this.initAuthLinks();
  }

  /**
   * Отвечает за скрытие/показа боковой колонки:
   * переключает два класса для body: sidebar-open и sidebar-collapse
   * при нажатии на кнопку .sidebar-toggle
   * */
  static initToggleButton() {
    const toggleButton = document.querySelector(Sidebar.SELECTORS.TOGGLE_BUTTON);
    if (!toggleButton) return;

    toggleButton.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.classList.toggle(Sidebar.BODY_CLASSES.OPEN);
      document.body.classList.toggle(Sidebar.BODY_CLASSES.COLLAPSE);
    });
  }

  /**
   * Отвечает за переход по ссылкам боковой колонки
   * */
  static initAuthLinks() {
    // Конфигурация кнопок для модальных окон
    const modalButtons = [
      { selector: Sidebar.SELECTORS.REGISTER, modal: Sidebar.MODALS.REGISTER },
      { selector: Sidebar.SELECTORS.LOGIN, modal: Sidebar.MODALS.LOGIN },
    ];

    modalButtons.forEach(({ selector, modal }) => {
      const button = document.querySelector(selector);
      button?.addEventListener('click', (e) => {
        e.preventDefault();
        App.getModal(modal)?.open();
      });
    });

    // Обработка выхода
    this.initLogoutButton();
  }

  /**
   * Инициализирует кнопку выхода из системы
   * */
  static initLogoutButton() {
    const logoutButton = document.querySelector(Sidebar.SELECTORS.LOGOUT);
    if (!logoutButton) return;

    logoutButton.addEventListener('click', (e) => {
      e.preventDefault();
      this.handleLogout();
    });
  }

  /**
   * Обрабатывает выход пользователя из системы
   * */
  static handleLogout() {
    User.logout((err, response) => {
      if (err) {
        alert('Не удалось выйти из системы. Попробуйте ещё раз.');
        return;
      }

      if (response?.success) {
        App.setState('init');
      }
    });
  }
}