const { MochaListener } = require('./MochaListener');
const { Constant } = require('../helper');
const { LoggerHelper } = require('../../log4js');

const logger = new LoggerHelper('ReportAgentClient');
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
class MochaReportListener {
  constructor(reportAgent, suiteName, suiteDescription, suiteTags = [], parallel = false) {
    this.__runner = {};
    this.__configData = 'N/A';
    this.__currentSuiteStatus = [];
    this.__reportAgent = reportAgent;
    this.__parallel = parallel;
    this.__listener = new MochaListener();
    this.listen = this.listen.bind(this);
    this.end = this.end.bind(this);
    this.suiteStart = this.suiteStart.bind(this);
    this.suiteEnd = this.suiteEnd.bind(this);
    this.testStart = this.testStart.bind(this);
    this.testEnd = this.testEnd.bind(this);
    this.hookStart = this.hookStart.bind(this);
    this.hookEnd = this.hookEnd.bind(this);
    this.testPass = this.testPass.bind(this);
    this.testFail = this.testFail.bind(this);
    this.testPending = this.testPending.bind(this);
    this.start(suiteName, suiteDescription, suiteTags);
  }

  set runner(mochaRunner) {
    this.__runner = mochaRunner;
  }

  listen() {
    this.__listener.executionEnd(this.__runner, this.end);
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

  start(suiteName, suiteDescription, suiteTags = []) {
    if (this.__parallel) return;
    try {
      this.__reportAgent.sendTestItemRequest(
        {
          type: Constant.TEST_TYPE.SUITE,
          description: suiteDescription,
          name: suiteName,
          tags: suiteTags
        },
        true
      );
    } catch (error) {
      logger.error('Error in start launch ', error);
    }
  }

  async end() {
    if (this.__parallel) return;
    try {
      this.__reportAgent.sendTestItemRequest({}, false, true);
    } catch (error) {
      logger.error('Error in finish launch ', error);
    }
  }

  suiteStart(ctx) {
    const suiteDescription = `\n
    ## Name:\n** ${ctx.title} ** \n## File Location:\n** ${ctx.file} ** \n`;
    const isConfigSuite = ctx.title.includes('Config');
    if (!isConfigSuite) {
      this.__reportAgent.sendTestItemRequest(
        {
          type: Constant.TEST_TYPE.TEST,
          description: suiteDescription.toString(),
          name: ctx.title,
          tags: [ctx.title.split('_')[0]]
        },
        true
      );
    }
  }

  suiteEnd(ctx) {
    const isConfigSuite = ctx.title.includes('Config');
    if (!isConfigSuite) {
      const listTestsStatus = [...new Set(this.__currentSuiteStatus)];
      const status = getSuiteStatus(listTestsStatus);
      switch (status) {
        case Constant.TEST_STATUS.PASSED:
          this.__reportAgent.sendTestItemRequest(
            {
              status: Constant.TEST_STATUS.PASSED
            },
            false,
            false
          );
          break;
        case Constant.TEST_STATUS.FAILED:
          this.__reportAgent.sendTestItemRequest(
            {
              status: Constant.TEST_STATUS.FAILED
            },
            false,
            false
          );
          break;
        case Constant.TEST_STATUS.SKIPPED:
          this.__reportAgent.sendTestItemRequest(
            {
              status: Constant.TEST_STATUS.SKIPPED
            },
            false,
            false
          );
          break;
        default:
          break;
      }
      this.__configData = 'N/A';
      this.__currentSuiteStatus = [];
    }
  }

  testStart(ctx) {
    const isConfigSuite = ctx.parent.title.includes('Config');
    const suiteDescription = `\n## Name:\n** ${ctx.title} ** \n## File Location:\n** ${
      ctx.file
    } ** \n## Test Timeout: ${ctx._timeout}\n## Body:\n\`\`\`javacript\n ${ctx.body.toString()} \n\`\`\``;
    if (isConfigSuite) {
      this.__configData = ctx.body.toString();
    }
    if (ctx._currentRetry === 0 && !isConfigSuite) {
      this.__reportAgent.sendLogItemRequest({
        level: Constant.LOG_LEVEL.INFO,
        message: `!!!MARKDOWN_MODE!!!\n## STEP NAME:\n## ${ctx.title} `
      });
      this.__reportAgent.sendLogItemRequest({
        level: Constant.LOG_LEVEL.INFO,
        message: `!!!MARKDOWN_MODE!!!\n${suiteDescription.toString()}\n`
      });
      this.__reportAgent.sendLogItemRequest({
        level: Constant.LOG_LEVEL.DEBUG,
        message: `!!!MARKDOWN_MODE!!!\n## CONFIG DATA INFO: \n\`\`\`javacript\n${this.__configData}.\n\`\`\`\n`
      });
    } else {
      this.__reportAgent.sendLogItemRequest({
        level: Constant.LOG_LEVEL.WARN,
        message: `!!!MARKDOWN_MODE!!!\n## RETRIES FAILED STEP ${ctx._currentRetry.toString()} TIMES`
      });
    }
  }

  testEnd() {}

  hookStart() {}

  hookEnd() {}

  testPass(ctx) {
    const isConfigSuite = ctx.parent.title.includes('Config');
    if (!isConfigSuite) {
      this.__currentSuiteStatus.push(Constant.TEST_STATUS.PASSED);
      this.__reportAgent.sendLogItemRequest({
        level: Constant.LOG_LEVEL.INFO,
        message: '!!!MARKDOWN_MODE!!!\n## STEP PASSED'
      });
    }
  }

  testFail(ctx) {
    const errorMessage = ctx.err.message;
    const stackTrace = ctx.err.stack;
    const isConfigSuite = ctx.parent.title.includes('Config');
    if (!isConfigSuite) {
      this.__currentSuiteStatus.push(Constant.TEST_STATUS.FAILED);
      this.__reportAgent.sendLogItemRequest({
        level: Constant.LOG_LEVEL.ERROR,
        message: `!!!MARKDOWN_MODE!!!\n ** ${errorMessage} **`
      });
      this.__reportAgent.sendLogItemRequest({
        level: Constant.LOG_LEVEL.ERROR,
        message: `!!!MARKDOWN_MODE!!!\n ** ${stackTrace} **`
      });
      this.__reportAgent.sendLogItemRequest({
        level: Constant.LOG_LEVEL.INFO,
        message: '!!!MARKDOWN_MODE!!!\n## STEP FAILED'
      });
    }
  }

  testPending(ctx) {
    const suiteDescription = `\n## Name:\n** ${ctx.title} ** \n## File Location:\n** ${
      ctx.file
    } ** \n## Test Timeout: ${ctx._timeout}\n## Body:\n\`\`\`javacript\n ${ctx.body.toString()} \n\`\`\``;
    const isConfigSuite = ctx.parent.title.includes('Config');
    if (!isConfigSuite) {
      this.__currentSuiteStatus.push(Constant.TEST_STATUS.SKIPPED);
      this.__reportAgent.sendLogItemRequest({
        level: Constant.LOG_LEVEL.INFO,
        message: `!!!MARKDOWN_MODE!!!\n## STEP NAME:\n## ${ctx.title} `
      });
      this.__reportAgent.sendLogItemRequest({
        level: Constant.LOG_LEVEL.INFO,
        message: `!!!MARKDOWN_MODE!!!\n${suiteDescription.toString()}\n`
      });
      this.__reportAgent.sendLogItemRequest({
        level: Constant.LOG_LEVEL.INFO,
        message: '!!!MARKDOWN_MODE!!!\n## STEP SKIPPED'
      });
    }
  }
}

exports.MochaReportListener = MochaReportListener;
