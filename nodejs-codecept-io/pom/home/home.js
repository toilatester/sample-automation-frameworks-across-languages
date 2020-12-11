/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { AbstractPage, HierarchyComponent } = require('../../core/base');

const I = actor();
class Home extends AbstractPage {
  constructor() {
    super();
    this._pagePath = '/#';
    this.__hierarchyComponent = new HierarchyComponent();
  }

  selectCompanyRadioElement(companyName) {
    return locate(`//span[normalize-space(text())="${companyName}"]/parent::div//input`).inside(
      '#background > div[class*="echo-component-dialog"]'
    );
  }

  get continueButtonSelectCompanyElement() {
    return locate('div[class*="echo-component-footer"] button')
      .withText('Continue')
      .inside('div[class*="echo-component-dialog"]');
  }

  selectStore(storeName) {
    this.__hierarchyComponent.selectStore(storeName);
  }

  selectCompany(companyName) {
    I.waitForVisible(this.selectCompanyRadioElement(companyName), this.runnerConfig.actionTimeout);
    I.click(this.selectCompanyRadioElement(companyName));
    I.waitForEnabled(this.continueButtonSelectCompanyElement);
    I.click(this.continueButtonSelectCompanyElement);
  }
}

exports.Home = Home;
