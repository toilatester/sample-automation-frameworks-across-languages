/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />
const { TableComponent } = require('../../../core/base');

const I = actor();

class VendorGroupsTableComponent extends TableComponent {
  constructor() {
    super({ css: 'div[class*="Layout__layout-content"]' });
  }

  vendorGroupPanelElement(vendorGroupName) {
    return locate('div[class*="Panel__panel"]')
      .withText(vendorGroupName)
      .inside(this.tableElement);
  }

  vendorGroupContainsNewGroup(vendorGroupName) {
    I.seeElement(this.vendorGroupPanelElement(vendorGroupName));
  }
}

exports.VendorGroupsTableComponent = VendorGroupsTableComponent;
