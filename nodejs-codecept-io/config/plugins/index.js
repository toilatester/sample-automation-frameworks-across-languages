const autoDelayPluginConfig = require('./auto.delay');
const puppeteerCoveragePluginConfig = require('./puppeteer.coverage');
const screenshotOnFailPluginConfig = require('./screenshot.on.fail');
const stepByStepReportPluginConfig = require('./step.by.step.report');
const loggerListenerPluginConfig = require('./logger.listener');
const reportPortalListenerPluginConfig = require('./report.portal.listener');

exports.PLUGIN_CONFIG = {
  AUTO_DELAY: { NAME: 'autoDelay', CONFIG: autoDelayPluginConfig },
  PUPPETEER_COVERAGE: { NAME: 'puppeteerCoverage', CONFIG: puppeteerCoveragePluginConfig },
  SCREENSHOT_ON_FAIL: { NAME: 'screenshotOnFail', CONFIG: screenshotOnFailPluginConfig },
  STEP_BY_STEP_REPORT: { NAME: 'stepByStepReport', CONFIG: stepByStepReportPluginConfig },
  LOGGER_LISTENER: { NAME: 'loggerListener', CONFIG: loggerListenerPluginConfig },
  REPORT_PORTAL_LISTENER: { NAME: 'reportPortalListener', CONFIG: reportPortalListenerPluginConfig }
};
