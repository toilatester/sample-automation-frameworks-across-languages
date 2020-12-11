/* eslint-disable no-undef*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />
const { AbstractComponent, IconsComponent } = require('../../../core/base');

const I = actor();

class AddLocationModal extends AbstractComponent {
  constructor() {
    super();
    this.__root = {
      css: '#background > div[class*="dialog"]'
    };
    this.__iconsComponent = new IconsComponent();
  }

  get inputLocationNameElement() {
    return locate('input[name="name"]').inside(this.__root);
  }

  get nestUnderCheckboxElement() {
    return locate('input[type="checkbox"]').inside(this.__root);
  }

  get nestUnderShowDropdownElement() {
    return this.__iconsComponent.iconChevronDown(this.__root);
  }

  get nestUnderSearchBarElement() {
    return locate('input[class*="EchoSearchBar"]').inside(this.__root);
  }

  locationItemInNestUnderDropdownElement(locationParentName) {
    return locate(`//*[contains(normalize-space(text()), '${locationParentName}')]`).inside(this.__root);
  }

  get saveButtonElement() {
    return locate('//*[contains(normalize-space(text()), "Save")]/parent::button').inside(this.__root);
  }

  get cancelButtonElement() {
    return locate('//*[contains(normalize-space(text()), "Cancel")]/parent::button').inside(this.__root);
  }

  addLocationWithNestUnderLocation(locationName, nestUnderLocationName) {
    I.fillField(this.inputLocationNameElement, locationName);
    I.click(this.nestUnderCheckboxElement);
    I.click(this.nestUnderShowDropdownElement);
    I.fillField(this.nestUnderSearchBarElement, nestUnderLocationName);
    I.click(this.locationItemInNestUnderDropdownElement(nestUnderLocationName));
    I.waitForEnabled(this.saveButtonElement);
    I.click(this.saveButtonElement);
  }

  addLocation(locationName) {
    I.fillField(this.inputLocationNameElement, locationName);
    I.waitForEnabled(this.saveButtonElement);
    I.click(this.saveButtonElement);
  }
}

exports.AddLocationModal = AddLocationModal;
