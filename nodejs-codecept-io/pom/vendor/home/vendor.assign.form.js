/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />
const { AbstractComponent, ToastNotificationComponent } = require('../../../core/base');

const I = actor();

class AssignFormComponent extends AbstractComponent {
  constructor() {
    super();
    this.__root = { css: 'form > div[class*="AssignVendor"]' };
    this.__toastNotificationComponent = new ToastNotificationComponent();
  }

  get searchBarElement() {
    return locate('input[class*="EchoSearchBar"]').inside(this.__root);
  }

  get selectAllVendorButtonElement() {
    return locate('p')
      .withText('Select')
      .inside(this.__root);
  }

  selectVendorLinkElement(vendorName) {
    return locate('ul>li')
      .withText(vendorName)
      .inside(this.__root);
  }

  get nextButtonAssignElement() {
    return locate('div[class*="wizard-footer"] button')
      .withText('Next')
      .inside(this.__root);
  }

  get cancelButtonAssignElement() {
    return locate('div[class*="wizard-footer"] button')
      .withText('Cancel')
      .inside(this.__root);
  }

  get previousButtonAssignElement() {
    return locate('div[class*="wizard-footer"] button')
      .withText('Previous')
      .inside(this.__root);
  }

  get doneButtonAssignElement() {
    return locate('div[class*="wizard-footer"] button')
      .withText('Done')
      .inside(this.__root);
  }

  storeCheckboxInStoreHierarchy(storeName) {
    return locate(`//*[contains(normalize-space(text()),"${storeName}")]/parent::div//input[@type="checkbox"]`).inside(
      this.__root
    );
  }

  searchAssignItem(assignItemName) {
    I.click(this.searchBarElement);
    I.clearField(this.searchBarElement);
    I.fillField(this.searchBarElement, assignItemName);
    I.waitNumberOfVisibleElements(locate({ css: 'ul>li' }).inside(this.__root), 1, this.runnerConfig.actionTimeout);
  }

  selectAssignItem(assignItemName) {
    I.click(this.selectVendorLinkElement(assignItemName));
  }

  assignVendorToStore(storeName, isSelectAll) {
    isSelectAll && I.click(this.selectAllVendorButtonElement);
    I.click(this.nextButtonAssignElement);
    this.selectStoreInStoreHierarchy(storeName);
    I.click(this.doneButtonAssignElement);
    this.__toastNotificationComponent.waitForComponentAttachToDOM(this.runnerConfig.actionTimeout);
    this.__toastNotificationComponent.waitForComponentRemoveInDOM(this.runnerConfig.actionTimeout);
  }

  selectStoreInStoreHierarchy(storeName) {
    storeName = Array.isArray(storeName) ? storeName : [storeName];
    storeName.forEach((store) => {
      I.waitForVisible(this.storeCheckboxInStoreHierarchy(store), this.runnerConfig.actionTimeout);
      I.click(this.storeCheckboxInStoreHierarchy(store));
    });
  }
}

exports.AssignFormComponent = AssignFormComponent;
