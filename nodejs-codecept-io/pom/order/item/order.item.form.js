/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />

const {
  AbstractComponent,
  ToastNotificationComponent,
  TableComponent,
  DialogComponent
} = require('../../../core/base');
const { OrderAddItemComponent } = require('./order.add.item.dialog');

const I = actor();

class OrderItemComponent extends AbstractComponent {
  constructor() {
    super();
    this.orderInfo = { orderItemCode: null, orderItemHrefLink: null };
    this.__root = { css: 'div[class*="ComponentLoading__wrapper"]' };
    this.__toastNotificationComponent = new ToastNotificationComponent();
    this.__orderAddItemComponent = new OrderAddItemComponent();
    this.__orderItemsTable = new TableComponent('div[class*="layout-content"]');
    this.__dialogComponent = new DialogComponent();
  }

  get headerLayoutElement() {
    return locate('div[class*="layout-header"]').inside(this.__root);
  }

  get contentLayoutElement() {
    return locate('div[class*="layout-content"]').inside(this.__root);
  }

  get orderIdToolTipElement() {
    return locate('div').inside(
      locate('div[class*="EchoText-"][class*="ToolTipEchoText"]').inside(this.headerLayoutElement)
    );
  }

  get addOrderItemButtonElement() {
    return locate('button')
      .withText('Add Item')
      .inside(this.headerLayoutElement);
  }

  get submitOrderButtonElement() {
    return locate('button')
      .withText('Submit')
      .inside(this.headerLayoutElement);
  }

  get submitOrderOkButtonElement() {
    return locate('button')
      .withText('Ok')
      .inside(this.__dialogComponent.dialogFooterElement);
  }

  orderItemRowElement(itemCode) {
    return locate('div[class*="OrderDetail__table-body"]').withDescendant(
      locate(`//div[text()='${itemCode}']`).inside(this.__orderItemsTable.tableDataElement)
    );
  }

  orderItemNameCellElement(itemCode) {
    return locate('div[class*="item-name"]').inside(this.orderItemRowElement(itemCode));
  }

  orderItemCodeCellElement(itemCode) {
    return locate(`//div[text()='${itemCode}']`).inside(this.__orderItemsTable.tableDataElement);
  }

  orderItemDeliveryDateCellElement(itemCode) {
    const itemDeliveryDateColumIndex = 1;
    return locate('div[class*="EchoTable"][style*="flex"]')
      .after(locate('div[class*="EchoTable"][style*="flex"]').withDescendant(this.orderItemCodeCellElement(itemCode)))
      .at(itemDeliveryDateColumIndex);
  }

  orderItemUnitCellElement(itemCode) {
    const itemUnitColumIndex = 2;
    return locate('div[class*="EchoTable"][style*="flex"]')
      .after(locate('div[class*="EchoTable"][style*="flex"]').withDescendant(this.orderItemCodeCellElement(itemCode)))
      .at(itemUnitColumIndex);
  }

  orderItemInputQuantityCellElement(itemCode) {
    return locate('input').inside(this.orderItemRowElement(itemCode));
  }

  orderItemCostCellElement(itemCode) {
    const itemCostColumIndex = 4;
    return locate('div[class*="EchoTable"][style*="flex"]')
      .after(locate('div[class*="EchoTable"][style*="flex"]').withDescendant(this.orderItemCodeCellElement(itemCode)))
      .at(itemCostColumIndex);
  }

  orderItemExtCostCellElement(itemCode) {
    const itemCostColumIndex = 5;
    return locate('div[class*="EchoTable"][style*="flex"]')
      .after(locate('div[class*="EchoTable"][style*="flex"]').withDescendant(this.orderItemCodeCellElement(itemCode)))
      .at(itemCostColumIndex);
  }

  orderItemCurrentOHCellElement(itemCode) {
    const itemCostColumIndex = 6;
    return locate('div[class*="EchoTable"][style*="flex"]')
      .after(locate('div[class*="EchoTable"][style*="flex"]').withDescendant(this.orderItemCodeCellElement(itemCode)))
      .at(itemCostColumIndex);
  }

  async getOrderHrefLinkAndCode() {
    const orderCodeSplitIndex = 1;
    const itemHrefLinkSplitIndex = 1;
    const defaultOrderItemCode = 0;
    const headerToolTipText = await I.grabTextFrom(this.orderIdToolTipElement);
    const orderItemUrl = await I.grabCurrentUrl();
    const orderItemHrefLink = orderItemUrl.split('#')[itemHrefLinkSplitIndex];
    let orderItemCode = Array.isArray(headerToolTipText)
      ? headerToolTipText.filter((item) => item.includes('Order'))[defaultOrderItemCode]
      : headerToolTipText;
    orderItemCode = orderItemCode.split(' ');
    this.orderInfo = { orderItemCode: orderItemCode[orderCodeSplitIndex], orderItemHrefLink };
  }

  addNewOrderItem(vendorGroup, vendorItems) {
    I.waitForClickable(this.addOrderItemButtonElement, this.runnerConfig.actionTimeout);
    I.click(this.addOrderItemButtonElement);
    this.__orderAddItemComponent.addNewVendorItemToOrder(vendorGroup, vendorItems);
  }

  updateOrderItemsQuantity(vendorItems) {
    Object.keys(vendorItems).forEach((key) => {
      const vendorItem = vendorItems[key];
      I.waitForClickable(this.orderItemInputQuantityCellElement(vendorItem.itemCode), this.runnerConfig.actionTimeout);
      I.fillField(this.orderItemInputQuantityCellElement(vendorItem.itemCode), vendorItem.orderQuantity.toString());
    });
  }

  submitOrder() {
    I.waitForClickable(this.submitOrderButtonElement, this.runnerConfig.actionTimeout);
    I.click(this.submitOrderButtonElement);
    I.waitForClickable(this.submitOrderOkButtonElement, this.runnerConfig.actionTimeout);
    I.click(this.submitOrderOkButtonElement);
    I.waitForLoadingIconInvisible();
  }
}

exports.OrderItemComponent = OrderItemComponent;
