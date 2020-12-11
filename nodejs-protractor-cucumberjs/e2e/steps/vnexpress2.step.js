const { Given, When, Then, Before } = require("cucumber");
const { HomePageFactory } = require("../../pom/vnexpress2/home-page.factory");
const { wait } = require("../../core/wait");

const homePage = new HomePageFactory().createPage();

Given('I am on VN Express Home Page - PF',
    async function () {
        return homePage.openPage();
    });

When('I click on menu Video - PF',
    async function () {
        await homePage.navBar.open();
        await homePage.navBar.navigateTo(homePage.navBar.menu.VIDEO);
    });

Then('Video Page is displayed - PF',
    async function () {
        await wait.waitForUrlContains(homePage.navBar.menu.VIDEO.src);
    });