/* eslint-disable no-undef*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { AbstractComponent } = require('../base.component');

const { IconsComponent } = require('./icons');

const I = actor();
class NavigationConfigurationComponent extends AbstractComponent {
  constructor() {
    super();
    this.__iconsComponent = new IconsComponent();
    this.__root = {
      css: 'div[class*="nextgen-component-index"]',
    };
  }

  get configurationExpandCollapseElement() {
    return locate('use[*|href="#ico-chevron-right"]').inside(this.__root);
  }

  get organizationOverviewElement() {
    return this.__iconsComponent.iconInfo(this.__root);
  }

  get coporateSetupElement() {
    return this.__iconsComponent.iconTools(this.__root);
  }

  get applicationMenuElement() {
    return this.__iconsComponent.iconChevronDown(this.__root);
  }

  applicationMenuNavigationElement(labelName) {
    return locate(`//*[contains(normalize-space(text()), '${labelName}')]`).inside(this.__root);
  }

  navigateWithLabelName(labelName) {
    I.click(this.applicationMenuNavigationElement(labelName));
  }

  clickToapplicationDropdownIcon() {
    I.click(this.applicationMenuElement);
  }

  clickToExpandCollaspeConfigurationMenu() {
    I.click(this.configurationExpandCollapseElement);
  }
}

exports.NavigationConfigurationComponent = NavigationConfigurationComponent;
