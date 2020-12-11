import test from 'ava';

const ava = require('ava');
const {baseData} = require('../../data');
const {LoginPage, HomePage, FeedBackSearchFullPage} = require('../../pom');
require('../../core/_base.test');

ava.serial.beforeEach((t) => {
    const {driver} = t.context;
    t.context.loginPage = new LoginPage(driver);
    t.context.homePage = new HomePage(driver);
    t.context.searchAll = new FeedBackSearchFullPage(driver);
});

async function testViewFeedbacks(t) {
    const {loginPage, homePage, searchAll} = t.context;
    await loginPage.open();
    await loginPage.loginWithCredential(baseData.user, baseData.passw);
    await homePage.isHomePageLoad();

    await searchAll.open();
    const displayed = await searchAll.isSearchAllLoaded();
    t.true(displayed);
}

test('Verify Search all of View Feedbacks', async (t) => {
    await testViewFeedbacks(t);
});
