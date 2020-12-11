const path = require("path");
const {
  Log4jsReportPortal,
  LoggerHelper
} = require('../log4js')
const {
  JasmineReportportalAgent
} = require('./jasmine/');
const reportConfig = require('./config/reportportal.json');
const JasmineAgent = new JasmineReportportalAgent(reportConfig);
const JasmineAgentReportPortalListener = JasmineAgent.getJasmineReporter();

const log4jsRPInstance = new Log4jsReportPortal(JasmineAgent, JasmineAgentReportPortalListener)
const Log4jsReportPortalAppender = path.join(__dirname, "index.js")

Object.freeze(log4jsRPInstance)
Object.freeze(JasmineAgent);
Object.freeze(JasmineAgentReportPortalListener);

exports.configure = log4jsRPInstance.configure;
exports.Log4jsReportPortal = Log4jsReportPortal
exports.JasmineAgent = JasmineAgent;
exports.JasmineAgentReportPortalListener = JasmineAgentReportPortalListener;
exports.LoggerHelper = LoggerHelper;
exports.Log4jsReportPortalAppender = Log4jsReportPortalAppender;