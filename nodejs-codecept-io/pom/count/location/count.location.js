/* eslint-disable no-undef*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />
// const { AbstractPage } = require('../../../core/base/base.page');
const { AbstractPage } = require('../../../core/base');

const { AddLocationModal } = require('../components/add.location.modal');

const I = actor();
class CountSetupLocation extends AbstractPage {
  constructor() {
    super();
    this._pagePath = this.urlPath.SETUP_LOCATION;
    this.__addLocationModal = new AddLocationModal();
  }

  get addLocationButtonElement() {
    return {
      xpath: '//*[contains(normalize-space(text()), "Add")]/parent::button'
    };
  }

  get printButtonElement() {
    return {
      xpath: '//*[contains(normalize-space(text()), "Print")]/parent::button'
    };
  }

  addLocationWithNestUnderLocation(locationName, nestUnderLocationName) {
    I.waitForEnabled(this.addLocationButtonElement, this.runnerConfig.actionTimeout);
    I.click(this.addLocationButtonElement);
    this.__addLocationModal.waitForComponentVisible(this.runnerConfig.actionTimeout);
    this.__addLocationModal.addLocationWithNestUnderLocation(locationName, nestUnderLocationName);
    this.__addLocationModal.waitForComponentInvisible(this.runnerConfig.actionTimeout);
  }

  addLocation(locationName) {
    I.waitForEnabled(this.addLocationButtonElement, this.runnerConfig.actionTimeout);
    I.click(this.addLocationButtonElement);
    this.__addLocationModal.waitForComponentVisible(this.runnerConfig.actionTimeout);
    this.__addLocationModal.addLocation(locationName);
    this.__addLocationModal.waitForComponentInvisible(this.runnerConfig.actionTimeout);
  }
}

exports.CountSetupLocation = CountSetupLocation;
