const { BasePage } = require('../base.page');
const { RightSideBarComponent } = require('./components/right-side-bar.component');
const { action } = require('../../core/actions');

class HomePage extends BasePage {
  constructor() {
    super('https://private.domain.com/', 'Sample App Home');
    this.__rightSideBar = undefined;
  }

  get icoAccount() {
    return element(by.id('account-icon'));
  }

  async logout() {
    // TODO: Do something
  }

  async openRightSideBar() {
    await action.click(this.icoAccount);
    return this.rightSideBar;
  }

  get rightSideBar() {
    if (!this.__rightSideBar) {
      this.__rightSideBar = new RightSideBarComponent();
    }
    return this.__rightSideBar;
  }
}

exports.HomePage = HomePage;
