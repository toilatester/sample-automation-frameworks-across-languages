/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />
const {
  AbstractComponent,
  ToastNotificationComponent,
  DialogComponent,
} = require('../../../core/base');

const I = actor();

class AddGroupComponent extends AbstractComponent {
  constructor() {
    super();
    this.__root = { css: 'div[class*="VendorLayout__vendor-layout"]' };
    this.__toastNotificationComponent = new ToastNotificationComponent();
    this.__dialogComponent = new DialogComponent();
  }

  get addVendorGroupNameElement() {
    return {
      css: 'input[data-walkme-id="applicationVendorGroup/VendorGroupName"]',
    };
  }

  get addVendorGroupButtonElement() {
    return locate('button').withText('Add').inside(this.__root);
  }

  get vendorGroupButtonTabElement() {
    return locate('li[data-walkme-id*="VendorGroups"] a').inside(this.__root);
  }

  get addVendorGroupOkButtonElement() {
    return locate('button').withText('Ok').inside(this.__dialogComponent.dialogFooterElement);
  }

  get addVendorGroupCancelButtonElement() {
    return locate('button').withText('Cancel').inside(this.__dialogComponent.dialogFooterElement);
  }

  addNewVendorGroup(groupName) {
    I.waitForVisible(this.vendorGroupButtonTabElement);
    I.click(this.vendorGroupButtonTabElement);
    I.click(this.addVendorGroupButtonElement);
    I.fillField(this.addVendorGroupNameElement, groupName);
    I.waitForEnabled(this.addVendorGroupOkButtonElement);
    I.click(this.addVendorGroupOkButtonElement);
    this.__toastNotificationComponent.waitForComponentAttachToDOM(this.runnerConfig.actionTimeout);
    this.__toastNotificationComponent.waitForComponentRemoveInDOM(this.runnerConfig.actionTimeout);
  }
}

exports.AddGroupComponent = AddGroupComponent;
