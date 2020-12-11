/* eslint-disable no-undef*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { AbstractComponent } = require('../base.component');
const { IconsComponent } = require('./icons');

const I = actor();

class DatePickerComponent extends AbstractComponent {
  constructor(root, datePickerLabel) {
    super();
    root = root || 'div[class*="EchoDatePicker"]';
    this.__childRoot = locate({
      xpath: `//*[contains(normalize-space(text()),"${datePickerLabel}")]/ancestor::label`
    }).inside(root);
    this.__root = locate('label').withDescendant(this.__childRoot);
    this.__iconsComponent = new IconsComponent();
  }

  get datePickerOpenButtonElement() {
    return this.__iconsComponent.iconChevronDown(this.__root);
  }

  get datePickerInputElement() {
    return locate('input').inside(this.__root);
  }

  setDateTime(dateValue) {
    I.waitForVisible(this.datePickerInputElement, this.runnerConfig.actionTimeout);
    I.waitForEnabled(this.datePickerInputElement, this.runnerConfig.actionTimeout);
    I.click(this.datePickerInputElement);
    I.clearField(this.datePickerInputElement);
    I.fillField(this.datePickerInputElement, dateValue);
  }

  async getDateTimeValue() {
    return I.grabValueFrom(this.datePickerInputElement);
  }
}

exports.DatePickerComponent = DatePickerComponent;
