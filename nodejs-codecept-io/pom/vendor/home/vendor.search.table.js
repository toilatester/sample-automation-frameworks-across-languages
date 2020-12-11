/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />
const { TableComponent } = require('../../../core/base');

const I = actor();

class VendorSearchTableComponent extends TableComponent {
  constructor() {
    super({ css: 'div[class*="Vendors__wrapper-table-view"]' });
  }

  get searchBarElement() {
    return locate('input[data-walkme-id*="applicationVendor/FilterBarSearchInput"]').inside(
      this.tableFilterBarElement
    );
  }

  get assignLinksElement() {
    return locate('a[data-walkme-id*="applicationVendor/AssignMount"]').inside(this.tableElement);
  }

  vendorLinkElement(vendorName) {
    return locate(`a[data-walkme-id*="applicationVendor/${vendorName}"]`).inside(this.tableElement);
  }

  searchVendorInTable(vendorName, numberOfSearchResult = 1) {
    I.waitForVisible(this.searchBarElement, this.runnerConfig.actionTimeout);
    I.waitForEnabled(this.searchBarElement, this.runnerConfig.actionTimeout);
    I.click(this.searchBarElement);
    I.clearField(this.searchBarElement);
    I.fillField(this.searchBarElement, vendorName);
    I.waitNumberOfVisibleElements(
      locate('a').inside(this.__root),
      numberOfSearchResult,
      this.runnerConfig.actionTimeout
    );
  }

  clickToVendorLink(vendorName) {
    // After assign store to vendor, the row result contains 2 element with tag a
    const totalATagInsideSearchRowResult = 2;
    this.searchVendorInTable(vendorName, totalATagInsideSearchRowResult);
    // data-walkme-id will auto replace space
    const vendorLinkItem = vendorName.replace(/\s+/g, '');
    I.waitForVisible(this.vendorLinkElement(vendorLinkItem));
    I.click(this.vendorLinkElement(vendorLinkItem));
  }

  containsVendorItemInTable(vendorName, vendorCode, vendorStatus) {
    I.see(vendorName, this.__root);
    I.see(vendorCode, this.__root);
    I.see(vendorStatus, this.__root);
  }

  showCorrectNumberOfAssignStore(numberAssignStores) {
    I.seeElement(
      locate('div').withText(numberAssignStores.toString()).inside(this.assignLinksElement)
    );
  }
}

exports.VendorSearchTableComponent = VendorSearchTableComponent;
