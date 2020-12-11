const { LoggerHelper } = require('../report/log4js');

class Logger {
  constructor(placeHolder) {
    this.logger = new LoggerHelper(placeHolder);
  }

  info(msg, ...arg) {
    this.logger.info(msg, ...arg);
  }

  debug(msg, ...arg) {
    this.logger.debug(msg, ...arg);
  }

  warn(msg, ...arg) {
    this.logger.warn(msg, ...arg);
  }

  error(msg, ...arg) {
    this.logger.error(msg, ...arg);
  }
}
const loggerInstance = {};
let currentLoggerInstaceTest = new Logger('ExecutionLog');
class LoggerManager {
  constructor() {
    throw new Error('Cannot construct singleton');
  }

  static createLogger(key) {
    loggerInstance[key] = new Logger(key);
    currentLoggerInstaceTest = new Logger(key);
  }

  static getLogger(key) {
    if (!(key in loggerInstance)) {
      this.createLogger(key);
    }
    return loggerInstance[key];
  }

  static info(key, msg, ...arg) {
    key && loggerInstance[key].info(msg, ...arg);
    currentLoggerInstaceTest.info(msg, ...arg);
  }

  static debug(key, msg, ...arg) {
    key && loggerInstance[key].debug(msg, ...arg);
    currentLoggerInstaceTest.debug(msg, ...arg);
  }

  static warn(key, msg, ...arg) {
    key && loggerInstance[key].warn(msg, ...arg);
    currentLoggerInstaceTest.warn(msg, ...arg);
  }

  static error(key, msg, ...arg) {
    key && loggerInstance[key].error(msg, ...arg);
    currentLoggerInstaceTest.error(msg, ...arg);
  }
}

exports.LoggerManager = LoggerManager;
exports.Logger = Logger;
