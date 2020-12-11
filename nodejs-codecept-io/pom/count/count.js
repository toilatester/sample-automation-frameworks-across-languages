/* eslint-disable no-undef*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
// const { AbstractPage } = require('../../core/base/base.page');
// const { HierarchyComponent } = require('../../core/base/core.component/hierarchy.item');
const { AbstractPage, HierarchyComponent } = require('../../core/base');

const { CountSetupLocation } = require('./location/count.location');

const I = actor();
class Count extends AbstractPage {
  constructor() {
    super();
    this._pagePath = this.urlPath.CONFIG;
    this.__hierarchyComponent = new HierarchyComponent();
    this.__countSetupLocation = new CountSetupLocation();
  }

  selectStore(storeName) {
    this.__hierarchyComponent.selectStore(storeName);
  }

  addLocation(locationName) {
    this.__countSetupLocation.open();
    this.__countSetupLocation.addLocation(locationName);
  }

  addLocationWithNestedUnderOption(locationName, nestUnderLocationName) {
    this.__countSetupLocation.open();
    this.__countSetupLocation.addLocationWithNestUnderLocation(locationName, nestUnderLocationName);
  }
}

exports.Count = Count;
