"use strict";

const {
    After,
    defineParameterType,
    setDefaultTimeout,
    Status,
    Before,
    BeforeAll,
    AfterAll
} = require("cucumber");

const DEFAULT_TIMEOUT = 60000;

setDefaultTimeout(DEFAULT_TIMEOUT);
BeforeAll(function (scenario) {
    console.log("BeforeAll ", scenario);
    return scenario();
})
Before(function (scenario) {
    console.log("Before ", scenario);
})

After(function (scenario) {
    console.log("After ",scenario);
    if (scenario.result.status === Status.AMBIGUOUS) {
        const attach = this.attach;
        return attach(scenario.result.exception.toString());
    }
    if (scenario.result.status === Status.FAILED) {
        const attach = this.attach; // cucumber's world object has attach function which should be used
        return browser.takeScreenshot().then(function (png) {
            const decodedImage = new Buffer(png, "base64");
            return attach(decodedImage, "image/png");
        });
    }
});

AfterAll(function (scenario) {
    console.log("AfterAll ", scenario);
    return scenario();
})
/**
 * This function does not work correctly. Under finding issue
 */
defineParameterType({
    name: "email",
    regexp: "abcd@gmail.com",
    useForSnippets: true,
    // preferForRegexpMatch: true,
});

defineParameterType({
    name: "language",
    regexp: ["English", "Espanol"],
    useForSnippets: true,
    transformer: function (arg) {
        let map = {
            default: "eng",
            english: "eng",
            espanol: "es"
        }
        return map[arg.toLowerCase()] || map["default"];
    }
    // preferForRegexpMatch: true,
});