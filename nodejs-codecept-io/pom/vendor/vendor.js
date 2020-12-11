/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const I = actor();
const {
  AbstractPage, HierarchyComponent, NavigationHeaderComponent, WalkmeComponent
} = require('../../core/base');
const { AssignFormComponent } = require('./home/vendor.assign.form');
const { VendorSearchTableComponent } = require('./home/vendor.search.table');
const { AddFormComponent } = require('./details/vendor.details.form');
const { AddGroupComponent } = require('./groups/vendor.group.form');
const { VendorGroupsTableComponent } = require('./groups/vendor.group.table');
const { VendorItemComponent } = require('./item/vendor.item.form');
const { VendorItemTableComponent } = require('./item/vendor.item.table');

class Vendor extends AbstractPage {
  constructor() {
    super();
    this._pagePath = '/#/config/vendors';
    this.__hierarchyComponent = new HierarchyComponent();
    this.__navigationHeaderComponent = new NavigationHeaderComponent();
    this.__walkmeComponent = new WalkmeComponent();
    this.__addFormComponent = new AddFormComponent();
    this.__assignFormComponent = new AssignFormComponent();
    this.__vendorItemComponent = new VendorItemComponent();
    this.__addGroupComponent = new AddGroupComponent();
    this.__vendorSearchTableComponent = new VendorSearchTableComponent();
    this.__vendorGroupsTableComponent = new VendorGroupsTableComponent();
    this.__vendorItemTableComponent = new VendorItemTableComponent();
  }

  get addVendorButtonElement() {
    return { css: 'button[data-walkme-id*="AddButton"]' };
  }

  get assignVendorButtonElement() {
    return { css: 'button[data-walkme-id*="AssignButton"]' };
  }

  get backNavigationButtonElement() {
    return { css: 'button[data-walkme-id*="GoBackButton"]' };
  }

  selectStore(storeName) {
    this.__navigationHeaderComponent.openHierarchyItemModal();
    this.__hierarchyComponent.selectStore(storeName);
  }

  clickNotificationIcon() {
    this.__navigationHeaderComponent.clickNotification();
  }

  clickUserProfileIcon() {
    this.__navigationHeaderComponent.clickUserProfile();
  }

  clickHelpIcon() {
    this.__navigationHeaderComponent.clickHelpIcon();
    this.__walkmeComponent.waitForComponentVisible(this.runnerConfig.actionTimeout);
  }

  clickToMarkAllReadNotifications() {
    this.__navigationHeaderComponent.clickToMarkAllAsReadNotification();
  }

  clickToDismissAllNotifications() {
    this.__navigationHeaderComponent.clickToDismissAllNotification();
  }

  inputSearchToWalkMe(search) {
    this.__walkmeComponent.clickToHelp();
    this.__walkmeComponent.inputToSearchInWalkme(search);
  }

  addNewVendor(vendorName, vendorCode, address, generalLedger, country, isActive = true) {
    I.waitForVisible(this.addVendorButtonElement, this.runnerConfig.actionTimeout);
    I.click(this.addVendorButtonElement);
    this.waitForLoadingIconInvisible(this.runnerConfig.actionTimeout);
    isActive
      ? this.__addFormComponent.addNewVendorWithStatusActive(vendorName, vendorCode, address, generalLedger, country)
      : this.__addFormComponent.addNewVendorWithStatusInactive(vendorName, vendorCode, address, generalLedger, country);
    I.waitForEnabled(this.backNavigationButtonElement, this.runnerConfig.actionTimeout);
    I.moveCursorTo(this.backNavigationButtonElement);
    I.click(this.backNavigationButtonElement);
  }

  seeNewVendorInVendorTable(vendorName, vendorCode, vendorStatus) {
    const totalTagAInVendorTableRowResult = 1;
    this.__vendorSearchTableComponent.searchVendorInTable(vendorName, totalTagAInVendorTableRowResult);
    this.__vendorSearchTableComponent.containsVendorItemInTable(vendorName, vendorCode, vendorStatus);
  }

  seeNumberOfAssignStoreOfVendor(vendorName, numberAssignStores) {
    // After assign store, vendor in table will contains 2 elements with tag a
    const totalTagAInVendorTableRowResult = 2;
    this.__vendorSearchTableComponent.searchVendorInTable(vendorName, totalTagAInVendorTableRowResult);
    this.__vendorSearchTableComponent.showCorrectNumberOfAssignStore(numberAssignStores);
  }

  assignVendorToStore(storeName, vendorName) {
    I.click(this.assignVendorButtonElement);
    this.__assignFormComponent.searchAssignItem(vendorName);
    this.__assignFormComponent.selectAssignItem(vendorName);
    this.__assignFormComponent.assignVendorToStore(storeName, false);
  }

  assignAllVendorToStore(storeName) {
    I.click(this.assignVendorButtonElement);
    this.__assignFormComponent.assignVendorToStore(storeName, true);
  }

  createVendorGroup(vendorName, groupName) {
    const totalTagAInVendorTableRowResult = 2;
    this.__vendorSearchTableComponent.searchVendorInTable(vendorName, totalTagAInVendorTableRowResult);
    this.__vendorSearchTableComponent.clickToVendorLink(vendorName);
    this.__addGroupComponent.addNewVendorGroup(groupName);
  }

  seeNewVendorGroupInVendorGroupPanel(vendorGroupName) {
    this.__vendorGroupsTableComponent.vendorGroupContainsNewGroup(vendorGroupName);
    I.click(this.backNavigationButtonElement);
  }

  addNewVendorItem(vendorName, groupName, vendorItems) {
    this.__vendorSearchTableComponent.clickToVendorLink(vendorName);
    // Add list of items to vendor
    Object.keys(vendorItems).forEach((key) => {
      const vendorItem = vendorItems[key];
      // Add item without tax option
      !vendorItem.taxOptions
        && this.__vendorItemComponent.addNewVendorItemWithoutTax(
          vendorItem.itemName,
          vendorItem.itemCode,
          vendorItem.leadTime,
          groupName,
          vendorItem.purchaseUnitName,
          vendorItem.purchaseUnitCost,
          vendorItem.receivingUnitName,
          vendorItem.receivingUnitCost,
          vendorItem.splitCaseUnitName,
          vendorItem.splitCaseUnitCost
        );
      // Add item with tax option
      vendorItem.taxOptions
        && this.__vendorItemComponent.addNewVendorItemWithTax(
          vendorItem.itemName,
          vendorItem.itemCode,
          vendorItem.leadTime,
          groupName,
          vendorItem.purchaseUnitName,
          vendorItem.purchaseUnitCost,
          vendorItem.receivingUnitName,
          vendorItem.receivingUnitCost,
          vendorItem.splitCaseUnitName,
          vendorItem.splitCaseUnitCost,
          vendorItem.taxOptions,
          vendorItem.taxCost
        );
      I.click(this.backNavigationButtonElement);
      // We need to refresh page here because
      // the HS is an amazing application,
      // sometime element is rendered with undefined attribute =))
      I.refreshPage();
    });
  }

  seeNewVendorItemInVendorCatalog(groupName, vendorItems) {
    Object.keys(vendorItems).forEach((key) => {
      const vendorItem = vendorItems[key];
      this.__vendorItemTableComponent.searchVendorItemInTable(vendorItem.itemName);
      this.__vendorItemTableComponent.showCorrectItemData(
        vendorItem.itemName,
        vendorItem.itemCode,
        groupName,
        vendorItem.purchaseUnitName,
        vendorItem.purchaseUnitCost
      );
    });
  }

  assignVendorItemToStore(storeName, vendorItems) {
    I.click(this.assignVendorButtonElement);
    Object.keys(vendorItems).forEach((key) => {
      const vendorItem = vendorItems[key];
      this.__assignFormComponent.searchAssignItem(vendorItem.itemName);
      this.__assignFormComponent.selectAssignItem(vendorItem.itemName);
    });
    this.__assignFormComponent.assignVendorToStore(storeName, false);
  }

  assignAllVendorItemToStore(storeName) {
    I.click(this.assignVendorButtonElement);
    this.__assignFormComponent.assignVendorToStore(storeName, true);
  }

  seeNumberOfAssignStoreOfVendorItems(vendorItems, numberAssignStores) {
    // After assign store, vendor in table will contains 2 elements with tag a
    const totalTagAInVendorTableRowResult = 2;
    Object.keys(vendorItems).forEach((key) => {
      const vendorItem = vendorItems[key];
      this.__vendorItemTableComponent.searchVendorItemInTable(vendorItem.itemName, totalTagAInVendorTableRowResult);
      this.__vendorItemTableComponent.showCorrectNumberOfAssignStore(numberAssignStores);
    });
  }
}

exports.Vendor = Vendor;
