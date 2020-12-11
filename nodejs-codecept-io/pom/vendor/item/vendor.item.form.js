/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />
const {
  AbstractComponent,
  ToastNotificationComponent,
  DropdownComponent,
} = require('../../../core/base');

const I = actor();

class VendorItemComponent extends AbstractComponent {
  constructor() {
    super();
    this.__root = { css: 'div[class*="AddVendorItem__vendor-item-form"]' };
    this.__toastNotificationComponent = new ToastNotificationComponent();
  }

  get vendorItemCatalogButtonTabElement() {
    return locate('li[data-walkme-id*="ItemCatalog"] a').inside(
      'div[class*="VendorLayout__vendor-layout"]'
    );
  }

  get addVendorItemButtonElement() {
    return {
      css: 'button[data-walkme-id="applicationVendorItemCatalog/AddButton"]',
    };
  }

  get assignVendorItemButtonElement() {
    return {
      css: 'button[data-walkme-id="applicationVendorItemCatalog/AssignButton"]',
    };
  }

  get importVendorItemButtonElement() {
    return {
      css: 'button[data-walkme-id="applicationVendorItemCatalog/ImportButton"]',
    };
  }

  get exportVendorItemButtonElement() {
    return {
      css: 'button[data-walkme-id="applicationVendorItemCatalog/ExportButton"]',
    };
  }

  get saveItemVendorButtonElement() {
    return locate('button[data-walkme-id="applicationVendorItemCatalog/Save"]').inside(
      'div[class*="echo-component-EchoSubHeader"]'
    );
  }

  get cancelItemVendorButtonElement() {
    return locate('button[data-walkme-id="applicationVendorItemCatalog/Cancel"]').inside(
      'div[class*="echo-component-EchoSubHeader"]'
    );
  }

  get deleteItemVendorButtonElement() {
    return locate('button[data-walkme-id="applicationVendorItemCatalog/Delete"]').inside(
      'div[class*="echo-component-EchoSubHeader"]'
    );
  }

  get selectVendorGroupElement() {
    return new DropdownComponent({
      css: 'div[data-walkme-id="applicationVendorItemCatalog/VendorGroup"]',
    });
  }

  get inputVendorItemNameElement() {
    return locate('input[data-walkme-id="applicationVendorItemCatalog/VendorItemName"]').inside(
      this.__root
    );
  }

  get inputVendorItemCodeElement() {
    return locate('input[data-walkme-id="applicationVendorItemCatalog/VendorItemCode"]').inside(
      this.__root
    );
  }

  get radioVendorItemActiveElement() {
    return locate('input[data-walkme-id="applicationVendorItemCatalog/RadioStatusActive"]').inside(
      this.__root
    );
  }

  get radioVendorItemInactiveElement() {
    return locate(
      'input[data-walkme-id="applicationVendorItemCatalog/RadioStatusInactive"]'
    ).inside(this.__root);
  }

  get inputVendorLeadTimeElement() {
    return locate('input[name="leadTime"]').inside(this.__root);
  }

  get radioVendorCatchWeightElement() {
    return locate('input[name="catchWeight"]').inside(this.__root);
  }

  get selectPurchaseUnitElement() {
    return new DropdownComponent({
      css: 'div[data-walkme-id="applicationVendorItemCatalog/PurchaseUnit"]',
    });
  }

  get inputPurchaseUnitCostElement() {
    return locate('input').inside(
      locate('div[class*="row"]').withDescendant(this.selectPurchaseUnitElement.rootElement)
    );
  }

  get selectReceivingUnitElement() {
    return new DropdownComponent({
      css: 'div[data-walkme-id="applicationVendorItemCatalog/ReceivingUnit"]',
    });
  }

  get inputReceivingUnitElement() {
    return locate('input').inside(
      locate('div[class*="row"]').withDescendant(this.selectReceivingUnitElement.rootElement)
    );
  }

  get radioSplitCaseElement() {
    return locate('input[name="splitCase"]').inside(this.__root);
  }

  get selectSplitCaseUnitElement() {
    return new DropdownComponent(
      locate('div[class*="EchoDropDown"]').inside(
        locate('div[class*="row"]').withDescendant(locate('div').withText('Alternative'))
      )
    );
  }

  get inputSplitCaseUnitElement() {
    return locate('input').inside(
      locate('div[class*="row"]').withDescendant(this.selectSplitCaseUnitElement.rootElement)
    );
  }

  get radioEnableTaxElement() {
    return locate('input[data-walkme-id="applicationVendorItemCatalog/RadioTaxYes"]').inside(
      this.__root
    );
  }

  get radioDisableTaxElement() {
    return locate('input[data-walkme-id="applicationVendorItemCatalog/RadioTaxNo"]').inside(
      this.__root
    );
  }

  get selectTaxUnitElement() {
    return new DropdownComponent({
      css: 'div[data-walkme-id="applicationVendorItemCatalog/TaxRate"]',
    });
  }

  get inputTaxUnitElement() {
    return locate('input[type="tel"]').inside(
      locate('div[class*="row"]').withDescendant(this.selectTaxUnitElement.rootElement)
    );
  }

  selectVendorGroup(groupName) {
    this.selectVendorGroupElement.selectDropdownOptionByText(groupName);
  }

  selectPurchaseUnit(unitName) {
    this.selectPurchaseUnitElement.selectDropdownOptionByText(unitName);
  }

  selectReceivingUnit(unitName) {
    this.selectReceivingUnitElement.selectDropdownOptionByText(unitName);
  }

  selectTaxUnit(unitName) {
    this.selectTaxUnitElement.selectDropdownOptionByText(unitName);
  }

  selectSplitCaseUnit(unitName) {
    this.selectSplitCaseUnitElement.selectDropdownOptionByText(unitName);
  }

  clickToAddItem() {
    I.waitForVisible(this.vendorItemCatalogButtonTabElement, this.runnerConfig.actionTimeout);
    I.click(this.vendorItemCatalogButtonTabElement);
    I.waitForVisible(this.addVendorItemButtonElement, this.runnerConfig.actionTimeout);
    I.click(this.addVendorItemButtonElement);
  }

  clickToSaveItemCatalog() {
    I.click(this.__root);
    I.waitForEnabled(this.saveItemVendorButtonElement, this.runnerConfig.actionTimeout);
    I.click(this.saveItemVendorButtonElement);
    this.__toastNotificationComponent.waitForComponentAttachToDOM(this.runnerConfig.actionTimeout);
    this.__toastNotificationComponent.waitForComponentRemoveInDOM(this.runnerConfig.actionTimeout);
  }

  fillRequireItemInfo({
    leadTime,
    itemName,
    itemCode,
    groupName,
    purchaseUnitName,
    purchaseUnitCost,
    receivingUnitName,
    receivingUnitCost,
    splitCaseUnitName,
    splitCaseUnitCost,
  }) {
    I.waitForVisible(this.inputVendorLeadTimeElement, this.runnerConfig.actionTimeout);
    I.waitForEnabled(this.inputVendorLeadTimeElement, this.runnerConfig.actionTimeout);
    I.click(this.inputVendorLeadTimeElement);
    I.clearField(this.inputVendorLeadTimeElement);
    I.fillField(this.inputVendorLeadTimeElement, leadTime);
    I.waitForVisible(this.inputVendorItemNameElement, this.runnerConfig.actionTimeout);
    I.waitForEnabled(this.inputVendorItemNameElement, this.runnerConfig.actionTimeout);
    I.click(this.inputVendorItemNameElement);
    I.clearField(this.inputVendorItemNameElement);
    I.fillField(this.inputVendorItemNameElement, itemName);
    I.click(this.inputVendorItemCodeElement);
    I.clearField(this.inputVendorItemCodeElement);
    I.fillField(this.inputVendorItemCodeElement, itemCode);
    this.selectVendorGroup(groupName);
    this.selectPurchaseUnit(purchaseUnitName);
    I.click(this.inputPurchaseUnitCostElement);
    I.clearField(this.inputPurchaseUnitCostElement);
    I.fillField(this.inputPurchaseUnitCostElement, purchaseUnitCost);
    this.selectReceivingUnit(receivingUnitName);
    I.click(this.inputReceivingUnitElement);
    I.clearField(this.inputReceivingUnitElement);
    I.fillField(this.inputReceivingUnitElement, receivingUnitCost);
    // Will input split case unit value if has value
    splitCaseUnitName && I.click(this.radioSplitCaseElement);
    splitCaseUnitName && this.selectSplitCaseUnit(splitCaseUnitName);
    splitCaseUnitName && I.clearField(this.inputSplitCaseUnitElement);
    splitCaseUnitName && I.fillField(this.inputSplitCaseUnitElement, splitCaseUnitCost);
  }

  addNewVendorItemWithoutTax(
    itemName,
    itemCode,
    leadTime,
    groupName,
    purchaseUnitName,
    purchaseUnitCost,
    receivingUnitName,
    receivingUnitCost,
    splitCaseUnitName,
    splitCaseUnitCost
  ) {
    this.clickToAddItem();
    this.fillRequireItemInfo({
      leadTime,
      itemName,
      itemCode,
      groupName,
      purchaseUnitName,
      purchaseUnitCost,
      receivingUnitName,
      receivingUnitCost,
      splitCaseUnitName,
      splitCaseUnitCost,
    });
    I.click(this.radioDisableTaxElement);
    this.clickToSaveItemCatalog();
  }

  addNewVendorItemWithTax(
    itemName,
    itemCode,
    leadTime,
    groupName,
    purchaseUnitName,
    purchaseUnitCost,
    receivingUnitName,
    receivingUnitCost,
    splitCaseUnitName,
    splitCaseUnitCost,
    taxOptions,
    taxCost
  ) {
    this.clickToAddItem();
    this.fillRequireItemInfo({
      leadTime,
      itemName,
      itemCode,
      groupName,
      purchaseUnitName,
      purchaseUnitCost,
      receivingUnitName,
      receivingUnitCost,
      splitCaseUnitName,
      splitCaseUnitCost,
    });
    I.click(this.radioEnableTaxElement);
    this.selectTaxUnit(taxOptions);
    I.clearField(this.inputTaxUnitElement);
    I.fillField(this.inputTaxUnitElement, taxCost);
    this.clickToSaveItemCatalog();
  }
}

exports.VendorItemComponent = VendorItemComponent;
