/* eslint-disable no-undef*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { AbstractComponent } = require('../base.component');
const { IconsComponent } = require('./icons');

const I = actor();
/**
 * Try to select dropdown option
 * @param {Function} selectDropdownFunction
 *
 */

class DropdownComponent extends AbstractComponent {
  constructor(root) {
    super();
    this.__iconsComponent = new IconsComponent();
    this.__root = root;
  }

  get openDropdownElement() {
    return this.__iconsComponent.iconChevronDown(this.__root);
  }

  get dropDownOptionElements() {
    return locate('p')
      .or('div')
      .inside(locate('li').inside('div[class*="EchoDropDown"]'));
  }

  dropDownOptionTextElement(text) {
    return locate({ xpath: `.//*[normalize-space(text())="${text}"]` }).inside(
      locate('li').inside('div[class*="EchoDropDown"]')
    );
  }

  dropDownOptionIndexElement(index) {
    return locate('p')
      .or('div')
      .at(index)
      .inside(locate('li').inside('div[class*="EchoDropDown"]'));
  }

  clickToOpenDropDown() {
    I.waitForClickable(this.openDropdownElement, this.runnerConfig.actionTimeout);
    I.moveCursorTo(this.openDropdownElement, this.runnerConfig.actionTimeout);
    I.click(this.openDropdownElement);
  }

  selectDropdownOptionByText(text) {
    this.clickToOpenDropDown();
    I.waitForElement(this.dropDownOptionTextElement(text), this.runnerConfig.actionTimeout);
    I.waitForVisible(this.dropDownOptionTextElement(text), this.runnerConfig.actionTimeout);
    I.click(this.dropDownOptionTextElement(text));
  }

  selectDropdownOptionByIndex(index) {
    this.clickToOpenDropDown();
    I.waitForElement(this.dropDownOptionIndexElement(index), this.runnerConfig.actionTimeout);
    I.waitForVisible(this.dropDownOptionIndexElement(index), this.runnerConfig.actionTimeout);
    I.click(this.dropDownOptionIndexElement(index));
  }

  async getAllOptionText() {
    return I.grabTextFrom(this.dropDownOptionElements);
  }
}

exports.DropdownComponent = DropdownComponent;
