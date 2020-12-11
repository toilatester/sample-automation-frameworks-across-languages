const config = require('./config');
const constant = require('./constant');
const extension = require('./extension');
const helper = require('./helper');
const log = require('./log');
const report = require('./report');
const runner = require('./runner');
const utils = require('./utils');
const assert = require('./assert');

/**
 * We can't export all modules in the base folder
 * because when we requiring this file in the main index.js file(execute wrapper for this framework),
 * The global actor and helper function in codecept.io are still not initialized.
 * It leads to an undefined error in the page object classes
 */
module.exports = {
  ...constant,
  ...extension,
  ...config,
  ...helper,
  ...log,
  ...report,
  ...runner,
  ...utils,
  ...assert
};
