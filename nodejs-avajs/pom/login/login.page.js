const {By, Webdriver, WebElement} = require('selenium-webdriver');
const {BasePage} = require('../../core/base.page');
const {WaitContext} = require('../../core/wait');
const {highlightElement} = require('../../core/base.util');

const loginPath = '/Home/Login';

class LoginPage extends BasePage {

    loginAccessKeyTab = 'xpath://li[contains(.,"Login By Access Key")]';
    loginCredentialsTab = 'xpath://li[contains(.,"Login By Credentials")]';
    loginUserName = 'id:username';
    loginPassword = 'id:password';
    loginButton = 'id:btnSubmit';
    errorMsg = 'id:pageMessage';

    constructor(driver) {
        super(driver, loginPath);
        this.wait = new WaitContext(driver);
    }

    get loginCredTabElm() {
        return this.getElement(this.loginCredentialsTab);
    }

    get userField() {
        return this.getElement(this.loginUserName);
    }

    get passField() {
        return this.getElement(this.loginPassword);
    }

    get loginBtn() {
        return this.getElement(this.loginButton);
    }

    get errMsg() {
        return this.getElement(this.errorMsg)
    }

    async fillUserName(value) {
        await highlightElement(this._driver, this.userField);
        await this.userField.sendKeys(value);
    }

    async fillPassword(value) {
        await this.passField.sendKeys(value);
    }

    async clickLoginButton() {
        await this.loginBtn.click();
    }

    async clickCredentialsTab() {
        await this.loginCredTabElm.click();
    }

    async loginWithCredential(username, password) {
        await this.clickCredentialsTab();
        await this.fillUserName(username);
        await this.fillPassword(password);
        await this.clickLoginButton();
    }

    async verifyErrorMessage(expected) {
        const actualMsg = await this.errMsg;
        return actualMsg === expected;
    }
}

exports.LoginPage = LoginPage;
