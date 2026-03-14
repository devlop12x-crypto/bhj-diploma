/**
 * Класс Modal отвечает за управление всплывающими окнами.
 * В первую очередь это открытие или закрытие имеющихся окон.
 * */
class Modal {
  static SELECTORS = {
    DISMISS: '[data-dismiss="modal"]',
  };

  static KEYS = {
    ESCAPE: 'Escape',
  };

  /**
   * Устанавливает текущий элемент в свойство element.
   * Регистрирует обработчики событий с помощью Modal.registerEvents().
   * Если переданный элемент не существует, выбрасывает ошибку.
   * */
  constructor(element) {
    if (!element) {
      throw new Error('Элемент не передан в конструктор Modal');
    }
    
    this.element = element;
    this.isOpen = false;
    
    // Биндим ВСЕ методы-обработчики для корректного удаления
    this.onClose = this.onClose.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleOverlayClick = this.handleOverlayClick.bind(this);
    
    this.registerEvents();
  }

  /**
   * Привязывает обработчики событий к элементам окна.
   * */
  registerEvents() {
    this.registerDismissButtons();
    this.registerOverlayClose();
  }

  /**
   * Регистрирует обработчики для кнопок закрытия
   * */
  registerDismissButtons() {
    const dismissElements = this.element.querySelectorAll(Modal.SELECTORS.DISMISS);
    dismissElements.forEach(element => {
      // Передаём забинденный метод напрямую — та же ссылка для add/remove
      element.addEventListener('click', this.onClose);
    });
  }

  /**
   * Регистрирует закрытие по клику на overlay
   * */
  registerOverlayClose() {
    this.element.addEventListener('click', this.handleOverlayClick);
  }

  /**
   * Обработчик клика по overlay
   * */
  handleOverlayClick(e) {
    if (e.target === this.element) {
      this.onClose(e);
    }
  }

  /**
   * Обработчик нажатия клавиш
   * */
  handleKeydown(e) {
    if (e.key === Modal.KEYS.ESCAPE) {
      this.onClose(e);
    }
  }

  /**
   * Срабатывает после нажатия на элементы, закрывающие окно.
   * Закрывает текущее окно используя метод close().
   * */
  onClose(e) {
    e?.preventDefault();
    this.close();
  }

  /**
   * Открывает окно: устанавливает CSS-свойство display.
   * */
  open() {
    if (this.isOpen) return;
    
    this.isOpen = true;
    this.element.style.display = 'block';
    this.element.setAttribute('aria-hidden', 'false');
    
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', this.handleKeydown);
  }

  /**
   * Закрывает окно: удаляет CSS-свойство display.
   * */
  close() {
    if (!this.isOpen) return;
    
    this.isOpen = false;
    this.element.style.removeProperty('display');
    this.element.setAttribute('aria-hidden', 'true');
    
    document.body.style.overflow = '';
    document.removeEventListener('keydown', this.handleKeydown);
  }

  /**
   * Удаляет все обработчики событий
   * */
  destroy() {
    this.close();
    this.element.removeEventListener('click', this.handleOverlayClick);
    
    const dismissElements = this.element.querySelectorAll(Modal.SELECTORS.DISMISS);
    dismissElements.forEach(element => {
      // // С bind обработчик будет удалён
      element.removeEventListener('click', this.onClose);
    });
  }
}