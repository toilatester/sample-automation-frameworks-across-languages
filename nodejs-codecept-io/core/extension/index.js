const elementActionExtendsPath = require.resolve('./actions.elements');
const commonActionExtendsPath = require.resolve('./actions.common');

exports.EXTENSION_CONFIG = {
  COMMON_ACTION_EXTENDS: {
    NAME: 'COMMON_ACTION_EXTENDS',
    CONFIG: {
      require: commonActionExtendsPath,
      engine: ['WebDriverIO', 'WebDriver', 'Protractor', 'Appium', 'Nightmare', 'Puppeteer']
    }
  },
  ELEMENT_ACTION_EXTENDS: {
    NAME: 'ELEMENT_ACTION_EXTENDS',
    CONFIG: {
      // All helper extension requires the "require" value,
      // it must be the path to the helper extension module
      require: elementActionExtendsPath,
      loadingElementLocator: { xpath: '//div[contains(@class,"EchoSpinner") or contains(@class,"InternalLoading")]' },
      allowActionLogPicture: [
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
        'grabTextFrom',
        'waitForLoadingIconInvisible'
      ],
      engine: ['WebDriverIO', 'WebDriver', 'Protractor', 'Appium', 'Nightmare', 'Puppeteer'],
      // Config delay time in ms for Puppeteer engine
      slowDownInputTime: 50,
      // Config max retry input, sometimes the value input is not correctly after set value
      maxRetryInput: 3
    }
  }
};
