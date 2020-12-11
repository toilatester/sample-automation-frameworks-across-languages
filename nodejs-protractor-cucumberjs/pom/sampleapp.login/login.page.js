const { BasePage } = require('../base.page');
const { action } = require('../../core/actions');

class LoginPage extends BasePage {
  constructor() {
    super('https://private.domain.com/login', 'Sample App Home');
  }

  get txbUsername() {
    return element(by.id('username'));
  }

  get txbPassword() {
    return element(by.id('password'));
  }

  get btnLogin() {
    return element(by.xpath("//button[@type='submit']"));
  }

  async login(username, password) {
    await action.clearThenSendKeys(this.txbUsername, username);
    await action.clearThenSendKeys(this.txbPassword, password);
    await action.click(this.btnLogin);
  }
}

exports.LoginPage = LoginPage;
