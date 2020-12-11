const Logger = require('../report/log4js').LoggerHelper;

const loggerInstance = new Map();
let currentLoggerInstaceTest = new Logger('ExecutionLog');
class LoggerManager {
  constructor() {
    throw new Error('Cannot construct singleton');
  }

  static clearAllLoggerInstance() {
    loggerInstance.clear();
  }

  static clearLoggerInstance(key) {
    loggerInstance.delete(key);
  }

  static createLogger(key) {
    const log = new Logger(key);
    loggerInstance.set(key, log);
    currentLoggerInstaceTest = log;
    return log;
  }

  static getLogger(key) {
    if (loggerInstance.has(key))
      throw new Error(`Logger does not have log for ${key}. Current log ${Array.from(loggerInstance.keys())}`);
    return loggerInstance.get(key);
  }

  static info(key, msg, ...arg) {
    // if (key) {
    //   loggerInstance.get(key).info(msg, ...arg);
    //   return;
    // }
    // currentLoggerInstaceTest.info(msg, ...arg);
  }
  static debug(key, msg, ...arg) {
    // if (key) {
    //   loggerInstance.get(key).debug(msg, ...arg);
    //   return;
    // }
    // currentLoggerInstaceTest.debug(msg, ...arg);
  }
  static warn(key, msg, ...arg) {
    // if (key) {
    //   loggerInstance.get(key).warn(msg, ...arg);
    //   return;
    // }
    // currentLoggerInstaceTest.warn(msg, ...arg);
  }
  static error(key, msg, ...arg) {
    // if (key) {
    //   loggerInstance.get(key).error(msg, ...arg);
    //   return;
    // }
    // currentLoggerInstaceTest.error(msg, ...arg);
  }
}

exports.LoggerManager = LoggerManager;
exports.Logger = Logger;
