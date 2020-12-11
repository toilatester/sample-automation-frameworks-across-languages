/**
 * Just ignore this file, This is just a support file when I create this framework.
 */

const { wait } = require('../../core/wait');
const { LoginPage, HomePage } = require('../../pom');

let loginPage = new LoginPage();
let homePage = new HomePage();

function checkIconDisplay(abc) {
    return async function () {
        console.log(abc);
        await wait.waitForPresenceThenDisplay(homePage.icoAccount);
    }
}

async function login(usr, pwd) {
    await loginPage.login(usr, pwd);
}

module.exports = {
    checkIconDisplay,
    login
}