const report = require('multiple-cucumber-html-reporter');
const { LoggerHelper } = require('../helper/log4js');
const Logger = new LoggerHelper('HTML Report');
async function generate() {
  const info = global.REPORT_INFO;
  Logger.logInfo('REPORT IS GENERATING....');
  Logger.logInfo('Info: ', info);
  report.generate({
    openReportInBrowser: true,
    jsonDir: global.REPORT_FOLDER_PATH,
    reportPath: global.REPORT_FOLDER_PATH,
    reportName: 'Sample Demo Automation',
    displayDuration: true,
    metadata: {
      app: {
        name: 'Admin',
        version: '1.0',
      },
      browser: {
        name: info.browser.name,
        version: info.browser.version,
      },
      device: 'Local machine',
      platform: {
        name: info.os.name,
        version: info.os.version,
      },
    },
    customData: {
      title: 'Running info',
      data: [
        {
          label: 'Project',
          value: 'Sample Demo',
        },
        {
          label: 'Release',
          value: info.release || '',
        },
        {
          label: 'Cycle',
          value: info.cycle || '',
        },
        {
          label: 'Execution Start Time',
          value: info.startTime || '',
        },
        {
          label: 'Execution End Time',
          value: info.completeTime || '',
        },
      ],
    },
  });
}

exports.generate = generate;
