/* eslint-disable ,camelcase */
const JSON = require('circular-json');
const { helper } = require('codeceptjs/lib');
const { screenshotOutputFolder } = require('codeceptjs/lib/utils');
const fs = require('fs');
const { RunnerConfig } = require('../config/runner.config');
const { Constant } = require('../report');
const { AuthenticateHelper, ReportPortalHelper, RunnerHelper } = require('../helper');
const { assertTextEquals, assertTextInclude } = require('../assert');

const DEFAULT_ALLOW_ACTION_LOG_PICTURE = [
  'click',
  'clickLink',
  'doubleClick',
  'fillField',
  'clearField',
  'checkOption',
  'pressKey',
  'amOnPage',
  'seeElement',
  'waitForElement',
  'waitForInvisible',
  'waitForVisible',
  'waitNumberOfVisibleElements',
  'waitForValue',
  'waitForText',
  'seeNumberOfElements',
  'seeNumberOfVisibleElements',
  'moveCursorTo',
  'grabTextFrom'
];

class ActionsElementHelper extends helper {
  constructor(config) {
    super();
    this.__retryInputCount = 0;
    this.__allowAttachScreenShot = config.allowActionLogPicture || DEFAULT_ALLOW_ACTION_LOG_PICTURE;
    this.__maxRetryInput = config.maxRetryInput;
    this.__engine = config.engine;
    this.__inputDelay = config.slowDownInputTime;
    this.__loadingElementLocator = config.loadingElementLocator;
    this.__runnerConfig = new RunnerConfig();
  }

  /**
   * Hook executed before each step
   *
   * @param {*} step
   * @override
   */
  async _beforeStep() {
    return this.waitForLoadingIconInvisible();
  }

  /**
   * Hook executed after each step
   *
   * @param {*} step
   * @override
   */
  async _afterStep(step) {
    if (RunnerConfig.isDebugMode) return Promise.resolve();
    return this.__captureScreenShotAfterStep(step);
  }

  /**
   * Hook executed before failed test
   *
   * @param {test} test
   * @override
   */
  async _failed(test) {
    if (RunnerConfig.isDebugMode) return Promise.resolve();
    return this.__captureScreenShotFailedTest(test);
  }

  async waitForClickable(locator, timeout) {
    try {
      timeout = timeout || this.__runnerConfig.actionTimeout;
      const engine = RunnerHelper.getCurrentBrowserEngine(this.__engine);
      // If engine is protrator, we will use default method
      if (engine.engineName === RunnerHelper.listSupportBrowserHelpers.Protractor) {
        return engine.context.waitForClickable(locator, timeout);
      }
      await engine.context.waitForElement(locator, timeout);
      await engine.context.waitForVisible(locator, timeout);
      await engine.context.waitForEnabled(locator, timeout);
      return Promise.resolve();
    } catch (err) {
      return Promise.reject(err);
    }
  }

  async waitForLoadingIconInvisible(timeout) {
    const engine = RunnerHelper.getCurrentBrowserEngine(this.__engine);
    return engine.context.waitForInvisible(this.__loadingElementLocator, timeout || this.__runnerConfig.actionTimeout);
  }

  async waitForLoadingIconVisible(timeout) {
    const engine = RunnerHelper.getCurrentBrowserEngine(this.__engine);
    return engine.context.waitForVisible(this.__loadingElementLocator, timeout || this.__runnerConfig.actionTimeout);
  }

  async sendScreenShotToReportPortal(name, logLevel, message) {
    if (RunnerConfig.isDebugMode) return Promise.resolve();
    const defaultFileName = new Date().getTime();
    const fileName = name || `${defaultFileName.toString()}.png`;
    const imagePath = screenshotOutputFolder(fileName);
    const engine = RunnerHelper.getCurrentBrowserEngine(this.__engine);
    await engine.context.saveScreenshot(fileName, false);
    const fileObject = fs.readFileSync(imagePath);
    ReportPortalHelper.sendLogItemRequest(
      ReportPortalHelper.defaultReportStoreKey,
      {
        level: logLevel,
        message: message
      },
      {
        name: fileName,
        type: 'image/png',
        content: fileObject
      }
    );
    fs.unlinkSync(imagePath);
    return ReportPortalHelper.finishAllAgentRequests(ReportPortalHelper.defaultReportStoreKey);
  }

  async setAuthenticateCookie(domain) {
    const authenticate = new AuthenticateHelper();
    // Get username password in a debug.config.json, we will not commit the debug.config.json file
    // to github
    const loginToken = await authenticate.getApplicationIdToken(
      RunnerConfig.username || this.__runnerConfig.getConfigData('username'),
      RunnerConfig.password || this.__runnerConfig.getConfigData('password'),
      RunnerConfig.impersonateUserName || this.__runnerConfig.getConfigData('impersonateUserName')
    );
    const engine = RunnerHelper.getCurrentBrowserEngine(this.__engine);
    return engine.context.setCookie({ name: 'ID_TOKEN', value: loginToken, domain });
  }

  async clickLink(locator) {
    // Only Puppeteer support clickLink and this method will override clickLink in
    // test script into click method
    const engine = RunnerHelper.getCurrentBrowserEngine(this.__engine);
    if (engine.engineName !== RunnerHelper.listSupportBrowserHelpers.Puppeteer) {
      return engine.context.click(locator);
    }
    return engine.context.clickLink(locator);
  }

  async fillField(locator, value, delayInput) {
    if (this.__retryInputCount > this.__maxRetryInput) {
      return Promise.reject(new Error('Has error in input value.'));
    }
    const engine = RunnerHelper.getCurrentBrowserEngine(this.__engine);
    // Make sure value is string type
    value = value.toString();
    // Only support slowdown input with Puppeteer engine
    if (engine.engineName !== RunnerHelper.listSupportBrowserHelpers.Puppeteer) {
      await engine.context.fillField(locator, value);
      return this.__retryInput(locator, value, delayInput);
    }
    return this.__fillFieldInPuppeteerEngine(locator, value, delayInput);
  }

  async waitNumberOfVisibleElements(locator, number, timeout) {
    const engine = RunnerHelper.getCurrentBrowserEngine(this.__engine);
    engine.context.waitForElement(locator, timeout);
    engine.context.waitNumberOfVisibleElements(locator, number, timeout);
  }

  async waitInMilliseconds(milliseconds = 100) {
    return new Promise((done) => {
      setTimeout(done, milliseconds);
    });
  }

  seeTextEquals(actual, expected, message) {
    assertTextEquals(actual, expected, message);
  }

  seeTextInclude(actual, expected, message) {
    assertTextInclude(actual, expected, message);
  }

  /**
   * This is a magic method.
   * Sometimes, the echo component element
   * is caching the previous event.
   * Ex: When you clear text and type a new one
   * but when you are typing the new one
   * it can clear text with the previous clear event
   * =))
   * @param {String} locator
   * @param {String} value
   * @param {Number} delayInput
   */
  async __retryInput(locator, value, delayInput) {
    const engine = RunnerHelper.getCurrentBrowserEngine(this.__engine);
    const actualInput = await engine.context.grabValueFrom(locator);
    if (actualInput.toString() === value) {
      this.__retryInputCount = 0;
      return engine.context._waitForAction();
    }
    await this.sendScreenShotToReportPortal(
      'failedTest',
      Constant.LOG_LEVEL.WARN,
      `!!!MARKDOWN_MODE!!!\n## STEP:\nRetry input ${value} into ${JSON.stringify(locator)}`
    );
    this.__retryInputCount++;
    return this.fillField(locator, value, delayInput);
  }

  async __fillFieldInPuppeteerEngine(locator, value, delayInput) {
    const engine = RunnerHelper.getCurrentBrowserEngine(this.__engine);
    delayInput = delayInput || this.__inputDelay;
    const elements = await engine.context._locate(locator);
    const element = elements[0];
    await element.click();
    await element.focus();
    const tag = await element.getProperty('tagName').then((el) => el.jsonValue());
    const editable = await element.getProperty('contenteditable').then((el) => el.jsonValue());
    if (tag === 'INPUT' || tag === 'TEXTAREA') {
      await engine.context._evaluateHandeInContext((el) => {
        el.value = '';
      }, element);
    } else if (editable) {
      await engine.context._evaluateHandeInContext((el) => {
        el.innerHTML = '';
      }, element);
    }
    // It's a sad story :( sometimes input component can't not clear data after first time
    await element.type('', { delay: 10 });
    await element.type(value, { delay: delayInput });
    return this.__retryInput(locator, value, delayInput);
  }

  async __captureScreenShotAfterStep(step) {
    if (this.__allowAttachScreenShot.indexOf(step.helperMethod) < 0) return Promise.resolve();
    const fileName = `${step.name.toString()}.png`;
    const metaStep = step.metaStep
      && `${step.metaStep.actor.toString()} ${step.metaStep.helperMethod} with arguments ${JSON.stringify(step.args)} `;
    await this.sendScreenShotToReportPortal(
      fileName,
      Constant.LOG_LEVEL.INFO,
      `!!!MARKDOWN_MODE!!!\n## WRAPPER STEP:\n${metaStep || '\nN/A'}\n## DETAILS STEP:\n${step.actor.toString()} ${
        step.name
      } with arguments ${JSON.stringify(step.args)}\n${step.line()}`
    );
    return ReportPortalHelper.finishAllAgentRequests(ReportPortalHelper.defaultReportStoreKey);
  }

  async __captureScreenShotFailedTest(test) {
    const engine = RunnerHelper.getCurrentBrowserEngine(this.__engine);
    const browserJSLogs = await engine.context.grabBrowserLogs();
    const pageHtmlSource = await engine.context.grabSource();
    ReportPortalHelper.sendLogItemRequest(ReportPortalHelper.defaultReportStoreKey, {
      level: Constant.LOG_LEVEL.DEBUG,
      message: `!!!MARKDOWN_MODE!!!\n## JavaScript Error Console:\n\`\`\`javacript\n ${JSON.stringify(
        browserJSLogs
      )} \n\`\`\`\n`
    });
    ReportPortalHelper.sendLogItemRequest(ReportPortalHelper.defaultReportStoreKey, {
      level: Constant.LOG_LEVEL.DEBUG,
      message: `!!!MARKDOWN_MODE!!!\n## Current HTML Page Source:\n\`\`\`html\n ${pageHtmlSource} \n\`\`\`\n`
    });
    await ReportPortalHelper.finishAllAgentRequests(ReportPortalHelper.defaultReportStoreKey);
    return this.sendScreenShotToReportPortal(
      'failedTest',
      Constant.LOG_LEVEL.ERROR,
      `!!!MARKDOWN_MODE!!!\n## FAILED TEST:\n${test.err}`
    );
  }
}

module.exports = ActionsElementHelper;
