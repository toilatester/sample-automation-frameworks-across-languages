const program = require('commander');
const path = require('path');
const fs = require('fs');
const { LoggerHelper } = require('../log4js');

const logger = new LoggerHelper('Utilities');
function getUnique(text) {
  const date = new Date();
  return `${text}${date.getFullYear()}-${date.getMonth() +
    1}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
}

async function getOSInformation() {
  const info = {
    browser: { name: '', simulator: {}, version: '' },
    os: { name: '', version: '' }
  };
  const navigatorInfo = await browser.executeScript(
    'return navigator.appVersion'
  );

  if (navigatorInfo.indexOf('Windows')) {
    info.os.name = 'Windows';
    info.os.version = getWindowsOS(navigatorInfo);
  } else if (navigatorInfo.indexOf('Mac') !== -1) info.os.name = 'Mac/iOS';
  else if (navigatorInfo.indexOf('X11') !== -1) info.os.name = 'UNIX';
  else if (navigatorInfo.indexOf('Linux') !== -1) info.os.name = 'Linux';

  logger.info('Detected OS: ', info.os.name, ' ', info.os.version);
  fs.writeFile(
    './config/report/report.config.json',
    JSON.stringify(info),
    'utf8',
    function writeErrorFile(err) {
      if (err) {
        logger.error('Write file unsucessful');
      }
    }
  );
}
function getWindowsOS(navigatorInfo) {
  if (navigatorInfo.indexOf('Windows NT 10.0') !== -1) return '10';
  if (navigatorInfo.indexOf('Windows NT 6.2') !== -1) return '8';
  if (navigatorInfo.indexOf('Windows NT 6.1') !== -1) return '7';
  if (navigatorInfo.indexOf('Windows NT 6.0') !== -1) return 'Vista';
  if (navigatorInfo.indexOf('Windows NT 5.1') !== -1) return 'XP';
  if (navigatorInfo.indexOf('Windows NT 5.0') !== -1) return '2000';
  return 'New OS';
}
/**
 * When running parallel or crossbrowser, rerun file is generated more than 1 files
 * This function is used to combined all file in rerunFolderPath into @rerun.txt and remove all other file
 * @param {*} rerunFolderPath
 */
function combineRerunFiles(rerunFolderPath) {
  const summaryRerunFile = path.join(rerunFolderPath, '@rerun.txt');
  const files = fs.readdirSync(rerunFolderPath);
  for (let i = 0; i < files.length; i++) {
    if (files[i].includes('@rerun') && files[i] !== '@rerun.txt') {
      // Read data from file
      const filename = path.join(rerunFolderPath, files[i]);
      const data = fs.readFileSync(filename);
      // Delete file
      fs.unlinkSync(filename);
      // Merge data into @rerun.txt
      fs.appendFileSync(summaryRerunFile, data);
      fs.appendFileSync(summaryRerunFile, '\n');
    }
  }
}

function extractCommandlineOptions() {
  program
    .version('0.1.0')
    .option(
      '-capability, --capability <cap>',
      'Define capability for browser',
      'chrome'
    )
    .option('-isReRun, --isReRun ', 'Rerun fail test case [true/false]', false)
    .option('-fs, --fullscreen', 'Run test with fullscreen browser')
    .option(
      '-env, --environment <env>',
      'Set environment under test',
      /^(DEV|QA|STAGING|PRODUCTION)$/,
      'QA'
    )
    .option('-t, --tags <tags>', 'setting which tags will be tested')
    .option('-l , --language', 'setting for language')
    .parse(process.argv);
  let capability = 'chrome';
  let isReRun = false;
  let tags = null;
  if (program.capability) {
    capability = program.capability;
    logger.info('Capability: ', capability);
  }
  if (program.isReRun) {
    isReRun = program.isReRun;
    logger.info('IsRerun: ', isReRun);
  }
  if (program.environment) {
    const env = program.environment;
    logger.info('Env: ', env);
  }
  if (program.tags) {
    tags = program.tags;
    logger.info('Tags: ', tags);
  }
  // Assign language global variable, default is eng
  global.language = program.language || 'eng';
  return {
    capability,
    isReRun,
    tags
  };
}

function generateReportFolder() {
  const reportFolderPath = getUnique('cucumber_reports/');
  logger.info(reportFolderPath);
  // Create directory for storing test results
  // Create recuisve folder path
  generateNestedFolder(reportFolderPath);

  global.REPORT_FOLDER_PATH = reportFolderPath;
}

function generateNestedFolder(folderPath) {
  folderPath.split(path.sep).reduce((currentPath, folder) => {
    currentPath += folder + path.sep;
    if (!fs.existsSync(currentPath)) {
      logger.info(`Create folder: ${currentPath}`);
      try {
        fs.mkdirSync(currentPath);
      } catch (err) {
        logger.error(`Error in create folder ${err}`);
        throw err;
      }
    }
    return currentPath;
  }, '');
}
module.exports = {
  getUnique,
  getOSInformation,
  combineRerunFiles,
  extractCommandlineOptions,
  generateReportFolder,
  generateNestedFolder
};
