const path = require('path');

const config = {
  require: `.${path.sep}core${path.sep}extension${path.sep}report.portal.listener.js`,
  uniqueFileName: true,
  enabled: true
};

module.exports = config;
