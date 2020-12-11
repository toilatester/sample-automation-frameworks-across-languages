const {until} = require('selenium-webdriver');
const defaultTimeout = 10000;

class WaitContext {

    constructor(driver) {
        this._driver = driver;
    }

    async waitForElementDisplayed(element, timeout = defaultTimeout) {
        await this._driver.wait(until.elementIsVisible(element), timeout);
    }

    async waitForElementNotDisplayed(element, timeout = defaultTimeout) {
        await this._driver.wait(until.elementIsNotVisible(element), timeout);
    }

    async waitForTitleIs(title, timeout = defaultTimeout) {
        await this._driver.wait(until.titleIs(title), timeout);
    }

    async waitForUrlIs(url, timeout = defaultTimeout) {
        await this._driver.wait(until.urlIs(url), timeout);
    }
}

exports.WaitContext = WaitContext;
