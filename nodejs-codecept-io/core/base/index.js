const components = require('./core.component');

const { AbstractComponent } = require('./base.component');
const { AbstractPage } = require('./base.page');

module.exports = {
  ...components,
  AbstractComponent,
  AbstractPage
};
