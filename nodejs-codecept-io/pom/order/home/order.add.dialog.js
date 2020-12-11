/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />
const {
  AbstractComponent,
  ToastNotificationComponent,
  DialogComponent,
  TableComponent,
  DatePickerComponent
} = require('../../../core/base');

const I = actor();

class AddOrderComponent extends AbstractComponent {
  constructor() {
    super();
    this.__root = { css: '#background div[class*="dialog"][style*="height"]' };
    this.__toastNotificationComponent = new ToastNotificationComponent();
    this.__addDialogComponent = new DialogComponent();
    this.__orderVendorTable = new TableComponent({ css: 'div[class*="OrdersBrowse__wizard-body"]' });
  }

  get searchVendorInputElement() {
    return locate('input').inside(this.__orderVendorTable.tableFilterBarElement);
  }

  get selectVendorInVendorTableElement() {
    return locate('input[type="radio"]').inside(this.__orderVendorTable.tableBodyElement);
  }

  get addVendorOrderButtonElement() {
    return locate('button')
      .withText('Next')
      .inside(this.__addDialogComponent.dialogFooterElement);
  }

  get doneVendorOrderButtonElement() {
    return locate('button')
      .withText('Done')
      .inside(this.__addDialogComponent.dialogFooterElement);
  }

  get datePickerDeliveryDate() {
    return new DatePickerComponent({ css: 'div[class*="OrdersBrowse__order-date"]' }, 'Delivery Date');
  }

  get datePickerCoverUntilDate() {
    return new DatePickerComponent({ css: 'div[class*="OrdersBrowse__order-date"]' }, 'Cover Until');
  }

  searchVendorInOrderTable(vendorItemName, numberOfSearchResult = 1) {
    I.waitForVisible(this.searchVendorInputElement, this.runnerConfig.actionTimeout);
    I.waitForEnabled(this.searchVendorInputElement, this.runnerConfig.actionTimeout);
    I.click(this.searchVendorInputElement);
    I.clearField(this.searchVendorInputElement);
    I.fillField(this.searchVendorInputElement, vendorItemName);
    I.waitNumberOfVisibleElements(
      locate('input').inside(this.__orderVendorTable.tableDataElement),
      numberOfSearchResult,
      this.runnerConfig.actionTimeout
    );
  }

  selectVendorInOrderTable(deliveryDate, coverUntilDate) {
    I.click(this.selectVendorInVendorTableElement);
    I.click(this.addVendorOrderButtonElement);
    this.datePickerDeliveryDate.setDateTime(deliveryDate);
    this.datePickerCoverUntilDate.setDateTime(coverUntilDate);
    I.click(this.doneVendorOrderButtonElement);
  }
}

exports.AddOrderComponent = AddOrderComponent;
