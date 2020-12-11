/**
 * :D I'm MH
 * :D I'm MH
 * :D I'm MH
 * :D I'm MH
 */
const JSON = require('circular-json');
const { Constant } = require('../helper');
const { Listener } = require('./CodeceptListener');

/**
 * ReportPortal listener function. This function will hold all requests in an array
 * and we will use a codecept.io helper engine to dispatch all data requests
 */
function reportPortalListener(agent, isDebugMode = false) {
  // Check if parameter is function which returns isDebugMode value
  if (isDebugMode instanceof Function) isDebugMode = isDebugMode();
  if (!isDebugMode) {
    const ReportPortalHelper = agent;

    Listener.BEFORE_SUITE((suite) => {
      const suiteDescription = `\n
    ## Name:\n** ${suite.title} ** \n## File Location:\n** ${suite.file} ** \n`;
      ReportPortalHelper.sendTestItemRequest(
        ReportPortalHelper.defaultReportStoreKey,
        {
          type: Constant.TEST_TYPE.SUITE,
          description: suiteDescription.toString(),
          name: suite.title,
          tags: [suite.title.split('_')[0]]
        },
        true
      );
    });

    Listener.TEST_START((test) => {
      const suiteDescription = `\n
    ## Name:\n** ${test.title} ** \n## File Location:\n** ${test.file} ** \n## Test Timeout: ${
  test._timeout
}\n## Body:\n\`\`\`javacript\n ${test.body.toString()} \n\`\`\``;
      if (test.retryNum === 0) {
        ReportPortalHelper.sendTestItemRequest(
          ReportPortalHelper.defaultReportStoreKey,
          {
            type: Constant.TEST_TYPE.TEST,
            description: suiteDescription.toString(),
            name: test.title,
            tags: [test.title.split('_')[0]]
          },
          true
        );
      }
    });

    Listener.STEP_FINISHED(async (step) => {
      if (step.status === 'success') {
        ReportPortalHelper.sendLogItemRequest(ReportPortalHelper.defaultReportStoreKey, {
          level: Constant.LOG_LEVEL.DEBUG,
          message: `!!!MARKDOWN_MODE!!!\n## STEP DONE:\n${step.actor} ${
            step.name
          } with arguments \n\`\`\`javacript\n ${JSON.stringify(step.args)} \n\`\`\`\nStatus: ${
            step.status
          } in ${step.endTime - step.startTime} ms \n${step.line()}`
        });
      } else {
        ReportPortalHelper.sendLogItemRequest(ReportPortalHelper.defaultReportStoreKey, {
          level: Constant.LOG_LEVEL.WARN,
          message: `!!!MARKDOWN_MODE!!!\n## STEP DONE:\n${step.actor} ${
            step.name
          } with arguments \n\`\`\`javacript\n ${JSON.stringify(step.args)} \n\`\`\`\nStatus: ${
            step.status
          } in ${step.endTime - step.startTime} ms \n${step.line()}`
        });
      }
    });

    Listener.TEST_PASSED(() => {
      ReportPortalHelper.sendTestItemRequest(
        ReportPortalHelper.defaultReportStoreKey,
        {
          status: Constant.TEST_STATUS.PASSED
        },
        false,
        false
      );
    });

    Listener.TEST_FAILED((test, error) => {
      if (test._retries === test.retryNum) {
        ReportPortalHelper.sendLogItemRequest(ReportPortalHelper.defaultReportStoreKey, {
          level: Constant.LOG_LEVEL.ERROR,
          message: `!!!MARKDOWN_MODE!!!\n## ERROR:\n ${Listener.getTestFailedStackMsg(test, error)} `
        });
        ReportPortalHelper.sendTestItemRequest(
          ReportPortalHelper.defaultReportStoreKey,
          {
            status: Constant.TEST_STATUS.FAILED
          },
          false,
          false
        );
      } else {
        ReportPortalHelper.sendLogItemRequest(ReportPortalHelper.defaultReportStoreKey, {
          level: Constant.LOG_LEVEL.WARN,
          message: `!!!MARKDOWN_MODE!!!\n## RETRY TEST: ${test.retryNum + 1} times\n## STEP NAME:\n## ${
            test.title
          }\n## ERROR:\n ${Listener.getTestFailedStackMsg(test, error)} `
        });
      }
    });

    Listener.AFTER_SUITE(() => {
      ReportPortalHelper.sendTestItemRequest(ReportPortalHelper.defaultReportStoreKey, {}, false, true);
    });
  }
}

function codeceptHook(bootstrapFunction, tearDownFunction, bootstrapAllFunction, teardownAllFunction) {
  return {
    bootstrap: async (done) => {
      await bootstrapFunction();
      done();
    },
    teardown: async (done) => {
      await tearDownFunction();
      done();
    },
    bootstrapAll: async (done) => {
      await bootstrapAllFunction();
      done();
    },
    teardownAll: async (done) => {
      await teardownAllFunction();
      done();
    }
  };
}

exports.CodeceptReportListener = reportPortalListener;
exports.CodeceptCompleteLaunchHook = codeceptHook;
