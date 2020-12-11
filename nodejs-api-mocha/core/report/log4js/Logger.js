const log4js = require('log4js');

class LoggerHelper {
  constructor(placeHolder) {
    this.logger = log4js.getLogger(placeHolder);
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

exports.LoggerHelper = LoggerHelper;
