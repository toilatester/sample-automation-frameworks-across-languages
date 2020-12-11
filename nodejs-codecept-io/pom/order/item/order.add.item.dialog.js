/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />
const {
  AbstractComponent,
  ToastNotificationComponent,
  DropdownComponent,
  DialogComponent
} = require('../../../core/base');

const I = actor();

class OrderAddItemComponent extends AbstractComponent {
  constructor() {
    super();
    this.__root = { css: '#background > div[class*="echo-component-dialog"]' };
    this.__toastNotificationComponent = new ToastNotificationComponent();
    this.__dialogComponent = new DialogComponent();
  }

  get filterBarSeachInputElement() {
    return locate('input[data-walkme-id*="FilterBarSeachInput"]').inside(this.__root);
  }

  get filterBarClearButtonElement() {
    return locate('div[data-walkme-id*="FilterBarClearButton"]').inside(this.__root);
  }

  get orderItemVendorSelectElement() {
    return new DropdownComponent(locate('div[class*="EchoFilterBar"]').inside(this.__root));
  }

  get checkboxSelectVendorItemElement() {
    return locate('input[type="checkbox"]').inside(
      locate('div[class*="SelectionItemsTable"]').withDescendant('div[class*="AddVendorItem"]')
    );
  }

  get addItemButtonElement() {
    return locate('button')
      .withText('Ok')
      .inside(this.__dialogComponent.dialogFooterElement);
  }

  get cancelItemButtonElement() {
    return locate('button')
      .withText('Cancel')
      .inside(this.__dialogComponent.dialogFooterElement);
  }

  searchVendorItemInItemList(itemName, number) {
    I.waitForClickable(this.filterBarSeachInputElement, this.runnerConfig.actionTimeout);
    I.fillField(this.filterBarSeachInputElement, itemName);
    I.waitNumberOfVisibleElements(this.checkboxSelectVendorItemElement, number, this.runnerConfig.actionTimeout);
  }

  addNewVendorItemToOrder(vendorGroup, vendorItems) {
    const expectedSearchResult = 1; // Filter item name by random name and it should show only 1 item
    Object.keys(vendorItems).forEach((key) => {
      const vendorItem = vendorItems[key];
      I.waitForClickable(this.filterBarClearButtonElement, this.runnerConfig.actionTimeout);
      I.click(this.filterBarClearButtonElement);
      this.orderItemVendorSelectElement.selectDropdownOptionByText(vendorGroup);
      this.orderItemVendorSelectElement.clickToOpenDropDown();
      this.searchVendorItemInItemList(vendorItem.itemCode, expectedSearchResult);
      I.click(this.checkboxSelectVendorItemElement);
    });
    I.click(this.addItemButtonElement);
    this.waitForLoadingIconInvisible(this.runnerConfig.actionTimeout);
  }
}

exports.OrderAddItemComponent = OrderAddItemComponent;
