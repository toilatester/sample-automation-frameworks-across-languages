const { expect } = require('chai');
const { Given, When, Then, Before } = require('cucumber');
const { wait } = require('../../core/wait');
const { LoginPage, HomePage } = require('../../pom');
const { checkIconDisplay } = require('./detailSteps');
let loginPage = new LoginPage();
let homePage = new HomePage();

Given('I logged in with user {string} and password {string}', async function (username, password) {
  await loginPage.openPage();
  await loginPage.login(username, password);
});

Given('I am on Sample App Login page', async function () {
  await loginPage.openPage();
});

When('I login with user {string} and password {string}', login);

Then('I see Login Page displayed', async function () {
  wait.waitForTitleIs(loginPage.title);
});

async function login(usr, pwd) {
  await loginPage.login(usr, pwd);
}

Then('ABC', async function () {
  this.count++;
  Logger.info(this.count);
});
