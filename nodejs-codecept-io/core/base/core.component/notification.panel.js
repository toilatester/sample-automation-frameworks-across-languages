/* eslint-disable no-undef*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { AbstractComponent } = require('../base.component');

const I = actor();

class NotificationPanel extends AbstractComponent {
  constructor() {
    super();
    this.__root = {
      css: 'div[data-testid="notifications"]'
    };
  }

  get markAllAsReadButtonElement() {
    return locate('//div[contains(normalize-space(text()), "Mark")]').inside(this.__root);
  }

  get dismissAllAsReadButtonElement() {
    return locate('//div[contains(normalize-space(text()), "Dismiss")]').inside(this.__root);
  }

  clickToMarkAllAsRead() {
    I.click(this.markAllAsReadButtonElement);
  }

  clickToDismissAllNotification() {
    I.click(this.dismissAllAsReadButtonElement);
  }
}

exports.NotificationPanel = NotificationPanel;
