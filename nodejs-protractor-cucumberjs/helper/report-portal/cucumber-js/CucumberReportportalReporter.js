"use strict";
const reportConfig = require('../config/reportportal.json');
const {
  CucumberReportportalAgent
} = require('./ReportPortalAgent');
const {
  Constant
} = require('../helper');
const isGenerator = require('is-generator');
const Promise = require('bluebird');
const agent = new CucumberReportportalAgent(reportConfig);

const {
  After,
  Before,
  BeforeAll,
  AfterAll,
  setDefinitionFunctionWrapper

} = require("cucumber");

const hook = function (suiteName, suiteDescription) {
  const ignoreFunctionHook = ['beforeAllReportPortalHook', 'beforeReportPortalHook',
    'afterReportPortalHook', 'afterAllReportPortalHook'
  ]
  BeforeAll(function beforeAllReportPortalHook() {
    console.log("Before all");
    agent.startLaunch();
    agent.startSuite({
      description: "suite.description",
      name: "suite.fullName",
      type: Constant.TEST_TYPE.SUITE
    })
    return Promise.resolve();
  })

  Before(function beforeReportPortalHook(scenario) {
    console.log("before");
    agent.startTest({
      description: "test.description",
      name: "test.fullName",
      type: Constant.TEST_TYPE.TEST
    });
  })


  setDefinitionFunctionWrapper(function (func, ...args) {
    if (isGenerator.fn(func)) {
      return Promise.coroutine(wrapperAsyncStepExecute(func));
    }
    if (func.constructor.name === 'AsyncFunction') {
      return wrapperAsyncStepExecute(func);
    }
    return wraperFunction(func, ...args);
  });

  function wraperFunction(func) {
    const funcName = func.name;
    if (ignoreFunctionHook.includes(funcName)) {
      return func;
    }
    return wrapperStepFunction(func);
  }

  function wrapperStepFunction(func) {
    return (...args) => {
      try {
        console.log("before step action")
        func(...args);
        console.log("after step action")
      } catch (err) {
        throw err;
      }
    }
  }

  function wrapperAsyncStepExecute(func) {
    const funcName = func.name;
    if (ignoreFunctionHook.includes(funcName)) {
      return func;
    }
    return wrapperAsyncStepFunction(func);
  }

  async function wrapperAsyncStepFunction(func) {
    return async (...args) => {
      try {
        console.log("before step action")
        const result = await func(...args);
        console.log("after step action")
        return Promise.resolve(result);
      } catch (err) {
        throw err;
      }
    }
  }


  After(function afterReportPortalHook(scenario) {
    console.log("After");
    agent.logStepInfo({
      level: Constant.LOG_LEVEL.INFO,
      message: JSON.stringify(scenario)
    }, agent.getReportPortalObject().getTestItemsId());
    agent.finishTest({
      status: Constant.TEST_STATUS.PASSED
    });
  });

  AfterAll(function afterAllReportPortalHook() {
    console.log('AfterAll')
    console.log('complete suite')
    agent.finishSuite({
      status: Constant.TEST_STATUS.PASSED
    });
    console.log('complete launch')
    agent.finishLaunch({
      status: Constant.TEST_STATUS.PASSED
    });
    return agent.finishAllLaunchPromise().then(_ => {
      return Promise.resolve();
    })
  })
}

module.exports = hook;