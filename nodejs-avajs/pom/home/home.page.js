const {LegacyActionSequence} = require('selenium-webdriver/lib/actions');
const {BasePage, sleep} = require('../../core/base.page');
const {WaitContext} = require('../../core/wait');
const {baseData} = require('../../data');

const homePath = '';

class HomePage extends BasePage {

    homeViewFeedbacksMenu = 'xpath://*[contains(.,"View Feedbacks")]';
    homeUserAvatar = 'xpath://*[@class="grid-emp-avatar"]';
    homeViewFeedbacksSearchAll = 'xpath://*[contains(., "Search All")]';

    constructor(driver) {
        super(driver, homePath);
        this.wait = new WaitContext(driver);
        this.actions = new LegacyActionSequence(driver);
    }

    get viewFeedbackMenuElm() {
        return this.getElement(this.homeViewFeedbacksMenu);
    }

    get userAvatarElm() {
        return this.getElement(this.homeUserAvatar);
    }

    get viewFeedBacksSearchAllElm() {
        return this.getElement(this.homeViewFeedbacksSearchAll);
    }

    async isHomePageLoad() {
        await this.wait.waitForUrlIs(baseData.homepageUrl);
    }

    async isUserAvatarVisible() {
        await this.wait.waitForElementDisplayed(this.userAvatarElm);
    }

    async clickViewFeedbacks() {
        await this.viewFeedbackMenuElm.click();
    }

    async clickSearchAll() {
        await this.clickViewFeedbacks();
        await this.wait.waitForElementDisplayed(this.viewFeedBacksSearchAllElm);
        await this.viewFeedBacksSearchAllElm.click();
    }
}

exports.HomePage = HomePage;
