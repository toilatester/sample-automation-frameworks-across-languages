/* eslint-disable no-underscore-dangle */
const { config } = require('../config');
const { waitForElementDisplayed } = require('./wait');

class BasePage {
    constructor(driver, path) {
        this.baseUrl = config.baseUrl;
        this.path = path;
        this._driver = driver;
        this.timeout = 10;
    }

    async open() {
        await this._driver.get(this.baseUrl + this.path);
    }

    getElement(locator) {
        /* Locator must be in format: <type>:<value>
            Return: WebElement
        */
        if (!locator.includes(':')) throw TypeError('Locator not in correct format <type>:<value>');

        const locParts = locator.split(':');
        const selector = locParts[1];
        switch (locParts[0]) {
            case 'id':
                return this._driver.findElement({id: selector});
            case 'xpath':
                return this._driver.findElement({xpath: selector});
            case 'name':
                return this._driver.findElement({name: selector});
            default:
                throw TypeError(`Locator method ->${locParts[0]}<- is not supported`)
        }
    }

    async isOnPage() {
        return this.path === await this._driver.getCurrentUrl();
    }

    async isPageLoad(element, timeout = 10000) {
        /*
            element/locator: of object on page to wait for
        */
        await waitForElementDisplayed(this._driver, element, timeout)
    }

    async getPageTitle() {
        return this._driver.getTitle();
    }
}

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time * 1000));
}

exports.BasePage = BasePage;
exports.sleep = sleep;
