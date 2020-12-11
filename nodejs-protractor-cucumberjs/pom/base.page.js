const { action } = require('../core/actions');
const { wait } = require('../core/wait');
const { WebComponent } = require('../core/webcomponent');

class BasePage extends WebComponent {
  constructor(url, title) {
    super();
    this.url = url;
    this.title = title;
  }

  async openPage() {
    await action.navigate(this.url);
    await wait.waitForUrlContains(this.url);
  }

  async openPageWithRedirect() {
    await action.navigate(this.url);
  }
}

exports.BasePage = BasePage;
