const {By, Webdriver, until} = require('selenium-webdriver');
const {BasePage, sleep} = require('../../core/base.page');
const {WaitContext} = require('../../core/wait');

const feedBackSearchFullPath = '/Feedbacks/SearchFull';

class FeedBackSearchFullPage extends BasePage {

    searchHeadLine = 'xpath://*[contains(.,"Search All Feedbacks")]';
    searchViewOption = 'id:viewOption';
    searchButton = 'id:btnSearch';

    constructor(driver) {
        super(driver, feedBackSearchFullPath);
        this.wait = new WaitContext(driver);
    }

    get headLineElm() {
        return this.getElement(this.searchHeadLine);
    }

    get viewOptionElm() {
        return this.getElement(this.searchViewOption);
    }

    get searchBtnElm() {
        return this.getElement(this.searchButton);
    }

    async isSearchAllLoaded() {
        await this.wait.waitForElementDisplayed(this.headLineElm);
    }
}

exports.FeedBackSearchFullPage = FeedBackSearchFullPage;
