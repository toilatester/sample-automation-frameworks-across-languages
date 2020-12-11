/* eslint-disable no-undef*/
// in this file you can append custom step methods to 'I' object
/// <reference path="../../typings/steps.d.ts" />
const I = actor();
const { RunnerConfig } = require('../config/runner.config');
const { PATH } = require('../constant/url.path');

const config = new RunnerConfig();
class AbstractPage {
  constructor() {
    this._pagePath = '/';
  }

  get runnerConfig() {
    return config;
  }

  get urlPath() {
    return PATH;
  }

  open() {
    I.amOnPage(config.urlBuilder(config.appUrl, this._pagePath));
  }

  isAt() {
    try {
      I.seeInCurrentUrl(this.__pagePath);
      return true;
    } catch (err) {
      if (err instanceof EmptinessAssertion) return false;
      throw err;
    }
  }

  waitForLoadingIconInvisible(timeout) {
    I.waitForLoadingIconInvisible(timeout);
  }

  waitForLoadingIconVisible(timeout) {
    I.waitForLoadingIconVisible(timeout);
  }
}

exports.AbstractPage = AbstractPage;
