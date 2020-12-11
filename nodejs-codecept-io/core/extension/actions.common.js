/* eslint-disable ,camelcase */
const { helper } = require('codeceptjs/lib');
const { RunnerConfig } = require('../config/runner.config');
const { PATH } = require('../../core/constant/url.path');
const { RunnerHelper } = require('../helper');
const { assertTextEquals, assertTextInclude, assertEquals } = require('../assert');

class ActionsCommonHelper extends helper {
  constructor(config) {
    super();
    this.__engine = config.engine;
    this.__runnerConfig = new RunnerConfig();
  }

  seeEquals(actual, expected, message) {
    assertEquals(actual, expected, message);
  }

  seeTextEquals(actual, expected, message) {
    assertTextEquals(actual, expected, message);
  }

  seeTextInclude(actual, expected, message) {
    assertTextInclude(actual, expected, message);
  }

  async navigateToAuthenticatePage() {
    return this.__navigateTo(this.__runnerConfig.authenticateUrl);
  }

  async navigateToHomePage() {
    return this.__navigateTo(`${this.__runnerConfig.appUrl}/#/`);
  }

  async navigateToAdjustmentPage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.ADJUSTMENT));
  }

  async navigateToConfigPage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.CONFIG));
  }

  async navigateToCountFrequencyPage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.COUNT_FREQUENCY));
  }

  async navigateToCountSheetPage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.COUNT_SHEET));
  }

  async navigateToCreateFrequencyPage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.CREATE_FREQUENCY));
  }

  async navigateToInvoicePage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.INVOICE));
  }

  async navigateToOrderPage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.ORDER));
  }

  async navigateToReceivePage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.RECEIVE));
  }

  async navigateToSetupCategoryPage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.SETUP_CATEGORY));
  }

  async navigateToSetupItemPage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.SETUP_ITEM));
  }

  async navigateToSetupLocationPage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.SETUP_LOCATION));
  }

  async navigateToSetupRecipePage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.SETUP_RECIPE));
  }

  async navigateToSetupUOMPage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.SETUP_UOM));
  }

  async navigateToSetupVendorPage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.SETUP_VENDOR));
  }

  async navigateToSetItemFrequencyPage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.SET_ITEM_FREQUENCY));
  }

  async navigateToTransferPage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.TRANSFER));
  }

  async navigateToWacActivityPage() {
    return this.__navigateTo(this.__runnerConfig.urlBuilder(this.__runnerConfig.appUrl, PATH.WAC_ACTIVITY));
  }

  async __navigateTo(url) {
    const engine = RunnerHelper.getCurrentBrowserEngine(this.__engine);
    return engine.context.amOnPage(url);
  }
}

module.exports = ActionsCommonHelper;
