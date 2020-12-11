const JSON = require('circular-json');
const { Listener } = require('../listener/base.listener');
const { FileUtils } = require('../utils/file.utils');
const { LoggerManager } = require('../log');

module.exports = function loggerListener() {
  Listener.BEFORE_ALL(async (ctx) => {
    LoggerManager.createLogger('ExecutionLog');
    LoggerManager.debug('ExecutionLog', 'BEFORE_ALL:\n', JSON.stringify(ctx));
    ctx.startTime = new Date().getTime();
  });

  Listener.BEFORE_SUITE((suite) => {
    LoggerManager.createLogger(FileUtils.createTestScriptLogFileName(suite.file));
    LoggerManager.debug(null, 'BEFORE_SUITE:\n', `${suite.title} in ${suite.file}`);
  });

  Listener.BEFORE_TEST((test) => {
    LoggerManager.debug(null, 'BEFORE_TEST:\n', `${test.title} in ${test.file} \nSource Code:\n${test.body}`);
  });

  Listener.TEST_START((test) => {
    LoggerManager.debug(null, 'TEST_START:\n', `${test.title} in ${test.file} \nSource Code:\n${test.body}`);
  });

  Listener.STEP_FINISHED((step) => {
    if (step.status === 'success') {
      LoggerManager.debug(
        null,
        'STEP_FINISHED:\n',
        `${step.actor} ${step.name} with arguments ${JSON.stringify(step.args)}: ${step.status} in ${step.endTime
          - step.startTime} ms \n${step.line()}`
      );
    } else {
      LoggerManager.warn(
        null,
        'STEP_FINISHED:\n',
        `${step.actor} ${step.name} with arguments ${JSON.stringify(step.args)}: ${step.status} in ${step.endTime
          - step.startTime} ms \n${step.line()}`
      );
    }
  });

  Listener.TEST_PASSED((test) => {
    LoggerManager.debug(null, 'TEST_PASSED:\n', `${test.title} in ${test.file} \nSource Code:\n${test.body}`);
  });

  Listener.TEST_FAILED((test, error) => {
    LoggerManager.error(null, 'TEST_FAILED:\n', `${test.title} in ${test.file} \nSource Code:\n${test.body}`);
    LoggerManager.error(null, 'TEST_FAILED:\n', `Error stacktrace: \n${Listener.getTestFailedStackMsg(test, error)}`);
  });

  Listener.TEST_FINISHED((test) => {
    LoggerManager.debug(
      null,
      'TEST_FINISHED:\n',
      `${test.title} in ${test.file} is ${test.state}\nSource Code:\n${test.body}`
    );
    LoggerManager.debug(
      null,
      'TEST_FINISHED:\n',
      `Error stacktrace: \n${Listener.getTestFailedStackMsg(test, test.err)}`
    );
  });
  Listener.AFTER_SUITE((suite) => {
    LoggerManager.debug(null, 'AFTER_SUITE:\n', `${suite.title} in ${suite.file}`);
  });
  Listener.AFTER_ALL((ctx) => {
    ctx.endTime = new Date().getTime();
    LoggerManager.debug('ExecutionLog', 'AFTER_ALL:\n', JSON.stringify(ctx));
    LoggerManager.debug('ExecutionLog', 'AFTER_ALL:\n', (ctx.endTime - ctx.startTime) / (1000 * 60), ' mins');
  });

  Listener.ALL_RESULT((...args) => {
    LoggerManager.debug('ExecutionLog', 'ALL_RESULT:\n', ...args);
  });
};
