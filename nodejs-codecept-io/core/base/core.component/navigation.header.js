/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { AbstractComponent } = require('../base.component');
const { NotificationPanel } = require('./notification.panel');
const { IconsComponent } = require('./icons');

const I = actor();
class NavigationHeaderComponent extends AbstractComponent {
  constructor() {
    super();
    this.__root = '#GlobalNav';
    this.__iconsComponent = new IconsComponent();
    this.__notificationPanel = new NotificationPanel();
  }

  get toggleMenuElement() {
    return locate('div[data-testid="app-selector-toggle"]').inside(this.__root);
  }

  get selectStoreLocationElement() {
    return locate('div[data-testid="global-nav-picker-button"] svg').inside(this.__root);
  }

  get notificationIconElement() {
    return this.__iconsComponent.iconBell(this.__root);
  }

  get userProfileIconElement() {
    return this.__iconsComponent.iconHuman(this.__root);
  }

  get helpIconElement() {
    return this.__iconsComponent.iconHelpFilled(this.__root);
  }

  openHierarchyItemModal() {
    I.waitForVisible(this.selectStoreLocationElement, this.runnerConfig.actionTimeout);
    I.click(this.selectStoreLocationElement);
  }

  clickNotification() {
    I.waitForVisible(this.notificationIconElement, this.runnerConfig.actionTimeout);
    I.click(this.notificationIconElement);
  }

  clickUserProfile() {
    I.waitForVisible(this.userProfileIconElement, this.runnerConfig.actionTimeout);
    I.click(this.userProfileIconElement);
  }

  clickHelpIcon() {
    I.waitForVisible(this.helpIconElement, this.runnerConfig.actionTimeout);
    I.click(this.helpIconElement);
  }

  clickToMarkAllAsReadNotification() {
    this.clickNotification();
    this.__notificationPanel.waitForComponentVisible();
    this.__notificationPanel.clickToMarkAllAsRead();
  }

  clickToDismissAllNotification() {
    this.clickNotification();
    this.__notificationPanel.waitForComponentVisible();
    this.__notificationPanel.clickToDismissAllNotification();
  }
}

exports.NavigationHeaderComponent = NavigationHeaderComponent;
