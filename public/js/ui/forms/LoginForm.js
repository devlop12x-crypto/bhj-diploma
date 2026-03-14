/**
 * Класс LoginForm управляет формой
 * входа в портал
 * */
class LoginForm extends AsyncForm {
  /**
   * Производит авторизацию с помощью User.login
   * После успешной авторизации, сбрасывает форму,
   * устанавливает состояние App.setState( 'user-logged' ) и
   * закрывает окно, в котором находится форма
   * */
  onSubmit(data) {
    this.setLoading(true);

    User.login(data, (err, response) => {
      this.setLoading(false);

      if (err || !response?.success) {
        this.showError(response?.error ?? 'Ошибка авторизации. Проверьте почту и пароль.');
        return;
      }

      this.element.reset(); //
      App.setState('user-logged'); //
      App.getModal('login')?.close(); //
    });
  }
}