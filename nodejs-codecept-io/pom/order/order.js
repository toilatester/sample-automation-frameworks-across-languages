/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />

const I = actor();
const { AbstractPage, HierarchyComponent } = require('../../core/base');
const { StringUtils, DataGeneratorUtils } = require('../../core');
const { AddOrderComponent } = require('./home/order.add.dialog');
const { OrderSearchTableComponent } = require('./home/order.search.table');
const { OrderItemComponent } = require('./item/order.item.form');

class Order extends AbstractPage {
  constructor() {
    super();
    this._pagePath = '/#/orders';
    this.__hierarchyComponent = new HierarchyComponent();
    this.__addOrderComponent = new AddOrderComponent();
    this.__orderSearchTableComponent = new OrderSearchTableComponent();
    this.__orderItemComponent = new OrderItemComponent();
  }

  get addOrderItemButtonElement() {
    return locate('button')
      .withText('Add Item')
      .inside('div[class*="layout-header"]');
  }

  get addOrderButtonElement() {
    return locate('button')
      .withText('Add')
      .inside('div[class*="OrdersBrowse__header"]');
  }

  get backNavigationButtonElement() {
    return locate('button[class*="GoBackButton"]').inside('div[class*="SubHeader"]');
  }

  openAndSelectStore(storeName) {
    this.__hierarchyComponent.openAndSelectStore(storeName);
  }

  async addNewOrder(vendorName, deliveryDate, coverUntilDate) {
    I.waitForEnabled(this.addOrderButtonElement, this.runnerConfig.actionTimeout);
    I.click(this.addOrderButtonElement);
    this.__addOrderComponent.searchVendorInOrderTable(vendorName);
    this.__addOrderComponent.selectVendorInOrderTable(deliveryDate, coverUntilDate);
    this.__addOrderComponent.waitForComponentRemoveInDOM(this.runnerConfig.actionTimeout);
    this.__addOrderComponent.waitForLoadingIconInvisible(this.runnerConfig.actionTimeout);
    await this.__orderItemComponent.getOrderHrefLinkAndCode();
    I.click(this.backNavigationButtonElement);
  }

  getOrderItemCode() {
    if (!this.__orderItemComponent.orderInfo.orderItemCode) {
      throw new Error('Should addNewOrder before getting order item code');
    }
    return this.__orderItemComponent.orderInfo.orderItemCode;
  }

  getOrderItemHrefLink() {
    if (!this.__orderItemComponent.orderInfo.orderItemHrefLink) {
      throw new Error('Should addNewOrder before getting order href link');
    }
    return this.__orderItemComponent.orderInfo.orderItemHrefLink;
  }

  async seeNewOrderInOrderTable(vendorName, orderItemHrefLink, orderItemCode, orderDate) {
    this.waitForLoadingIconInvisible(this.runnerConfig.actionTimeout);
    this.__orderSearchTableComponent.searchVendorOrderItem(vendorName);
    await this.__orderSearchTableComponent.seeNewOrderItemInOrderTable(orderItemHrefLink, orderItemCode, orderDate);
  }

  addNewOrderItems(vendorName, vendorGroup, orderItemHrefLink, vendorItems) {
    this.__orderSearchTableComponent.searchVendorOrderItem(vendorName);
    this.__orderSearchTableComponent.clickToOpenOrderItem(orderItemHrefLink);
    this.__orderItemComponent.addNewOrderItem(vendorGroup, vendorItems);
    this.__orderItemComponent.updateOrderItemsQuantity(vendorItems);
    I.click(this.backNavigationButtonElement);
    I.refreshPage();
  }

  async seeOrderInOrderTableWithCorrectTotalCost(vendorName, orderItemHrefLink, orderItemCode, vendorItems) {
    const { totalItem, totalCost } = DataGeneratorUtils.getTotalItemAndTotalCost(
      vendorItems,
      'purchaseUnitCost',
      'orderQuantity'
    );
    this.__orderSearchTableComponent.searchVendorOrderItem(vendorName);
    await this.__orderSearchTableComponent.seeOrderItemInOrderTableWithCorrectTotalCost(
      orderItemHrefLink,
      orderItemCode,
      totalItem,
      StringUtils.convertUnitToTelType(totalCost)
    );
  }

  submitOrder(vendorName, orderItemHrefLink) {
    this.__orderSearchTableComponent.searchVendorOrderItem(vendorName);
    this.__orderSearchTableComponent.clickToOpenOrderItem(orderItemHrefLink);
    this.__orderItemComponent.submitOrder();
  }

  async seeOrderSubmitSuccessfully(vendorName, orderItemHrefLink, orderItemCode, vendorItems) {
    const { totalItem, totalCost } = DataGeneratorUtils.getTotalItemAndTotalCost(
      vendorItems,
      'purchaseUnitCost',
      'orderQuantity'
    );
    I.navigateToOrderPage();
    this.__orderSearchTableComponent.searchVendorOrderItem(vendorName);
    await this.__orderSearchTableComponent.seeOrderItemSubmitSuccessfully(
      orderItemHrefLink,
      orderItemCode,
      totalItem,
      StringUtils.convertUnitToTelType(totalCost)
    );
  }
}

exports.Order = Order;
