const program = require('commander');
const path = require("path");
const fs = require("fs");

const CURRENT_SESSION_INFO_FILE_NAME = '../config/report/report.config.json';

function getUnique(text) {
    let date = new Date();
    return `${text}${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}

async function getOSInformation() {
    let info = require(CURRENT_SESSION_INFO_FILE_NAME);
    let navigatorInfo = await browser.executeScript("return navigator.appVersion");

    if (navigatorInfo.indexOf("Windows")) {
        info.os.name = "Windows";
        if (navigatorInfo.indexOf("Windows NT 10.0") != -1)
            info.os.version = "10";
        if (navigatorInfo.indexOf("Windows NT 6.2") != -1)
            info.os.version = "8";
        if (navigatorInfo.indexOf("Windows NT 6.1") != -1)
            info.os.version = "7";
        if (navigatorInfo.indexOf("Windows NT 6.0") != -1)
            info.os.version = "Vista";
        if (navigatorInfo.indexOf("Windows NT 5.1") != -1)
            info.os.version = "XP";
        if (navigatorInfo.indexOf("Windows NT 5.0") != -1)
            info.os.version = "2000";
    } else if (navigatorInfo.indexOf("Mac") != -1)
        info.os.name = "Mac/iOS";
    else if (navigatorInfo.indexOf("X11") != -1)
        info.os.name = "UNIX";
    else if (navigatorInfo.indexOf("Linux") != -1)
        info.os.name = "Linux";

    console.log("Detected OS: ", info.os.name, " ", info.os.version);
    fs.writeFile('./config/report/report.config.json', JSON.stringify(info), 'utf8', function (err) {
        if (err) {
            console.log("Write file unsucessful");
        }
    });
}

/**
 * When running parallel or crossbrowser, rerun file is generated more than 1 files
 * This function is used to combined all file in rerunFolderPath into @rerun.txt and remove all other file
 * @param {*} rerunFolderPath 
 */
function combineRerunFiles(rerunFolderPath) {
    let summaryRerunFile = path.join(rerunFolderPath, "@rerun.txt");
    let rerunFile = fs.writeFile(summaryRerunFile, "", function (err) {
        console.log("Error ", err);
    });
    let files = fs.readdirSync(rerunFolderPath);
    // let rerunScenarios = new Buffer();
    for (let i = 0; i < files.length; i++) {
        if (files[i].includes("@rerun") && files[i] !== "@rerun.txt") {
            // Read data from file
            let filename = path.join(rerunFolderPath, files[i]);
            let data = fs.readFileSync(filename);
            // Delete file
            fs.unlinkSync(filename);
            // Merge data into @rerun.txt
            fs.appendFileSync(summaryRerunFile, data);
            fs.appendFileSync(summaryRerunFile, "\n");
        }
    }
}

function extractCommandlineOptions() {
    program
        .version('0.1.0')
        .option('-capability, --capability <cap>', 'Define capability for browser', 'chrome')
        .option('-isReRun, --isReRun ', 'Rerun fail test case [true/false]', false)
        .option('-fs, --fullscreen', 'Run test with fullscreen browser')
        .option('-env, --environment <env>', 'Set environment under test', /^(DEV|QA|STAGING|PRODUCTION)$/, 'QA')
        .option('-t, --tags <tags>', 'Setting which tags will be tested')
        .option('-l , --language', 'Setting for language')
        .parse(process.argv);
    let capability = "chrome";
    let isReRun = false;
    let env = 'QA';
    let tags = undefined;
    if (program.capability) {
        capability = program.capability;
        console.log("Capability: ", capability);
    }
    if (program.isReRun) {
        isReRun = program.isReRun;
        console.log("IsRerun: ", isReRun);
    }
    if (program.environment) {
        env = program.environment;
        console.log("Env: ", env);
    }
    if (program.tags) {
        tags = program.tags;
        console.log("Tags: ", tags);
    }
    // Assign language global variable, default is eng
    global.language = program.language || "eng";
    return {
        capability,
        isReRun,
        tags
    };
}

async function generateReportFolder() {
    let reportFolderPath = getUnique("cucumber_reports/");
    // Create directory for storing test results
    fs.mkdir(reportFolderPath, function (err) {
        if (err) console.log("Failed to create report folder");
        else console.log("Created report folder!");
    });
    global.REPORT_FOLDER_PATH = reportFolderPath;
}

module.exports = {
    getUnique,
    getOSInformation,
    combineRerunFiles,
    extractCommandlineOptions,
    generateReportFolder
}