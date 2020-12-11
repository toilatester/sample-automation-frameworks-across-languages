/* eslint-disable no-undef*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { AbstractComponent } = require('../base.component');
const { IconsComponent } = require('./icons');

const I = actor();

class ToastNotificationComponent extends AbstractComponent {
  constructor() {
    super();
    this.__root = 'div[class*="AppToast"] > div[class*="EchoToast"]';
    this.__iconsComponent = new IconsComponent();
  }

  get closeToastNotificationElement() {
    return this.__iconsComponent.iconClose(this.__root);
  }

  get toastMessageElements() {
    return locate('div[class*="EchoText"]')
      .inside('div[class*="EchoNotification"]')
      .inside(this.__root);
  }

  async getToastMessage() {
    return I.grabTextFrom(this.toastMessageElements);
  }
}

exports.ToastNotificationComponent = ToastNotificationComponent;
