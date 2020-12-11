const { browser } = require("protractor");
const { Given, When, Then, defineStep } = require("cucumber");
const { HomePage } = require("../../pom/localizejs/home.page");
const { wait } = require("../../core/wait");
const { expect } = require("chai");
let homePage = new HomePage();

defineStep("I am on Localize home page",
    async function () {
        await homePage.openPage();
    });

defineStep("Title is displayed in {language}",
    async function (language) {
        let expectedTitle = homePage.expectedTitle(language);
        wait.waitForTitleIs(expectedTitle);
    });

defineStep("I change language into {language}",
    async function (language) {
        await homePage.changeLanguage(language);
    });