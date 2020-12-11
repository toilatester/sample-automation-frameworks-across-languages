/* eslint-disable no-undef*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../../typings/steps.d.ts" />
const { AbstractComponent } = require('../base.component');
const { IconsComponent } = require('./icons');

class DialogComponent extends AbstractComponent {
  constructor() {
    super();
    this.__root = { css: '#background > div[class*="dialog"]' };
    this.__iconsComponent = new IconsComponent();
  }

  get dialogHeaderElement() {
    return locate('div[class*="component-header"][class*="component-dialog"]').inside(this.__root);
  }

  get dialogTitleElement() {
    return locate('div[class*="EchoText"]').after(this.dialogHeaderElement);
  }

  get dialogCloseIconElement() {
    return this.__iconsComponent.iconClose(this.dialogHeaderElement);
  }

  get dialogFormElement() {
    return locate('div[class*="ComponentLoading__wrapper"]')
      .or('form')
      .inside(this.__root);
  }

  get dialogFooterElement() {
    return locate('div[class*="footer"]').inside(this.__root);
  }
}

exports.DialogComponent = DialogComponent;
