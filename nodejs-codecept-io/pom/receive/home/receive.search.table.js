/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />

const { TableComponent, DropdownComponent } = require('../../../core/base');

const I = actor();

class ReceiveSearchTableComponent extends TableComponent {
  constructor() {
    super(locate('div').withChild('#modal'));
  }

  get receiveVendorSelectElement() {
    return new DropdownComponent(this.tableFilterBarElement);
  }

  get clearSeachButtonElement() {
    return locate('div[role="button"]')
      .withText('CLEAR')
      .inside(this.tableFilterBarElement);
  }

  reciveItemRowElement(itemCode) {
    return locate('div[class*="EchoTable"][style^="height"]').withDescendant(
      locate(`//div[text()='${itemCode}']`).inside(this.tableDataElement)
    );
  }

  reciveItemInprogressLinkElement(itemCode) {
    return locate('a[class*="ReceivesContent"]').inside(this.reciveItemRowElement(itemCode));
  }

  searchReceiveItem(vendorName) {
    I.waitForVisible(this.clearSeachButtonElement, this.runnerConfig.actionTimeout);
    I.click(this.clearSeachButtonElement);
    this.receiveVendorSelectElement.selectDropdownOptionByText(vendorName);
    this.receiveVendorSelectElement.clickToOpenDropDown();
  }

  async getReceiveItemRowData(orderRowElement) {
    const rawData = await I.grabTextFrom(orderRowElement);
    const receiveColumn = rawData.split('\n');
    const receiveVendorNameColumn = 0;
    const receiveCodeIdColumn = 1;
    const receiveOrderCodeColumn = 2;
    const receiveOrderDateColumn = 3;
    const receiveDateColumn = 4;
    const receiveNumberItemsColumn = 5;
    const receiveTotalCostColumn = 6;
    return {
      vendorName: receiveColumn[receiveVendorNameColumn],
      receiveCode: receiveColumn[receiveCodeIdColumn],
      orderCode: receiveColumn[receiveOrderCodeColumn],
      orderDate: receiveColumn[receiveOrderDateColumn],
      receiveDate: receiveColumn[receiveDateColumn],
      receiveNumberItems: receiveColumn[receiveNumberItemsColumn],
      receiveTotalCost: receiveColumn[receiveTotalCostColumn]
    };
  }

  async seeReciveItemWithOrderCode(orderItemCode, totalItem, totalCost) {
    const receiveRowData = await this.getReceiveItemRowData(this.reciveItemRowElement(orderItemCode));
    I.seeTextEquals(receiveRowData.orderCode, orderItemCode);
    I.seeTextEquals(receiveRowData.receiveNumberItems, totalItem);
    I.seeTextEquals(receiveRowData.receiveTotalCost, totalCost);
  }
}

exports.ReceiveSearchTableComponent = ReceiveSearchTableComponent;
