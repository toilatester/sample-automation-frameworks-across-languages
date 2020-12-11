/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />
const { DateTimeUtils, DATE_FORMAT } = require('../../../core');
const { TableComponent, DropdownComponent } = require('../../../core/base');

const I = actor();

class OrderSearchTableComponent extends TableComponent {
  constructor() {
    super(locate('div').withChild('#modal'));
  }

  get orderVendorSelectElement() {
    return new DropdownComponent(this.tableFilterBarElement);
  }

  get clearSeachButtonElement() {
    return locate('div[role="button"]')
      .withText('CLEAR')
      .inside(this.tableFilterBarElement);
  }

  orderItemInprogressRowElement(orderItemHrefLink) {
    return locate('//div[contains(@class,"in-progress")]').withDescendant(
      `//a[contains(@href,"${orderItemHrefLink}")]`
    );
  }

  orderItemSubmittedRowElement(orderItemHrefLink) {
    return locate('//div[contains(@class,"__others__")]').withDescendant(`//a[contains(@href,"${orderItemHrefLink}")]`);
  }

  orderItemInprogressLinkElement(orderItemHrefLink) {
    return { css: `a[href*="${orderItemHrefLink}"]` };
  }

  searchVendorOrderItem(vendorName) {
    I.waitForVisible(this.clearSeachButtonElement, this.runnerConfig.actionTimeout);
    I.click(this.clearSeachButtonElement);
    this.orderVendorSelectElement.selectDropdownOptionByText(vendorName);
    this.orderVendorSelectElement.clickToOpenDropDown();
  }

  clickToOpenOrderItem(orderItemHrefLink) {
    I.click(this.orderItemInprogressLinkElement(orderItemHrefLink));
  }

  async getOrderItemRowData(orderRowElement) {
    const rawData = await I.grabTextFrom(orderRowElement);
    const orderColumn = rawData.split('\n');
    const orderVendorNameColumn = 0;
    const orderCodeIdColumn = 1;
    const orderDateColumn = 2;
    const orderDueByTimeColumn = 3;
    const orderDeliveryDateColumn = 4;
    const orderNumberItemsColumn = 5;
    const orderTotalCostColumn = 6;
    return {
      vendorName: orderColumn[orderVendorNameColumn],
      orderCode: orderColumn[orderCodeIdColumn],
      orderDate: orderColumn[orderDateColumn],
      orderDueByTime: orderColumn[orderDueByTimeColumn],
      orderDeliveryDate: orderColumn[orderDeliveryDateColumn],
      orderNumberItems: orderColumn[orderNumberItemsColumn],
      orderTotalCost: orderColumn[orderTotalCostColumn]
    };
  }

  async seeNewOrderItemInOrderTable(orderItemHrefLink, orderItemCode, orderDate) {
    const orderRowData = await this.getOrderItemRowData(this.orderItemInprogressRowElement(orderItemHrefLink));
    I.seeTextInclude(orderRowData.orderCode, orderItemCode);
    I.seeTextEquals(
      DateTimeUtils.convertDateStringFormat(orderRowData.orderDate, DATE_FORMAT.MM_DD_YYYY),
      orderDate.toString()
    );
  }

  async seeOrderItemInOrderTableWithCorrectTotalCost(orderItemHrefLink, orderItemCode, totalItem, totalCost) {
    const orderRowData = await this.getOrderItemRowData(this.orderItemInprogressRowElement(orderItemHrefLink));
    I.seeTextInclude(orderRowData.orderCode, orderItemCode);
    I.seeTextEquals(orderRowData.orderNumberItems, totalItem);
    I.seeTextEquals(orderRowData.orderTotalCost, totalCost);
  }

  async seeOrderItemSubmitSuccessfully(orderItemHrefLink, orderItemCode, totalItem, totalCost) {
    const orderRowData = await this.getOrderItemRowData(this.orderItemSubmittedRowElement(orderItemHrefLink));
    I.seeTextInclude(orderRowData.orderCode, orderItemCode);
    I.seeTextEquals(orderRowData.orderNumberItems, totalItem);
    I.seeTextEquals(orderRowData.orderTotalCost, totalCost);
  }
}

exports.OrderSearchTableComponent = OrderSearchTableComponent;
