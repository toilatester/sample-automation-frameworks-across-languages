const { wait } = require("./wait");
const { browser } = require("protractor");
class Action {
    /**
     * ACTION ON BROWSER
     */

    async navigate(url) {
        await browser.get(url, 15000);
    }

    /**
     *  ACTION ON ELEMENT 
     */
    async click(webObject) {
        // await wait.waitForPresence(webObject);
        await wait.waitForPresenceThenDisplay(webObject);
        await wait.waitForElementClickable(webObject);
        await webObject.click();
    }

    async hover(webObject) {
        // await wait.waitForPresence(webObject);
        await wait.waitForPresenceThenDisplay(webObject);
        await browser.actions().mouseMove(webObject).perform();
    }

    /**
     * This should be used when element need to be clicked is covered by another 
     * @param {ElementFinder} webObject 
     */
    async clickAnyway(webObject) {
        await wait.waitForPresence(webObject);
        try {
            await wait.waitForElementClickable(webObject);
            await webObject.click();
        }
        catch (exception) {
            Logger.warning("Warning: ", exception);
        }
    }

    async sendKeys(webObject, expr) {
        await wait.waitForPresenceThenDisplay(webObject);
        await webObject.sendKeys(expr);
    }

    async clearThenSendKeys(webObject, expr) {
        await wait.waitForPresenceThenDisplay(webObject);
        await webObject.clear();
        await webObject.sendKeys(expr);
    }
}

exports.action = new Action();
// module.exports = {
//     navigate,
//     click,
//     sendKeys,
//     clearThenSendKeys,
// }
