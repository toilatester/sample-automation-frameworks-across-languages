const { expect } = require('chai');
const { Given, When, Then, Before } = require('cucumber');
const { wait } = require('../../core/wait');
const { LoginPage, HomePage } = require('../../pom');
const { checkIconDisplay } = require('./detailSteps');
let loginPage = new LoginPage();
let homePage = new HomePage();

Given('I am on Sample App Home page', async function () {
  try {
    await wait.waitForUrlIs(homePage.url);
  } catch (exception) {
    await homePage.openPage();
  }
});

When('I should see account icon displayed', async function () {
  return 'pending';
});

When('I should see account icon displayed - HP', async function checkIconDisplay(docstring) {
  await wait.waitForPresenceThenDisplay(homePage.icoAccount);
});

When('I log out', async function () {
  await homePage.openRightSideBar();
  await homePage.rightSideBar.logout();
});
