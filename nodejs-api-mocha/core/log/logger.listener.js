const path = require('path');
const { MochaListener } = require('../runner/listener');
const { LoggerManager } = require('./logger');
const { ReportHelper } = require('../helper/report.helper');
const { Constant } = require('../report');

const log = LoggerManager.createLogger('ExecutionLog');
const getSuiteStatus = (listTestsStatus) => {
  let status = Constant.TEST_STATUS.SKIPPED;
  const isEmptyList = listTestsStatus.length === 0;
  const hasFailedTests = listTestsStatus.includes(Constant.TEST_STATUS.FAILED);
  const hasSkippedTests = listTestsStatus.includes(Constant.TEST_STATUS.SKIPPED);
  const hasPassedTests = listTestsStatus.includes(Constant.TEST_STATUS.PASSED);
  if (isEmptyList) status = Constant.TEST_STATUS.CANCELLED;
  if (hasFailedTests) status = Constant.TEST_STATUS.FAILED;
  if (!hasFailedTests && hasPassedTests) status = Constant.TEST_STATUS.PASSED;
  if (hasSkippedTests && !hasFailedTests && !hasPassedTests) status = Constant.TEST_STATUS.SKIPPED;
  return status;
};
class LoggerListener {
  constructor() {
    this.__listener = new MochaListener();
    this.__runner = {};
    this.__log = {};
    this.__currentSuiteStatus = [];
    this.listen = this.listen.bind(this);
    this.suiteStart = this.suiteStart.bind(this);
    this.suiteEnd = this.suiteEnd.bind(this);
    this.testStart = this.testStart.bind(this);
    this.testEnd = this.testEnd.bind(this);
    this.hookStart = this.hookStart.bind(this);
    this.hookEnd = this.hookEnd.bind(this);
    this.testPass = this.testPass.bind(this);
    this.testFail = this.testFail.bind(this);
    this.testPending = this.testPending.bind(this);
  }

  set runner(mochaRunner) {
    this.__runner = mochaRunner;
  }

  listen() {
    this.__listener.startSuite(this.__runner, this.suiteStart);
    this.__listener.endSuite(this.__runner, this.suiteEnd);
    this.__listener.startTest(this.__runner, this.testStart);
    this.__listener.endTest(this.__runner, this.testEnd);
    this.__listener.hookStart(this.__runner, this.hookStart);
    this.__listener.hookEnd(this.__runner, this.hookEnd);
    this.__listener.testPass(this.__runner, this.testPass);
    this.__listener.testFail(this.__runner, this.testFail);
    this.__listener.testPending(this.__runner, this.testPending);
  }

  suiteStart(ctx) {
    const logKeyName = path.basename(ctx.file);
    this.__log = LoggerManager.createLogger(logKeyName);
    const logMessage = ['SUITE START EVENT', `Suite Name: ${ctx.title}`];
    ctx.tests.forEach((element) => {
      logMessage.push(`Suite Has: ${element.title}`);
      logMessage.push(`Type: ${element.type}`);
      logMessage.push(`File: ${element.file}`);
    });
    this.__sendLog(logMessage);
  }

  suiteEnd(ctx) {
    const isConfigSuite = ctx.title.includes('Config');
    if (!isConfigSuite) {
      const listTestsStatus = [...new Set(this.__currentSuiteStatus)];
      const status = getSuiteStatus(listTestsStatus);
      if (status === Constant.TEST_STATUS.FAILED) {
        ReportHelper.failedTestScripts = ctx.file;
      }
      this.__currentSuiteStatus = [];
    }
    const logMessage = ['SUITE END EVENT', `Suite Name: ${ctx.title}`];
    this.__sendLog(logMessage);
  }

  testStart(ctx) {
    const logMessage = ['TEST START EVENT', `Test Name: ${ctx.title}`, `File: ${ctx.file}`];
    this.__sendLog(logMessage);
  }

  testEnd(ctx) {
    const logMessage = [
      'TEST END EVENT',
      `Test Name: ${ctx.title}`,
      `File: ${ctx.file}`,
      `Status: ${ctx.state}`,
      `Duration: ${ctx.duration}`
    ];
    this.__sendLog(logMessage);
  }

  hookStart(ctx) {
    this.__sendLog(['HOOK START EVENT', `Hook name: ${ctx.title}`]);
  }

  hookEnd(ctx) {
    this.__sendLog(['HOOK END EVENT', `Hook name: ${ctx.title}`]);
  }

  testPass(ctx) {
    const isConfigSuite = ctx.parent.title.includes('Config');
    if (!isConfigSuite) {
      this.__currentSuiteStatus.push(Constant.TEST_STATUS.PASSED);
    }
    this.__sendLog(['TEST PASS EVENT', `Test name: ${ctx.title}`]);
  }
  testFail(ctx) {
    const isConfigSuite = ctx.parent.title.includes('Config');
    if (!isConfigSuite) {
      this.__currentSuiteStatus.push(Constant.TEST_STATUS.FAILED);
    }
    this.__sendLog(['TEST FAIL EVENT', `Test name: ${ctx.title}`]);
  }
  testPending(ctx) {
    const isConfigSuite = ctx.parent.title.includes('Config');
    if (!isConfigSuite) {
      this.__currentSuiteStatus.push(Constant.TEST_STATUS.SKIPPED);
    }
    this.__sendLog(['TEST PENDING EVENT', `Test name: ${ctx.title}`]);
  }

  __sendLog(listLogMessage) {
    if (this.__log instanceof Function) this.__log.debug(listLogMessage.join('\n'));
    log.debug(listLogMessage.join('\n'));
  }
}

exports.LoggerListener = LoggerListener;
