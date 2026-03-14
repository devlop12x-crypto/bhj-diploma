/**
 * Класс RegisterForm управляет формой
 * регистрации
 * */
class RegisterForm extends AsyncForm {
  /**
   * Производит регистрацию с помощью User.register
   * После успешной регистрации устанавливает
   * состояние App.setState( 'user-logged' )
   * и закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    this.setLoading(true);

    User.register(data, (err, response) => {
      this.setLoading(false);

      if (err || !response?.success) {
        this.showError(response?.error ?? 'Ошибка регистрации. Попробуйте снова.');
        return;
      }

      this.element.reset();
      App.setState('user-logged');
      App.getModal('register')?.close();
    });
  }
}