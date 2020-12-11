const mochaMultiReport = require('./mocha.config').config;

exports.REPORT_CONFIG = {
  MOCHA_MULTI: { NAME: 'mocha-multi-reporters', CONFIG: mochaMultiReport }
};
