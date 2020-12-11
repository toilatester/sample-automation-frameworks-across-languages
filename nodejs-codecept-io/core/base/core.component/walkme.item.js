/* eslint-disable no-undef*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { AbstractComponent } = require('../base.component');

const I = actor();

class WalkmeComponent extends AbstractComponent {
  constructor() {
    super();
    this.__root = '#walkme-menu';
  }

  get helpButtonElement() {
    return locate('//span[contains(normalize-space(text()), "Help")]').inside('//div[@id="walkme-tabs"]');
  }

  get releaseNoteButtonElement() {
    return locate('//span[contains(normalize-space(text()), "Release Notes")]').inside('//div[@id="Release Notes"]');
  }

  get searchInputElement() {
    return locate('div[class~="walkme-search-box-container"] input[style*="block"]').inside('#walkme-main');
  }

  clickToHelp() {
    I.click(this.helpButtonElement);
  }

  clickToReleaseNotes() {
    I.click(this.releaseNoteButtonElement);
  }

  inputToSearchInWalkme(search) {
    I.fillField(this.searchInputElement, search);
  }
}

exports.WalkmeComponent = WalkmeComponent;
