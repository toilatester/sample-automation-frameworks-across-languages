/**
 * @fileOverview : Protractor configurations file
 * Protractor options:
 *    --suite=value : Run suite value which is defined in config.suite options
 * Extra options:
 *    --capability=value : perform testing with capability <value> which is defined in browser.json file
 *    --rerun : rerun the previous failed test which are stored in @rerun.txt. 
 *              When this flag is enable, option suite will be ignored
 * 
 * We can add more options example to configure baseURL base on test environment option, etc
 * 
 * NOTE: BROWSER INFO IS COVERED BY NEXT EXECUTION SESSION WHEN RUN CROSS BROWSER
 */

const fs = require("fs");
const path = require("path");
const {
    getCapability
} = require("./base/browser.config");
const {
    getCucumberOpts
} = require("./cucumber/cucumber.config");
const reporter = require("../reporter/report");
const {
    combineRerunFiles,
    getOSInformation,
    extractCommandlineOptions
} = require("../utils");
const bunyan = require("bunyan");

// Create a global Logger instance
global.Logger = bunyan.createLogger({
    name: "SC_Logger"
});


global.__projectRoot = process.cwd();

const CURRENT_SESSION_INFO_FILE_NAME = './currentSessionInfo.json';

let info = require(CURRENT_SESSION_INFO_FILE_NAME);

const startTime = new Date();

// Parse extra arguments which is sent from command line
// Note: Need to send exactly these option in command line
let {
    capability,
    isReRun,
    tags
} = extractCommandlineOptions();

let config = {
    SELENIUM_PROMISE_MANAGER: false,

    seleniumAddress: "http://localhost:4444/wd/hub",

    multiCapabilities: [
        getCapability(capability),
    ],

    specs: [
        //'../e2e/features/**/*.feature',
        '../e2e-demo/features/laura-api/*.feature'
    ],

    suites: {
        laura: "../e2e-demo/features/laura-api/*.feature",
        // count: ["../e2e/features/count/*.feature"],
        // sample: "../e2e/features/sample/*.feature",
        // one: "../e2e/features/vnexpress/*.feature",
        // localize: "../e2e/features/localize/*.feature",
        // pagefactory: "../e2e/features/vnexpress2/*.feature"
    },

    framework: "custom",

    frameworkPath: require.resolve("protractor-cucumber-framework"),

    cucumberOpts: getCucumberOpts(info.reportFolderPath, isReRun, tags),

    beforeLaunch: function () {
        // Get simulator config
        let info = require(CURRENT_SESSION_INFO_FILE_NAME);
        if (capability.indexOf("mobile") > -1) {
            // TODO: Apply for different simulators
            Logger.info("Running in simulator mode...");
            info.browser.simulator["deviceName"] = "something";
        }
        // Clear simulator info
        else {
            info.browser.simulator = {};
        };
        // Write the file
        fs.writeFile('./config/currentSessionInfo.json', JSON.stringify(info), 'utf8', function (err) {
            if (err) {
                Logger.error("Write file unsucessful");
            }
        });
    },

    onPrepare: async function () {
        // Get OS information and write into file
        await getOSInformation();

        // Maximum screen size if not simulator
        if (capability.indexOf("mobile") === -1) {
            browser.driver.manage().window().maximize();
        }
    },

    onComplete: async function () {
        let capability = await browser.getCapabilities();
        let info = require(CURRENT_SESSION_INFO_FILE_NAME);
        info.browser.name = capability.get("browserName");
        info.browser.version = capability.get("version");

        Logger.info("Detected browser: ", info.browser.name, " ", info.browser.version);
        fs.writeFile('./config/currentSessionInfo.json', JSON.stringify(info), 'utf8', function (err) {
            if (err) {
                Logger.error("Write file unsucessful");
            }
        });
    },

    afterLaunch: async function () {
        // Merge all rerun file
        if (!isReRun) {
            let rerunFolderPath = path.join(__projectRoot, "rerun");
            combineRerunFiles(rerunFolderPath);
        }

        // Generate report
        let info = require(CURRENT_SESSION_INFO_FILE_NAME);
        const completeTime = new Date();

        info["startTime"] = startTime.toUTCString();
        info["completeTime"] = completeTime.toUTCString();

        await reporter.generate(info);
    }
}

exports.config = config;