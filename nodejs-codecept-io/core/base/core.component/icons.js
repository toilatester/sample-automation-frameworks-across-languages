/* eslint-disable no-undef*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { AbstractComponent } = require('../base.component');

const getIconLocator = (iconLocator, rootElement) => {
  return locate('div[class*="EchoIcon"]').withDescendant(locate(iconLocator).inside(rootElement));
};
class IconsComponent extends AbstractComponent {
  constructor() {
    super();
    this.__root = '#root';
  }

  iconChevronRight(rootElement) {
    rootElement = rootElement || this.__root;
    return getIconLocator('//*[name()="use" and @*="#ico-chevron-right"]', rootElement);
  }

  iconChevronDown(rootElement) {
    rootElement = rootElement || this.__root;
    return getIconLocator('//*[name()="use" and @*="#ico-chevron-down"]', rootElement);
  }

  iconInfo(rootElement) {
    rootElement = rootElement || this.__root;
    return getIconLocator('//*[name()="use" and @*="#ico-info"]', rootElement);
  }

  iconTools(rootElement) {
    rootElement = rootElement || this.__root;
    return getIconLocator('//*[name()="use" and @*="#ico-tools"]', rootElement);
  }

  iconBell(rootElement) {
    rootElement = rootElement || this.__root;
    return getIconLocator('//*[name()="use" and @*="#ico-bell"]', rootElement);
  }

  iconHuman(rootElement) {
    rootElement = rootElement || this.__root;
    return getIconLocator('//*[name()="use" and @*="#ico-human"]', rootElement);
  }

  iconHelpFilled(rootElement) {
    rootElement = rootElement || this.__root;
    return getIconLocator('//*[name()="use" and @*="#ico-help-filled"]', rootElement);
  }

  iconPointerLeft(rootElement) {
    rootElement = rootElement || this.__root;
    return getIconLocator('//*[name()="use" and @*="#ico-pointer-left"]', rootElement);
  }

  iconCheck(rootElement) {
    rootElement = rootElement || this.__root;
    return getIconLocator('//*[name()="use" and @*="#ico-check"]', rootElement);
  }

  iconClose(rootElement) {
    rootElement = rootElement || this.__root;
    return getIconLocator('//*[name()="use" and @*="#ico-close"]', rootElement);
  }
}

exports.IconsComponent = IconsComponent;
