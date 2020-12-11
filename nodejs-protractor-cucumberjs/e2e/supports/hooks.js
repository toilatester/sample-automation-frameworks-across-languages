'use strict';

const {
  After,
  defineParameterType,
  setDefaultTimeout,
  Status,
  Before,
  BeforeAll,
  AfterAll,
} = require('cucumber');
let cucumberRPAgent = require('../../helper/report-portal/cucumber-js/CucumberReportportalReporter');
const DEFAULT_TIMEOUT = 60000;

cucumberRPAgent();
