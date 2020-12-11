import test from 'ava';

const assert = require('assert');
const ava = require('ava');
const { runOnFailures } = require('../../core/base.util');
const { LoginPage, HomePage } = require('../../pom');
const { dataLogin } = require('../../data');
require('../../core/_base.test');

ava.serial.beforeEach((t) => {
  const { driver } = t.context;
  t.context.loginPage = new LoginPage(driver);
  t.context.homePage = new HomePage(driver);
});

async function testLoginSampleApp(t, username, password, errormsg = null) {
  const { loginPage, homePage } = t.context;

  try {
    await loginPage.open();
    await loginPage.loginWithCredential(username, password);
    if (errormsg === null) {
      await homePage.isHomePageLoad();
      const title = await homePage.getPageTitle();
      assert.equal(title, 'Home | Sample App Tool');
      assert.ok(await homePage.isUserAvatarVisible());
    } else {
      assert.ok(await loginPage.verifyErrorMessage(errormsg));
    }
  } catch (e) {
    // Lame way to handle assertion error and do something else.
    t.fail(e.message);
    runOnFailures(t.context.driver, e.message, t.title);
  }
}

dataLogin.forEach((data) => {
  testLoginSampleApp.title = () => data.context;
  test(testLoginSampleApp, data.username, data.password, data.error);
});
