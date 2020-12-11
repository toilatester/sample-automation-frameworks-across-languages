/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const I = actor();
const { DataGeneratorUtils, StringUtils } = require('../../core');
const { AbstractPage, HierarchyComponent } = require('../../core/base');

const { ReceiveSearchTableComponent } = require('./home/receive.search.table');

class Receive extends AbstractPage {
  constructor() {
    super();
    this._pagePath = '/#/receive';
    this.__hierarchyComponent = new HierarchyComponent();
    this.__receiveSearchTableComponent = new ReceiveSearchTableComponent();
  }

  searchReceiveItem(vendorName) {
    this.__receiveSearchTableComponent.searchReceiveItem(vendorName);
  }

  async seeReceiveItemWithOrderCode(vendorName, orderCode, vendorItems) {
    const { totalItem, totalCost } = DataGeneratorUtils.getTotalItemAndTotalCost(
      vendorItems,
      'purchaseUnitCost',
      'orderQuantity'
    );
    this.__receiveSearchTableComponent.searchReceiveItem(vendorName);
    await this.__receiveSearchTableComponent.seeReciveItemWithOrderCode(
      orderCode,
      totalItem,
      StringUtils.convertUnitToTelType(totalCost)
    );
  }
}

exports.Receive = Receive;
