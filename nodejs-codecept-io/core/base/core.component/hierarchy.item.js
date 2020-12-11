/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const { AbstractComponent } = require('../base.component');

const I = actor();
class HierarchyComponent extends AbstractComponent {
  constructor() {
    super();
    this.__root = '#background';
  }

  get openSelectStoreHierarchyButtonElement() {
    return locate('div[data-testid="global-nav-picker-button"]');
  }

  get searchBarElement() {
    return locate('input').inside(locate('div[data-testid="search-bar"]').inside(this.__root));
  }

  get selectStoreButtonElement() {
    return locate('//div[@data-testid="unvirtualized-hierarchy"]//input').inside(this.__root);
  }

  get selectButtonElement() {
    return locate('//button[contains(normalize-space(.),"Select")]').inside(this.__root);
  }

  get cancelButtonElement() {
    return locate('//button[contains(normalize-space(.),"Cancel")]').inside(this.__root);
  }

  openAndSelectStore(storeName) {
    this.openSelectStoreHierarchy();
    this.selectStore(storeName);
  }

  openSelectStoreHierarchy() {
    I.waitForVisible(this.openSelectStoreHierarchyButtonElement, this.runnerConfig.actionTimeout);
    I.click(this.openSelectStoreHierarchyButtonElement);
  }

  selectStore(storeName) {
    I.waitForVisible(this.searchBarElement, this.runnerConfig.actionTimeout);
    I.fillField(this.searchBarElement, storeName);
    I.waitNumberOfVisibleElements(this.selectStoreButtonElement, 1, this.runnerConfig.actionTimeout);
    I.click(this.selectStoreButtonElement);
    I.click(this.selectButtonElement);
    this.waitForComponentInvisible();
  }
}
exports.HierarchyComponent = HierarchyComponent;
