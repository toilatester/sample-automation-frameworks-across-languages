/* eslint-disable no-undef,*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const I = actor();
const { RunnerConfig } = require('../config/runner.config');

const config = new RunnerConfig();
class AbstractComponent {
  constructor() {
    this.__root = null;
  }

  get runnerConfig() {
    return config;
  }

  get rootElement() {
    return this.__root;
  }

  isPageContainsComponent() {
    try {
      I.seeElement(this.__root);
      return true;
    } catch (err) {
      if (err instanceof EmptinessAssertion) return false;
      throw err;
    }
  }

  waitForComponentInvisible(timeout) {
    I.waitForInvisible(this.__root, timeout || this.runnerConfig.actionTimeout);
  }

  waitForComponentVisible(timeout) {
    I.waitForVisible(this.__root, timeout || this.runnerConfig.actionTimeout);
  }

  waitForComponentAttachToDOM(timeout) {
    I.waitForElement(this.__root, timeout || this.runnerConfig.actionTimeout);
  }

  waitForComponentRemoveInDOM(timeout) {
    I.waitForDetached(this.__root, timeout || this.runnerConfig.actionTimeout);
  }

  waitForNumberOfVisibleChildElements(timeout, number) {
    I.waitNumberOfVisibleElements(this.__root, number, timeout || this.runnerConfig.actionTimeout);
  }

  waitForLoadingIconInvisible(timeout) {
    I.waitForLoadingIconInvisible(timeout);
  }

  waitForLoadingIconVisible(timeout) {
    I.waitForLoadingIconVisible(timeout);
  }
}

exports.AbstractComponent = AbstractComponent;
