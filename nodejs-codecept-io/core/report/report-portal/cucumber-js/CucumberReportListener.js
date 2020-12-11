const { LoggerHelper } = require('../../log4js');
const { Constant, Utils } = require('../helper');
const isGenerator = require('is-generator');
const promisePoly = require('bluebird');

const logger = new LoggerHelper('CucumberReportListener');
const {
  After,
  Before,
  BeforeAll,
  AfterAll,
  setDefinitionFunctionWrapper
} = require('cucumber');

const CucumberReportListener = function cucumberListener(
  agent,
  suiteName = 'Default Suite',
  suiteDescription = 'Test Suite Run With Cucumber-JS'
) {
  const ignoreFunctionHook = [
    'beforeAllReportPortalHook',
    'beforeReportPortalHook',
    'afterReportPortalHook',
    'afterAllReportPortalHook'
  ];
  const dispatchAction = (func) => {
    try {
      return func();
    } catch (err) {
      logger.error(err);
      throw err;
    }
  };

  function wrapperStepFunction(func) {
    return async (...args) => {
      let fileObject = null;
      try {
        await func(...args);
        fileObject = await Utils.takeScreenshot();
        agent.logStepScreenShot(
          Constant.LOG_LEVEL.INFO,
          'Capture ScreenShot After Step',
          fileObject
        );
      } catch (err) {
        logger.error(err);
        fileObject = await Utils.takeScreenshot();
        agent.logStepInfo(Constant.LOG_LEVEL.ERROR, err.stack);
        agent.logStepScreenShot(
          Constant.LOG_LEVEL.ERROR,
          err.stack,
          fileObject
        );
        throw err;
      }
    };
  }

  function wraperFunction(func) {
    const funcName = func.name;
    if (ignoreFunctionHook.includes(funcName)) {
      return func;
    }
    return wrapperStepFunction(func);
  }

  async function wrapperAsyncStepFunction(func) {
    return async (...args) => {
      let fileObject = null;
      try {
        const result = await func(...args);
        fileObject = await Utils.takeScreenshot();
        agent.logStepScreenShot(
          Constant.LOG_LEVEL.INFO,
          'Capture ScreenShot After Step',
          fileObject
        );
        return Promise.resolve(result);
      } catch (err) {
        fileObject = await Utils.takeScreenshot();
        logger.error(err);
        agent.logStepInfo(Constant.LOG_LEVEL.ERROR, err.stack);
        agent.logStepScreenShot(
          Constant.LOG_LEVEL.ERROR,
          err.stack,
          fileObject
        );
        throw err;
      }
    };
  }

  function wrapperAsyncStepExecute(func) {
    const funcName = func.name;
    if (ignoreFunctionHook.includes(funcName)) {
      return func;
    }
    return wrapperAsyncStepFunction(func);
  }

  BeforeAll(function beforeAllReportPortalHook() {
    return dispatchAction(() => {
      agent.startLaunchCucumber();
      agent.startSuiteCucumber({
        name: suiteName,
        description: suiteDescription
      });
      return Promise.resolve();
    });
  });

  Before(function beforeReportPortalHook(scenario) {
    return dispatchAction(() => {
      agent.startScenarioCucumber(scenario);
    });
  });

  setDefinitionFunctionWrapper(function wrapperFunction(func) {
    if (isGenerator.fn(func)) {
      return promisePoly.coroutine(wrapperAsyncStepExecute(func));
    }
    if (func.constructor.name === 'AsyncFunction') {
      return wrapperAsyncStepExecute(func);
    }
    return wraperFunction(func);
  });

  After(function afterReportPortalHook(scenario) {
    return dispatchAction(() => {
      agent.endScenarioCucumber(scenario);
    });
  });

  AfterAll(function afterAllReportPortalHook() {
    return dispatchAction(() => {
      agent.endSuiteCucumber();
      return agent.endLaunchCucumber();
    });
  });
};

const CucumberReportHook = function cucumberReportHook(
  agent,
  suiteName = 'Default Suite',
  suiteDescription = 'Test Suite Run With Cucumber-JS'
) {
  if (!agent) {
    logger.error('Missing ReportAgent Object');
    throw new Error('Missing ReportAgent Object');
  }
  logger.info('AgentObject ', agent);
  return CucumberReportListener(agent, suiteName, suiteDescription);
};

exports.CucumberReportHook = CucumberReportHook;
