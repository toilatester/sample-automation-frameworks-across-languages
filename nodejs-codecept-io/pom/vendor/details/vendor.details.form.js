/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />
const {
  AbstractComponent,
  ToastNotificationComponent,
  IconsComponent,
  DropdownComponent,
} = require('../../../core/base');

const I = actor();

class AddFormComponent extends AbstractComponent {
  constructor() {
    super();
    this.__root = { css: 'div[class*="add-vendor-content"]' };
    this.__toastNotificationComponent = new ToastNotificationComponent();
    this.__iconsComponent = new IconsComponent();
  }

  get saveButton() {
    return { css: 'button[data-walkme-id="applicationVendorDetail/SaveButton"]' };
  }

  get cancelButton() {
    return {
      css: 'button[data-walkme-id="applicationVendorDetail/CancelButton"]',
    };
  }

  get deleteButton() {
    return {
      css: 'button[data-walkme-id="applicationVendorDetail/DeleteButton"]',
    };
  }

  get vendorNameInputElement() {
    return { css: 'input[data-walkme-id="applicationVendorDetail/VendorName"]' };
  }

  get vendorCodeInputElement() {
    return { css: 'input[data-walkme-id="applicationVendorDetail/VendorCode"]' };
  }

  get vendorActiveRadioElement() {
    return { css: 'input[data-walkme-id="applicationVendorDetail/RadioActive"]' };
  }

  get vendorInactiveRadioElement() {
    return {
      css: 'input[data-walkme-id="applicationVendorDetail/RadioInactive"]',
    };
  }

  get vendorStreetAddress1Element() {
    return { css: 'input[data-walkme-id="applicationVendorDetail/StreetAddress1"]' };
  }

  get vendorGeneralLedgerElement() {
    return { css: 'input[data-walkme-id="applicationVendorDetail/GeneralLedger"]' };
  }

  get vendorSelectCountryElement() {
    return new DropdownComponent({ css: 'div[data-walkme-id="applicationVendorDetail/Country"]' });
  }

  inputVendorName(name) {
    I.fillField(this.vendorNameInputElement, name);
  }

  inputVendorCode(code) {
    I.fillField(this.vendorCodeInputElement, code);
  }

  inputVendorStreetAddress1(address) {
    I.fillField(this.vendorStreetAddress1Element, address);
  }

  inputVendorGeneralLedger(generalLedger) {
    I.fillField(this.vendorGeneralLedgerElement, generalLedger);
  }

  setVendorToActive() {
    I.click(this.vendorActiveRadioElement);
  }

  setVendorToInactive() {
    I.click(this.vendorInactiveRadioElement);
  }

  selectVendorCountry(country) {
    this.vendorSelectCountryElement.selectDropdownOptionByText(country);
  }

  saveVendorInformation() {
    I.waitForEnabled(this.saveButton, this.runnerConfig.actionTimeout);
    I.click(this.saveButton);
    this.__toastNotificationComponent.waitForComponentAttachToDOM(this.runnerConfig.actionTimeout);
    this.__toastNotificationComponent.waitForComponentRemoveInDOM(this.runnerConfig.actionTimeout);
  }

  deleteVendorInformation() {
    I.click(this.deleteButton);
  }

  cancelVendorInformation() {
    I.click(this.cancelButton);
  }

  addNewVendorWithStatusActive(vendorName, vendorCode, address, generalLedger, country) {
    this.waitForComponentVisible(this.runnerConfig.actionTimeout);
    this.inputVendorName(vendorName);
    this.inputVendorCode(vendorCode);
    this.setVendorToActive();
    this.inputVendorStreetAddress1(address);
    this.inputVendorGeneralLedger(generalLedger);
    this.selectVendorCountry(country);
    this.saveVendorInformation();
  }

  addNewVendorWithStatusInactive(vendorName, vendorCode, address, generalLedger, country) {
    this.waitForComponentVisible(this.runnerConfig.actionTimeout);
    this.inputVendorName(vendorName);
    this.inputVendorCode(vendorCode);
    this.setVendorToInactive();
    this.inputVendorStreetAddress1(address);
    this.inputVendorGeneralLedger(generalLedger);
    this.selectVendorCountry(country);
    this.saveVendorInformation();
  }
}

exports.AddFormComponent = AddFormComponent;
