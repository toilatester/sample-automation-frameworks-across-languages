/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />
const { TableComponent } = require('../../../core/base');
const { StringUtils } = require('../../../core');

const I = actor();
const convertUnitToTelType = (purchaseUnitCost) => {
  const unitCostText = purchaseUnitCost.toString();
  const isNeedToAppendComma = unitCostText.length > 3;
  if (isNeedToAppendComma) {
    return [
      purchaseUnitCost.slice(0, unitCostText.length - 3),
      ',',
      purchaseUnitCost.slice(-3),
      '.00',
    ].join('');
  }
  return [purchaseUnitCost, '.00'].join('');
};

class VendorItemTableComponent extends TableComponent {
  constructor() {
    super({ css: 'div[class*="ItemCatalogList__table-view"]' });
  }

  get searchBarElement() {
    return locate(
      'input[data-walkme-id*="applicationVendorItemCatalog/FilterBarSearchInput"]'
    ).inside(this.tableFilterBarElement);
  }

  vendorItemLinkElement(itemName) {
    return locate(`a[data-walkme-id*="applicationVendorItemCatalog/${itemName}"]`).inside(
      this.tableDataElement
    );
  }

  get assignLinksElement() {
    return locate('a[data-walkme-id*="applicationVendorItemCatalog"]').inside(this.tableElement);
  }

  searchVendorItemInTable(vendorItemName, numberOfSearchResult = 1) {
    I.waitForVisible(this.searchBarElement, this.runnerConfig.actionTimeout);
    I.waitForEnabled(this.searchBarElement, this.runnerConfig.actionTimeout);
    I.click(this.searchBarElement);
    I.clearField(this.searchBarElement);
    I.fillField(this.searchBarElement, vendorItemName);
    I.waitNumberOfVisibleElements(
      locate('a').inside(this.tableDataElement),
      numberOfSearchResult,
      this.runnerConfig.actionTimeout
    );
  }

  showCorrectItemData(itemName, itemCode, groupName, purchaseUnitName, purchaseUnitCost) {
    I.see(itemName, this.tableDataElement);
    I.see(itemCode, this.tableDataElement);
    I.see(groupName, this.tableDataElement);
    I.see(purchaseUnitName, this.tableDataElement);
    I.see(StringUtils.convertUnitToTelType(purchaseUnitCost), this.tableDataElement);
  }

  showCorrectNumberOfAssignStore(numberAssignStores) {
    I.seeElement(
      locate('a[data-walkme-id*="assigned"]')
        .withText(numberAssignStores.toString())
        .inside(this.tableDataElement)
    );
  }
}

exports.VendorItemTableComponent = VendorItemTableComponent;
