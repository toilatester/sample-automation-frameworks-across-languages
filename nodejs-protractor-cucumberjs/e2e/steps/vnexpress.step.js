const { Given, When, Then, Before } = require("cucumber");
const { HomePage } = require("../../pom/vnexpress/home.page");
const { wait } = require("../../core/wait");

const homePage = new HomePage();

Before(function(){
    browser.ignoreSynchronization = true;
})

Given('I am on VN Express Home Page',
    async function () {
        return homePage.openPage();
    });

When('I click on menu Video',
    async function () {
        await homePage.navBar.open();
        await homePage.navBar.navigateTo(homePage.navBar.menu.VIDEO);
    });

Then('Video Page is displayed',
    async function () {
        await wait.waitForUrlContains(homePage.navBar.menu.VIDEO.src);
    });