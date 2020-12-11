const { browser, element, ExpectedConditions: EC, by } = require("protractor");
const { ElementFinder } = require("protractor");

const TIMEOUT_DEFAULT = 10000;
const TIMEOUT_MESSAGE = "Don't wanna wait any more";

class Wait {
    /**
     * Waiting for {webObject} to be present in DOM then display
     * @param {ElementFinder} webObject ElementFinder object to be waited
     */
    async waitForPresenceThenDisplay(webObject) {
        await this.waitForPresence(webObject);
        await this.waitForDisplay(webObject);
    }

    /**
     * Waiting for {webObject} display. It will throw exception if element not found or timeout.
     * @param {ElementFinder} webObject ElementFinder object to be waited
     * @param {Number} timeout Max timeout, if not specific, default timeout will be applied
     * @param {String} message Message when timeout exception throwed. If not specific, default message will be applied
     */
    async waitForDisplay(webObject, message, timeout) {
        message = message ? message : `Element with locator ${webObject.locator()} is not displayed`;
        await this.wait(EC.visibilityOf(webObject), message, timeout);
    }

    /**
     * Waiting for {webObject} present in DOM. It will throw exception if timeout
     * @param {ElementFinder} webObject ElementFinder object to be waited
     * @param {Number} timeout Maximum waiting time. If not specific, default timeout will be applied
     * @param {String} message Message when timeout exception throwed. If not specific, default message will be applied
     */
    async waitForPresence(webObject, message, timeout) {
        message = message ? message : `Element with locator ${webObject.locator()} is not presented`;
        await this.wait(EC.presenceOf(webObject), message, timeout);
    }

    /**
     * Waiting for {webObject} to be visible and clickable. It will throw exception when {webObject} not found or timeout
     * @param {ElementFinder} webObject ElementFinder object to be waited
     * @param {Number} timeout Maximum waiting time. If not specific, default timeout will be applied
     * @param {String} message Message when timeout exception throwed. If not specific, default message will be applied
     */
    async waitForElementClickable(webObject, message, timeout) {
        message = message ? message : `Element with locator ${webObject.locator()} is not clickable`;
        await this.wait(EC.elementToBeClickable(webObject), message, timeout);
    }

    /**
     * Waiting for {url} appears
     * @param {String} url : String, url to be waited
     * @param {Number} timeout Maximum waiting time. If not specific, default timeout will be applied
     * @param {String} message Message when timeout exception throwed. If not specific, default message will be applied
     */
    async waitForUrlIs(url, message, timeout) {
        message = message ? message : `Url ${url} is not displayed`;
        await this.wait(EC.urlIs(url), message, timeout);
    }

    /**
     * Waiting for url containss {url} appears
     * @param {String} url : String, url to be waited
     * @param {Number} timeout Maximum waiting time. If not specific, default timeout will be applied
     * @param {String} message Message when timeout exception throwed. If not specific, default message will be applied
     */
    async waitForUrlContains(url, message, timeout) {
        message = message ? message : `Url contains ${url} is not displayed`;
        await this.wait(EC.urlContains(url), message, timeout);
    }

    /**
     * Waiting for {title} appears
     * @param {String} title : String, title to be waited
     * @param {Number} timeout Maximum waiting time. If not specific, default timeout will be applied
     * @param {String} message Message when timeout exception throwed. If not specific, default message will be applied
     */
    async waitForTitleIs(title, message, timeout) {
        message = message ? message : `Title ${title} is not displayed`;
        await this.wait(EC.titleIs(title), message, timeout);
    }

    /**
     * Wrapped waiting function to apply default timeout and default message
     * @param {Function} conditionFunc Function for waiting condition, it should return boolean variable to mark whether waiting condition is matched or not
     * @param {Number} timeout Maximum waiting time. If not specific, default timeout will be applied
     * @param {String} message Message when timeout exception throwed. If not specific, default message will be applied
     * @private
     */
    async wait(conditionFunc, message, timeout) {
        timeout = (timeout) ? timeout : TIMEOUT_DEFAULT;
        message = (message) ? message : TIMEOUT_MESSAGE;
        await browser.wait(conditionFunc, timeout, message);
    }
}

exports.wait = new Wait();
