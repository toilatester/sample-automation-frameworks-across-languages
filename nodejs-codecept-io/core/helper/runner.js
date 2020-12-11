const { container } = require('codeceptjs');

const getBrowserHelperInstance = (keys) => {
  const listHelpers = container.helpers();
  const listHelperKeys = Object.keys(listHelpers);
  for (const key of listHelperKeys) {
    if (keys.includes(key)) {
      return { engineName: key, context: listHelpers[key] };
    }
  }
  throw new Error('Cannot find engine');
};
class RunnerHelper {
  static getCurrentBrowserEngine(engineName) {
    return getBrowserHelperInstance(engineName);
  }

  static get listSupportBrowserHelpers() {
    return {
      WebDriverIO: 'WebDriverIO',
      WebDriver: 'WebDriver',
      Protractor: 'Protractor',
      Appium: 'Appium',
      Nightmare: 'Nightmare',
      Puppeteer: 'Puppeteer'
    };
  }
}

exports.RunnerHelper = RunnerHelper;
