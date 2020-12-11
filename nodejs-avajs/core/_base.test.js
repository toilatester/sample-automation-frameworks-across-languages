const avajs = require('ava');
const {spawn} = require('child_process');
const {config} = require('../config');

const {Builder, Capabilities} = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

const chromeOps = Capabilities.chrome();
// set pageload strategy to avoid ECONNREFUSED
chromeOps.setPageLoadStrategy(config.capability.setPageLoadStrategy);

const createDriver = async () => {
    if (!config.useSeleniumGrid) {
        // ****  Use for running multiple browsers locally  ****
        const driverPath = require('chromedriver').path;
        return chrome.Driver.createSession(new chrome.Options(),
            new chrome.ServiceBuilder(driverPath).build());
    }

    // ****  Using builder raise ECONNREFUSED  ****
    return new Builder().forBrowser(config.browserName)
        .withCapabilities(chromeOps)
        // .setChromeOptions( ... )
        .usingServer(config.seleniumGridUrl)
        .build();
};

function setup() {
    avajs.serial.beforeEach(async (t) => {
        t.context.driver = await createDriver();

        // -i <source>: indicate the device from which ffmpeg will record the video.
        // In this case, main screen index is '1'
        if (config.videoRecord) {
            const videoPath = `${process.cwd()}/${config.videoFolder}/${Date.now()}.mkv`;
            t.context.recordProcess = await spawn('ffmpeg', ['-f', 'avfoundation', '-i', '1', `${videoPath}`]);
        }
    })
}

function tearDown() {
    avajs.afterEach.always(async (t) => {
        const {driver, recordProcess} = t.context;
        if (config.videoRecord) {
            recordProcess.kill()
        }
        await driver.quit();
    })
}

setup();
tearDown();
