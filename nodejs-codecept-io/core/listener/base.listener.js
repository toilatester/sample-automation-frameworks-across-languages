/* eslint-disable max-len,mocha/no-mocha-arrows*/

const { event, recorder } = require('codeceptjs/lib');

const runnerEventCreator = (eventType) => {
  return (func) => event.dispatcher.on(eventType, async (...args) => {
    await func(...args);
  });
};

/**
 * Add listener method to promise chain
 * Make sure it can be run in sync
 */
const recorderHookEventFunction = (func, name, ...data) => {
  recorder.add(
    name,
    async () => {
      await func(...data);
    },
    true
  );
};
/**
 *
 * @param {Function} func
 * @param  {...any} args
 *
 * Add callback function to event listener
 * Ex: Below is sample function to print all data
 * before all test execution
 * beforeAllEvent((...args) => {
 *  console.log(...args);
 * })
 */
const beforeAllEvent = (func, name) => runnerEventCreator(event.all.before)((...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const afterAllEvent = (func, name) => runnerEventCreator(event.all.after)((...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const allResultEvent = (func, name) => runnerEventCreator(event.all.result)(async (...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const beforeSuiteEvent = (func, name) => runnerEventCreator(event.suite.before)((...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const afterSuiteEvent = (func, name) => runnerEventCreator(event.suite.after)((...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const beforeTestEvent = (func, name) => runnerEventCreator(event.test.before)((...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const testStartEvent = (func, name) => runnerEventCreator(event.test.started)((...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const testPassedEvent = (func, name) => runnerEventCreator(event.test.passed)((...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const testFailedEvent = (func, name) => runnerEventCreator(event.test.failed)((...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const testFinishedEvent = (func, name) => runnerEventCreator(event.test.finished)(async (...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const afterTestEvent = (func, name) => runnerEventCreator(event.test.after)((...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const beforeStepEvent = (func, name) => runnerEventCreator(event.step.before)(async (...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const stepStartEvent = (func) => runnerEventCreator(event.step.started)(async (...callbackArgs) => {
  await func(...callbackArgs);
});
const stepPassedEvent = (func, name) => runnerEventCreator(event.step.passed)((...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const stepFailedEvent = (func, name) => runnerEventCreator(event.step.failed)((...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const stepFinishedEvent = (func) => runnerEventCreator(event.step.finished)(async (...callbackArgs) => {
  await func(...callbackArgs);
});
const afterStepEvent = (func, name) => runnerEventCreator(event.step.after)((...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const hookStartEvent = (func, name) => runnerEventCreator(event.hook.started)((...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const hookPassedEvent = (func, name) => runnerEventCreator(event.hook.passed)((...callbackArgs) => {
  recorderHookEventFunction(func, name, ...callbackArgs);
});
const getTestFailedStackMsg = (test, error) => {
  if (test.state === 'passed') return 'Test Passed and does not have stracktrace';
  const steps = test.steps || test.ctx.test.steps;
  if (steps && steps.length) {
    let scenarioTrace = '';
    steps.reverse().forEach((step) => {
      const line = `- ${step.toCode()} ${step.line()}`;
      scenarioTrace += `\n${line}`;
    });
    return `Exception Message [${error.message}]\nScenario Steps:\n${scenarioTrace}`;
  }
  return `Exception Message [${error.message}]\nStack Trace:\n${error.stack || test.error.stack}`;
};

exports.Listener = {
  BEFORE_ALL: beforeAllEvent,
  AFTER_ALL: afterAllEvent,
  ALL_RESULT: allResultEvent,
  BEFORE_SUITE: beforeSuiteEvent,
  AFTER_SUITE: afterSuiteEvent,
  BEFORE_TEST: beforeTestEvent,
  TEST_START: testStartEvent,
  TEST_PASSED: testPassedEvent,
  TEST_FAILED: testFailedEvent,
  TEST_FINISHED: testFinishedEvent,
  AFTER_TEST: afterTestEvent,
  BEFORE_STEP: beforeStepEvent,
  STEP_START: stepStartEvent,
  STEP_PASSED: stepPassedEvent,
  STEP_FAILED: stepFailedEvent,
  STEP_FINISHED: stepFinishedEvent,
  AFTER_STEP: afterStepEvent,
  HOOK_START: hookStartEvent,
  HOOK_PASSED: hookPassedEvent,
  getTestFailedStackMsg
};
